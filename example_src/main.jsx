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

// TEMP
// FAKE HEATMAP DATA
var heatpmapData = [];
var _numGenes = 6400;
var numStrains = 11;

for (var j = 0; j <= _numGenes; j++) {
	var _variantData = [];
	for (var k = numStrains; k >= 0; k--) {
		_variantData.push(Math.random());
	}
	heatpmapData.push({
		name: "Gene" + j,
		variationData: _variantData
	});
}
// strain data for heatmap, also FAKE
var _strainMetaData = [];
for (var i = numStrains; i >= 0; i--) {
	_strainMetaData.push ({
		name: "Strain" + i
	});
};
_strainMetaData = _strainMetaData.reverse();

React.render(<VariantHeatmap
		data={heatpmapData}
		strainData={_strainMetaData}
	/>, document.getElementById("target"));
// React.render(<SequenceAligner segments={exampleData.segments} sequences={exampleData.sequences}/>, document.getElementById("target"));
