(() => {
  const app = document.getElementById("app");
  const navItems = Array.from(document.querySelectorAll(".nav-item"));
  const menuToggle = document.querySelector(".menu-toggle");
  const navPanel = document.getElementById("main-nav");

  const cache = {
    pages: null,
    articles: null,
  };

  const VALID_ROUTES = new Set(["home", "articles", "announcements", "submit", "about"]);

  async function fetchJson(path) {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${path}: ${response.status}`);
    }
    return response.json();
  }

  async function getPages() {
    if (!cache.pages) {
      cache.pages = await fetchJson("./data/pages.json");
    }
    return cache.pages;
  }

  async function getArticles() {
    if (!cache.articles) {
      cache.articles = await fetchJson("./data/articles.json");
    }
    return cache.articles;
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) {
      return dateString;
    }
    return date
      .toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
      .toUpperCase();
  }

  function parseHash() {
    const raw = window.location.hash.replace(/^#/, "").trim();
    if (!raw) {
      return { route: "home", target: "" };
    }

    const [routePart, ...rest] = raw.split("/");
    const route = VALID_ROUTES.has(routePart) ? routePart : "home";
    const target = rest.join("/");
    return { route, target };
  }

  function closeMenu() {
    if (!menuToggle || !navPanel) {
      return;
    }
    navPanel.classList.remove("active");
    menuToggle.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }

  function openMenu() {
    if (!menuToggle || !navPanel) {
      return;
    }
    navPanel.classList.add("active");
    menuToggle.classList.add("active");
    menuToggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }

  function setActiveNav(route) {
    navItems.forEach((item) => {
      item.classList.toggle("active", item.dataset.route === route);
    });
  }

  function renderNewsCards(items) {
    return items
      .map(
        (item) => `
          <a class="card-base news-card news-card-link" href="#announcements/${escapeHtml(item.target)}">
            <h3 class="news-title">${escapeHtml(item.title)}</h3>
            <p class="news-meta-text">${escapeHtml(item.description)}</p>
            <div class="news-footer">
              <span class="news-tag">${escapeHtml(item.tag)}</span>
              <time class="news-time">${escapeHtml(item.date)}</time>
            </div>
          </a>
        `,
      )
      .join("");
  }

  function renderArticleCards(items) {
    return items
      .map(
        (article) => `
          <a class="card-base article-card article-card-link" href="./article.html?id=${encodeURIComponent(article.id)}">
            <div>
              <div class="article-top">
                <span class="article-project">${escapeHtml(article.project || "NONSCIENCE")}</span>
                <span class="article-divider">|</span>
                <time class="article-date" datetime="${escapeHtml(article.date)}">${escapeHtml(formatDate(article.date))}</time>
              </div>
              <h3 class="article-title">${escapeHtml(article.title)}</h3>
            </div>
            <div class="article-bottom">
              <p class="article-author">作者：${escapeHtml(article.author)}</p>
              <span class="article-arrow" aria-hidden="true">→</span>
            </div>
          </a>
        `,
      )
      .join("");
  }

  function renderHome(pages, articles) {
    const latestArticles = articles.slice(0, 3);

    return `
      <section class="hero">
        <div class="container hero-inner">
          <div>
            <h1 class="hero-title">${pages.home.hero.titleHtml}</h1>
            <p class="hero-subtitle">${escapeHtml(pages.home.hero.subtitle)}</p>
          </div>
          <div class="hero-art" aria-hidden="true">
            <span class="blob one"></span>
            <span class="blob two"></span>
            <span class="blob three"></span>
          </div>
        </div>
      </section>

      <section class="container section-separator block-space">
        <h2 class="section-title">近期动态</h2>
        <div class="news-list">${renderNewsCards(pages.home.news)}</div>
      </section>

      <section class="container section-separator block-space">
        <h2 class="section-title">最新文章</h2>
        <div class="articles-grid">${renderArticleCards(latestArticles)}</div>
        <div class="center-action">
          <a class="btn-outline" href="#articles">
            <span class="btn-cn">更多</span>
            <span class="btn-en">MORE</span>
          </a>
        </div>
      </section>

      <section class="container section-separator submit-wrap">
        <h2 class="section-title center">欢迎来稿</h2>
        <p class="submit-desc">废话也是科学？来稿告诉我们你的离谱研究。<br />投稿通道常年开放。</p>
        <a class="btn-solid" href="#submit">
          <span class="btn-cn">投稿</span>
          <span class="btn-en">SUBMIT</span>
        </a>
      </section>
    `;
  }

  function renderArticlesPage(articles) {
    return `
      <section class="articles-full-page">
        <div class="container">
          <h1 class="section-title">最新文章</h1>
          <div class="articles-grid">${renderArticleCards(articles)}</div>
        </div>
      </section>
    `;
  }

  function renderStaticPage(page) {
    return page.html;
  }

  function scrollToTarget(targetId) {
    if (!targetId) {
      window.scrollTo(0, 0);
      return;
    }

    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ block: "start", behavior: "auto" });
    } else {
      window.scrollTo(0, 0);
    }
  }

  async function render() {
    const { route, target } = parseHash();
    setActiveNav(route);

    try {
      const [pages, articles] = await Promise.all([getPages(), getArticles()]);
      let html = "";

      if (route === "home") {
        html = renderHome(pages, articles);
      } else if (route === "articles") {
        html = renderArticlesPage(articles);
      } else {
        html = renderStaticPage(pages[route]);
      }

      app.innerHTML = `<div class="fade-in">${html}</div>`;
      scrollToTarget(target);
    } catch (error) {
      app.innerHTML = `
        <section class="page-content fade-in">
          <h1 class="page-title">页面加载失败</h1>
          <div class="page-body">
            <p>无法获取内容数据，请稍后重试。</p>
            <p>${escapeHtml(error.message)}</p>
          </div>
        </section>
      `;
      window.scrollTo(0, 0);
    } finally {
      closeMenu();
    }
  }

  if (menuToggle) {
    menuToggle.addEventListener("click", () => {
      if (navPanel && navPanel.classList.contains("active")) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  if (navPanel) {
    navPanel.addEventListener("click", (event) => {
      if (event.target === navPanel) {
        closeMenu();
      }
    });
  }

  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      closeMenu();
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      closeMenu();
    }
  });

  window.addEventListener("hashchange", render);

  if (!window.location.hash) {
    window.location.hash = "#home";
  } else {
    render();
  }
})();
