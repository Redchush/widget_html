/**
 * @fileoverview shipping method item view model, used to store shipping method details
 * it has been set up as a separate view model because there is a computed field 
 * for the estimatedCostText 
 * 
 */

/*global define */
define(
  //-------------------------------------------------------------------
  // PACKAGE NAME
  //-------------------------------------------------------------------
  'viewModels/shippingMethodItemViewModel',
  
  //-------------------------------------------------------------------
  // DEPENDENCIES
  //-------------------------------------------------------------------
  ['knockout', 'pubsub', 'ccStoreUtils'],
    
  //-------------------------------------------------------------------
  // MODULE DEFINITION
  //-------------------------------------------------------------------
  function (ko, pubsub, StoreUtils) {
  
    'use strict';
    
    //------------------------------------------------------------------
    // Class definition & member variables
    //------------------------------------------------------------------
    /**
     * Creates an shipping Method Item view model.
     * 
     * @param {Object} data
     * @param {number} cartValue
     * 
     * @private
     * @class
     * @name ShippingMethodItemViewModel
     * @property {string} repositoryid Unique repository ID of this shipping method item.
     * @property {Object[]} ranges Array containing ranges for pricing.
     * @property {observable<number>} cartValue Current value of the cart.
     * @property {string} displayname Shipping method item display name. 
     * @property {string} estimatedCostText Derived text showing estimated cost based on the cartValue 
     *           and what is held in the ranges array.
     * @property {number} shippingCost Derived calculationg of shipping cost based on cartValue and  price
     *           ranges.
     */
    function ShippingMethodItemViewModel(data, cartValue) {
      var self = this;

      StoreUtils.fromJS(data, self, true);
      self.cartValue = ko.observable(cartValue);

      self.estimatedCostText = ko.computed(function () {
                
        var cost = self.calcCorrectAmout(self.cartValue());
        var resultText = cost.toFixed(2).toString();
                 
        return resultText;
      }, self);
     
      self.shippingCost = ko.computed(function () {
                
        var cost = self.calcCorrectAmout(self.cartValue());
                 
        return cost;
      }, self);
      
      // updates the shipping method
      self.cartUpdatedMethod = function(cart){
        self.cartValue(cart.amount());        
      };

      $.Topic(pubsub.topicNames.CART_UPDATED).subscribe(self.cartUpdatedMethod);
      return self;      
    }

    /**
     * Calculate the correct shipping cost based on cart value and price ranges.
     * 
     * @private
     * @function
     * @name ShippingMethodItemViewModel#calcCorrectAmout
     * @param {number} cartValue The total value of cart items.
     * @returns {number} The calculated correct shipping cost.
     */    
    ShippingMethodItemViewModel.prototype.calcCorrectAmout = function(cartValue){
      var self = this;    
      var correctAmount = 0;
      for (var i = 0; i < self.ranges.length; i++ ) {

        var highValue = self.ranges[i].high;
        var lowValue = self.ranges[i].low;

        if (self.ranges[i].high == null){
          highValue = Number.MAX_VALUE;
        }

        if ((cartValue >= lowValue) && (cartValue <= highValue )) {
          correctAmount = self.ranges[i].amount;
        }
      }

      return correctAmount;
    };
    
    return ShippingMethodItemViewModel;
});

