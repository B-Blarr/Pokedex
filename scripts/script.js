let loadedIds = 0;
let startId = loadedIds;
const refContainer = document.getElementById("pokemon-listing");
const dialogRef = document.getElementById("image-dialog");
const refDialogImageSection = document.getElementById("dialog-image-section");
const refAbilities = document.getElementById("pokemonAbilities");
const refDialogType = document.getElementById("dialog-type");
const refShinyImage = document.getElementById("shiny-image");
const mainButton = document.getElementById("main-button");
const statsButton = document.getElementById("stats-button");
const shinyButton = document.getElementById("shiny-button");
const evoButton = document.getElementById("evo-button");
const inputFilter = document.getElementById("search-input");
const evoArea = document.getElementById("evo-area");
const POKEMON_TYPES = [
  "grass",
  "normal",
  "fighting",
  "flying",
  "poison",
  "ground",
  "rock",
  "bug",
  "ghost",
  "steel",
  "fire",
  "water",
  "electric",
  "psychic",
  "ice",
  "dragon",
  "dark",
  "fairy",
  "stellar",
  "unknown",
];
let newName = "";
let refDialogId = 0;
let maxStat = 220;
let savedPokemon = {};
let savedImages = {};
let savedEvoChain = {};
let savedAbilities = {};
let allNames = [];

async function init() {
  showLoadingSpinner();
  await loadPokemonInfos();
  await waitForPokemonImages();
  hideLoadingSpinner();
}

async function loadPokemonInfos() {
  const pokemonLoadPromises = [];
  const maxLoads = startId + 35;

  for (let id = 1; id <= maxLoads; id++) {
    loadedIds++;
    pokemonLoadPromises.push(loadPokemonEntry(id));
  }
  const templates = await Promise.all(pokemonLoadPromises);
  for (let i = 0; i < templates.length; i++) {
    const id = i + 1; // IDs 1..maxLoads
    refContainer.innerHTML += templates[i];
    getType(id);
  }
  startId = maxLoads;
}

async function loadPokemonEntry(id) {
  const pokemonImage = await getPokemonImage(id);
  const template = await fetchData(id, pokemonImage);
//   await fetchData(id, pokemonImage);
  fetchAbilities(id);
  return template;
}

async function getPokemonImage(id) {
  let data = await getAndSavePokemon(id);
  if (!data) {
    return `../assets/img/faq.png`;
  }
  let pokemonImage = data.sprites.other["official-artwork"].front_default;
  return pokemonImage;
}

async function fetchData(id, pokemonImage) {
  const data = await getAndSaveImage(id);
    let name;
  let pokemonType;

  if (!data) {
    newName = "Unbekannt";
    const pokemonType = "unknown";
  }else {
    name = getGermanName(data, id);
    pokemonType = await getPokemonType(id);
  }
    // refContainer.innerHTML += loadPokemonTemplate(newName, id, pokemonImage, pokemonType);
    // return;
    return loadPokemonTemplate(name, id, pokemonImage, pokemonType);
//   getGermanName(data, id);
//   const pokemonType = await getPokemonType(id);

//   getType(id);
}

async function loadJsonSafely(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      console.error("HTTP error:", response.status);
      return null;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  }
}

function getGermanName(data, id) {
  const pokemonNames = data.names;
  for (let i = 0; i < pokemonNames.length; i++) {
    if (pokemonNames[i].language.name === "de") {
      const name = pokemonNames[i].name;
      allNames[id - 1] = name;
      return name;
    }
  }
}

async function getAndSavePokemon(id) {
  if (savedPokemon[id]) {
    return savedPokemon[id];
  } else {
    let url = `https://pokeapi.co/api/v2/pokemon/${id}/`;
    let data = await loadJsonSafely(url);
    if (!data) {
      console.error(`Could not load pokemon data for id: ${id}`);
      return null;
    }
    savedPokemon[data.id] = data;
    savedPokemon[data.name] = data;
    return data;
  }
}

async function getAndSaveImage(id) {
  if (savedImages[id]) {
    return savedImages[id];
  } else {
    let url = `https://pokeapi.co/api/v2/pokemon-species/${id}/`;
    let data = await loadJsonSafely(url);
    if (!data) {
      console.error(`Could not load species data for id: ${id}`);
      return null;
    }
    savedImages[id] = data;
    return data;
  }
}

async function getAndSaveEvoChain(url) {
  if (savedEvoChain[url]) {
    return savedEvoChain[url];
  } else {
    let response = await fetch(url);
    let data = await response.json();
    savedEvoChain[url] = data;
    return data;
  }
}

async function getPokemonType(id) {
  let pokemonType = "";
  let data = await getAndSavePokemon(id);
  if (!data) {
    return "unknown";
  }
  for (let i = 0; i < data.types.length; i++) {
    pokemonType = data.types[i].type.name;
    return pokemonType;
  }
}

async function loadMorePokemon() {
  showLoadingSpinner();
  const pokemonLoadPromises = [];
  const maxId = 1025;
  const limit = Math.min(startId + 15, maxId);
   const firstId = loadedIds + 1;

  for (let id = loadedIds + 1; id <= limit; id++) {
    loadedIds++;
    pokemonLoadPromises.push(loadPokemonEntry(id));
  }
  const templates = await Promise.all(pokemonLoadPromises);
  for (let i = 0; i < templates.length; i++) {
    const id = firstId + i;
    refContainer.innerHTML += templates[i];
    getType(id);
  }
  startId = limit;
  await waitForPokemonImages();
  hideLoadingSpinner();
}

async function getType(id) {
  let pokemonType = "";
  let data = await getAndSavePokemon(id);
  for (let i = 0; i < data.types.length; i++) {
    pokemonType = data.types[i].type.name;
    let germanType = document.getElementById(`pokemon-entry-footer-${id}`);
    germanType.innerHTML += getGermanType(pokemonType);
  }
  return pokemonType;
}

function showLoadingSpinner() {
  document.getElementById("loading-overlay").style.display = "flex";
}

function hideLoadingSpinner() {
  document.getElementById("loading-overlay").style.display = "none";
}

inputFilter.addEventListener("input", function (event) {
  let filterWord = event.target.value.toLowerCase().trim();
  let pokemonEntry = document.querySelectorAll(".pokemon-entry");

  for (let i = 0; i < pokemonEntry.length; i++) {
    let nameEntry = pokemonEntry[i].querySelector("h3");
    let pokemonName = nameEntry.textContent.toLowerCase();
    if (filterWord.length < 3) {
      pokemonEntry[i].style.display = "";
    } else {
      if (pokemonName.includes(filterWord)) {
        pokemonEntry[i].style.display = "";
      } else {
        pokemonEntry[i].style.display = "none";
      }
    }
  }
});

function createImagePromise(img) {
  if (img.complete) {
    return Promise.resolve();
  }

  return new Promise(function (resolve) {
    img.addEventListener("load", resolve);
    img.addEventListener("error", resolve);
  });
}

async function waitForImages(selector) {
  const images = document.querySelectorAll(selector);
  const promises = [];

  for (let i = 0; i < images.length; i++) {
    promises.push(createImagePromise(images[i]));
  }

  await Promise.all(promises);
}

function waitForPokemonImages() {
  return waitForImages(".pokemon-entry .image-preview");
}


