function table() {

  
  let ourBrush = null,
    selectableElements = d3.select(null),
    dispatcher;

  function chart(selector, data) {
    let table = d3.select(selector)
      .append("table")
        .classed("my-table", true);

    let tableHeaders = Object.keys(data[0]);

    table.append('thead').append('tr')
        .selectAll('th')
        .data(tableHeaders).enter().append("th").text(d => d); 

    let rows = table.append("tbody") 
        .selectAll("tr")
        .data(data)
        .enter()
        .append("tr");
    let cells = rows.selectAll("td") 
        .data(d => d3.values(d))
        .enter()
        .append("td")
        .text(d => d);     


    let mouseDown; 
    d3.selectAll("tr")
    .on("mouseover", (d, i, elements) => {
      d3.select(elements[i]).classed("mouseover", true) 
      if (mouseDown) { 
        d3.select(elements[i]).classed("selected", true) 
        let dispatchString = Object.getOwnPropertyNames(dispatcher._)[0]; 
        dispatcher.call(dispatchString, this, table.selectAll(".selected").data());
      }
    })
    .on("mouseup", (d, i, elements) => {
      mouseDown = false 
    })
    .on("mousedown", (d, i, elements) => {
      d3.selectAll(".selected").classed("selected", false) 
      mouseDown = true
      d3.select(elements[i]).classed("selected", true) 
      let dispatchString = Object.getOwnPropertyNames(dispatcher._)[0]; 
      dispatcher.call(dispatchString, this, table.selectAll(".selected").data());
    })
    .on("mouseout", (d, i, elements) => {
      d3.select(elements[i]).classed("mouseover", false) 
    });
    
    return chart;
  }

  chart.selectionDispatcher = function (_) {
    if (!arguments.length) return dispatcher;
    dispatcher = _;
    return chart;
  };

  chart.updateSelection = function (selectedData) {
    if (!arguments.length) return;

    d3.selectAll('tr').classed("selected", d => {
      return selectedData.includes(d)
    });
  };

  return chart;
}