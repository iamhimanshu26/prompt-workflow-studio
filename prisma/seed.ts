import {
  AiModelId,
  PrismaClient,
  PromptCategory,
  WorkflowStepType,
} from "@prisma/client";

const prisma = new PrismaClient();

const DEMO_USER_ID = "demo-user-001";

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "demo@promptstudio.local" },
    update: { name: "Demo User" },
    create: {
      id: DEMO_USER_ID,
      email: "demo@promptstudio.local",
      name: "Demo User",
    },
  });

  await prisma.promptRun.deleteMany({ where: { userId: user.id } });
  await prisma.evaluation.deleteMany({ where: { userId: user.id } });
  await prisma.workflowStep.deleteMany({
    where: { workflow: { userId: user.id } },
  });
  await prisma.workflow.deleteMany({ where: { userId: user.id } });
  await prisma.promptVersion.deleteMany({
    where: { prompt: { userId: user.id } },
  });
  await prisma.prompt.deleteMany({ where: { userId: user.id } });

  const resumePrompt = await prisma.prompt.create({
    data: {
      userId: user.id,
      title: "Resume bullet rewriter",
      body: "Rewrite these resume bullets to be impact-focused with metrics.",
      category: PromptCategory.RESUME,
      isTemplate: true,
      isFavorite: true,
      versions: {
        create: [
          {
            version: 1,
            name: "v1 — initial",
            body: "Rewrite these resume bullets to be impact-focused with metrics.",
            notes: "Baseline",
          },
          {
            version: 2,
            name: "v2 — structured",
            body:
              "You are a senior recruiter. Rewrite each bullet using STAR format. Max 22 words per bullet. Quantify impact.",
            notes: "Added role + constraints",
          },
        ],
      },
    },
    include: { versions: true },
  });

  const interviewPrompt = await prisma.prompt.create({
    data: {
      userId: user.id,
      title: "Behavioral interview prep",
      body: "Generate 5 behavioral questions for a {role} at {company}.",
      category: PromptCategory.INTERVIEW,
      isTemplate: true,
    },
  });

  const run1 = await prisma.promptRun.create({
    data: {
      userId: user.id,
      promptId: resumePrompt.id,
      promptText: resumePrompt.body,
      category: PromptCategory.RESUME,
      modelId: AiModelId.GPT,
      responseText:
        "[Mock] Improved bullets with metrics placeholders for your experience section.",
      tokenInput: 120,
      tokenOutput: 340,
      latencyMs: 890,
    },
  });

  await prisma.evaluation.create({
    data: {
      userId: user.id,
      promptRunId: run1.id,
      clarity: 88,
      structure: 85,
      accuracy: 82,
      usefulness: 90,
      hallucinationRisk: 12,
      totalScore: 87,
      summary: "Strong structure; verify metrics against source resume.",
    },
  });

  await prisma.promptRun.create({
    data: {
      userId: user.id,
      promptId: interviewPrompt.id,
      promptText: interviewPrompt.body,
      category: PromptCategory.INTERVIEW,
      modelId: AiModelId.CLAUDE,
      responseText: "[Mock] Five STAR-format questions tailored to role and company.",
      tokenInput: 95,
      tokenOutput: 280,
      latencyMs: 720,
    },
  });

  const workflow = await prisma.workflow.create({
    data: {
      userId: user.id,
      name: "JD → Interview → Follow-up",
      description: "Example hiring workflow (Phase 8 UI)",
      steps: {
        create: [
          { order: 1, stepType: WorkflowStepType.INPUT, label: "Job description text" },
          { order: 2, stepType: WorkflowStepType.PROMPT, label: "Resume match analysis" },
          { order: 3, stepType: WorkflowStepType.AI_RESPONSE, label: "Gap summary" },
          { order: 4, stepType: WorkflowStepType.PROMPT, label: "Interview question generator" },
          { order: 5, stepType: WorkflowStepType.EVALUATION, label: "Score question set" },
          { order: 6, stepType: WorkflowStepType.SAVE_RESULT, label: "Save to library" },
        ],
      },
    },
  });

  console.log("Seed complete:", {
    user: user.email,
    prompts: 2,
    versions: 2,
    runs: 2,
    workflow: workflow.name,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
