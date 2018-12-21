"use strict"
var idCounter = 5;
let tasks = [{
        id: 1,
        text: "Comprar billetes de avión"
    },
    {
        id: 2,
        text: "Hacer las maletas"
    },
    {
        id: 3,
        text: "Comprar regalos de reyes"
    },
    {
        id: 4,
        text: "Reservar coche"
    }
];
// app.js
const config = require("./config");
const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const logger = require('morgan');




// Crear un servidor Express.js
const app = express();


const ficherosEstaticos = path.join(__dirname, "public");

//use
app.use(logger('dev'));

app.use(express.static(ficherosEstaticos));

app.use(bodyParser.json());


app.get("/", function (request, response) {
    response.sendFile(path.join(__dirname, "public", "tasks.html"));
});

app.get("/tasks",  function (request, response) {
    response.json(tasks);
});

app.post("/addTask", function (request, response) {
    let newTask = {
        id: idCounter,
        text: request.body.text
    };
    idCounter++;
    tasks.push(newTask);
    response.status(201);
    response.json(newTask);
});

app.delete("/tasks/:id", function (request, response) {
    let id = Number(request.params.id);
    id = tasks.map(element => element.id).indexOf(id);
    if (id >= 0 && !isNaN(id) && tasks[id] !== undefined ) {
        tasks.splice(id, 1);
        // Código 200 = OK
        response.status(200);
    } else {
        // Error 404 = Not found
        response.status(404);
    }
    response.end();
});
// Arrancar el servidor
app.listen(config.port, function (err) {
    if (err) {
        console.log("ERROR al iniciar el servidor");
    } else {
        console.log(`Servidor arrancado en el puerto ${config.port}`);
    }
});