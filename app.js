var express = require("express");
var mongojs = require("mongojs");

// mongodb
var mongodb = mongojs(process.env.MONGOLAB_URI || "localprojectsrpg");
var ObjectId = mongojs.ObjectId;

// configure app
var app = express();
app.configure(function() {
	app.use("/", express.static(__dirname + "/public"));
	app.use(express.bodyParser());
	app.use(express.logger());
});

// simple CRUD for mongo
[ "game", "question", "token" ].forEach(function(key) {
	var collection = mongodb.collection(key);

	// read
	app.get("/api/" + key, function(req, res) {
		collection.find(function(error, objects) {
			if (!error) {
				res.send(objects);
			}
			else {
				res.send(500);
				console.log(error);
			}
		});
	});

	// create
	app.post("/api/" + key, function(req, res) {
		collection.save(req.body, function(error, saved) {
			if (!error) {
				res.send(saved, 200);
			}
			else {
				res.send(500);
				console.log(error);
			}
		});
	});

	// read
	app.get("/api/" + key + "/:id", function(req, res) {
		collection.findOne({ _id: ObjectId(req.params.id) }, function(error, object) {
			if (!error) {
				res.send(object);
			}
			else {
				res.send(500);
				console.log(error);
			}
		});
	});

	// update
	app.put("/api/" + key + "/:id", function(req, res) {
		collection.update({ _id: ObjectId(req.params.id) }, req.body, function(error) {
			if (!error) {
				collection.findOne({ _id: ObjectId(req.params.id) }, function(error, updatedObject) {
					res.send(updatedObject);
				});
			}
			else {
				res.send(500);
				console.log(error);
			}
		});
	});

	// delete
	app.delete("/api/" + key + "/:id", function(req, res) {
		collection.remove({ _id: ObjectId(req.params.id) }, function(error, object) {
			if (!error) {
				res.send(200);
			}
			else {
				res.send(500);
				console.log(error);
			}
		});
	});
});

// run server
app.listen(process.env.PORT || 3000);
