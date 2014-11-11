var React = require("react");

var MultiScaleAxis = require("./multi_scale_axis.jsx");

module.exports = React.createClass({

	propTypes: {
		segments: React.PropTypes.array.isRequired,
		sequences: React.PropTypes.array.isRequired
	},

	render: function () {
		return (<div>
			<MultiScaleAxis segments={this.props.segments} />
			<canvas ref="canvas" style={{ width: 400, height: 400 }}></canvas>
		</div>);
	},

	// componentDidMount: function () {
	// 	var ctx = this.refs.canvas.getDOMNode().getContext("2d");
	// 	ctx.font = "10px Helvetica regular";
	// 	ctx.fillText("hola", 100, 14);
	// 	console.log("yo")
	// }
});
