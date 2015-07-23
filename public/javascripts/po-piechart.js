
			var width_piechart = parseInt(d3.select('.po-piechart').style('width')),
					pie_height = 250, //parseInt(d3.select('.po-piechart').style('width')),
					radius = 100;

			 var inner = 50

			var color = d3.scale.ordinal()
  			.domain(["Full","Partial: CMT 1","Partial: CMT 2","Partial: Training 1", "Partial: Training 2", "Zero"])
  			.range(["green","blue","lightblue","orange","yellow","red"])

	d3.csv("../data/cm_sampledata.csv", function(error, data) {

			var engagement = [];
			var priority_order = ["Full","Partial: CMT 1","Partial: CMT 2","Partial: Training 1", "Partial: Training 2", "Zero"]
			function group_engagement(data) { 
			 var group = d3.nest()
			      .key(function(d) { return d.Engagement; })//.sortKeys(function(a,b) { return priority_order.indexOf(a) - priority_order.indexOf(b)})
			      .entries(data);
			    return group
			  }
			 var test = group_engagement(data)
			  console.log(test)
			 ///////////////////////////////
			 var priority_order = ["Full","Partial: CMT 1","Partial: CMT 2","Partial: Training 1", "Partial: Training 2", "Zero"]
			 // var vals =	function group_engagement(data) { 
			 //    var group = d3.nest()
			 //      .key(function(d) { return d.Engagement; }).sortKeys(function(a,b) { return priority_order.indexOf(a) - priority_order.indexOf(b)})
			 //      .entries(data);
			 //    return group
			 //  }
			 
			 //  console.log(vals(data))

			 //  [Object, Object, Object, Object, Object, Object]
				// 	0: Object
				// 	key: "Zero"
				// 	values: Array[383]
				// 	__proto__: Object

			 //  var total = d3.nest()
				// 	.rollup(function(leaves) { return leaves.length; })
				// 	.entries(data);

		  var total = d3.nest()
							.rollup(function(leaves) { return leaves.length; })
							.entries(data);

					// var total = d3.sum(group_engagement(data), function(d) {
					//     return d3.sum(d3.values(d.values.length));
					// });

			var vis = d3.select(".po-piechart")
		    .append("svg:svg")
		    .data([group_engagement(data)])
		        .attr("width", width_piechart)
		        .attr("height", pie_height)
		    .append("svg:g")
		    	.attr("transform","translate(" + width_piechart/2 + "," + pie_height/2 + ")")
		        // .attr("transform", "translate(" + radius * 1.1 + "," + radius * 1.1 + ")")

			var textTop = vis.append("text")
		    .attr("dy", ".35em")
		    .style("text-anchor", "middle")
		    .attr("class", "textTop")
		    .text( "TOTAL" )
		    .style("font-size", "15px")
		    .attr("y", -10),
					textBottom = vis.append("text")
		    .attr("dy", ".35em")
		    .style("text-anchor", "middle")
		    .attr("class", "textBottom")
		    .text(total)
		       .style("font-size", "15px")
		    // .text(total.toFixed(2) + "m")
		    .attr("y", 10);

			var arc = d3.svg.arc()
		    .innerRadius(inner )
		    .outerRadius(radius + 10);

			var arcOver = d3.svg.arc()
		    .innerRadius(inner + 5)
		    .outerRadius(radius + 20);
		 
			var pie = d3.layout.pie()
		    .value(function(d) { return d.values.length; });
		 
			var arcs = vis.selectAll("g.slice")
		    .data(pie)
		    .enter()
		        .append("svg:g")
		            .attr("class", "slice")
		            .on("mouseover", function(d) {
		                d3.select(this).select("path").transition()
		                    .duration(200)
		                    .attr("d", arcOver)
		                	
		                textTop.text(

		                	d3.select(this).datum().data.key)
		                    .attr("y", -10);
		                textBottom.text(d3.select(this).datum().data.values.length)
		                    .attr("y", 10);
		            })
		            .on("mouseout", function(d) {
		                d3.select(this).select("path").transition()
		                    .duration(100)
		                    .attr("d", arc);
		                
		                textTop.text( "TOTAL" )
		                    .attr("y", -10);
		                textBottom.text(total);
		            });

				arcs.append("svg:path")
		    //.attr("fill", function(d, i) { return color(i); } )
		    .attr("d", arc)
		    	.attr("class", function(d,i) { 
					  		   if (d.data.key === "Full") { return "full"}
		              else if ( d.data.key === "Partial: CMT 1") { return "partialcmt1" }
		              else if ( d.data.key === "Partial: CMT 2") { return "partialcmt2" }
		              else if ( d.data.key === "Partial: Training 1") { return "partialt1" }
		              else if ( d.data.key === "Partial: Training 2") { return "partialt2" }
		              else if ( d.data.key === "Zero") { return "zero" }
		            }) 








						// var engagement = [];

						//  // function group_engagement(data) { 
					 //  //   var group = d3.nest()
					 //  //     .key(function(d) { return d.Engagement; })
					 //  //     .entries(data);
					 //  //     //console.log(data)
					 //  //   return group
					 //  // }

					 //  // console.log(group_engagement(data).map(function(item) {
					 //  // 	//console.log( item.key +":" + item.values.length)
					 //  // }))

					 //  //create arc
					 //  var pie = d3.layout.pie()
					 //  	.value(function(d) {
					 //  		return d.values.length
					 //  	})

					 //  var key = function(d) { return d.data.label }

					 //  //create arc function..defines angles of pie shapes
					 //  var arc = d3.svg.arc()
					 //  //inner and outter range
					 //  	.outerRadius(radius)

					 //  var piechart = d3.select(".piechart")
					 //  	.append('svg')
					 //  	.attr("width", width_piechart)
					 //  	.attr("height", pie_height)
						// 		.append("g")
					 //  		.attr("transform","translate("
					 //  			+(width_piechart/2) + "," + (pie_height/2)+ ")")
					 //  		//path doesn't yet exist and will be created with enter()
					 //  		.selectAll('path').data(pie(group_engagement(data)))
					 //  		.enter().append('path')
					 //  		.attr("class", function(d,i) { 
					 //  		   if (d.data.key === "Full") { return "full"}
		    //           else if ( d.data.key === "Partial: CMT 1") { return "partialcmt1" }
		    //           else if ( d.data.key === "Partial: CMT 2") { return "partialcmt2" }
		    //           else if ( d.data.key === "Partial: Training 1") { return "partialt1" }
		    //           else if ( d.data.key === "Partial: Training 2") { return "partialt2" }
		    //           else if ( d.data.key === "Zero") { return "zero" }
		    //         }) 
					  		// .attr("fill", function(d,i) { console.log(d.data.key);
					  		// 	return color(i);
					  		// })
					  	// 	.attr('d', arc)

					  	// var arcs = piechart.selectAll('g.slice')
					  	// 		.data(pie(group_engagement(data),key))
					  	// 		.enter().append("svg:g").attr("class","slice")

					  	// arcs.append("svg:text").attr("transform",function(d){
					  	// 	d.innerRadius = 0;
					  	// 	d.outerRadius = radius;
					  	// 	return "translate(" + arc.centroid(d) + ")"})
								// .attr("text-anchor", "middle")
								// .text(function(d,i) { return d.data.label})


					  	// var text = piechart.select(".labels").selectAll("text")
					  	// 	.data(pie(group_engagement(data),key))

					  	// text.enter().append("text").attr("dy",".35em")
					  	// 	.style
					  	// 	.text(function(d,i) { console.log(d); return d.data.label } )
})
