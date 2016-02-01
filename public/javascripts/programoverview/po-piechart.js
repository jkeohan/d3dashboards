
var width_piechart = parseInt(d3.select('.po-piechart').style('width')),
		pie_height = 250, //parseInt(d3.select('.po-piechart').style('width')),
		radius = 100,
		inner = 50

var priority_order = ["Full","Partial: CMT 1","Partial: CMT 2","Partial: Training 1", "Partial: Training 2", "Zero"]
var vals = ["Full","CMT 1","CMT 2","Training 1", "Training 2", "Zero"]
var colorScale = d3.scale.ordinal().domain(vals)
  .range((['#CECE06','#B8B800','#9AB900','#33A626','#337F33','#296629']).reverse())

var vis = d3.select(".po-piechart")
  .append("svg").attr("width", width_piechart)attr("height", pie_height)
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

function render_pie(data,engagement,enabled) {

  if(engagement) { 
    data.forEach(function(d) {
          if(d.Engagement == engagement) {
            if(enabled) { d.enabled = "enabled" } else {  d.enabled = ""}
          }
      })
  }

  data = data.filter(function(d) { 
    return d.enabled 
  })

	var pie = d3.layout.pie().value(function(d) { return d.values.length; });

	function group_engagement(data) { 
   var group = d3.nest()
        .key(function(d) { return d.Engagement; })//.sortKeys(function(a,b) { return priority_order.indexOf(a) - priority_order.indexOf(b)})
        .entries(data);
      return group
    }

	  var total = d3.nest().rollup(function(leaves) { return leaves.length; }).entries(data);

	 arcs = vis.selectAll("slice").data(pie(group_engagement(data)))

  arcs.enter().append("g")
    .attr("class", "slice")	 
    .style("stroke","white")  
    .on("mouseover", function(d) {
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
    
    textTop.text( "TOTAL" )
   	textBottom.text(total)

arcs.append("path").attr("fill",function(d) { return colorScale(d.data.key) } )                                            // NE                                                     // NEW      
 	  .attr("d", arc )
    .each(function(d) { this._current = d;})  
    .attrTween('d', function(d) { return d } ) //arcTween(d))  
	    
  //THIS DOES NOTHING TO TRANSITION
   arcs.transition().delay(3000)    		                                 // NEW
    .duration(3000).call(arcTween)
      // .attr("d", arc )
     
	function arcTween(a) {
    console.log(a)
		var interpolate = d3.interpolate(this._current,a);
		this._current = interpolate(0);
		return function(t) { return arc(interpolate(t)) }
	}

}

//ZeroViscosity

var path = svg.selectAll('path')
  .data(pie(dataset))
  .enter()
  .append('path')
  .attr('d', arc)
  .attr('fill', function(d, i) { 
    return color(d.data.label); 
  })                                         // UPDATED (removed semicolon)
  .each(function(d) { this._current = d; }); // NEW

// .attrTween('d', function(d) {
//       var interpolate = d3.interpolate(this._current, d);
//       this._current = interpolate(0);
//       return function(t) {
//         return arc(interpolate(t));
//       };
//     });

