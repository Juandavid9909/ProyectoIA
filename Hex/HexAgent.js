const Agent = require('ai-agents').Agent;
const getEmptyHex = require('./getEmptyHex');
const minMax = require('./minMax');

class HexAgent extends Agent {
    constructor(value) {
        super(value);
    }
    
    /**
     * return a new move. The move is an array of two integers, representing the
     * row and column number of the hex to play. If the given movement is not valid,
     * the Hex controller will perform a random valid movement for the player
     * Example: [1, 1]
     */
    send(){
       return startMinMax(this.perception,this.getID());
    }
}

const Graph = require('node-dijkstra')

'use strict'
function send(){
    startMinMax(this.perception,this.getID());
}

class Arbol{

    constructor(){
        this.table = {};    
    }

    insert(id,mapa, hijos = [],padre = 0,valorH = 0){
        this.table[id] = {id,hijos,padre,valorH,mapa};   
    }

    get(id){
        let tableValue = this.table[id];
        return tableValue ? tableValue : -1;
    }
    getTable(){
        return this.table;
    }
}

function crearGrafo(mapa,jugadorId){
    let g = new Graph();
    let copiaMapa = JSON.parse(JSON.stringify(mapa));
    if(jugadorId == 2){
        copiaMapa = transponerMatrix(copiaMapa);
    }
    let adyI = {};
    for (let i = 0; i < copiaMapa.length ; i++ ) {
        if(copiaMapa[i][0] == 0){
            adyI[''+i+0] = 1;
        }else if(copiaMapa[i][0] == jugadorId){
            adyI[''+i+0] = 0.00000000000000000000000000001;
        }
        

    }
    g.addVertex('I',adyI);

    for(let i = 0; i < copiaMapa.length ; i++ ){
        for(let j = 0; j < copiaMapa.length ; j++ ){
            let adya= retornarAdj([i,j],copiaMapa,jugadorId); // [[posAdj, 1:0 ],[posAdj, 1:0]]
            let objAdy = construirAdj(adya);
            if(j == copiaMapa.length-1){
                if((copiaMapa[i][copiaMapa.length-1] == 0)||(copiaMapa[i][copiaMapa.length-1] == jugadorId)){
                    objAdy['D'] = 0.00000000000000000000000000001;
                }
            } 
            g.addVertex(''+i+j , objAdy);
        
        }
    }

    g.addVertex('D',{})
    return g;
}

function retornarAdj(pos, mapa,jugador) {
    let filas =    [-1, -1, 0, 0, 1, 1];
    let columnas = [ 0,  1,-1, 1,-1, 0];
    let contador = 0;
    let salida = [];
    while(contador < columnas.length){
        filaTemp = pos[0] + filas[contador];
        columnaTemp = pos[1] + columnas[contador];
        if((filaTemp < mapa.length) && (0 <= filaTemp)&&(columnaTemp < mapa.length) && (0 <= columnaTemp)){
            if(mapa[filaTemp][columnaTemp] == jugador){
                salida.push([[filaTemp,columnaTemp],0.00000000000000000000000000001]);
            }
            if(mapa[filaTemp][columnaTemp] == 0){
                salida.push([[filaTemp,columnaTemp],1]);
            }
        }
        contador++;
    }
    return salida;
}

function construirAdj(adj) {
    let salida = {}
    for (let i = 0; i < adj.length ; i++ ){
        salida[''+adj[i][0][0]+adj[i][0][1] ]= adj[i][1];
    }
    return salida;
}

function descartarEvaluados(idJugadas, mapa,jugador) {
    let salida = [];
    let copiaMapa = JSON.parse(JSON.stringify(mapa));
    if(jugador == 2){
        copiaMapa = transponerMatrix(copiaMapa);
    }
    idJugadas.shift();
    while(idJugadas[0] != 'D'){
        pos  = castingNodeGraph(idJugadas[0]);
        if(copiaMapa[pos[0]][pos[1]] == 0){
            salida.push(pos);
        }
        idJugadas.shift();
    }
    return salida;
}

                            
function castingNodeGraph(node) {
    
    return [parseInt(node[node.length - 2]),parseInt(node[node.length - 1])];

}

function jugadasValidas(mundo,jugador) {
    let grafo = crearGrafo(mundo,jugador);
    let salida = grafo.shortestPath('I','D');
    
    if(salida != null){
        salida = descartarEvaluados(salida,mundo,jugador);
        if(jugador == 2){
            salida = transponerJugadas(salida);
        }
    }else{
        salida = [];
    }
    return salida;
}

function transponerJugadas(jugadas){
    salida = [];
    while(jugadas.length != 0){
        salida.push([jugadas[0][1],jugadas[0][0]]);
        jugadas.shift();
    }
    return salida;
}

function transponerMatrix(mapa){
    let matriz = [];
    for (let i = 0; i < mapa.length; i++) {
        let fila = []
        for (let j = 0; j < mapa.length; j++) {
            fila.push(mapa[j][i])
        }
        matriz.push(fila);
    }
    return matriz;
}


function startMinMax(mapa,jugador){
    let turno = determinarTurno(mapa);
    let profundidadArbol = 7;
    if(turno == 1){
        return [Math.floor(mapa.length / 2),(Math.floor(mapa.length / 2)-1)]
    }
    if(turno == 2){
        return [Math.floor(mapa.length / 2),Math.floor(mapa.length / 2)]
    }
    if(turno > 20){
        profundidadArbol = 9;
    }
        let arbol = new Arbol();
        if(jugador == 1){
            crearArbolCompleto('',mapa,jugador,0,arbol,jugador,profundidadArbol);
        }else{
            crearArbolCompleto('',mapa,oponente(jugador),0,arbol,jugador,profundidadArbol);
        }
        let mejorJugada = minimax('',arbol,true,jugador,profundidadArbol);
        return [mejorJugada[0][0],mejorJugada[0][1]];
    
}

function minimax(id,arbol,flag,jugador,alfa = Number.MIN_SAFE_INTEGER, beta = Number.MAX_SAFE_INTEGER,profundidad){
    if((id.length >= (profundidad * 2))||(ganoAlguien(arbol.get(id).mapa))){
        return [id,heuristica(arbol.get(id).mapa,jugador)];        
    }
    if(flag){
        let maxEval = Number.MIN_SAFE_INTEGER;
        let respuesta = [id,maxEval];
        for(let i = 0; i < arbol.get(id).hijos.length;i++){
            let eval = minimax(arbol.get(arbol.get(id).hijos[i]).id,arbol,false,jugador,alfa,beta,profundidad);
            if(eval[1] >= respuesta[1]){
                respuesta = [eval[0],eval[1]];
            }
            if(eval[1] > alfa){
                alfa = eval[1];
            }
            if(beta <= alfa){
                break;
            }
        }
        return respuesta;
    }else{
        let minEval = Number.MAX_SAFE_INTEGER;
        let respuesta = [id,minEval];
        for(let i = 0; i < arbol.get(id).hijos.length;i++){
            let eval = minimax(arbol.get(arbol.get(id).hijos[i]).id,arbol,true,jugador,alfa,beta,profundidad)
            if(respuesta[1] >= eval[1]){
                respuesta = [eval[0],eval[1]]
            }
            if(beta > eval[1]){
                beta = eval[1];
            }
            if(beta <= alfa){
                break;
            }
        }
        return respuesta;
    }

}

function ganoAlguien(mapa){
    let g1 = crearGrafo(mapa,1);
    let g2 = crearGrafo(mapa,2); 
    let distrak1 = g1.shortestPath('I','D');
    let distrak2 = g2.shortestPath('I','D');
    if((distrak1 == null) || (distrak2 == null)){
        return true;
    }else{
        return false;
    }
}

function crearArbolCompleto(id,mapa,jugador, profundidad = 0,arbol,ficha,profundidadPermitida){
    if(profundidad == profundidadPermitida){
        arbol.insert(id,mapa,[],id.substr(0,id.length-2));
    }else{
        let jugadas = jugadasValidas(mapa,jugador);
        if(id == ''){
            arbol.insert(id,mapa,[]);
        }
        crearHijos(jugadas,id,arbol,mapa,ficha);
        for (let i = 0; i < arbol.get(id).hijos.length; i++) {
            let idHijo = arbol.get(id).hijos[i];
            crearArbolCompleto(idHijo,arbol.get(idHijo).mapa,jugador, profundidad+1,arbol,oponente(ficha),profundidadPermitida);
        }
    }
}

function determinarTurno(mapa){
    let contador = 1;
    for (let i = 0; (contador < 21) && (i < mapa.length); i++) {
        for (let j = 0; (contador < 21) &&(j < mapa.length); j++) {
            if(mapa[i][j] != 0){
                contador++;
            }
        }
    }
    return contador;
}

function crearHijos(ids, padre, arbol, estado,jugador){
    while(ids.length != 0){
       let copiaEstado = JSON.parse(JSON.stringify(estado));
       copiaEstado = realizarMovimiento(ids[0],copiaEstado,jugador);
       arbol.get(padre).hijos.push(''+padre+ids[0][0]+ids[0][1]);
       arbol.insert(''+padre+ids[0][0]+ids[0][1],copiaEstado,[],padre)
       ids.shift();
    }
}

function realizarMovimiento(movimiento,estado,jugador){
    estado[movimiento[0]][movimiento[1]] = jugador;
    return estado;
}

function oponente(jugador){
    if(jugador == 1){
        return 2;
    }else{
        return 1;
    }
} 
function heuristica(mapa,jugador){
    let gPropio = crearGrafo(mapa,jugador);
    let gRival = crearGrafo(mapa, oponente(jugador)); 
    let distrakPropio = gPropio.shortestPath('I','D', {cost : true});
    let distrakRival = gRival.shortestPath('I','D',{cost : true});
    if((distrakPropio.path == null) || ((distrakRival.path != null)&&(Math.floor(distrakRival.cost) == 0))){
        return Number.MIN_SAFE_INTEGER;
    }
    if((distrakPropio.path != null)&&(Math.floor(distrakPropio.cost) == 0)){
        return Number.MAX_SAFE_INTEGER;
    }
    if(distrakRival.path == null){
        return Number.MAX_SAFE_INTEGER-1;
    }
    
    return  Math.floor(distrakRival.cost) - Math.floor(distrakPropio.cost);
}


module.exports = HexAgent;
