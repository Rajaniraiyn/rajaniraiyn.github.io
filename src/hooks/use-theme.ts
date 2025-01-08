import { useEffect, useState, useCallback } from "react";

const useTheme = () => {
  const getThemePreference = () => {
    if (typeof localStorage !== "undefined" && localStorage.getItem("theme")) {
      return localStorage.getItem("theme");
    }
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  };

  const [theme, setTheme] = useState(getThemePreference());

  const updateTheme = useCallback(
    (newTheme: string) => {
      if (newTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      localStorage.setItem("theme", newTheme);
      setTheme(newTheme);
    },
    [setTheme],
  );

  useEffect(() => {
    const syncThemeWithDOM = () => {
      const isDark = document.documentElement.classList.contains("dark");
      const currentTheme = isDark ? "dark" : "light";
      if (theme !== currentTheme) {
        setTheme(currentTheme);
      }
    };

    const handleLocalStorageChange = () => {
      const storedTheme = localStorage.getItem("theme");
      if (storedTheme && storedTheme !== theme) {
        setTheme(storedTheme);
      }
    };

    const observer = new MutationObserver(syncThemeWithDOM);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    window.addEventListener("storage", handleLocalStorageChange);

    syncThemeWithDOM();

    return () => {
      observer.disconnect();
      window.removeEventListener("storage", handleLocalStorageChange);
    };
  }, [theme]);

  return [theme, updateTheme];
};

export default useTheme;
