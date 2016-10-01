function displayData(){
  var url = 'https://raw.githubusercontent.com/DealPete/forceDirected/master/countries.json';
  var width = window.innerWidth;
  var height = window.innerHeight - 100;
  var flagSize = 20;
  var tooltip = d3.select('#name');
  var distance = 2;

  var svg = d3.select('svg')
    .attr('width', width)
    .attr('height', height);

  var simulation = d3.forceSimulation()
    .force('link', d3.forceLink().id(function(d){ return d.index; }))
    .force('charge', d3.forceManyBody())
    .force('center', d3.forceCenter(width / 2, height / 2));

  d3.json(url, function(error, graph){

    var link = svg.append('g')
      .attr('class', 'link')
      .selectAll('line')
      .data(graph.links)
      .enter().append('line')
      .attr("stroke-width", function(d) { return 1; })

    var node = svg.append('g')
      .selectAll('image')
      .data(graph.nodes)
      .enter().append('image')
      .attr("xlink:href", function(d) { return './imgs/' + d.code + '.png';})
      .attr("height", flagSize)
      .attr("width", flagSize)
      .on("mouseover", function(d) {
        tooltip.style("display", "inline");
        tooltip.html(d.country)
          .style("left", d3.event.pageX + "px")
          .style("top", (d3.event.pageY - flagSize * 1.5) + "px");
      })
      .on("mouseout", function(d){ tooltip.style("display", "none"); })
      .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    simulation
      .nodes(graph.nodes)
      .on('tick', ticked);
    simulation.force("link")
      .links(graph.links);

    function ticked() {
      link
          .attr("x1", function(d) { return d.source.x; })
          .attr("y1", function(d) { return d.source.y; })
          .attr("x2", function(d) { return d.target.x; })
          .attr("y2", function(d) { return d.target.y; });
      node
          .attr("cx", function(d) { return d.x; })
          .attr("cy", function(d) { return d.y; })
          .attr("x", function(d) { return d.x - flagSize / 2; })
          .attr("y", function(d) { return d.y - flagSize / 2; });
    }
  });

  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
}

displayData();