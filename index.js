//required modules
var express = require("express");
var path = require("path");
var fs = require('fs');

app = express();

app.use('/static', express.static(__dirname + '/static'))

var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

//entry point
app.get('/', (req, res) =>{
	res.sendFile(path.join(__dirname + '/index.html'));
});

app.get('/app.js', (req, res) =>{ //retrieve angular code
	res.sendFile(path.join(__dirname + '/app.js'));
});

app.get('/Action_List', (req, res) =>{ //retrieves list of clients from database
	console.log("Sending Action List");
	var result = require("./list_of_actions.json");
	res.send(result);
});

app.listen(8080);
console.log("Listening on port 8080");