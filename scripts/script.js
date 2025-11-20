


const refContainer = document.getElementById("pokemon-listing");


function init() {
    loadGermanName();
    // fetchName();





}

async function fetchName(id) {
    
    let newName = "";
        let response = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}/`);
    let data = await response.json();
   let pokemon = data.names;
    for (let i = 0; i < pokemon.length; i++) {
    if (pokemon[i].language.name === "de") {
        newName =  pokemon[i].name;
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
                <section id="pokemon-entry-image[${id}]"></section>
                <footer id="pokemon-entry-footer[${id}]"></footer>
            </div>
        `;
    
}

async function loadGermanName() {
    for (let id = 1; id <= 30; id++) {
        let germanName = await fetchName(id);
        console.log(germanName);
        
    }
}




//   <p>Farbe: ${pokemon[i].colorGroup}</p>
//                 <p>ID: ${pokemon[i].beanId}</p>
//                 <p>Bild: ${pokemon[i].imageUrl}</p>
//                 <hr></hr>