const HashTable = require('./hash-table');
const readtext = require('./readtext');
const [,, ...args] = process.argv;

let mapa1 = [ [ 'W', 'W', 'W', 'W', 'W', 'W' ],
              [ 'W', '0', '0', '0', 'W', 'W' ],
              [ 'W', 'X', '0', 'X', '0', 'W' ],
              [ 'W', '0', '0', 'W', '0', 'W' ],
              [ 'W', '0', '0', '0', '0', 'W' ],
              [ 'W', 'W', 'W', 'W', 'W', 'W' ]] ;
let pos1 = [1,1];
let cajas1 = [[2,2], [2,3]];

let mapa2 = [ [ 'W', 'W', 'W', 'W', 'W', 'W', 'W' ],
              [ 'W', '0', '0', '0', '0', 'W', 'W' ],
              [ 'W', '0', '0', '0', '0', '0', 'W' ],
              [ 'W', '0', 'W', 'X', '0', 'X', 'W' ],
              [ 'W', '0', '0', '0', '0', '0', 'W' ],
              [ 'W', 'W', 'W', 'W', 'W', 'W', 'W' ] ];
let pos2 = [1,1]
let cajas2 = [ [ 2, 2 ], [ 2, 3 ] ];

let mapa3 = [['0','0','W','W','W','W','0'],
             ['W','W','W','0','0','W','0'],
             ['W','0','0','X','0','W','W'],
             ['W','0','0','0','0','0','W'],
             ['W','0','W','X','0','0','W'], 
             ['W','0','0','0','0','0','W'],
             ['W','W','W','W','W','W','W']];
let pos3 = [2,1];
let cajas3 = [[2,4],[3,4]];

let mapa4 =  [ [ '0', 'W', 'W', 'W', 'W', 'W', '0' ],
               [ 'W', 'W', '0', '0', '0', 'W', 'W' ],
               [ 'W', '0', '0', 'W', '0', '0', 'W' ],
               [ 'W', '0', '0', 'X', '0', '0', 'W' ],
               [ 'W', '0', '0', 'X', '0', '0', 'W' ],
               [ 'W', 'W', '0', 'X', '0', 'W', 'W' ],
               [ '0', 'W', 'W', 'W', 'W', 'W', '0' ] ];
let pos4 = [ 1, 2 ];
let cajas4 = [ [ 3, 2 ], [ 3, 3 ], [ 3, 4 ] ];

    function crearArbol(id){
        return {
            id : id,
            hijos : [],
            pila : [],
            estadosEvaluados : new HashTable()
        }
    }

    function crearNodo(padre,action,estado,profundidad){
        return {
            id : action,
            padre : padre,
            hijos : [],
            estado : estado,
            profundidad : profundidad
        }
    }

    function actions(mundo,algoritmo){
        if(algoritmo.toLowerCase() == "bfs"){
            return startBfs(mundo);
        }
        if(algoritmo.toLowerCase() == "dfs"){
            return startDfs(mundo);
        }
        if(algoritmo.toLowerCase() == "idfs"){
            return startIDFS(mundo);
        }
    }

    function startIDFS(mundo){
        let prof = 0;
        salida = "";
        while((salida == "") && (prof < 65)){
            
            salida = startDfs(mundo,JSON.parse(JSON.stringify(prof)));
            prof++;
        }
        return salida; 
    }

    function startDfs(mundo, profMaxima=64){
        let copiaEstado = JSON.parse(JSON.stringify(mundo));
        let arbol = crearArbol("P");
        let accionesValidas = validaAcciones(copiaEstado,arbol.estadosEvaluados,0);
        return dfs(copiaEstado,accionesValidas,arbol,0,profMaxima);
    }

    function startBfs(mundo){
        let copiaEstado = JSON.parse(JSON.stringify(mundo));
        let arbol = crearArbol("P");
        let accionesValidas = validaAcciones(copiaEstado,arbol.estadosEvaluados,0);
        
        return bfs(copiaEstado,accionesValidas,arbol, 0);
    }

    function dfs(estado, acciones, arbol, nodo, profPermitida=64){
        if(esSolucion(estado)){
            return setDeInstrucciones(arbol,nodo); 
        }else{
            let copiaEstado = JSON.parse(JSON.stringify(estado));
            if(nodo == 0){
                arbol.hijos = crearHijosDfs(acciones,arbol,arbol,copiaEstado,0);                                                         
                let accionesValidas = validaAcciones(arbol.pila[0].estado,arbol.estadosEvaluados,arbol.pila[0].profundidad,profPermitida);        
                return dfs(arbol.pila[0].estado, accionesValidas, arbol, arbol.pila[0],profPermitida)   
            }else{
                    arbol.estadosEvaluados.insert(pasarEstadoAString(copiaEstado));    
                    arbol.pila[0].hijos = crearHijosDfs(acciones,arbol.pila[0],arbol, copiaEstado, arbol.pila[0].profundidad);
                    if(arbol.pila.length != 0){               
                        let accionesValidas = validaAcciones(arbol.pila[0].estado,arbol.estadosEvaluados,arbol.pila[0].profundidad, profPermitida);    
                        return dfs(arbol.pila[0].estado, accionesValidas, arbol, arbol.pila[0],profPermitida) 
                    }else{
                        return "";
                    }
            }
        }
    }

    function bfs(estado, acciones, arbol, nodo){
        if(esSolucion(estado)){
            return setDeInstrucciones(arbol,nodo);
        }else{
            let copiaEstado = JSON.parse(JSON.stringify(estado));
            if(nodo == 0){
                arbol.hijos = crearHijos(acciones,arbol,arbol,copiaEstado,0);          
                let accionesValidas = validaAcciones(arbol.pila[0].estado,arbol.estadosEvaluados,arbol.pila[0].profundidad);
                return bfs(arbol.pila[0].estado, accionesValidas, arbol, arbol.pila[0])   
            }else{
                arbol.estadosEvaluados.insert(pasarEstadoAString(copiaEstado));     
                arbol.pila[0].hijos = crearHijos(acciones,arbol.pila[0],arbol, copiaEstado,arbol.pila[0].profundidad);                                                        
                arbol.pila.shift(); 
                if(arbol.pila.length != 0){
                    let accionesValidas = validaAcciones(arbol.pila[0].estado,arbol.estadosEvaluados,arbol.pila[0].profundidad);
                    return bfs(arbol.pila[0].estado, accionesValidas, arbol, arbol.pila[0]);
                }else{
                    return "";
                }
            }
        }
    }

    function validaAcciones(estado,estadosEvaluados,profundidadActual, profundidadMaxima= 64){
        let copiaEstado = JSON.parse(JSON.stringify(estado));
        let salida = [];
        let movimientos = ["U","D","L","R"];
        let posiAgente = copiaEstado[0];
        let mapa = copiaEstado[1][0];
        let posCajas = copiaEstado[1][1];
        if(profundidadActual < profundidadMaxima){
            while(movimientos.length != 0){
                let movimiento = accionToArreglo(movimientos[0]);
                let nexStep = [posiAgente[0]+movimiento[0],posiAgente[1]+movimiento[1]];
                if((mapa[nexStep[0]][nexStep[1]] != "W") && (encontrarIndice(posCajas,nexStep) == -1)){
                    salida.push(movimientos[0]);
                    movimientos.shift();
                }else if(encontrarIndice(posCajas,nexStep) != -1){
                    let nuevaPosCaja = [nexStep[0]+movimiento[0],nexStep[1]+movimiento[1]];
                    if((mapa[nuevaPosCaja[0]][nuevaPosCaja[1]] != "W") && (encontrarIndice(posCajas,nuevaPosCaja) == -1)){
                        salida.push(movimientos[0]);
                        movimientos.shift();
                    }else{
                    movimientos.shift();
                    }
                }else{
                    movimientos.shift();
             }
            }
            salida = descartarEstados(salida, JSON.parse(JSON.stringify(copiaEstado)), estadosEvaluados);
        }
        return salida;
    }

    function descartarEstados(movimientos, estado, hashEvaluados){
        let salida = [];
        while(movimientos.length != 0){
            let flag = true;
            if(hashEvaluados.get(pasarEstadoAString(realizarAccion(movimientos[0],JSON.parse(JSON.stringify (estado))))) != -1){
                flag = false;
            }
            if(flag){
                salida.push(movimientos[0]);
                movimientos.shift();
            }else{
                movimientos.shift();
            }
        }
        return salida;
    }

    function setDeInstrucciones(arbol, nodo){
        if(nodo.id == "P"){
            return "";
        }else{
            return setDeInstrucciones(arbol, nodo.padre) + "" + nodo.id;
        }
    }

    function crearHijos(ids , padre, arbol, estado,profundidadPadre){
        let salida = [];
        let profundidadHijos = profundidadPadre + 1; 
        while(ids.length != 0){  
            let copiaEstado = JSON.parse(JSON.stringify(estado));
            copiaEstado = realizarAccion(ids[0],copiaEstado);
            let nodoNuevo = crearNodo(padre,ids[0],copiaEstado,profundidadHijos);          
            salida.push(nodoNuevo);
            arbol.pila.push(nodoNuevo);
            ids.shift();
        }
        return salida;
    }

    function crearHijosDfs(ids , padre, arbol, estado, profundidadPadre){
        let copiaIds = JSON.parse(JSON.stringify(ids));
        let profundidadHijos = profundidadPadre + 1;
        copiaIds.reverse();
        let salida = [];
        if(padre.id != "P"){
            arbol.pila.shift();
            }
        while(ids.length != 0){  
            let copiaEstado = JSON.parse(JSON.stringify(estado));
            copiaEstado = realizarAccion(ids[0],copiaEstado);
            let nodoNuevo = crearNodo(padre,ids[0],copiaEstado,profundidadHijos);          
            salida.push(nodoNuevo);
            arbol.pila.splice(0,0,nodoNuevo);
            ids.shift();
        }
        return salida;
    }

    function realizarAccion(accion,estado){
        let posAgente = estado[0];
        let mapa = estado[1][0];
        let posCajas = estado[1][1]; 
        accion = accionToArreglo(accion);
        let nextPos = [posAgente[0]+accion[0],posAgente[1]+accion[1]];
        if(encontrarIndice(posCajas,nextPos) == -1){
            estado[0] = nextPos;
        }else{
            let newPosCaja = [nextPos[0]+accion[0],nextPos[1]+accion[1]];
            estado[1][1][encontrarIndice(posCajas,nextPos)] = newPosCaja;
            estado[0] = nextPos;
        }
        return estado;
    }
    
    function esSolucion(estado){
        let flag = true;
        let mapa = estado[1][0];
        let posCajas = estado[1][1]; 
        let posObjetivo = [];
        for(let i = 0 ; i < mapa.length; i++){
            for(let j = 0 ; j < mapa[0].length; j++){
                if(mapa[i][j]=="X"){
                    posObjetivo.push([i,j]);
                }
            }
        }
        for(let i = 0; i < posObjetivo.length && flag; i++){
            if(encontrarIndice(posCajas,posObjetivo[i]) == -1){
                flag = false;
            }
        }
        return flag;
    }

    // funciones auxiliares

    function pasarEstadoAString(estado){
        let salida;
        salida = "" + estado[0][0] + estado[0][1];
        for (let i = 0; i < estado[1][1].length; i++) {
            salida +=  "" + estado[1][1][i][0] + estado[1][1][i][1];           
        }
        return salida;
    }

    function encontrarIndice(ar1, ar2){ 
        let salida = -1;
        for(let i = 0 ; (i < ar1.length) && salida == -1; i++){
            if((ar1[i][0] == ar2[0]) && (ar1[i][1] == ar2[1])){
                salida = i;
            }
        }
        return salida;
    }

    function accionToArreglo(accion){
        if(accion == "U"){
            return [-1,0]; 
        }
        if(accion == "D"){
            return [1,0]; 
        }
        if(accion == "L"){
            return [0,-1]; 
        }
        if(accion == "R"){
            return [0,1]; 
        }
    }
    let stage1 = [pos1, [mapa1,cajas1]];
    let stage2 = [pos2, [mapa2,cajas2]];
    let stage3 = [pos3, [mapa3,cajas3]];
    let stage4 = [pos4, [mapa4,cajas4]];

    let state1 = "./mapas/nivel1.txt";
    let state2 = "./mapas/nivel2.txt";
    let state3 = "./mapas/nivel3.txt";
    let state4 = "./mapas/nivel4.txt";
    async function obtenerMatriz(ruta,algoritmo) {
        let a = await readtext(ruta);
        let salida = actions(a,algoritmo);
        if(salida == ""){
            salida = "Solucion no encontrada por el algoritmo: "+ algoritmo;
        }
        console.log(salida);
    }
    obtenerMatriz(args[0],args[1]);

