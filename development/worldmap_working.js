var width = 800;
var height = 375;
var map = void 0; // Update global

//var color = d3.scale.category20c()
//Colors defined here are for legend only.  Circle color is being configured in CSS
var color = d3.scale.ordinal()
  .domain(["Full","Partial: CMT 1","Partial: CMT 2","Partial: Training 1", "Partial: Training 2", "Zero"])
  .range(["green","blue","steelblue","orange","yellow","red"])

var projection = d3.geo.mercator()
    .center([0, 5])
    .rotate([4.4, 0])
    //.parallels([50, 60])
    .scale(125)
    .translate([width / 2, height / 2]);

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select(".worldmap").append("svg")
    .attr("width", width)
    .attr("height", height)

d3.json("/data/world.json", function(error, world) {
  svg.selectAll(".subunit")
      .data(topojson.feature(world, world.objects.subunits).features)
    .enter().append("path")
      .attr("class", function(d) { return "subunit " + d.id; })
      .attr("d", path)
        .style({
          stroke:"white",
          "stroke-width": 0.75,
          fill: "lightgrey"
          })

    d3.csv("/data/cm.csv", function(data) {

      //currentData will be used for filtering based on legend options. 
      //var currentData = data//.map(function(d) { return d.Engagement == "*"})
       var currentData = data//.filter(function(d) { return d.Engagement  === "Full"})

      var legendVals = d3.set(data.map(function(d) { return d.Engagement } )).values()
      function EngagementVals() {
        var engaged = d3.set(data.map(function(d) { return d.Engagement } )).values()
        return engaged
      }

      var legend = svg.selectAll('.legend')
        .data(EngagementVals().slice().sort())
        .enter().append('g')
        .attr("class", "legend")
        .attr("transform", function(d,i ) {
          {return "translate(0," + i * 20 + ")"}
        })

      legend.append('rect')
        .attr("x", 110)
        .attr("y", height - 150)
        .attr("width", 10)
        .attr("height", 10)
        //.style("fill", color)
        .style("fill", color )

      legend.append('text')
        .attr("x", 100)
        .attr("y", height - 145)
        .attr("dy", ".35em")
        .text(function(d,i) { return d})
        .style("text-anchor", "end")
        .style("font-size", 10)
        .on("click", function(d,i) { 
            var legendChoice = d
            var newData = (currentData.filter(function(d) { return d.Engagement === legendChoice } ))
            populateMap(newData)
      
           })

       
      populateMap(currentData)

      function populateMap(circledata) {
        console.log(circledata)
         var circle = svg.selectAll("circle")
           .data(circledata)

          circle.attr("class", function(d,i) { 
              if (d.Engagement === "Full") { return "full"}
              else if ( d.Engagement === "Partial: CMT 1") { return "partialcmt1" }
              else if ( d.Engagement === "Partial: CMT 2") { return "partialcmt2" }
              else if ( d.Engagement === "Partial: Training 1") { return "partialt1" }
              else if ( d.Engagement === "Partial: Training 2") { return "partialt2" }
              else if ( d.Engagement === "Zero") { return "zero" }
            }) 
            .on("mouseover", mouseover)
            .on("mouseout", mouseout)

          circle.enter().append("circle")
           .attr("class", function(d,i) { 
              if (d.Engagement === "Full") { return "full"}
              else if ( d.Engagement === "Partial: CMT 1") { return "partialcmt1" }
              else if ( d.Engagement === "Partial: CMT 2") { return "partialcmt2" }
              else if ( d.Engagement === "Partial: Training 1") { return "partialt1" }
              else if ( d.Engagement === "Partial: Training 2") { return "partialt2" }
              else if ( d.Engagement === "Zero") { return "zero" }
            }) 
            .on("mouseover", mouseover)
            .on("mouseout", mouseout)
           .attr("cx", function(d) { return projection([d.Longitude, d.Latitude])[0];})
           .attr("cy", function(d) { return projection([d.Longitude, d.Latitude])[1]; })
           .attr("r", 5)
           .on("click", update)
          //.style("fill", function(d,i) { return color(d.Engagement)})
          // .style("fill", function(d,i) { return color(d.Engagement)})//this will filter color later on
           // .style("fill", function(d,i) { 
           //    if (d.Engagement === "Full") { return "grey"}
           //    else if ( d.Engagement === "Partial: CMT 1") { return "blue" }
           //    else if ( d.Engagement === "Partial: CMT 2") { return "red" }
           //    else if ( d.Engagement === "Partial: Training 1") { return "purple" }
           //    else if ( d.Engagement === "Partial: Training 2") { return "pink" }
           //    else if ( d.Engagement === "Zero") { return "orange" }
           //  })
           .style("opacity", 0.75)

          circle.exit().remove()

         var tooltip = d3.select("body").append('tooltiptext')
            .style("position", 'absolute')
            .style("padding", '10px 10px')
            .style("background", "white")
            .style("opacity", 0)



        function update(d) {
              if(currentcircle) {
                  currentcircle.transition().duration(2000).attr("r", 5) 
                }
              //console.log(d)
              currentcircle = d3.select(this)

              //console.log(d3.select(this))
              d3.select(this)
              .style("opacity",1)
              .classed("selected",true)
              .transition()
                .duration(2000)
                .attr("r", 15)

              tooltip.transition().duration(2000)
                  .style('opacity', .9)

              var string = "";
                  string = string + "<strong>";
                  string = string + "Site: " + "</strong>";
                  string = string + d["Site Code"];
                  string = string + "<br>";
                  string = string + "City: "
                  string = string + d["City"]
                  string = string + "<hr>"
                  string = string + "Engagement: "
                  string = string + d["Engagement"]
              
              tooltip.html(function() { return string
              })
               .style('left', (d3.event.pageX + 25) + 'px')
               .style('top',  (d3.event.pageY - 30) + 'px')
               .style({ "font-size": "15px", "line-height": "normal"})
               .style({"border": "solid 1px black"})
        }

         var currentcircle;

      function mouseover(d) {
         var string = "";
                  string = string + "<strong>";
                  string = string + "Site: " + "</strong>";
                  string = string + d["Site Code"];
                  string = string + "<br>";
                  string = string + "City: "
                  string = string + d["City"]
                  string = string + "<hr>"
                  string = string + "Engagement: "
                  string = string + d["Engagement"]

          tooltip.transition().duration(20)
            .style('opacity', .9)

          tooltip.html(function() { 
            return string
          //return "<strong>" + "Site: " + "</strong>" + d["Site Code"] + "<br>" + "City: " + d["City"] + "</strong>";
        })
         .style('left', (d3.event.pageX + 25) + 'px')
         .style('top',  (d3.event.pageY - 30) + 'px')
         .style({ "font-size": "15px", "line-height": "normal"})
        }

      function mouseout(d) {
        tooltip.transition().duration(20)
          .style('opacity',0)
      }

    }

        var currentcircle; 
    
  });
});



