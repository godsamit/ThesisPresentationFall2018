var width = 500;
var height = 500;

//Simple animated example of d3-cloud - https://github.com/jasondavies/d3-cloud
//Based on https://github.com/jasondavies/d3-cloud/blob/master/examples/simple.html
// Encapsulate the word cloud functionality
function wordCloud(selector) {
    var fill = d3.scale.linear()
          .domain([0,1,2,3,4,5,6,10,15,20,100])
          .range(["#ddd", "#ccc", "#bbb", "#aaa", "#999", "#888", "#777", "#666", "#555", "#444", "#333", "#222"]);;

    //Construct the word cloud's SVG element
    var svg = d3.select(selector).append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(250,250)");

    //Draw the word cloud
    function draw(words) {
        var cloud = svg.selectAll("g text")
                        .data(words, function(d) { return d.text; })

        //Entering words
        cloud.enter()
            .append("text")
            .style("font-family", "sans-serif")
            .style("fill", function(d, i) { return fill(i); })
            .attr("text-anchor", "middle")
            .attr('font-size', 1)
            .text(function(d) { return d.text; });

        //Entering and existing words
        cloud.transition()
                .duration(600)
                .style("font-size", function(d) { return d.size + "px"; })
                .attr("transform", function(d) {
                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                })
                .style("fill-opacity", 1);

        //Exiting words
        cloud.exit()
            .transition()
                .duration(200)
                .style('fill-opacity', 1e-6)
                .attr('font-size', 1)
                .remove();
    }

    //Use the module pattern to encapsulate the visualisation code. We'll
    // expose only the parts that need to be public.
    return {
        //Recompute the word cloud for a new set of words. This method will
        // asycnhronously call draw when the layout has been computed.
        //The outside world will need to call this function, so make it part
        // of the wordCloud return value.
        update: function(words) {
            d3.layout.cloud().size([500, 500])
                .words(words)
                .padding(5)
                .rotate(function() { return ~~(Math.random() * 2) * 90; })
                .font("Helvetica")
                .fontSize(function(d) { return d.size; })
                .on("end", draw)
                .start();
        }
    }

}
var wordCount = 50;
var words = Object.keys(AD_FB_DATA)

//Prepare one of the sample sentences by removing punctuation,
// creating an array of words and computing a random size attribute.
function getWords(i) {
    words = Object.keys(AD_FB_DATA).slice(i*wordCount, ((i+1)*wordCount)%Object.keys(AD_FB_DATA).length);
    return words.map(function(d) {
                var wsize = AD_FB_DATA[d];
                if (wsize < 5) wsize *=5;
                if (2*wsize > 96) wsize /= 2;
                return {text: d, size: wsize*2};
            })
}

//This method tells the word cloud to redraw with a new set of words.
//In reality the new words would probably come from a server request,
// user input or some other source.
var num = Math.floor(words.length/wordCount);
function showNewWords(vis, i) {
    i = i || 0;
    vis.update(getWords(i ++ % num))
    setTimeout(function() { showNewWords(vis, i + 1)}, 5000)
}

//Create a new instance of the word cloud visualisation.
var myWordCloud = wordCloud('.wordCloud1');

//Start cycling through the demo data
showNewWords(myWordCloud);