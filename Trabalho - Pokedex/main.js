'use strict';
/*
    pesquisar por:
        tipos ,  nome , geraçao , região , raridade
        ( ✔ ) , ( ✔ ),  ( ✖ )  , ( ✖ ) , ( ✖ )
    
    
    exibir informação:
        nome   , imagem (alterar entre shiny's),  tipo  , região , geração (primeira aparição) , descrição,
        ( ✔ ) ,  ( ✔ )                        , ( ✔ )  , ( ✔ ) ,  ( ✔ )                      ,  ( ✖ )
*/

const buscaApi = async() => {
    const nomePokemon = document.getElementById('Pesquisa');
    //const url = `http://pokeapi.co/api/v2/pokemon/${nomePokemon}`;
    const url = `http://pokeapi.co/api/v2/pokemon/bulbasaur`;



    const dados = await fetch(url);
    const pokemon = await dados.json();

    const info={
        ["nome"]:pokemon.name,
        ["imagem"]:{"normal":pokemon.sprites.front_default,"shiny":pokemon.sprites.front_shiny},
        ["tipagem"]:{"tipo1":pokemon.types[0].type['name'],"tipo2":pokemon.types[1].type['name']},
        ["regiao"]:pokemon.encounters,
        ["geracao"]:pokemon.game_indices[0].version["name"],
        //["descricao"]:
    } 

    console.log(info.imagem.normal);

}


function criarContainer(info){
    return `
        <div class="container">
            <img scr="${info.imagem["normal"]}" alt="${info.nome}">
            <p>${info.nome}</p>
        </div>
    `;
}


document.getElementById("Caixa_Pokemon").innerHTML += criarContainer();