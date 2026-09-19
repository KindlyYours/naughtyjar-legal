(() => {
  const storageKey = "naughtyjar-theme";
  const languageKey = "naughtyjar-language";
  const themes = ["light", "dark"];
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

    const documentPage = document.querySelector(".document-page");
    if (documentPage) {
      const prefix = "../";
      const header = documentPage.querySelector(".document-header");
      const oldTitleRow = header?.querySelector(".document-title-row");
      const documentNav = document.createElement("nav");
      documentNav.className = "document-site-nav";
      documentNav.setAttribute("aria-label", portuguese ? "Navegação principal" : "Main navigation");
      documentNav.innerHTML = `
        <a class="landing-wordmark" href="${prefix}index.html"><img src="${prefix}img/logo.png" alt=""><span>NaughtyJar</span></a>
        <div class="landing-nav-links">
          <a href="support.html">${portuguese ? "Suporte" : "Support"}</a>
          <a href="privacy.html">${portuguese ? "Privacidade" : "Privacy"}</a>
          <a class="nav-cta" href="${prefix}index.html#começar">${portuguese ? "Começar" : "Get started"}</a>
        </div>
        <a class="document-nav-language" href="${portuguese ? "../en/index.html" : "../pt/index.html"}" lang="${portuguese ? "en" : "pt-PT"}">${portuguese ? "English" : "Português"}</a>`;
      header?.prepend(documentNav);
      if (oldTitleRow) oldTitleRow.hidden = true;

      const footer = document.querySelector(".site-footer");
      if (footer) {
        const footerNav = footer.querySelector("nav");
        const copyright = footer.querySelector("span");
        const brand = document.createElement("div");
        brand.innerHTML = `<a class="landing-wordmark" href="${prefix}index.html"><img src="${prefix}img/logo.png" alt=""><span>NaughtyJar</span></a><p>${portuguese ? "Sexo. JAR. Prenda." : "Sex. JAR. Gift."}</p>`;
        footer.prepend(brand);
        if (footerNav) {
          footerNav.innerHTML = `<a href="support.html">${portuguese ? "Suporte" : "Support"}</a><a href="privacy.html">${portuguese ? "Privacidade" : "Privacy"}</a><a href="roadmap.html">Roadmap</a><a href="terms.html">${portuguese ? "Termos" : "Terms"}</a><a href="${prefix}${portuguese ? "en/index.html" : "index.html"}" lang="${portuguese ? "en" : "pt-PT"}">${portuguese ? "English" : "Português"}</a>`;
        }
        if (copyright) copyright.textContent = "© 2026 NaughtyJar";
      }
    }
    const labels = portuguese
      ? { light: "Modo claro", auto: "Seguir o sistema", dark: "Modo escuro", group: "Aspeto do site" }
      : { light: "Light appearance", auto: "Use system setting", dark: "Dark appearance", group: "Site appearance" };
    const control = document.createElement("div");
    control.className = "theme-control";
    control.setAttribute("role", "group");
    control.setAttribute("aria-label", labels.group);
    control.innerHTML = `
      <button type="button" data-theme-choice="light" aria-label="${labels.light}"><span aria-hidden="true">☀</span></button>
      <button type="button" data-theme-choice="auto" aria-label="${labels.auto}"><span aria-hidden="true">◐</span></button>
      <button type="button" data-theme-choice="dark" aria-label="${labels.dark}"><span aria-hidden="true">☾</span></button>`;

    const applyTheme = (theme) => {
      const effectiveTheme = theme === "auto"
        ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
        : theme;
      root.dataset.theme = effectiveTheme;
      root.dataset.themeMode = theme;
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
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
      if (root.dataset.themeMode === "auto") applyTheme("auto");
    });

    const supportButton = document.createElement("a");
    const nestedPage = /\/(pt|en)\//.test(location.pathname);
    supportButton.className = "kofi-floating";
    supportButton.href = "https://ko-fi.com/freitasricardo";
    supportButton.target = "_blank";
    supportButton.rel = "noopener noreferrer";
    supportButton.setAttribute("aria-label", portuguese ? "Apoiar o NaughtyJar no Ko-fi" : "Support NaughtyJar on Ko-fi");
    supportButton.innerHTML = `<img src="${nestedPage ? "../" : ""}img/kofi.png" alt=""><span>${portuguese ? "Buy me a coffee" : "Buy me a coffee"}</span>`;
    document.body.append(supportButton);
  });
})();
