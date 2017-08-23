/**
 * @fileoverview The CartItemExternalData view model class.
 */
define('viewModels/cart-item-external-data',[
  'knockout'
], function (ko) {
  'use strict';

  /**
   * Class representing a dynamic External Commerce Item Data item.
   * 
   * @param {Object} data - The initial state.
   * @property {String} name - The identifying name of the externalCommerceItemData item.
   * @property {String} actionCode - The action code associated with this externalCommerceItemData item [optional].
   * @property {Object} values - The map of data values associated with this externalCommerceItemData item,
   *    e.g {label, value, displayValue, ...}, the structure of this map free and is will be determined by the external 
   *    configuration system.
   */
  function CartItemExternalData (data) {
    // Default params.
    data = data || {};

    // Properties
    this.name = ko.observable(data.name);
    this.actionCode = ko.observable(data.actionCode);
    this.values = ko.observable(data.values);
  }

  /**
   * Customize JSON stringification.
   * 
   * @see https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#toJSON()_behavior
   * @returns Raw view model state to be stringified.
   */
  CartItemExternalData.prototype.toJSON = function () {
    var state = ko.toJS(this);

    return state;
  };

  return CartItemExternalData;
});

