

var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width_stackedbar = 500 - margin.left - margin.right,
    height_stackedbar = 300 - margin.top - margin.bottom;

var x = d3.scale.ordinal().rangeRoundBands([0, width_stackedbar], .1);

var y = d3.scale.linear().rangeRound([height_stackedbar, 0]);

var color = d3.scale.category20()

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(d3.format(".2s"));

var stackedbar = d3.select(".stackedbarchart").append("svg")
    .attr("width", width_stackedbar + margin.left + margin.right)
    .attr("height", height_stackedbar + margin.top + margin.bottom)
    .attr("class","svg-stackedbar")
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

/////////////////////////////////////////
d3.csv("../data/cm_sampledata.csv", function(error, data) {

  build_chart((group_by_region(data))) 

  //console.log(group_by_region(data))

  function group_by_region(data) { 

    var regions = []
    data.forEach(function(reg) {
      var contains_region = false;
      var contain_engagement = false;
      var region;
      regions.forEach(function(match){
          if(reg.Region !== "TBD" || reg.Region !== "Sample Region") {
            if(match.region === reg.Region) {
              region = match.region

              contains_region = true
              //console.log(reg.Engagement)
              if(reg.Engagement === "Full") { match.Full++}
              if(reg.Engagement === "Partial: CMT 1") { match["Partial: CMT 1"]++}
              if(reg.Engagement === "Partial: CMT 2") { match["Partial: CMT 2"]++}
              if(reg.Engagement === "Partial: Training 1") { match["Partial: Training 1"]++}
              if(reg.Engagement === "Partial: Training 2") { match["Partial: Training 2"]++}
              if(reg.Engagement === "Zero") { match.Zero++}
            }//end if
          }//end if
        })//end forEach

        if(!contains_region && reg.Region !== "TBD" && reg.Region !== "Sample Region") {
            regions.push({ 
                region: reg.Region, 
                Full: "" , 
                "Partial: CMT 1":"",
                "Partial: CMT 2":"", 
                "Partial: Training 1":"" ,
                "Partial: Training 2": "",
                Zero: ""})
          }//end if  })
    })
//console.log(regions)
    return regions
  }

  function build_chart(data) {
        //console.log(data)

    //console.log(group_engagement(data))
  color.domain(d3.keys(data[0]).filter(function(key) { return key !== "region"; }));
  //console.log(  color.domain(d3.keys(data[0]).filter(function(key) { return key !== "region"; })))
  //color.domain(d3.keys(group_engagement(data)).filter(function(key) { return key ! }));

//   function group_region(data) { 
//     var group = d3.nest()
//       .key(function(d) { return d.Region})
//       .key(function(d) { return d.Engagement })
//       .rollup(function(leaves) { return leaves.length })
//       .entries(data)  
//     return group
//   }

//   var group_reg = group_region(data)

//   var regionArray = []
//   group_reg.forEach(function(item) { 
//     var region = item.key
//   })

//   //console.log(regionArray)

//   function group_engagement(data) { 
//     //console.log(data)
//     var group = d3.nest()
//       .key(function(d) { return d.Engagement; })
//       .entries(data);
//       //console.log(data)
//     return group
//   }

// function processData(data) {
//      var obj = data
//      var newDataSet = [];
//      for(var i in obj) {
//         newDataSet.push( obj[i].key )
//       }
//      return newDataSet;
//   }

//var total = processData(group_region(data))

data.forEach(function(d) {
    var y0 = 0;
    d.engagement = color.domain().map(function(name) {  return {
      name: name, y0: y0, y1: y0 += +d[name]}});
    d.total = d.engagement[d.engagement.length - 1].y1;
    //console.log(d)

  });

  data.sort(function(a, b) { return b.total - a.total; });

  x.domain(data.map(function(d) { return d.region; }));
  y.domain([0, d3.max(data, function(d) { return d.total; })]);

  stackedbar.append("g")
      .attr("class", "xaxis")
      //This puts the xAxis on the bottom..if not included then
      //xAxis is on top of svg
      .attr("transform", "translate(0," + height_stackedbar + ")")
      .call(xAxis);

  stackedbar.append("g")
      .attr("class", "yaxis")
      .call(yAxis)
 
  var region = stackedbar.selectAll(".region")
      .data(data)
      .enter().append("g")
      .attr("class", "g")
      .attr("transform", function(d) { return "translate(" + x(d.region) + ",0)"; });

  var rect = region.selectAll("rect")
      .data(function(d) {  return d.engagement; })
      .enter().append("rect")
      .attr("width", x.rangeBand())
      .attr("y",height)
      .attr("height",0)
      //.attr("y", function(d) {  return y(d.y1) })
      //.attr("height", function(d) {  return y(+d.y0) - y(+d.y1) })
      //.style("fill", function(d) { return color(d.name)}); 
      .on("mouseover", mouseover)
      .on("mouseout", mouseout)
      .attr("class", function(d,i) { 
              if (d.name === "Full") { return "full"}
              else if ( d.name === "Partial: CMT 1") { return "partialcmt1" }
              else if ( d.name  === "Partial: CMT 2") { return "partialcmt2" }
              else if ( d.name  === "Partial: Training 1") { return "partialt1" }
              else if ( d.name  === "Partial: Training 2") { return "partialt2" }
              else if ( d.name  === "Zero") { return "zero" }
            }) 

         var tooltip = d3.select("body").append('tooltiptext')
            .style("position", 'absolute')
            .style("padding", '10px 10px')
            .style("background", "white")
            .style("opacity", 0)


  rect.transition().duration(3000)
      .attr("height", function(d) {  return y(+d.y0) - y(+d.y1) })
      .attr("y", function(d) {  return y(d.y1) })
      .delay(function(d, i) {
            return i * 20;
        })
      .ease('elastic')

   function mouseover(d) {
    //console.log(d)
         var string = "";
                  string = string + "<strong>";
                  string = string + "Engagement: " + "</strong>";
                  string = string + d.name;
                  string = string + "<br>";
                  string = string + "<hr>"
                  string = string + "Total: "
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

  // var legend = stackedbar.selectAll(".legend")
  //     .data(color.domain().slice())
  //     .enter().append("g")
  //     .attr("class", "legend")
  //     .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  // legend.append("rect")
  //     .attr("x", width - 18)
  //     .attr("width", 18)
  //     .attr("height", 18)
  //     .style("fill", color);

  // legend.append("text")
  //     .attr("x", width - 24)
  //     .attr("y", 9)
  //     .attr("dy", ".35em")
  //     .style("text-anchor", "end")
  //     .text(function(d) { return d; });

    

}
 
});


