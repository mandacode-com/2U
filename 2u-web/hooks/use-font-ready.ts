"use client";

import { useEffect } from "react";

export function useFontReady() {
  useEffect(() => {
    document.fonts.ready.then(() => {
      document.documentElement.classList.add("font-loaded");
    });
  }, []);
}
