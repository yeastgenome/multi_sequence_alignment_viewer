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

// FAKE DATA
var heatpmapData = [];
var _numGenes = 6400;
var _numCols = 11;

for (var j = _numGenes; j >= 0; j--) {
	var _variantData = [];
	for (var k = _numCols; k >= 0; k--) {
		_variantData.push(Math.random());
	}
	heatpmapData.push({
		name: "Gene" + Math.round(Math.random() * 100),
		variationData: _variantData
	});
}

React.render(<VariantHeatmap data={heatpmapData} />, document.getElementById("target"));
// React.render(<SequenceAligner segments={exampleData.segments} sequences={exampleData.sequences}/>, document.getElementById("target"));
