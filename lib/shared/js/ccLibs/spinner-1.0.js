/*global $, setTimeout: false, document */
define('spinner', ['knockout', 'imagesloaded'],
  function(ko, imagesLoaded) {

  "use strict";
  /**
   * Creates a Loading Indicator (aka, Spinner)
   * @private
   * @static
   * @class 
   *
   * OPTIONS:
   * itemCount: the number of items that are expected to be rendered [required]
   * parent: the element that is doing the rendering [required]
   * selector: the element that should have the curtain & spinner [default: parent]
   * centerOn: when parent is 'body', centerOn is the dom element to position the spinner within.
   * posTop: the top position [default: 50%]
   * posLeft: the left position [default: 44%]
   */
   
   function Spinner() {
    var self = this;
    self.spinnerId = 'cc-spinner';
    self.spinnerContainer = 'cc-spinner';
    self.spinnerCSS = 'cc-spinner-css';
    self.spinnerTimeOutId = null;

    /**
     * Function to call from viewModel to initiate the activity indicator
     * @param {Object} data: json containing display options.
     * @private
     */
    self.create = function(data) {
      self.time = new Date().getTime();
      self.parent = data.parent;
      self.selector = data.selector? data.selector : data.parent;
      self.centerOn = data.centerOn;
      self.posTop = data.posTop ? data.posTop : '50%';
      self.posLeft = data.posLeft ? data.posLeft : '44%';
      self.loadingText = data.loadingText ? data.loadingText : 'Loading...';
      self.processingText = data.processingText;
      self.processingPosTop = data.processingPosTop? data.processingPosTop : '5%';
      self.textWidth = data.textWidth ? data.textWidth : "100%";

      // check for parent
      if(!self.parent) {
        return false;
      } else if(self.parent === 'body') {
        // if the parent is body, and there is an element to center on, do the math for positioning.
        if(self.centerOn && $(self.centerOn).length !== 0) {
          self.posTop = ($(self.centerOn).height() / 2 - 27) + $(self.centerOn).position().top + 'px';
          self.processingPosTop = ($(self.centerOn).height() / 2 - 54) + $(self.centerOn).position().top + 'px';
          self.posLeft = ($(self.centerOn).width() / 2 - 27) + $(self.centerOn).position().left + 'px';
        } else {
          // else center the spinner in the window.
          self.posTop = $(window).height() / 2 - 27 + 'px';
          self.processingPosTop = $(window).height() / 2 - 54 + 'px';
          self.posLeft = $(window).width() / 2 - 27 + 'px';
        }
      }

      // build out the spinner if there isn't one already in place.
      // the cc-spinner-exclude check allows hard coded spinner to not interfere with
      // other spinners.
      if($(self.selector).find('.' + self.spinnerContainer).not('.cc-spinner-exclude').length === 0) {
        self.buildCSS(self.selector, self.posTop, self.posLeft);
        if (data.createWithTimeout) {
          self.setDestroyTimeout(data.waitTime, data.callBackFn, data.context);
        }  
      }
    };

    /**
     * Function to call from viewModel to initiate the activity indicator
     * @param {String} selector: the target element for our curtain
     * @param {String} postTop: top position of spinner element
     * @param {String} postLeft: left position of spinner element
     * @private
     */
    self.buildCSS = function(selector, posTop, posLeft) {
      var container, spinnerDiv;
      
      // build outer container of indicator
      container = $('<div />').attr({
        id: self.spinnerId,
        'class': self.spinnerContainer
      });

      // inner container of indicator
      spinnerDiv = $('<div />').attr({
        'class': self.spinnerCSS, 
        style: 'top:' + posTop +';left:' + posLeft
      });

      // individual spokes for indicator
      for(var i=1;i<13;i++) {
        $(spinnerDiv).append($('<div />').attr({'class': self.spinnerCSS + '-' + i}));
      }

      // append and prepend as necessary;
      // loading text is a fallback for IE/accessibility
      if(self.processingText){
        $(container).prepend($('<div/>').css("padding-top", self.processingPosTop).append($('<span class="center-block"/>').css("width", self.textWidth).text(self.processingText)));
      }else{
        $(spinnerDiv).prepend($('<span class="ie-show">').text(self.loadingText));
      }
      $(container).append(spinnerDiv);
      if(selector === 'body') {
        $(selector).prepend(container);  
      } else {
        $(selector).append(container);
      }
      
    };

    /**
     * Function to call from viewModel to initiate the activity indicator
     * @param {String} itemCount: the number of items we need to find
     * @param {Object} data: json object container display options
     * @private
     */
    self.loadCheck = function(itemCount, data) {
      if(itemCount || itemCount == 0) {
        // re-apply the spinner if it isn't there
        if($(self.selector).find('.' + self.spinnerContainer).length === 0) {
          self.buildCSS(self.selector, self.posTop, self.posLeft);
        }

        // if there are images as part of our parent, check for their load status,
        // otherwise just pass to destroy function
        if($(self.parent + ' img')) {
          $(self.parent + ' img').imagesLoaded(function() {
            self.destroy(itemCount, self.parent, self.selector);
          });
        } else {
          self.destroy(itemCount, self.parent, self.selector);
        }

      }
    };

    /**
     * Function to call from viewModel to initiate the activity indicator
     * @param {String} itemCount: the number of items we need to find
     * @private
     */
    self.destroy = function(itemCount) {
      var delay, removeDelay;
      // resolve the 'this' problem in setTimeout with new var's
      var selector = self.selector;
      var spinnerContainer = self.spinnerContainer;
      // when the # of children matches what we expect OR we hit our stack size limit, 
      // remove the spinner & curtain, otherwise, loop back and check again.
      delay = self.time + 250 - (new Date()).getTime();
      
      if($(self.parent).children().length === itemCount) {
        // artificial delay on spinner removal for aesthetics.
        if(delay > 0) {
          removeDelay = setTimeout(self.destroyWithoutDelay, delay);
        } else {
          self.destroyWithoutDelay();
        }
      } else if(!itemCount || itemCount === null) {
        if(delay > 0) {
          //Passing the selector as an argument to destroyWithoutDelay will ensure that 
          //the spinner created by this specific selector will be destroyed.
          removeDelay = setTimeout(self.destroyWithoutDelay(selector), delay);
        } else {
          self.destroyWithoutDelay();
        }
      } else {
        setTimeout(self.destroy, 1);
      }
    };
    
    /**
     * Function to destroy spinner instantly.
     * Useful if there is a spinner help text along with spinner to help with smooth transition 
     * @private
     */
    self.destroyWithoutDelay = function(pSpinnerId) {
      var selector = pSpinnerId ? pSpinnerId : self.selector;
      var spinnerContainer = self.spinnerContainer;
      $(selector).find('.' + spinnerContainer).remove();
    };

    /**
     * Function to create spinner with time out.
     * This creates a spinner and sets wait time, after which the spinner is destroyed. 
     * @param {Object} data: json containing display options.
     * @param {String} waitTime: number of milliseconds to wait before destroy
     * @param {Object} callBackFn: call back function to be invoked
     * @param {Object} context: context to bind self/this to call back function
     * @private
     */
    self.createWithTimeout = function(data, waitTime, callBackFn, context) {
      data.waitTime = waitTime;
      data.callBackFn = callBackFn;
      data.context = context;
      data.createWithTimeout = true;
      self.create(data);      
    };

    /**
     * Function to destroy spinner and clears waiting time.
     * @param {Object} callBackFn: call back function to be invoked
     * @param {Object} context: context to bind self/this to call back function
     * @private
     */
    self.destroyAndClearTimeout = function(callBackFn, context) {
      self.destroyWithoutDelay();
      if (self.spinnerTimeOutId != null) {
        clearTimeout(self.spinnerTimeOutId);
      }
      if (callBackFn != null) {
        callBackFn.call(context);
      }
      
    };

    /**
     * Function to set time out interval.
     * This sets wait time, after which the spinner is destroyed. 
     * @param {String} waitTime: number of milliseconds to wait before destroy
     * @param {Object} callBackFn: call back function to be invoked
     * @param {Object} context: context to bind self/this to call back function
     * @private
     */
    self.setDestroyTimeout = function (waitTime, callBackFn, context) {
      self.spinnerTimeOutId = setTimeout(function() {
        self.destroyWithoutDelay();
        if (callBackFn != null) {
          callBackFn.call(context);
        }
      }, waitTime);
    };
    
    /**
     * Function to create spinner with time out and Return the timeout Id .
     * This creates a spinner and sets wait time, after which the spinner is destroyed. 
     * @param {Object} data: json containing display options.
     * @param {String} waitTime: number of milliseconds to wait before destroy
     * @param {Object} callBackFn: call back function to be invoked
     * @param {Object} context: context to bind self/this to call back function
     * @private
     */
    self.createAndReturnWithTimeout = function (data, waitTime, callBackFn, context) {
      self.create(data);
      self.setDestroyTimeout(waitTime, callBackFn, context);
      return self.spinnerTimeOutId;
    };
    
    /**
     * Function to destroy spinner and clears waiting time with a particular spinnerId.
     * @param {Object} callBackFn: call back function to be invoked
     * @param {Object} context: context to bind self/this to call back function
     * @private
     */
    self.destroyAndClearTimeoutWithId = function(pSpinnerId, timeoutId, callBackFn, context) {
      self.destroyWithoutDelay(pSpinnerId);
      if (timeoutId != null) {
        clearTimeout(timeoutId);
      }
      if (callBackFn != null) {
        callBackFn.call(context);
      }
    };   
  }

  return new Spinner();
});

