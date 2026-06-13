"use client";

import dynamic from "next/dynamic";

const OpeningSequence = dynamic(() => import("./OpeningSequence"), { ssr: false });

export default OpeningSequence;
