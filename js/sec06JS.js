var typeList = ["NOUN", "ADJ", "ADV", "ADP", "DET", "VERB", "X", "PART", "INTJ"]

var filterTypeList = typeList;

var colorList = ['#eb652d','#edf397','#52deb6','#2deb65','#deb652','#eb2d65','#b2d65e','#2d65eb',"#d65eb2"];


var zoomBubbles = d3.behavior.zoom()
  .scaleExtent([.5, 10])
  .translate([-900,-300])
  .scale(3)
  .on("zoom", zoomedBubbles);

width = 1000; height = 500;

var chart = d3.select(".bubbles")
              .append("svg")
              .attr("width", width)
              .attr("height", height);


var containerBubbles = chart.append("g")
              .attr("class", "bubbleZoom")
              .attr("transform", "translate(-900,-300)scale(3,3)")
              .call(zoomBubbles);  ;

var pack = d3.layout.pack()
              .sort(function(d){return d.type})
              .size([width, height]);

function zoomedBubbles() {
  containerBubbles.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}

var interviewIdx = 2;
var colorMode = 0;

function drawBubble(idx, colorMode){  
  var sizeMin = 1;
  var sizeMax = d3.max(INTERVIEW_WORDS[idx].children, function(d){ return d.value});
  
  var t = d3.transition()
          .duration(1000);
  
  var likings = d3.scale.linear()
                .domain([-1, 1])
                .range(["#2d65eb","#eb652d"])
  
  var nodes = pack.nodes(INTERVIEW_WORDS[idx]);
  
  nodes = nodes.filter(node => filterTypeList.includes(node.type));

  var circles = containerBubbles.selectAll("circle")
                .data(nodes);
  var texts = containerBubbles.selectAll("text")
                .data(nodes);
  //EXIT
  circles.exit()
    .transition(t)
      .attr("r", 1e-6)
      .remove();
  
  texts.exit()
    .transition(t)
      .attr("opacity", 1e-6)
      .remove();
  
  //UPDATE
  circles
      .attr("cx", function(d){ return d.x; })
      .attr("cy", function(d){ return d.y; })
      .attr("fill", function(d){return (colorMode == 0) ? colorList[typeList.indexOf(d.type)] : likings(d.attitude)})
      .attr("r", function(d){ return d.value*5})
      .attr("opacity", function(d){ return (colorMode == 0) ? scale(d.value, sizeMax, sizeMin, 0.3, 1) : .5; });
  
  texts
      .attr("x", function(d){ return d.x; })
      .attr("y", function(d){ return d.y; })
      .text(function(d){ return d.name;})
      .attr("font-size", function(d){return d.value*3})
      .attr("opacity", function(d){return (colorMode == 0) ? scale(d.value, sizeMax, sizeMin, 0.3, 1) : .5; });
  
  //ENTER
  circles.enter()
        .append("circle")
        //.attr("fill", "#fff")
        .attr("fill", function(d){ return (colorMode == 0) ? colorList[typeList.indexOf(d.type)]  : likings(d.attitude) })
        .attr("opacity", 0)
      .transition(t)
        .attr("cx", function(d){ return d.x; })
        .attr("cy", function(d){ return d.y; })
        .attr("r", function(d){ return d.value*5})
        .attr("opacity", function(d){return (colorMode == 0) ? scale(d.value, sizeMax, sizeMin, 0.3, 1) : .5; });
  
  texts.enter()
      .append("text")
    .transition(t)
      .attr("x", function(d){ return d.x; })
      .attr("y", function(d){ return d.y; })
      .text(function(d){ return d.name;})
      .style("text-anchor", "middle")
      .attr("font-size", function(d){return d.value*3})
      .attr("fill", "#000")
      .attr("opacity", function(d){
                      return scale(d.value, sizeMax, sizeMin, 0.3, 1);});
  
  
  $(".bubbleZoom text").first().remove();
  $(".bubbleZoom circle").first().remove();
}

drawBubble(interviewIdx, colorMode);

function changeDataSet(selectObject){
  interviewIdx = selectObject.value;
  drawBubble(interviewIdx, colorMode);
}

function changeColorCoding(selectObject){
  colorMode = selectObject.value;
  drawBubble(interviewIdx, colorMode);
}

function filterWords(selectObject){
  var value = selectObject.value;
  if (value == "all"){
    $('[type="radio"]').prop('checked', true);
    $.each($('[type="checkbox"]:checked'), function(){            
      $(this).prop('checked', false);
    filterTypeList = typeList;
    });
  }
  else{
    var filtered = []
    $.each($('[type="checkbox"]:checked'), function(){            
        filtered.push($(this).val());
    });
    if (filtered.length > 0){
      $('[type="radio"]').prop('checked', false);
      filterTypeList = filtered;
    }
    else if(filtered.length == 0){
      $('[type="radio"]').prop('checked', true);
      filterTypeList = typeList;
    }
  }
  drawBubble(interviewIdx, colorMode);
}