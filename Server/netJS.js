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

    /**
     * Sends a NetJS message to the given socket
     * @param {WebSocket} socket 
     * @param {EmitData} data 
     */
    static sendMessage(socket, data){
        socket.send(JSON.stringify(data));
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

export default class netJS {
    static EmitData = EmitData;
    static EmitEvents = EmitEvents;
    static initilaliseWebSocketServer = initilaliseWebSocketServer;
    static wss = wss;
}

/**
 * Sets up the server (Port: 8080)
 */
function initilaliseWebSocketServer() {
    wss = new WebSocketServer({ /*port: 8080*/ server: httpsServer });
    console.log('WebSocket server has been set up');
    httpsServer.listen(8080);
    console.log('The WebSocket/HTTPS server is waiting for incoming connections.');

    wss.addListener('connection', (socket, req) => {
        console.log(`A client has connected: ${req.socket.remoteAddress}:${req.socket.remotePort} (${req.socket.remoteFamily})`);

        socket.addListener('message', (data) => {
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
        console.log('A client disconnected');
    });
}

console.log("NetJS loaded!");