define(
//-------------------------------------------------------------------
// PACKAGE NAME
//-------------------------------------------------------------------
'viewModels/giftCardViewModel',

//-------------------------------------------------------------------
// DEPENDENCIES
//-------------------------------------------------------------------
[ 'knockout', 'ccConstants', 'koValidate', 'ccKoValidateRules',
    'storeKoExtensions', 'CCi18n','pageLayout/site' , 'viewModels/paymentDetails'],

//-------------------------------------------------------------------
// MODULE DEFINITION
//-------------------------------------------------------------------
function(ko, CCConstants, koValidate, rules, storeKoExtensions,
    CCi18n, site, paymentDetails) {

  'use strict';

  //-------------------------------------------------------
  // Class definition & member variables
  //-------------------------------------------------------
  /**
   * Creates an Gift Card view model.
   * @name GiftCardViewModel
   * @class GiftCardViewModel
   * @property {observable<string>}  giftCardNumber The Unique identifier of the giftCardNumber
   * @property {observable<string>}  maskedGiftCardNumber Masked version of the  giftCardNumber
   * @property {observable<string>}  giftCardPin Secret Pin of the giftCard
   * @property {observable<string>}  amountInGiftCard Balance amount available in the giftCard
   * @property {observable<string>}  paymentGroupId of giftCard
   * @property {observable<string>}  amountUsed Amount Used in giftCard for Auth
   * @property {observable<boolean>}  isAmountRemaining boolean flag to represent the amount Remaining relationship 
   *  of the payment Group
   * @property {observable<boolean>}  isPinCleared Flag which is set on page changed to indicate the loss of pin.
   *  Cleared on when Apply is clicked
   * @property {observable<boolean>}  hasBeenApplied Flag used to switch the  apply or applying text
   *   on click of apply button 
   */

  function GiftCardViewModel() {

    var self = this;

    self.giftCardNumber = ko.observable('');
    self.maskedGiftCardNumber = ko.observable('');
    self.giftCardPin = ko.observable('');
    self.amountInGiftCard = ko.observable('');
    self.paymentGroupId = ko.observable('');
    self.amountUsed = ko.observable(0);
    self.isAmountRemaining = ko.observable(false);
    self.GIFTCARD_PIN_MAX_LENGTH = ko.observable(4);
    self.GIFTCARD_NUMBER_MAX_LENGTH = ko.observable(19);
    self.isPinCleared = ko.observable(false);
    self.isApplyGiftCardClicked = ko.observable(false);
    self.IS_GIFT_CARD_PIN_REQUIRED= ko.observable(true);

    GiftCardViewModel.prototype.setGiftCardNumberMaxLength = function (pValue) {
      if (pValue) {
        var self = this;
        self.GIFTCARD_NUMBER_MAX_LENGTH(pValue);
        self.giftCardNumber.extend({validatable : false});
        self.giftCardNumber.extend({
          required: {
            params: true,
            message: CCi18n.t('ns.common:resources.giftCardNumberRequired',{})
          },
          maxLength: {
            params: self.GIFTCARD_NUMBER_MAX_LENGTH(),
            message: CCi18n.t('ns.common:resources.maxlengthValidationMsg',{maxLength:self.GIFTCARD_NUMBER_MAX_LENGTH(), fieldName:CCi18n.t('ns.common:resources.giftCardNumberText',{})})
          }
        });
      }
    };

    GiftCardViewModel.prototype.setGiftCardPinDetails = function (pRequired, pLength) {
      if (pRequired != undefined && pRequired != null && pLength != undefined && pLength != null) {
        var self = this;
        if (pLength <= 0) {
          pRequired = false;
          pLength = 0;
        }
        self.IS_GIFT_CARD_PIN_REQUIRED(pRequired);
        self.GIFTCARD_PIN_MAX_LENGTH(pLength);
        self.giftCardPin.extend({validatable : false});
        self.giftCardPin.extend({
          required: {
            params: self.IS_GIFT_CARD_PIN_REQUIRED(),
            message: CCi18n.t('ns.common:resources.giftCardPinRequired',{})
          },
          maxLength: {
            params: self.GIFTCARD_PIN_MAX_LENGTH(),
            message: CCi18n.t('ns.common:resources.maxlengthValidationMsg',{maxLength: self.GIFTCARD_PIN_MAX_LENGTH(), fieldName:CCi18n.t('ns.common:resources.giftCardPinText',{})})
          }
        });
      }
    };

    if(paymentDetails.getInstance() && paymentDetails.getInstance().enabledTypes && (paymentDetails.getInstance().enabledTypes.indexOf(CCConstants.GIFT_CARD_PAYMENT_TYPE) > -1)){
      var siteVM = site.getInstance();
      for (var key in siteVM.extensionSiteSettings) {
        var setingsObject = siteVM.extensionSiteSettings[key];
        if (setingsObject[CCConstants.PAYMENT_METHOD_TYPES] &&
          setingsObject[CCConstants.PAYMENT_METHOD_TYPES].indexOf(CCConstants.GIFT_CARD_PAYMENT_TYPE) != -1 ) {
          if(setingsObject.giftCardMaxLength != undefined) {
            self.GIFTCARD_NUMBER_MAX_LENGTH(setingsObject.giftCardMaxLength);
          }
          if (setingsObject.giftCardPinRequired != undefined && setingsObject.giftCardPinMaxLength != undefined) {
            self.IS_GIFT_CARD_PIN_REQUIRED(setingsObject.giftCardPinRequired);
            self.GIFTCARD_PIN_MAX_LENGTH(setingsObject.giftCardPinMaxLength);
          }
        break;
        }
      }
    }
    self.setGiftCardNumberMaxLength(self.GIFTCARD_NUMBER_MAX_LENGTH());
    self.setGiftCardPinDetails(self.IS_GIFT_CARD_PIN_REQUIRED(), self.GIFTCARD_PIN_MAX_LENGTH());

    self.isValid = function() {
      return (self.giftCardNumber.isValid() && self.giftCardPin.isValid());
    };

    self.validateNow = function() {
      self.giftCardNumber.isModified(true);
      self.giftCardPin.isModified(true);
      return (self.isValid());
    };

    self.reset = function() {
      self.giftCardNumber('');
      self.maskedGiftCardNumber('');
      self.giftCardPin('');
      self.amountInGiftCard('');
      self.amountUsed(0);
      self.giftCardNumber.isModified(false);
      self.giftCardPin.isModified(false);
      self.isApplyGiftCardClicked(false);
    };
    
    self.clearPin = function() {
    	self.giftCardPin('');
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

  }
  return GiftCardViewModel;
});

