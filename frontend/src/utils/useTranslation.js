import { useMemo, useCallback } from "react";
import { useLanguage } from "../context/LanguageContext";
import en from "../i18n/en";
import hi from "../i18n/hi";

const dictionaries = { en, hi };

const getNestedValue = (object, key) =>
  key.split(".").reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), object);

const formatValue = (value, params = {}) => {
  if (typeof value !== "string") return value;
  return value.replace(/\{(\w+)\}/g, (_, token) => params[token] ?? "");
};

const useTranslation = () => {
  const { currentLanguage, setLanguage } = useLanguage();

  const dictionary = useMemo(
    () => dictionaries[currentLanguage] || dictionaries.en,
    [currentLanguage]
  );

  const t = useCallback(
    (key, params) => {
      const value = getNestedValue(dictionary, key);
      if (value === undefined) {
        const fallback = getNestedValue(dictionaries.en, key);
        return formatValue(fallback ?? key, params);
      }
      return formatValue(value, params);
    },
    [dictionary]
  );

  return {
    t,
    currentLanguage,
    setLanguage,
    dictionary,
  };
};

export default useTranslation;
