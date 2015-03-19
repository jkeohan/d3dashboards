var activities = [
    {"minutes" : 10,
    "miles": 1,
    "date" : "Jan-02-2014",
    "type" : "Run",
    "photo" : "url",
    "description" : ""
   	},
    {"minutes" : 20,
    "miles" : 1.5,
    "date" : "Jan-05-2014",
    "type" : "Run"
    },
    {"minutes" : 60,
    "miles": 1,
  	"date" : "Jan-10-2014",
  	 "type" : "Run"
    },
    {"minutes" : 60,
    "miles": 1.7,
  	"date" : "Jan-29-2014",
  	 "type" : "Run"
    },
    {"minutes" : 60,
    "miles": .5,
  	"date" : "Feb-10-2014",
  	 "type" : "Run"
    },
      {"minutes" : 10,
    "miles": .4,
    "date" : "Jan-03-2014",
    "type" : "Walk"
   	},
    {"minutes" : 20,
    "miles" : .7,
    "date" : "Jan-06-2014",
    "type" : "Walk"
    },
    {"minutes" : 60,
    "miles": .9,
  	"date" : "Jan-11-2014",
  	 "type" : "Walk"
    },
    {"minutes" : 60,
    "miles": .5,
  	"date" : "Jan-20-2014",
  	 "type" : "Walk"
    },
    {"minutes" : 60,
    "miles": 1,
  	"date" : "Feb-11-2014",
  	 "type" : "Walk"
    }
]

//constants
var margin = { top:50, right:30, bottom:70, left:50 }
var width = 580 - margin.left - margin.right
var height = 450 - margin.top - margin.bottom
var parseDate = d3.time.format("%b-%d-%Y").parse
var color = d3.scale.category10();
//var parseDate = d3.time.format("%x").parse

//scales
var xScale = d3.time.scale()
var yScale = d3.scale.linear()


//axes
var xAxis = d3.svg.axis()
	.scale(xScale)
	.orient("bottom")
	.ticks(5)

var yAxis = d3.svg.axis()
	.scale(yScale)
	.orient("left")



//static d3 selectors...create the graph structure
var graph = d3.select(".activekidsgraph")
	.append("svg")
		.attr("height", height + margin.top + margin.bottom)
		.attr("width", width + margin.left + margin.right)
	.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")")


var tooltip = d3.select("body").append('tooltiptext')
  .style("position", 'absolute')
  .style("padding", '10px 10px')
  .style("color", "black")
  //.style("background", "white")
  //.style("opacity", 0)


//valueLine
var valueLine = d3.svg.line()
		.x(function(d) { return xScale(d.date)})
		.y(function(d) { return yScale(d.miles)})
		//.interpolate("basis")

//main data driven function
data = activities
data.forEach(function(d) {
		d.date = parseDate(d.date);
		d.miles = +d.miles;
	})

	//update scales
	xScale
		.range([0,width])
		.domain(d3.extent(data, function(d) { return d.date}))

	yScale
		.range([height,0])
		.domain([0,d3.max(data, function(d) { return d.miles})])

var dataNest = d3.nest()
		.key(function(d) { return d.type})
		.entries(data)

var legendSpace = (width/dataNest.length)/2

//.log(legendSpace)
	//Loop through each type / key
dataNest.forEach(function(d,i) {
		//console.log(d.values)
		graph.append("path")
			.attr("class", "line")
			.style("stroke", function() { 
				return d.color = color(d.key)})
			.attr("d", valueLine(d.values))

		graph.append("circle")
			.attr("cx", (legendSpace/2) + i * legendSpace + 190)//(width - margin.right) + i * -100)
			.attr("cy", -20)//height + margin.bottom/2 + 30)
			.attr("r", 5)
			.attr("class", "legend-circle")
			.style("fill", function() { return d.color = color(d.key)})

		graph.append("text")
			.attr("x",(legendSpace/2) + i * legendSpace + 200)// (width - margin.right) + i * -100)
			.attr("y", -15)//height + margin.bottom/2 + 30)
			.attr("class", "legend")
			.style("fill", function() { return d.color = color(d.key)})
			.style("font-size", 20)
			.text(d.key)
	})

var points = graph.selectAll("circle").data(data)

points.enter().append("circle")
			.attr("cx", function(d) { return xScale(d.date)})
			.attr("cy", function(d) { return yScale(d.miles)})
			.attr("r", 5)
			.attr("class", "points")
			.on("mouseover", mouseover)
			.on("mouseout", mouseout)
			.style("fill", function(d) { 
				if( d.type === "Run") { return "rgb(31, 119, 180)"; }
				else {  return "rgb(255, 127, 14)";}
			})

	//Nest the entries by type

	//Draw chart
	graph.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + height + ")")
		.call(xAxis)
	graph.append("g")
		.attr("class", "y axis")
		.call(yAxis)

	//DATA JOIN

	//ENTER
	// var points = graph.selectAll("circle").data(data)

	// points.enter().append("circle")
	// 		.attr("cx", function(d) {return xScale(d.date)})
	// 		.attr("cy", function(d) { return yScale(d.miles)})
	// 		.attr("r", 5)
	// 		.attr("class", "points")
	// 		.style("fill", function() { return d.color = color(d.key)})

	//EXIT

	//Tooltip
	  function mouseover(d) {
	  			//console.log(d.type)
	  			var bordercolor = function() { 
	  					if(d.type === "Run") { return "rgba(31, 119, 180,0.5)" }
	  					else { return "rgba(255, 127, 14,0.5)"}
	  			}
	  		console.log(bordercolor)

           var string = "";
                    string = string + "Date: "
                    string = string + d["date"].toDateString()
                    string = string + "<br>"
                 		string = string + "Distance(miles): "
                    string = string + d["miles"]
                    string = string + "<br>"
                    string = string + "Time(min): "
                    string = string + d["minutes"]
                    string = string + "<br>"

            tooltip
            	.style("border", "solid 10px " + bordercolor())
            	.style("background-color", bordercolor())
           
            tooltip.transition().duration(1000)
              .style('opacity', .9)


            tooltip.html(function() { 
              return string
            //return "<strong>" + "Site: " + "</strong>" + d["Site Code"] + "<br>" + "City: " + d["City"] + "</strong>";
            })
           .style('left', (d3.event.pageX + 25) + 'px')
           .style('top',  (d3.event.pageY - 30) + 'px')
           .style({ "font-size": "15px", "line-height": "normal"})
        }//mouseover

        function mouseout(d) {
          tooltip.transition().duration(1000)
            .style('opacity',0)
        }//mouseout

	
