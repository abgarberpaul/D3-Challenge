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
  left: 100
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

  // create date parser
  var dateParser = d3.timeParse("%d-%b");

  // parse data
  censusData.forEach(function(data) {
    data.obesity =  +data.obesity;
    data.income = +data.income;;
  });

  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain(d3.extent(censusData, d => (d.obesity-.5)))
    .range([0, (width)]);
  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(censusData, d => (d.income+8000))])
    .range([height, 0]);

  // create axes
  var xAxis = d3.axisBottom(xLinearScale);
  var yAxis = d3.axisLeft(yLinearScale).ticks(6);

  // append axes
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis);
  chartGroup.append("g")
    .call(yAxis);

  // Add Y axis label:
  chartGroup.append("text")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-90)")
      .attr("x", 0 - (margin.left))
      .attr("y", -50)
      .text("Average Income ($)");
  
  // Add X axis label:
  chartGroup.append("text")
      .attr("text-anchor", "end")
      .attr("x", (width/2))
      .attr("y", (height +30))
      .text("Obesity Rate (%)")
      .attr("text-anchor", "start");

   // Add a title
  chartGroup.append("text")
      .attr("x", (width / 2))             
      .attr("y", 0 - (margin.top / 2))
      .attr("text-anchor-title", "left")  
      .style("font-size", "20px") 
      .style("text-decoration", "underline")  
      .text("Average Income vs. Obesity Rate (by state)");



  // append circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(censusData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.obesity))
    .attr("cy", d => yLinearScale(d.income))
    .attr("r", "10")
    .attr("fill", "gold")
      .attr("fill-opacity","1")
    .attr("stroke", "black")
      .attr("stroke-width", "1");

    // Append Abbreviation to each data point
    chartGroup.append("text")
    .selectAll("circles")
    .data(censusData)
    .enter()
    .append("tspan")
        .attr("x", d => xLinearScale(d.obesity))
        .attr("y", d => yLinearScale(d.income))
        .attr("text-anchor", "middle")
        .text(function(data) {
            return data.abbr
        })
        .attr("fill", "blue")
        .attr("font-size", 10, "bold");


  // Step 1: Append tooltip div
  var toolTip = d3.select("body")
    .append("div")
    .classed("tooltip", true);

  // Step 2: Create "mouseover" event listener to display tooltip
  circlesGroup.on("mouseover", function(d) {
    toolTip.style("display", "block")
        .html(
          `<strong>${d.state}<strong><hr>Obesity rate: ${d.obesity}%<hr> Avg Annual Income: $${d.income}.00`)
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