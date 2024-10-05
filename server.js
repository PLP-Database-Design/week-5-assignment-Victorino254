//Iniatialzing Depandancies
const express = require('express');
const app = express()
const mysql = require('mysql2');
const dotenv = require ('dotenv')
const cors = require ('cors')

app.use(express.json());
app.use(cors());
dotenv.config();

//connectin to database
const db= mysql.createConnection(
    {
        host:process.env.DB_HOST,
        user:process.env.DB_USER,
        password:process.env.DB_PASSWORD,
        database:process.env.DB_NAME

    }
);
 
//Check if db connection works
db.connect((err) => {
    //No connection
    if(err)
    console.error('Error connecting to MySQL db:', err.code, err.message);
        return;

    //Yes connection
    console.log("connected to mysql successfully as id: ", db.threadid);
})

    //1.Retrieve all patients
    app.get('/get-patients', (req, res) => {
        const getPatients = "SELECT * FROM patients";
        // Retrieve data from database
        db.query(getPatients, (err, results) => {
            if (err) {
                return res.status(500).send("Failed to fetch the patients");
            }
            // Display results/data
            res.status(200).send(results);
        });
    });

    //2. Retrieve all providers
    app.get('/get-providers', (req, res) => {
        const getProviders = "SELECT * FROM providers";
        // Retrieve data from database
        db.query(getProviders, (err, results) => {
            if (err) {
                return res.status(500).send("Failed to fetch the patients");
            }
            // Display results/data
            res.status(200).send(results);
        });
    });


// 3. GET endpoint to retrieve patients by first name
app.get('/get-patients-by-first-name', (req, res) => { 
    const firstName = req.query.firstName; // Get the first name from query parameters

    if (!firstName) {
        return res.status(400).send("First name is required");
    }

    const getPatientsByFirstName = "SELECT * FROM patients WHERE first_name = ?"; // SQL query

    // Retrieve data from database
    db.query(getPatientsByFirstName, [firstName], (err, results) => {
        if (err) {
            console.error("Error fetching patients by first name:", err);
            return res.status(500).send("Failed to fetch patients");
        }
        // Display results/data
        res.status(200).send(results);
    });
});


//4. GET endpoint to retrieve all providers by their specialty
app.get('/get-providers-by-specialty', (req, res) => {
    const specialty = req.query.specialty; // Get the specialty from query params
    
    // Check if the specialty is provided
    if (!specialty) {
        return res.status(400).send("Specialty is required");
    }

    const getProvidersBySpecialty = "SELECT * FROM providers WHERE provider_specialty = ?";
    
    // Retrieve data from the database
    db.query(getProvidersBySpecialty, [specialty], (err, results) => {
        if (err) {
            console.error("Error fetching providers by specialty:", err);
            return res.status(500).send("Failed to fetch providers");
        }

        // Check if any providers were found
        if (results.length === 0) {
            return res.status(404).send("No providers found for the specified specialty");
        }

        // Display results/data
        res.status(200).send(results);
    });
});


    
// listen to the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

