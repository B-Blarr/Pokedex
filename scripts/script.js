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
const inputMessage = document.getElementById("input-message");
const POKEMON_TYPES = ["grass","normal","fighting","flying","poison","ground",
                       "rock","bug","ghost","steel","fire","water","electric",
                       "psychic","ice","dragon","dark","fairy","stellar","unknown",];
const maxStat = 220;
const savedPokemon = {};
const savedImages = {};
const savedEvoChain = {};
const savedAbilities = {};
const allNames = [];

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
    const id = i + 1;
    refContainer.innerHTML += templates[i];
    getType(id);
  }
  startId = maxLoads;
}

async function loadPokemonEntry(id) {
  const pokemonImage = await getPokemonImage(id);
  const template = await fetchData(id, pokemonImage);
  fetchAbilities(id);
  return template;
}

async function getPokemonImage(id) {
  const data = await getAndSavePokemon(id);
  if (!data) {
    return `../assets/img/faq.png`;
  }
  const pokemonImage = data.sprites.other["official-artwork"].front_default;
  return pokemonImage;
}

async function fetchData(id, pokemonImage) {
  const data = await getAndSaveImage(id);
  let name = "Unbekannt";
  let pokemonType = "unknown";

  if (data) {
    name = getGermanName(data, id);
    pokemonType = await getPokemonType(id);
  }
  return loadPokemonTemplate(name, id, pokemonImage, pokemonType);
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
  const data = await getAndSavePokemon(id);
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
  const maxId = 1025;
  const limit = getNextLimit(maxId);
  const firstId = getFirstNewId();
  const pokemonLoadPromises = createPokemonLoadPromises(firstId, limit);
  const templates = await Promise.all(pokemonLoadPromises);
  appendNewPokemon(templates, firstId);
  startId = limit;
  await waitForPokemonImages();
  hideLoadingSpinner();
}

function getNextLimit(maxId) {
  const limit = Math.min(startId + 15, maxId);
  return limit;
}

function getFirstNewId() {
  const firstId = loadedIds + 1;
  return firstId;
}

function createPokemonLoadPromises(firstId, limit) {
  const pokemonLoadPromises = [];
  for (let id = firstId; id <= limit; id++) {
    loadedIds++;
    pokemonLoadPromises.push(loadPokemonEntry(id));
  }
  return pokemonLoadPromises;
}

function appendNewPokemon(templates, firstId) {
  for (let i = 0; i < templates.length; i++) {
    const id = firstId + i;
    refContainer.innerHTML += templates[i];
    getType(id);
  }
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

inputFilter.addEventListener("input", handleInputFilter);

function handleInputFilter(event) {
  const filterWord = event.target.value.toLowerCase().trim();
  const hasMatch = filterPokemonEntries(filterWord);
  updateInputMessage(filterWord, hasMatch);
}

function filterPokemonEntries(filterWord) {
  const pokemonEntries = document.querySelectorAll(".pokemon-entry");
  let hasMatch = false;
  for (let i = 0; i < pokemonEntries.length; i++) {
    const nameEntry = pokemonEntries[i].querySelector("h3");
    const pokemonName = nameEntry.textContent.toLowerCase();
    if (isFilterTooShort(filterWord)) {
      pokemonEntries[i].style.display = "";
    } else if (pokemonName.includes(filterWord)) {
      pokemonEntries[i].style.display = "";
      hasMatch = true;
    } else {
      pokemonEntries[i].style.display = "none";
    }
  }
  return hasMatch;
}

function isFilterTooShort(filterWord) {
  return filterWord.length > 0 && filterWord.length < 3;
}

function updateInputMessage(filterWord, hasMatch) {
  if (isFilterTooShort(filterWord)) {
    inputMessage.innerText = "Bitte gib mehr als 3 Buchstaben ein.";
  } else if (!hasMatch && filterWord.length > 0) {
    inputMessage.innerText = "Der Name wurde leider nicht gefunden.";
  } else {
    inputMessage.innerText = "";
  }
}

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
