var React = require("react");
var SequenceAligner = require("../lib/sequence_aligner.jsx");

// play with some data
var exampleData = {
	sequences: [
		{
			name: "S288C",
			sequence: "ACTGGCCTTGGG***"
		},
		{
			name: "CEN.PK",
			sequence: "AGTGGCCTTGGGCCC"
		}
	],
	segments: [
		{
			domain: [0, 1],
			visible: false
		},
		{
			domain: [1, 2],
			visible: true
		},
		{
			domain: [2, 11],
			visble: false
		},
		{
			domain: [12, 15],
			visible: true
		}
	]
};

React.render(<SequenceAligner segments={exampleData.segments} sequences={exampleData.sequences}/>, document.getElementById("target"));
