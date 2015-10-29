var w = parseInt(d3.select('.po-stackedbarchart').style('width'));
var margin = {top: 20, right: 20, bottom: 100, left: 40},
    width_stackedbar = w - margin.left - margin.right,
    height_stackedbar = 350 - margin.top - margin.bottom;

var formatRegion;
var barchart_data;

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width_stackedbar], .1);

var y = d3.scale.linear()
    .rangeRound([height_stackedbar, 0]);

var vals = ["Full","CMT 1","CMT 2","Training 1", "Training 2", "Zero"]
var colorScale = d3.scale.ordinal()
  .domain(vals)
  .range((['#CECE06','#B8B800','#9AB900','#33A626','#337F33','#296629']).reverse())

var xAxis = d3.svg.axis().scale(x).orient("bottom");

var yAxis = d3.svg.axis().scale(y).orient("left")
    //.tickFormat(d3.format(".2s"));

var stackedbar = d3.select(".po-stackedbarchart").append("svg")
    .attr("width", width_stackedbar + margin.left + margin.right)
    .attr("height", height_stackedbar + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

 stackedbar.append("g")
      .attr("class", "y axis")

  stackedbar.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height_stackedbar + ")")


function render_barchart(data,engagement,enabled) {
  data = data;
   //Determine if an engagement filter has been passed
  if(engagement) {
    data.forEach(function(d) {
          if(d.Engagement == engagement) {
            //Update enabled property based on enabled var being either true\false
            //Enabled values will then be returned in the .filter function
            if(enabled) { d.enabled = "enabled" }
            else { 
              d.enabled = ""}
          }
      })
  }
  //Data filtered to include only enabled items
  data = data.filter(function(d) { 
    return d.enabled 
  })

  //Returns [{key:"META", values: [{ key:"Zero", values: 34}]}]
  //Keys are nested by calling .key 2x and rollup is and item count of 2nd key
  nested_data = d3.nest()
  .key( function(d) { return d.Region})
  .key( function(d) { return d.Engagement})
  .rollup(function(leaves) { return leaves.length })
  .entries(data)
  //Create new array of objects that rollup up engagment:value 
  //If an enggement value didn't exist for a region, one is created 
  //and value set to 0.  Otherwise errors produced in formatRegion.forEach
  formatRegion = (function () {
  var regionArray = [];//engagements that object currently 
  var array = [];
  nested_data.forEach(function(d) {
    var count = 0; //used to count items in colorScale.domain
    var obj = {};
    obj["Region"] = d.key
    d.values.forEach(function(d){
      obj[d.key] = +d.values //= obj[item.values]
      count++
      regionArray.push(d.key)
    })//Loop that adds missing engagement vals to obj with value of 0
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
    if(name == engagement) { return {name: name, y0: y0, y1: y0 += +d[name]}; }
    else { return {name: name, y0: y0, y1: y0 += +d[name]}; }

  });
  d.total = d.engagement[d.engagement.length - 1].y1;
});

formatRegion.sort(function(a, b) { return b.total - a.total; });
// formatRegion.sort(function(a, b) { return b.Region - a.Region; });
console.log(formatRegion)
x.domain(formatRegion.map(function(d) { return d.Region; }));
y.domain([0, d3.max(formatRegion, function(d) { return d.total; })]);

stackedbar.select(".y.axis").transition().duration(1500) // https://github.com/mbostock/d3/wiki/Transitions#wiki-d3_ease
  .call(yAxis);  

stackedbar.select(".x.axis").transition().duration(1500)
  .call(xAxis)
stackedbar.select(".x.axis")//.transition().duration(1000).call(xAxis)
  .selectAll("text").style("text-anchor","end")
  .attr("transform","rotate(-65)")
  .style("font-size",10)
  // .append("text")
  //   .attr("transform", "rotate(-90)")
  //   .attr("y", 6)
  //   .attr("dy", ".71em")
  //   .style("text-anchor", "end")
  //   .text("Population");

//Without removing all the regions the data isn't redrawn
d3.selectAll('.region').remove()
//Create regional grouping rangeBands
//var region = stackedbar.selectAll(".region").data(function(d) { return d})
var region = stackedbar.selectAll(".region").data(formatRegion)
//Enter
//region.exit().remove()
//This will produce odd results when d3.selectAll('.region).remove() used and when region removed via legend
//Regions are redrawn but only 1 engagement value is visible in each
// region.attr("transform", function(d) { return "translate(" + x(d.Region) + ",0)"; })
//   .classed("update",true)

//WHY IS EVERY REDRAW SEEING THE DATA AS AN ENTER AND NOT UPDATE?
region.enter().append("g")
  .attr("class", "g")
  .classed("enter",true)
  .attr("transform", function(d) { return "translate(" + x(d.Region) + ",0)"; });

region.exit().remove()

rect = region.selectAll("rect").data(function(d) {  return d.engagement; })

rect.enter().append("rect")
    .attr("width", x.rangeBand())
    //.attr("y",function(d) { return height_stackedbar - d } )//Why minus 10?
    //.attr("y",height_stackedbar)//Why minus 10?
     .attr("y", function(d) {  return y(d.y1) })
    .attr("x", function(d) { return x(d.Region) })
    //.attr("x", 0)
    //.attr("height", 0)
     .attr("height", function(d) {  return ( y(+d.y0) - y(+d.y1) )/2 })
    .style("fill", function(d) { return colorScale(d.name); })
    .attr("class","region")
    .on("mouseover", mouseover)
    .on("mouseout", mouseout)
  .transition().duration(1000)
    .attr("height", function(d) {  return y(+d.y0) - y(+d.y1) })
    .attr("y", function(d) {  return y(d.y1) })
    .attr("x", function(d) { return x(d.Region) })
    //.style("fill", function(d) { return colorScale(d.name); })

//Enter+Update
// rect.transition().delay(500).duration(3000)
//     .attr("height", function(d) {  return y(+d.y0) - y(+d.y1) })
//     .attr("y", function(d) {  return y(d.y1) })
//     .attr("x", function(d) { return x(d.Region) })
//     .style("fill", function(d) { return colorScale(d.name); })
//     .delay(function(d, i) {
//           return i * 20;
//       })
//     .ease('elastic')

rect.exit().transition().duration(1000).attr("height",0).remove()

stackedbar.select(".x.Axis").transition().duration(2000).call(xAxis);
stackedbar.select(".y.Axis").transition().duration(2000).call(yAxis);

var tooltip = d3.select("body").data(data).append('div').attr("class","tooltip")
    .style("position", 'absolute')
    .style("padding", '10px 10px')
    .style("background", "white")

function mouseover(d) {
 tooltipcolor = this.style.fill
 acitverect = d3.select(this)
 acitverect.style("opacity",.6).transition().duration(1000).style("stroke", "black").style("stroke-width", 5)
 var string = "";
          string = string + "<strong>";
          string = string + "Engagement: " + "</strong>";
          string = string + d.name;
          string = string + "<br>";
          // string = string + "<hr>"
          string = string + "Total: "
          string = string + (d.y1 - d.y0);

  tooltip.style("opacity",0)
  tooltip.style("border" , "3px solid " + tooltipcolor )
  tooltip.transition().duration(1000).style("opacity",1)

      tooltip.html(function() { 
        return string
      //return "<strong>" + "Site: " + "</strong>" + d["Site Code"] + "<br>" + "City: " + d["City"] + "</strong>";
    })
     .style('left', (d3.event.pageX -60 ) + 'px')
     .style('top',  (d3.event.pageY - 75) + 'px')
     .style({ "font-size": "15px", "line-height": "normal"})
}//mouseover

function mouseout(d) {
  acitverect = d3.select(this)
  acitverect.transition().duration(1000).style("opacity",1).style("stroke", "").style("stroke-width", 5)
  tooltip.transition().duration(500)
    .style('opacity',0)
}//mouseout
}

