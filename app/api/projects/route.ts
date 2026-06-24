import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const inferMediaTypeFromUrl = (value: string) =>
  /\.(mp4|mov|webm)(?:[?#].*)?$/i.test(value) ? "VIDEO" : "IMAGE";

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
      imageAsset: { select: { mediaType: true, posterUrl: true } },
      deliveredServiceEntries: { orderBy: { label: "asc" } },
    },
  });
  return NextResponse.json(
    projects.map(
      ({
        sectorEntry,
        locationEntry,
        imageAsset,
        deliveredServiceEntries,
        ...project
      }) => ({
        ...project,
        sector: sectorEntry?.label ?? null,
        sectorEn: sectorEntry?.labelEn ?? null,
        projectLocation: locationEntry?.label ?? null,
        projectLocationEn: locationEntry?.labelEn ?? null,
        coverMediaType: imageAsset?.mediaType ?? inferMediaTypeFromUrl(project.imageUrl),
        coverPosterUrl: imageAsset?.posterUrl ?? null,
        deliveredServices: deliveredServiceEntries.map((entry) => entry.label),
        deliveredServicesEn: deliveredServiceEntries.map((entry) => entry.labelEn),
      }),
    ),
  );
};
