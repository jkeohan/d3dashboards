

			var margin = {top:50,right:80,bottom:50,left:40};
			var width = 650 - margin.left - margin.right;
			var height = 600 - margin.top - margin.bottom;
			var lwidth = 400
			var lheight = 400
			var dataset = [];
			var path;

		  var color = d3.scale.linear().range(['#B8B800','#296629'])
		  var dateFormat = d3.time.format("%Y");

 			var tempColor, playInterval, worldTotal;
 			var activeCircle,innerCircle,tooltipcolor,oldColor;
 			var icelandData;
 			var years;
 			//var years = [2002,2003,2004,2005,2006,2007,2008,2009,2010,2011,2012]
 			var currentYear = 2002;	
			var chartType = ["BAR","SCATTER PLOT"]

 			//var source = d3.select("body")
 			var barGraphTitle = d3.select(".barGraph-title")
 			var playAll = d3.select(".playAll")
 			var buttonYears = d3.select(".buttonContainer")
 			var chartOptions = d3.select(".switch")
			var svg = d3.select(".barGraph").append("svg")
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)		
				.append("g").attr("transform","translate(90,30)")

			//Scales
			var xScale = d3.scale.linear()
			var yScale = d3.scale.linear()
			var xScaleLine = d3.time.scale()
			var yScaleLine = d3.scale.linear()
			//Axis
			var xAxis = d3.svg.axis()
			var yAxis = d3.svg.axis()
			var xAxisLine = d3.svg.axis()
			var yAxisLine = d3.svg.axis()

			// barGraphTitle.insert("h2").text("Renewable Energy (%) of Total Energy Generation")
			barGraphTitle.insert("h2").attr("class", "worldTotal").text("World Total: " )
			playAll.text("▶ PLAY ALL YEARS");

			var chartOptions = d3.select(".switch")
			chartOptions.selectAll("options").data(chartType).enter()
			.append("label").text(function(d) { return d})
			.append("input").attr("type", "radio").attr("name","chartType").attr("value", function(d) { return d })
			.attr("checked", function(d) {  if(d === "BAR") return  true } )
			.attr("class","radio")

			//CSV.......
      d3.csv("/data/data.csv", function(data) {

      	dataWorld = data
      	years = d3.keys(data[0]).filter( function(key) { return key != "Location" } ) 

      	for(i = 0; i < data.length; i++) {
      		dataset[i] = { location: data[i].Location, values:[] }
      		for (j = 0; j < years.length; j++) {
      			if(data[i][years[j]]) {
      	
      				dataset[i].values.push({
      					year: years[j],
      					amount: data[i][years[j]]
      				})
      			}
      		}
      	}



      	//Update scales
      	color.domain([9,data.length])
      	//xScale.range([0,width ]).domain([0,d3.max(data)])//, function(d) { return +d[currentYear] + 5} ) ] )

				var filteredData = data.filter(function(d) { return !(d["Location"] === "World") } )//  && !(d["Location"] === "Iceland") })

      	xScale.range([0,width ]).domain([0,d3.max(filteredData, function(d) { return +d[currentYear]} ) ] )
      	yScale.range([height,0]).domain([0,d3.max(filteredData, function(d) { return +d[2012]})])
      	xScaleLine.range([30,lwidth-20 ]).domain([d3.min(years,function(d) { return dateFormat.parse(d)}), d3.max(years, function(d) {
      		return dateFormat.parse(d)})
      		])
      	yScaleLine.range([0, lheight-20]).domain([d3.max(dataset, function(d) {
      		return d3.max(d.values, function(d) {
      			return +d.amount
      		})
      	}), 0 ])

      	xAxis.scale(xScale).orient("bottom").ticks(12).tickSize(-(height)).tickFormat(function(d) { return d + "%" } )
      	yAxis.scale(yScale).orient("left").ticks(12).tickSize(-(width)).tickFormat(function(d) { return d + "%" } )
      	xAxisLine.scale(xScaleLine).orient("bottom").ticks(15).tickFormat(function(d) { return dateFormat(d) })
      	yAxisLine.scale(yScaleLine).orient("left").tickFormat(function(d) { return d + "%" } )

      	var line = d3.svg.line()
      		.x(function(d) { return xScaleLine(dateFormat.parse(d.year))})
      		.y(function(d) { return yScaleLine(+d.amount)})

      	var svgLine = d3.select(".line-graph").append("svg")
      		.attr("width", lwidth).attr("height", lheight )



      	var groups = svgLine.selectAll("g").data(dataset).enter().append("g")
      	groups.selectAll("path").data(function(d) { return [d]}).enter()
      		.append("path").attr("class", "line")
      		.attr("d", function(d) { return line(d.values )})
      		.attr("fill", "none")

      	svgLine.append("g").attr("class", "x axis linegraph")
      		.attr("transform", "translate(0,380)")
      		.call(xAxisLine)

      	svgLine.append("g").attr("class", "y axis")
      		.attr("transform", "translate(35,0)")
      		.call(yAxisLine)


      	svg.append('g').attr("class", "x axis").call(xAxis).attr("transform", "translate(0," + height + ")")
      		.append("text").style("text-anchor", "end")
      		.attr({  class: "xlabel", x: width - 10, y: -10})
      	svg.append('g').attr("class", "y axis").call(yAxis)
      		.append("text").style("text-anchor","end")
      		.attr({ class: "ylabel", y: 12, x: -10, dy: ".71em" })
      		.attr("transform", "rotate(-90)")	
      		.text("2012 DATA").style("font-size",20)

      	var buttons = buttonYears.selectAll("div").data(years).enter().append("div")
				.text(function(d) { return d})
				//.attr("class", function(d) { if( d === currentYear ) return "button selected"; else return "button" } ) 
				.on("click", function(d) { 
					d3.selectAll(".tooltip").transition().duration(1000).style("opacity",0)
					if(activeCircle) { activeCircle.attr("r", 4).style("fill",oldColor) }
					if(innerCircle) { d3.select(".innerCircle").remove()}
					year = d;
					clearInterval(playInterval); update(d) 
					})

         playAll.on("click", function() {
         		var i;
         	 if(activeCircle) { activeCircle.transition().duration(1000).attr("r",4) }
         	 if(innerCircle) { d3.select(".innerCircle").remove()}
         	 if( currentYear === 2002 ) { i = 2; 	update(years[1]) 
         	 	} else { i = 1; update(years[0]) }

           playInterval = setInterval(function() {
           		if(activeCircle) { activeCircle.attr("r", 4).style("fill",oldColor) }
							if(innerCircle) { d3.select(".innerCircle").remove()}
           		d3.selectAll(".tooltip").transition().duration(1000).style("opacity",0)
            	update(years[i]);
            i++;
            if(i > years.length - 1) { clearInterval(playInterval);}
           }, 3000);
          });


        update(currentYear)

				//UPDATE FUNCITON......
				function update(year) {

					//currentYear = year

					total = dataWorld.filter(function(d) { 
        		var total = d["Location"] === "World";
        		return total}) 
      
        	worldTotal = total[0][year]

        	barGraphTitle.select(".worldTotal").html("World Total: "  + worldTotal + "%")
       
      		d3.select(".selected").classed("selected", false)
      		buttons.attr("class", function(d) { if (d === year.toString() ) { return "button selected" } else {  
      			return "button" }})

      		if(!icelandData) { icelandData = data.filter(function(d) { return d["Location"] === "Iceland"}) }

					d3.select(".title.secondary").html( year )
					d3.select(".odd.secondary").html( icelandData[0][year] + '%')

      		data = data.filter(function(d) { return !(d["Location"] === "World") }) // && !(d["Location"] === "Iceland") })

					var adata = data.sort(function(a, b) {return d3.ascending(+a[year], +b[year]);});

					xScale.domain([0,d3.max(data, function(d) { return +d[year] + 5} ) ] )
					yScale.domain([0,d3.max(data, function(d) { return +d[2012] + 5} ) ] )

      		svg.select(".xlabel").text(year + " DATA").style("font-size",20)

					var tooltip = d3.select("body").data(data).append("div") 
						.attr("class","tooltip")

					var circle = svg.selectAll("circle").data(data)
		
					 //Update
	      	circle.transition().duration(1000)//.ease("bounce")
	      		.attr("cx", function(d,i) { return xScale(+d[year]) })
	      		.attr("cy", function(d,i) { return yScale(+d[2012])})
	      		.attr("fill", function(d,i) { return color(i) })

					//ENTER
					circle.enter().append("circle")
						.attr("cy", function(d) { return yScale(+d[2012])}) 
						.attr("cx", function(d) { return xScale(+d[year])})
						.attr("r", 4)
						.style("fill", "white")
						.on("mouseover", mouseover)
						.on("mouseout", mouseout)
						.transition().duration(250).delay(function(d,i) { return i * 25 } )
						.style("fill", function(d,i) { return color(i)})
				
				  	var temp=[];
				  function mouseout(d) {
				  	path.transition().duration(1000).style("stroke", "black").style("stroke-width", 1)
          	tooltip.transition().duration(1000).style('opacity',0)
				  				if(activeCircle) { 	
				  				activeCircle.transition().duration(500).attr("r", 4).style("fill",tooltipcolor)
				  							.attr("stroke-width",0)
				  						}
				  				if(innerCircle) { d3.select(".innerCircle").transition().attr("r",0) }
				  				activeCircle = false;
        	}//mouseout


				  function mouseover (d) {

				  	var location = d.Location
		  			temp.push(d);
		  			tooltipcolor = this.style.fill 
						var oldColor = tooltipcolor; 

				  	path = d3.selectAll("path").filter(function(d) { return d["location"] === location } )
				  	console.log(path)
				  	path.style("stroke", tooltipcolor).style("stroke-width", 5)

				  		
				  	
				  				if(activeCircle) { 	activeCircle.transition().duration(500).attr("r", 4).style("fill",oldColor)  }
				  				activeCircle = d3.select(this)
				  	
				  				d3.select(this).transition().duration(1000)//.ease("bounce")
					  				.attr("cy", this.cy.animVal.value)
					  				.attr("cx", this.cx.animVal.value)
					  				.attr("r", 15)
					  				.attr("stroke-width",10)
					  				.attr("stroke","rgba(239, 239, 239, .8)")

				  				tooltipcolor = this.style.fill
				  				tooltip.style("opacity",0)
				  				tooltip.style("border" , "3px solid " + tooltipcolor ).transition().duration(1000).style("opacity",1)
          				tooltip.html(
									'<span class="countryName">' + d.Location + '</span><br/>' + 
									'2012: <span class="value">' + d[2012] + '%</span><br/>'  + 
									currentYear + ": " + '<span class="value">' + d[currentYear] + '%</span>')
								.style("left", (d3.event.pageX + 20) + "px")
								.style("top", (d3.event.pageY -35 ) + "px")
						
						if (temp.length>0) { //construct the table
						 if (temp.length>2) { //if the table has already 2 countries, delete the first one
									temp.shift();
							}
							d3.selectAll("table").remove();
							var tab="<table class=\"tab\"><th></th>";
							for (i=0;i<temp.length;i++) {
								tab=tab+"<th>"+temp[i].Location+"</th>";
								}
							for (i=0;i<years.length;i++) {
								tab=tab+"<tr><td>"+years[i]+"</td>";
								for (k=0;k<temp.length;k++) {
								tab=tab+"<td>"+temp[k][years[i]]+"</td>";
								}
								tab=tab+"</tr>";
							}
							tab=tab+"</table>";
							d3.select("#compare").html(tab);
						}
          }
				}
			});
	
