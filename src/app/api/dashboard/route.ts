import { NextResponse } from "next/server";
import { getDashboardData } from "@/lib/dashboard/getDashboardData";

export async function GET() {
  try {
    const data = await getDashboardData();
    return NextResponse.json({ status: "ok", data });
  } catch (e) {
    return NextResponse.json(
      {
        status: "error",
        message: e instanceof Error ? e.message : "Failed to load dashboard",
      },
      { status: 500 },
    );
  }
}
