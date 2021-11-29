'use strict'

function hash(value){
    let bufLen = 64;
    let baseMult = (bufLen + value.length)/5.73;
    return _hash(value,bufLen,baseMult).toString('hex');
}

function moveBytes(i,buf,charCode,mult){
    buf[i] = (buf[i] + charCode * mult) << 1;
    buf[i] = (buf[i] + mult) >> 3;
}

function _hash(value, bufLen, baseMult) {
    let buf = Buffer.alloc(bufLen);
    let mult;
    let charCode;

    for(let c of value){
        charCode = c.charCodeAt();
        for (let i = 0; i < bufLen; i++) {
            mult = baseMult + (i + 1); 
            moveBytes(i,buf,charCode,mult);
        }
    }
    return buf;
}

class HashTable{

    constructor(){
        this.table = {};    
    }

    hash(value){
        return hash(value);
    }

    insert(value){
        this.table[value] = value;   
    }

    get(value){
        let tableValue = this.table[value];
        return tableValue ? tableValue : -1;
    }
}


module.exports = HashTable;