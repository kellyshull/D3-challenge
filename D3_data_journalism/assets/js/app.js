// @TODO: YOUR CODE HERE!
d3.select(window).on("resize", handleResize);

loadChart();

function handleResize() {
    var svgArea = d3.select("svg");

    // if there is already a svg container on page, remove it and reload chart

    if (!svgArea.empty()) {
        svgArea.remove();
        loadChart();
    }
}



function loadChart() {
// Define SVG area dimensions
var svgWidth = window.innerWidth - 5;
var svgHeight = window.innerHeight - 5;

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

// Load data from data.csv
d3.csv("./assets/data/data.csv").then(healthData => {

    console.log(healthData);

}).catch(error => console.log(error));

}