  /**
   * @fileoverview Helper for using jet's ojComponent to get date and/or time formatted and localized
   * according to the browser locale. The locale for ojComponent is picked up by the lang attribute of html
   * 
   */
define(
//-------------------------------------------------------------------
// PACKAGE NAME
//-------------------------------------------------------------------
'dateTimeUtils',

//-------------------------------------------------------------------
// DEPENDENCIES
//-------------------------------------------------------------------
['ojs/ojcore', 'ojs/ojvalidation'],

//-------------------------------------------------------------------
// MODULE DEFINITION
//-------------------------------------------------------------------
function() {
  "use strict";

  function DateTimeUtils() {
  }
  // Constants
  DateTimeUtils.prototype.DEFAULT_FORMAT_TYPE = "datetime";
  DateTimeUtils.prototype.DEFAULT_FORMAT = "short";

  /** 
   * Retrieves the date and time format string from jet converter based on the current locale and the requested
   * date and/or time size format
   * @param {inputDateTime} The ionput date and/or time to be converted
   * @param {displayFormatType} It determines the 'standard' date and/or time format lengths to use. Allowed values: "date", "time", "datetime".
   * @param {displayDateFormat} The format of date to be displayed - 'short' (default), 'medium', 'long', 'full'
   * @param {displayTimeormat}  The format of time to be displayed - 'short' (default), 'medium', 'long', 'full'
   * @returns The date format string 
   */
  
  DateTimeUtils.prototype.getFormattedDateTime = function(inputDateTime, displayFormatType, displayDateFormat, displayTimeFormat) {
    var formattedDateTime, converterFactory, dateTimeConverter, dateTimeOptions, dateTimeConverter, dateToConvert, convertedDate;
    if (!displayFormatType) {
      displayFormatType = this.DEFAULT_FORMAT_TYPE;
    }
    if (!displayDateFormat) {
      displayDateFormat = this.DEFAULT_FORMAT;
    }
    if (!displayTimeFormat) {
      displayTimeFormat = this.DEFAULT_FORMAT;
    }
    converterFactory = oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME);
    dateTimeOptions = {
      formatType : displayFormatType,
      dateFormat : displayDateFormat,
      timeFormat : displayTimeFormat
    };
    dateTimeConverter = converterFactory.createConverter(dateTimeOptions);
    dateToConvert = new Date(inputDateTime);
    convertedDate = oj.IntlConverterUtils.dateToLocalIso(dateToConvert);
    formattedDateTime = dateTimeConverter.format(convertedDate);
    return formattedDateTime;
  };
  
  /** 
   *Returns true or false whether date is parsed by oj or not
   * @param {inputDateTime} The input date and/or time to be converted
   * @param {displayFormatType} It determines the 'standard' date and/or time format lengths to use. Allowed values: "date", "time", "datetime".
   * @param {displayDateFormat} The format of date to be displayed - 'short' (default), 'medium', 'long', 'full'
   * @param {displayTimeormat}  The format of time to be displayed - 'short' (default), 'medium', 'long', 'full'
   * @returns The date format string 
   */
  
  DateTimeUtils.prototype.validateDate = function(inputDateTime) {
    var formattedDateTime, converterFactory, dateTimeConverter, dateTimeOptions, dateTimeConverter, dateToConvert, displayFormatType, displayDateFormat, displayTimeFormat;
    displayFormatType = 'date';
    displayDateFormat = this.DEFAULT_FORMAT;
    displayTimeFormat = this.DEFAULT_FORMAT;
    converterFactory = oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME);
    dateTimeOptions = {
      formatType : displayFormatType,
      dateFormat : displayDateFormat,
      timeFormat : displayTimeFormat
    };
    dateTimeConverter = converterFactory.createConverter(dateTimeOptions);
    try {
      dateTimeConverter.parse(inputDateTime);
      return  true;
      } catch (pError){
      return false;
    }
  };
  
  /** 
   *Returns true or false whether time is parsed by oj or not
   * @param {inputDateTime} The input date and/or time to be converted
   * @param {displayFormatType} It determines the 'standard' date and/or time format lengths to use. Allowed values: "date", "time", "datetime".
   * @param {displayDateFormat} The format of date to be displayed - 'short' (default), 'medium', 'long', 'full'
   * @param {displayTimeormat}  The format of time to be displayed - 'short' (default), 'medium', 'long', 'full'
   * @returns The date format string 
   */
  
  DateTimeUtils.prototype.validateTime = function(inputDateTime) {
    var formattedDateTime, converterFactory, dateTimeConverter, dateTimeOptions, dateTimeConverter, dateToConvert, displayFormatType, displayDateFormat, displayTimeFormat;
    displayFormatType = 'time';
    displayDateFormat = this.DEFAULT_FORMAT;
    displayTimeFormat = this.DEFAULT_FORMAT;
    converterFactory = oj.Validation.converterFactory(oj.ConverterFactory.CONVERTER_TYPE_DATETIME);
    dateTimeOptions = {
      formatType : displayFormatType,
      dateFormat : displayDateFormat,
      timeFormat : displayTimeFormat
    };
    dateTimeConverter = converterFactory.createConverter(dateTimeOptions);
    try {
      dateTimeConverter.parse(inputDateTime);
      return  true;
      } catch (pError){
      return false;
    }
  };

  return new DateTimeUtils();
});
