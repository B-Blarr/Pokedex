const refContainer = document.getElementById("pokemon-listing");

function init() {
  loadPokemonInfos();
  
}

async function fetchName(id, pokemonImage) {
  let newName = "";
  let response = await fetch(
    `https://pokeapi.co/api/v2/pokemon-species/${id}/`
  );
  let data = await response.json();
  let pokemon = data.names;
  for (let i = 0; i < pokemon.length; i++) {
    if (pokemon[i].language.name === "de") {
      newName = pokemon[i].name;
      console.log(newName);
      break;
    }
  }

  refContainer.innerHTML += `
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
  for (let id = 1; id <= 30; id++) {
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
