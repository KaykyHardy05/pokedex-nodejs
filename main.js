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
const fifoFiltroTipo=[null,null]
const filtroTipo= {        
    'grass'    : true,
    'poison'   : true,
    'fire'     : true,
    'flying'   : true,
    'water'    : true,
    'bug'      : true,
    'normal'   : true,
    'electric' : true,
    'ground'   : true,
    'fighting' : true,
    'psychic'  : true,
    'rock'     : true,
    'ice'      : true,
    'ghost'    : true,
    'dragon'   : true,
    'fairy'    : true,
    'steel'    : true,
    'dark'     : true}


const buscaApi = async(filtroPorTipo=[null,null]) => {
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
            const pokemon2= await carregarJson("/pokemon/"+pokemonResults.name);
            //console.log(`carregando -> ${pokemon2.name}`)

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
        <div class="container" style="background: linear-gradient(145deg, ${cores(info.tipagem.tipo1)}47%, rgba(0, 0, 0, 1)47%,rgba(0, 0, 0, 1)53%,   ${cores(info.tipagem.tipo2?info.tipagem.tipo2:info.tipagem.tipo1, .65)}53%)">
        <div style="background: radial-gradient(rgba(255, 255, 255, 1)20%,rgba(0, 0, 0, 1)20%,rgba(0, 0, 0, 0)25%,rgba(0, 0, 0, 0)55%,rgba(0, 0, 0, 0.5)71%,rgba(0, 0, 0, 0)71%); width:150px; height:150px;">
                <img src="${info.imagem.normal}" alt="${info.nome}" style="width:150px;height:150px;">
                <p>${info.nome}</p>
            </div>
        </div>
    `;
}

function cores(x, alphaValue=1){
    let coresPorElemento = {
        'grass'    : `rgba(119, 204,  85, ${alphaValue})`,
        'poison'   : `rgba(170,  85, 153, ${alphaValue})`,
        'fire'     : `rgba(255,  68,  34, ${alphaValue})`,
        'flying'   : `rgba(136, 153, 255, ${alphaValue})`,
        'water'    : `rgba( 51, 153, 255, ${alphaValue})`,
        'bug'      : `rgba(170, 187,  34, ${alphaValue})`,
        'normal'   : `rgba(170, 170, 153, ${alphaValue})`,
        'electric' : `rgba(255, 204,  51, ${alphaValue})`,
        'ground'   : `rgba(221, 187,  85, ${alphaValue})`,
        'fighting' : `rgba(185,  84,  67, ${alphaValue})`,
        'psychic'  : `rgba(255,  85, 153, ${alphaValue})`,
        'rock'     : `rgba(187, 170, 102, ${alphaValue})`,
        'ice'      : `rgba(102, 204, 255, ${alphaValue})`,
        'ghost'    : `rgba(102, 102, 187, ${alphaValue})`,
        'dragon'   : `rgba(119, 102, 238, ${alphaValue})`,
        'fairy'    : `rgba(238, 153, 238, ${alphaValue})`,
        'steel'    : `rgba(170, 170, 187, ${alphaValue})`,
        'dark'     : `rgba(119,  85,  68, ${alphaValue})`,
        'off'      : `rgba(  35,   35,   35, 0.75)`
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
                <button class="filtro_Elemento" id="filtro_${tipos.name}" onclick="inverterValorElemento('${tipos.name}')" style="background-color:${cores(filtroTipo[tipos.name]?tipos.name:'off')}">
                    ${tipos.name}
                </button>
            `;
    }
}

function inverterValorElemento(x){
    // Verifica (as 2 casas) para ver se o elemento 'x' ja esta selecionado.
    // {TRUE} :> remove tal elemento 'x', e adiciona null a casa 0
    for(var i=0;i<fifoFiltroTipo.length;i++){
        if(fifoFiltroTipo[i] == x){
            fifoFiltroTipo.splice(i,1);
            fifoFiltroTipo.splice(0,0,null);
        }
    }

    // Remove o primeiro elemento
    fifoFiltroTipo.splice(0,1);
    // Substitui o segundo elemento se 'filtroTipo' do elemento 'x' for TRUE por 'x'
    fifoFiltroTipo.splice(1,1,filtroTipo[x]?x:null);
    
    // Os elementos que estiverem dentro de 'fifoFiltroTipo' tem o valor TRUE, ao contrario sera FALSE
    for(var i in filtroTipo){
        console.log((i == fifoFiltroTipo[0] || i == fifoFiltroTipo[1]))
        if(i == fifoFiltroTipo[0] || i == fifoFiltroTipo[1]){
            filtroTipo[x]= true;
        }
        filtroTipo[i]= false;
    }



    console.log(fifoFiltroTipo)
    
    atualizarAparenciaFiltroTipos()

    buscaApi({fifoFiltroTipo});
}

function atualizarAparenciaFiltroTipos(){
    for(var i in filtroTipo){
        document.getElementById(`filtro_${i}`).style["background-color"] = cores(filtroTipo[i]?i:'off');
        document.getElementById(`filtro_${i}`).style.color = filtroTipo[i]?"black":"white";
    }
}

buscaApi();

