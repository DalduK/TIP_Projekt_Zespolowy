const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);

const rooms = {};

io.on("polaczenie", socket => {
    socket.on("dolacz do pokoju", roomID => {
        if (rooms[roomID]) {
            rooms[roomID].push(socket.id);
        } else {
            rooms[roomID] = [socket.id];
        }
        const otherUser = rooms[roomID].find(id => id !== socket.id);
        if (otherUser) {
            socket.emit("inny uzytkownik", otherUser);
            socket.to(otherUser).emit("nowy uzytkownik polaczony", socket.id);
        }
    });

    socket.on("zapytanie", payload => {
        io.to(payload.target).emit("zapytanie", payload);
    });

    socket.on("odpowiedz", payload => {
        io.to(payload.target).emit("odpowiedz", payload);
    });

    socket.on("ice-candidate", incoming => {
        io.to(incoming.target).emit("ice-candidate", incoming.candidate);
    });
});

server.listen(5000, () => console.log('serwer dziala na porcie 5000'));