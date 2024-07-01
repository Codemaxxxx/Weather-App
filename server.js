const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Creating an Instance of the app

const app = express();
const port = 5500;

//Declaring the Main Variable to store Info
let projectData = {};

// Initializing Middleware

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('Website'));


// Adding a Post route

app.post('/add', async (req, res) => {
    const info = await req.body;
    projectData = info;
    console.log(projectData);
    res.send(projectData);
});

// Adding a Get route

app.get('/all', async (req, res) => {
    if(projectData) {
        res.send(projectData)
    }
});

// Starting the Server
app.listen(port, () => {
    console.log(`Main Server is running on localhost ${port}`);
});
