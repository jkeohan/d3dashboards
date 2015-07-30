var thought = {
  "thoughts" : [
    {"word" : "love",
    "count": 100
    },

    {"word" : "you",
    "count": 80
    },

    {"word" : "as",
    "count": 60
    },

    {"word" : "much",
    "count" : 40

    },
     {"word" : "about",
    "count": 101
    },

    {"word" : "friends",
    "count": 81
    },

    {"word" : "run",
    "count": 61
    },

    {"word" : "away",
    "count" : 11
    },

    {"word" : "carefree",
    "count": 10
    },

    {"word" : "appalacian",
    "count": 2
    },

    {"word" : "hypocritical",
    "count" : 3
    }
  ]
}

var ranges = [100,80,60,40,101,81,61,11,10,2,3]
var margin = { top:30, right:30, bottom:40, left:50 }
var width = 800 - margin.left - margin.right
var height = 375 - margin.top - margin.bottom

var left_width = 100;

function drawBarChart(data) {
  var color = d3.scale.category20c()

  var body = d3.select(".horizonalbarchart").append("svg")
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.left + margin.right)
    .attr("class","piebarchart")
    .append('g')
    .attr("transform","translate(0,10)")

  var xScale = d3.scale.linear()
    .domain([0,d3.max(maxData(thought))])
    .range([0,width + margin.left + margin.right - left_width -30])

  var yScale = d3.scale.ordinal()
    .domain(d3.range(maxData(thought).length))// - doesn't work
    .rangeRoundBands([0,height + margin.top + margin.bottom - 20], 0.2)
    
  body.selectAll('rect').data(processData(thought)).enter()
    .append('rect')
    .attr("width", function(d) { return xScale(d.size)})
    .attr('height', yScale.rangeBand())
    .attr('x', left_width)
    .attr('y', function(d,i) { return yScale(i) } ) 
    .style("fill", function(d,i) { return color(d.text)})   

  body.selectAll("text").data(maxData(thought).reverse()).enter()
    .append("text")
    .attr("x", function(d,i) { return xScale(d) + left_width} ) 
    // .attr("x", function(d,i) { 
    //  if( d < 10) { return xScale(d) + left_width + 10}
    //  else {return xScale(d) + left_width }
    // })
    .attr("y", function(d,i){ return yScale(i) + yScale.rangeBand()/2; } )
    .attr("dx", 30) //positions data Xpx to the right from end of xScale(d.size)
    //however using -Xpx can position data to the left
    .attr("dy", ".36em")
    .attr("text-anchor", "end")
    .attr("font-size", "15px")
    .text(String)

  body.selectAll("text.name").data(textData(thought)).enter()
    .append("text")
    .attr("x", 50)
    .attr("y", function(d,i){ return yScale(i) + yScale.rangeBand()/2; } )
    .attr("dy", ".36em")
    .attr("text-anchor", "middle")//end moves text left...begin moves text right
    .attr('class', 'name')
    .style({ "font-family":'Indie Flower'})
    .text(String)

}

drawBarChart(thought)

 function maxData(data){
  var obj = data.thoughts
  var maxDataSet = []
   for(var i in obj) {
    maxDataSet.push( obj[i].count );
    maxDataSet.sort( function compareNumbers(a,b) { return a -b } )
    }
    return maxDataSet
 }

 function textData(data){
  var obj = data.thoughts
  var textDataSet = []
   for(var i in obj) {
    textDataSet.push( obj[i].word );
    }
  return textDataSet
 }

 function processData(data) {
  var obj = data.thoughts
  var sorted = obj.sort(function compareNumbers(a,b) { return a.count -b.count}).reverse()
  var newDataSet = [];
  for(var i in obj) {
    newDataSet.push( {text: obj[i].word, 
        className: obj[i].word.toLowerCase(), size: obj[i].count});
  }
  return newDataSet;
}




