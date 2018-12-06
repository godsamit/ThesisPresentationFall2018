var height = 500;
var width = 500;
var words = Object.keys(AD_FB_VECTORS);

function getCoordinates(word){
  return {word: word, x: AD_FB_VECTORS[word].x, y: AD_FB_VECTORS[word].y, size: AD_FB_DATA[word]}
}

const scale = (num, in_min, in_max, out_min, out_max) => {
  return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

var zoom = d3.behavior.zoom()
    .scaleExtent([.5, 10])
    .on("zoom", zoomed);

var drag = d3.behavior.drag()
    .origin(function(d) { return d; })
    .on("dragstart", dragstarted)
    .on("drag", dragged)
    .on("dragend", dragended);

var data = (function() {
               var x = [];
               for (var i=0; i < words.length; i++)
                   x.push(getCoordinates(words[i]));
               return x;
           })();

var x = d3.scale.linear()
          .domain(d3.extent(data, function(d){ return d.x }))
          .range([0, width]).nice();

var y = d3.scale.linear()
          .domain(d3.extent(data, function(d){ return d.y }))
          .range([height, 0]).nice();

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickFormat("")
    .tickPadding(6);

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat("")
    .tickPadding(6);

var scatter = d3.select(".scatter")
                .append("svg")
                .attr("width", width)
                .attr("height", height)
                .append("g").call(zoom);

var container = scatter.append("g");

function transform(d) {
    return "translate(" + x(d.x) + "," + y(d.y) + ")";
  }

var sizeMin = 1;
var sizeMax = d3.max(data, function(d){ return d.size});

container.selectAll("circle")
      .data(data)
      .enter()
    .append("circle")
      .attr("transform", transform)
      .attr("r", function(d){ return d.size})
      .attr("fill", function(d){
                      if (d.x > 0){
                        if (d.y > 0) return "#eb652d";
                        else return "#652deb";
                      }
                      else{
                        if (d.y > 0) return "#2deb65";
                        else return "#deb652";
                      }
                    })
      .attr("opacity", function(d){
                      return scale(d.size, sizeMax, sizeMin, 0.3, 1);
                    });

container.selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .attr("transform", transform)
      .attr('font-size', function(d){ 
                        if (d.size < 5) return d.size*2;
                        else return d.size/2;})
      .attr("text-anchor", "middle")
      .style("font-family", "hn_thin")
      .style("fill", "#000")
      .text(function(d){ return d.word;})
      .attr("opacity", function(d){
                      return scale(d.size, sizeMax, sizeMin, 0.3, 1);
                    });

container.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + y(0) + ")")
      .call(xAxis);

container.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" +x(0) + ",0)")
      .call(yAxis);

function zoomed() {
  container.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}

function dragstarted(d) {
  d3.event.sourceEvent.stopPropagation();
  d3.select(this).classed("dragging", true);
}

function dragged(d) {
  d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
}

function dragended(d) {
  d3.select(this).classed("dragging", false);
}

$('.container').bind('dragstart', function(event) { event.preventDefault(); });