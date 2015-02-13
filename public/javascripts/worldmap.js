var width = 800;
var height = 375;
var map = void 0; // Update global

var color = d3.scale.category20c()

var projection = d3.geo.mercator()
    //.center([0, 5])
    .rotate([4.4, 0])
    //.parallels([50, 60])
    .scale(125)
    .translate([width / 2, height / 2]);

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select(".worldmap").append("svg")
    .attr("width", width)
    .attr("height", height)

//This function takes advantage of 2 variables exposed while panning and zooming.
//d3.event.scale - defines how much the user has zoomed in terms of svg scale
//d3.event.translate - defines the position of map in relation to the mouse in terms of svg translate
// var zoomed = function () {
//   map.attr("transform", "translate("+ d3.event.translate + ")scale(" + d3.event.scale + ")");
// };

// var zoom = d3.behaviour.zoom()
//   .scaleExtent([1, 8]) //provies a scale range of the zooming amount
// //   .on("zoom", zoomed)
// //   .size([width, height])

// svg.append("rect")
// .attr("class", "overlay")
// .attr("width", width)
// .attr("height", height)
// .call(zoom);

d3.json("/data/world.json", function(error, world) {
  svg.selectAll(".subunit")
      .data(topojson.feature(world, world.objects.subunits).features)
    .enter().append("path")
      .attr("class", function(d) { return "subunit " + d.id; })
      .attr("d", path)


    d3.csv("/data/cm.csv", function(data) {
       var circle = svg.selectAll("circle")
         .data(data).enter().append("circle")
         .attr("cx", function(d) {
                 return projection([d.Longitude, d.Latitude])[0];
         })
         .attr("cy", function(d) {
                 return projection([d.Longitude, d.Latitude])[1];
         })
         .attr("r", 5)
         .on("click", update)
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

       var tooltip = d3.select("body").append('tooltiptext')
          .style("position", 'absolute')
          .style("padding", '10px 10px')
          .style("background", "lightgrey")
          .style("opacity", 0)
       

      var currentcircle;

      function update(d) {
        if(currentcircle) {
            currentcircle.transition().duration(2000).attr("r", 5) 
          }
        //console.log(d)
        currentcircle = d3.select(this)

        console.log(d3.select(this))
        d3.select(this)
        .style("opacity",1)
        .classed("selected",true)
        .transition()
          .duration(2000)
          .attr("r", 15)

        tooltip.transition().duration(2000)
            .style('opacity', .9)

        
        tooltip.html(function() { 
          return "<strong>" + "Site: " + "</strong>" + "ABC" + "<br>" + "City: NYC" + "</strong>";
        })
         .style('left', (d3.event.pageX + 25) + 'px')
         .style('top',  (d3.event.pageY - 30) + 'px')
         .style({ "font-size": "15px", "line-height": "normal"})
  }//end Update()

      var legend = svg.selectAll('.legend')
        //This sorts the legend...took 2 hours to figure this out. 
        .data(color.domain().slice().sort())
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
        .attr("y", height - 150)
        .attr("width", 10)
        .attr("height", 10)
        //.on("click", alertme)
        //.style("fill", color)
        .style("fill", color )

      legend.append('text')
        .attr("x", 100)
        .attr("y", height - 145)
        .attr("dy", ".35em")
        .text(function(d,i) { return d})
        .style("text-anchor", "end")
        .style("font-size", 10)

      function alertme() { alert("yup")}

      
  });
});




