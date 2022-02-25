/*
Author: Balogh Levente
Address: levi@proc.hu
2021-2022
*/
import WebSocket, { WebSocketServer } from "ws";
import httpsServer from './httpsServer.js';

/**
 * @type {WebSocketServer}
 */
var wss;

class EmitEvents {
    /**
     * @callback registerEventHandlerCallback
     * @param {WebSocket} socket
     * @param {any|any[]} data
     */

    static _events = [];

    /**
     * Registers a function that runs when a request arrives for the server with the rigth id.
     * @param {string} id 
     * @param {registerEventHandlerCallback} callback callback 
     */
    static registerEventHandler(id, callback) {
        this._events[id] = callback;
    }

    /**
     * Removes an already registered event handler function
     * @param {string} id 
     */
    static unregisterEventHandler(id) {
        this._events[id] = undefined;
    }

    /**
     * Executes a registered function
     * @param {EmitData} data 
     * @param {WebSocket} socket 
     */
    static executeCallback(data, socket) {
        if (this._events[data.id]) {
            this._events[data.id](socket, data.data);
        }
    }
}

class EmitData {
    /**
     * Data trasmitted between client and server
     * @param {string} id 
     * @param {any} data 
     */
    constructor(id, data = undefined) {
        this.id = id;
        this.data = data;
    }
}

export default class wsa {
    static EmitData = EmitData;
    static EmitEvents = EmitEvents;
    static initilaliseWebSocketServer = initilaliseWebSocketServer;
    static wss = wss;
}

/**
 * Előkészíti használatra az SSL/TLS-es WebSocketServer-t (Port: 9069)
 */
function initilaliseWebSocketServer() {
    wss = new WebSocketServer({ /*port: 9069*/ server: httpsServer });
    Logger.passed('WebSocket szerver előkészítve.');
    httpsServer.listen(8080);
    Logger.passed('A WebSocket/HTTPS szerver várja a kapcsolatokat.');

    wss.addListener('connection', (socket, req) => {
        Logger.info(`Új kliens csatlakozott: ${req.socket.remoteAddress}:${req.socket.remotePort} (${req.socket.remoteFamily})`);

        socket.addListener('message', (data) => {
            //Logger.info(`Adat jött innen: ${req.socket.remoteAddress}:${req.socket.remotePort} (${req.socket.remoteFamily})\nAdat:${data.toString()}`);
            var obj;
            try {
                obj = JSON.parse(data.toString());
            } catch (error) {
                //Nem JSON
                return;
            }

            EmitEvents.executeCallback(obj, socket);
        });
    });

    wss.addListener('close', () => {
        Logger.info('Egy kliens lecsatlakozott.');
    });
}


//export default { EmitData, EmitEvents, initilaliseWebSocketServer, wss };

Logger.passed("Saját WebSocket API betöltve.");