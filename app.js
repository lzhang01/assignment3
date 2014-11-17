//Initialization
var express = require('express');
var bodyParser = require('body-parser');
var validator = require('validator');
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var mongoUri = process.env.MONGOLAB_URI ||
			   process.env.MONGOHQ_URL ||
			   'mongodb://localhost/whereintheworld';
var mongo = require('mongodb');
var db = mongo.Db.connect(mongoUri, function(error, databaseConnection) {
	db = databaseConnection;
});

app.all('*', function(req, res, next){
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
	res.header('Access-Control-Allow-Headers', 'X-Requested-With');
	next();
});

app.post('/sendLocation', function(request, response) {
	var login = request.body.login,
	lat = request.body.lat,
	lng = request.body.lng,
	d = new Date();
	validator.isNumeric(lat);
	validator.isNumeric(lng);
	validator.isAlphanumeric(login);
	var toInsert = {
		"login":login,
		"lat":lat,
		"lng":lng,
		"created_at":d,
	};
	db.locations.insert(toInsert);
	var JSONstring = '{"characters":[],"students":';
	db.locations.find().sort({ created_at: 1 });
	JSONstring += "[";
	for (var i = 0; i < 100; i++) {
		JSONstring += cursor[i];
	}
	JSONstring += "]}";
	response.send(JSONstring);	
});

app.listen(process.env.PORT || 3000);