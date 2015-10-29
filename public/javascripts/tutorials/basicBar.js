
var w = parseInt(d3.select('.basicBarChart1').style('width'));
console.log(w)

var margin = {top: 20, right: 20, bottom: 20, left: 30},
    width_stackedbar = w - margin.left - margin.right,
    height_stackedbar = 250 - margin.top - margin.bottom,
    barWidth = 40;
    barOffset = 5;
var centerx = w/2 - margin.left

//Define y Scale\Axis
var yScale = d3.scale.linear().range([height_stackedbar, 50]);
var yAxis = d3.svg.axis().scale(yScale).orient("left")
//Define x Scale\Axis
var xScale = d3.scale.ordinal().rangeRoundBands([0,width_stackedbar], .1)
var xAxis = d3.svg.axis().scale(xScale).orient("bottom")

var basicBar1 = createSvg(".basicBarChart1","Data Join using .data(data)")
var basicBar2 = createSvg(".basicBarChart2","Data Join using .data(function(d) { return d })")
var basicBar3 = createSvg(".basicBarChart3","Adding yScale")
var basicBar4 = createSvg(".basicBarChart4","Adding yAxis")
var basicBar5 = createSvg(".basicBarChart5","Adding xScale")
var basicBar6 = createSvg(".basicBarChart6","Adding xAxis")

function random() {
	var data = d3.range(~~(Math.random() * 10)).map(function(d,i) { 
		return ~~(Math.random() * 80 +10 ) } );
		data.unshift(10)
		//return data//.sort(function(a,b) { return a-b })
		barChart1(data)
		barChart2(data)
		barChart3(data)
		barChart4(data)
		barChart5(data)
		barChart6(data)
}

function barChart1(data) {
	//DATA JOIN
	var rect1 = basicBar1.selectAll('.rects').data(data)
	//console.log(rect1)
	//UPDATE
	rect1
		.classed("update",true)
		.transition().duration(2500) 
		.style("fill", "green")
		.attr("x", function(d,i) { 	return i * (barWidth + barOffset)})
	//ENTER
	rect1.enter().append('rect')
		.attr("width",barWidth)
		.attr("x",function(d,i) { return i * (barWidth+ barOffset)})
		// .attr("height", function(d) { return height_stackedbar - yScale(d)})
		// .attr("y",function(d) { return yScale(d) } )
		.attr("height", function(d) { return d})
		.attr("y",function(d) { return height_stackedbar - d } )
		.style("fill", "steelblue")
		.attr("class","rects")
		.classed("enter",true)
	//EXIT
	rect1.exit().transition().duration(2000).style("fill","black").attr("height",0).remove()
}

function barChart2(data) {
	//DATA JOIN
	var rect2 = basicBar2.selectAll('.rects').data(data, function(d) { return d});
	//console.log(rect2)
	//UPDATE
	rect2
		.classed("update",true)
		.transition().duration(2500)
		.style("fill", "green").style("stroke","green")
		.attr("x", function(d,i) { 	return i * (barWidth + barOffset)})
	//ENTER
	rect2.enter().append('rect')
	.attr("width",barWidth)
		.attr("x", function(d,i) { return i * (barWidth + barOffset)})
		.attr("height", function(d) { return d})
		.attr("y",function(d) { return height_stackedbar - d } )
		.style("fill", "steelblue")
		.attr("class","rects")
		.classed("enter",true)
	//EXIT
	rect2.exit().transition().duration(2000).style("fill","black").attr("height",0).remove()
}

function barChart3(data) {

	yScale.domain([0,d3.max(data, function(d) { return d })])
	//DATA JOIN
	var rect3 = basicBar3.selectAll('.rects').data(data, function(d) { return d })
	//UPDATE
	rect3
		.classed("update",true)
		.transition().duration(2500) 
		.style("fill", "green")
		.attr("x", function(d,i) { 	return i * (barWidth + barOffset)})
		.attr("height", function(d) { return height_stackedbar - yScale(d)})
		.attr("y",function(d) { return yScale(d) } )
	//ENTER
	rect3.enter().append('rect')
		.attr("width",barWidth)
		.attr("x",function(d,i) { return i * (barWidth+ barOffset)})
		.attr("height", function(d) { return height_stackedbar - yScale(d)})
		.attr("y",function(d) { return yScale(d) } )
		.style("fill", "steelblue")
		.attr("class","rects")
		.classed("enter",true)
  //EXIT
	rect3.exit().transition().duration(2000).style("fill","black").attr("height",0).remove()
}

function barChart4(data) {

	yScale.domain([0,d3.max(data, function(d) { return d })])
	yAxis.scale(yScale)
	//DATA JOIN
	var rect4 = basicBar4.selectAll('.rects').data(data, function(d) { return d})
	basicBar4.append("g").attr("class", "y axis")
	//UPDATE
	rect4
		.classed("update",true)
		.transition().duration(2500) 
		.style("fill", "green")
		.attr("x", function(d,i) { 	return i * (barWidth + barOffset)})
		.attr("height", function(d) { return height_stackedbar - yScale(d)})
		.attr("y",function(d) { return yScale(d) } )
  //ENTER
	rect4.enter().append('rect')
		.attr("width",barWidth)
		.attr("x",function(d,i) { return i * (barWidth+ barOffset)})
		.attr("height", function(d) { return height_stackedbar - yScale(d)})
		.attr("y",function(d) { return yScale(d) } )
		.style("fill", "steelblue")
		.attr("class","rects")
		.classed("enter",true)
	//EXIT
	rect4.exit().transition().duration(2000).style("fill","black").attr("height",0).remove()
	//yAxis transition
	basicBar4.select(".y.Axis").transition().duration(2000).call(yAxis);
}

function barChart5(data) {

	yScale.domain([0,d3.max(data, function(d) { return d })])
	xScale.domain(data.map(function(d) { return d }))
	//DATA JOIN
	var rect5 = basicBar5.selectAll('.rects').data(data, function(d) { return d})
	basicBar5.append("g").attr("class", "y axis")
	//UPDATE
	rect5
		.classed("update",true)
		.transition().duration(2500) 
		.style("fill", "green")
		.attr("x",function(d,i) { return xScale(d) } ) 
		.attr("width", xScale.rangeBand())
		.attr("height", function(d) { return height_stackedbar - yScale(d)})
		.attr("y",function(d) { return yScale(d) } )
	//ENTER
	rect5.enter().append('rect')
		.attr("width", xScale.rangeBand())
		.attr("x",function(d,i) { return xScale(d) } ) 
		.attr("height", function(d) { return height_stackedbar - yScale(d)})
		.attr("y",function(d) { return yScale(d) } )
		.style("fill", "steelblue")
		.attr("class","rects")
		.classed("enter",true)
	//EXIT
	rect5.exit().transition().duration(2000).style("fill","black").attr("height",0).remove()
	basicBar5.select(".y.Axis").transition().duration(2000).call(yAxis);
}

function barChart6(data) {

	var rect6 = basicBar6.selectAll('.rects').data(data, function(d) { return d})
	yScale.domain([0,d3.max(data, function(d) { return d })])
	xScale.domain(data.map(function(d) { return d }))


	basicBar6.append("g").attr("class", "y axis")
	basicBar6.append("g").attr("class", "x axis").attr("transform", "translate(0," + height_stackedbar + ")") 
  
	rect6
		.classed("update",true)
		.transition().duration(2500) 
		.style("fill", "green")
		.attr("x",function(d,i) { return xScale(d) } ) 
		.attr("width", xScale.rangeBand())
		.attr("height", function(d) { return height_stackedbar - yScale(d)})
		.attr("y",function(d) { return yScale(d) } )

	rect6.enter().append('rect')
		.attr("width", xScale.rangeBand())
		.attr("x",function(d,i) { return xScale(d) } ) 
		.attr("height", function(d) { return height_stackedbar - yScale(d)})
		.attr("y",function(d) { return yScale(d) } )
		.style("fill", "steelblue")
		.attr("class","rects")
		.classed("enter",true)

	rect6.exit().transition().duration(2000).style("fill","black").attr("height",0).remove()
	basicBar6.select(".y.Axis").transition().duration(2000).call(yAxis)
	basicBar6.select(".x.Axis").transition().duration(2000).call(xAxis)
}

random()
setInterval(function() { random() } ,3000 )

function createSvg(selection,title) { 
	var selection = d3.select(selection).append("svg")
    .attr("width", width_stackedbar + margin.left + margin.right)
    .attr("height", height_stackedbar + margin.top + margin.bottom)
    .append('g').attr("transform","translate(" + margin.left + "," + margin.top + ")") 

  selection.append('rect')
		.attr("width",width_stackedbar)
		.attr("height", height_stackedbar)
		.attr("y", 0)
		.attr("x",0)
		.style("stroke","black")
		.style("stroke-width",1)
		.style("fill","none")

	selection.append('g').attr("transform","translate("+ centerx + ",30)")
	.append('text').text(title)
	.attr("text-anchor","middle")

	return selection
}

console.log(d3.time.months(new Date('01/01/2015'), new Date('12/01/2015')).map(d3.time.format('%b')));
//1. Data not being imported.
//Error: GET http://localhost:3001/dashboards/data/cm_sampledata.csv 404 (Not Found)
//Resolution:  Updated d3.csv path from ../data/*.csv to ../../data/*.csv
//Believe this might be due to url path having been extened to include /walkthrough

//2. Width of col-lg-12 is flowing outside the container
//Resolution:  set width to 100%

