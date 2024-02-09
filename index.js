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
      callback();
    });

    /**
     * @description when poll is created then poll creater will call socket io and then socket will broadcast this poll to everyone
     */
    socket.on("poll created",async(poll,callback)=>{
      console.log(poll);
      socket.emit("poll created",poll);
    })
    
    if (!socket.recovered) {
      try {
        await db.each(
          "SELECT id, content FROM messages WHERE id > ?",
          [socket.handshake.auth.serverOffset || 0],
          (_err, row) => {
            socket.emit("chat message", row.content, row.id);
          }
        );
      } catch (e) {
        // something went wrong
      }
    }
  });

  const port = process.env.PORT;

  mongodb()
    .then((res) => {
      httpServer.listen(PORT, () => {
        console.log(`app listening on port ${PORT}`);
      });
    })
    .catch((error) => console.log(error));
}
main();
// const express = require('express');
// const { createServer } = require('node:http');
// const { join } = require('node:path');
// const { Server } = require('socket.io');
// const sqlite3 = require('sqlite3');
// const { open } = require('sqlite');
// const { availableParallelism } = require('node:os');
// const cluster = require('node:cluster');
// const { createAdapter, setupPrimary } = require('@socket.io/cluster-adapter');

// if (cluster.isPrimary) {
//   const numCPUs = availableParallelism();
//   for (let i = 0; i < numCPUs; i++) {
//     cluster.fork({
//       PORT: 3000 + i
//     });
//   }

//   return setupPrimary();
// }

// async function main() {
//   const db = await open({
//     filename: 'chat.db',
//     driver: sqlite3.Database
//   });

//   await db.exec(`
//     CREATE TABLE IF NOT EXISTS messages (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       client_offset TEXT UNIQUE,
//       content TEXT
//     );
//   `);

//   const app = express();
//   const server = createServer(app);
//   const io = new Server(server, {
//     connectionStateRecovery: {},
//     adapter: createAdapter()
//   });

//   app.get('/', (req, res) => {
//     res.sendFile(join(__dirname, 'index.html'));
//   });

//   io.on('connection', async (socket) => {
//     socket.on('chat message', async (msg, clientOffset, callback) => {
//       let result;
//       try {
//         result = await db.run('INSERT INTO messages (content, client_offset) VALUES (?, ?)', msg, clientOffset);
//       } catch (e) {
//         if (e.errno === 19 /* SQLITE_CONSTRAINT */ ) {
//           callback();
//         } else {
//           // nothing to do, just let the client retry
//         }
//         return;
//       }
//       io.emit('chat message', msg, result.lastID);
//       callback();
//     });

//     if (!socket.recovered) {
//       try {
//         await db.each('SELECT id, content FROM messages WHERE id > ?',
//           [socket.handshake.auth.serverOffset || 0],
//           (_err, row) => {
//             socket.emit('chat message', row.content, row.id);
//           }
//         )
//       } catch (e) {
//         // something went wrong
//       }
//     }
//   });

//   const port = process.env.PORT;

//   server.listen(port, () => {
//     console.log(`server running at http://localhost:${port}`);
//   });
// }

// main();
