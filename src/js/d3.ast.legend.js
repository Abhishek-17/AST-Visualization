function drawLegend() {

    var colors = {
      "id": "#FF6565",
      "op": "#000262",
      "bool": "#FA4352",
      "number": "#55FF34",
      "prim-app": "#ABCDF1",
      "if-then-else": "#614253",
      "id-ast-bind": "#548734",
      "id-binds": "#967582",
      "assume": "#DD4782",
      "Expandable": "lightsteelblue",
      "Expanded": "#FFFFFF"
    };

    var li = {
        w: 75, h: 30, s: 3, r: 3
    };

    var legend = d3.select("#legend").append("svg:svg")
        .attr("width", li.w)
        .attr("height", d3.keys(colors).length * (li.h + li.s));

    var g = legend.selectAll("g")
        .data(d3.entries(colors))
        .enter().append("svg:g")
        .attr("transform", function(d, i) {
                        return "translate(0," + i * (li.h + li.s) + ")";
                     });

    g.append("svg:rect")
        .attr("rx", li.r)
        .attr("ry", li.r)
        .attr("width", li.w)
        .attr("height", li.h)
        .style("fill", function(d) { return d.value; });

    g.append("svg:text")
        .attr("x", li.w / 2)
        .attr("y", li.h / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", "middle")
        .text(function(d) { return d.key; });
}

drawLegend();
