// @TODO: YOUR CODE HERE!
var svgArea = d3.select("body").select("svg");

// SVG wrapper dimensions are determined by the current width and
// height of the browser window.
var svgWidth = window.innerWidth;
var svgHeight = window.innerHeight;

var margin = {
  top: 50,
  bottom: 50,
  right: 50,
  left: 50
};

var height = svgHeight - margin.top - margin.bottom;
var width = svgWidth - margin.left - margin.right;

// Append SVG element
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("height", svgHeight)
  .attr("width", svgWidth);

// Append group element
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Read CSV
d3.csv("assets/data/data.csv").then(function(censusData) {
    console.log(censusData);
 
  // parse data
  censusData.forEach(function(data) {
    data.obesity =  +data.obesity;
    data.income = +data.income;
  });


  // create scales

  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(censusData, d => d.income)])
    .range([height, 0]);

    var xLinearScale = d3.scaleLinear()
    .domain([15, d3.max(censusData, d => d.obesity)])
    .range([0, width]);

  // create axes
  var xAxis = d3.axisBottom(xLinearScale);
  var yAxis = d3.axisLeft(yLinearScale);

  // append axes
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis);

  chartGroup.append("g")
    .call(yAxis);

  // append circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.obesity))
    .attr("cy", d => yLinearScale(d.income))
    .attr("r", "20")
    .attr("fill", "gold")
    .attr("stroke-width", "1")
    .attr("stroke", "black");

  // Step 1: Append tooltip div
  var toolTip = d3.select(".new_type")
    .append("div")
    .classed("tooltip", true);

  // Step 2: Create "mouseover" event listener to display tooltip
  circlesGroup.on("mouseover", function(d) {
      console.log(d)
    toolTip.style("display", "block")
        .html(d.state)
        .style("left", d3.event.pageX + "px")
        .style("top", d3.event.pageY + "px");
  })
  // Step 3: Create "mouseout" event listener to hide tooltip
  .on("mouseout", function() {
    toolTip.style("display", "none");
  });

}
, function(error) {
  console.log(error);
});
