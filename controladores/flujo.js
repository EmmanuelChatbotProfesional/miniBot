const  reglasRequest = require('../flujo/mensajesRequest.json')
const  reglasReponse = require('../flujo/mensajesResponse.json')
const {esUrl} = require('./auxiliares')

const obtenerMensajes = async (mensaje) => {
    console.log('mensaje')
    const data = await get(mensaje)
    return data
}
    
const responderMensajes = async (regla) => {
    const data = await reply(regla)
    if(data && data.media) {
        if(esUrl(data.media)) {
            console.log("El archivo media no puede ser un link, debe ser un archivo que esté en la carpeta 'archivosAEnviar'");
        } else {
            return {...data,...{media:data.media}}
        }
    }
    return data
}

/**
 * 
 * @param {*} mensaje mensaje envíado por 
 * @returns 
 */
 const get = (mensaje) => new Promise((resolve, reject) => {
    var keys = [];
    var reglas_saltadas = []
    for (var regla of reglasRequest) {
        var contieneKey =  false;
        const matchType = regla.tipo_concordancia;
        if (matchType == "1") {
            contieneKey = regla.palabras_clave.includes(mensaje);
        } else {
            contieneKey = regla.palabras_clave.some(element => {
                if (mensaje.includes(element)) {
                return true;
                }
                return false;
            });
        }
        if (contieneKey) {
            reglas_saltadas.push(...regla.reglas_saltadas)
            keys.push( regla.key)
        }
    }
    var k = keys.filter(item => !reglas_saltadas.includes(item));
    console.log(reglas_saltadas)
    const response =  k || null
    resolve(response)
})

/** 
 * Responder mensaje
 * @param regla código de la regla con la que s responderá el mensaje
 * 
*/
const reply = (regla) => new Promise((resolve, reject) => {
    let resData = { mensajeRespuesta: '', media: null, trigger: null }
        const responseFind = reglasReponse[regla] || {};
        resData = {
            ...resData, 
            ...responseFind,
            mensajeRespuesta:responseFind.mensajeRespuesta.join('')}
        resolve(resData);
        //return
})

module.exports = {obtenerMensajes, responderMensajes}