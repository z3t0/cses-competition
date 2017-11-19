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
    if (debug)
    {
	console.log(msg)
	// TODO: send errors back maybe...
    }
}

let load = (path) => {
    let data

    if (fs.existsSync(path)) {
	data = fs.readFileSync(path)
	data = JSON.parse(data)
    } else {
	data = {}
	save(data, path)
    }

    return data
}

let save = (data, path) => {
    fs.writeFile(path, JSON.stringify(data), 'utf8', (err) => {
	if (err) {
	    debug(err)
	    throw 'Failed to write'
	} else {
	    debug("Successfully written to: " +  path)
	}
    })
}

let data = load(file_name)

app.use(express.static('public'))

app.get('/api/load/', (req, res) => {
    res.send(JSON.stringify(data))
})

app.post('/api/save/', upload.array(), (req, res, next) => {
    try {
	data = req.body
	save(data, file_name)
    } catch (e) {
	res.send("failed")
	debug(e)
	return
    }

    res.send("successful")
})



app.listen(3000, () => debug("Listening on port 3000"))

