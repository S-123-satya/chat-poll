const express = require("express");
const mongodb = require("./db/index.js");
const { join } = require("node:path");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/user.routes.js");
const chatRoutes = require("./routes/chat.routes.js");
const pollRoutes = require("./routes/poll.routes.js");
require("dotenv").config();
const { createServer } = require("node:http");
const { Server } = require("socket.io");

async function main() {
  const app = express();
  const httpServer = createServer(app);
  const io = new Server(httpServer, {
    connectionStateRecovery: {},
  });

  app.use(cookieParser());
  app.use(express.json());
  app.use(express.static("public"));
  app.get("/", (req, res) => {
    res.sendFile(join(__dirname, "public", "index.html"));
  });

  app.use("/user", userRoutes);
  app.use("/chat", chatRoutes);
  app.use("/poll", pollRoutes);
  const PORT = process.env.PORT || 3000;
  io.on("connection", async (socket) => {
    console.log(`user connected`);
    socket.on("chat message", async (msg, clientOffset, callback) => {
      let result;
      console.log(msg);
      console.log(clientOffset);
      console.log(callback);
      socket.broadcast.emit("chat message", msg);
    });

    /**
     * @description when poll is created then poll creater will call socket io and then socket will broadcast this poll to everyone
     */
    socket.on("poll created",async(poll,clientOffset,callback)=>{
      console.log(poll);
      console.log(`line 45 in socket io`);
      console.log(clientOffset);
      console.log(`in poll created group`);
      socket.broadcast.emit("poll created",poll);
    })
    socket.on("poll updated", async(modify, serverOffset) => {
      // we need to display poll
      console.log(modify);
      socket.broadcast.emit("poll updated",modify);
    });
  });

  const port = process.env.PORT;

  mongodb()
    .then((res) => {
      httpServer.listen(PORT, () => {
        console.log(`data base connected app listening on port ${PORT}`);
      });
    })
    .catch((error) => console.log(error));
}
main();