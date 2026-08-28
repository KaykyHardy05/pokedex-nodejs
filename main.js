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
let pagina=document.getElementById("pageN").value;

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
    'dark'     : true
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





const buscaApi = async() => {

    console.log(`buscaApi([${fifoFiltroTipo[0]},${fifoFiltroTipo[1]}])`)
    document.getElementById("Caixa_Pokemon").innerHTML = "";

    const nomePokemon = document.getElementById('Pesquisa').value;
    var teste;

    if(nomePokemon === ""){
        if(fifoFiltroTipo[1]!=null){
            teste=await carregarJson(`/type/${fifoFiltroTipo[1]}`);
        }else{
            teste=await carregarJson(`/pokemon?limit=24&offset=${24*(pagina)}`);
        }
        console.log("SEM Comando");
    }
    else{
        teste=await carregarJson("/pokemon/"+nomePokemon);
        console.log("Comando pesquisa: "+nomePokemon);
        console.log(`http://pokeapi.co/api/v2/pokemon${"/"+nomePokemon}`)
    }
    
    

    if(teste.results){
        for (const pokemonResults of teste.results) {
            const pokemon= await carregarJson("/pokemon/"+pokemonResults.name);
            
            document.getElementById("Caixa_Pokemon").innerHTML += criarContainer(infoPokemons(pokemon)); 
        }
    }
    if(teste.pokemon){
        for(let i=24*pagina,x=0; i<teste.pokemon.length;i++){
            if(x>=24){continue}
            const pokemon= await carregarJson(`/pokemon/${teste.pokemon[i].pokemon.name}`);
            
            if(fifoFiltroTipo[0]!=null){
                if(infoPokemons(pokemon).tipagem.tipo1 == teste.name){
                    if(!(infoPokemons(pokemon).tipagem.tipo2 == fifoFiltroTipo[0] || infoPokemons(pokemon).tipagem.tipo2 == fifoFiltroTipo[1])){continue;}
                }
                if(infoPokemons(pokemon).tipagem.tipo2 == teste.name){
                    if(!(infoPokemons(pokemon).tipagem.tipo1 == fifoFiltroTipo[0] || infoPokemons(pokemon).tipagem.tipo1 == fifoFiltroTipo[1])){continue;}
                }
            }
            
            document.getElementById("Caixa_Pokemon").innerHTML += criarContainer(infoPokemons(pokemon));
            x++;
        }
    }    
    else{
        document.getElementById("Caixa_Pokemon").innerHTML += criarContainer(infoPokemons(teste));
    }

}





let infoPokemons = function(Pokemon){
    return {
            ["nome"]:Pokemon.name,
            ["imagem"]:{"normal":Pokemon.sprites.other["official-artwork"]["front_default"],"shiny":Pokemon.sprites.other["official-artwork"]["front_shiny"]},
            ["tipagem"]:{"tipo1":Pokemon.types[0].type['name'],"tipo2":Pokemon.types[1]?.type['name']},
            ["regiao"]:Pokemon.encounters,
            ["geracao"]:Pokemon.game_indices[0].version["name"],
        };
};





async function carregarJson(Pokemon){
    const url = `http://pokeapi.co/api/v2${Pokemon}`;

    const dados = await fetch(url);
    const jason = await dados.json();
    return jason;
}





function criarContainer(info){console.log("Container Criado!")
    return `
        <div class="container" style="background: linear-gradient(145deg, ${cores(info.tipagem.tipo1)}47%, rgba(0, 0, 0, 1)47%,rgba(0, 0, 0, 1)53%,   ${cores(info.tipagem.tipo2?info.tipagem.tipo2:info.tipagem.tipo1, .65)}53%)">
        <div class="pokeballInner">
                <img src="${info.imagem.normal}" alt="${info.nome}" style="width:120px;height:120px;">
                
            </div>
            <p>${info.nome}</p>
        </div>
    `;
}






function retroceder(){
    if(pagina > 0){
        pagina--;
    }else{
        pagina= Math.floor(1025/24);    
    }
    document.getElementById("pageN").value = pagina;
    buscaApi();
}

function paginaIdentifier(){
    const seletor = document.getElementById("pageN").value;
    pagina = seletor;
    buscaApi();
}

function avancar(){    
    if(pagina >= Math.floor(1025/24)){
        pagina =0;
    }else{pagina++;}
    document.getElementById("pageN").value = pagina;
    buscaApi();
}






async function filtros(){
    const listaTipos= await carregarJson("/type")
    const div=document.getElementById("Caixa_Filtro");

    if(document.getElementById("Botao_Filtro_off")){
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
    }else if(document.getElementById("Botao_Filtro_on")){
        document.getElementById("Botao_Filtro_on").id= "Botao_Filtro_off";

        div.style.width="530px";
        div.style.height="25px";
        for(let tipos in filtroTipo){
            document.getElementById(`filtro_${tipos}`).remove();
        }
    }
}





function inverterValorElemento(x){
    // Verifica (as 2 casas) para ver se o elemento 'x' ja esta selecionado.
    // {TRUE} :> remove tal elemento 'x', e adiciona null a casa 0
    if(fifoFiltroTipo[0] == x ){
        fifoFiltroTipo.splice(0,1,null);
    }
    else if(fifoFiltroTipo[1] == x ){
        fifoFiltroTipo.splice(1,1,null);
    }else{
        // Remove o primeiro elemento
        fifoFiltroTipo.splice(0,1);
        
        // Substitui o segundo elemento se 'filtroTipo' do elemento 'x' for TRUE por 'x'
        fifoFiltroTipo.splice(1,1,x);
        //console.log(`pos adicionar: {${fifoFiltroTipo[0]}, ${fifoFiltroTipo[1]}}`)
        
        // Os elementos que estiverem dentro de 'fifoFiltroTipo' tem o valor TRUE, ao contrario sera FALSE
        for(var i in filtroTipo){
            if(i == fifoFiltroTipo[0] || i == fifoFiltroTipo[1]){
                console.log(`filtroTipo[${i}] = true;`)
                filtroTipo[i]= true;

            }else{
                filtroTipo[i]= false;
            }
            
        }
    }

    for(let i=0,x=0;i<filtroTipo.length;i++){
        if(!fifoFiltroTipo[i]){x++}
        if(x=filtroTipo.length){for(let valores of fifoFiltroTipo){!valores}}
    }
    console.log(fifoFiltroTipo)
    atualizarAparenciaFiltroTipos()

    buscaApi([fifoFiltroTipo[0],fifoFiltroTipo[1]]);
}






function atualizarAparenciaFiltroTipos(){
    for(var i in filtroTipo){
        document.getElementById(`filtro_${i}`).style["background-color"] = cores(filtroTipo[i]?i:'off');
        document.getElementById(`filtro_${i}`).style.color = filtroTipo[i]?"black":"white";
    }
}

buscaApi();
