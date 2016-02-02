
var width_piechart = parseInt(d3.select('.po-piechart').style('width')),
		pie_height = 250, //parseInt(d3.select('.po-piechart').style('width')),
		radius = 100,
		inner = 50,
    group,
    total;

var priority_order = ["Full","Partial: CMT 1","Partial: CMT 2","Partial: Training 1", "Partial: Training 2", "Zero"]
var vals = ["Full","CMT 1","CMT 2","Training 1", "Training 2", "Zero"]
var colorScale = d3.scale.ordinal().domain(vals)
  .range((['#CECE06','#B8B800','#9AB900','#33A626','#337F33','#296629']).reverse())

var vis = d3.select(".po-piechart")
  .append("svg").attr("width", width_piechart).attr("height", pie_height)
  .append("g").attr("transform","translate(" + width_piechart/2 + "," + pie_height/2 + ")")
 
var arc = d3.svg.arc().innerRadius(inner).outerRadius(radius + 10);
var arcOver = d3.svg.arc().innerRadius(inner).outerRadius(radius + 20);
var textTop = vis.append("text")
		    .attr("dy", ".35em")
		    .style("text-anchor", "middle")
		    .attr("class", "textTop")
		    .style("font-size", "15px")
		    .attr("y", -10)
					
var textBottom = vis.append("text")
		    .attr("dy", ".35em")
		    .style("text-anchor", "middle")
		    .attr("class", "textBottom")
		       .style("font-size", "15px")
		    // .text(total.toFixed(2) + "m")
		    .attr("y", 10);
//render_pie(data,circledata,true)



function render_pie(data,engagement,enabled) {
  var enabled = true;
  console.log("engagement: ",engagement)

	pie = d3.layout.pie().value(function(d) { return d.values.length; });
  //.sort(null) will not sort the arc's based on length

	function group_engagement(data) { 
   var groups = d3.nest()
        .key(function(d) { return d.Engagement; })//.sortKeys(function(a,b) { return priority_order.indexOf(a) - priority_order.indexOf(b)})
        .entries(data); 
    groups.forEach(function(d) { 
      d.count = d.values.length
      d.enabled = true})
    group = groups
    console.log(group)
    return groups
  }
    //key: Full
    //values: [{object},{object}]

    //Total is the total count of all sites
	  total = d3.nest().rollup(function(leaves) { return leaves.length; }).entries(data);
    path = vis.selectAll('path').data(pie(group_engagement(data)))
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("class", function(d) { return d["data"].key + " pie"})
      .attr("fill", function(d) { return colorScale(d.data.key)})
      .on("mouseover", function(d) {
        console.log(d3.select(this))
        d3.select(this).select("path").transition().duration(200)
            .attr("d", arcOver)
        textTop.text(d3.select(this).datum().data.key)
            .attr("y", -10);
        textBottom.text(d3.select(this).datum().data.values.length)
            .attr("y", 10);
            })
      .on("mouseout", function(d) { d3.select(this).select("path").transition().duration(100)
          .attr("d", arc);
          textTop.text( "TOTAL" ).attr("y", -10);
          textBottom.text(total);
    })
      .each(function(d) { console.log(d["data"].key); this._current = d;}) 

    textTop.text( "TOTAL" )
     textBottom.text(total)

    path.transition().duration(750)
      .attrTween('d', function(d) { 
        var interpolate = d3.interpolate(this._current,d)
        this._current = interpolate(0)
        return function(t) {
          return arc(interpolate(t))
        }
      })

}

function redraw_pie(engagement,condition) {
  console.log("condition: ", condition)
  var engaged = true;
  console.log(group)
   pie.value(function(d) { 
    return (d.enabled) ? d.count : 0;
      })

   if(condition) { 
    path = path.data(pie(add_group(engagement))); 
    total += group.filter(function(d) { if(d.key == engagement) { return d.count }})[0].count
    }
   else { 
    path = path.data(pie(remove_group(engagement))); 
 total -= group.filter(function(d) { if(d.key == engagement) { return d.count }})[0].count
  }

    path.transition().duration(2000)
      .attrTween('d', function(d) { 
        var interpolate = d3.interpolate(this._current,d)
        this._current = interpolate(0)
        return function(t) {
          return arc(interpolate(t))
        }
      })

   
   textBottom.text(total)
}

function remove_group(engagement) {
  d3.selectAll(".pie").filter(function(d) { return d.data.key == engagement } ).style("opacity",0)
  group.forEach(function(d) {
    if(d.key == engagement ) { d.enabled = false }
  })
  return group
  
}

function add_group(engagement) {
  d3.selectAll(".pie").filter(function(d) { return d.data.key == engagement } ).style("opacity",1)
  group.forEach(function(d) {
    if(d.key == engagement ) { d.enabled = true }
  })
  return group
 
}


    ///ORIGINAL DATA
// 	 arcs = vis.selectAll("slice").data(pie(group_engagement(data)))

//   arcs.enter().append("g")
//     .attr("class", "slice")	 
//     .style("stroke","white")  
//     .on("mouseover", function(d) {
//         d3.select(this).select("path").transition().duration(200)
//             .attr("d", arcOver)
//         textTop.text(d3.select(this).datum().data.key)
//             .attr("y", -10);
//         textBottom.text(d3.select(this).datum().data.values.length)
//             .attr("y", 10);
//             })
//   	.on("mouseout", function(d) { d3.select(this).select("path").transition().duration(100)
//           .attr("d", arc);
//           textTop.text( "TOTAL" ).attr("y", -10);
//           textBottom.text(total);
//     })
    
//     textTop.text( "TOTAL" )
//    	textBottom.text(total)

// arcs.append("path").attr("fill",function(d) { return colorScale(d.data.key) } )                                            // NE                                                     // NEW      
//  	  .attr("d", arc )
//     .each(function(d) { this._current = d;})  
//     .transition().duration(750)
//     .attrTween('d', function(d) { return 
//       var interpolate = d3.interpolate(this._current,a);
//     this._current = interpolate(0);
//     return function(t) { return arc(interpolate(t)) } } ) //arcTween(d))  
	    
//   //THIS DOES NOTHING TO TRANSITION
//    arcs.transition().delay(3000)    		                                 // NEW
//     .duration(3000).call(arcTween)
//       // .attr("d", arc )
     
// 	function arcTween(a) {
//     console.log(a)
// 		var interpolate = d3.interpolate(this._current,a);
// 		this._current = interpolate(0);
// 		return function(t) { return arc(interpolate(t)) }
// 	}

// }
///END ORIGINAL DATA

//ZeroViscosity

// var path = svg.selectAll('path')
//   .data(pie(dataset))
//   .enter()
//   .append('path')
//   .attr('d', arc)
//   .attr('fill', function(d, i) { 
//     return color(d.data.label); 
//   })                                         // UPDATED (removed semicolon)
//   .each(function(d) { this._current = d; }); // NEW

// .attrTween('d', function(d) {
//       var interpolate = d3.interpolate(this._current, d);
//       this._current = interpolate(0);
//       return function(t) {
//         return arc(interpolate(t));
//       };
//     });

