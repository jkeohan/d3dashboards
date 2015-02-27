
			var width_piechart = 390,
					pie_height = 300,
					radius = 100;

			var color = d3.scale.ordinal()
  .domain(["Full","Partial: CMT 1","Partial: CMT 2","Partial: Training 1", "Partial: Training 2", "Zero"])
  .range(["green","blue","lightblue","orange","yellow","red"])

			d3.csv("../data/cm.csv", function(error, data) {

				var engagement = [];

				 function group_engagement(data) { 
			    var group = d3.nest()
			      .key(function(d) { return d.Engagement; })
			      .entries(data);
			      //console.log(data)
			    return group
			  }

			  // console.log(group_engagement(data).map(function(item) {
			  // 	//console.log( item.key +":" + item.values.length)
			  // }))

			  //create arc
			  var pie = d3.layout.pie()
			  	.value(function(d) {
			  		return d.values.length
			  	})

			  var key = function(d) { return d.data.label }

			  //create arc function..defines angles of pie shapes
			  var arc = d3.svg.arc()
			  //inner and outter range
			  	.outerRadius(radius)

			  var piechart = d3.select(".piechart")
			  	.append('svg')
			  	.attr("width", width_piechart)
			  	.attr("height", pie_height)
						.append("g")
			  		.attr("transform","translate("
			  			+(width_piechart/2) + "," + (pie_height/2)+ ")")
			  		//path doesn't yet exist and will be created with enter()
			  		.selectAll('path').data(pie(group_engagement(data)))
			  		.enter().append('path')
			  		.attr("class", function(d,i) { 
			  		   if (d.data.key === "Full") { return "full"}
              else if ( d.data.key === "Partial: CMT 1") { return "partialcmt1" }
              else if ( d.data.key === "Partial: CMT 2") { return "partialcmt2" }
              else if ( d.data.key === "Partial: Training 1") { return "partialt1" }
              else if ( d.data.key === "Partial: Training 2") { return "partialt2" }
              else if ( d.data.key === "Zero") { return "zero" }
            }) 
			  		// .attr("fill", function(d,i) { console.log(d.data.key);
			  		// 	return color(i);
			  		// })
			  		.attr('d', arc)

			  	var arcs = piechart.selectAll('g.slice')
			  			.data(pie(group_engagement(data),key))
			  			.enter().append("svg:g").attr("class","slice")

			  	arcs.append("svg:text").attr("transform",function(d){
			  		d.innerRadius = 0;
			  		d.outerRadius = radius;
			  		return "translate(" + arc.centroid(d) + ")"})
						.attr("text-anchor", "middle")
						.text(function(d,i) { return d.data.label})


			  	// var text = piechart.select(".labels").selectAll("text")
			  	// 	.data(pie(group_engagement(data),key))

			  	// text.enter().append("text").attr("dy",".35em")
			  	// 	.style
			  	// 	.text(function(d,i) { console.log(d); return d.data.label } )
			})
