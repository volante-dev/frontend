import { NextResponse } from "next/server";

export const GET = () => {
  const configuredKey = process.env.INDEXNOW_KEY;

  if (!configuredKey) {
    return new NextResponse("Not found", { status: 404 });
  }

  return new NextResponse(configuredKey, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
