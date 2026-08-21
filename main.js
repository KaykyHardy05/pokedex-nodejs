'use strict';


/*
    pesquisar por:
        tipos ,  nome , geraçao , região , raridade
        ( ✔ ) , ( ✔ ),  ( ✖ )  , ( ✖ ) , ( ✖ )
    
    
    exibir informação:
        nome   , imagem (alterar entre shiny's),  tipo  , região , geração (primeira aparição) , descrição,
        ( ✔ ) ,  ( ✔ )                        , ( ✔ )  , ( ✔ ) ,  ( ✔ )                      ,  ( ✖ )
*/
let catapimbas;
let pagina=0;



const buscaApi = async() => {
    document.getElementById("Caixa_Pokemon").innerHTML = "";

    const nomePokemon = document.getElementById('Pesquisa').value;
    var teste;

    if(nomePokemon === ""){
        teste=await carregarJson(`/pokemon?limit=${24}&offset=${24*(pagina)}`);
        console.log("SEM Comando");
    }
    else{
        teste=await carregarJson("/pokemon/"+nomePokemon);
        console.log("Comando pesquisa: "+nomePokemon);
        console.log(`http://pokeapi.co/api/v2/pokemon${"/"+nomePokemon}`)
    }
    
    

    if(teste.results){
        for (const pokemonResults of teste.results) {
            const pokemon2= await carregarJson("/"+pokemonResults.name);
            console.log(`carregando -> ${pokemon2.name}`)

            const informacao2={
                ["nome"]:pokemon2.name,
                ["imagem"]:{"normal":pokemon2.sprites.front_default,"shiny":pokemon2.sprites.front_shiny},
                ["tipagem"]:{"tipo1":pokemon2.types[0].type['name'],"tipo2":pokemon2.types[1]?.type['name']},
                ["regiao"]:pokemon2.encounters,
                ["geracao"]:pokemon2.game_indices[0].version["name"],
            } 

            document.getElementById("Caixa_Pokemon").innerHTML += criarContainer(informacao2);

        }
    }

        const informacao={
            ["nome"]:teste.name,
            ["imagem"]:{"normal":teste.sprites.front_default,"shiny":teste.sprites.front_shiny},
            ["tipagem"]:{"tipo1":teste.types[0].type['name'],"tipo2":teste.types[1]?.type['name']},
            ["regiao"]:teste.encounters,
            ["geracao"]:teste.game_indices[0].version["name"],
        } 

        document.getElementById("Caixa_Pokemon").innerHTML += criarContainer(informacao);

}

async function carregarJson(Pokemon){
    const url = `http://pokeapi.co/api/v2${Pokemon}`;

    const dados = await fetch(url);
    const jason = await dados.json();
    return jason;
}



function criarContainer(info){
    return `
        <div class="container" style="background: linear-gradient(145deg, ${cores(info.tipagem.tipo1)}47%, rgba(0, 0, 0, 1)47%,rgba(0, 0, 0, 1)53%,   ${cores(info.tipagem.tipo2?info.tipagem.tipo2:info.tipagem.tipo1)}53%)">
        <div style="background: radial-gradient(rgba(255, 255, 255, 1)20%,rgba(0, 0, 0, 1)20%,rgba(0, 0, 0, 0)25%,rgba(0, 0, 0, 0)25%); width:150px; height:150px;">
                <img src="${info.imagem.normal}" alt="${info.nome}" style="width:150px;height:150px;">
                <p>${info.nome}</p>
            </div>
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
    
    return coresPorElemento[x];
}


function retroceder(){
    if(pagina > 0){
        pagina--;
        console.log(`passando a URL-> '?limit=${24}&offset=${24*(pagina)}'`)
        document.getElementById("paginaSelector").value = pagina;
        buscaApi();
    }
}

function paginaIdentifier(){
    const seletor = document.getElementById("paginaSelector").value;
    pagina = seletor;
    buscaApi();
}

function avancar(){
    
    if(pagina > 1351){
        pagina =0;
    }
    pagina++;
    console.log(`passando a URL-> '?limit=${24}&offset=${24*(pagina-1)}'`)
    document.getElementById("paginaSelector").value = pagina;
    buscaApi();
}


async function filtros(){
    const listaTipos= await carregarJson("/type")
    const div=document.getElementById("Caixa_Filtro");
    document.getElementById("Botao_Filtro_off").id= "Botao_Filtro_on";

    div.style.width="500px";
    div.style.height="350px";

    for (const tipos of listaTipos.results) {
        if(tipos.name == "stellar" || tipos.name == "unknown"){continue}
        div.innerHTML+=`
                <div class="filtro_Elemento" style="background-color:${cores(tipos.name)}">
                    ${tipos.name}
                </div>
            `;
    }
}

buscaApi();