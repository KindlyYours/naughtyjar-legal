(() => {
  const storageKey = "naughtyjar-theme";
  const languageKey = "naughtyjar-language";
  const themes = ["light", "auto", "dark"];
  const root = document.documentElement;
  const savedTheme = localStorage.getItem(storageKey);
  root.dataset.theme = themes.includes(savedTheme) ? savedTheme : "auto";

  const onPortugueseHome = root.lang.startsWith("pt") && /\/index\.html$/.test(location.pathname);
  if (onPortugueseHome && localStorage.getItem(languageKey) === "en") {
    location.replace("en/index.html");
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("a[lang]").forEach((link) => {
      link.addEventListener("click", () => {
        localStorage.setItem(languageKey, link.lang.startsWith("en") ? "en" : "pt");
      });
    });
    if (root.lang === "en") {
      localStorage.setItem(languageKey, "en");
      document.querySelectorAll('.back-link[href="../index.html"]').forEach((link) => {
        link.setAttribute("href", "index.html");
      });
    } else {
      localStorage.setItem(languageKey, "pt");
    }

    document.querySelectorAll(".back-link").forEach((link) => {
      link.addEventListener("click", (event) => {
        if (!document.referrer) return;
        try {
          if (new URL(document.referrer).origin === location.origin) {
            event.preventDefault();
            history.back();
          }
        } catch {
          // Keep the page's home link as a safe fallback.
        }
      });
    });
    const portuguese = root.lang.startsWith("pt");
    const labels = portuguese
      ? { light: "Modo claro", auto: "Usar aspeto do dispositivo", dark: "Modo escuro" }
      : { light: "Light appearance", auto: "Use device appearance", dark: "Dark appearance" };
    const control = document.createElement("div");
    control.className = "theme-control";
    control.setAttribute("role", "group");
    control.setAttribute("aria-label", portuguese ? "Aspeto do site" : "Site appearance");
    control.innerHTML = `
      <button type="button" data-theme-choice="light" aria-label="${labels.light}"><span aria-hidden="true">☀︎</span></button>
      <button type="button" data-theme-choice="auto" aria-label="${labels.auto}">Auto</button>
      <button type="button" data-theme-choice="dark" aria-label="${labels.dark}"><span aria-hidden="true">☾</span></button>`;

    const applyTheme = (theme) => {
      root.dataset.theme = theme;
      localStorage.setItem(storageKey, theme);
      control.querySelectorAll("button").forEach((button) => {
        button.setAttribute("aria-pressed", String(button.dataset.themeChoice === theme));
      });
    };

    control.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-theme-choice]");
      if (button) applyTheme(button.dataset.themeChoice);
    });
    document.body.prepend(control);
    applyTheme(root.dataset.theme);

    const supportButton = document.createElement("a");
    const nestedPage = /\/(pt|en)\//.test(location.pathname);
    supportButton.className = "kofi-floating";
    supportButton.href = "https://ko-fi.com/kindlyyours";
    supportButton.target = "_blank";
    supportButton.rel = "noopener noreferrer";
    supportButton.setAttribute("aria-label", portuguese ? "Apoiar o NaughtyJar no Ko-fi" : "Support NaughtyJar on Ko-fi");
    supportButton.innerHTML = `<img src="${nestedPage ? "../" : ""}img/logo.png" alt=""><span>${portuguese ? "Apoiar" : "Support"}</span>`;
    document.body.append(supportButton);
  });
})();
