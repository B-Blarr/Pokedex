
let loadedIds = 0;
let startId = loadedIds;
const refContainer = document.getElementById("pokemon-listing");

async function init() {
    showLoadingSpinner();
    await loadPokemonInfos();
    hideLoadingSpinner();
}

async function fetchName(id, pokemonImage) {
  let newName = "";
  let response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}/`);
  if (!response.ok) {
    console.log("Species-Fehler bei der ID:", id, "Statuscode:", response.status);
    newName = "Unbekannt";
  }else{
  let data = await response.json();
  let pokemon = data.names;
  for (let i = 0; i < pokemon.length; i++) {
    if (pokemon[i].language.name === "de") {
      newName = pokemon[i].name;
      break;
    }
    }
}
  const pokemonType = await getPokemonType(id);
 refContainer.innerHTML += loadPokemonTemplate(newName, id, pokemonImage, pokemonType);
getType(id);
}
async function getPokemonType(id) {
    let pokemonType = "";
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
    if (!response.ok) {
        console.log("Type-Fehler bei der ID:", id, "Statuscode:", response.status);
        pokemonType = "Unbekannt";}
        else{
    let data = await response.json();
    for (let i = 0; i < data.types.length; i++) {
        pokemonType = data.types[i].type.name;
        return pokemonType;
    }
}
}

  function loadPokemonTemplate(newName, id, pokemonImage, pokemonType) {
return`
    <div class="pokemon-entry">
        <header id="pokemon-entry-header-${id}">
            <span id="pokemon-id-${id}"># ${id}</span>
            <h3>${newName}</h3>
        </header>
        <section id="pokemon-entry-image-${id}"><img class="${pokemonType}" src="${pokemonImage}" alt="${newName}"></section>
        <footer id="pokemon-entry-footer-${id}"></footer>
    </div>
        `;
}

async function loadPokemonInfos() {
  for (let id = 1; id <= startId + 25; id++) {
    loadedIds++;
    const pokemonImage = await getPokemonImage(id);
    await fetchName(id, pokemonImage);
    
  }
  startId = startId + 25;
}

async function loadMorePokemon() {
    showLoadingSpinner();
    for (let id = loadedIds + 1; id <= startId + 40; id++) {
        loadedIds++;
    const pokemonImage = await getPokemonImage(id);
    await fetchName(id, pokemonImage);
    
  }
  hideLoadingSpinner();
  startId = startId + 10;
}

async function getPokemonImage(id) {
  let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
  if (!response.ok) {
    console.log("Image-Fehler bei der ID:", id, "Statuscode:", response.status);
    return "../assets/img/faq.png";
  }
  else{
  let data = await response.json();
  let pokemonImage = data.sprites.other["official-artwork"].front_default;
  return pokemonImage;
}
}

async function getType(id) {
    let pokemonType = "";
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
    if (!response.ok) {
        console.log("Type-Fehler bei der ID:", id, "Statuscode:", response.status);
       pokemonType = "unknown";
       let germanType = document.getElementById(`pokemon-entry-footer-${id}`);
       germanType.innerHTML += getGermanType(pokemonType);
    }
    else{
    let data = await response.json();
    for (let i = 0; i < data.types.length; i++) {
        pokemonType = data.types[i].type.name;
        let germanType = document.getElementById(`pokemon-entry-footer-${id}`);
        germanType.innerHTML += getGermanType(pokemonType);
    }
    return pokemonType;
}
}

function getGermanType(pokemonType) {
  if (pokemonType == "grass") return `<div class='type grass'>Pflanze</div>`;
  if (pokemonType === "normal") return `<div class='type normal'>Normal</div>`;
  if (pokemonType === "fighting") return `<div class='type fighting'>Kampf</div>`;
  if (pokemonType === "flying") return `<div class='type flying'>Flug</div>`;
  if (pokemonType === "poison") return `<div class='type poison'>Gift</div>`;
  if (pokemonType === "ground") return `<div class='type ground'>Boden</div>`;
  if (pokemonType === "rock") return `<div class='type rock'>Gestein</div>`;
  if (pokemonType === "bug") return `<div class='type bug'>Käfer</div>`;
  if (pokemonType === "ghost") return `<div class='type ghost'>Geist</div>`;
  if (pokemonType === "steel") return `<div class='type steel'>Stahl</div>`;
  if (pokemonType === "fire") return `<div class='type fire'>Feuer</div>`;
  if (pokemonType === "water") return `<div class='type water'>Wasser</div>`;
  if (pokemonType === "electric") return `<div class='type electric'>Elektro</div>`;
  if (pokemonType === "psychic") return `<div class='type psychic'>Psycho</div>`;
  if (pokemonType === "ice") return `<div class='type ice'>Eis</div>`;
  if (pokemonType === "dragon") return `<div class='type dragon'>Drache</div>`;
  if (pokemonType === "dark") return `<div class='type dark'>Unlicht</div>`;
  if (pokemonType === "fairy") return `<div class='type fairy'>Fee</div>`;
  if (pokemonType === "stellar") return `<div class='type stellar'>Stellar</div>`;
  if (pokemonType === "unknown") return `<div class='type unknown'>Unbekannt</div>`;
}

function showLoadingSpinner() {
  document.getElementById("loading-overlay").style.display = "flex";
}

function hideLoadingSpinner() {
  document.getElementById("loading-overlay").style.display = "none";
}

