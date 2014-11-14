"use strict";
var d3 = require("d3");
var React = require("react");
var _ = require("underscore");

var MultiScaleAxis = require("./multi_scale_axis.jsx");

// TEMP vars
var PX_PER_CHAR = 12;
var SUMMARIZED_SIZE = 300;
var TICK_HEIGHT = 6;

module.exports = React.createClass({

	propTypes: {
		segments: React.PropTypes.array.isRequired,
		sequences: React.PropTypes.array.isRequired
	},

	render: function () {
		var segmentNodes = this._getSegmentNodes();
		var visibleSequenceNodes = this._getVisibleSequenceNodes();

		return (<div>
			<MultiScaleAxis segments={this.props.segments} scale={this._getXScale()} />
			<svg ref="svg" style={{ width: "100%", height: 600 }}>
				{segmentNodes}
				{visibleSequenceNodes}
			</svg>
		</div>);
	},

	_getSegmentNodes: function () {
		var xScale = this._getXScale();
		var yScale = this._getYScale();

		return _.map(this.props.segments, (s, i) => {
			var _x = xScale(s.domain[0]);
			var _y = 0;
			var _width = xScale(s.domain[1]) - xScale(s.domain[0]);
			var _height = yScale.range()[1] - 0;
			return <rect key={"segRect" + i} x={_x} y={_y} width={_width} height={_height} stroke="none" fill="none" />;
		});
	},

	_getSummarizedSegmentNode: function (startCoordinate, endCoordinate, key) {
		var xScale = this._getXScale();
		return (<g className="summarized-segment" key={key}>
			<line x1={xScale(startCoordinate)} x2={xScale(endCoordinate)} y1="0" y2="0" stroke="#efefef" />
			<line x1={xScale(startCoordinate)} x2={xScale(endCoordinate)} y1="15" y2="15" stroke="#efefef" />
		</g>);
	},

	_getVisibleSequenceNodes: function () {
		var xScale = this._getXScale();
		var yScale = this._getYScale();

		return _.reduce(this.props.sequences, (memo, seq, j) => {
			var _seqSegs = _.map(this.props.segments, (seg, k) => {
				if (seg.visible) {
					var _seqText = seq.sequence.slice(seg.domain[0], seg.domain[1])
					var _transform = `translate(${xScale(seg.domain[0])}, ${yScale(seq.name)})`;
					return <text key={"variantSeqNode" + j + k} transform={_transform} fontFamily="Courier">{_seqText}</text>;
				} else {
					return this._getSummarizedSegmentNode(seg.domain[0], seg.domain[1], "summarizedSequence" + j + k);
				}
			});
			return memo.concat(_seqSegs);
		}, []);

		// make array of nodes for visible segments

		// make array of nodes for summarized segments

		// return the combind arrays
	},

	// returns a d3 scale which has multiple linear scale segments corresponding to segments prop
	_getXScale: function () {
		// sort segments by domain
		var _segs = _.sortBy(this.props.segments, s => {
			return s.domain[0];
		});
		// make domain from "ticky" points in segment
		var _domain = _.reduce(this.props.segments, (memo, s) => {
			memo.push(s.domain[1]);
			return memo;
		}, [0]);
		// make range
		var _range = _.reduce(this.props.segments, (memo, s) => {
			var _last = memo[memo.length - 1];
			// add fixed px for invible, else calc based on sequence
			var _delta = !s.visible ? SUMMARIZED_SIZE : ((s.domain[1] - s.domain[0]) * PX_PER_CHAR);
			memo.push(_last += _delta);
			return memo;
		}, [0]);

		return d3.scale.linear()
			.domain(_domain)
			.range(_range);
	},

	_getYScale: function () {
		var height = this.props.sequences.length * PX_PER_CHAR;
		var names = _.map(this.props.sequence, s => { return s.name; });
		return d3.scale.ordinal()
			.domain(names)
			.range([PX_PER_CHAR, height + PX_PER_CHAR]);
	}
});
