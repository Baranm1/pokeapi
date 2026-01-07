let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const cardContainer = document.getElementById("cardContainer");
const detailSection = document.getElementById("detailSection");
const statusMessage = document.getElementById("statusMessage");
const themeBtn = document.getElementById("themeBtn");

/* ---------------- DARK MODE ---------------- */
if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  if (themeBtn) themeBtn.textContent = "☀️ Light Mode";
}

if (themeBtn) {
  themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
      localStorage.setItem("theme", "dark");
      themeBtn.textContent = "☀️ Light Mode";
    } else {
      localStorage.setItem("theme", "light");
      themeBtn.textContent = "🌙 Dark Mode";
    }
  });
}

/* ---------------- FETCH ---------------- */
function fetchPokemon(pokemonName) {
  statusMessage.textContent = "Yükleniyor...";
  detailSection.style.display = "none";

  cardContainer.innerHTML = `<div class="skeleton"></div>`;

  fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
    .then((res) => {
      if (!res.ok) throw new Error("Pokémon bulunamadı");
      return res.json();
    })
    .then((data) => {
      statusMessage.textContent = "";
      cardContainer.innerHTML = "";
      createCard(data);
    })
    .catch((err) => {
      statusMessage.textContent = err.message;
      cardContainer.innerHTML = "";
    });
}

/* ---------------- CARD ---------------- */
function createCard(pokemon) {
  const card = document.createElement("div");
  card.className = "card";

  card.innerHTML = `
  <h3>${pokemon.name}</h3>
  <img src="${pokemon.sprites.other["official-artwork"].front_default}">
  
  <p class="badge">Boy: ${pokemon.height}</p>
  <p class="badge">Kilo: ${pokemon.weight}</p>

  <button class="detailBtn">Detay</button>
  <button class="favBtn">☆</button>
`;

  card.querySelector(".detailBtn").addEventListener("click", () => {
    showDetail(pokemon);
  });

  const favBtn = card.querySelector(".favBtn");

  if (favorites.includes(pokemon.name)) {
    favBtn.textContent = "⭐";
  }

  favBtn.addEventListener("click", () => {
    if (favorites.includes(pokemon.name)) {
      favorites = favorites.filter((n) => n !== pokemon.name);
      favBtn.textContent = "☆";
    } else {
      favorites.push(pokemon.name);
      favBtn.textContent = "⭐";
    }
    localStorage.setItem("favorites", JSON.stringify(favorites));
  });

  cardContainer.appendChild(card);
}

/* ---------------- DETAIL ---------------- */
function showDetail(pokemon) {
  detailSection.style.display = "block";
  detailSection.innerHTML = `
    <h2>${pokemon.name} Detayları</h2>
    <p>Türler: ${pokemon.types.map((t) => t.type.name).join(", ")}</p>
    <p>Yetenek Sayısı: ${pokemon.abilities.length}</p>
  `;
}

/* ---------------- SEARCH ---------------- */
searchBtn.addEventListener("click", () => {
  const value = searchInput.value.toLowerCase();
  if (value) fetchPokemon(value);
  else statusMessage.textContent = "Lütfen bir Pokémon adı giriniz";
});
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchBtn.click();
  }
});
