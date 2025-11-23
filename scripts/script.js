let loadedIds = 0;
let startId = loadedIds;
const refContainer = document.getElementById("pokemon-listing");
const dialogRef = document.getElementById("image-dialog");
let refDialogImage = document.getElementById("dialog-image");
let refDialogImageSection = document.getElementById("dialog-image-section");
let refAbilities = document.getElementById("pokemonAbilities");
let refDialogId = 0;
let currentPokemon = [];

async function init() {
  showLoadingSpinner();
  await loadPokemonInfos();
  hideLoadingSpinner();
}

async function fetchName(id, pokemonImage) {
  let newName = "";
  let response = await fetch(
    `https://pokeapi.co/api/v2/pokemon-species/${id}/`
  );
  if (!response.ok) {
    console.log(
      "Species-Fehler bei der ID:",
      id,
      "Statuscode:",
      response.status
    );
    newName = "Unbekannt";
  } else {
    let data = await response.json();
    let pokemon = data.names;
    for (let i = 0; i < pokemon.length; i++) {
      if (pokemon[i].language.name === "de") {
        newName = pokemon[i].name;
        currentPokemon.push(newName);
        break;
      }
    }
  }
  const pokemonType = await getPokemonType(id);
  refContainer.innerHTML += loadPokemonTemplate(
    newName,
    id,
    pokemonImage,
    pokemonType
  );
  getType(id);
}

async function getPokemonType(id) {
  let pokemonType = "";
  let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
  if (!response.ok) {
    console.log("Type-Fehler bei der ID:", id, "Statuscode:", response.status);
    pokemonType = "Unbekannt";
  } else {
    let data = await response.json();
    for (let i = 0; i < data.types.length; i++) {
      pokemonType = data.types[i].type.name;
      return pokemonType;
    }
  }
}

function loadPokemonTemplate(newName, id, pokemonImage, pokemonType) {
  return `
    <div onclick="openDialog('${newName}', '${id}', '${pokemonImage}')" class="pokemon-entry">
        <header id="pokemon-entry-header-${id}">
            <span id="pokemon-id-${id}"># ${id}</span>
            <h3>${newName}</h3>
        </header>
        <section id="pokemon-entry-image-${id}"><img class="${pokemonType} image-preview" src="${pokemonImage}" alt="${newName}"></section>
        <footer id="pokemon-entry-footer-${id}"></footer>
    </div>
        `;
}

async function loadPokemonInfos() {
  for (let id = 1; id <= startId + 15; id++) {
    loadedIds++;
    const pokemonImage = await getPokemonImage(id);
    await fetchName(id, pokemonImage);
  }
  startId = startId + 25;
}

async function loadMorePokemon() {
  showLoadingSpinner();
  for (let id = loadedIds + 1; id <= startId + 80; id++) {
    loadedIds++;
    if (loadedIds <= 1025) {
      const pokemonImage = await getPokemonImage(id);
      await fetchName(id, pokemonImage);
    } else {
      hideLoadingSpinner();
      return;
    }
  }
  hideLoadingSpinner();
  startId = startId + 80;
}

async function getPokemonImage(id) {
  let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
  if (!response.ok) {
    console.log("Image-Fehler bei der ID:", id, "Statuscode:", response.status);
    return "../assets/img/faq.png";
  } else {
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
  } else {
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
  if (pokemonType === "fighting")
    return `<div class='type fighting'>Kampf</div>`;
  if (pokemonType === "flying") return `<div class='type flying'>Flug</div>`;
  if (pokemonType === "poison") return `<div class='type poison'>Gift</div>`;
  if (pokemonType === "ground") return `<div class='type ground'>Boden</div>`;
  if (pokemonType === "rock") return `<div class='type rock'>Gestein</div>`;
  if (pokemonType === "bug") return `<div class='type bug'>Käfer</div>`;
  if (pokemonType === "ghost") return `<div class='type ghost'>Geist</div>`;
  if (pokemonType === "steel") return `<div class='type steel'>Stahl</div>`;
  if (pokemonType === "fire") return `<div class='type fire'>Feuer</div>`;
  if (pokemonType === "water") return `<div class='type water'>Wasser</div>`;
  if (pokemonType === "electric")
    return `<div class='type electric'>Elektro</div>`;
  if (pokemonType === "psychic")
    return `<div class='type psychic'>Psycho</div>`;
  if (pokemonType === "ice") return `<div class='type ice'>Eis</div>`;
  if (pokemonType === "dragon") return `<div class='type dragon'>Drache</div>`;
  if (pokemonType === "dark") return `<div class='type dark'>Unlicht</div>`;
  if (pokemonType === "fairy") return `<div class='type fairy'>Fee</div>`;
  if (pokemonType === "stellar")
    return `<div class='type stellar'>Stellar</div>`;
  if (pokemonType === "unknown")
    return `<div class='type unknown'>Unbekannt</div>`;
}

function showLoadingSpinner() {
  document.getElementById("loading-overlay").style.display = "flex";
}

function hideLoadingSpinner() {
  document.getElementById("loading-overlay").style.display = "none";
}

async function openDialog(newName, id, pokemonImage) {
  refDialogId = document.getElementById("dialog-id");
  refDialogId.innerText = "# " + id;
  let refHeadline = document.getElementById("dialog-headline");
  refHeadline.innerText = newName;
  let refDialogImage = document.getElementById("dialog-image");
  refDialogImage.src = pokemonImage;
  let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
  let data = await response.json();
  for (let i = 0; i < data.types.length; i++) {
    let pokemonType = data.types[i].type.name;
    let refDialogType = document.getElementById("dialog-type");
    addTypeColorToDialog(id);
    refDialogType.innerHTML += getGermanType(pokemonType);
  }
  dialogRef.showModal();
  renderDialogInfos(id);
}

async function addTypeColorToDialog(id) {
  let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
  let data = await response.json();
  for (let i = 0; i < data.types.length; i++) {
    let pokemonType = data.types[i].type.name;
    refDialogImageSection.classList.add(pokemonType);
    break;
  }
}

function closeDialog(event) {
  if (event.target === dialogRef) {
    let refDialogType = document.getElementById("dialog-type");
    refDialogType.innerHTML = "";
    refDialogImageSection.classList.remove(refDialogImageSection.classList);
    refAbilities.innerText = "";
    dialogRef.close();
  }
}
dialogRef.addEventListener("click", closeDialog);

async function renderDialogInfos(id) {
  renderDialogMain(id);
  // renderDialogStats();
  renderDialogShiny(id);
}

async function renderDialogMain(id) {
  renderPokemonHeight(id);
  renderPokemonWeight(id);
  renderAbilities(id);
  renderBaseExperience(id);
}

async function renderPokemonHeight(id) {
  let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
  let data = await response.json();
  let refPokemonHeight = document.getElementById("pokemonHeight");
  refPokemonHeight.innerText = (":  " + data.height / 10 + " m").replaceAll(
    ".",
    ","
  );
}

async function renderPokemonWeight(id) {
  let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
  let data = await response.json();
  let refPokemonWeight = document.getElementById("pokemonWeight");
  refPokemonWeight.innerText = (":  " + data.weight / 10 + " kg").replaceAll(
    ".",
    ","
  );
}

async function renderAbilities(id) {
  let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
  //   if (!response.ok) {
  //     console.log("Species-Fehler bei der ID:",id,"Statuscode:",response.status);
  //     newName = "Unbekannt";
  //   } else {
  let data = await response.json();

  for (let i = 0; i < data.abilities.length; i++) {
    let abilityUrl = data.abilities[i].ability.url;
    let newResponse = await fetch(abilityUrl);
    let newData = await newResponse.json();
    for (let j = 0; j < newData.names.length; j++) {
      if (newData.names[j].language.name === "de") {
        newAbility = newData.names[j].name;
        refAbilities.innerHTML += `<div class="ability" >${newAbility}</div>`;
      }
    }
  }
  //     }
  //   }
}

async function renderBaseExperience(id) {
  let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
  let data = await response.json();
  let refPokemonBaseExperience = document.getElementById("base-experience");
  refPokemonBaseExperience.innerText = data.base_experience;
}

document.addEventListener("DOMContentLoaded", function () {
  const mainButton  = document.getElementById("main-button");
  const statsButton = document.getElementById("stats-button");
  const shinyButton = document.getElementById("shiny-button");

  mainButton.addEventListener("click", showMainArea);
  statsButton.addEventListener("click", showStatsArea);
  shinyButton.addEventListener("click", showShinyArea);
});

function showMainArea() {
  document.getElementById("main-area").style.display = "block";
  document.getElementById("stats-area").style.display = "none";
  document.getElementById("shiny-area").style.display = "none";
}

function showStatsArea() {
  document.getElementById("main-area").style.display = "none";
  document.getElementById("stats-area").style.display = "block";
  document.getElementById("shiny-area").style.display = "none";
}

function showShinyArea() {
  document.getElementById("main-area").style.display = "none";
  document.getElementById("stats-area").style.display = "none";
  document.getElementById("shiny-area").style.display = "flex";
}

async function renderDialogShiny(id) {
    
    let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
  if (!response.ok) {
    console.log("Image-Fehler bei der ID:", id, "Statuscode:", response.status);
    return "../assets/img/faq.png";
  } else {
    let data = await response.json();
    let shinyImage = data.sprites.other["official-artwork"].front_shiny;
    const refShinyImage = document.getElementById("shiny-image");
    refShinyImage.src = shinyImage;
  }
}

