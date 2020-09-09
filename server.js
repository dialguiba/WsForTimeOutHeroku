const express = require("express");
const ws = require("ws");
var client = {};
const app = express();
const fs = require("fs");

app.use(express.static("./public"));

// Set up a headless websocket server that prints any
// events that come in.
const wsServer = new ws.Server({ noServer: true });

wsServer.on("connection", (ws, req) => {
  //Get an unique identifier
  var id = req.headers["sec-websocket-key"];
  //Save that websocket connection with its id
  client[id] = ws;

  //Recieve a message. In this case an id to do a process.
  ws.on("message", (message) => console.log(message));

  //Simulate the process of the work on server. When it finishes redirect the client or server a file.

  setInterval(function () {
    //Manda un mensaje
    //client[id].send("Redireccion");

    fs.readFile("./test.pdf", function (err, data) {
      if (err) {
        console.log(err);
      }
      client[id].send(data, { binary: true });
      client[id].close();
    });
  }, 3000);
});

// `server` is a vanilla Node.js HTTP server, so use
// the same ws upgrade process described here:
// https://www.npmjs.com/package/ws#multiple-servers-sharing-a-single-https-server
const server = app.listen(3000);
server.on("upgrade", (request, socket, head) => {
  wsServer.handleUpgrade(request, socket, head, (socket) => {
    wsServer.emit("connection", socket, request);
  });
});
