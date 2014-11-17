"use strict";
var d3 = require("d3");
var React = require("react");
var _ = require("underscore");

var NODE_SIZE = 15;
var CANVAS_SIZE = 8000;

module.exports = React.createClass({
	propTypes: {
		data: React.PropTypes.array.isRequired
	},

	getInitialState: function () {
		return {
			DOMWidth: 400,
			DOMHeight: 400,
			canvasScrollY: 0
		};
	},

	render: function () {
		var _scrollZoneSize = this.props.data.length * NODE_SIZE;
		var _canvasY = this._getCanvasY();
		return (<div className="variant-heatmap" style={{ position: "relative" }}>
			<canvas ref="canvas" width={this.state.DOMWidth} height={CANVAS_SIZE} style={{ position: "absolute", top: _canvasY }}/>
			<div ref="scroller" className="scroll-mask-container" style={{ height: "100%", overflow: "scroll" }} >
				<div className="scroll-mask-scroller" style={{ height: _scrollZoneSize, overflow: "scroll" }}></div>
			</div>
		</div>);
	},

	componentDidMount: function () {
		this._calculateWidth();
		window.onscroll = _.throttle(this.onScroll, 250);
	},

	onScroll: function () {
		this._checkScroll();
	},

	// check to see if the scroll y needs to be redrawn
	_checkScroll: function () {
		var scrollDelta = Math.abs(window.scrollY - this.state.canvasScrollY)
		if (scrollDelta > CANVAS_SIZE / 4) {
			this.setState({ canvasScrollY: window.scrollY });
		}
	},

	componentDidUpdate: function () {
		this._renderCanvas();
	},

	_calculateWidth: function () {
		var _clientRect = this.getDOMNode().getBoundingClientRect();
		this.setState({
			DOMWidth: _clientRect.width,
			DOMHeight: _clientRect.height
		});
	},

	_getXScale: function () {
		var maxColWidth = 11; // TEMP
		return d3.scale.linear()
			.domain([0, maxColWidth])
			.range([0, this.state.DOMWidth]);
	},

	_getYScale: function () {
		var _totalY = this.props.data.length * NODE_SIZE;
		return d3.scale.linear()
			.domain([0, this.props.data.length])
			.range([0, _totalY]);
	},

	_getCanvasY: function () {
		return Math.max(0, this.state.canvasScrollY - CANVAS_SIZE / 2);
	},

	_renderCanvas: function () {
		// get canvas context and clear
		var ctx = this.refs.canvas.getDOMNode().getContext("2d");
		ctx.clearRect(0, 0, this.state.DOMWidth, this.state.DOMHeight);

		// render rows of features with strain variation in each column
		var colorScale = d3.scale.linear()
			.domain([0, 1])
			.range(["blue", "white"]);

		// get data that fits into canvas
		var _canvasY = this._getCanvasY();
		var _nodesPerCanvas = Math.round(CANVAS_SIZE / NODE_SIZE)
		var _dataStartIndex = Math.round(this._getYScale().invert(_canvasY));
		var chunkOfData = this.props.data.slice(_dataStartIndex, _dataStartIndex + _nodesPerCanvas);

		chunkOfData.forEach( (d, i) => {
			d.variationData.forEach( (_d, _i) => {
				// get color and draw rect
				ctx.fillStyle = colorScale(_d);
				ctx.fillRect(_i * NODE_SIZE, i * NODE_SIZE, NODE_SIZE, NODE_SIZE);
			});
		});
	}
});
