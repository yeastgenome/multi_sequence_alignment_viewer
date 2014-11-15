"use strict";
var React = require("react");
var SequenceAligner = require("../lib/sequence_aligner.jsx");
var VariantHeatmap = require("../lib/variant_heatmap.jsx");

// play with some data
var exampleData = {
	sequences: [
		{
			name: "S288C",
			sequence: "ACTGGCCTTGGG---"
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

// fake heatmap data
var totalGenes = 6147;
var heatmapData = [];
for (var i = totalGenes; i >= 0; i--) {
	var _variationData = [];
	for (var j = 11; j > 0; j--) {
		_variationData.push(Math.random());
	}
	heatmapData.push({
		name: "Gene99",
		variationData: _variationData
	});
}

React.render(<VariantHeatmap data={heatmapData} />, document.getElementById("target"));
// React.render(<SequenceAligner segments={exampleData.segments} sequences={exampleData.sequences}/>, document.getElementById("target"));
