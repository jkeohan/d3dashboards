function dashboard() { 
	window.onresize = function(event) {
		redraw()
	}
  d3.csv("/data/cm_sampledata.csv", engagement, function(data) { startup(data) } )

  function engagment(d) { 
    data.forEach(function(d){
    if (d.Engagement === "Full") { d.enabled = true;d.Engagement = "Full"}
    else if ( d.Engagement === "Partial: CMT 1") {  d.enabled = true;d.Engagement = "CMT 1" }
    else if ( d.Engagement === "Partial: CMT 2") {  d.enabled = true;d.Engagement = "CMT 2" }
    else if ( d.Engagement === "Partial: Training 1") {  d.enabled = true;d.Engagement = "Training 1" }
    else if ( d.Engagement === "Partial: Training 2") {  d.enabled = true;d.Engagement = "Training 2" }
    else if ( d.Engagement === "Zero") { d.enabled = true;d.Engagement = "Zero" }  
    }) 
  }

  function startup(incData) {
   data = data.filter(function(d) { return !(d.Region == "TBD" || d.Region == "Sample Region")}) 
   console.log(data)
   populateMap(data)
   render_barchart(data)
   render_pie(data)
   redraw()
	}
}


