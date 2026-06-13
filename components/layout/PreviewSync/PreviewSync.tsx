"use client";

import { useEffect } from "react";
import { PREVIEW_COOKIE, PREVIEW_STORAGE_KEY } from "@/lib/preview";

const getCookieValue = (name: string): string | undefined =>
  document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1];

const PreviewSync = () => {
  useEffect(() => {
    if (getCookieValue(PREVIEW_COOKIE) === "true") {
      localStorage.setItem(PREVIEW_STORAGE_KEY, "true");
    }
  }, []);

  return null;
};

export default PreviewSync;
