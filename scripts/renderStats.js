async function openDialog(newName, id, pokemonImage) {
  refDialogId = document.getElementById("dialog-id");
  id = Number(id);
  refDialogId.innerText = "# " + id;
  let refHeadline = document.getElementById("dialog-headline");
  refHeadline.innerText = newName;
  let refDialogImage = document.getElementById("dialog-image");
  refDialogImage.src = pokemonImage;
  let data = await getAndSavePokemon(id);
  refDialogType.innerHTML = "";
  setEvoAreaType(data);
  for (let i = 0; i < data.types.length; i++) {
    let pokemonType = data.types[i].type.name;
    addTypeColorToDialog(id);

    refDialogType.innerHTML += getGermanType(pokemonType);
  }

  dialogRef.showModal();
  renderDialogInfos(id);
  renderDialogButtonsTemplate(id);
  if (id <= 1) {
    const previousButton = document.getElementById("footer-previous-button");
    previousButton.style.display = "none";
  }
  renderStats(id);
  renderEvoChain(id);
  fetchAbilities(id + 1);
  preloadEvoForPokemon(id + 1);
  preloadEvoForPokemon(id - 1);
  preloadDialogImages(id + 1);
  preloadDialogImages(id - 1);
}

async function addTypeColorToDialog(id) {
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
    document.getElementById("evo-area").style.display = "none";
  }
}
dialogRef.addEventListener("click", closeDialog);

async function renderDialogInfos(id) {
  renderDialogMain(id);
  renderDialogShiny(id);
}

async function renderDialogMain(id) {
  renderPokemonHeight(id);
  renderPokemonWeight(id);
  renderBaseExperience(id);
  renderAbilities(id);
}

async function renderPokemonHeight(id) {
  let data = await getAndSavePokemon(id);
  let refPokemonHeight = document.getElementById("pokemonHeight");
  refPokemonHeight.innerText = (":  " + data.height / 10 + " m").replaceAll(".", ",");
}

async function renderPokemonWeight(id) {
  let data = await getAndSavePokemon(id);
  let refPokemonWeight = document.getElementById("pokemonWeight");
  refPokemonWeight.innerText = (":  " + data.weight / 10 + " kg").replaceAll(".", ",");
}

async function fetchAbilities(id) {
  let data = await getAndSavePokemon(id);
  if (!data) {
    return;
  }
  savedAbilities[id] = [];

  for (let i = 0; i < data.abilities.length; i++) {
    let abilityUrl = data.abilities[i].ability.url;
    let newResponse = await fetch(abilityUrl);
    let newData = await newResponse.json();

    for (let j = 0; j < newData.names.length; j++) {
      if (newData.names[j].language.name === "de") {
        newAbility = newData.names[j].name;
        savedAbilities[id].push(newAbility);
        break;
      }
    }
  }
}

function renderAbilities(id) {
  refAbilities.innerHTML = "";

  if (!savedAbilities[id] || savedAbilities[id].length === 0) {
    refAbilities.innerHTML = "Unbekannt";
    return;
  }

  for (let i = 0; i < savedAbilities[id].length; i++) {
    newAbility = savedAbilities[id][i];
    refAbilities.innerHTML += renderAbilitiesTemplate(newAbility);
  }
}

async function renderBaseExperience(id) {
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
  let data = await getAndSavePokemon(id);
  if (!data) {
    refShinyImage.src = "../assets/img/faq.png";
    return `../assets/img/faq.png`;
  }
  let shinyImage = data.sprites.other["official-artwork"].front_shiny;
  refShinyImage.src = shinyImage;
}

async function nextPokemon(id) {
  let nextId = id + 1;
  refDialogImageSection.classList = "";
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
  newName = allNames[nextId - 1];
  let nextData = await getAndSavePokemon(nextId);
  let nextPokemonImage = nextData.sprites.other["official-artwork"].front_default;
  openDialog(newName, nextId, nextPokemonImage);
}

async function previousPokemon(id) {
  let nextId = id - 1;
  refDialogImageSection.classList.remove(refDialogImageSection.classList);
  newName = allNames[nextId - 1];
  let nextData = await getAndSavePokemon(nextId);
  let nextPokemonImage = nextData.sprites.other["official-artwork"].front_default;
  openDialog(newName, nextId, nextPokemonImage);
}

function setActiveTab(activeId) {
  let buttons = document.querySelectorAll(".dialog-category-button");
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].classList.remove("active");
  }
  document.getElementById(activeId).classList.add("active");
}

async function getEvoChainForPokemon(id) {
  const speciesData = await getAndSaveImage(id);
  const evoUrl = speciesData.evolution_chain.url;
  const evoData = await getAndSaveEvoChain(evoUrl);
  return evoData.chain;
}

function getAllEvoNames(evoChain) {
  const names = [];
  collectNames(evoChain, names);
  return names;
}

async function preloadEvoForPokemon(id) {
  if (id < 1 || id > 1025) {
    return;
  }
  const chain = await getEvoChainForPokemon(id);
  const names = getAllEvoNames(chain);
  preloadArtworks(names);
}

async function preloadArtworks(names) {
  for (let i = 0; i < names.length; i++) {
    const data = await getAndSavePokemon(names[i]);
    if (!data) {
      continue;
    }
    const url = data.sprites.other["official-artwork"].front_default;
    if (!url) {
      continue;
    }
    const img = new Image();
    img.src = url;
  }
}

function preloadImage(url) {
  if (!url) {
    return;
  }

  const img = new Image();
  img.src = url;
}

async function preloadDialogImages(id) {
  if (id < 1 || id > 1025) {
    return;
  }

  const data = await getAndSavePokemon(id);
  if (!data) {
    return;
  }

  const normalUrl = data.sprites.other["official-artwork"].front_default;
  const shinyUrl = data.sprites.other["official-artwork"].front_shiny;

  preloadImage(normalUrl);
  preloadImage(shinyUrl);
}


function collectNames(evoChain, names) {
  names.push(evoChain.species.name);
  if (!evoChain.evolves_to) {
    return;
  }
  for (let i = 0; i < evoChain.evolves_to.length; i++) {
    collectNames(evoChain.evolves_to[i], names);
  }
}

async function loadEvoImage(pokeName, imgElement) {
  if (!pokeName) {
    imgElement.style.display = "none";
    return;
  }
  const data = await getAndSavePokemon(pokeName);
  imgElement.src = data.sprites.other["official-artwork"].front_default;
  imgElement.alt = pokeName;
  imgElement.style.display = "block";
}

async function renderEvoChain(id) {
  const chain = await getEvoChainForPokemon(id);
  const names = getAllEvoNames(chain);
  setupEvoAreaClass(chain);
  createEvoImages(names);
}


function setupEvoAreaClass(chain) {
  if (chain.species.name === "eevee") {
    evoArea.classList.add("evo-eevee");
  } else {
    evoArea.classList.remove("evo-eevee");
  }
}

function createEvoImages(names) {
  evoArea.innerHTML = "";

  for (let i = 0; i < names.length; i++) {
    const img = document.createElement("img");
    img.classList.add("evo-image");
    evoArea.appendChild(img);
    loadEvoImage(names[i], img);
  }
}

function removeEvoAreaType() {
  for (let i = 0; i < POKEMON_TYPES.length; i++) {
    evoArea.classList.remove(POKEMON_TYPES[i]);
  }
}

function setEvoAreaType(data) {
  removeEvoAreaType();
  const type = data.types[0].type.name;
  evoArea.classList.add(type);
}

async function renderStats(id) {
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
  refHp.title = "Kraftpunkte: " + actualStat;
}

function renderAttack(data) {
  const refAttack = document.getElementById("attack");
  let actualStat = data.stats[1].base_stat;
  const percent = getPercent(actualStat);
  refAttack.style.width = percent + "%";
  refAttack.title = "Angriffspunkte: " + actualStat;
}
function renderDefense(data) {
  const refDefense = document.getElementById("defense");
  let actualStat = data.stats[2].base_stat;
  const percent = getPercent(actualStat);
  refDefense.style.width = percent + "%";
  refDefense.title = "Verteidigungspunkte: " + actualStat;
}

function renderSpecialAttack(data) {
  const refSpecialAttack = document.getElementById("special-attack");
  let actualStat = data.stats[3].base_stat;
  const percent = getPercent(actualStat);
  refSpecialAttack.style.width = percent + "%";
  refSpecialAttack.title = "Spezial-Attacke: " + actualStat + " Punkte";
}

function renderSpecialDefense(data) {
  const refSpecialDefense = document.getElementById("special-defense");
  let actualStat = data.stats[4].base_stat;
  const percent = getPercent(actualStat);
  refSpecialDefense.style.width = percent + "%";
  refSpecialDefense.title = "Spezial-Verteidigung: " + actualStat + " Punkte";
}

function renderSpeed(data) {
  const refSpeed = document.getElementById("speed");
  let actualStat = data.stats[5].base_stat;
  const percent = getPercent(actualStat);
  refSpeed.style.width = percent + "%";
  refSpeed.title = "Initiative: " + actualStat + " Punkte";
}

function getPercent(actualStat) {
  let percent = actualStat / maxStat;
  percent = Math.round(percent * 100);
  return percent;
}