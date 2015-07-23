var w = parseInt(d3.select('.po-stackedbarchart').style('width'));
var margin = {top: 20, right: 20, bottom: 100, left: 40},
    width_stackedbar = w - margin.left - margin.right,
    height_stackedbar = 400 - margin.top - margin.bottom;

var formatRegion;
var barchart_data;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width_stackedbar], .1);

var y = d3.scale.linear()
    .rangeRound([height_stackedbar, 0]);

// var color = d3.scale.ordinal()
//     .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

var vals = ["Full","CMT 1","CMT 2","Training 1", "Training 2", "Zero"]
var colorScale = d3.scale.ordinal()
 .domain(vals)
  .range((['#CECE06','#B8B800','#9AB900','#33A626','#337F33','#296629']).reverse())

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(d3.format(".2s"));

var stackedbar = d3.select(".po-stackedbarchart").append("svg")
    .attr("width", width_stackedbar + margin.left + margin.right)
    .attr("height", height_stackedbar + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//////////  DATA IMPORT /////////////////////////
  d3.csv("../data/cm_sampledata.csv", function(error, data) {
    console.log(data)

    data = data.filter(function(d) { return !(d.Region == "TBD" || d.Region == "Sample Region")})
    data.forEach(function(d){
        if (d.Engagement === "Full") { d.Engagement = "Full"}
        else if ( d.Engagement === "Partial: CMT 1") { d.Engagement = "CMT 1" }
        else if ( d.Engagement === "Partial: CMT 2") { d.Engagement = "CMT 2" }
        else if ( d.Engagement === "Partial: Training 1") { d.Engagement = "Training 1" }
        else if ( d.Engagement === "Partial: Training 2") { d.Engagement = "Training 2" }
        else if ( d.Engagement === "Zero") {return d.Engagement = "Zero" }  
    })
//barchart_data = data
    render_barchart(data)
  });//csv


  function render_barchart(input,filter) {

    //barchart_data = input

    console.log(barchart_data)
    
      if(filter) { 
        console.log("filter chosen")
        input = input.filter(function(d) { 
          console.log(d)
          return !(d.Engagement == filter) })
      }

      nested_data = d3.nest()
      .key( function(d) { return d.Region})
      .key( function(d) { return d.Engagement})
      .rollup(function(leaves) { return leaves.length })
      .entries(input)

    formatRegion = (function () {
    var regionArray = [];
    var array = [];
    nested_data.forEach(function(d) {
      var count = 0;
      var obj = {};
      obj["Region"] = d.key
      d.values.forEach(function(d){
        obj[d.key] = +d.values //= obj[item.values]
        count++
        regionArray.push(d.key)
      })
       if(count < colorScale.domain().length) { 
          for(i=0; i < colorScale.domain().length; i++){
            if(regionArray.indexOf(colorScale.domain()[i]) <= -1 ) {
              obj[colorScale.domain()[i]] = 0
             }
            }
          }
      regionArray = []
      array.push(obj)
    })
    return array
  }
  )()


  //Adds  
  formatRegion.forEach(function(d) {
    var y0 = 0;
    d.engagement = colorScale.domain().map(function(name) { 
      return {name: name, y0: y0, y1: y0 += +d[name]}; });
    d.total = d.engagement[d.engagement.length - 1].y1;
  });

  formatRegion.sort(function(a, b) { return b.total - a.total; });

  console.log(formatRegion)

  x.domain(formatRegion.map(function(d) { return d.Region; }));
  y.domain([0, d3.max(formatRegion, function(d) { return d.total; })]);

  stackedbar.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height_stackedbar + ")")
      .call(xAxis);

  stackedbar.select(".x.axis")//.transition().duration(1000).call(xAxis)
    .selectAll("text").style("text-anchor","end")
    .attr("transform","rotate(-65)")
    .style("font-size",10)

  stackedbar.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    // .append("text")
    //   .attr("transform", "rotate(-90)")
    //   .attr("y", 6)
    //   .attr("dy", ".71em")
    //   .style("text-anchor", "end")
    //   .text("Population");

  d3.selectAll('.region').remove()

  var region = stackedbar.selectAll(".region")
      .data(formatRegion)

  //Enter
  region.enter().append("g")
      .attr("class", "g")
      .attr("transform", function(d) { return "translate(" + x(d.Region) + ",0)"; });

   rect = region.selectAll("rect")
        .data(function(d) {  return d.engagement; })

   rect.attr("width", x.rangeBand())
        .attr("y",height_stackedbar-10)
        .attr("x", function(d) { return x(d.Region) })
        .attr("height",10)

    rect.enter().append("rect")
        .attr("width", x.rangeBand())
        .attr("y",height_stackedbar-10)
        .attr("x", function(d) { return x(d.Region) })
        //.attr("x", 0)
        .attr("height",10)
        .style("fill", function(d) { return colorScale(d.name); })
        .attr("class","region")

    rect.transition().delay(1000).duration(3000)
        .attr("height", function(d) {  return y(+d.y0) - y(+d.y1) })
        .attr("y", function(d) {  return y(d.y1) })
        .attr("x", function(d) { return x(d.Region) })
        .style("fill", function(d) { return colorScale(d.name); })
        // .delay(function(d, i) {
        //       return i * 20;
        //   })
        .ease('elastic')

  // region.selectAll("rect")
  //     .data(function(d) { return d.engagement; })
  //   .enter().append("rect")
  //     .attr("width", x.rangeBand())
  //     .attr("y", function(d) { return y(d.y1); })
  //     .attr("height", function(d) { return y(d.y0) - y(d.y1); })
  //     .style("fill", function(d) { return colorScale(d.name); })
  //     .attr("class","region")

};

//1.  Getting invalid negative values for several rects after making updates to update/enter
