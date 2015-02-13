var express = require('express');
var router = express.Router();
var appdata = require('../sitecontentdata.json')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Dashboard' });
});

router.get('/examples', function(req, res) {
  var myexamples = [];
  myexamples = appdata.examples;
  res.render('examples', {
    title: 'Examples',
    friendlyname: "Examples",
    js: "example.js"
  });
});

// router.get('/examples/:exampleId', function(req, res) {
//   var myexamples = [];
//   myexamples = appdata.examples;
//   res.render('examples', {
//     title: 'Examples',
//   });
// });

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



module.exports = router;
