// imports the express npm module
const express = require("express");

// imports the cors npm module
const cors = require("cors");

// imports the Pool object from the pg npm module, specifically
const Pool = require("pg").Pool;

// This creates a new connection to our database. Postgres listens on port 5432 by default
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "dmv_app_db",
  password: "postgres",
  port: 5432,
});

// Creates a new instance of express for our app
const app = express();

// .use is middleware - something that occurs between the request and response cycle.
app.use(cors());

// We will be using JSON objects to communcate with our backend, no HTML pages.
app.use(express.json());

// This route will return 'Hi There' when you go to localhost:3001/ in the browser
app.get("/", (req, res) => {
  res.send("Hi There");
});

// MAKES ROUTES
app.get('/api/makes', (request, response) => {
    pool.query('SELECT * FROM makes ORDER BY make_id ASC', (error, results) => {
        if (error) throw error;

        console.log(results)
        response.status(200).json(results.rows)
    })
})

// MODELS ROUTES
app.get('/api/models', (request, response) => {
    pool.query('SELECT * FROM models JOIN makes ON models.make_id = makes.make_id ORDER BY models.model_id ASC', (error, results) => {
        if (error) throw error;

        console.log(results)
        response.status(200).json(results.rows)
    })
})

// NESTED ROUTE FOR MODELS BELONGING TO ONE MAKE
app.get('/api/makes/:makeId/models', (request, response) => {
    // ensure the makeId is a number
    if(isNaN(parseInt(request.params.makeId))){
        throw new Error("makeId must be a valid number")
    }
    pool.query(`SELECT * FROM models JOIN makes ON models.make_id = makes.make_id  WHERE models.make_id = ${request.params.makeId} ORDER BY models.model_id ASC`, (error, results) => {
        if (error) throw error;

        console.log(results)
        response.status(200).json(results.rows)
    })
})

// DRIVERS ROUTES
app.get('/api/drivers', (request, response) => {
    pool.query('SELECT * FROM drivers ORDER BY id ASC', (error, results) => {
        if (error) throw error;

        console.log(results)
        response.status(200).json(results.rows)
    })
})

// PLATES ROUTES
app.get('/api/plates', (request, response) => {
    pool.query('SELECT * FROM plates JOIN makes ON plates.Make_Id = makes.make_id JOIN models ON plates.Model_Id = models.model_id JOIN drivers ON plates.driver_id = drivers.id ORDER BY plates.id ASC', (error, results) => {
        if (error) throw error;

        console.log(results)
        response.status(200).json(results.rows)
    })
})

// This tells the express application to listen for requests on port 3001
app.listen("3001", () => {});