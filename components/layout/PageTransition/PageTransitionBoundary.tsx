"use client";

import { ViewTransition } from "react";

const TransitionSurface = ({ children }: { children: React.ReactNode }) => (
  <div className="page-transition-surface">{children}</div>
);

const PageTransitionBoundary = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <>
      <ViewTransition default="none">
        <TransitionSurface>{children}</TransitionSurface>
      </ViewTransition>
    </>
  );
};

export default PageTransitionBoundary;
