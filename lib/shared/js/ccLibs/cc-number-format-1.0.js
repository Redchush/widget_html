  /**
   * @fileoverview CC Library for number formatting in various locale
   * @version: 1.0
   * 
   */
define(
//-------------------------------------------------------------------
// PACKAGE NAME
//-------------------------------------------------------------------
'ccNumber',

//-------------------------------------------------------------------
// DEPENDENCIES
//-------------------------------------------------------------------
[ 'CCi18n' ],

//-------------------------------------------------------------------
// MODULE DEFINITION
//-------------------------------------------------------------------
function(CCi18n) {
  "use strict";
  
  function CCNumber() {
  }
  
  /**
   * Gets the current format from the locale file and formats the given number as required
   * @param The number to be formatted
   * @param Whether the number is a currency
   * @param The precision, if needed to be overridden
   * @returns The formatted date based on the locale
   */
  CCNumber.prototype.formatNumber = function(pNumber, isCurrency, pPrecision) {
    var numberFormatResourceKey = "ns.ccformats:resources.numberformat";
    var numberFormat = CCi18n.t(numberFormatResourceKey);

    // Strange issue in design studio where number format is not being returned
    // from the resource.  Setting to default for en.
    if (!numberFormat || numberFormat === numberFormatResourceKey) {
      numberFormat = "000,000,000.00";
    }

    // For the decimal points
    var dPlaceHolder = "";
    // For digits after decimal
    var precision = -1;
    // Primary placeholder for groups
    // of digits in thousand
    var pPlaceHolder = "";
    var j = 0;
    // The format parser
    for (var i = numberFormat.length - 1; i >= 0; i--) {
      if (isNaN(parseInt(numberFormat[i], 10)) && precision == -1) {
        precision = j;
        dPlaceHolder = numberFormat[i];
        continue;
      }
      if (precision > -1 && isNaN(parseInt(numberFormat[i], 10))) {
        pPlaceHolder = numberFormat[i];
        break;
      }
      j++;
    }
    
    // Make sure the value is proper.
    if (!isNaN(pPrecision)) {
      precision = pPrecision;
    }
    
    return this.formatNumberFromData(pNumber, precision, dPlaceHolder, pPlaceHolder, isCurrency);
  };
  
  /**
   * Returns formatted date given the precision and placeholder for the decimal and the thousand separator
   * @param {number} The number to be formatted
   * @param {precision} The decimal precision of the number
   * @param {dPlaceHolder} The decimal placeholder
   * @param {pPlaceHolder} The thousands placeholder
   * @returns the formatted number using the precision and the placeholder
   */
  CCNumber.prototype.formatNumberFromData = function(number, precision, dPlaceHolder, pPlaceHolder, isCurrency) {
    if(number === "") {
      return "";
    }
    if(isNaN(number)) {
      return "";
    }
    if((jQuery.trim(number)).length == 0) {
      return "";
    }
    
    var fNumber = "";
    fNumber = parseFloat(number).toFixed(precision).toString();
    /* If it is not a currency then a whole number should be displayed without decimal points whereas, if it is 
     * a currency, it should be displayed with fractional part (eg.30 displayed as 30 for number of products, and 
     * as 30.00 for a price.)
     */
    if(!isCurrency) {
      fNumber = parseFloat(fNumber).toString();
    }
    
    var sign = parseFloat(fNumber) >= 0 ? "" : "-";
    var dNumber = "";
    var wNumber = parseFloat(fNumber) >= 0 ? Math.floor(parseFloat(fNumber)) : Math.ceil(parseFloat(fNumber));
    wNumber = Math.abs(wNumber);
    var dFlag = fNumber.indexOf(".") > -1 ? true : false;
    if (dFlag === true) {
      dNumber = fNumber.substring(fNumber.indexOf(".") + 1, fNumber.length);
    }
    // Rebuilding number from right to left
    fNumber = "";
    // Putting the decimal part with its placeholder if it exists
    if (dNumber !== "") {
      fNumber = dPlaceHolder + dNumber;
    }
    // Using a global regex to get all the thousands places and put the placeholder text in place
    fNumber = sign + wNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, pPlaceHolder) + fNumber;
    
    return fNumber;
  };
  
  return new CCNumber();
});

