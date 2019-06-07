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
		}
	};
 
	return Formatter;
 
}, /* bExport= */ true);