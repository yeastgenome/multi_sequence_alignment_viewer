var d3 = require("d3");
var React = require("react");
var _ = require("underscore");

// TEMP vars
var PX_PER_CHAR = 12;
var SUMMARIZED_SIZE = 50;
var TICK_HEIGHT = 6;

module.exports = React.createClass({
	propTypes: {
		segments: React.PropTypes.array.isRequired
	},

	render: function () {
		var tickNodes = this._getTickNodes();
		var segmentNodes = this._getSegmentNodes();

		return (<svg ref="svg" style={{ width: "100%", height: 200 }}>
			{tickNodes}
			{segmentNodes}
		</svg>);
	},

	// returns a d3 scale which has multiple linear scale segments corresponding to segments prop
	_getScale: function () {
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

	_getSegmentNodes: function () {
		var scale = this._getScale();
		var segmentNodes= _.map(this.props.segments, (s, i) => {
			var _y = 23;
			return (<line key={"segmentLine" + i}
				x1={scale(s.domain[0])}
				x2={scale(s.domain[1])}
				y1={_y}
				y2={_y}
				strokeDasharray={s.visible ? null : "3px 3px"}
			/>);
		});
		return segmentNodes;
	},

	_getTickNodes: function () {
		var scale = this._getScale();
		var tickNodes = _.map(scale.domain(), (t, i) => {
			var _transform = `translate(${scale(t)}, 15)`;
			return (<g key={"tick" + i} transform={_transform}>
				<text textAnchor="middle" >{t}</text>
				<line x1="0" x2="0" y1="2" y2={TICK_HEIGHT + 2} />
			</g>);
		});
		return <g>{tickNodes}</g>
	}
});
