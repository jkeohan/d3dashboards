// var legendKeys = [
//   {name: "Full", order: 1},
//    {name: "Partial Training 1", order: 2},
//     {name: "Partial Training 2", order: 3},
//      {name: "Full", order: 4},
//       {name: "Full", order: 5},
//        {name: "Full", order: 6},
//         {name: "Full", order: 7}

// ]


var width = 800;
var height = 375;

var color = d3.scale.category10()

var projection = d3.geo.mercator()
    //.center([0, 5])
    .rotate([4.4, 0])
    //.parallels([50, 60])
    .scale(125)
    .translate([width / 2, height / 2]);

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select(".map").append("svg")
    .attr("width", width)
    .attr("height", height);

d3.json("/data/world.json", function(error, uk) {
  svg.selectAll(".subunit")
      .data(topojson.feature(uk, uk.objects.subunits).features)
    .enter().append("path")
      .attr("class", function(d) { return "subunit " + d.id; })
      .attr("d", path);

    d3.csv("/data/cm.csv", function(data) {
       svg.selectAll("circle")
           .data(data)
           .enter()
           .append("circle")

           .attr("cx", function(d) {
                   return projection([d.Longitude, d.Latitude])[0];
           })
           .attr("cy", function(d) {
                   return projection([d.Longitude, d.Latitude])[1];
           })
           .attr("r", 5)
           .on("click", update)
           // .attr("r", function(d,i) { 
           //      if (d.Engagement === "Full") { return 10 } 
           //      else { return 5 }
           //    })
            .style("fill", function(d,i) { return color(d.Engagement)})
           // .style("fill", function(d,i) {
           //  if (d.Engagement === "Full") { return "grey"}
           //  else if ( d.Engagement === "Partial: CMT 1") { return "blue" }
           //  else if ( d.Engagement === "Partial: CMT 2") { return "red" }
           //  else if ( d.Engagement === "Partial: Training 1") { return "purple" }
           //  else if ( d.Engagement === "Partial: Training 2") { return "pink" }
           //  else if ( d.Engagement === "Partial: Training 2") { return "orange" }
 
           //  //else { return "yellow"}
           // })
           .style("opacity", 0.75)


      var currentcircle;

      function update(d) {
        if(currentcircle) { 
            currentcircle
            .transition()
            .duration(1000)
            .attr("r", 5) 
          }
        //console.log(d)
        currentcircle = d3.select(this)

        console.log(d3.select(this))
        d3.select(this)
        .style("opacity",1)
        .classed("selected",true)
        .transition()
          .duration(1000)
          .attr("r", 15)

        d3.select(this).append("text")
          .text(function(d,i) {  return d["Site Code"] })
      }

      var legend = svg.selectAll('.legend')
        .data(color.domain().slice().reverse())
        //.data(legendKeys, legendKeys["name"])  //below produces no colors and [object Object] for text???
        //.data(data) //produces colored boxes for all data elements
        .enter().append('g')
        .attr("class", "legend")
        .attr("transform", function(d,i ) {
          {return "translate(0," + i * 20 + ")"}
        })

      //console.log(legend)

      legend.append('rect')
        .attr("x", 110)
        .attr("y", height - 200)
        .attr("width", 10)
        .attr("height", 10)
        //.style("fill", color)
        .style("fill", color )

      legend.append('text')
        .attr("x", 100)
        .attr("y", height - 195)
        .attr("dy", ".35em")
        .text(function(d,i) { return d})
        .style("text-anchor", "end")
        .style("font-size", 10)
      
  });
});


