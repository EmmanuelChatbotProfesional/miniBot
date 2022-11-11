const fs = require('fs');

const esNumeroValido = (numero) => {
    const regexGroup = /\@g.us\b/gm;
    const existe = numero.match(regexGroup);
    return !existe
}

const obtenerNumeroCelular = (number) => {
    number = number.replace('@c.us', '');
    number = `${number}@c.us`;
    return number
}

const esUrl = (path) => {
    try{
        regex = /^(http(s)?:\/\/)[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/i;
        match = path.match(regex);
        return match[0]
    }catch(e){
        return null
    }
}

const verificarArchivoEnv = () => {
    const pathEnv = `${__dirname}/../.env`;
    const isExist = fs.existsSync(pathEnv);
    if(!isExist){
        console.log(` ATENCION!  es necesario crear el archivo .env para que funcione el programa, basarse en el archivo .envEjemplo`)
    }
}

const ubicacionChrome = () => {
    if(process.env.SISTEMA_OPERATIVO_SERVIDOR == "macOS") {
        return '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
    } else if(process.env.SISTEMA_OPERATIVO_SERVIDOR == "windows") {
        return "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe";
    } else if(process.env.SISTEMA_OPERATIVO_SERVIDOR == "linux") {
        return '/usr/bin/google-chrome-stable';
    }
}

module.exports = {esNumeroValido, obtenerNumeroCelular, esUrl,verificarArchivoEnv, ubicacionChrome}