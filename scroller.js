
// set the dimensions and margins of the graph
var margin = {top: 100, right: 100, bottom: 300, left: 50},
width = window.innerWidth*0.7 - margin.left - margin.right,
height = window.innerHeight - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("figure")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Global Variables! 
const ticks = 15
const minervaCost = 750
const minervaCostPlus = 1375
const histHeight = 100
const histColour = "#fed8b1"
const cities = ["San Francisco",
                "San Francisco",
                "Seoul", 
                "Hyderabad", 
                "Berlin", 
                "Buenos Aires",
                "London", 
                "Taipei"]


// get the data
d3.csv("prices_data.csv", function(data) {

  const tooltip = d3
  .select("main")
      .append("div")
      .attr("class", "svg-tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden");

  //axis labels
  function initiateAxisLabels () {
      //y-axis
      svg.append("text")
          .attr("class","axis-label")
          .text("number of")
          .attr("x", -30)
          .attr("y", -30)
      svg.append("text")
          .attr("class","axis-label")
          .text("listings")
          .attr("x", -30)
          .attr("y", -15)

      //x-axis
      svg.append("text")
          .attr("class","axis-label")
          .text("rent/month")
          .attr("x", width-100)
          .attr("y", height+40)
      svg.append("text")
          .attr("class","axis-label")
          .text("(in usd)")
          .attr("x", width-100)
          .attr("y", height+55)

  }
  initiateAxisLabels()


    // X axis: scale:
    var max = d3.max(data, function(d) { return +d.price })
    var x = d3.scaleLinear()
      .domain([0, max]) 
      .range([0, width]);
    // X axis: draw:
    svg.append("g")
    .attr("id", "x-axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));
  
    // Y axis: scale:
    var y = d3.scaleLinear()
      .range([height, 0]);
    y.domain([0, histHeight ]);   
    // Y axis: draw:
    svg.append("g")
      .call(d3.axisLeft(y)); 

  // Get a subset of the data based on the group
  function getFilteredData(data, group) {
    return data.filter(function(point) { return point.city === group; });
  }

  // Helper function to add new points to our data
  function enterPoints(data) {


    var max = d3.max(data, function(d) { return +d.price })+ 200
    var x = d3.scaleLinear()
      .domain([0, max]) 
      .range([0, width]);
    
    // set the parameters for the histogram
    var histogram = d3.histogram()
    .value(function(d) { return d.price; })   // I need to give the vector of value
    .domain(x.domain())  // then the domain of the graphic
    .thresholds(x.ticks(ticks)); // then the numbers of bins

    var bins = histogram(data);


    // append the bar rectangles to the svg element
    svg.selectAll("rect")
        .data(bins)
        .enter()
        .append("rect")
          .attr("x", 1)
          .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
          .transition()
          .duration(500)
          .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
          .attr("height", function(d) { return height - y(d.length); })
          .style("fill", "white")
          .style("stroke", "darkOrange" )
          .style('stroke-width', '1')



    // select all rect to initiate tooltip!
    function initiateToolTip () {
        d3.selectAll("rect")
        .on("mouseover", function(d) {
          // change the selection style
          d3.select(this)
           .transition()
           .duration(200)
            .style("fill", "white")
            .style("stroke", histColour)
            .style('stroke-width', '2');
          // make the tooltip visible and update its text
          tooltip
            .style("visibility", "visible")
            .text(`There were ${d.length} Airbnb listings \n between $${d.x0} and $${d.x1}.`);
        })
        .on("mousemove", function() {
          tooltip
            .style("top", d3.event.pageY - 50 + "px")
            .style("left", d3.event.pageX + 10 + "px");
        })
        .on("mouseout", function() {
          // change the selection style
          d3.select(this)
            .transition()
            .duration(200)
            .style('stroke-width', '1')
            .style("stroke", "white")
            .style("fill", histColour);
    
          tooltip.style("visibility", "hidden");
        });
    }
    initiateToolTip ();


 
  }

  function exitPoints(data) {

    var max = d3.max(data, function(d) { return +d.price })+ 200
    var x = d3.scaleLinear()
      .domain([0, max]) 
      .range([0, width]);

    // set the parameters for the histogram
    var histogram = d3.histogram()
    .value(function(d) { return d.price; })   // I need to give the vector of value
    .domain(x.domain())  // then the domain of the graphic
    .thresholds(x.ticks(ticks)); // then the numbers of bins

    var bins = histogram(data);

    svg.selectAll("rect")
        .data(bins)
        .exit()
        .remove();


  }
  function updatePoints(data) {
    // remove previous line
       svg.selectAll("line").remove();
      svg.selectAll(".scroller_anno").remove();


    var max = d3.max(data, function(d) { return +d.price })+ 200
    var x = d3.scaleLinear()
      .domain([0, max]) 
      .range([0, width]);

    d3.selectAll("#x-axis")
        .call(d3.axisBottom(x));

    // set the parameters for the histogram
    var histogram = d3.histogram()
    .value(function(d) { return d.price; })   // I need to give the vector of value
    .domain(x.domain())  // then the domain of the graphic
    .thresholds(x.ticks(ticks)); // then the numbers of bins

    var bins = histogram(data);


    svg.selectAll("rect")
        .data(bins)
        .transition()
        .attr("transform", function(d) { return "translate(" + x(d.x0) + "," + y(d.length) + ")"; })
        .attr("width", function(d) { return x(d.x1) - x(d.x0) -1 ; })
        .attr("height", function(d) { return height - y(d.length); })
        .style("fill", histColour )
        .style("stroke", "white")
        .style('stroke-width', '1')


      d3.selectAll(".minerva-chart-label")
          .style("visibility", "hidden");
        d3.selectAll(".median-chart-label")
          .style("visibility", "hidden");

    
 
 
    function drawLineMedian (value, colour) {
        svg.append("text")
            .attr("class","median-chart-label")
            .text("median")
            .attr("x", x(value)-20)
            .attr("y", height+50)
            .style('fill', 'black')
        svg.append("text")
            .attr("class","median-chart-label")
            .text("airbnb")
            .attr("x",x(value)-20)
            .attr("y", height+80)
            .style('fill', 'black')
        svg.append("text")
            .attr("class","median-chart-label")
            .text("listing")
            .attr("x",x(value)-20)
            .attr("y", height+110)
            .style('fill', 'black')

          svg.append("line")
          .attr("x1", x(value) )
          .attr("x2", x(value) )
          .attr("y1", y(0))
          .attr("y2", y(0))
          .attr("stroke", colour)
          .attr("stroke-width", "3") 
           .transition()
           .duration(300)
           .attr("x1", x(value) )
           .attr("x2", x(value) )
           .attr("y1", y(0))
           .attr("y2", y(histHeight))
        
        svg.append("text")
           .attr("class","line-label")
           .text(`$${value}`)
           .attr("x", x(value)-20)
           .attr("y", -15)
           .style('fill', 'black')
           
      }
    function drawLineMinerva (value, colour) {
         svg.append("line")
            .attr("stroke", colour)
            .attr("stroke-width", "3") 
            .attr("x1", x(value) )
            .attr("x2", x(value) )
            .attr("y1", y(0))
            .attr("y2", y(0))
            .transition()
            .duration(300)
            .attr("x1", x(value) )
            .attr("x2", x(value) )
            .attr("y1", y(0))
            .attr("y2", y(histHeight))
            ;
         svg.append("text")
             .attr("class","minerva-chart-label")
             .text("minerva ")
             .attr("x", x(value)-20)
             .attr("y", height+65)
             .style('fill', 'darkOrange')
         svg.append("text")
             .attr("class","minerva-chart-label")
             .text("housing")
             .attr("x", x(value)-20)
             .attr("y", height+95)
             .style('fill', 'darkOrange')

          svg.append("text")
             .attr("class","line-label")
             .text(`$${value}`)
             .attr("x", x(value)-20)
             .attr("y", -15)
             .style('fill', 'darkOrange')
 
    }
       d3.selectAll(".line-label")
           .style("visibility", "hidden")
       drawLineMinerva(minervaCost, "darkOrange") 
       //median line
       var median = d3.median(data, d => d.price)
       drawLineMedian(median, "black") 
 

    function calculateProportionCheaper(data) {
        var entries = data.length

        var cheaper = data.filter(function(cost) { return cost.price < 750; }).length

        svg.append("text")
        .text(`${cheaper} / ${entries} (${Math.round((cheaper/entries)*100)}%)`)
        .attr("class", "scroller_anno")
        .attr("font-weight", 1000)
        .attr("x", width-150)
        .attr("y", height -250)
        .attr("fill", "darkOrange")


        svg.append("text")
        .text(`listings scraped`)
        .attr("class", "scroller_anno")
        .attr("x", width-150)
        .attr("y", height -230)


        svg.append("text")
        .text(`were cheaper `)
        .attr("class", "scroller_anno")
        .attr("x", width-150)
        .attr("y", height -210)


        svg.append("text")
        .text(`than Minerva`)
        .attr("class", "scroller_anno")
        .attr("x", width-150)
        .attr("y", height -190)

      }
      calculateProportionCheaper(data)
    }
    
  


  // using d3 for convenience, and storing a selected elements
  var main = d3.select("main");
  var scrolly = main.select("#scrolly");
  var figure = scrolly.select("figure");
  var article = scrolly.select("article");
  var step = article.selectAll(".step");

  // initialize the scrollama
  var scroller = scrollama();

  // resize function to set dimensions on load and on page resize
  function handleResize() {

      // 1. update height of step elements
      var stepH = Math.floor(window.innerHeight * 0.85);

      step.style("height", stepH + "px");
      

      var figureHeight = window.innerHeight / 1.2;
      var figureMarginTop = (window.innerHeight - figureHeight) / 2;

      figure
        .style("height", figureHeight + "px")
        .style("top", figureMarginTop + "px");

      // 3. tell scrollama to update new element dimensions
      scroller.resize();
  }

  // scrollama event handlers
  function handleStepEnter(response) {


      // response = { element, direction, index }
      console.log(response)


      // fade in current step
      step.classed('is-active', function (d, i) {
        return i === response.index;
      })

      // update graphic based on step here
      var $groupSelector = cities[response.index]
      var groupData = getFilteredData(data, $groupSelector);

      if (response.index == 0 && response.direction == "down") {
           enterPoints(groupData);
      }
      else {
          updatePoints(groupData);
          exitPoints(groupData);
      }
  }

  function setupStickyfill() {
      d3.selectAll(".sticky").each(function() {
        Stickyfill.add(this);
      });
  }
    

  // kick-off code to run once on load
  function init() {

    setupStickyfill();

      	// 1. call a resize on load to update width/height/position of elements
	    handleResize();

	    // 2. setup the scrollama instance
    	// 3. bind scrollama event handlers (this can be chained like below)
      scroller
        .setup({
          step: "#scrolly article .step", // the step elements
          offset: 0.5, // set the trigger to be 1/2 way down screen
          //debug: true, // display the trigger offset for testing
        })
        .onStepEnter(handleStepEnter)

      // setup resize event
      window.addEventListener('resize', handleResize);
    
  }

  // start it up
  init();



});
