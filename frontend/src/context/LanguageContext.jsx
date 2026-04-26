import { createContext, useContext, useEffect, useMemo, useState } from "react";

const LANGUAGE_STORAGE_KEY = "appLanguage";

const LanguageContext = createContext({
  currentLanguage: "en",
  setLanguage: () => {},
});

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return stored === "hi" ? "hi" : "en";
  });

  useEffect(() => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, currentLanguage);
  }, [currentLanguage]);

  const value = useMemo(
    () => ({
      currentLanguage,
      setLanguage: setCurrentLanguage,
    }),
    [currentLanguage]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => useContext(LanguageContext);
