"use strict";
var d3 = require("d3");
var React = require("react");
var _ = require("underscore");

module.exports = React.createClass({
	propTypes: {
		data: React.PropTypes.array.isRequired
	},

	getInitialState: function () {
		return {
			DOMWidth: 400;
		};
	},

	render: function () {
		return (<div className="variant-heatmap" style={{ height: "100%" }}>
			<canvas ref="canvas" style={{ width: this.state.DOMWidth, height: 600 }}/>
		</div>);
	},

	componentDidMount: function () {
		this._calculateWidth();
	},

	componentDidUpdate: function () {
		this._renderCanvas();
	},

	_calculateWidth: function () {
		this.setState({ DOMWidth: this.getDOMNode().getBoundingClientRect().width });
	}

	_getXScale: function () {
		var maxColWidth = 11; // TEMP
		return d3.scale.linear()
			.domain([0, maxColWidth])
			.range([0, this.state.DOMWidth]);
	},

	_renderCanvas: function () {
		var ctx = this.refs.canvas.getDOMNode().getContext("2d");
	}
});
