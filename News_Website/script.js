const API_KEY = "9a2c6765cac53ef160947d22bed91600"; // Demo key (may expire)
 // Replace with your GNews API key
const newsContainer = document.getElementById("newsContainer");
const searchInput = document.getElementById("searchInput");
const themeToggle = document.getElementById("themeToggle");

let currentPage = 1;
let currentCategory = "general";
let currentQuery = "";
const pageSize = 6;

function buildUrl(category, page, query) {
  const base = query
    ? `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}`
    : `https://gnews.io/api/v4/top-headlines?topic=${category}`;
    
  const params = [
    `token=${API_KEY}`,
    `lang=en`,
    `max=${pageSize}`,
    `from=${new Date().toISOString().split("T")[0]}`,
    `to=${new Date().toISOString().split("T")[0]}`,
    `page=${page}`
  ];
  
  return `${base}&${params.join("&")}`;
}

async function fetchNews(category, page = 1, query = "") {
  const url = buildUrl(category, page, query);

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!data.articles || data.articles.length === 0) {
      newsContainer.innerHTML = `<p>No results found.</p>`;
    } else {
      displayNews(data.articles);
    }
  } catch (error) {
    console.error("API fetch error:", error);
    newsContainer.innerHTML = `<p>Error fetching news. Check your API key or network.</p>`;
  }
}

function displayNews(articles) {
  newsContainer.innerHTML = "";
  articles.forEach((article) => {
    const card = document.createElement("div");
    card.className = "news-card";
    card.innerHTML = `
      <img src="${article.image || 'https://via.placeholder.com/400x200'}" alt="News Image" />
      <h3>${article.title}</h3>
      <p>${article.description || "No description available."}</p>
      <a href="${article.url}" target="_blank">Read more</a>
    `;
    newsContainer.appendChild(card);
  });
}

// Category filter
document.querySelectorAll(".category").forEach((btn) => {
  btn.addEventListener("click", () => {
    currentCategory = btn.dataset.category;
    currentQuery = "";
    currentPage = 1;
    fetchNews(currentCategory, currentPage);
  });
});

// Search handler
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    currentQuery = searchInput.value.trim();
    currentPage = 1;
    fetchNews(currentCategory, currentPage, currentQuery);
  }
});

// Pagination
document.getElementById("nextPage").addEventListener("click", () => {
  currentPage++;
  fetchNews(currentCategory, currentPage, currentQuery);
});

document.getElementById("prevPage").addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    fetchNews(currentCategory, currentPage, currentQuery);
  }
});

// Theme toggle
if (localStorage.getItem("theme") === "light") {
  document.body.classList.add("light");
  themeToggle.textContent = "🌞";
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light");
  const isLight = document.body.classList.contains("light");
  themeToggle.textContent = isLight ? "🌞" : "🌙";
  localStorage.setItem("theme", isLight ? "light" : "dark");
});

// Initial load
fetchNews(currentCategory);
