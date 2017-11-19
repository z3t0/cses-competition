// Modules
const express = require('express')
const app = express()
const fs = require('fs')
const bodyParser = require('body-parser');
const multer = require('multer'); // v1.0.5
const upload = multer(); // for parsing multipart/form-data


const file_name = "data.json"
const DEBUG = true

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded


debug = (msg) => {
    if (DEBUG)
    {
	console.log(msg)
    }
}


// Load data
let load = (path) => {
    let data

    // Check if the file exists
    if (fs.existsSync(path)) {
	data = fs.readFileSync(path)
	data = JSON.parse(data)
    } else {
	// Create an Empty file
	data = {}
	save(data, path)
    }

    return data
}

// Save data
let save = (data, path) => {
    // Write the data to file
    fs.writeFile(path, JSON.stringify(data), 'utf8', (err) => {
	if (err) {
	    debug(err)
	    throw 'Failed to write'
	} else {
	    debug("Successfully written to: " +  path)
	}
    })
}

// Load data on startup
let data = load(file_name)

// Serve the front-end
app.use(express.static('public'))

// Send the database
app.get('/api/load/', (req, res) => {
    res.send(JSON.stringify(data))
})

// Save the modified database
app.post('/api/save/', upload.array(), (req, res, next) => {

    try {
	// Parse
	data = req.body
	save(data, file_name)
    } catch (e) {
	// Let the front-end know there was an issue
	res.send("failed")
	debug(e)
	return
    }

    // Otherwise let it know it was successful
    res.send("successful")
})

// Listen on port
app.listen(3000, () => debug("Listening on port 3000"))

