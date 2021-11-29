var fs = require('fs');


function crearTxt(path) {
    return new Promise(resolve => {
      setTimeout(() => {
        fs.readFile(`${ path }`,(err, data)=>{
            data = data.toString()
            data = data.split('\n')
            word = []
            posAgent =[]
            posObjetos = []
            flag = true;
            data.forEach((line,index)=>{
            
            
            if (line.toUpperCase().indexOf('W') != -1){
                word.push([...line])
            }else {
            if (flag){
                posAgent = line.split(",");
                flag = false
            }else {
                if(line != ""){
                    posObjetos.push(line.split(","));

                }





                
            }
            
            }
            });
            
            posAgent[0] = parseInt(posAgent[0])
            posAgent[1] = parseInt(posAgent[1])
            posObjetos.forEach((e)=> {
                e[0] = parseInt(e[0])
                e[1] = parseInt(e[1])
            
            
            })
            let array = [posAgent,[word,posObjetos]];
            
            resolve(array)
            
            //console.log(data)
            
            
            
            })
      }, 10);
    });
  }

  async function asyncCall(path) {
    // console.log('calling');
    const result = await crearTxt(path);
    // console.log(result);
    return result;
  }
  
module.exports = asyncCall;
