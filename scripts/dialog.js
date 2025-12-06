async function openDialog(pokemonName, id, pokemonImage) {
  const numericId = Number(id);
  setDialogIdAndHeadline(pokemonName, numericId);
  setDialogImage(pokemonImage);
  const data = await getAndSavePokemon(numericId);
  prepareDialogTypeArea(data, numericId);
  dialogRef.showModal();
  await renderCompleteDialog(numericId);
}

function setDialogIdAndHeadline(pokemonName, id) {
  const refDialogId = document.getElementById("dialog-id");
  refDialogId.innerText = "# " + id;
  const refHeadline = document.getElementById("dialog-headline");
  refHeadline.innerText = pokemonName;
}

function setDialogImage(pokemonImage) {
  const refDialogImage = document.getElementById("dialog-image");
  refDialogImage.src = pokemonImage;
}

function prepareDialogTypeArea(data, id) {
  refDialogType.innerHTML = "";
  setEvoAreaType(data);
  for (let i = 0; i < data.types.length; i++) {
    const pokemonType = data.types[i].type.name;
    addTypeColorToDialog(id);
    refDialogType.innerHTML += getGermanType(pokemonType);
  }
}

async function renderCompleteDialog(id) {
  await renderDialogInfos(id);
  renderDialogButtonsTemplate(id);
  updateNavButtonsVisibility(id);
  renderStats(id);
  renderEvoChain(id);
  // fetchAbilities(id); 
  fetchAbilities(id + 1);
  preloadEvoPokemon(id + 1);
  preloadDialogImages(id + 1);
}


async function addTypeColorToDialog(id) {
  const data = await getAndSavePokemon(id);
  for (let i = 0; i < data.types.length; i++) {
    const pokemonType = data.types[i].type.name;
    refDialogImageSection.classList.add(pokemonType);
    break;
  }
}

function closeDialog(event) {
  if (event.target === dialogRef) {
    refDialogType.innerHTML = "";
    refDialogImageSection.classList.remove(refDialogImageSection.classList);
    refAbilities.innerText = "";
    refShinyImage.innerText = "";
    dialogRef.close();
    setActiveTab("main-button");
    document.getElementById("main-area").style.display = "block";
    document.getElementById("stats-area").style.display = "none";
    document.getElementById("shiny-area").style.display = "none";
    document.getElementById("evo-area").style.display = "none";
  }
}
dialogRef.addEventListener("click", closeDialog);

async function renderDialogInfos(id) {
  await renderDialogBaseInfo(id);
  await renderDialogShiny(id);
}

async function renderDialogBaseInfo(id) {
   await renderPokemonHeight(id);
  await renderPokemonWeight(id);
  await renderBaseExperience(id);
  await fetchAbilities(id);
  renderAbilities(id);
}

async function renderPokemonHeight(id) {
  const data = await getAndSavePokemon(id);
  const refPokemonHeight = document.getElementById("pokemonHeight");
  refPokemonHeight.innerText = (":  " + data.height / 10 + " m").replaceAll(".", ",");
}

async function renderPokemonWeight(id) {
  const data = await getAndSavePokemon(id);
  const refPokemonWeight = document.getElementById("pokemonWeight");
  refPokemonWeight.innerText = (":  " + data.weight / 10 + " kg").replaceAll(".", ",");
}

async function fetchAbilities(id) {
  if (savedAbilities[id] && savedAbilities[id].length > 0) {
    return;
  }
  const data = await getAndSavePokemon(id);
  if (!data) {
    return;
  }
  savedAbilities[id] = [];
  for (let i = 0; i < data.abilities.length; i++) {
    const abilityUrl = data.abilities[i].ability.url;
    const newResponse = await fetch(abilityUrl);
    const newData = await newResponse.json();

    for (let j = 0; j < newData.names.length; j++) {
      if (newData.names[j].language.name === "de") {
        const newAbility = newData.names[j].name;
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
    const newAbility = savedAbilities[id][i];
    refAbilities.innerHTML += renderAbilitiesTemplate(newAbility);
  }
}

async function renderBaseExperience(id) {
  const data = await getAndSavePokemon(id);
  const refPokemonBaseExperience = document.getElementById("base-experience");
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
  const data = await getAndSavePokemon(id);
  if (!data) {
    refShinyImage.src = "../assets/img/faq.png";
    return `../assets/img/faq.png`;
  }
  const shinyImage = data.sprites.other["official-artwork"].front_shiny;
  refShinyImage.src = shinyImage;
}

async function nextPokemon(id) {
  const nextId = getNextDialogId(id);
  if (!nextId) {
    return;
  }
  refDialogImageSection.classList = "";
  const pokemonNameForDialog = await ensurePokemonNameLoaded(nextId);
  const nextData = await getAndSavePokemon(nextId);
  const nextPokemonImage = nextData.sprites.other["official-artwork"].front_default;
  openDialog(pokemonNameForDialog, nextId, nextPokemonImage);
}

function getNextDialogId(id) {
  if (filteredIds.length === 0) {
    return id + 1;
  }
  const index = filteredIds.indexOf(id);
  if (index === -1) {
    return id + 1;
  }
  if (index === filteredIds.length - 1) {
    return null;
  }
  return filteredIds[index + 1];
}

function getPreviousDialogId(id) {
  if (filteredIds.length === 0) {
    return id <= 1 ? null : id - 1;
  }
  const index = filteredIds.indexOf(id);
  if (index === -1) {
    return id <= 1 ? null : id - 1;
  }
  if (index === 0) {
    return null;
  }
  return filteredIds[index - 1];
}


async function ensurePokemonNameLoaded(id) {
  if (!allNames[id - 1]) {
    const speciesData = await getAndSaveImage(id);
    const names = speciesData.names;
    for (let i = 0; i < names.length; i++) {
      if (names[i].language.name === "de") {
        allNames[id - 1] = names[i].name;
        break;
      }
    }
  }
  return allNames[id - 1];
}

async function previousPokemon(id) {
  const previousId = getPreviousDialogId(id);
  if (!previousId) {
    return;
  }
  refDialogImageSection.classList = "";
  const pokemonNameForDialog = await ensurePokemonNameLoaded(previousId);
  const previousData = await getAndSavePokemon(previousId);
  const previousPokemonImage = previousData.sprites.other["official-artwork"].front_default;
  openDialog(pokemonNameForDialog, previousId, previousPokemonImage);
}

function updateNavButtonsVisibility(id) {
  let previousId = getPreviousDialogId(id);
  let nextId = getNextDialogId(id);
  const previousButton = document.getElementById("footer-previous-button");
  const nextButton = document.getElementById("footer-next-button");
  previousButton.style.display = previousId ? "block" : "none";
  nextButton.style.display = nextId ? "block" : "none";
}

function setActiveTab(activeId) {
  const buttons = document.querySelectorAll(".dialog-category-button");
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
  collectEvoNames(evoChain, names);
  return names;
}

async function preloadEvoPokemon(id) {
  if (id < 1 || id > 1025) {
    return;
  }
  const evoChain = await getEvoChainForPokemon(id);
  const evoNames = getAllEvoNames(evoChain);
  preloadArtworksByNames(evoNames);
}

async function preloadArtworksByNames(names) {
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

function collectEvoNames(evoChain, names) {
  names.push(evoChain.species.name);
  if (!evoChain.evolves_to) {
    return;
  }
  for (let i = 0; i < evoChain.evolves_to.length; i++) {
    collectEvoNames(evoChain.evolves_to[i], names);
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
  const evoChain = await getEvoChainForPokemon(id);
  const evoNames = getAllEvoNames(evoChain);
  setClassForEevee(evoChain);
  createEvoImages(evoNames);
}

function setClassForEevee(chain) {
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
  const data = await getAndSavePokemon(id);
  renderHp(data);
  renderAttack(data);
  renderDefense(data);
  renderSpecialAttack(data);
  renderSpecialDefense(data);
  renderSpeed(data);
}

function renderHp(data) {
  const refHp = document.getElementById("hp");
  const actualStat = data.stats[0].base_stat;
  const percent = getPercent(actualStat);
  refHp.style.width = percent + "%";
  refHp.title = "Kraftpunkte: " + actualStat;
}

function renderAttack(data) {
  const refAttack = document.getElementById("attack");
  const actualStat = data.stats[1].base_stat;
  const percent = getPercent(actualStat);
  refAttack.style.width = percent + "%";
  refAttack.title = "Angriffspunkte: " + actualStat;
}
function renderDefense(data) {
  const refDefense = document.getElementById("defense");
  const actualStat = data.stats[2].base_stat;
  const percent = getPercent(actualStat);
  refDefense.style.width = percent + "%";
  refDefense.title = "Verteidigungspunkte: " + actualStat;
}

function renderSpecialAttack(data) {
  const refSpecialAttack = document.getElementById("special-attack");
  const actualStat = data.stats[3].base_stat;
  const percent = getPercent(actualStat);
  refSpecialAttack.style.width = percent + "%";
  refSpecialAttack.title = "Spezial-Attacke: " + actualStat + " Punkte";
}

function renderSpecialDefense(data) {
  const refSpecialDefense = document.getElementById("special-defense");
  const actualStat = data.stats[4].base_stat;
  const percent = getPercent(actualStat);
  refSpecialDefense.style.width = percent + "%";
  refSpecialDefense.title = "Spezial-Verteidigung: " + actualStat + " Punkte";
}

function renderSpeed(data) {
  const refSpeed = document.getElementById("speed");
  const actualStat = data.stats[5].base_stat;
  const percent = getPercent(actualStat);
  refSpeed.style.width = percent + "%";
  refSpeed.title = "Initiative: " + actualStat + " Punkte";
}

function getPercent(actualStat) {
  let percent = actualStat / maxStat;
  percent = Math.round(percent * 100);
  return percent;
}
