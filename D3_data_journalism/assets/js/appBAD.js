// @TODO: YOUR CODE HERE!

var options = ["obesity vs. income", "obesity vs. poverty"]

// Read CSV
d3.csv("assets/data/data.csv").then((censusData)=>{
  console.log(censusData)
  inputSelect = d3.select("#selDataset")
  inputSelect.append("option").text(options).property("value". options)  


  // parse data
  censusData.forEach(function(data) {
    data.obesity =  +data.obesity;
    data.income = +data.income;
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;  
  });

  DisplayPage(censusData[0])
  })
  
  function DisplayPage(sampleID){
      console.log(sampleID)
      d3.json("samples.json").then((incomingData)=>{  


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

          // Add X axis label:
          svg.append("text")
              .attr("text-anchor", "end")
              .attr("x", width)
              .attr("y", height+50 )
              .text("Average Obesity");
          
              // Add Y axis label:
          svg.append("text")
              .attr("text-anchor", "end")
              .attr("x", 0)
              .attr("y", height/2)
              .text("Average Income")
              .attr("text-anchor", "start")



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
          var toolTip = d3.select("chartBody")
            .append("svg")
            .classed("tooltip", true);

          // Step 2: Create "mouseover" event listener to display tooltip
          circlesGroup.on("mouseover", function(d) {
              console.log(d.abbr)
              toolTip.style("display", "block")
                .html(
                  `<strong>(d.state)<strong><hr>Obesity rate: (d.obesity)<hr> Average Annual Income: (d.income)`
                )
                .style("left", d3.event.pageX + "px")
                .style("top", d3.event.pageY + "px");
          })
          // Step 3: Create "mouseout" event listener to hide tooltip
          .on("mouseout", function(d) {
            toolTip.style("display", "none");
          });

        }
        , function(error) {
          console.log(error);
        });

     
}


// Create OPTION CHANGE Function to listen & respond to user input (ID)

function optionChanged(newValue){
DisplayPage(newValue);
}