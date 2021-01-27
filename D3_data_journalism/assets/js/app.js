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

  // create date parser
  var dateParser = d3.timeParse("%d-%b");

  // parse data
  censusData.forEach(function(data) {
    data.obesity =  +data.obesity;
    data.income = +data.income;;
  });

  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain(d3.extent(censusData, d => (d.obesity-1)))
    .range([0, width]);
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



  // Add X axis label:
  svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", 28)
      .attr("y",  10)
      .text("Average Obesity");
  
      // Add Y axis label:
  svg.append("text")
      .attr("text-anchor", "end")
      .attr("x", 0)
      .attr("y", height/2)
      .text("Average Income")
      .attr("text-anchor", "start")


  // // Create axes labels
  // chartGroup.append("text")
  //   .attr("transform", "rotate(-90)")
  //   .attr("y", 0 - margin.left + 40)
  //   .attr("x", 0 - (height / 2))
  //   .attr("dy", "1em")
  //   .attr("class", "axisText")
  //   .text("Annual Income per Household");

  // chartGroup.append("text")
  //   .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
  //   .attr("class", "axisText")
  //   .text("Obesity (%)");




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