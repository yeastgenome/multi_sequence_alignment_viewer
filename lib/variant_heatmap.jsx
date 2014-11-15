"use strict";
var d3 = require("d3");
var React = require("react");
var _ = require("underscore");

var NODE_SIZE = 15;
var SCROLL_ZONE_SIZE = 80000;

module.exports = React.createClass({
	propTypes: {
		data: React.PropTypes.array.isRequired
	},

	getInitialState: function () {
		return {
			DOMWidth: 400,
			DOMHeight: 400,
			scrollY: 0
		};
	},

	render: function () {
		return (<div className="variant-heatmap" style={{ position: "relative" }}>
			<canvas ref="canvas" width={this.state.DOMWidth} height={this.state.DOMHeight} style={{ position: "absolute", top: 0 }}/>
			<div ref="scroller" className="scroll-mask-container" style={{ height: "100%", overflow: "scroll" }} >
				<div className="scroll-mask-scroller" style={{ height: 8000, overflow: "scroll" }}></div>
			</div>
		</div>);
	},

	componentDidMount: function () {
		this._calculateWidth();

		window.onscroll = _.throttle(this.onScroll, 250);
			
	},

	onScroll: function () {
		this.setState({ scrollY: window.scrollY });
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

	_renderCanvas: function () {
		console.log("updating canvas") // TEMP
		// get canvas context and clear
		var ctx = this.refs.canvas.getDOMNode().getContext("2d");
		ctx.clearRect(0, 0, this.state.DOMWidth, this.state.DOMHeight);

		// render rows of features with strain variation in each column
		var colorScale = d3.scale.linear()
			.domain([0, 1])
			.range(["blue", "white"]);
		var chunkOfData = this.props.data.slice(0, 1000); // TEMP
		chunkOfData.forEach( (d, i) => {
			d.variationData.forEach( (_d, _i) => {
				// get color and draw rect
				ctx.fillStyle = colorScale(_d);
				ctx.fillRect(_i * NODE_SIZE, i * NODE_SIZE, NODE_SIZE, NODE_SIZE);
			});
		});
	}
});
