import { prisma } from "@/lib/db";
import { deriveVersionSource, inferPromptStatus } from "@/lib/versions/source";
import type { PromptDetail, VersionRow } from "@/lib/versions/types";

function mapVersion(v: {
  id: string;
  version: number;
  name: string;
  body: string;
  notes: string | null;
  createdAt: Date;
}): VersionRow {
  return {
    id: v.id,
    version: v.version,
    name: v.name,
    body: v.body,
    notes: v.notes,
    createdAt: v.createdAt.toISOString(),
    source: deriveVersionSource(v.notes, v.name),
    charCount: v.body.length,
  };
}

export async function getPromptDetail(userId: string, promptId: string): Promise<PromptDetail | null> {
  const prompt = await prisma.prompt.findFirst({
    where: { id: promptId, userId },
    include: {
      versions: { orderBy: { version: "desc" } },
    },
  });

  if (!prompt) return null;

  const versions = prompt.versions.map(mapVersion);
  const latest = versions[0];

  return {
    id: prompt.id,
    title: prompt.title,
    category: prompt.category,
    body: prompt.body,
    createdAt: prompt.createdAt.toISOString(),
    updatedAt: prompt.updatedAt.toISOString(),
    status: inferPromptStatus(
      versions.length,
      latest?.notes ?? null,
      latest?.name ?? "",
    ),
    versions,
  };
}

export async function restorePromptVersion(
  userId: string,
  promptId: string,
  versionId: string,
) {
  const prompt = await prisma.prompt.findFirst({ where: { id: promptId, userId } });
  if (!prompt) throw new Error("Prompt not found");

  const version = await prisma.promptVersion.findFirst({
    where: { id: versionId, promptId },
  });
  if (!version) throw new Error("Version not found");

  const agg = await prisma.promptVersion.aggregate({
    where: { promptId },
    _max: { version: true },
  });
  const nextVersion = (agg._max.version ?? 0) + 1;

  const created = await prisma.promptVersion.create({
    data: {
      promptId,
      version: nextVersion,
      name: `v${nextVersion} — restored`,
      body: version.body,
      notes: `Restored from version ${version.version}`,
    },
  });

  await prisma.prompt.update({
    where: { id: promptId },
    data: { body: version.body },
  });

  return { version: nextVersion, versionId: created.id };
}

export async function duplicatePromptVersion(
  userId: string,
  promptId: string,
  versionId: string,
) {
  const prompt = await prisma.prompt.findFirst({ where: { id: promptId, userId } });
  if (!prompt) throw new Error("Prompt not found");

  const version = await prisma.promptVersion.findFirst({
    where: { id: versionId, promptId },
  });
  if (!version) throw new Error("Version not found");

  const newPrompt = await prisma.prompt.create({
    data: {
      userId,
      title: `Copy of ${prompt.title}`,
      body: version.body,
      category: prompt.category,
    },
  });

  await prisma.promptVersion.create({
    data: {
      promptId: newPrompt.id,
      version: 1,
      name: "v1 — duplicated",
      body: version.body,
      notes: `Duplicated from "${prompt.title}" version ${version.version}`,
    },
  });

  return {
    promptId: newPrompt.id,
    title: newPrompt.title,
  };
}
