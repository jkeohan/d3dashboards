var width = 875;
var height = 375;
var map = void 0; // Update global
var tooltip;
var activeCircle;

//var color = d3.scale.category20c()
var vals = ["Full","Partial: CMT 1","Partial: CMT 2","Partial: Training 1", "Partial: Training 2", "Zero"]
var color = d3.scale.ordinal()
 .domain(["Full","Partial: CMT 1","Partial: CMT 2","Partial: Training 1", "Partial: Training 2", "Zero"])
  .range((['#CECE06','#B8B800','#9AB900','#33A626','#337F33','#296629']).reverse())
// var color = d3.scale.ordinal()
//   .domain(["Full","Partial: CMT 1","Partial: CMT 2","Partial: Training 1", "Partial: Training 2", "Zero"])
//   .range(["green","blue","steelblue","orange","yellow","red"])

var projection = d3.geo.mercator()
    .center([20, 5])
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

    d3.csv("/data/cm_sampledata.csv", function(data) {

      //currentData will be used for filtering based on legend options. 
      //var currentData = data//.map(function(d) { return d.Engagement == "*"})
       var currentData = data//.filter(function(d) { return d.Engagement  === "Full"})
    
      populateMap(currentData)
      createLegend(data)

     function createLegend(data) {
        //var legendVals = d3.set(data.map(function(d) { return d.Engagement } )).values()

        function EngagementVals() {
          var engaged = d3.set(data.map(function(d) { return d.Engagement } )).values()
          return engaged
        }

        var legend = svg.selectAll('.legend')
          .data(EngagementVals().slice().sort())
          .enter().append('g')
          .attr("class", "legend")
          .attr("transform", function(d,i ) {
            var text = d
            console.log(text)
   
            {return "translate(0," + i * 20 + ")"}
          })

          console.log(legend)

        legend.append('rect')
          .attr("x", 120)
          .attr("y", height - 150)
          .attr("width", 10)
          .attr("height", 10)
          .attr("class","rect enabled")
          .style("fill", color )
          .style("stroke",color)
          .on("click", function(d) {
            var legendChoice = d;
            console.log(d)
            var rect = d3.select(this); 
            //console.log(rect)
            var enabled = true;
            if(rect.attr("class") !== "disabled") {
                rect.attr('class','disabled')
              RemoveLegendChoice(d)
            } else { rect.attr("class","enabled") 
              AddLegendChoice(d)
              }
             // var newData = (currentData.filter(function(d) { return d.Engagement !== legendChoice } ))
             //  populateMap(newData)

          })

        legend.append('text')
          .attr("x", 110)
          .attr("y", height - 145)
          .attr("dy", ".35em")
          .text(function(d,i) { return d})
          .attr("class","textselected")
          .style("text-anchor", "end")
          .style("font-size", 10)
      }

     function RemoveLegendChoice(circledata) {
        //console.log(circledata)
        //DATA JOIN...Join new data with old elements if any
        var circle =  svg.selectAll("circle").filter(function(d) { return d.Engagement === circledata})
          //.attr("class","disabled")
          .transition().duration(1000)
          .attr("opacity",0).transition().duration(500)
          .attr("r",0)
        
      }

      function AddLegendChoice(circledata) {
         var circle =  svg.selectAll("circle").filter(function(d) { return d.Engagement === circledata})
          .attr("class", function (d) { return circleEngagement(d) + " engaged" })
          .transition().delay(function(d,i) { return i * 2})
          .attr("opacity",1)
          .attr("r",5)
      }

         function circleEngagement(d) {
            //console.log(d)
               if (d.Engagement === "Full") { return "full"}
              else if ( d.Engagement === "Partial: CMT 1") { return "partialcmt1" }
              else if ( d.Engagement === "Partial: CMT 2") { return "partialcmt2" }
              else if ( d.Engagement === "Partial: Training 1") { return "partialt1" }
              else if ( d.Engagement === "Partial: Training 2") { return "partialt2" }
              else if ( d.Engagement === "Zero") { return "zero" }
        }//circleEngagement
      
      function populateMap(circledata) {
        //console.log(circledata)
        //DATA JOIN...Join new data with old elements if any
         var circle = svg.selectAll("circle")
           .data(circledata).attr("opacity",0)

         circle.attr("class", function (d) { return circleEngagement(d) })
          .on("mouseover", mouseover)
          .on("mouseout", mouseout)
          .transition().duration(2000).attr("opacity",.7)
    
            //adding the below code removes all circles
            // .style("opacity",0)
              // .transition.duration(2000).style("opacity",.7)
        //ENTER
        circle.enter().append("circle")

        //UPDATE
        circle
         .attr("class", function (d) { return circleEngagement(d) + " enabled" })
         .on("mouseover", mouseover)
         .on("mouseout", mouseout)
         .attr("transform", function(d) { 
          return "translate(" + projection([+d.Longitude, +d.Latitude]) + ")" })
           //original code below, however cities not being mapped correctly
           //Longitude must be first in the sequence
           // .attr("cx", function(d) { return projection([d.Longitude, d.Latitude])[0];})
           // .attr("cy", function(d) { return projection([d.Longitude, d.Latitude])[1]; })
           // .attr("cx", function(d) { return projection([d.Longitude])[0];})
           // .attr("cy", function(d) { return projection([d.Latitude])[0];})
         .attr("r", 5)
         .style("fill",function(d) {
               if (d.Engagement === "Full") { return "#296629"}
                        else if ( d.Engagement === "Partial: CMT 1") { return "#337F33" }
                        else if ( d.Engagement === "Partial: CMT 2") { return "#33A626" }
                        else if ( d.Engagement === "Partial: Training 1") { return "#9AB900" }
                        else if ( d.Engagement === "Partial: Training 2") { return "#B8B800" }
                        else if ( d.Engagement === "Zero") { return "#CECE06" }
         })
         //.on("click", update)
         .attr("opacity",0)
          .transition().duration(2000).attr("opacity",.7)

          circle.exit()
            .transition().duration(2000).attr("opacity",.2)
            .remove()

         var tooltip = d3.select("body").data(circledata).append('div').attr("class","tooltip")
            .style("position", 'absolute')
            .style("padding", '10px 10px')
            .style("background", "white")
            //.style("opacity", 0)

        function circleEngagement(d) {
            //console.log(d)
               if (d.Engagement === "Full") { return "full"}
              else if ( d.Engagement === "Partial: CMT 1") { return "partialcmt1" }
              else if ( d.Engagement === "Partial: CMT 2") { return "partialcmt2" }
              else if ( d.Engagement === "Partial: Training 1") { return "partialt1" }
              else if ( d.Engagement === "Partial: Training 2") { return "partialt2" }
              else if ( d.Engagement === "Zero") { return "zero" }
        }//circleEngagement
        
        // function update(d) {
        //       if(currentcircle) {
        //           currentcircle.transition().duration(2000).attr("r", 5) 
        //         }
        //       //console.log(d)
        //       currentcircle = d3.select(this)

        //       //console.log(d3.select(this))
        //       d3.select(this)
        //       .style("opacity",1)
        //       .classed("selected",true)
        //       .transition()
        //         .duration(2000)
        //         .attr("r", 15)

        //       tooltip.transition().duration(2000)
        //           .style('opacity', 0)

        //       var string = "";
        //           string = string + "<strong>";
        //           string = string + "Site: " + "</strong>";
        //           string = string + d["Site Code"];
        //           string = string + "<br>";
        //           string = string + "City: "
        //           string = string + d["City"]
        //           string = string + "<hr>"
        //           string = string + "Engagement: "
        //           string = string + d["Engagement"]

        //       tooltip.html(function() { return string
        //       })
        //        .style('left', (d3.event.pageX + 25) + 'px')
        //        .style('top',  (d3.event.pageY - 30) + 'px')
        //        .style({ "font-size": "15px", "line-height": "normal"})
        
        //        //.style({"border": "solid 1px black"})
        //        //.style({"border": "solid 1px " + tooltipcolor})

        // }//update

        var currentcircle;

        function mouseover(d) {

          tooltipcolor = this.style.fill
              
          activeCircle = d3.select(this)
          //d3.select(this).transition().duration(1000).attr("r",10)
          d3.select(this).transition().duration(1000).ease("bounce")
                    .attr("r", 20)
                    .attr("stroke-width",10)
                    .attr("stroke","rgba(239, 239, 239, .8)")
           var string = "";
                    string = string + "City: "
                    string = string + d["City"]
                    string = string + "<br>"
                    string = string + "Country: "
                    string = string + d["Country"]
                    // string = string + "<hr>"
                    string = string + "<br>"
                    string = string + "Engagement: "
                    string = string + d["Engagement"]
                    // string = string + "<br>"
                    // string = string + "Lat: " 
                    // string = string + d["Latitude"]
                    // string = string + "<br>"
                    // string = string + "Lon: " 
                    // string = string + d["Longitude"]

            tooltip.style("opacity",0)
                  tooltip.style("border" , "3px solid " + tooltipcolor )
            tooltip.transition().duration(1000).style("opacity",1)
         

            tooltip.html(function() { 
              return string
            //return "<strong>" + "Site: " + "</strong>" + d["Site Code"] + "<br>" + "City: " + d["City"] + "</strong>";
            })
           .style('left', (d3.event.pageX + 25) + 'px')
           .style('top',  (d3.event.pageY - 30) + 'px')
           .style({ "font-size": "15px", "line-height": "normal"})
        }//mouseover

        function mouseout(d) {
          activeCircle.transition().duration(500).attr("r", 4).attr("stroke-width",0)
          tooltip.transition().duration(20)
            .style('opacity',0)
        }//mouseout

      }

        var currentcircle; 
    
  });//csv
});//json



