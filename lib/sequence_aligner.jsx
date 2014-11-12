"use strict";
var d3 = require("d3");
var React = require("react");
var _ = require("underscore");

var MultiScaleAxis = require("./multi_scale_axis.jsx");

// TEMP vars
var PX_PER_CHAR = 12;
var SUMMARIZED_SIZE = 50;
var TICK_HEIGHT = 6;

module.exports = React.createClass({

	propTypes: {
		segments: React.PropTypes.array.isRequired,
		sequences: React.PropTypes.array.isRequired
	},

	render: function () {
		var visibleSequenceNodes = this._getVisibleSequenceNodes();
		return (<div>
			<MultiScaleAxis segments={this.props.segments} scale={this._getXScale()} />
			<svg ref="svg" style={{ width: "100%", height: 600 }}>
				{visibleSequenceNodes}
			</svg>
		</div>);
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

	_getVisibleSequenceNodes: function () {
		var _seqs = _.reduce(this.props.sequences, (memo, seq) => {
			var _seqSegs = _.map(this.props.segments, seg => {
				if (seg.visible) {
					return {
						sequence: seq.sequence.slice(seg.domain[0], seg.domain[1]),
						start: seg.domain[0],
						name: seq.name
					};
				} else {
					return null;
				}
			});
			
			return memo.concat(_.filter(_seqSegs, s => { return s; }));
		}, []);

		var xScale = this._getXScale();
		var yScale = this._getYScale();

		return _.map(_seqs, (seq, i) => {
			var _transform = `translate(${xScale(seq.start)}, ${yScale(seq.name)})`;
			return <text key={"variantSeqNode" + i} transform={_transform} fontFamily="Courier">{seq.sequence}</text>;
		});
	},

	_getYScale: function () {
		var height = this.props.sequences.length * PX_PER_CHAR;
		var names = _.map(this.props.sequence, s => { return s.name; });
		return d3.scale.ordinal()
			.domain(names)
			.range([PX_PER_CHAR, height + PX_PER_CHAR]);
	}

	// componentDidMount: function () {
	// 	var ctx = this.refs.canvas.getDOMNode().getContext("2d");
	// 	ctx.font = "10px Helvetica regular";
	// 	ctx.fillText("hola", 100, 14);
	// 	console.log("yo")
	// }
});
