import http from "http";
import SocketIO from "socket.io";
import express from "express";
import path from "path";

const app = express();
app.use(express.static(path.join(__dirname, "build")));
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/build/index.html"));
});
// app.get("/*", (_, res) => res.redirect("/"));

const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);

const handleListen = () => console.log(`Listening on http://localhost:8080`);

httpServer.listen(8080, handleListen);
