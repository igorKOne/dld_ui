sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function (JSONModel, Device) {
	"use strict";

	return {

		createDeviceModel: function () {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},

		setInitialAppData: function (oAppModel) {
			function addDays(date, days) {
			  var result = new Date(date);
			  result.setDate(result.getDate() + days);
			  return result;
			}
			
			oAppModel.setData({
				keyDate: new Date(),
				fromDate: addDays(new Date(),-30),
				selectedStatus: undefined
			});
		}

	};
});