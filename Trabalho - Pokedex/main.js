'use strict';
let catapimbas

/*
    pesquisar por:
        tipos ,  nome , geraçao , região , raridade
        ( ✔ ) , ( ✔ ),  ( ✖ )  , ( ✖ ) , ( ✖ )
    
    
    exibir informação:
        nome   , imagem (alterar entre shiny's),  tipo  , região , geração (primeira aparição) , descrição,
        ( ✔ ) ,  ( ✔ )                        , ( ✔ )  , ( ✔ ) ,  ( ✔ )                      ,  ( ✖ )
*/


const buscaApi = async() => {
    const nomePokemon = document.getElementById('Pesquisa').value;
    var teste
    
    if(nomePokemon === ""){
        const url = `http://pokeapi.co/api/v2/pokemon?limit=100000&offset=0`;
        teste = url
        console.log("SEM Comando");
    }
    else{
        const url = `http://pokeapi.co/api/v2/pokemon/${nomePokemon}`;
        teste = url
        console.log("Comando pesquisa: "+nomePokemon);
    }

    console.log("Url: "+teste);
    const dados = await fetch(teste);
    const pokemon = await dados.json();

    if(pokemon.results){
        for (const pokemonResults of pokemon.results) {
            const url2 = `http://pokeapi.co/api/v2/pokemon/${pokemonResults.name}`;
            const dados2 = await fetch(url2);
            const pokemon2 = await dados2.json();
            
            const informacao2={
                ["nome"]:pokemon2.name,
                ["imagem"]:{"normal":pokemon2.sprites.front_default,"shiny":pokemon2.sprites.front_shiny},
                ["tipagem"]:{"tipo1":pokemon2.types[0].type['name'],"tipo2":pokemon2.types[1]?.type['name']},
                ["regiao"]:pokemon2.encounters,
                ["geracao"]:pokemon2.game_indices[0].version["name"],
                //["descricao"]:
            } 

            //console.log(informacao2.tipagem);
            document.getElementById("Caixa_Pokemon").innerHTML += criarContainer(informacao2);
    
        }
    }
/*
const pokemonResults = pokemon.results[0];
console.log(pokemonResults.url)    
    const resultsDados = await fetch(pokemonResults.url);
    const resultsPokemon = await resultsDados.json();
    console.log(resultsPokemon)
*/

        const informacao={
            ["nome"]:pokemon.name,
            ["imagem"]:{"normal":pokemon.sprites.front_default,"shiny":pokemon.sprites.front_shiny},
            ["tipagem"]:{"tipo1":pokemon.types[0].type['name'],"tipo2":pokemon.types[1]?.type['name']},
            ["regiao"]:pokemon.encounters,
            ["geracao"]:pokemon.game_indices[0].version["name"],
            //["descricao"]:
        } 

        //console.log(informacao.name);
        document.getElementById("Caixa_Pokemon").innerHTML += criarContainer(informacao);

}


function criarContainer(info){
    var cor1;
    var cor2;
    console.log(info.tipagem);
    return `
        <div class="container" style="backgrounds: linear-gradient(45deg, ${cores(info.tipagem.tipo1)},  ${cores(info.tipagem.tipo2)} );">
            <img src="${info.imagem.normal}" alt="${info.nome}" style="width:150px;height:150px;">
            <p>${info.nome}</p>
        </div>
    `;
}

function cores(x){
    let coresPorElemento = {
        'grass'    : 'rgba(119, 204, 85, 1)',
        'poison'   : 'rgba(170, 85, 153, 1)',
        'fire'     : 'rgba(255, 68, 34, 1)',
        'flying'   : 'rgba(136, 153, 255, 1)',
        'water'    : 'rgba(51, 153, 255, 1)',
        'bug'      : 'rgba(170, 187, 34, 1)',
        'normal'   : 'rgba(170, 170, 153, 1)',
        'electric' : 'rgba(255, 204, 51, 1)',
        'ground'   : 'rgba(221, 187, 85, 1)',
        'fighting' : 'rgba(185, 84, 67, 1)',
        'psychic'  : 'rgba(255, 85, 153, 1)',
        'rock'     : 'rgba(187, 170, 102, 1)',
        'ice'      : 'rgba(102, 204, 255, 1)',
        'ghost'    : 'rgba(102, 102, 187, 1)',
        'dragon'   : 'rgba(119, 102, 238, 1)',
        'fairy'    : 'rgba(238, 153, 238, 1)',
        'steel'    : 'rgba(170, 170, 187, 1)',
        'dark'     : 'rgba(119, 85, 68, 1)'
    };
    console.log(x); 
    console.log(coresPorElemento[x]); 


    
}

buscaApi();