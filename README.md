# roblox-long-polling

Simple event communication between Roblox servers and Node.js

## Installation

#### Server
```
npm install --save roblox-long-polling
```

#### Client

Put the contents of [client.lua](https://github.com/Reselim/roblox-long-polling/blob/master/client.lua) inside of a ModuleScript.

## Example

#### Server

```js
var longPolling = require("roblox-long-polling");
var server = new longPolling();

server.on("connection", (conn) => {
	console.log(`New connection (id: ${conn.id})`);

	conn.on("ping", (message) => {
		console.log(`echo: ${message}`);
		conn.send("pong", message);
	});

	conn.on("broadcast", (message) => {
		console.log(`broadcast: ${message}`);
		server.broadcast("broadcast", message);
	});

	conn.on("disconnect", () => {
		console.log(`${conn.id} disconnected`);
	});
});

server.listen(8080);
```

#### Client

```lua
local Connection = require(script.Connection)
local client = Connection.new()

client:connect("127.0.0.1:8080")

client:on("pong", function(message)
	print("echoed from server: ", message)
end)

client:send("ping", "Hello world!")

game:BindToClose(function()
	client:disconnect()
end)
```
