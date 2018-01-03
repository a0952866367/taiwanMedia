function createNewBubbleChart(selector , data){
    var width = 1000,
    height = 700,
    padding = 2, // separation between same-color nodes
    clusterPadding = 20, // separation between different-color nodes
    maxRadius = 12;

    var color = d3.scale.ordinal()
        .range(["#F8BBD0","#96E7F2","#00BCD4","#0B4F7C"]);

    var cs = [];
    var data_length = Object.keys(data).length
    for( var i=0 ; i <data_length ; i++ ){
        if( data[i].media_name in cs ){
            //cs.push(data[i].media_name)
        }
        else{
            cs.push(data[i].media_name)
        }   
    }

    var n = data.length, // total number of nodes
        m = cs.length; // number of distinct clusters

    var cts_num = 0;
    var cna_num = 0;
    var udn_num = 0;
    var setn_num = 0;
    for(var i=0 ; i<data.length ; i++){
        if( data[i].media_name == "cna" )
            cna_num += 1;
        if( data[i].media_name == "cts" )
            cts_num += 1;
        if( data[i].media_name == "udn" )
            udn_num += 1;
        if( data[i].media_name == "setn" )
            setn_num += 1;
    }

    var category_list = {
        "華視新聞":0,
        "中央通訊社":cts_num,
        "聯合報":cts_num+cna_num,
        "三立新聞":cts_num+cna_num+udn_num
    }

    //create clusters and nodes
    var clusters = new Array(m);
    var nodes = [];
    for (var i = 0; i<n; i++){
        nodes.push(create_nodes(data,i));
    }

    var force = d3.layout.force()
        .nodes(nodes)
        .size([width, height])
        .gravity(.01)
        .charge(0)
        .on("tick", tick)
        .start();

    var bubbleSvg = d3.select(selector).append("svg")
        .attr("width", width)
        .attr("height", height);

    var tooltip = d3.select(selector).append("bubbleSvg")
        .style("position", "absolute")
        .style("z-index", "100")
        .style("visibility", "hidden")
        .style("color", "black")
        .style("padding", "8px")
        .style("background-color", "rgba(204, 204, 204, 1)")
        .style("border-radius", "6px")
        .style("font", "12px sans-serif")
        .text("tooltip");

    var node = bubbleSvg.selectAll("circle")
        .data(nodes)
        .enter().append("g").call(force.drag)

    node.append("circle")
        .style("fill", function (d) {
            return color(d.cluster);
        })
        .attr("r", function(d){return d.radius})
        .on("mouseover", function(d) {
            tooltip.html( "<span style='font-size:15px'>" + Object.keys(category_list)[Object.values(category_list).indexOf(d.cluster)] + "</span>" + "<br/>" + d.text + " : " + d.radius*2 +"則");
            tooltip.style("visibility", "visible");
        })
        .on("mousemove", function() {
          return tooltip.style("top", (d3.event.pageY-450)+"px").style("left",(d3.event.pageX-150)+"px");
        })
        .on("mouseout", function(){return tooltip.style("visibility", "hidden");});

    node.append("text")
          .attr("dy", function(d){
            return d.radius * 0.01 + "em"
          })
          .style("text-anchor", "middle")
          .style('fill', function(d) {
                if(d.cluster < cna_num+cts_num)
                    return "#000000";
                else
                    return "#FFFFFF";
            })
          .style('pointer-events',"none")
          .text(function(d) { 
            if (d.radius>15)
                return d.text; 
            else
                return "";
            })
          .style("font-size", function(d) { return Math.min(2 * d.radius, (2 * d.radius - 8) / this.getComputedTextLength() * 13) + "px"; });

    function create_nodes(data,node_counter) {
      var i = cs.indexOf(data[node_counter].media_name),
          r = Math.sqrt((i + 1) / m * -Math.log(Math.random())) * maxRadius,
          d = {
            cluster: i,
            radius: data[node_counter].size*0.5,
            text: data[node_counter].category,
            x: Math.cos(i / m * 2 * Math.PI) * 200 + width / 2 + Math.random(),
            y: Math.sin(i / m * 2 * Math.PI) * 200 + height / 2 + Math.random()
          };
      if (!clusters[i] || (r > clusters[i].radius)) clusters[i] = d;
      return d;
    };

    function tick(e) {
        node.each(cluster(10 * e.alpha * e.alpha))
            .each(collide(.5))
        .attr("transform", function (d) {
            var k = "translate(" + d.x + "," + d.y + ")";
            return k;
        })
    }

    // Move d to be adjacent to the cluster node.
    function cluster(alpha) {
        return function (d) {
            var cluster = clusters[d.cluster];
            if (cluster === d) return;
            var x = d.x - cluster.x,
                y = d.y - cluster.y,
                l = Math.sqrt(x * x + y * y),
                r = d.radius + cluster.radius;
            if (l != r) {
                l = (l - r) / l * alpha;
                d.x -= x *= l;
                d.y -= y *= l;
                cluster.x += x;
                cluster.y += y;
            }
        };
    }

    // Resolves collisions between d and all other circles.
    function collide(alpha) {
        var quadtree = d3.geom.quadtree(nodes);
        return function (d) {
            var r = d.radius + maxRadius + Math.max(padding, clusterPadding),
                nx1 = d.x - r,
                nx2 = d.x + r,
                ny1 = d.y - r,
                ny2 = d.y + r;
            quadtree.visit(function (quad, x1, y1, x2, y2) {
                if (quad.point && (quad.point !== d)) {
                    var x = d.x - quad.point.x,
                        y = d.y - quad.point.y,
                        l = Math.sqrt(x * x + y * y),
                        r = d.radius + quad.point.radius + (d.cluster === quad.point.cluster ? padding : clusterPadding);
                    if (l < r) {
                        l = (l - r) / l * alpha;
                        d.x -= x *= l;
                        d.y -= y *= l;
                        quad.point.x += x;
                        quad.point.y += y;
                    }
                }
                return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
            });
        };
    }
}