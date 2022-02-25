/*
Author: Balogh Levente
Address: levi@proc.hu
2021-2022
*/
const ws = new WebSocket('wss://SERVERISDE_URL:8080');

class EmitEvents {

    /**
     * @callback registerEventHandlerCallback
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
    static executeCallback(data) {
        if (this._events[data.id]) {
            this._events[data.id](data.data);
        }
    }

    /**
     * Sends a message towards the server
     * @param {EmitData} data 
     */
    static sendMessage(data){
        ws.send(JSON.stringify(data))
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

ws.addEventListener('message', (event) => {
    //ÜZENET ÉRKEZETT
    EmitEvents.executeCallback(JSON.parse(event.data));
});