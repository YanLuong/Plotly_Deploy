function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
    var sampleData = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var sampleSelected = sampleData.filter(sampleNum => sampleNum.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var result = sampleSelected[0];
    console.log(result)

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var sampleValuesArray = result.sample_values;
    var otuIdsArray = result.otu_ids;
    var otu_label =  result.otu_labels;

    console.log(otuIdsArray);

   sliced10Ids = otuIdsArray.slice(0, 10);
   sliced10Values = sampleValuesArray.slice(0, 10);
   sliced10OtuLabel = otu_label.slice(0,10)
   console.log("sliced",sliced10Ids, sliced10Values, sliced10OtuLabel);

   reversedIds = sliced10Ids.reverse();
   reversedValues = sliced10Values.reverse(); 
   reversedLabel = sliced10OtuLabel.reverse();
   
   console.log(reversedIds, reversedValues);

    var sortedValues = reversedValues.sort((a, b) => a - b);
    //var sortedIds = reversedIds.sort((a, b) => a - b);
    //console.log("sorted ids",sortedIds);

    var xValues = sortedValues;
    var yValues = reversedIds;

  //     console.log(yValues.toString());
  
    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    var yticks = yValues.map(tick => `OTU ${tick}`);
    // var yticks = yValues.map(element=> {return element.toString()});
    console.log(yticks);


    var trace = {
      x: xValues,
      y: yticks,
      type: "bar",
      orientation: "h"
      };
     
    // 8. Create the trace for the bar chart. 
    var barData = [trace];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
     title: "Top 10 Bacteria Cultures Found"  
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);
  });
}
