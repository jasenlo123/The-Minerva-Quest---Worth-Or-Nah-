const scatter_margin = { left:-300, right: 250, top: 30, bottom: 200 };

scatter_width = window.innerWidth - scatter_margin.left - scatter_margin.right,
scatter_height = window.innerHeight - scatter_margin.bottom

const scatter =  d3.select("#scrolly2").select("figure")
    .append("svg")
    .attr("width", scatter_width + scatter_margin.left + scatter_margin.right)
    .attr("height", scatter_height + scatter_margin.top + scatter_margin.bottom)
    .append("g")
    .attr("transform",
          "translate(" + scatter_margin.left + "," + scatter_margin.top + ")");;

const scatter_innerWidth = scatter_width - scatter_margin.left - scatter_margin.right*1.1;
const scatter_innerHeight = scatter_height - scatter_margin.bottom;
const spread = scatter_innerHeight*0.98;
const heightAdjust = -scatter_innerHeight/1.4;

const xValue = d => d.price;
const xLabel = "listing monthly rent (usd)";
const yValue = d => d.city;
const circleSize= d => d.review_number;
const circleOppacity = d => d.rating;

const scatter_cities = ["San Francisco",
                "Seoul", 
                "Hyderabad", 
                "Berlin", 
                "Buenos Aires",
                "London", 
                "Taipei"]

const colorScale = d3.scaleOrdinal()
                      .domain(scatter_cities)
                      .range(d3.schemeSet2);
                      
const g = scatter.append('g')
    .attr('transform', `translate(${scatter_margin.right},${scatter_margin.top})`);
const xAxisG = g.append('g')
    .attr('transform', `translate(0, ${scatter_innerHeight})`);
const xAxisG2 = g.append('g')
    .attr('transform', `translate(0, ${scatter_innerHeight})`);


g.append('text')
  .attr('class', 'axis-label')
  .attr('x', (scatter_innerWidth / 2.5))
  .attr('y', scatter_innerHeight +50)
  .text(xLabel);


const xScale = d3.scaleLinear();

const xAxis = d3.axisBottom()
  .scale(xScale)
  .ticks(8)
  .tickSize(-scatter_innerHeight);


d3.csv('full_data.csv', data => {

  //initiate x value scale
  xScale
    .domain([0, 800])
    .range([0, scatter_innerWidth])

  //initiate axis
  xAxisG.call(xAxis);

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

  g.selectAll('circle')
         .data(data)
          .enter()
          .append('a')
          .attr('xlink:href', function(d){return d.link})
          .append('circle')
          .attr('cx', d => xScale(xValue(d)))
          .attr('cy', d => scatter_height/2+Math.random()*spread + heightAdjust )

          //different colour for each city
          .attr('fill', function(d) { return colorScale(d.city)})

          //border
          .attr("stroke", "black") 
          .attr("stroke-opacity", 0.5)
          .attr("stroke-width", 1) 
          .style("visibility", "visible")
  
  g.append("line")
          .attr("x1", xScale(750)+30)
          .attr("y1", -5)
          .attr("x2", xScale(750)+30)
          .attr("y2", scatter_innerHeight)
          .attr("stroke-width", 5)
          .attr("stroke", "orange")
          .attr("class", "moving_line")
          .attr("visibility", "hidden");

    g.append("text")
          .attr("x", xScale(750)-20)
          .attr("y", -40)
          .text(750)
          .attr("class", "moving_line_label")
          .attr("visibility", "hidden");



    function initiateLegend0() {
    g.selectAll("legend_labels")
      .data(scatter_cities)
      .enter()
      .append("text")
      .text(function(d){ return d})
      .attr("x", function(d,i){ return scatter_innerWidth/10+40 + i*(scatter_innerWidth/50+scatter_innerWidth/10)})
      .attr("y", scatter_innerHeight*1.2+15) 

    g.selectAll("legend_rects")
          .data(scatter_cities)
          .enter()
          .append("rect")
          .attr("id", "legend_rect")
          .attr('fill', function(d) { return colorScale(d)})
          .attr("width", scatter_innerWidth/50)
          .attr("height", scatter_innerHeight/20)
          .attr("x", function(d,i){ return scatter_innerWidth/10 + i*(scatter_innerWidth/50+scatter_innerWidth/10)})
          .attr("y", scatter_innerHeight*1.2) 
          .on("mouseover", function(d) {
            var legendUnderMouse = this;
              g.selectAll("#legend_rect")
                  .attr('opacity',function () {
                  return (this === legendUnderMouse) ? 1.0 : 0.2;
                    })
              g.selectAll("circle")
                  .attr('opacity',function (e) {
                    return (e.city == d) ? 1.0 : 0.2;
                      })
                  .style('stroke-width',function (e) {
                        return (e.city == d) ? "2" : "1";
                          })


            })
          .on("mouseout", function() {
              // change the selection style
            g.selectAll("circle")
              .style('stroke-width', '1')
              .attr('opacity', 1)
              scatter_tooltip.style("visibility", "hidden");
            d3.selectAll("#legend_rect")
              .attr('opacity', 1);

            })
        
    }
    initiateLegend0()


  // using d3 for convenience
  var scrolly2 = d3.select("#scrolly2");
  var article2 = scrolly2.select("article");
  var step2 = article2.selectAll(".step2");
  var figure2 = scrolly2.select("figure");


  // initialize the scrollama
  var scroller2 = scrollama();

  function calc (finaid) {
    return (3000 - finaid)/4
  }

  function handleStepProgress2(response) {
    handleMouseEvent0(response);
    handleMouseEvent1(response)

      function handleMouseEvent0 (response) {
        if (response.index == 0){

             initiateLegend0()

            g.selectAll('circle')
              .transition()
              .duration(500)
              .attr('fill-opacity', 1)
              .attr('r', 5)


            figure2.selectAll("circle")
                .style('visibility', function(d) {            
                if (d.price <= calc((1-response.progress)*3000)) {return "visible"}
                else { return "hidden" };
                })
                .on("mouseover", function(d){
                    var url = "<img src= "+ d.image + ">";
                    image_preview 
                        .style("visibility", "visible")
                        .html(url)

                    d3.select(this)
                        .style("stroke-opacity", 1)
                        .style('stroke-width', 2);

                    g.append("text")
                        .attr("x", xScale(d.price)-20)
                        .attr("y", -20)
                        .text(`$${Math.round(d.price)}`)
                        .attr("class", "mouseover");

                    g.append("line")
                        .attr("x1", xScale(d.price)-5)
                        .attr("x2", xScale(calc((1-response.progress)*3000)))
                        .attr("stroke-width", 1)
                        .attr("stroke", "orange")
                        .attr("class", "mouseover");
                    g.append("line")
                        .attr("x1", xScale(d.price)-5)
                        .attr("x2", xScale(d.price)-5)
                        .attr("y1", -5)
                        .attr("y2", scatter_innerHeight)
                        .attr("stroke-width", 1)
                        .attr("stroke", "orange")
                        .attr("class", "mouseover");

                    figure2.select("#figure_caption")
                        .style("display", "none");

                    figure2.select("#mouseover_figure_caption")
                        .style("display", "block")
                        .html(`
                        (Residential Fee - Independent Fee - Fin Aid) / 4 months ) - Listing Rent Per Month  = Money Saved! <br> 
                        ( $ 5500 - $ 2500 - $ ${Math.round((1-response.progress)*3000)} ) / 4 months ) -  $ ${Math.round(d.price)} = Money Saved!<br> <br> 
                        Opting out of Minerva housing for this 
                        <span>${d.roomtype}</span> in
                        <span>${d.detailed_location}</span>,
                        <span>${d.city}</span> with
                        <span>${d.beds -1 } roomies </span> 
                        would save you <br> <span>$
                        ${Math.round(calc((1-response.progress)*3000))} -  $ ${Math.round(d.price)} = $ ${Math.round(calc((1-response.progress)*3000) - d.price)}
                        per month </span> if you get $ <span> ${Math.round((1-response.progress)*3000)} </span>in fin aid each semester. 
                        `)
                   scatter_tooltip
                        .style("visibility", "visible")
                        .text(`${d.full_rating}`)
                

                })
                .on("mousemove", function() {
                  image_preview  
                    .style("top", d3.event.pageY + 50+ "px")
                    .style("left", d3.event.pageX  - scatter_innerWidth/12 + "px")
                  
                  scatter_tooltip
                  .style("top", d3.event.pageY + 10 + "px")
                  .style("left", d3.event.pageX  - scatter_innerWidth/12 + "px")
                })
                .on("mouseout", function() {
                          // change the selection style
                      d3.select(this)
                        .style('stroke-width', '1')
                        .style("stroke-opacity", 0.5);
                      d3.selectAll(".mouseover")
                        .style("visibility", "hidden");

                      figure2.select("#figure_caption")
                        .style("display", "block");

                      figure2.select("#mouseover_figure_caption")
                        .style("display", "none");  

                      image_preview.style("visibility", "hidden");
                      scatter_tooltip.style("visibility", "hidden");

                })

            figure2.select("#figure_caption")
                .html(`This viz shows the independent housing options found on Airbnb that make financial sense to those who under $6,000 per year or $3,000 per semester in scholarships. Scroll to vary the scholarship amount... <br><br> If you receive $ <span>${Math.round((1-response.progress)*3000)}</span> in in scholarship per semester, you would save money by living independently in listings (left of the <span style="color: orange;"> orange line</span>) that cost below $ <span>${Math.round(calc((1-response.progress)*3000))}</span>. Mouse over any listing, represented by the circles, to find out why and how much!`)
                
      
            figure2.select(".moving_line")
              .attr("visibility", "visible")
              .attr("x1", xScale(calc((1-response.progress)*3000)))
              .attr("x2", xScale(calc((1-response.progress)*3000)))
            figure2.select(".moving_line_label")
              .attr("visibility", "visible")
              .attr("x", xScale(calc((1-response.progress)*3000))-20)
              .text(`$${Math.round(calc((1-response.progress)*3000))}`)
       }
      }
      
      function handleMouseEvent1 (response) {
        if (response.index == 1){

            g.selectAll('circle')
                .attr('xlink:href', function(d){return d.link})

            figure2.select("#figure_caption")
                .html(`<br>
                For anyone serious about opting out of Minerva housing and curious about what Airbnb options look like, click on each bubble to get to the listing page. <span>The Quest</span> also scraped the ratings from these listings. Use the legend below to note which cities have more listings, and which of these are not too suss given their ratings. <br>
                <span> Larger Bubbles = More Reviews | Deeper Colour = Better Ratings</span>`)

            figure2.selectAll('circle')
                .attr('xlink:href', function(d){return d.link})
                .transition()
                .duration(500)
                //opacity depends on ratings
                .attr('fill-opacity', d => (circleOppacity(d)-3) / 2.5)
                //size depends on the number of reviews
                .attr('r', d => circleSize(d)/ 20 + 3.5)
            
            function intiateLegend1() {
            g.selectAll("legend_rects")
                .on("mouseover", function(d) {
                  var legendUnderMouse = this;
                    g.selectAll("#legend_rect")
                        .attr('opacity',function (d) {
                        return (this === legendUnderMouse) ? 1.0 : 0.2;
                          })
            g.selectAll("circle")
                        .attr('opacity',function (e) {
                          return (e.city == d) ? (circleOppacity(d)-3) / 2.5 : 0.2;
                            })

              })
            }
            intiateLegend1()
        }
      }
      

  }


  function resize2() {
    var min = window.innerHeight*2;
    step2.style("height", min + "px");
    scroller2.resize();

    var figureHeight = window.innerHeight;
    var figureMarginTop = (window.innerHeight - figureHeight);

    figure2
      .style("height", figureHeight + "px")
      .style("top", figureMarginTop + "px");
  }

  function init() {
    scroller2
      .setup({
        step: "#scrolly2 article .step2",
        progress: true,
        offset: 0.5,
      })
      .onStepProgress(handleStepProgress2);

    // setup resize event
    resize2();
    window.addEventListener("resize", resize2);
  }

  // kick things off
  init();  

});

