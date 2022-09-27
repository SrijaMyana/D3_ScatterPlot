; (function () {

	var margin = { top: 10, right: 10, bottom: 100, left: 50 };
	var width = 400;
	var height = 300;

	var dataXRange = { min: 40, max: 100 };
	var dataYRange = { min: 0, max: 100 };
	var xAxisLabelHeader = "X Header";
	var yAxisLabelHeader = "Y Header";
	var circleRadius = 4;


	var data;
	var chart;
	var chartWidth;
	var chartHeight;

	init();

	function init() {

		console.log("initiating!")

		chartWidth = width - margin.left - margin.right;
		chartHeight = height - margin.top - margin.bottom;

		d3.json("./data/MOCK_DATA.json").then(function (json) {

			data = json;
			console.log("JSON loaded");
			initializeChart();
			createAxes();

		}).catch(function (error) { console.warn(error) })

	}

	function initializeChart() {
		chart = d3.select("#chartDiv").append("svg")
			.attr("width", width)
			.attr("height", height);

		chart.plotArea = chart.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
	}

	function createAxes() {

		chart.xScale = d3.scaleLinear()
			.domain([d3.min(data.xVal), d3.max(data.yVal)])
			.range([0, chartWidth]);

		chart.xAxis = d3.axisBottom()
			.tickSizeOuter(0)
			.scale(chart.xScale);

		// chart.xAxisContainer = chart.append("g")
		// 	.attr("class", "x axis scatter-xaxis")
		// 	.attr("transform", "translate(" + (margin.left) + ", " + (chartHeight + margin.top) + ")")
		// 	.call(chart.xAxis);

		chart.append("text")
			.attr("class", "x axis scatter-xaxis")
			.style("font-size", "12px")
			.attr("text-anchor", "middle")
			.attr("transform", "translate(" + (margin.left + chartWidth / 2.0) + ", " + (chartHeight + (margin.bottom / 2.0)) + ")")
			.text(xAxisLabelHeader);

		chart.yScale = d3.scaleLinear()
			.domain([0, 100])
			.range([chartHeight, 0]);

		chart.yAxis = d3.axisLeft()
			.scale(chart.yScale);

		// chart.yAxisContainer = chart.append("g")
		// 	.attr("class", "y axis scatter-yaxis")
		// 	.attr("transform", "translate(" + margin.left + ", " + margin.top + ")")
		// 	.call(chart.yAxis);

		chart.append('text')
			.style("font-size", "12px")
			.attr("class", "heatmap-yaxis")
			.attr("text-anchor", "middle")
			.attr("transform", "translate(" + (margin.left / 2.0) + ", " + (chartHeight / 2.0) + ") rotate(-90)")
			.text(yAxisLabelHeader);

    }


})();