import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const GET = async () => {
  const projects = await prisma.project.findMany({
    where: { publishedAt: { not: null } },
    orderBy: [
      { portfolioOrder: "asc" },
      { publishedAt: "asc" },
      { id: "asc" },
    ],
  });
  return NextResponse.json(projects);
};
