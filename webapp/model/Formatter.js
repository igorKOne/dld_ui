sap.ui.define(function() {
	"use strict";
 
	var Formatter = {
 
		classificationString :  function (fValue) {
			try {
				//fValue = parseDecimal(fValue/1000000000000);
				return fValue;
			} catch (err) {
				return "0";
			}
		},
		
		numberValue: function(Val){
			if(!Val){
				return 0;
			} else {
				return parseFloat(Val);
			}
		},
		
		fourSeriesColour: function(sVal){
			
			switch(sVal) {
			case "Error":
				return "sapUiChartPaletteSequentialHue1Light2";
			case "Critical":
				return "sapUiChartPaletteSequentialHue1Light1";
			case "Neutral":
				return "sapUiChartPaletteSequentialHue1";
			case "Good":
				return "sapUiChartPaletteSequentialHue1Dark1";
			}
		},
		
		percentage: function(Val){
			return '' + parseFloat(Val) + '%';
		}
	};
 
	return Formatter;
 
}, /* bExport= */ true);