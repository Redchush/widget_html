/**
 * @fileoverview GiftProductListingViewModel Class 
 * 
 */

define(
//-------------------------------------------------------------------
// PACKAGE NAME
//-------------------------------------------------------------------
'viewModels/giftProductListingViewModel',

//-------------------------------------------------------------------
// DEPENDENCIES
//-------------------------------------------------------------------
[ 'knockout', 'pubsub', 'ccConstants', 'pageLayout/product', 'ccRestClient', 'ccStoreConfiguration'],

//-------------------------------------------------------------------
// MODULE DEFINITION
//-------------------------------------------------------------------
function(ko, pubsub, CCConstants, Product, ccRestClient, CCStoreConfiguration) {

  'use strict';

  //-------------------------------------------------------
  // Class definition & member variables
  //-------------------------------------------------------
  /**
   * Creates a Gift Product Listing View Model.
   * @name GiftProductListingViewModel
   * @class GiftProductListingViewModel
   * 
   * @param {Object[]} pProductsData
   * @param {Object} pParams
   * 
   * @property {Object[]} products Array containing gift product information.
   *  
   */
  function GiftProductListingViewModel(pProductsData, pParams) {
    var self = this;
    
    self.products = self.getProductsInfo(pProductsData);
    
    return self;
  }
  
  /**
   * Storing the storeConfiguration instance for the viewModel
   */
  GiftProductListingViewModel.prototype.storeConfiguration = CCStoreConfiguration.getInstance();

  /**
   * Return the raw products information in a ProductViewModel array.
   * 
   * @param pProductsData - Array of products information.
   */
  GiftProductListingViewModel.prototype.getProductsInfo = function(pProductsData) {
    var self = this;
    var products = [];
    for (var i = 0; i < pProductsData.length; i++) {
      var product={};
      if (pProductsData[i].hasOwnProperty(CCConstants.INVENTORY_PRODUCT_TYPE)) {
        product = new Product(pProductsData[i][CCConstants.INVENTORY_PRODUCT_TYPE]);
      }
      products[i] = {};
      products[i] = product;
    }
    return products;
  };
  
  /**
   * Calls getGiftChoices order store end-point based on the gift details.
   */
  GiftProductListingViewModel.prototype.getGiftProductChoices = function(data) {
    if (data.giftWithPurchaseDetail != null && data.giftWithPurchaseType != null) {
      var url, inputData={};
      inputData[CCConstants.GIFT_WITH_PURCHASE_DETAIL] = data.giftWithPurchaseDetail;
      inputData[CCConstants.GIFT_WITH_PURCHASE_TYPE] = data.giftWithPurchaseType;
      var contextObj = {};
      contextObj[CCConstants.ENDPOINT_KEY] = CCConstants.ENDPOINT_GET_GIFT_CHOICES;
      var filterKey = this.storeConfiguration.getFilterToUse(contextObj);
      if (filterKey) {
        inputData[CCConstants.FILTER_KEY] = filterKey;
      }
      url = CCConstants.ENDPOINT_GET_GIFT_CHOICES;
      ccRestClient.request(url, inputData, this.getGiftChoicesSuccessFunc.bind(this, data.id), 
          this.getGiftChoicesFailureFunc.bind(this));
    }
  };
  
  /**
   * Success callback function that prepares and publishes with GiftProductListingViewModel 
   *   based on the response from getGiftChoices end-point call
   */
  GiftProductListingViewModel.prototype.getGiftChoicesSuccessFunc = function(id, pProductsRawInfo) {
    if (pProductsRawInfo && pProductsRawInfo.length > 0) {
      var giftProductsData = new GiftProductListingViewModel(pProductsRawInfo);
      $.Topic(pubsub.topicNames.GET_GIFT_CHOICES_SUCCESSFUL).publishWith(
          [giftProductsData, id], [{message: "success"}]);
    } else {
      $.Topic(pubsub.topicNames.GIFT_CHOICES_NOT_AVAILABLE).publish();
    }
  };
  
  /**
   * Failure callback function for getGiftChoices end-point call.
   */    
  GiftProductListingViewModel.prototype.getGiftChoicesFailureFunc = function(errorInfo) {
    $.Topic(pubsub.topicNames.GET_GIFT_CHOICES_FAILURE).publishWith(errorInfo, [{message:"failure"}]);
  };
  
  return GiftProductListingViewModel;
});

