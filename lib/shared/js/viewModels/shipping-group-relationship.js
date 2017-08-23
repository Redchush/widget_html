/**
 * @fileoverview Defines a ShippingGroupRelationship item which represents an association between a cart item and a shipping group.
 */

/*global define */
define('viewModels/shipping-group-relationship',['require','knockout','ccConstants'],function (require) {
    "use strict";
    var ko = require('knockout');
    var ccConstants = require('ccConstants');

    /**
     * <p>
     *  The view model class that represents an association between a cart item and a shipping group. Strictly
     *  speaking, ShippingGroupRelationships associates a specified quantity of the cart item with a shipping address
     *  and shipping method (not shipping group), however the shipping groups array is directly generated from the 
     *  ShippingGroupRelationships instances (see the createShippingGroups method). When the user selects a shipping 
     *  address and shipping method for a given cart item, it is this class that captures those selections.
     * </p>
     *
     * @private
     * @class
     * @name ShippingGroupRelationship
     * @param {CartItem} cartItem - The associated cart item.
     * @param {Number} quantity - The initial quantity of cart item to be associated to the shipping group.
     * @property {ko.observable<Number>} quantity - The quantity of cart item to be associated to the shipping group.
     * @property {ko.observable<Address>} shippingAddress - The address to which this quantity of cart item should be 
     *    shipped.
     * @property {ko.observable<ShippingMethodItemViewModel>} shippingMethod - The method by which this quantity of
     *    cart item should be shipped.
     */
    function ShippingGroupRelationship (cartItem, quantity) {
      // Default args.
      quantity = quantity || 0;

      // Properties.
      this.catRefId = cartItem.catRefId;
      this.productId = cartItem.productId;
      this.quantity = ko.observable(quantity);
      this.shippingOptions = ko.observableArray();
      this.shippingAddress = ko.observable();
      this.shippingMethod = ko.observable();
    }

    /**
     * <p>
     *   Generate a unique string key for this instance (see ShippingGroupRelationship#asMap method).
     * </p>
     *
     * @private
     * @function
     * @name ShippingGroupRelationship#generateKey
     * @return {String} a unique string key for this instance.
     */
    ShippingGroupRelationship.prototype.generateKey = function () {
      var shippingAddress = this.shippingAddress();
      var shippingMethod = this.shippingMethod();
      var key = '';

      if (shippingAddress) {
        key += ko.toJSON(shippingAddress);
      }
      if (shippingMethod) {
        key += shippingMethod.repositoryId;
      }

      return key;
    };

    /**
     * <p>
     *   Return a map representation of the ShippingGroupRelationship instance, where a string key (from 
     *   ShippingGroupRelationship#generateKey) maps to this instance. This method is used internally by 
     *   CartViewModel#createShippingGroups in order to map shipping group relationships to shipping groups.
     * </p>
     *
     * @private
     * @function
     * @name ShippingGroupRelationship#asMap
     * @return {Object} The map representaion of this instance.
     */
    ShippingGroupRelationship.prototype.asMap = function (emailAddress) {
      var shippingGroupMap = {};
      var shippingGroupKey = this.generateKey();
      var shippingGroupItemsMap = {};
      if (this.commerceItemId) {
        var shippingGroupItemKey = this.catRefId + "_" + this.commerceItemId;
      } else {
        var shippingGroupItemKey = this.catRefId;
      }
      var shippingAddress = ko.toJS(this.shippingAddress());
      
      if(emailAddress && ((!shippingAddress.email) || (shippingAddress.email != emailAddress))){
    	shippingAddress.email = emailAddress;
      }
      
      var shippingMethod = this.shippingMethod() ? {value: this.shippingMethod().repositoryId} : null;

      // Build shipping group items map.
      if (this.commerceItemId) {
        shippingGroupItemsMap[shippingGroupItemKey] = {
          productId: this.productId,
          catRefId: this.catRefId,
          quantity: parseFloat(this.quantity(), 10),
          commerceItemId: this.commerceItemId
        };
      } else {
        shippingGroupItemsMap[shippingGroupItemKey] = {
          productId: this.productId,
          catRefId: this.catRefId,
          quantity: parseFloat(this.quantity(), 10)
        };
      }

      // Build shipping group map.
      shippingGroupMap[shippingGroupKey] = {
        items: shippingGroupItemsMap,
        shippingAddress: shippingAddress,
        shippingMethod: shippingMethod
      };

      return shippingGroupMap;
    };

    /**
     * <p>
     *   Add a specified number to the existing quantity. There is no removeQuantity method as passing negative numbers 
     *   gives the same result.
     * </p>
     *
     * @private
     * @function
     * @name ShippingGroupRelationship#addQuantity
     * @param {Number} adjustmentAmount - The amount to be added to the quantity (can be negative).
     */
    ShippingGroupRelationship.prototype.addQuantity = function (adjustmentAmount) {
      this.quantity(parseFloat(this.quantity()) + parseFloat(adjustmentAmount));
    };

    return ShippingGroupRelationship;
  });
