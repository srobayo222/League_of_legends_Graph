var canvas = d3.select("#network"),

width = canvas.attr("width"),

height = canvas.attr("height"),

ctx = canvas.node().getContext("2d"),

r = 15,

x = d3.scaleOrdinal().range([20,width -20]),

color = d3.scaleOrdinal(d3.schemeCategory20),

simulation = d3.forceSimulation()
.force("x", d3.forceX(width/2))
.force("y", d3.forceY(height/2))
.force("collide", d3.forceCollide(r+1))
.force("charge", d3.forceManyBody()
  .strength(-150))
.force("link", d3.forceLink()
  .id(function (d) { return d.Champion; }));

d3.json("docs/Champions.json", function (err, graph) {
  console.log(graph);
  if (err) throw err;

  simulation.nodes(graph.nodes);
  simulation.force("link")
  .links(graph.links);
  simulation.on("tick", update);

  canvas
  .call(d3.drag()
    .container(canvas.node())
    .subject(dragsubject)
    .on("start", dragstarted)
    .on("drag", dragged)
    .on("end", dragended));

  function update() {
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();

    var background = new Image();
    background.src = "assets/galaxy.jpg";
    ctx.drawImage(background,450,0,width,height,0,0,width,height); 

    ctx.globalAlpha = 1.0;
    ctx.strokeStyle = "#fff";
    graph.links.forEach(drawLink);
    ctx.stroke();
    ctx.fillStyle = "#000000";
    ctx.fill();
    ctx.globalAlpha = 1.0;
    graph.nodes.forEach(drawNode);

  }

  function dragsubject() {
    return simulation.find(d3.event.x, d3.event.y);
  }

});

function dragstarted() {
  if (!d3.event.active) simulation.alphaTarget(0.3).restart();
  d3.event.subject.fx = d3.event.subject.x;
  d3.event.subject.fy = d3.event.subject.y;
}

function dragged() {
  d3.event.subject.fx = d3.event.x;
  d3.event.subject.fy = d3.event.y;
}

function dragended() {
  if (!d3.event.active) simulation.alphaTarget(0);
  d3.event.subject.fx = null;
  d3.event.subject.fy = null;
}

function drawNode(d) {
  ctx.beginPath();
  ctx.strokeStyle = color(d.Region);
  ctx.fillStyle = color(d.Region);
  ctx.lineWidth = 2;
  ctx.moveTo(d.x, d.y);
  ctx.arc(d.x, d.y, r, 0, Math.PI*2);
  ctx.stroke();
  ctx.fill();
  ctx.closePath();

  ctx.beginPath();
  var img = new Image();
  img.src = d.Img;
  ctx.save();
  roundedImage(d.x-15,d.y-15,30,30,20);
  ctx.clip();
  ctx.drawImage(img,d.x-15,d.y-15,30,30);
  ctx.restore();
}

function drawLink(l) {
  ctx.beginPath();
  ctx.lineWidth = 1;
  ctx.moveTo(l.source.x, l.source.y);
  ctx.lineTo(l.target.x , l.target.y);
  ctx.stroke();
  ctx.closePath();
}

function roundedImage(x,y,width,height,radius){
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}