sap.ui.define(function() {
	"use strict";

	self = this;
 
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

		fourSeriesColourDark2Light: function(sVal){
			switch(sVal) {
			case "Good":
				return "sapUiChartPaletteSequentialHue1Light2";
			case "Neutral":
				return "sapUiChartPaletteSequentialHue1Light1";
			case "Critical":
				return "sapUiChartPaletteSequentialHue1";
			case "Error":
				return "sapUiChartPaletteSequentialHue1Dark1";
			}
		},

		percentage: function(Val){
			return '' + Math.round(parseFloat(Val)) + '%';
		},
		
		noAgingDataVisible: function(aYears) {
			
			if(aYears && Array.isArray(aYears) && aYears.length){
				//let TotVal = aYears.reduce( (total, oElem) => total + oElem.value);
				return false;	
			} else {
				return true;
			}			
		},
		
		agingDataVisible: function(aYears) {
			
			if(aYears && Array.isArray(aYears) && aYears.length){
				//let TotVal = aYears.reduce( (total, oElem) => total + oElem.value);
				return true;	
			} else {
				return false;
			}			
		},
		
		usageDataVisible: function(aYearsExecutions) {
			
			if(aYearsExecutions && Array.isArray(aYearsExecutions) && aYearsExecutions.length){
				//let TotVal = aYears.reduce( (total, oElem) => total + oElem.value);
				return true;	
			} else {
				return false;
			}			
		},
		
	};
 
	return Formatter;
 
}, /* bExport= */ true);