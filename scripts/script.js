let loadedIds = 0;
let startId = loadedIds;
const refContainer = document.getElementById("pokemon-listing");
const dialogRef = document.getElementById("image-dialog");
const refDialogImage = document.getElementById("dialog-image");
const refDialogImageSection = document.getElementById("dialog-image-section");
const refAbilities = document.getElementById("pokemonAbilities");
const refDialogType = document.getElementById("dialog-type");
const refShinyImage = document.getElementById("shiny-image");
const mainButton = document.getElementById("main-button");
const statsButton = document.getElementById("stats-button");
const shinyButton = document.getElementById("shiny-button");
const evoButton = document.getElementById("evo-button");
const inputFilter = document.getElementById("search-input");
let newName = "";
let refDialogId = 0;
let maxStat = 220;
let savedPokemon = {};
let savedImages = {};
let allNames = [];

async function init() {
  showLoadingSpinner();
  await loadPokemonInfos();
  hideLoadingSpinner();
}

async function loadPokemonInfos() {
  for (let id = 1; id <= startId + 15; id++) {
    loadedIds++;
    const pokemonImage = await getPokemonImage(id);
    await fetchData(id, pokemonImage);
  }
  startId = startId + 25;
}

async function getPokemonImage(id) {
//   let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
//   if (!response.ok) {
//     console.log("Image-Fehler bei der ID:", id, "Statuscode:", response.status);
//     return "../assets/img/faq.png";
//   } else {
    let data = await getAndSavePokemon(id);
    let pokemonImage = data.sprites.other["official-artwork"].front_default;
    return pokemonImage;
  }
// }

async function fetchData(id, pokemonImage) {
//   let response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}/`);
//   if (!response.ok) {
//     newName = "Unbekannt";
//   } else {
    let data = await getAndSaveImage(id);
    getGermanName(data, id);
//   }
  const pokemonType = await getPokemonType(id);
  refContainer.innerHTML += loadPokemonTemplate(newName, id, pokemonImage, pokemonType);
  getType(id);
}

function getGermanName(data, id) {
  let pokemon = data.names;
  for (let i = 0; i < pokemon.length; i++) {
    if (pokemon[i].language.name === "de") {
      newName = pokemon[i].name;
      allNames[id - 1] = newName;
      break;
    }
  }
}

async function getAndSavePokemon(id) {
    if (savedPokemon[id]) {
        return savedPokemon[id];
    }
    else{
      let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
      let data = await response.json();
      savedPokemon[id] = data;
      return data;  
    }
}

async function getAndSaveImage(id) {
    if (savedImages[id]) {
        return savedImages[id];
    }
    else{
      let response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}/`);
      let imageData = await response.json();
      savedImages[id] = imageData;
      return imageData;  
    }
}








async function getPokemonType(id) {
  let pokemonType = "";
//   let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
//   if (!response.ok) {
//     pokemonType = "Unbekannt";
//   } else {
    let data = await getAndSavePokemon(id);
    for (let i = 0; i < data.types.length; i++) {
      pokemonType = data.types[i].type.name;
      return pokemonType;
    }
  }
// }

function loadPokemonTemplate(newName, id, pokemonImage, pokemonType) {
  return `
    <div onclick="setActiveTab('main-button'); openDialog('${newName}', '${id}', '${pokemonImage}')" class="pokemon-entry">
        <header id="pokemon-entry-header-${id}">
            <span id="pokemon-id-${id}"># ${id}</span>
            <h3>${newName}</h3>
        </header>
        <section id="pokemon-entry-image-${id}"><img loading="lazy" class="${pokemonType} image-preview" src="${pokemonImage}" alt="${newName}"></section>
        <footer id="pokemon-entry-footer-${id}"></footer>
    </div>
        `;
}



async function loadMorePokemon() {
  showLoadingSpinner();
  for (let id = loadedIds + 1; id <= startId + 30; id++) {
    loadedIds++;
    if (loadedIds <= 1025) {
      const pokemonImage = await getPokemonImage(id);
      await fetchData(id, pokemonImage);
    } else {
      hideLoadingSpinner();
      return;
    }
  }
  hideLoadingSpinner();
  startId = startId + 30;
}



async function getType(id) {
  let pokemonType = "";
//   let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
//   if (!response.ok) {
//     console.log("Type-Fehler bei der ID:", id, "Statuscode:", response.status);
//     pokemonType = "unknown";
//     let germanType = document.getElementById(`pokemon-entry-footer-${id}`);
//     germanType.innerHTML += getGermanType(pokemonType);
//   } else {
    let data = await getAndSavePokemon(id);
    for (let i = 0; i < data.types.length; i++) {
      pokemonType = data.types[i].type.name;
      let germanType = document.getElementById(`pokemon-entry-footer-${id}`);
      germanType.innerHTML += getGermanType(pokemonType);
    }
    return pokemonType;
  }
// }

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

async function openDialog(newName, id, pokemonImage) {
  refDialogId = document.getElementById("dialog-id");
  refDialogId.innerText = "# " + id;
  let refHeadline = document.getElementById("dialog-headline");
  refHeadline.innerText = newName;
  let refDialogImage = document.getElementById("dialog-image");
  refDialogImage.src = pokemonImage;
//   let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
  let data = await getAndSavePokemon(id);
  refDialogType.innerHTML = "";
  for (let i = 0; i < data.types.length; i++) {
    let pokemonType = data.types[i].type.name;

    addTypeColorToDialog(id);

    refDialogType.innerHTML += getGermanType(pokemonType);
  }
  dialogRef.showModal();
  renderDialogInfos(id);
  renderDialogButtonsTemplate(id);
  renderStats(id);
//   setActiveTab("main-button");
}

async function addTypeColorToDialog(id) {
//   let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
  let data = await getAndSavePokemon(id);
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
    refShinyImage.innerText = "";
    dialogRef.close();
    document.getElementById("main-area").style.display = "block";
    document.getElementById("stats-area").style.display = "none";
    document.getElementById("shiny-area").style.display = "none";
  }
}
dialogRef.addEventListener("click", closeDialog);

async function renderDialogInfos(id) {
  renderDialogMain(id);
  // renderDialogStats();
  renderDialogShiny(id);
  
}

async function renderDialogMain(id) {
  renderAbilities(id);
  renderPokemonHeight(id);
  renderPokemonWeight(id);
  renderBaseExperience(id);
}

async function renderPokemonHeight(id) {
//   let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
  let data = await getAndSavePokemon(id);
  let refPokemonHeight = document.getElementById("pokemonHeight");
  refPokemonHeight.innerText = (":  " + data.height / 10 + " m").replaceAll(".", ",");
}

async function renderPokemonWeight(id) {
//   let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
  let data = await getAndSavePokemon(id);
  let refPokemonWeight = document.getElementById("pokemonWeight");
  refPokemonWeight.innerText = (":  " + data.weight / 10 + " kg").replaceAll(".", ",");
}

async function renderAbilities(id) {
//   let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
  //   if (!response.ok) {
  //     console.log("Species-Fehler bei der ID:",id,"Statuscode:",response.status);
  //     newName = "Unbekannt";
  //   } else {
  let data = await getAndSavePokemon(id);
  let abilities = "";
  refAbilities.innerHTML = "";
  for (let i = 0; i < data.abilities.length; i++) {
    let abilityUrl = data.abilities[i].ability.url;
    let newResponse = await fetch(abilityUrl);
    let newData = await newResponse.json();

    for (let j = 0; j < newData.names.length; j++) {
      if (newData.names[j].language.name === "de") {
        newAbility = newData.names[j].name;
        abilities += `<div class="ability" >${newAbility}</div>`;
      }
    }
  }
  refAbilities.innerHTML = abilities;
  //     }
  //   }
}

async function renderBaseExperience(id) {
//   let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
  let data = await getAndSavePokemon(id);
  let refPokemonBaseExperience = document.getElementById("base-experience");
  refPokemonBaseExperience.innerText = data.base_experience;
}

document.addEventListener("DOMContentLoaded", function () {
  mainButton.addEventListener("click", showMainArea);
  statsButton.addEventListener("click", showStatsArea);
  shinyButton.addEventListener("click", showShinyArea);
  evoButton.addEventListener("click", showEvoArea);
});

function showMainArea() {
  setActiveTab("main-button");
  document.getElementById("main-area").style.display = "block";
  document.getElementById("stats-area").style.display = "none";
  document.getElementById("shiny-area").style.display = "none";
  document.getElementById("evo-area").style.display = "none";
}

function showStatsArea() {
  setActiveTab("stats-button");
  document.getElementById("main-area").style.display = "none";
  document.getElementById("stats-area").style.display = "flex";
  document.getElementById("shiny-area").style.display = "none";
  document.getElementById("evo-area").style.display = "none";
}

function showShinyArea() {
  setActiveTab("shiny-button");
  document.getElementById("main-area").style.display = "none";
  document.getElementById("stats-area").style.display = "none";
  document.getElementById("shiny-area").style.display = "flex";
  document.getElementById("evo-area").style.display = "none";
}

function showEvoArea() {
  setActiveTab("evo-button");
  document.getElementById("main-area").style.display = "none";
  document.getElementById("stats-area").style.display = "none";
  document.getElementById("shiny-area").style.display = "none";
  document.getElementById("evo-area").style.display = "flex";
}

async function renderDialogShiny(id) {
//   let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
//   if (!response.ok) {
//     console.log("Image-Fehler bei der ID:", id, "Statuscode:", response.status);
//     return "../assets/img/faq.png";
//   } else {
    let data = await getAndSavePokemon(id);
    let shinyImage = data.sprites.other["official-artwork"].front_shiny;

    refShinyImage.src = shinyImage;
  }
// }

async function renderDialogButtonsTemplate(id) {
  const refDialogFooterButton = document.getElementById("dialog-footer-button");
  refDialogFooterButton.innerHTML = `<button class="button-arrow" aria-label="Vorheriges Pokemon" onclick="previousPokemon(${id})">
              <img src="./assets/icons/pikachu-arrow-left.png" alt="backwards arrow" />
            </button>
            <button class="button-arrow" aria-label="Nächstes Pokemon" onclick="nextPokemon(${id})">
              <img src="./assets/icons/pikachu-arrow-right.png" alt="forward arrow" />
            </button>`;
}

async function nextPokemon(id) {
  let nextId = id + 1; // ID vom nächsten Pokemon
  refDialogImageSection.classList = "";
//   let response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${nextId}/`);
  //   if (!response.ok) {
  //      console.log("Species-Fehler bei der ID:",id,"Statuscode:",response.status);
  //     newName = "Unbekannt";
  //   }
  //   else {
    if (!allNames[nextId - 1]) {
  let data = await getAndSaveImage(nextId);
  let pokemon = data.names;
  for (let i = 0; i < pokemon.length; i++) {
    if (pokemon[i].language.name === "de") {
      newName = pokemon[i].name;
      allNames[nextId - 1] = newName;
      break;
    }
  }
}
  //   }
//   let imageResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${nextId}/`);
  //   if (!imageResponse.ok) {
  //     console.log("Image-Fehler bei der ID:", id, "Statuscode:", imageResponse.status);
  //     return "../assets/img/faq.png";
  //   } else {
    newName = allNames[nextId - 1];
  let nextData = await getAndSavePokemon(nextId);
  let nextPokemonImage = nextData.sprites.other["official-artwork"].front_default;
  openDialog(newName, nextId, nextPokemonImage);
}

async function previousPokemon(id) {
  if (id <= 1) {
    return;
  } else {
    let nextId = id - 1; // ID vom nächsten Pokemon
    refDialogImageSection.classList.remove(refDialogImageSection.classList);
    // let response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${nextId}/`);


    //   if (!response.ok) {
    //      console.log("Species-Fehler bei der ID:",id,"Statuscode:",response.status);
    //     newName = "Unbekannt";
    //   }
    //   else {


    // let data = await response.json();
    // let pokemon = data.names;
    // for (let i = 0; i < allNames.length; i++) {
    //   if (pokemon[i].language.name === "de") {
        newName = allNames[nextId - 1];
        // allNames.push(newName);
        // break;
    //   }
    // }
    //   }
    // let imageResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${nextId}/`);
    //   if (!imageResponse.ok) {
    //     console.log("Image-Fehler bei der ID:", id, "Statuscode:", imageResponse.status);
    //     return "../assets/img/faq.png";
    //   } else {
    let nextData = await getAndSavePokemon(nextId);
    let nextPokemonImage = nextData.sprites.other["official-artwork"].front_default;
    openDialog(newName, nextId, nextPokemonImage);
  }
}

function setActiveTab(activeId) {
  let buttons = document.querySelectorAll(".dialog-category-button");
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].classList.remove("active");
  }
  document.getElementById(activeId).classList.add("active");
}

async function renderStats(id) {
//   let response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`);
  let data = await getAndSavePokemon(id);
  renderHp(data);
  renderAttack(data);
  renderDefense(data);
  renderSpecialAttack(data);
  renderSpecialDefense(data);
  renderSpeed(data);
}

function renderHp(data) {
  const refHp = document.getElementById("hp");
  let actualStat = data.stats[0].base_stat;
  const percent = getPercent(actualStat);
  refHp.style.width = percent + "%";
}

function renderAttack(data) {
  const refHp = document.getElementById("attack");
  let actualStat = data.stats[1].base_stat;
  const percent = getPercent(actualStat);
  refHp.style.width = percent + "%";
}
function renderDefense(data) {
  const refHp = document.getElementById("defense");
  let actualStat = data.stats[2].base_stat;
  const percent = getPercent(actualStat);
  refHp.style.width = percent + "%";
}

function renderSpecialAttack(data) {
  const refHp = document.getElementById("special-attack");
  let actualStat = data.stats[3].base_stat;
  const percent = getPercent(actualStat);
  refHp.style.width = percent + "%";
}

function renderSpecialDefense(data) {
  const refHp = document.getElementById("special-defense");
  let actualStat = data.stats[4].base_stat;
  const percent = getPercent(actualStat);
  refHp.style.width = percent + "%";
}

function renderSpeed(data) {
  const refHp = document.getElementById("speed");
  let actualStat = data.stats[5].base_stat;
  const percent = getPercent(actualStat);
  refHp.style.width = percent + "%";
}

function getPercent(actualStat) {
  let percent = actualStat / maxStat;
  percent = Math.round(percent * 100);
  return percent;
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
