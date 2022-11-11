const fs = require('fs');
const { MessageMedia } = require('whatsapp-web.js');
const { obtenerNumeroCelular} = require('./auxiliares')
const DIR_MEDIA = `${__dirname}/../archivosAEnviar`;

/**
 * Enviamos un mensaje simple (texto) a nuestro cliente
 * @param {*} number 
 */
 const enviarMensaje = async (client, number = null, text = null, trigger = null) => {
    //setTimeout(async () => {
     number = obtenerNumeroCelular(number)
     const message = text
     client.sendMessage(number, message);
     //await readChat(number, message, trigger)
     console.log(`... Enviando mensajes....`);
    //},DELAY_TIME)
 }


/**
 * Enviamos archivos multimedia a nuestro cliente
 * @param {*} number 
 * @param {*} fileName 
 */

 const enviarMedia = (client, number = null, fileName = null) => {
    if(!client) return cosnole.error("El objeto cliente no está definido.");
    try {
        number = obtenerNumeroCelular(number || 0)
        const file = `${DIR_MEDIA}/${fileName}`;
        if (fs.existsSync(file)) {
            const media = MessageMedia.fromFilePath(file);
            var tipoArchivo = media.mimetype.split('/');
            if (tipoArchivo[0] == 'video') {
                //client.sendMessage(number, media, {sendMediaAsDocument: true });
                client.sendMessage(number, media);
                console.log(`... Enviando Video....`);
            } else {
                client.sendMessage(number, media);
                console.log(`... Enviando media....`);
            }
        }
    } catch(e) {
        throw e;
    }
}

const enviarNotaVoz = (client, number = null, fileName = null) => {
    if(!client) return cosnole.error("El objeto cliente no está definido.");
    try { 
       number = obtenerNumeroCelular(number || 0)
       const file = `${DIR_MEDIA}/${fileName}`;
       if (fs.existsSync(file)) {
           const media = MessageMedia.fromFilePath(file);
           client.sendMessage(number, media ,{ sendAudioAsVoice: true });
           console.log(`... Enviando Nota de voz....`);
       }
    } catch(e) {
       throw e;
    }
}

module.exports = {enviarMensaje, enviarMedia, enviarNotaVoz}