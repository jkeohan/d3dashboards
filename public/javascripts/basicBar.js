
var w = parseInt(d3.select('.basicBarChart').style('width'));

var margin = {top: 20, right: 20, bottom: 20, left: 20},
    width_stackedbar = w - margin.left - margin.right,
    height_stackedbar = 350 - margin.top - margin.bottom,
    barWidth = 50;
    barOffset = 5;
//

d3.csv("../../data/cm_sampledata.csv", function(error, data) {
  data = data.filter(function(d) { return !(d.Region == "TBD" || d.Region == "Sample Region")})
//barchart_data = data
	console.log(data)
});//csv

var data = [10,20,30]

var basicBar = d3.select(".basicBarChart").append("svg")
    .attr("width", width_stackedbar + margin.left + margin.right)
    .attr("height", height_stackedbar + margin.top + margin.bottom)
    .append('g')

var border = basicBar.append('rect')
	.attr("width",width_stackedbar)
	.attr("height", height_stackedbar)
	.attr("y", 0)
	.attr("x",0)
	.style("stroke","black")
	.style("stroke-width",1)
	.style("fill","none")

var rect = basicBar.selectAll('.bars').data(data)

rect.enter().append('rect')
	.attr("width",50)
	.attr("height", function(d) { return d})
	.attr("x",function(d,i) { return i * (barWidth+ barOffset)})
	.attr("y",function(d) { return height_stackedbar - d } )
	.style("fill", "steelblue")



//1. Data not being imported.
//Error: GET http://localhost:3001/dashboards/data/cm_sampledata.csv 404 (Not Found)
//Resolution:  Updated path from ../data/*.csv to ../../data/*.csv
//Believe this might be due to url path having been extened to include /walkthrough

//2. Width of col-lg-12 is flowing outside the container
//Resolution:  set width to 100%

