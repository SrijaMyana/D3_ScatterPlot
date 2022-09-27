//SRIJA MYANA

;(function() {

	var margin = { top: 1000, right: 1000, bottom: 1000, left: 5000 };
	var width = 1200;
	var height = 600;

	var dataXRange = { min: 40, max: 550 };
	var dataYRange = { min: 0, max: 100 };
	var xAxisLabelHeader = "X Header";
	var yAxisLabelHeader = "Y Header";
	var circleRadius = 4;

	var data;
	var chart;
	var chartWidth;
	var chartHeight;

	init();

	var theData = {};


  // TIMER

    var tick = 0

    function visualizeTicks(scale, tickArguments) {
	  const height = 20, m = width > 599 ? 90 : 10;

	  if (tickArguments === undefined) tickArguments = [];

	  scale.range([m, width - m]);

	  const svg = d3.create("svg")
	    .attr("width", width)
	    .attr("height", height);

	  svg.append("g").call(d3.axisBottom(scale).ticks(...tickArguments));

	  return svg.node();
	}

  	function timerCallback(elapsed) {
    	// console.log('tick ' + elapsed);
    	//console.log('timer lo first data'+data);
    	if (elapsed > 60000) {
        	tick++;
        	if(tick*(elapsed/1000) > data.xVal){
	        	// theData.push(data);
	        	onGeneratedRow(data);
	        	console.log('if data '+data);
	        	console.log('if the data '+theData);
        	}
        	timer.restart(timerCallback, data);
    	}
    }

	function onGeneratedRow(columnsResult) {
    	var jsonData = {};
    	columnsResult.forEach(function(column) {
        	var columnName = column.metadata.colName;
        	jsonData[columnName] = column.value;
    	});
    	theData.push(jsonData);
 	}

	function init() {

		console.log("initiating!")

		chartWidth = width - margin.left - margin.right;
		chartHeight = height - margin.top - margin.bottom;

		const scale = d3.scaleTime();
	do {
		const t = Date.now();
		scale.domain([t - 1 * 1 * 1 * 1000, t + 1 * 1 * 1 * 1000]);
		yield visualizeTicks(scale);
	} while (!stop);

		// load data from json
		d3.json("./data/stream_1.json").then(function(json){

			data = json;
			console.log("Stream 1 JSON loaded");
			//initializeChart();
			//createAxes();

			//drawDots();

			// hint HERE!
			// you could load more data here using d3.json() again...
			d3.json("./data/stream_2.json").then(function(json){

				data = json;
				console.log("Stream 2 JSON loaded");
				//drawSquares();
			})

		}).catch(function(error) {console.warn(error)})

	}//end init

	function initializeChart() {
		chart = d3.select("#chartDiv").append("svg")
			.attr("width", width)
			.attr("height", height);

		chart.plotArea = chart.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	}

	function createAxes() {
		
		// x axis
		chart.xScale = d3.scaleLinear()
			.domain([dataXRange.min, dataXRange.max])
			.range([0, chartWidth]);

		chart.xAxis = d3.axisBottom()
			.tickSizeOuter(0)
			.scale(chart.xScale);

		chart.xAxisContainer = chart.append("g")
			.attr("class", "x axis scatter-xaxis")
			.attr("transform", "translate(" + (margin.left) + ", " + (chartHeight + margin.top) + ")")
			.call(chart.xAxis);

		// x axis header label
		chart.append("text")
			.attr("class", "x axis scatter-xaxis")
			.style("font-size", "12px")
			.attr("text-anchor", "middle")
			.attr("transform", "translate(" + (margin.left + chartWidth / 2.0) + ", " + (chartHeight + (margin.bottom / 2.0)) + ")")
			.text(xAxisLabelHeader);

		// y axis labels
		chart.yScale = d3.scaleLinear()
			.domain([dataYRange.min, dataYRange.max])
			.range([chartHeight, 0]);

		chart.yAxis = d3.axisLeft()
			.scale(chart.yScale);

		chart.yAxisContainer = chart.append("g")
			.attr("class", "y axis scatter-yaxis")
			.attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
			.call(chart.yAxis);

		// y axis header label
		chart.append('text')
			.style("font-size", "12px")
			.attr("class", "heatmap-yaxis")
			.attr("text-anchor", "middle")
			.attr("transform", "translate(" + (margin.left / 2.0) + ", " + (chartHeight / 2.0) + ") rotate(-90)")
			.text(yAxisLabelHeader);
	}

	function drawDots() {
		// do something with the data here!

		var dots = chart.plotArea.selectAll('.dot')
        .data(data, function (d, i) { return "id_" + d})
        timer = d3.timer(timerCallback)
		// plot dots
		dots.enter().append("circle")
				.attr("class", "dot")
				.attr("cx", function(d, i) { return chart.xScale(d.xVal); })
				.attr("cy", function(d, i) { return chart.yScale(d.yVal); })
				.attr("r", circleRadius)
				.attr("fill", "blue")
				.merge(dots) // update + merge
         		.transition()
          		.delay(1000)
          		.duration(900)
          		.style('fill', "blue")
          		// .attr('cx', function (d, i) { return chart.xScale(d.xVal); })
          		// .attr("cy", function (d, i) { return chart.yScale(d.yVal); });
				
		dots.on("click", function(d) {
					var clicked_x = d3.select(this).attr("cx");
					d3.selectAll("rect[x='"+clicked_x+"']") 
						.style('fill', 'yellow');
				})
				.on('mouseover', function (d) {
          			d3.select(this).transition()
               		.attr('fill', 'red');
               	})
     			.on('mouseout', function (d) {
          			d3.select(this).transition()
               		.attr('fill', 'blue');
               	})
	};

	var timer;

	function drawSquares() {
		var squares = chart.plotArea.selectAll(".rect")
			.data(data)
			.enter().append("rect")
				.attr("class", "rect")
				.attr("x", function(d) { return chart.xScale(d.xVal); })
				.attr("y", function(d) { return chart.yScale(d.yVal); })
				.attr("width", 8)
				.attr("height", 8)
				.attr("fill", "green")
				.on("click", function(d) {
					var clicked_x = d3.select(this).attr("x");
					d3.selectAll("circle[cx='"+clicked_x+"']") 
						.style('fill', 'yellow');
				})
				.on('mouseover', function (d) {
          			d3.select(this).transition()
               		.attr('fill', 'red');
               	})
     			.on('mouseout', function (d) {
          			d3.select(this).transition()
               		.attr('fill', 'green');
               	})
	}

})();
//SRIJA MYANA