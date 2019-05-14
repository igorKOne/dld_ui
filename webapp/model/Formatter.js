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
		}
	};
 
	return Formatter;
 
}, /* bExport= */ true);