(() => {
  const root = document.documentElement;
  const content = document.querySelector("[data-workshop-content] article") ?? document.querySelector("main");
  const toast = document.querySelector("[data-toast]");
  const isPortuguese = root.lang.toLocaleLowerCase().startsWith("pt");
  const messages = isPortuguese
    ? {
        lightTheme: "Tema claro ativado",
        darkTheme: "Tema escuro ativado",
        markComplete: "Marcar seção como concluída",
        progressReset: "Progresso do workshop reiniciado",
        copy: "Copiar",
        copyCode: "Copiar código",
        copied: "Copiado ✓",
        copiedToast: "Código copiado",
        copyError: "Não foi possível copiar automaticamente",
        noMatch: "Nenhuma seção encontrada",
        page: "Página",
        section: "Seção",
        topic: "Tópico",
      }
    : {
        lightTheme: "Light theme enabled",
        darkTheme: "Dark theme enabled",
        markComplete: "Mark section as complete",
        progressReset: "Workshop progress reset",
        copy: "Copy",
        copyCode: "Copy code to clipboard",
        copied: "Copied ✓",
        copiedToast: "Code copied",
        copyError: "Could not copy automatically",
        noMatch: "No matching section",
        page: "Page",
        section: "Section",
        topic: "Topic",
      };
  let toastTimer;

  const showToast = (message) => {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 2200);
  };

  const safeStorage = {
    get(key, fallback = null) {
      try {
        const value = window.localStorage.getItem(key);
        return value === null ? fallback : value;
      } catch {
        return fallback;
      }
    },
    set(key, value) {
      try {
        window.localStorage.setItem(key, value);
      } catch {
        // The experience still works when storage is disabled.
      }
    },
    remove(key) {
      try {
        window.localStorage.removeItem(key);
      } catch {
        // The experience still works when storage is disabled.
      }
    },
  };

  const preferredTheme = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  if (!root.dataset.theme) root.dataset.theme = preferredTheme;

  document.querySelector("[data-theme-toggle]")?.addEventListener("click", () => {
    const nextTheme = root.dataset.theme === "light" ? "dark" : "light";
    root.dataset.theme = nextTheme;
    safeStorage.set("voice-labs-theme", nextTheme);
    showToast(nextTheme === "light" ? messages.lightTheme : messages.darkTheme);
  });

  const progressBar = document.querySelector("[data-reading-progress]");
  const updateReadingProgress = () => {
    if (!progressBar) return;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100)) : 0;
    progressBar.style.width = `${progress}%`;
  };
  updateReadingProgress();
  window.addEventListener("scroll", updateReadingProgress, { passive: true });
  window.addEventListener("resize", updateReadingProgress);

  const sidebar = document.querySelector("[data-sidebar]");
  const scrim = document.querySelector(".sidebar-scrim");
  const mobileMenu = document.querySelector("[data-mobile-menu]");
  const mobileMenuScrim = document.querySelector(".mobile-menu-scrim");
  const mobileMenuToggle = document.querySelector("[data-mobile-menu-toggle]");
  let mobileMenuReturnFocus = null;
  let sidebarReturnFocus = null;
  const focusableSelector = [
    "a[href]",
    "button:not([disabled])",
    "input:not([disabled])",
    "select:not([disabled])",
    "textarea:not([disabled])",
    "[tabindex]:not([tabindex='-1'])",
  ].join(",");
  const updateScrollLock = () => {
    const drawerIsOpen = sidebar?.classList.contains("is-open") || mobileMenu?.classList.contains("is-open");
    document.body.classList.toggle("has-open-drawer", Boolean(drawerIsOpen));
  };
  const setSidebar = (open, options = {}) => {
    if (!sidebar) return;
    const wasOpen = sidebar.classList.contains("is-open");
    if (open && !wasOpen) sidebarReturnFocus = document.activeElement;
    sidebar.classList.toggle("is-open", open);
    if (window.innerWidth <= 1050) sidebar.setAttribute("aria-hidden", String(!open));
    else sidebar.removeAttribute("aria-hidden");
    scrim?.classList.toggle("is-open", open);
    updateScrollLock();
    if (open && window.innerWidth <= 1050) {
      window.setTimeout(() => sidebar.querySelector("[data-toc-close]")?.focus(), 0);
    } else if (wasOpen && options.returnFocus !== false && sidebarReturnFocus instanceof HTMLElement) {
      sidebarReturnFocus.focus();
      sidebarReturnFocus = null;
    }
  };
  setSidebar(false, { returnFocus: false });
  document.querySelectorAll("[data-toc-close]").forEach((button) => {
    button.addEventListener("click", () => setSidebar(false));
  });

  const setMobileMenu = (open, options = {}) => {
    if (!mobileMenu) return;
    const wasOpen = mobileMenu.classList.contains("is-open");
    if (open && !wasOpen) mobileMenuReturnFocus = document.activeElement;
    if (open) setSidebar(false, { returnFocus: false });
    mobileMenu.classList.toggle("is-open", open);
    mobileMenu.setAttribute("aria-hidden", String(!open));
    mobileMenuScrim?.classList.toggle("is-open", open);
    mobileMenuToggle?.setAttribute("aria-expanded", String(open));
    updateScrollLock();
    if (open) {
      window.setTimeout(() => mobileMenu.querySelector("[data-mobile-menu-close]")?.focus(), 0);
    } else if (wasOpen && options.returnFocus !== false && mobileMenuReturnFocus instanceof HTMLElement) {
      mobileMenuReturnFocus.focus();
      mobileMenuReturnFocus = null;
    }
  };
  mobileMenuToggle?.addEventListener("click", () => setMobileMenu(true));
  document.querySelectorAll("[data-mobile-menu-close]").forEach((button) => {
    button.addEventListener("click", () => setMobileMenu(false));
  });
  mobileMenu?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMobileMenu(false));
  });
  document.querySelector("[data-open-toc]")?.addEventListener("click", () => {
    setMobileMenu(false, { returnFocus: false });
    setSidebar(true);
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      setMobileMenu(false);
      setSidebar(false);
      return;
    }
    if (event.key !== "Tab") return;
    const openDrawer = mobileMenu?.classList.contains("is-open")
      ? mobileMenu
      : sidebar?.classList.contains("is-open") && window.innerWidth <= 1050
        ? sidebar
        : null;
    if (!openDrawer) return;
    const focusable = [...openDrawer.querySelectorAll(focusableSelector)].filter(
      (element) => element instanceof HTMLElement && element.offsetParent !== null,
    );
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable.at(-1);
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth <= 1050) return;
    setMobileMenu(false, { returnFocus: false });
    setSidebar(false, { returnFocus: false });
  });
  window.addEventListener("pageshow", () => {
    setMobileMenu(false, { returnFocus: false });
    setSidebar(false, { returnFocus: false });
    document.body.classList.remove("has-open-drawer");
  });

  const slugify = (value) =>
    value
      .toLocaleLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

  const headings = content ? [...content.querySelectorAll("h1, h2, h3")] : [];
  const usedIds = new Set(headings.map((heading) => heading.id).filter(Boolean));
  headings.forEach((heading, index) => {
    if (heading.id) return;
    const base = slugify(heading.textContent ?? "") || `section-${index + 1}`;
    let candidate = base;
    let suffix = 2;
    while (usedIds.has(candidate)) candidate = `${base}-${suffix++}`;
    heading.id = candidate;
    usedIds.add(candidate);
  });

  const toc = document.querySelector("[data-toc]");
  const sectionHeadings = headings.filter((heading) => heading.tagName === "H2");
  const completionKey = `voice-labs-progress:${window.location.pathname}`;
  let completed = new Set();
  try {
    completed = new Set(JSON.parse(safeStorage.get(completionKey, "[]")));
  } catch {
    completed = new Set();
  }
  const currentSectionIds = new Set(sectionHeadings.map((heading) => heading.id));
  completed = new Set([...completed].filter((id) => currentSectionIds.has(id)));

  const completionLabel = document.querySelector("[data-completion-label]");
  const completionBar = document.querySelector("[data-completion-bar]");
  const updateCompletion = () => {
    const total = sectionHeadings.length;
    const percentage = total ? Math.round((completed.size / total) * 100) : 0;
    if (completionLabel) completionLabel.textContent = `${percentage}%`;
    if (completionBar) completionBar.style.width = `${percentage}%`;
    safeStorage.set(completionKey, JSON.stringify([...completed]));
    document.querySelectorAll("[data-completion-id]").forEach((button) => {
      const done = completed.has(button.dataset.completionId);
      button.classList.toggle("is-complete", done);
      button.textContent = done ? "✓" : "";
      button.setAttribute("aria-pressed", String(done));
    });
  };

  if (toc && headings.length) {
    const list = document.createElement("ul");
    headings
      .filter((heading) => heading.tagName !== "H1")
      .forEach((heading) => {
        const item = document.createElement("li");
        item.dataset.level = heading.tagName.slice(1);
        const link = document.createElement("a");
        link.href = `#${heading.id}`;
        link.textContent = heading.textContent ?? heading.id;
        link.dataset.headingId = heading.id;
        link.addEventListener("click", () => setSidebar(false));
        item.append(link);

        if (heading.tagName === "H2") {
          const check = document.createElement("button");
          check.type = "button";
          check.className = "toc-check";
          check.dataset.completionId = heading.id;
          check.setAttribute("aria-label", `${messages.markComplete}: ${heading.textContent}`);
          check.addEventListener("click", () => {
            if (completed.has(heading.id)) completed.delete(heading.id);
            else completed.add(heading.id);
            updateCompletion();
          });
          item.append(check);
        }
        list.append(item);
      });
    toc.append(list);
  }
  updateCompletion();

  document.querySelector("[data-reset-progress]")?.addEventListener("click", () => {
    completed.clear();
    safeStorage.remove(completionKey);
    updateCompletion();
    showToast(messages.progressReset);
  });

  if ("IntersectionObserver" in window && headings.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (!visible) return;
        document.querySelectorAll(".page-toc a").forEach((link) => {
          link.classList.toggle("is-active", link.dataset.headingId === visible.target.id);
        });
      },
      { rootMargin: "-18% 0px -68% 0px", threshold: 0 },
    );
    headings.forEach((heading) => observer.observe(heading));
  }

  if (content) {
    content.querySelectorAll("pre").forEach((pre) => {
      if (pre.closest(".code-frame")) return;
      const code = pre.querySelector("code");
      if (!code) return;
      const highlighted = pre.parentElement?.classList.contains("highlight") ? pre.parentElement : pre;
      const frame = document.createElement("div");
      frame.className = "code-frame";
      highlighted.parentNode?.insertBefore(frame, highlighted);
      frame.append(highlighted);

      const disclosure = pre.closest(".code-disclosure");
      const filename = disclosure?.querySelector("summary code")?.textContent?.trim();
      if (filename) {
        frame.classList.add("has-code-label");
        const label = document.createElement("span");
        label.className = "code-label";
        label.textContent = filename;
        frame.append(label);
      }

      const button = document.createElement("button");
      button.type = "button";
      button.className = "copy-code";
      const copyLabel = messages.copy;
      button.textContent = copyLabel;
      button.setAttribute("aria-label", messages.copyCode);
      button.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(code.textContent ?? "");
          button.textContent = messages.copied;
          button.classList.add("is-copied");
          showToast(messages.copiedToast);
          window.setTimeout(() => {
            button.textContent = copyLabel;
            button.classList.remove("is-copied");
          }, 1800);
        } catch {
          showToast(messages.copyError);
        }
      });
      frame.append(button);
    });
  }

  const searchDialog = document.querySelector("[data-search-dialog]");
  const searchInput = document.querySelector("[data-search-input]");
  const searchResults = document.querySelector("[data-search-results]");
  const searchIndex = headings.map((heading) => ({
    id: heading.id,
    level: heading.tagName,
    title: (heading.textContent ?? "").trim(),
  }));

  const renderSearch = (query = "") => {
    if (!searchResults) return;
    const normalized = query.trim().toLocaleLowerCase();
    const matches = searchIndex
      .filter((entry) => !normalized || entry.title.toLocaleLowerCase().includes(normalized))
      .slice(0, 18);
    searchResults.replaceChildren();
    if (!matches.length) {
      const empty = document.createElement("p");
      empty.className = "search-empty";
      empty.textContent = messages.noMatch;
      searchResults.append(empty);
      return;
    }
    matches.forEach((entry) => {
      const link = document.createElement("a");
      link.className = "search-result";
      link.href = `#${entry.id}`;
      const label = document.createElement("small");
      label.textContent = entry.level === "H1" ? messages.page : entry.level === "H2" ? messages.section : messages.topic;
      const title = document.createElement("span");
      title.textContent = entry.title;
      link.append(label, title);
      link.addEventListener("click", () => searchDialog?.close());
      searchResults.append(link);
    });
  };

  const openSearch = () => {
    if (!searchDialog) return;
    renderSearch("");
    if (typeof searchDialog.showModal === "function") searchDialog.showModal();
    else searchDialog.setAttribute("open", "");
    window.setTimeout(() => searchInput?.focus(), 0);
  };
  const closeSearch = () => {
    if (!searchDialog) return;
    if (typeof searchDialog.close === "function") searchDialog.close();
    else searchDialog.removeAttribute("open");
  };
  document.querySelector("[data-search-toggle]")?.addEventListener("click", openSearch);
  document.querySelector("[data-search-close]")?.addEventListener("click", closeSearch);
  searchInput?.addEventListener("input", (event) => renderSearch(event.currentTarget.value));
  searchDialog?.addEventListener("click", (event) => {
    if (event.target === searchDialog) closeSearch();
  });
  document.addEventListener("keydown", (event) => {
    const target = event.target;
    const isTyping = target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement;
    if (event.key === "/" && !isTyping) {
      event.preventDefault();
      openSearch();
    }
  });

  document.querySelector("[data-scroll-top]")?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();
