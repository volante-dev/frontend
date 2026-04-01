import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const GET = async () => {
  const services = await prisma.service.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });
  return NextResponse.json(services);
};
