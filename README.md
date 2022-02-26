# NetJS 
NetJS is a JavaScript library for trasmitting data with websockets between clientside and serverside made by Levente Balogh, a computer science from Hungary.

### Requirements:
 - Server side:
	- NodeJs 17.6.0 or later
	 - ws (npm package) `npm install ws`

## Usage
To pass values between the server and the client, you need to use `EmitData` objects. Luckily, you don't have to worry about serializing or deserializing, I've got this covered for you.
#### Registering serverside event handlers
```js
netJS.EmitEvents.registerEventHandler('EVENTID', callback(socket, data);
```

#### Registering clientside event handlers
```js
EmitEvents.registerEventHalder('EVENTID', callback(data));
```

#### Sending message from server to client
```js
netJS.EmitEvens.sendMessage(new EmitData('CLIENTSIDE_EVENT_NAME', data));
```

#### Sending message from client to server
```js
EmitEvens.sendMessage(new EmitData('SERVERSIDE_EVENT_NAME', data));
```
