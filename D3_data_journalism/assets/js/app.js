// @TODO: YOUR CODE HERE!
function loadChart() {

  var svgArea = d3.select("body").select("svg");

  // if there is already a svg container on page, remove it and reload chart
  if (!svgArea.empty()) {
        svgArea.remove();
  }

// Define SVG area dimensions
  var svgWidth = 960;
  var svgHeight = 500;

  // Define the chart's margins as an object
  var chartMargin = {
    top: 30,
    right: 30,
    bottom: 30,
    left: 30
  };

  // Define dimensions of the chart area
  var chartWidth = svgWidth - chartMargin.left - chartMargin.right;
  var chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;
  
  // Select body, append SVG area to it, and set the dimensions
  var svg = d3.select("#scatter")
            .append("svg")
            .attr("height", svgHeight)
            .attr("width", svgWidth);

  // Append a group to the SVG area and shift ('translate') it to the right and to the bottom
  var chartGroup = svg.append("g")
                  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);
  
  
var chosenXAxis = "age";

// function used for updating x-scale var upon click on axis label
function xScale(healthData, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(healthData, d => d[chosenXAxis]) * 0.8,
      d3.max(healthData, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, chartWidth]);

  return xLinearScale;

}

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, chosenXAxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}

  // Load data from data.csv
  d3.csv("./assets/data/data.csv").then(healthData => {

     

    // parse data 
    healthData.forEach(data => {
      // x-axis data
      data.poverty = +data.poverty;
      data.income = +data.income;
      data.age = +data.age;
      // y-axis data
      data.healthcare = +data.healthcare;
      data.smokes = +data.smokes;
      data.obesity = +data.obesity;
    });

    // console.log(healthData);

    // scale functions
    // var xLinearScale = d3.scaleLinear()
    //             .domain([d3.min(healthData, d => d.age) - 5, d3.max(healthData, d => d.age) + 5 ])
    //             .range([0, chartWidth]);
    var xLinearScale = xScale(healthData, chosenXAxis)
    var yLinearScale = d3.scaleLinear()
                .domain([d3.min(healthData, d => d.smokes) - 5, d3.max(healthData, d => d.smokes) + 5 ])
                .range([chartHeight, 0]);
    
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    chartGroup.append("g")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);
    
    // create circles 
    var circleGroup = chartGroup.selectAll("circle")
                      .data(healthData)
                      .join("circle")
                      .attr("cx", d => xLinearScale(d.age))
                      .attr("cy", d => yLinearScale(d.smokes))
                      .attr("r", 15)
                      .attr("class", "stateCircle");
    
    var textGroup = chartGroup.selectAll("text.stateText")
                    .data(healthData)
                    .join("text")
                    .attr("x", d => xLinearScale(d.age))
                    .attr("y", d => yLinearScale(d.smokes)+5)
                    .text(d => (d.abbr))
                    .attr("class", "stateText");

  }).catch(error => console.log(error));

}

// When browser loads loadChart(); is called
loadChart();

// LoadChart is called on a browser resize
d3.select(window).on("resize", loadChart);