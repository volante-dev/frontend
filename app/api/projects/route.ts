import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const GET = async () => {
  const projects = await prisma.project.findMany({
    where: { publishedAt: { not: null } },
    orderBy: [{ featured: "desc" }, { order: "asc" }, { publishedAt: "desc" }],
  });
  return NextResponse.json(projects);
};
