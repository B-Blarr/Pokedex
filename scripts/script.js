const refContainer = document.getElementById("pokemon-listing");

async function init() {
    showLoadingSpinner();
    await loadPokemonInfos();
    hideLoadingSpinner();
}

async function fetchName(id, pokemonImage) {
  let newName = "";
  let response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}/`);
  let data = await response.json();
  let pokemon = data.names;
  for (let i = 0; i < pokemon.length; i++) {
    if (pokemon[i].language.name === "de") {
      newName = pokemon[i].name;
      break;
    }
   
}
 refContainer.innerHTML += loadPokemonTemplate(newName, id, pokemonImage);
  const pokemonType = await getType(id);
}
  
  function loadPokemonTemplate(newName, id, pokemonImage) {
  return`
            <div class="pokemon-entry">
                <header id="pokemon-entry-header[${id}]">
                   <span id="pokemon-id[${id}]"># ${id}</span>
                   <h3>${newName}</h3>
                </header>
                <section id="pokemon-entry-image[${id}]"><img src="${pokemonImage}" alt="${newName}"></section>
                <footer id="pokemon-entry-footer[${id}]"></footer>
            </div>
        `;
}

async function loadPokemonInfos() {
  for (let id = 1; id <= 15; id++) {
    const pokemonImage = await getPokemonImage(id);
    await fetchName(id, pokemonImage);
    
  }
}

async function getPokemonImage(id) {
  let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
  let data = await response.json();
  let pokemonImage = data.sprites.other["official-artwork"].front_default;
  return pokemonImage;
}


async function getType(id) {
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
    let data = await response.json();
    for (let i = 0; i < data.types.length; i++) {
        let pokemonType = data.types[i].type.name;
        let germanType = document.getElementById(`pokemon-entry-footer[${id}]`);
        germanType.innerHTML += getGermanType(pokemonType);
    }
    
}

function getGermanType(pokemonType) {
    if (pokemonType == "grass") return `<div>Pflanze</div>`;
  if (pokemonType === "normal") return `<div>Normal</div>`;
  if (pokemonType === "fighting") return `<div>Kampf`;
  if (pokemonType === "flying") return `<div>Flug</div>`;
  if (pokemonType === "poison") return `<div>Gift</div>`;
  if (pokemonType === "ground") return `<div>Boden</div>`;
  if (pokemonType === "rock") return `<div>Gestein</div>`;
  if (pokemonType === "bug") return `<div>Käfer</div>`;
  if (pokemonType === "ghost") return `<div>Geist</div>`;
  if (pokemonType === "steel") return `<div>Stahl</div>`;
  if (pokemonType === "fire") return `<div>Feuer</div>`;
  if (pokemonType === "water") return `<div>Wasser</div>`;
  if (pokemonType === "electric") return `<div>Elektro</div>`;
  if (pokemonType === "psychic") return `<div>Psycho</div>`;
  if (pokemonType === "ice") return `<div>Eis</div>`;
  if (pokemonType === "dragon") return `<div>Drache</div>`;
  if (pokemonType === "dark") return `<div>Dunkel</div>`;
  if (pokemonType === "fairy") return `<div>Fee</div>`;
  if (pokemonType === "stellar") return `<div>??</div>`;
  if (pokemonType === "unknown") return `<div>Unbekannt</div>`;
}

function showLoadingSpinner() {
  document.getElementById("loading-overlay").style.display = "flex";
}

function hideLoadingSpinner() {
  document.getElementById("loading-overlay").style.display = "none";
}

