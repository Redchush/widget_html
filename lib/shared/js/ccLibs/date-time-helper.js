/*global $ */

define('dateTimeHelper',
['moment'],

function(moment) {
  "use strict";
  
  /**
   * Creates a DateTimeHelper.
   * @private
   * @static
   * @class The Date time helper provides helper methods for
   * manipulating date and time
   */
  function DateTimeHelper() {
    return (this);
  }

  /**
   * Takes time in HH:MM AM/PM format and converts to 24 hours format
   * @param {Object} time
   */
  DateTimeHelper.prototype.convertTo24Hour = function(time) {
    var hours,newHour, timeSplit;
    /*to replace any LEFTOTRIGHT MARK added by toLocaleTimeString function in IE 11 only*/
    time = time.replace(/[^ -~]/g,'');
    hours = parseInt(time.substr(0, 2), 10);
    if(time.indexOf('am') != -1 && hours == 12) {
      time = time.replace('12', '00');
    }
    if(time.indexOf('pm') != -1 && hours < 12) {
      newHour = hours;
      if (time.substr(0, 2)[0] == '0') {
        newHour = '0' + hours;
      }
      time = time.replace(newHour, (hours + 12));
    }
    // to put '0' in front of hour if single digit
    if(time.indexOf('am') != -1 && hours < 10) {
      newHour = hours;
      if (time.substr(0, 2)[0] !== '0') {
        time = time.replace(newHour, ('0'+ newHour));
      }
    }

    timeSplit = time.split(' ');
    return timeSplit[0];
  };

  /**
   * Gets GMT offset to the date time value
   * @param {Object} localDate
   */
  DateTimeHelper.prototype.getGMTOffset = function(localDate) {
    var positive = (localDate.getTimezoneOffset() > 0);
    var aoff = Math.abs(localDate.getTimezoneOffset());
    var hours = Math.floor(aoff / 60);
    var mins = aoff % 60;
    var offsetTz = this.padZero(hours) + ':' + this.padZero(mins);
    // getTimezoneOffset() method returns difference between (GMT) and local time, in minutes.
    // example, If your time zone is GMT+2, -120 will be returned.
    // This is why we are inverting sign
    if(!positive) {
      return '+' + offsetTz;
    }
    return '-' + offsetTz;
  };

  /**
   * Gets GMT offset to the date time value
   * @param {Object} localDate
   */
  DateTimeHelper.prototype.padZero = function(number) {
    return number < 10 ? '0' + number : number.toString();
  };
  
   /**
   * Gets ISO date and converts to separate date and time
   * @param {Object} isoDate
   */
  DateTimeHelper.prototype.convertIsoDateToDateTime = function(isoDate) {
    var date = new Date(isoDate), time = this.convert24to12Hours(date),
    month = date.getMonth()+1, year = date.getYear(), dateTime;
    if(year < 2000){
      year = 1900 + year;
    }
    dateTime = this.padZero(month)+"/"+this.padZero(date.getDate())+"/"+year+"  "+time;
    return dateTime;
  };
  
  /**
   * Converts time from 24 hour format to 12 hours with meridian
   * @param {Object} isoDate
   */
  DateTimeHelper.prototype.convert24to12Hours = function(isoDate) {
    var dd = "AM";
    var hours = isoDate.getHours();
    if(hours >= 12) {
      hours = hours - 12;
      dd = "PM";
    }
    if(hours === 0) {
      hours = 12;
    }
    var minutes = isoDate.getMinutes();
    return (this.padZero(hours) + ":" + this.padZero(minutes) + " " + dd);
  };

  DateTimeHelper.prototype.combineDateAndTime = function(date, time) {
    var dateTimeSplit, selectedTime, isoDate, initialDate;
    try {
      isoDate = date.toISOString();
      initialDate = date;
    } catch(err) {
      //manual date change for IE-9 only
      if (date) {
        initialDate = new Date(date);
        if(isNaN(initialDate.getTime())) {
          return;
        }
        isoDate = new Date(date.toString()).toISOString();
      } else {
        return;
      }
    }
    
    if(!time) {
      return date;
    }
    
    dateTimeSplit = isoDate.split('T');
    return dateTimeSplit[0] + "T" + 
        this.convertTo24Hour(time.toString().toLowerCase()).trim() + ":00.000" +
        this.getGMTOffset(initialDate);
  
  };
  
  /** This function is used to convert the date and time passed from 
   * (mainly promotions) page to a single ISO datetime format
   * (like 03-22-2015T22:22:22.000+5:30).
   * @param {String} date 
   * @param {String} time
  */
  DateTimeHelper.prototype.ojetCombineDateAndTime = function(date, time) {
    var dateTimeSplit, selectedTime, isoDate, initialDate;
    try {
      isoDate = date.toISOString();
      initialDate = date;
    } catch(err) {
      //manual date change for IE-9 only
      if (date) {
        initialDate = new Date(date);
        if(isNaN(initialDate.getTime())) {
          return;
        }
        isoDate = new Date(date.toString()).toISOString();
      } else {
        return;
      }
    }
    
    if(!time) {
      return date;
    }
    
    dateTimeSplit = isoDate.split('T');
    return dateTimeSplit[0] + time.toString() + ".000" + this.getGMTOffset(initialDate);
  };
  
  /**
   * Change JET supplied date and time (from ojInputDateTime) to
   * format expected by rest endpoint.
   * @param {pDate} DateTime string from JET component.
   * @returns DateTimeString correctly formatted for REST endpoint.
   */
  DateTimeHelper.prototype.ojetFormatDateAndTime = function(pDate) {
    var pMomentDate;

    // format the string
    pMomentDate = moment(pDate).format();
    // add milliseconds because the endpoint won't accept a value without it
    pMomentDate = pMomentDate.slice(0,19) + '.000' + pMomentDate.slice(19);

    return pMomentDate;
  };

  return new DateTimeHelper();
});
