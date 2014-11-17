"use strict";
var d3 = require("d3");
var React = require("react");
var _ = require("underscore");

var NODE_SIZE = 15;
var CANVAS_SIZE = 8000;
var LABEL_WIDTH = 100;

module.exports = React.createClass({
	propTypes: {
		data: React.PropTypes.array.isRequired,
		onClick: React.PropTypes.func
	},

	getInitialState: function () {
		return {
			DOMWidth: 400,
			DOMHeight: 400,
			canvasScrollY: 0,
			onClick: null
		};
	},

	render: function () {
		var _scrollZoneSize = this.props.data.length * NODE_SIZE;
		var _canvasY = this._getCanvasY();

		var overlayNode = this._getOverlayNode();
		return (<div style={{ height: "100%", position: "relative"}}>
			<div style={{ height: 100 }}></div>
			<div ref="outerScroll" className="variant-heatmap" style={{ height: "100%", overflowY: "scroll", position: "relative" }}>
				<div style={{ position: "relative", height: _scrollZoneSize }}>
					<canvas ref="canvas" width={this.state.DOMWidth} height={CANVAS_SIZE} style={{ position: "absolute", top: _canvasY }}/>
					{overlayNode}
				</div>
			</div>
		</div>);
	},

	componentDidMount: function () {
		this._calculateWidth();
		this.refs.outerScroll.getDOMNode().onscroll = _.throttle(this._checkScroll, 100);
	},

	_getOverlayNode: function () {
		var chunkedData = this._getChunkedData();
		var rectNodes = _.map(chunkedData, (d, i) => {
			var _onClick;
			if (this.props.onClick) _onClick = (e) => { this.props.onClick(d); };
			var _transform = `translate(0, ${i * NODE_SIZE})`;
			return (<g key={"heatmapOverlay" + i} transform={_transform}>
				<text dy={13} fontSize={14}>{d.name}</text>
				<rect width={this.state.DOMWidth} height={NODE_SIZE} x={0} y={0} opacity={0} stroke="none" onClick={_onClick}/>
			</g>);
		});

		var _canvasY = this._getCanvasY();
		return (<svg ref="svg" style={{ position: "absolute", top: _canvasY, width: this.state.DOMWidth, height: CANVAS_SIZE }}>
			{rectNodes}
		</svg>);
	},

	// check to see if the scroll y needs to be redrawn
	_checkScroll: function () {
		var scrollTop = this.refs.outerScroll.getDOMNode().scrollTop;
		var scrollDelta = Math.abs(scrollTop - this.state.canvasScrollY)
		if (scrollDelta > CANVAS_SIZE / 4) {
			this.setState({ canvasScrollY: scrollTop });
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

	_getChunkedData: function () {
		var _canvasY = this._getCanvasY();
		var _nodesPerCanvas = Math.round(CANVAS_SIZE / NODE_SIZE)
		var _dataStartIndex = Math.round(this._getYScale().invert(_canvasY));
		return this.props.data.slice(_dataStartIndex, _dataStartIndex + _nodesPerCanvas);
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
		var chunkOfData = this._getChunkedData();

		chunkOfData.forEach( (d, i) => {
			d.variationData.forEach( (_d, _i) => {
				// get color and draw rect
				ctx.fillStyle = colorScale(_d);
				ctx.fillRect(_i * NODE_SIZE + LABEL_WIDTH, i * NODE_SIZE, NODE_SIZE, NODE_SIZE);
			});
		});
	}
});
