/**
 * @fileoverview CashViewModel Class
 *
 *
 * @typedef {Object} cash
 */
/*global define */
define(
  //-------------------------------------------------------------------
  // PACKAGE NAME
  //-------------------------------------------------------------------
  'viewModels/cashViewModel',

  //-------------------------------------------------------------------
  // DEPENDENCIES
  //-------------------------------------------------------------------
  ['knockout', 'pageLayout/site', 'ccConstants', 'viewModels/paymentDetails'],

  //-------------------------------------------------------------------
  // MODULE DEFINITION
  //-------------------------------------------------------------------
  function (ko, siteViewModel, CCConstants, paymentDetails) {

    'use strict';
    var cashEnabledCountries = [];
    //------------------------------------------------------------------
    // Class definition & member variables
    //------------------------------------------------------------------
    /**
     * Creates a cash view model to store data, related to cash mode of payment
     * @param {Object} widget Owning widget for this payment details view
     * @private
     * @constructor
     * @name cash
     */
    function cashViewModel() {
      if(cashViewModel.singleInstance) {
        throw new Error("Cannot instantiate more than one cashViewModels, use getInstance()");
      }
      var self = this;

      self.isPayingByCash = ko.observable(false);
      self.isCashPaymentEnabled = ko.observable(false);
      self.paymentDetails = paymentDetails.getInstance();

      /**
       * Method to set cashEnabledCountries from siteViewModel
       */
      self.setCashEnabledCountries = function() {
        for(var key in siteViewModel.getInstance().extensionSiteSettings) {
          var settingsObject = siteViewModel.getInstance().extensionSiteSettings[key];
          if (settingsObject[CCConstants.PAYMENT_METHOD_TYPES] &&
            settingsObject[CCConstants.PAYMENT_METHOD_TYPES].split(",").indexOf(CCConstants.CASH_PAYMENT_TYPE) != -1 ) {
              if (settingsObject[CCConstants.SELECTED_COUNTRIES]) {
                cashEnabledCountries = settingsObject[CCConstants.SELECTED_COUNTRIES];
              }
            }
          }
        }

      /**
       * Verify if the cash payment is enabled for the selected country
       * @param {String} country - The country code for which verification is to be done
       */
      self.verifyCashPaymentToBeEnabled = function(country) {
        if (((self.paymentDetails.enabledTypes).indexOf(CCConstants.CASH_PAYMENT_TYPE) != -1) &&
            ((cashEnabledCountries).indexOf(country) != -1)) {
          self.isCashPaymentEnabled(true);
        } else {
          self.isCashPaymentEnabled(false);
          self.isPayingByCash(false);
        }
      };

      /**
       * Method to create additional properties for the cash viewmodel
       * @param {Array} PropertyKeys - An array of strings, containing the keys for additional properties
       */
      self.createCustomProperties = function(PropertyKeys) {
        var extData = {};
        for(var key in PropertyKeys) {
          if(typeof PropertyKeys[key] === "string") {
            extData[PropertyKeys[key]] = "";
          }
        }
        self.customProperties = ko.mapping.fromJS(extData);
      };

    };

    /**
     * Return the single instance of cashViewModel. Create it if it doesn't exist.
     *
     * @function
     * @name cashViewModel.getInstance()
     * @return {cashViewModel} Singleton instance.
     */
    cashViewModel.getInstance = function() {
      if(!cashViewModel.singleInstance) {
        cashViewModel.singleInstance = new cashViewModel();
      }
      return cashViewModel.singleInstance;
    };

    return cashViewModel;
});

