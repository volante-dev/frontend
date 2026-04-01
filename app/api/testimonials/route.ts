import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const GET = async () => {
  const testimonials = await prisma.testimonial.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });
  return NextResponse.json(testimonials);
};
