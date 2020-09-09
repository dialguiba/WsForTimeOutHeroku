// get the references of the page elements.
let form = document.getElementById("form-msg");
let txtMsg = document.getElementById("msg");
let listMsgs = document.getElementById("msgs");
let socketStatus = document.getElementById("status");
let btnClose = document.getElementById("close");
//

let socket;

function conectar() {
  // Creating a new WebSocket connection.
  socket = new WebSocket("ws://localhost:3000");

  socket.onopen = function (event) {
    socketStatus.innerHTML = "Connected to: " + event.currentTarget.URL;
    socketStatus.className = "open";
    socket.send("idlibro");
  };

  socket.onmessage = function (e) {
    pdfBlob = new Blob([e.data], { type: "application/pdf" });
    url = webkitURL.createObjectURL(pdfBlob);
    window.open(url);
  };

  socket.onerror = function (error) {
    console.log("WebSocket error: " + error);
  };
}
