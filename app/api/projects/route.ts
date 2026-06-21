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
    include: {
      sectorEntry: true,
      locationEntry: true,
      deliveredServiceEntries: { orderBy: { label: "asc" } },
    },
  });
  return NextResponse.json(
    projects.map(
      ({ sectorEntry, locationEntry, deliveredServiceEntries, ...project }) => ({
        ...project,
        sector: sectorEntry?.label ?? null,
        sectorEn: sectorEntry?.labelEn ?? null,
        projectLocation: locationEntry?.label ?? null,
        projectLocationEn: locationEntry?.labelEn ?? null,
        deliveredServices: deliveredServiceEntries.map((entry) => entry.label),
        deliveredServicesEn: deliveredServiceEntries.map((entry) => entry.labelEn),
      }),
    ),
  );
};
