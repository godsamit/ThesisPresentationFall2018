var units = "responses";
 
var margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = 1000 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;
 
var formatNumber = d3.format(",.0f"),    // zero decimal places
    format = function(d) { return formatNumber(d) + " " + units; },
    color = d3.scale.category20();

var zoomSankey = d3.behavior.zoom()
  .scaleExtent([.5, 10])
//  .translate([-900,-300])
//  .scale(3)
  .on("zoom", zoomedSankey);
 
// append the svg canvas to the page
var bigBox = d3.select(".sankey").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");

var svg = bigBox.append("g")
          .attr("class", "sankeyZoom")
          .call(zoomSankey)
 
function zoomedSankey() {
  svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
}
// Set the sankey diagram properties
var sankey = d3.sankey()
    .nodeWidth(16)
    .nodePadding(10)
    .size([width, height]);
 
var path = sankey.link();

var sankeyIndex = 1;

function drawSankey(idx){
  // load the data
  var graph = STATISTICS_WORD[0]


  var nodeMap = {};
  graph.nodes.forEach(function(x) { nodeMap[x.name] = x; });

  graph.links = graph.links.map(function(x) {
        return {
          source: nodeMap[x.source],
          target: nodeMap[x.target],
          value: x.value
        };
      });

  sankey
        .nodes(graph.nodes)
        .links(graph.links)
        .layout(32);

  // add in the links
    var link = svg.append("g").selectAll(".link")
        .data(graph.links)
      .enter().append("path")
        .attr("class", "link")
        .attr("d", path)
        .style("stroke-width", function(d) { return Math.max(1, d.dy); })
        .sort(function(a, b) { return b.dy - a.dy; });

  // add the link titles
    link.append("title")
          .text(function(d) {
          return d.source.name + " → " + 
                  d.target.name + "\n" + format(d.value); });

  // add in the nodes
    var node = svg.append("g").selectAll(".node")
        .data(graph.nodes)
      .enter().append("g")
        .attr("class", "node")
        .attr("transform", function(d) { 
            return "translate(" + d.x + "," + d.y + ")"; })

  var categoryList = ["general", "shape", "color", "activity", "social", "lectures", "materials", "acoustic", "lighting"];

  // add the rectangles for the nodes
    node.append("rect")
        .attr("height", function(d) { return (d.dy < 2) ? 2 : d.dy; })
        .attr("width", sankey.nodeWidth())
        .style("fill", function(d){
          if (d.name == "all") return "#000";
          if (categoryList.includes(d.name)) return colorList[categoryList.indexOf(d.name)];
          else return "#eb652dbf";})
        .style("stroke", function(d) { 
            return d3.rgb(d.color).darker(2); })
      .append("title")
        .text(function(d) { 
            return d.name + "\n" + format(d.value); });

  // add in the title for the nodes
    node.append("text")
        .attr("x", -6)
        .attr("y", function(d) { return d.dy / 2; })
        .attr("dy", ".35em")
        .attr("text-anchor", "end")
        .attr("transform", null)
        .text(function(d) { return d.name; })
      .filter(function(d) { return d.x < width / 2; })
        .attr("x", 6 + sankey.nodeWidth())
        .attr("text-anchor", "start");
}

drawSankey(sankeyIndex);

function changeSankey(selectObject){
  sankeyIndex = selectObject.value
  drawSankey(sankeyIndex);
}