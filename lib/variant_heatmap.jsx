"use strict";
var d3 = require("d3");
var React = require("react");
var _ = require("underscore");

var HEIGHT = 600;
var MAX_COL = 11;
var MAX_ROWS = 40;

module.exports = React.createClass({
	propTypes: {
		data: React.PropTypes.array.isRequired
	},

	getInitialState: function () {
		return {
			DOMWidth: 600,
			DOMHeight: 400
		};
	},

	render: function () {
		return (<div className="variant-heatmap" style={{ height: "100%" }}>
			<canvas ref="canvas" width={this.state.DOMWidth} height={this.state.DOMHeight} />
		</div>);
	},

	componentDidMount: function () {
		this._calculateWidth();
	},

	componentDidUpdate: function () {
		this._renderCanvas();
	},

	_calculateWidth: function () {
		var rect = this.getDOMNode().getBoundingClientRect();
		this.setState({
			DOMWidth: rect.width,
			DOMHeight: rect.height
		});
	},

	_getXScale: function () {
		return d3.scale.linear()
			.domain([0, MAX_COL])
			.range([0, this.state.DOMWidth]);
	},

	_getYScale: function () {
		return d3.scale.linear()
			.domain([0, MAX_ROWS])
			.range([0, HEIGHT]);
	},

	_getCScale: function () {
		return d3.scale.linear()
			.domain([0, 1])
			.range(["blue", "white"]);
	},

	_renderCanvas: function () {
		var xScale = this._getXScale();
		var yScale = this._getYScale();
		var cScale = this._getCScale();
		var nodeWidth = this.state.DOMWidth / MAX_COL;
		var nodeHeight = HEIGHT / MAX_ROWS;
		var nodeSide = Math.min(nodeWidth, nodeHeight);

		// get canvas context and clear
		var ctx = this.refs.canvas.getDOMNode().getContext("2d");
		ctx.clearRect(0, 0, this.state.DOMWidth, HEIGHT);

		// TEMP chop data
		var chopped = this.props.data.slice(0, MAX_ROWS);
		chopped.forEach( (j, i) => {
			var y = yScale(i);
			j.variationData.forEach( (k, i) => {
				var x = i * nodeSide;
				var color = cScale(k);
				ctx.fillStyle = color;
				ctx.fillRect(x, y, nodeSide, nodeSide);
			});
		});
	}
});
