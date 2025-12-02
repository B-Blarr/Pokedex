function loadPokemonTemplate(newName, id, pokemonImage, pokemonType) {
  return `
    <div onclick="setActiveTab('main-button'); openDialog('${newName}', '${id}', '${pokemonImage}')" class="pokemon-entry">
      <header id="pokemon-entry-header-${id}">
        <span id="pokemon-id-${id}">
          <span class="id-sign">#</span> ${id}
        </span>
        <h3>${newName}</h3>
      </header>
      <section id="pokemon-entry-image-${id}">
        <img class="${pokemonType} image-preview" src="${pokemonImage}" alt="${newName}">
      </section>
      <footer id="pokemon-entry-footer-${id}"></footer>
    </div>
  `;
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

async function renderDialogButtonsTemplate(id) {
  const refDialogFooterButton = document.getElementById("dialog-footer-button");
  refDialogFooterButton.innerHTML = `
    <button class="button-arrow" aria-label="Vorheriges Pokemon" onclick="previousPokemon(${id})">
      <img id="footer-previous-button" src="./assets/icons/pikachu-arrow-left.png" alt="backwards arrow" />
    </button>
    <button class="button-arrow" aria-label="Nächstes Pokemon" onclick="nextPokemon(${id})">
      <img src="./assets/icons/pikachu-arrow-right.png" alt="forward arrow" />
    </button>`;
}

function renderAbilitiesTemplate(newAbility) {
  return `
    <div class="ability">${newAbility}</div>
  `;
}