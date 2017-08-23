/**
 * @fileoverview PaymentDetails Class
 *  * 
 * 
 * @typedef {Object} PaymentDetails
 */
/*global define */
define(
  //-------------------------------------------------------------------
  // PACKAGE NAME
  //-------------------------------------------------------------------
  'viewModels/paymentDetails',
  
  //-------------------------------------------------------------------
  // DEPENDENCIES
  //-------------------------------------------------------------------
  ['knockout', 'ccConstants', 'pubsub'],
    
  //-------------------------------------------------------------------
  // MODULE DEFINITION
  //-------------------------------------------------------------------
  function (ko, CCConstants, pubsub) {
  
    'use strict';
    
    //------------------------------------------------------------------
    // Class definition & member variables
    //------------------------------------------------------------------
    /**
     * Creates a payment details view model.
     * @param {Object} widget Owning widget for this payment details view
     * @private
     * @constructor
     * @name PaymentDetails
     * @property {Observable} nameOnCard Name on card
     * @property {observable} cardType Type of card
     * @property {observable} cardNumber Card number
     * @property {observable} cardCVV CVV number on card
     * @property {observable} endMonth Expiry month on card
     * @property {observable} endYear Expiry year on card
     * @property {observable} selectedCardType Type of card selected
     * @property {observable} selectedEndMonth Selected expiration month
     * @property {observable} selectedEndYear Selected expiration year
     * @property {observableArray} cardTypeList List of card types
     * @property {observableArray} monthList Month list
     * @property {observableArray} endYearList Year list
     * @property {observable String} cardIINPattern Card number pattern
     * @property {observable String} cardNumberLength Card number length
     * @property {observable String} cvvLength CVV number length
     * @property {observable boolean} startDateRequired start date required or not
     * @property {observable String} endMonthPlaceholderText Placeholder text for expiry month
     * @property {observable String} endYearPlaceholderText Placeholder text for expiry year
     * @property {observable String} cardTypePlaceholderText Placeholder text for card type
     * @property {observable boolean} isCardPaymentDisabled Flag for disabling card details
     */
    function PaymentDetails(pAdapter, data) {
      if(PaymentDetails.singleInstance) {
        throw new Error("Cannot instantiate more than one PaymentDetails, use getInstance(pAdapter, data)");  
      }
      var self = this;
      
      // PaymentDetails Fields
      self.nameOnCard = ko.observable();
      self.cardType = ko.observable();
      self.cardNumber = ko.observable(); 
      self.cardCVV = ko.observable();
      self.endMonth = ko.observable();
      self.endYear = ko.observable();
      self.selectedCardType = ko.observable();
      self.selectedEndMonth = ko.observable();
      self.selectedEndYear = ko.observable();

      self.cardTypeList = ko.observableArray();
      self.cards = null;
      self.gateways = null;
      self.payULatamCountryList = null;
      self.enabledTypes = null;
      self.monthList = ko.observableArray();
      self.endYearList = ko.observableArray();

      self.cardIINPattern = ko.observable('[0-9]');
      self.cardNumberLength = ko.observable('16');
      self.cvvLength = ko.observable('3');
      self.startDateRequired = ko.observable(false);
      self.endMonthPlaceholderText = ko.observable('');
      self.endYearPlaceholderText = ko.observable('');
      self.cardTypePlaceholderText = ko.observable('');
      
      self.isCardPaymentDisabled = ko.observable(false);
      
      // Scheduled Order enable variables
      self.isCardEnabledForScheduledOrder = ko.observable(false);
      self.isGiftCardEnabledForScheduledOrder = ko.observable(false);
      self.isInvoiceEnabledForScheduledOrder = ko.observable(false);
      self.isCashEnabledForScheduledOrder = ko.observable(false);
      self.isPayULEnabledForScheduledOrder = ko.observable(false);
      self.isPaypalEnabledForScheduledOrder = ko.observable(false);
      
      //Order Approval enable Variables
      self.isCardEnabledForApproval = ko.observable(false);
      self.isGiftCardEnabledForApproval = ko.observable(false);
      self.isInvoiceEnabledForApproval = ko.observable(false);
      self.isCashEnabledForApproval = ko.observable(false);
      self.isPayULEnabledForApproval = ko.observable(false);
      self.isPaypalEnabledForApproval = ko.observable(false);

      // Validation
      // In time, the required boolean should be set based on the locale

        /**
         * @function
         * @name isValid
         * Determine whether or not the payment details object is valid
         * based on the validity of its component parts. This will not
         * cause error messages to be displayed for any observable values
         * that are unchanged and have never received focus on the 
         * related form field(s).
         * @return boolean result of validity test
         */   
        self.isValid = function() {
          return (self.nameOnCard.isValid()
                  && self.cardType.isValid()
                  && self.cardNumber.isValid()
                  && self.cardCVV.isValid()
                  && self.endMonth.isValid()
                  && self.endYear.isValid());
        };

        /**
         * @function
         * @name validatePaymentDetails
         * Force all relevant member observables to perform their
         * validation now & display the errors (if any)
         */
        self.validatePaymentDetails = function() {
          self.nameOnCard.isModified(true);
          self.cardType.isModified(true);
          self.cardNumber.isModified(true); 
          self.cardCVV.isModified(true);
          self.endMonth.isModified(true);
          self.endYear.isModified(true);
          return(self.isValid());
        };
      
      /**
       * @function
       * @name resetPaymentDetails
       * @class ProductDetails
       * Clears the data and errors associated with this object.
       */
        self.resetPaymentDetails = function(obj) {
          self.nameOnCard(null);
          self.selectedCardType(null);
          self.cardType(undefined);
          self.cardNumber(null);
          self.cardCVV(null);
          self.selectedEndMonth(undefined);
          self.selectedEndYear(undefined);
          self.endMonth(null);
          self.endYear(null);
          if (self.nameOnCard.isModified) {
            self.nameOnCard.isModified(false);
          }
          if (self.cardType.isModified) {
            self.cardType.isModified(false);
          }
          if (self.cardNumber.isModified) {
            self.cardNumber.isModified(false);
          }
          if (self.cardCVV.isModified) {
            self.cardCVV.isModified(false);
          }
          if (self.endMonth.isModified) {
            self.endMonth.isModified(false);
          }
          if (self.endYear.isModified) {
            self.endYear.isModified(false);
          }
        };

        /**
         * @function
         * @name resetCVV
         * @class ProductDetails
         * Clears the CVV details on order submission failure.
         */
        self.resetCVV = function() {
          if (self.cardCVV.isModified) {
              self.cardCVV.isModified(false);
          }
          self.cardCVV('')
        };
        
        self.populatePaymentData = function(data) {
          self.cardTypeList = ko.observableArray(data.cards);
          self.cards = data.cards;
          self.gateways = data.gateways;
          self.payULatamCountryList = data.payULatamCountryList;
          self.cashPaymentCountryList = data.cashPaymentCountryList;
          self.enabledTypes = data.enabledTypes;
          for (var i=0; i<data.scheduledOrderEnabledGateways.length; i++) {
            if (data.scheduledOrderEnabledGateways[i] === CCConstants.CARD_PAYMENT_TYPE) {
              self.isCardEnabledForScheduledOrder(true);
            }

            if (data.scheduledOrderEnabledGateways[i] === CCConstants.GIFT_CARD_PAYMENT_TYPE) {
              self.isGiftCardEnabledForScheduledOrder(true);
            }

            if (data.scheduledOrderEnabledGateways[i] === CCConstants.INVOICE_PAYMENT_TYPE) {
              self.isInvoiceEnabledForScheduledOrder(true);
            }

            if (data.scheduledOrderEnabledGateways[i] === CCConstants.CASH_PAYMENT_TYPE) {
              self.isCashEnabledForScheduledOrder(true);
            }

            if (data.scheduledOrderEnabledGateways[i] === CCConstants.PAYULATAM_CHECKOUT_TYPE) {
              self.isPayULEnabledForScheduledOrder(true);
            }
            
            if (data.scheduledOrderEnabledGateways[i] === CCConstants.PAYPAL_PAYMENT_TYPE) {
              self.isPaypalEnabledForScheduledOrder(true);
            }
          }
          for (var i=0; i<data.approvalEnabledGateways.length; i++) {
            if (data.approvalEnabledGateways[i] === CCConstants.CARD_PAYMENT_TYPE) {
              self.isCardEnabledForApproval(true);
            }

            if (data.approvalEnabledGateways[i] === CCConstants.GIFT_CARD_PAYMENT_TYPE) {
              self.isGiftCardEnabledForApproval(true);
            }

            if (data.approvalEnabledGateways[i] === CCConstants.INVOICE_PAYMENT_TYPE) {
              self.isInvoiceEnabledForApproval(true);
            }

            if (data.approvalEnabledGateways[i] === CCConstants.CASH_PAYMENT_TYPE) {
              self.isCashEnabledForApproval(true);
            }

            if (data.approvalEnabledGateways[i] === CCConstants.PAYULATAM_CHECKOUT_TYPE) {
              self.isPayULEnabledForApproval(true);
            }
            
            if (data.approvalEnabledGateways[i] === CCConstants.PAYPAL_PAYMENT_TYPE) {
              self.isPaypalEnabledForApproval(true);
            }
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

        $.Topic(pubsub.topicNames.ORDER_SUBMISSION_SUCCESS).subscribe(this.resetPaymentDetails);

        $.Topic(pubsub.topicNames.USER_LOGOUT_SUBMIT).subscribe(this.resetPaymentDetails);

        $.Topic(pubsub.topicNames.USER_SESSION_RESET).subscribe(this.resetPaymentDetails);

        $.Topic(pubsub.topicNames.ORDER_SUBMISSION_FAIL).subscribe(this.resetCVV);

      return self;
    }
    
    /**
     * Return the single instance of PaymentDetails. Create it if it doesn't exist.
     * 
     * @function
     * @name PaymentDetails.getInstance
     * @param {RestAdapter} pAdapter The REST adapter.
     * @param {Object} [data] Additional data.
     * @return {PaymentDetails} Singleton instance.
     */
    PaymentDetails.getInstance = function(pAdapter, data) {
      if(!PaymentDetails.singleInstance) {
        PaymentDetails.singleInstance = new PaymentDetails(pAdapter, data);
      }
      if (data) {
        PaymentDetails.singleInstance.populatePaymentData(data);
      }
      return PaymentDetails.singleInstance;
    };

    return PaymentDetails;
});

