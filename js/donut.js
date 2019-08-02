var CHART_DATA;
var text = "";
var CHART_WIDTH = 450;
var CHART_HEIGHT = 450;
var DONUT_THICKNESS = 100;
var radius = Math.min(CHART_WIDTH, CHART_HEIGHT) / 2;
var color = d3.schemeCategory10;

var YEARS_LIST = [2005, 2010, 2014];

function loadData() {
  d3.json('data/by-category-and-continent.json', function(data) {
    return renderCharts(data);
  });

}

function renderCharts(data) {
  CHART_DATA = data;
  YEARS_LIST.forEach(function(year) {
    plot_donut_chart(year, "category");
    plot_donut_chart(year, "continent");
  });
}

function plot_donut_chart(year, type) {
  var svg_donut = d3.select("#menu-" + year + " #by-" + type)
    .append('svg')
    .attr('class', 'pie')
    .attr('width', CHART_WIDTH)
    .attr('height', CHART_HEIGHT);
    
  var g_donut = svg_donut.append('g')
    .attr('transform', 'translate(' + (CHART_WIDTH/2) + ',' + (CHART_HEIGHT/2) + ')');
 
  var arc = d3.arc()
    .innerRadius(radius - DONUT_THICKNESS)
    .outerRadius(radius);
  
  var pie = d3.pie()
    .value(function(d) { return d.value; })
    .sort(null);
   
  var path = g_donut.selectAll('path')
    .data(pie(CHART_DATA["by-" + type +  "-" + year]))
    .enter()
    .append("g")
    .on("mouseover", function(d) {
      var g = d3.select(this)
          .style("cursor", "pointer")
          .style("fill", "black")
          .append("g")
          .attr("class", "text-group");

      g.append("text")
          .attr("class", "name-text")
          .text(`${d.data.name}`)
          .attr('text-anchor', 'middle')
          .attr('dy', '-1.2em');

      g.append("text")
          .attr("class", "value-text")
          .text(`${d.data.value}`)
          .attr('text-anchor', 'middle')
          .attr('dy', '.6em'); 
    })
    .on("mouseout", function(d) {
        d3.select(this)
          .style("cursor", "none")  
          .style("fill", color[this._current])
          .select(".text-group").remove();
    })
    .append('path')
    .attr('d', arc)
    .attr('fill', (d,i) => color[i])
    .on("mouseover", function(d) {
        d3.select(this)     
          .style("cursor", "pointer")
          .style("opacity", "0.50")
          .style("fill", "black");
    })
    .on("mouseout", function(d) {
        d3.select(this)
          .style("cursor", "none")  
          .style("opacity", "1")
          .style("fill", color[this._current]);
    });
    
    g_donut.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '.35em')
      .text(text); 
}

loadData();