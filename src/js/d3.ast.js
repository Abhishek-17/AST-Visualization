var margin = {top: 20, right: 120, bottom: 20, left: 120},
    width = 1200 - margin.right - margin.left,
    height = 1200 - margin.top - margin.bottom;
    
var i = 0,
    duration = 750,
    root;

var tree = d3.layout.tree()
    .size([height, width]);

var diagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.x, d.y]; });

var svg = d3.select("#ast").append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

drawAST = function(ast){
    root = ast;
    root.x0 = height / 2;
    root.y0 = 0;

    function collapse(d) {
        if (d.children) {
          d._children = d.children;
          d._children.forEach(collapse);
          d.children = null;
        }
    }

    function uncollapse(d){
      if(d._children){
        d.children = d._children;
        d._children.forEach(uncollapse);
        d._children = null;
      }
    }

    collapse(root);
    update(root);

    $('body').keypress(function( event ) {
        if ( event.which == 13 ) {
           event.preventDefault();
        }
        
        if(event.keyCode == 101){
          uncollapse(root);
        }
        else if(event.keyCode == 99){
          collapse(root);
        }
        update(root);
    });
}

d3.select(self.frameElement).style("height", "800px");

function update(source) {

  var levelWidth = [1];
  var childCount = function(level, n) {

    if(n.children && n.children.length > 0) {
      if(levelWidth.length <= level + 1) levelWidth.push(0);

      levelWidth[level+1] += n.children.length;
      n.children.forEach(function(d) {
        childCount(level + 1, d);
      });
    }
  };
  childCount(0, source);  
  var newHeight = d3.max(levelWidth) * 200;
  tree = tree.size([width, newHeight]);

  // Compute the new tree layout.
  var nodes = tree.nodes(root).reverse(),
      links = tree.links(nodes);

  // Normalize for fixed-depth.
  nodes.forEach(function(d) { d.y = d.depth * 100; });

  // Update the nodes…
  var node = svg.selectAll("g.node")
      .data(nodes, function(d) { return d.id || (d.id = ++i); });

  // Enter any new nodes at the parent's previous position.
  var nodeEnter = node.enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + source.x0 + "," + source.y0 + ")"; })
      .on("click", click);

  nodeEnter.append("circle")
      .attr("r", 1e-6)
      .attr('class', function(d) { return d.class; })
      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

  // Node Value
  nodeEnter.append("text")
      .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
      .attr("dy", ".35em")
      .attr("dx", function(d) { return d.children || d._children ? 15 : -15; })
      .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
      .text(function(d) { return d.label; })
      .style("fill-opacity", 1);

  // Environment Value
  nodeEnter.append("text")
      .attr("x", function(d) { return 20; })
      .attr('class', 'env')
      .style("font-weight","bold")
      .style('font-size', '15px')
      .text(function(d) { 
        if (d.env === null)
          return "";
        return JSON.stringify(d.env);
      })
      .style("fill-opacity", 1);

  // Evaluated Value
  nodeEnter.append("text")
      .attr("x", function(d) { return 20; })
      .attr("y", function(d) { return 20; })
      .attr('class', 'eval')
      .style("font-weight","bold")
      .style('font-size', '15px')
      .text(function(d) {
        if(d.eval == null)
          return "";
        return d.eval;
      })
      .style("fill-opacity", 1);

  // Transition nodes to their new position.
  var nodeUpdate = node.transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

  nodeUpdate.select("circle")
      .attr("r", 15)
      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

  nodeUpdate.select("text")
      .style("fill-opacity", 1);

  // Transition exiting nodes to the parent's new position.
  var nodeExit = node.exit().transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + source.x + "," + source.y + ")"; })
      .remove();

  nodeExit.select("circle")
      .attr("r", 1e-6);

  nodeExit.select("text")
      .style("fill-opacity", 1e-6);

  // Update the links…
  var link = svg.selectAll("path.link")
      .data(links, function(d) { return d.target.id; });

  // Enter any new links at the parent's previous position.
  link.enter().insert("path", "g")
      .attr("class", "link")
      .attr("d", function(d) {
        var o = {x: source.x0, y: source.y0};
        return diagonal({source: o, target: o});
      });

  // Transition links to their new position.
  link.transition()
      .duration(duration)
      .attr("d", diagonal);

  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
      .duration(duration)
      .attr("d", function(d) {
        var o = {x: source.x, y: source.y};
        return diagonal({source: o, target: o});
      })
      .remove();

  // Stash the old positions for transition.
  nodes.forEach(function(d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });
}

// Toggle children on click.
function click(d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
  update(d);
}
