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
    var filtragem=false;
    var mostrar=[24*pagina, 24*(pagina+1), 0];
    var tipos;

    if(nomePokemon === ""){
        console.log(fifoFiltroTipo)
        if(fifoFiltroTipo[1]!=null){// Verifica se tem filtros de Tipo de Pokemon
            filtragem= true;
            const url_Tipos = `http://pokeapi.co/api/v2/type/${fifoFiltroTipo[1]}/`;
            const dadoTipos = await fetch(url_Tipos);
            tipos = await dadoTipos.json();
        }


        if(tipos?.results || tipos?.pokemon){// Verifica se foi criado
            for (const pokemonResults of tipos.results??tipos.pokemon) {
                mostrar[2]++;
                console.log(`(${mostrar[0] >= mostrar[2]} && ${mostrar[2] >= mostrar[1]})`)
                if(mostrar[0] >= mostrar[2]){console.log("skip");continue;}
                if(mostrar[2] > mostrar[1]){break;}
                var info = await infoPokemons(pokemonResults.name??pokemonResults.pokemon.name);
                
                // Se tiver um segundo Tipo ativo ele verifica se o pokemon 
                // se encaixa e permite a criação do conteiner
                if(fifoFiltroTipo[0]!=null){
                
                    // verifica em qual posicao esta o Tipo principal
                    if(info.tipagem.tipo1 == tipos.name){ // 1°
                        // verifica se o 2° Tipo é igual a um dos filtro
                        if(!(info.tipagem.tipo2 == fifoFiltroTipo[0] ||
                             info.tipagem.tipo2 == fifoFiltroTipo[1] ))
                            {continue;}

                    }
                    if(info.tipagem.tipo2 == tipos.name){// 2°
                        // verifica se a 1° Tipo é igual a um dos filtro
                        if(!(info.tipagem.tipo1 == fifoFiltroTipo[0] ||
                             info.tipagem.tipo1 == fifoFiltroTipo[1] ))
                            {continue;}

                    }
                }
                console.log(info.nome)
                document.getElementById("Caixa_Pokemon").innerHTML += criarContainer(info);
                console.log(mostrar)
            }// Fin for()
        }else{
            for(let i=24*pagina+1; i<=24*(pagina+1);i++){
                document.getElementById("Caixa_Pokemon").innerHTML += criarContainer(await infoPokemons(i));
            }
        }
    }
    else{
        console.log("Pokemon em pesquisa");
        document.getElementById("Caixa_Pokemon").innerHTML += criarContainer(await infoPokemons(nomePokemon));
    }
    
}





async function infoPokemons(Pokemon){
    const url_Poke = `http://pokeapi.co/api/v2/pokemon/${Pokemon}`;
    const dados1 = await fetch(url_Poke);
    var Pokemon = await dados1.json();
    
    
    const dados2 = await fetch(Pokemon.species.url);
    var specie = await dados2.json();
    var descricao;

    for(let traducao of specie.flavor_text_entries){
        if(traducao.language.name !== "en"){continue}
        descricao =traducao.flavor_text
        .replace(/\f/g, " ")
        .replace("é", "E")
        .replace(/\n/g, "</p><p>");
        if(traducao.language.name === "en"){break};
    }

    return {
            ["entrada"]:specie.order,
            ["nome"]:Pokemon.name,
            ["regiao"]:Pokemon.encounters,
            ["geracao"]:Pokemon.game_indices[0].version["name"],
            ["descricao"]:descricao,
            ["imagem"]:{"normal" : Pokemon.sprites.other["official-artwork"]["front_default"],
                        "shiny"  : Pokemon.sprites.other["official-artwork"]["front_shiny"]
                       },
            ["tipagem"]:{"tipo1" : Pokemon.types[0].type['name'],
                         "tipo2" : Pokemon.types[1]?.type['name']
                        },
            ["status"]:{[`${Pokemon.stats[0].stat.name.replace("-", "_")}`] : Pokemon.stats[0].base_stat,
                        [`${Pokemon.stats[1].stat.name.replace("-", "_")}`] : Pokemon.stats[1].base_stat,
                        [`${Pokemon.stats[2].stat.name.replace("-", "_")}`] : Pokemon.stats[2].base_stat,
                        [`${Pokemon.stats[3].stat.name.replace("-", "_")}`] : Pokemon.stats[3].base_stat,
                        [`${Pokemon.stats[4].stat.name.replace("-", "_")}`] : Pokemon.stats[4].base_stat,
                        [`${Pokemon.stats[5].stat.name.replace("-", "_")}`] : Pokemon.stats[5].base_stat,
                       },
        };
};






function criarContainer(info){//console.log("Container Criado para "+info.nome)
    return `
        <div class="container" style="background: linear-gradient(145deg, ${cores(info.tipagem.tipo1)}47%, rgba(0, 0, 0, 1)47%,rgba(0, 0, 0, 1)53%,   ${cores(info.tipagem.tipo2?info.tipagem.tipo2:info.tipagem.tipo1, .65)}53%)">
        <button class="pokeballInner" onclick="popUpInfo('${info.nome}')">
                <img src="${info.imagem.normal}" alt="${info.nome}" style="width:120px;height:120px;">
                
            </button>
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
    const url_Tipos = `http://pokeapi.co/api/v2/type`;
    const dadoTipos = await fetch(url_Tipos);
    const listaTipos= await dadoTipos.json();
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

        div.style.width="500px";
        div.style.height="34px";
        for(let tipos in filtroTipo){
            document.getElementById(`filtro_${tipos}`).remove();
        }
    }
}





function inverterValorElemento(x){
    // Verifica (as 2 casas) para ver se o elemento 'x' ja esta selecionado.
    // {TRUE} :> remove tal elemento 'x', e adiciona null a casa 0
    console.log()
    console.log(fifoFiltroTipo)
    if(fifoFiltroTipo[0] == x ){
        fifoFiltroTipo.splice(0,1,null);
        console.log(fifoFiltroTipo)
    }
    else if(fifoFiltroTipo[1] == x ){
        fifoFiltroTipo.splice(1,1);
        fifoFiltroTipo.splice(0,0,null);
        console.log(fifoFiltroTipo)
    }else{
        // Remove o primeiro elemento
        fifoFiltroTipo.splice(0,1);
        
        // Substitui o segundo elemento se 'filtroTipo' do elemento 'x' for TRUE por 'x'
        fifoFiltroTipo.splice(1,1,x);
        //console.log(`pos adicionar: {${fifoFiltroTipo[0]}, ${fifoFiltroTipo[1]}}`)
        
        // Os elementos que estiverem dentro de 'fifoFiltroTipo' tem o valor TRUE, ao contrario sera FALSE
        for(var i in filtroTipo){
            if(i == fifoFiltroTipo[0] || i == fifoFiltroTipo[1]){
               // console.log(`filtroTipo[${i}] = true;`)
                filtroTipo[i]= true;

            }else{
                filtroTipo[i]= false;
            }
            
        }
    }
    console.log("entrando no For")
    
    for(let i=0,y=1;i<17;i++){
    //    console.log(` - fifoFiltroTipo[${Object.keys(fifoFiltroTipo)}] = ${!fifoFiltroTipo[i]}`)
        if(!fifoFiltroTipo[i]){y++}
        
        if(y==17){for(let valores in filtroTipo){filtroTipo[valores]=!filtroTipo[valores];console.log(`filtroTipo[${valores}]=${filtroTipo[valores]}`)}}
    }
    console.log("saindo no For")
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





// Pop up de informações

function ClosePopUpInfo(){
    document.getElementById("PopUpInfo").style.display = "none";
    console.log("fechar")
}



async function popUpInfo(PokemonName) {
    console.log("call")
    document.getElementById("PopUpInfo").style.display = "inline-block";
    let info = await infoPokemons(PokemonName);

    document.getElementById("pokeEntryPopUp").innerHTML=info.entrada;
    document.getElementById("imagemPopUp").children[0].src= info.imagem.normal;
    document.getElementById("pokemonNamePopUp").innerHTML= info.nome;
    document.getElementById("typesPopUp").innerHTML="";
    document.getElementById("typesPopUp").innerHTML+=`
                    <div class="filtro_Elemento_PopUp" id="filtro_${info.tipagem.tipo1}_PopUp" style="background-color:${cores(info.tipagem.tipo1)}">
                        ${info.tipagem.tipo1}
                    </div>
                `;
    if(info.tipagem.tipo1 != info.tipagem.tipo2 && info.tipagem.tipo2 !==null){
            document.getElementById("typesPopUp").innerHTML+=`
                    <div class="filtro_Elemento_PopUp" id="filtro_${info.tipagem.tipo2}_PopUp" style="background-color:${cores(info.tipagem.tipo2)}">
                        ${info.tipagem.tipo2}
                    </div>
                `;
    }else{}
    document.getElementById("filtro_undefined_PopUp")?.remove();
    document.getElementById("statusPopUp").innerHTML=`
                    <div id="hp">Hp: ${info.status["hp"]}</div>
                    <div id="attack">Atk: ${info.status["attack"]}</div>
                    <div id="defense">Defense: ${info.status["defense"]}</div>
                    <div id="sp_attack">Sp Atk: ${info.status["special_attack"]}</div>
                    <div id="sp_defense">Sp Defense: ${info.status["special_defense"]}</div>
                    <div id="speed">Sp Defense: ${info.status["speed"]}</div>
                `;
    document.getElementById("descricaoPopUp").innerHTML= info.descricao
}


buscaApi();