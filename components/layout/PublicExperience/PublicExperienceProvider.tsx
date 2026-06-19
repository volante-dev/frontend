"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const INTRO_CLASS = "volante-intro-enabled";
const INTRO_SESSION_KEY = "volante-intro-played";

type PublicExperienceContextValue = {
  introActive: boolean;
  completeIntro: () => void;
};

const PublicExperienceContext =
  createContext<PublicExperienceContextValue | null>(null);

export const usePublicExperience = () => {
  const value = useContext(PublicExperienceContext);
  if (!value) {
    throw new Error(
      "usePublicExperience must be used inside PublicExperienceProvider.",
    );
  }
  return value;
};

const PublicExperienceProvider = ({
  initialHome,
  children,
}: {
  initialHome: boolean;
  children: React.ReactNode;
}) => {
  const [introActive, setIntroActive] = useState(initialHome);

  const completeIntro = useCallback(() => {
    document.documentElement.classList.remove(INTRO_CLASS);
    document.documentElement.classList.add("volante-transitions-ready");
    setIntroActive(false);
  }, []);

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const introAlreadyPlayed = Boolean(
      sessionStorage.getItem(INTRO_SESSION_KEY),
    );

    if (initialHome && !reducedMotion && !introAlreadyPlayed) return;

    document.documentElement.classList.remove(INTRO_CLASS);
    const frame = requestAnimationFrame(() => {
      setIntroActive(false);
      document.documentElement.classList.add("volante-transitions-ready");
    });
    return () => cancelAnimationFrame(frame);
  }, [initialHome]);

  const value = useMemo(
    () => ({ introActive, completeIntro }),
    [completeIntro, introActive],
  );

  return (
    <PublicExperienceContext.Provider value={value}>
      {children}
    </PublicExperienceContext.Provider>
  );
};

export default PublicExperienceProvider;
