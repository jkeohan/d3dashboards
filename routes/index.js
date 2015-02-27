var express = require('express');
var router = express.Router();
var appdata = require('../sitecontentdata.json')
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Dashboard' });
});

router.get('/examples', function(req, res) {
  var myexamples = [];
  myexamples = appdata.examples;

  res.render('example', {
  	title: "Examples",
  	examples: myexamples
    // title: myexamples[0].title,
    // friendlyname: myexamples[0].friendlyname,
    // js: myexamples[0].js,
    // pic: myexamples[0].pic
  });
});

router.get('/examples/:exampleid', function(req,res) {
	var examples = [];

	appdata.examples.forEach(function(item){
		if(item.title === req.params.exampleid) {
				examples.push(item)
				console.log(examples[0].js)
		}
	})

	res.render('examples', {
		title: examples[0].title,
		friendlyname:  examples[0].friendlyname,
		js: examples[0].js

	})
})

router.get('/dashboards/:dashboardid', function(req,res) {

	var example = [];
	appdata.dashboards.forEach(function(item) {
		if(item.title === req.params.dashboardid) {
			example.push(item)
			console.log(example[0].friendlyname)
		}
	})
	res.render('programoverview', {
		friendlyname:  example[0].friendlyname,
		worldmap: example[0].worldmap
		// piechart: example[0].piechart,
		// stackedbar: example[0].stackedbarchart
	})
})




module.exports = router;
