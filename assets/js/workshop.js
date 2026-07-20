(() => {
  const root = document.documentElement;
  const content = document.querySelector("[data-workshop-content] article") ?? document.querySelector("main");
  const toast = document.querySelector("[data-toast]");
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
    showToast(nextTheme === "light" ? "Light theme enabled" : "Dark theme enabled");
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
  const setSidebar = (open) => {
    sidebar?.classList.toggle("is-open", open);
    scrim?.classList.toggle("is-open", open);
    document.body.style.overflow = open ? "hidden" : "";
  };
  document.querySelector("[data-toc-toggle]")?.addEventListener("click", () => setSidebar(true));
  document.querySelectorAll("[data-toc-close]").forEach((button) => {
    button.addEventListener("click", () => setSidebar(false));
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
          check.setAttribute("aria-label", `Mark section as complete: ${heading.textContent}`);
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
    showToast("Workshop progress reset / Progresso reiniciado");
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

      const button = document.createElement("button");
      button.type = "button";
      button.className = "copy-code";
      button.textContent = "Copy";
      button.setAttribute("aria-label", "Copy code to clipboard");
      button.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(code.textContent ?? "");
          button.textContent = "Copied ✓";
          button.classList.add("is-copied");
          showToast("Code copied / Código copiado");
          window.setTimeout(() => {
            button.textContent = "Copy";
            button.classList.remove("is-copied");
          }, 1800);
        } catch {
          showToast("Could not copy automatically");
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
      empty.textContent = "No matching section / Nenhuma seção encontrada";
      searchResults.append(empty);
      return;
    }
    matches.forEach((entry) => {
      const link = document.createElement("a");
      link.className = "search-result";
      link.href = `#${entry.id}`;
      const label = document.createElement("small");
      label.textContent = entry.level === "H1" ? "Page" : entry.level === "H2" ? "Section" : "Topic";
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
