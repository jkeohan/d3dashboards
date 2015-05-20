	<!DOCTYPE html>

  <head>

  <style>

  </style>

  </head>

  <body>

    var t = -1;
    //var v = 0;
	var n = 23; 
    var data = d3.range(23).map(next); 
    
    function getRand(){return Math.floor(Math.random()*20)}
 
    function next () {
        return {
            time: ++t,
            value: d3.range(3).map(getRand)
        };
    }
	
    setInterval(function () {
        data.shift();
        data.push(next());
        redraw();
    }, 1000);	
	
	
    var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 560 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

	var x = d3.scale.linear().domain([0, 23]).range([0, width]);
	var y = d3.scale.linear().domain([0, 80]).range([height, 0]);
	
	var barWidth = (width / 23) - 5;
    
    var svg = d3.select("body").append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom);
			
	var g = svg.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	
	var graph = g.append("svg")
				.attr("width", width)
				.attr("height", height + margin.top + margin.bottom);	
	
	var xAxis = d3.svg.axis().scale(x).orient("bottom");
	var axis = graph.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis);

	var yAxis = d3.svg.axis().scale(y).orient("left");
    g.append("g")
        .attr("class", "y axis")
        .call(yAxis);		

	/*graph.selectAll("rect")
        .data(data)
        .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d.time); })
            .attr("width", barWidth) 
            .attr("y", function(d) { return y(d.value); })
            .attr("height", function(d) { return (height - y(d.value)); });	
	*/

  var color = d3.scale.ordinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"])
    .domain([0, data[0].lenght])
  


    function redraw()
    {
      customData = data.map(function(d){
          y0=0
          return {value:d.value.map(function(d){return {y0:y0, y1: y0+=d}}), time:d.time}
  })
      //console.log(customData)
        var state = graph.selectAll(".g")
        .data(customData, function(d) { return d.time; });
		
		// time update
		x.domain([(t - n+2), t+1]);
	
		// transition parent
		//var transition = graph.transition().duration(1000);
		
        // initialise entering bars	and then do the transition
          var stateEnter = state.enter().append("g")
      .attr("class", "g")
      .attr("transform", function(d) { return "translate(" + x(d.time+1) + ",0)"; });

  stateEnter.selectAll("rect")
      .data(function(d) { return d.value; })
    .enter().append("rect")
      .attr("width", barWidth)
      .attr("y", function(d) {return y(d.y1); })
      .attr("height", function(d) { return y(d.y0) - y(d.y1); })
      .attr("class", "bar")
      .style("fill", function(d,i) { return color(i); });
      
		 // transition entering and updating bars
        console.log(state)
	  state.transition().duration(1000).attr("transform", function(d) {console.log(d); return "translate(" + x(d.time) + ",0)"; });
		graph.transition().duration(1000).selectAll("g.axis").call(xAxis);
		
		// remove shifted bar that is not displayed anymore
		//transition.selectAll("graph.rect").attr("x", function(d) { return x(d.time - 1 ); })
		//			.remove();
        state.exit().attr("transform", function(d) {console.log(d); return "translate(" + x(d.time) + ",0)"; }).remove()

    }

    </body>

    <html>
