var express = require('express');
var redirect = require('express-redirect')
var router = express.Router();
var appdata = require('../sitecontentdata.json')
var fs = require('fs');
redirect(express)

/* GET home page. */
router.get('/', function(req, res, next) {
  //res.render('index', { title: 'Dashboard' });


	var example = [];
	example = appdata.dashboards
	console.log(example)
	// appdata.dashboards.forEach(function(item) {
	// 	if(item.title === req.params.dashboardid) {
	// 		example.push(item)
	// 		//console.log(example[0].friendlyname)
	// 		console.log(example[0])
	// 	}
	// })

	res.render('programoverview', {
					friendlyname:  example[0].friendlyname,
					worldmap: example[0].worldmap
					// piechart: example[0].piechart,
					// stackedbar: example[0].stackedbarchart
				})

		// if(example[0].title === "renewableenergy") {
		// 		res.render('renewableenergy', {
		// 		friendlyname:  example[0].friendlyname,
		// 		worldmap: example[0].worldmap
		// 		// piechart: example[0].piechart,
		// 		// stackedbar: example[0].stackedbarchart
		// 		})
		// } else if (example[0].title === "programoverview") {
		// 		res.render('programoverview', {
		// 			friendlyname:  example[0].friendlyname,
		// 			worldmap: example[0].worldmap
		// 			// piechart: example[0].piechart,
		// 			// stackedbar: example[0].stackedbarchart
		// 		})
		// }


  //   var myexamples = [];
  // myexamples = appdata.examples;

  // res.render('example', {
  // 	title: "Examples",
  // 	examples: myexamples
    // title: myexamples[0].title,
    // friendlyname: myexamples[0].friendlyname,
    // js: myexamples[0].js,
    // pic: myexamples[0].pic
 // });
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


router.get('/examples/activekidsgraph', function(req,res) {
	var examples = [];

	appdata.examples.forEach(function(item){
		if(item.title === 'activekidsgraph') {
				examples.push(item)
				console.log(examples[0].js)
		}
	})
		console.log(examples)
	res.render('activekids', {
		title: examples[0].title,
		friendlyname:  examples[0].friendlyname,
		js: examples[0].js

	})
})

router.get('/examples/:exampleid', function(req,res) {
	var examples = [];

	appdata.examples.forEach(function(item){
		if(item.title === req.params.exampleid) {
				examples.push(item)
		
		}
	})
		console.log(examples)
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
			//console.log(example[0].friendlyname)
			console.log(example[0])
		}
	})
		if(example[0].title === "renewableenergy") {
				res.render('renewableenergy', {
				friendlyname:  example[0].friendlyname,
				worldmap: example[0].worldmap
				// piechart: example[0].piechart,
				// stackedbar: example[0].stackedbarchart
				})
		} else if (example[0].title === "programoverview") {
				res.render('programoverview', {
					friendlyname:  example[0].friendlyname,
					worldmap: example[0].worldmap
					// piechart: example[0].piechart,
					// stackedbar: example[0].stackedbarchart
				})
		}
})

router.get('/dashboards/programoverview/walkthrough', function(req,res) {
	var examples = [];
	console.log("inside route")

	appdata.dashboards.forEach(function(item){
		console.log(item)
		if(item.walkthrough === 'po-stackedbarchart_walkthrough') {
				examples.push(item)
				//console.log(examples[0].js)
		}
	})
		console.log(examples)
	res.render('po-stackedbar_walkthrough', {
		// title: examples[0].title,
		// friendlyname:  examples[0].friendlyname,
		// js: examples[0].js

	})
})

router.get('/api/scdata', function(req,res){ 
	console.log(appdata)
		res.json(appdata)
	})



module.exports = router;
