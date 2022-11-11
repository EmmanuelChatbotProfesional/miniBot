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
        console.log(` ATENCION!  es necesario crear el archivo .env para que funcione el programa, basarse en el archivo .env.example`)
    }
}

module.exports = {esNumeroValido, obtenerNumeroCelular, esUrl,verificarArchivoEnv}