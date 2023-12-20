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
app.use(express.urlencoded({ extended: true }));

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

    pool.query('SELECT * FROM models JOIN makes ON models.make_id = makes.make_id  WHERE models.make_id = $1 ORDER BY models.model_id ASC', [request.params.makeId], (error, results) => {
        if (error) throw error;

        console.log(results)
        response.status(200).json(results.rows)
    })
})

// DRIVERS ROUTES
// Drivers Index
app.get('/api/drivers', (request, response) => {
    pool.query('SELECT * FROM drivers ORDER BY id ASC', (error, results) => {
        if (error) throw error;

        console.log(results)
        response.status(200).json(results.rows)
    })
})
// Drivers Detail
app.get('/api/drivers/:driverId', (request, response) => {
    pool.query('SELECT * FROM drivers WHERE drivers.id = $1 ORDER BY id ASC', [request.params.driverId], (error, results) => {
        if (error) throw error;

        console.log(results)
        response.status(200).json(results.rows)
    })
})
// Drivers Create
app.post('/api/drivers', (request, response)=>{
    const { first_name, last_name, email, street, city, state, licensenumber, licenseexpire } = request.body;
    
    pool.query('INSERT INTO drivers (first_name, last_name, email, street, city, state, licensenumber, licenseexpire) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', [first_name, last_name, email, street, city, state, licensenumber, licenseexpire], (error, results)=>{
        if (error) throw error;
        console.log(results);
        response.status(201).json(results)
    })
})
// Drivers Delete
app.delete('/api/drivers/:driverId', (request, response)=>{
    pool.query('DELETE FROM drivers WHERE drivers.id = $1', [request.params.driverId], (error, results)=>{
        if (error) throw error;
        console.log(results);
        response.status(200).send(`Successfully deleted driver with id ${request.params.driverId}`);
    })
})
// Drivers Update
app.put('/api/drivers/:driverId', (request, response)=>{
    const { first_name, last_name, email, street, city, state, licensenumber, licenseexpire } = request.body;
    
    pool.query('UPDATE drivers SET first_name = $1, last_name = $2, email = $3, street = $4, city = $5, state = $6, licensenumber = $7, licenseexpire = $8 WHERE id = $9 RETURNING *', [first_name, last_name, email, street, city, state, licensenumber, licenseexpire, request.params.driverId], (error, results)=>{
        if (error) throw error;
        console.log(results);
        response.status(201).json(results)
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