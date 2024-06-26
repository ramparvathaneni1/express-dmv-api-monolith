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
// Makes Index
app.get('/api/makes', (request, response) => {
    pool.query('SELECT * FROM makes ORDER BY make_id ASC', (error, results) => {
        if (error) throw error;

        console.log(results)
        response.status(200).json(results.rows)
    })
})
// Makes Detail
app.get('/api/makes/:makeId', (request, response) => {
    pool.query('SELECT * FROM makes WHERE makes.make_id = $1', [request.params.makeId], (error, results) => {
        if (error) throw error;

        console.log(results)
        response.status(200).json(results.rows)
    })
})
// Makes Create
app.post('/api/makes', (request, response)=>{
    const { make_name } = request.body;
    
    pool.query('INSERT INTO makes (make_name) VALUES ($1) RETURNING *', [make_name], (error, results)=>{
        if (error) throw error;
        console.log(results);
        response.status(201).json(results)
    })
})
// Makes Delete
app.delete('/api/makes/:makeId', (request, response)=>{
    pool.query('DELETE FROM makes WHERE makes.make_id = $1', [request.params.makeId], (error, results)=>{
        if (error) throw error;
        console.log(results);
        response.status(200).send(`Successfully deleted make with id ${request.params.makeId}`);
    })
})
// Makes Update
app.put('/api/makes/:makeId', (request, response)=>{
    const { make_name } = request.body;
    
    pool.query('UPDATE makes SET make_name = $1 WHERE make_id = $2 RETURNING *', [make_name, request.params.makeId], (error, results)=>{
        if (error) throw error;
        console.log(results);
        response.status(201).json(results)
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

// Models Detail
app.get('/api/models/:modelId', (request, response) => {
    pool.query('SELECT * FROM models JOIN makes ON models.make_id = makes.make_id WHERE models.model_id = $1', [request.params.modelId], (error, results) => {
        if (error) throw error;

        console.log(results)
        response.status(200).json(results.rows)
    })
})
// Models Create
app.post('/api/models', (request, response)=>{
    const { model_name, make_id } = request.body;
    
    pool.query('INSERT INTO models (model_name, make_id) VALUES ($1, $2) RETURNING *', [model_name, make_id], (error, results)=>{
        if (error) throw error;
        console.log(results);
        response.status(201).json(results)
    })
})
// Models Delete
app.delete('/api/models/:modelId', (request, response)=>{
    pool.query('DELETE FROM models WHERE models.model_id = $1', [request.params.modelId], (error, results)=>{
        if (error) throw error;
        console.log(results);
        response.status(200).send(`Successfully deleted model with id ${request.params.modelId}`);
    })
})
// Models Update
app.put('/api/models/:modelId', (request, response)=>{
    const { model_name, make_id } = request.body;
    
    pool.query('UPDATE models SET model_name = $1, make_id = $2 WHERE model_id = $3 RETURNING *', [model_name, make_id, request.params.modelId], (error, results)=>{
        if (error) throw error;
        console.log(results);
        response.status(201).json(results)
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
    pool.query('SELECT * FROM drivers WHERE drivers.id = $1', [request.params.driverId], (error, results) => {
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
// Plates Index
app.get('/api/plates', (request, response) => {
    pool.query('SELECT plates.*, makes.*, models.*, drivers.first_name, drivers.last_name, drivers.email, drivers.street, drivers.city, drivers.state, drivers.licensenumber, drivers.licenseexpire FROM plates JOIN makes ON plates.make_id = makes.make_id JOIN models ON plates.model_id = models.model_id JOIN drivers ON plates.driver_id = drivers.id ORDER BY plates.id ASC', (error, results) => {
        if (error) throw error;

        console.log(results)
        response.status(200).json(results.rows)
    })
})
// Plates Detail
app.get('/api/plates/:plateId', (request, response) => {
    pool.query('SELECT plates.*, makes.*, models.*, drivers.first_name, drivers.last_name, drivers.email, drivers.street, drivers.city, drivers.state, drivers.licensenumber, drivers.licenseexpire FROM plates JOIN makes ON plates.make_id = makes.make_id JOIN models ON plates.model_id = models.model_id JOIN drivers ON plates.driver_id = drivers.id WHERE plates.id = $1', [request.params.plateId], (error, results) => {
        if (error) throw error;

        console.log(results)
        response.status(200).json(results.rows)
    })
})
// plates Create
app.post('/api/plates', (request, response)=>{
    const { vin, make_id, model_id, platetext, driver_id } = request.body;
    
    pool.query('INSERT INTO plates (vin, make_id, model_id, platetext, driver_id) VALUES ($1, $2, $3, $4, $5) RETURNING *', [vin, make_id, model_id, platetext, driver_id], (error, results)=>{
        if (error) throw error;
        console.log(results);
        response.status(201).json(results)
    })
})
// plates Delete
app.delete('/api/plates/:plateId', (request, response)=>{
    pool.query('DELETE FROM plates WHERE plates.id = $1', [request.params.plateId], (error, results)=>{
        if (error) throw error;
        console.log(results);
        response.status(200).send(`Successfully deleted plate with id ${request.params.plateId}`);
    })
})
// Plates Update
app.put('/api/plates/:plateId', (request, response)=>{
    const { vin, make_id, model_id, platetext, driver_id } = request.body;

    pool.query('UPDATE plates SET vin = $1, make_id = $2, model_id = $3, platetext = $4, driver_id = $5 WHERE id = $6 RETURNING *', [vin, make_id, model_id, platetext, driver_id, request.params.plateId], (error, results)=>{
        if (error) throw error;
        console.log(results);
        response.status(201).json(results)
    })
})
// This tells the express application to listen for requests on port 3001
app.listen("3001", () => {});