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
      bottom: 80,
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
    var chosenYAxis = "smokes";
  
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
    function renderXAxes(newXScale, xAxis) {
      var bottomAxis = d3.axisBottom(newXScale);
  
      xAxis.transition()
        .duration(1000)
        .call(bottomAxis);
  
      return xAxis;
    }
  
    // function used for update y-scale var upon click on axis label
  
    function yScale(healthData, chosenYAxis) {
      // create scales
      var yLinearScale = d3.scaleLinear()
        .domain([d3.min(healthData, d => d[chosenYAxis]) * 0.8,
        d3.max(healthData, d => d[chosenYAxis]) * 1.2
        ])
        .range([chartHeight, 0]);
  
      return yLinearScale;
    }
  
    // render function
    function renderYaxis(newYscale, yAxis) {
      var leftAxis = d3.axisLeft(newYScale);
  
      yAxis.transition()
        .duration(1000)
        .call(leftAxis);
  
      return yAxis;
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
      //   .domain([d3.min(healthData, d => d.age) - 5, d3.max(healthData, d => d.age) + 5 ])
      //   .range([0, chartWidth]);
      var xLinearScale = xScale(healthData, chosenXAxis)
  
      // var yLinearScale = d3.scaleLinear()
      //   .domain([d3.min(healthData, d => d.smokes) - 5, d3.max(healthData, d => d.smokes) + 5])
      //   .range([chartHeight, 0]);
  
      var yLinearScale = yScale(healthData, chosenYAxis)
  
      var bottomAxis = d3.axisBottom(xLinearScale);
      var leftAxis = d3.axisLeft(yLinearScale);
  
      var xAxis = chartGroup.append("g")
        .attr("transform", `translate(0, ${chartHeight})`)
        .call(bottomAxis);
  
      var yAxis = chartGroup.append("g")
        .call(leftAxis);
  
      // create circles 
      var circleGroup = chartGroup.selectAll("circle")
        .data(healthData)
        .join("circle")
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 15)
        .attr("class", "stateCircle");
  
      var textGroup = chartGroup.selectAll("text.stateText")
        .data(healthData)
        .join("text")
        .attr("x", d => xLinearScale(d[chosenXAxis]))
        .attr("y", d => yLinearScale(d[chosenYAxis]) + 5)
        .text(d => (d.abbr))
        .attr("class", "stateText");
  
      // Create group for three x-axis labels
      var xLabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${chartWidth / 2}, ${chartHeight + 20})`);
  
      var ageLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "age") // value to grab for event listener
        .classed("active", true)
        .text("Age (Median)");
  
      var povertyLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "poverty") // value to grab for event listener
        .classed("inactive", true)
        .text("Poverty (%)");
  
      var incomeLabel = xLabelsGroup.append("text")
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "income") // value to grab for event listener
        .classed("inactive", true)
        .text("Income (Median)");
      
      // create y-labels group
      var yLabelsGroup = chartGroup.append("g")
        .attr("transform", "rotate(-90)")
  
    }).catch(error => console.log(error));
  
  }
  
  // When browser loads loadChart(); is called
  loadChart();
  
  // LoadChart is called on a browser resize
  d3.select(window).on("resize", loadChart);