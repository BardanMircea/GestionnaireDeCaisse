import { translations } from "./i18n.js";

export function initTheme(btnToggleTheme) {
  function applyTheme(theme) {
    localStorage.setItem("pos-theme", theme);
    const lang = localStorage.getItem("pos-lang") || "fr";

    if (theme === "dark") {
      document.body.classList.add("dark-theme");
      btnToggleTheme.innerText = translations[lang].btnThemeLight;
    } else {
      document.body.classList.remove("dark-theme");
      btnToggleTheme.innerText = translations[lang].btnThemeDark;
    }
  }

  btnToggleTheme.addEventListener("click", () => {
    const currentTheme =
      localStorage.getItem("pos-theme") === "dark" ? "light" : "dark";
    applyTheme(currentTheme);
  });

  // Écouter si la langue change pour traduire le texte du bouton de thème
  window.addEventListener("pos-lang-changed", () => {
    applyTheme(localStorage.getItem("pos-theme") || "light");
  });

  const savedTheme = localStorage.getItem("pos-theme") || "light";
  applyTheme(savedTheme);
}
