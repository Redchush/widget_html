  /**
   * @fileoverview Helper for using jet's ojComponent to get number formatted and localized
   * according to the browser locale. The locale for ojComponent is picked up by the lang attribute of html
   * 
   */
define('numberFormatHelper',
['ojs/ojcore'],

function() {
  "use strict";

  /**
   * Creates a NumberFormatHelper
   */
  function NumberFormatHelper() {
  }

  /**
   * Adjust the formatting, grouping of number based on locale and fractionalDigits from currency settings and browser locale
   * @param {String} number: The value to be formatted
   * @param {String} fractionalDigits: Fractional precision derived from currency - minor unit
   * @param {String} numberType: decimal
   */
  NumberFormatHelper.prototype.formatNumber = function(number, fractionalDigits, numberType) {
    var fractionalDigits, numberDisplayString, converterFactory, converter;
    converterFactory = oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_NUMBER);
    var options = {
      style : numberType,
      minimumIntegerDigits : 1,
      minimumFractionDigits : fractionalDigits,
      maximumFractionDigits : fractionalDigits,
      useGrouping : true
    }
    converter = converterFactory.createConverter(options);
    numberDisplayString = converter.format(number);
    return numberDisplayString;
  }; 


  return new NumberFormatHelper();
});
