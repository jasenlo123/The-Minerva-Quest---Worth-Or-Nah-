const scatter_margin = { left:20, right: 20, top: 200, bottom: 100 };

scatter_width = window.innerWidth - scatter_margin.left - scatter_margin.right,
scatter_height = window.innerHeight*2

const scatter = d3.select('#scatter')
    .attr("width", scatter_width + scatter_margin.left + scatter_margin.right)
    .attr("height", scatter_height + scatter_margin.top + scatter_margin.bottom)
    .append("g")
    .attr("transform",
          "translate(" + scatter_margin.left + "," + scatter_margin.top + ")");;

const scatter_innerWidth = scatter_width - scatter_margin.left - scatter_margin.right;
const scatter_innerHeight = scatter_height - scatter_margin.top - scatter_margin.bottom;
const spread = 160;
const heightAdjust = 20;

const xValue = d => d.price;
const xLabel = "listings' monthly rent (usd)";
const yValue = d => d.city;
const yLabel = 'city';
const circleSize= d => d.review_number;
const circleOppacity = d => d.rating;

const scatter_cities = ["San Francisco",
                "Seoul", 
                "Hyderabad", 
                "Berlin", 
                "Buenos Aires",
                "London", 
                "Taipei"].reverse()

const colorScale = d3.scaleOrdinal()
                      .domain(scatter_cities)
                      .range(d3.schemeSet2);
                      
const g = scatter.append('g')
    .attr('transform', `translate(${scatter_margin.right},${scatter_margin.top})`);

const xAxisG = g.append('g')
    .attr('transform', `translate(0, ${scatter_innerHeight})`);
const xAxisG2 = g.append('g')
    .attr('transform', `translate(0, ${scatter_innerHeight})`);

const yAxisG = g.append('g');

xAxisG.append('text')
  .attr('class', 'axis-label')
  .attr('x', scatter_innerWidth / 2)
  .attr('y', 500)
  .text(xLabel);


const xScale = d3.scaleLinear();
const yScale = d3.scaleBand();


const yAxis = d3.axisRight()
  .scale(yScale)


const xAxis = d3.axisTop()
  .scale(xScale)
  .ticks(8)
  .tickSize(scatter_innerHeight);

const xAxis2 = d3.axisBottom()
  .scale(xScale)
  .ticks(8)
  .tickSize(-scatter_innerHeight);



d3.csv('full_data.csv', data => {

  const scatter_tooltip = d3
  .select("main")
      .append("div")
      .attr("class", "scatter-svg-tooltip")
      .style("position", "absolute")
      .style("visibility", "hidden");
  
  const image_preview = d3
      .select("main")
          .append("div")
          .attr("class", "scatter-image-preview")
          .style("position", "absolute")
          .style("visibility", "hidden");
  
  xScale
    .domain([0, 800])
    .range([0, scatter_innerWidth])


  yScale
    .domain(scatter_cities)
    .range([scatter_innerHeight, 0])


      g.selectAll('circle')
         .data(data)
          .enter()
          .append('a')
          .attr('xlink:href', function(d){return d.link})
          .append('circle')
          .attr('cx', d => xScale(xValue(d)))
          .attr('cy', d => yScale(yValue(d))+Math.random()*spread + heightAdjust )

          //different colour for each city
          .attr('fill', function(d) { return colorScale(d.city)})

          //border
          .attr("stroke", "black") 
          .attr("stroke-opacity", 0.5)
          .attr("stroke-width", 1) 

          //opacity depends on ratings
          .attr('fill-opacity', d => (circleOppacity(d)-3) / 2)
          //size depends on the number of reviews
          .attr('r', d => circleSize(d)/ 20 + 3.5)



      xAxisG.call(xAxis);
      xAxisG2.call(xAxis2);
      yAxisG.call(yAxis);

      function initiateScatterToolTip () {
        d3.selectAll("circle")
        .on("mouseover", function(d) {
          // change the selection style
          d3.select(this)
            .style("stroke-opacity", 1)
            .style('stroke-width', '3');

          // make the tooltip visible and update its text
          scatter_tooltip 
            .style("visibility", "visible")
            .text(`${d.name}\n
                  ${d.roomtype} located in ${d.detailed_location}\n
                  Listed/per person price: $${d.listed_price} / $${d.price}\n
                   ${d.bedrooms} bedroom/s, ${d.beds} bed/s\n
                   ${d.amenities}\n
                   ${d.full_rating}`)
            
          var url = "<img src= "+ d.image + ">";
          image_preview 
            .style("visibility", "visible")
            .html(url)
          })
        .on("mousemove", function() {
          scatter_tooltip 
            .style("top", d3.event.pageY + 30 + "px")
            .style("left", d3.event.pageX - 30 + "px");
        
          image_preview  
            .style("top", d3.event.pageY - 240 + "px")
            .style("left", d3.event.pageX - 30 + "px")
          })
        .on("mouseout", function() {
          // change the selection style
          d3.select(this)
            .style('stroke-width', '1')
            .style("stroke-opacity", 0.5);
          scatter_tooltip.style("visibility", "hidden");
          image_preview.style("visibility", "hidden");
        })
    

  }
    initiateScatterToolTip();
    });
