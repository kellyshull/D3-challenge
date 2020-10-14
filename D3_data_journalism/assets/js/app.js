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
    var xLinearScale = d3.scaleLinear()
                .domain([d3.min(healthData, d => d.age) - 5, d3.max(healthData, d => d.age) + 5 ])
                .range([0, chartWidth]);
    
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
                      ;

  }).catch(error => console.log(error));

}

// When browser loads loadChart(); is called
loadChart();

// LoadChart is called on a browser resize
d3.select(window).on("resize", loadChart);