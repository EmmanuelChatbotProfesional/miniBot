const DELAY_TIME = 1000; //ms
const cors = require('cors');
const express = require('express');
const qrcode = require('qrcode-terminal');
const { Client, LocalAuth } = require('whatsapp-web.js');
const { obtenerMensajes, responderMensajes} = require('./controladores/flujo')
const { esNumeroValido, obtenerNumeroCelular, verificarArchivoEnv, ubicacionChrome} = require('./controladores/auxiliares')
const { enviarMensaje, enviarMedia, enviarNotaVoz} = require('./controladores/envio')

const webFramework = express();
webFramework.use(cors());
webFramework.use(express.json());
const whatsappServer = require('http').Server(webFramework);
const portWhatsapp = process.env.PUERTO_WHATSAPP || 3000;


var client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: true, executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' }
});

/** Escuchar mensajes enviados  */
const escucharMensaje = () => client.on('message', async msg => {
    const { from, body, hasMedia } = msg;
    if(!esNumeroValido(from)) {
        return
    }
    // evitar que se publiquen estados
    if (from === 'status@broadcast') {
        return
    }
    mensaje = body.toLowerCase();
    console.log('Usuario: ',mensaje)
    const number = obtenerNumeroCelular(from)
    const reglas = await obtenerMensajes(mensaje);

    if (reglas) {
        procesarReglas(reglas,from)
    }
});

/** Procesa las reglasas que se enviarán */
async function procesarReglas(reglas, from) {
    var segundosEspera = 0;
    for (var regla of reglas) {
        const response = await responderMensajes(regla);
       
        if (response.tiempo_espera_antes_enviar_regla) {
            segundosEspera += response.tiempo_espera_antes_enviar_regla;
        }
        setTimeout(async () => {
            await enviarMensaje(client, from, response.mensajeRespuesta, response.trigger);
            if (response.media) {
                if(response.esNotaVoz && response.esNotaVoz == 1) {
                    enviarNotaVoz(client, from, response.media);
                } else  {
                    enviarMedia(client, from, response.media);
                }
            }
        }, (DELAY_TIME*segundosEspera))
        if (response.tiempo_espera_siguiente_regla) {
            segundosEspera += response.tiempo_espera_siguiente_regla;
        } else {
            segundosEspera += 2;
        }
    }
    return
}

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
    console.log("Escanear QR con whatsapp");
    console.log(`Ver QR http://localhost:${portWhatsapp}/qr`)
    socketEvents.sendQR(qr)

});

client.on('ready', () => {
    console.log('El Cliente está listo!');
    escucharMensaje();
});

client.on('auth_failure', (e) => {
    console.log("Falló la autentificación con el siguiente error:")
    console.log(e)    
    // connectionLost()
});

client.on('authenticated', () => {
    console.log(''); 
    console.log('AUTENTICADO'); 
    console.log('Esperar a que el cliente esté listo'); 
});

client.initialize();
verificarArchivoEnv();
/*
whatsappServer.listen(portWhatsapp, () => {
    console.log(`El server esta listo por el puerto ${portWhatsapp}`);
})*/

 