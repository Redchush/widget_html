/*global $ */

define('currencyHelper',
['knockout', 'ccRestClient', 'ccConstants', 'numberFormatHelper', 'pubsub'],

function(ko, ccRestClient, ccConstants, numberFormatHelper, PubSub) {
  "use strict";

  /**
   * Creates a CurrencyHelper
   */
  function CurrencyHelper() {
    var self = this;
    this.currencyObject = ko.observable(null);
    this.currencyMapObject = ko.observable(null);
    this.setFractionalDigits = ko.observable(null);

    // pubsub subscribe to trigger refresh on price list group
    this.getCurrencyMapCurrenciesBinding = this.getCurrencyMapCurrencies.bind(this);
    $.Topic(PubSub.topicNames.PRICE_LIST_GROUP_UPDATE).subscribe(this.getCurrencyMapCurrenciesBinding);
    $.Topic(PubSub.topicNames.ADMIN_CONTENT_LANGUAGE_CHANGED).subscribe(this.getCurrencyMapCurrenciesBinding);

    return (this);
  }

  // Constants
  CurrencyHelper.prototype.DECIMAL_NUMBER_FORMAT = "decimal";

  /**
   * REST call to retrive currency data
   */
  CurrencyHelper.prototype.getCurrency = function() {
    var url = ccConstants.ENDPOINT_CURRENCIES_LIST_CURRENCIES;
    var data = {};
    ccRestClient.request(url, data, this.getCurrencySuccess.bind(this), this.getCurrencyError.bind(this));
  };

  /**
   * Success function for getCurrency()
   * @param {Object} result : REST call response
   */
  CurrencyHelper.prototype.getCurrencySuccess = function(response) {
    this.currencyObject(response.selectedCurrency);
    this.checkCurrencySymbol();
  };

  /**
   * Error function for getCurrency()
   * @param {Object} result : REST call response
   */
  CurrencyHelper.prototype.getCurrencyError = function(response) {
    throw "Not Implemented";
  };

  /**
   * Alphanumeric check on currency symbol
   * For alphanumeric currency symbols, add a space
   */
  CurrencyHelper.prototype.checkCurrencySymbol = function() {
    if(this.currencyObject().symbol.match(/^[0-9a-zA-Z]+$/)) {
      this.currencyObject().symbol = this.currencyObject().symbol + ' ';
    }
  };


  /**
   * Adjust the currency display based on the current currencies fractionalDigits
   * @param {String} number: The value to be formatted
   */
  CurrencyHelper.prototype.handleFractionalDigits = function(number, setFractionalDigits) {
    var fractionalDigits;

    // if the currencyObject() has no data, default to a fractional precision of 2
    if(typeof setFractionalDigits === 'number') {
      fractionalDigits = setFractionalDigits;
    } else {
      if(!this.currencyObject()) {
        fractionalDigits = 2;
      } else {
        fractionalDigits = this.currencyObject().fractionalDigits;
      }
    }

    if(number === null || number ==='') {
      return number;
    }

    return Number(number).toFixed(fractionalDigits);
  };
  

  /**
   * Adjust the currency display based on the current currencies fractionalDigits and locale using Jet converter
   * @param {String} number: The value to be formatted
   */
  CurrencyHelper.prototype.handleFractionalDigitsAndLocale = function(number) {
    var fractionalDigits;

    if(this.setFractionalDigits() !== null) {
      fractionalDigits = this.setFractionalDigits();
    } else {
      // if the currencyObject() has no data, default to a fractional precision of 2
      if (!this.currencyObject()) {
        fractionalDigits = 2;
      } else {
        fractionalDigits = this.currencyObject().fractionalDigits;
      }
    }

    if (number == null || number === '') {
      return number;
    }
    number = numberFormatHelper.formatNumber(number, fractionalDigits, this.DECIMAL_NUMBER_FORMAT);
    return number;
  };

  /**
   * Endpoint call to get the priceGroupList
   **/
  CurrencyHelper.prototype.getCurrencyMapCurrencies = function() {
    var data = {};
    data.defaultFirst = true;
    ccRestClient.request(
      ccConstants.ENDPOINT_LIST_PRICE_LIST_GROUPS,
      data,
      this.getCurrencyMapCurrenciesSuccess.bind(this),
      this.getCurrencyMapCurrenciesError.bind(this)
    );
  };

  /**
   * Success function for getCurrencyMapCurrencies()
   * @param {Object} pResult : REST call response
   **/
  CurrencyHelper.prototype.getCurrencyMapCurrenciesSuccess = function(pResult) {
    // make the default price list group id more easily accessible within viewModels
    pResult['defaultPriceListGroupId'] = pResult.defaultPriceListGroup.id;

    $.each(pResult.items, function(ii){
      pResult.items[ii]['isDefaultPriceListGroup'] = pResult.items[ii].id === pResult.defaultPriceListGroup.id;
    });

    this.currencyMapObject(pResult);
  };

  /**
   * Error function for getCurrencyMapCurrencies()
   * @param {Object} pResult : REST call response
   **/
  CurrencyHelper.prototype.getCurrencyMapCurrenciesError = function(pResult) {};


  /**
   * return the model
   **/
  return new CurrencyHelper();
});
