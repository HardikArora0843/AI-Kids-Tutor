import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { LanguageProvider } from "./context/LanguageContext.jsx";
import { SoundProvider } from "./sounds/SoundProvider.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LanguageProvider>
      <SoundProvider>
        <App />
      </SoundProvider>
    </LanguageProvider>
  </StrictMode>
);
