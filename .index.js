// code based on Eleftheria Batsou's code
const height = 500;
const width = 1000;
const margin = {
  left: 120, right: 20, top: 20, bottom: 70
};
const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json";
const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const color = ["#ef5350","#EC407A","#AB47BC","#7E57C2","#5C6BC0","#42A5F5","#26C6DA","#26A69A","#D4E157","#FFEE58","#FFA726"];


    const canvas = d3.select("svg").attr({
      height: height + margin.top + margin.bottom,
      width: width + margin.left + margin.right
    });

    let group = canvas.append("g").attr({
      transform: "translate(" + margin.left + "," + margin.top + ")"
    });

    let div = d3.select(".tooltip");
    let xScale = d3.time.scale().range([0, width]);
    let yScale = d3.scale.ordinal().domain(months).rangeBands([0, height]);
    let colorScale = d3.scale.quantize().range(color);

// call JSON with URL and function
d3.json(url, (data) => {
  data = data.monthlyVariance;
  data.map((d) => { // map the data
    d.month = months[d.month - 1];
    d.year = d3.time.format("%Y").parse(d.year.toString());
  })

  // Declare the xScale
  xScale.domain(d3.extent(data, (data) => data.year));
  // Scale the colours
  colorScale.domain(d3.extent(data, (d) => d.variance));

  const barWidth = width / (data.length / 12)
  const barHeight = height / 12;

  //scale the AXIS and set orientation
  const xAxis = d3.svg.axis().scale(xScale).orient("bottom");
  const yAxis = d3.svg.axis().scale(yScale).orient("left").ticks(12);

  group.append("g").attr({
    class: "xAxis",
    transform: `translate(0,${height})`
  }).call(xAxis);

  group.append("g").attr({
    class: "yAxis",
    transform: "translate(0,0)",
  }).call(yAxis);

  group.selectAll("g").data(data).enter().append("g").attr({
    transform: (data) => `translate(${xScale(data.year)},${yScale(data.month)})`
  }).append("rect").attr({
    width: barWidth,
    height: yScale.rangeBand()
  }).style({ // Does scale the colours
    fill(data) {
      return colorScale(data.variance);
    }
  }).on("mouseover", (d) => {
    // the tooltip follow the mouse
    div.transition().duration(10).style("opacity", 0.8).style({
      left: `${d3.event.pageX}px`,
      top: `${d3.event.pageY}px`
    });

    // Appear and disappear the tooltip when mouse hover
    // 8.66 standard value
    div.html(`<p>Year: ${d3.time.format(`%Y`)(d.year)}</p><p> Value: ` + 
    (8.66 + d.variance).toFixed(2)  + `</p><p>Month: ` + d.month + `</p>`);
  }).on(`mouseout`, (d) => {
    div.transition().duration(100).style("opacity", 0);
  })

});
