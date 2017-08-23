/**
 * @fileoverview General knockout extensions that DO NOT require access to
 * specific cloud commerce details.  For instance, there should be nothing in
 * this file that relates to ATG item-descriptor or property-descriptor
 * functionality.  Any extensions that require knowledge of cloud commerce
 * functionality should go in cc-knockout-extensions.js.

 */
/*global Image, $, window, setTimeout: false */
define('koExtensions',['knockout', 'CCi18n', 'currencyHelper', 'ccDate', 'ccImageZoom', 'ccNumber', 'numberFormatHelper',
  'ccConstants', 'moment', 'jqueryui', 'bootstrapDatePicker', 'bootstrapTimePicker', 'tagsInput',
  'spectrumColorPicker', 'bootstrap', 'chosen', 'jquerymswipe','ojs/ojcore', 'ojs/ojvalidation'],
function (ko, CCi18n, currencyHelper, ccDate, CCImageZoom, ccNumber, numberFormatHelper, CCConstants, moment) {

  "use strict";

  /**
   * The Select2 binding handles implementing the Select2 plugin,
   * Examples & Documentation: <a href="http://ivaynberg.github.io/select2/index.html">http://ivaynberg.github.io/select2/index.html</a>.
   * 
   * <h2>Parameters:</h2>
   * <ul>
   *   <li><code>{String|function} [ccFormatInputTooShortKey]</code> - The string or function to be used to display the 'input too short' error message.</li>
   *   <li><code>{String|function} [ccFormatInputTooLongKey]</code> - The string or function to be used to display the 'input too long' error message.</li>
   *   <li><code>{String|function} [ccFormatSelectionTooBigKey]</code> - The string or function to be used to display the 'selection too big' error message.</li>
   *   <li><code>{String|function} [ccFormatNoMatches]</code> - The string or function to be used to display the 'no matches' message.</li>
   *   <li><code>{String|function} [ccFormatLoadMore]</code> - The string or function to be used to display the 'load more results' message.</li>
   *   <li><code>{String|function} [ccFormatSearching]</code> - The string or function to be used to display the 'searching' message.</li>
   *   <li><code>{String|function} [ccPlaceholderAdjustWidth]</code> - The element to focus on when the popover is shown.</li>
   *   <li><code>{boolean} [ccHideDrop]</code> - Set display of the search results dropdown.</li>
   *   <li><code>{boolean} [ccEnabled]</code> - Set the interactivity of the select2 element.</li>
   * </ul>
   * 
   * <p>
   * It is also possible to supply any of the native plugin options in the binding declaration. 
   * See <a href="http://select2.github.io/select2/#documentation">http://select2.github.io/select2/#documentation</a> for details.
   * </p>
   *
   * @public
   * @class Wrapper around the select2 plugin.
   * @example
   * 
   * &lt;input id="cc-copy-product-collection-picker" type="hidden"
   *   data-bind="
   *   value: copyCollectionTarget,
   *   select2: {
   *     minimumInputLength: 3,
   *     query: query,
   *     placeholder: $root.CCi18n.t('ns.common:resources.copyProductToCollectionPlaceholder'),
   *     ccPlaceholderAdjustWidth: false, 
   *     ccFormatInputTooShortKey: 'ns.common:resources.select2FormatInputTooShort',
   *     ccFormatInputTooLongKey: 'ns.common:resources.select2FormatInputTooLong',
   *     ccFormatSelectionTooBigKey: 'ns.common:resources.select2SelectionTooBig',
   *     ccFormatNoMatches: $root.CCi18n.t('ns.common:resources.select2FormatNoMatches'),
   *     ccFormatLoadMore: $root.CCi18n.t('ns.common:resources.select2LoadMore'),
   *     ccFormatSearching: $root.CCi18n.t('ns.common:resources.select2Searching')
   *   }"
   *   style="width: 100%">
   * &lt;/input>
   * 
   */
  ko.bindingHandlers.select2 = {
    /**
     * Add a screen reader friendly label.
     * Select2 doesn't read the label of the element until it focuses on the input box.
     * This function prepends a screen reader friendly span with the label so that
     * the user knows what element they're on before the chosen choice is read
     * @private
     * @param {Object} element - The element which is associated with the select2 plugin.
     */
    prependLabel : function(element) {
      if($(element)[0].labels && $(element)[0].labels.length > 0) {
        var addedLabelText = $(' <span />').attr('class', 'cc-reader-text').html($(element)[0].labels[0].innerHTML);
        $(element).select2("container").find('.select2-chosen:first-child').prepend(addedLabelText);
      }
    },
    
    /**
      The logic runs once to initialize the binding for this element.
      @private
      @param {Object} element The DOM element attached to this binding.
      @param {function(): object} valueAccessor A function that returns all of the values associated with this binding.
      @param {function(): object} allBindingsAccessor Object containing information about other bindings on the same HTML element.
    */
    init: function(element, valueAccessor, allBindingsAccessor) {
      var obj = valueAccessor(),
        allBindings = allBindingsAccessor(), lookupKey = allBindings.lookupKey,
        changeFired, ccSelect2PlacholderTester, ccSelect2PlacholderTesterWidth,
        self;

      self = ko.bindingHandlers.select2;

      // set some defaults; can be overridden in the template
      if (obj.ccFormatInputTooShortKey === undefined || obj.ccFormatInputTooShortKey === null) {
        obj.ccFormatInputTooShortKey = 'ns.common:resources.select2FormatInputTooShort';
      }
      if (obj.ccFormatInputTooLongKey === undefined || obj.ccFormatInputTooLongKey === null) {
        obj.ccFormatInputTooLongKey = 'ns.common:resources.select2FormatInputTooLong';
      }
      if (obj.ccFormatSelectionTooBigKey === undefined || obj.ccFormatSelectionTooBigKey === null) {
        obj.ccFormatSelectionTooBigKey = 'ns.common:resources.select2SelectionTooBig';
      }
      if (obj.ccFormatNoMatches === undefined || obj.ccFormatNoMatches === null) {
        obj.ccFormatNoMatches = CCi18n.t('ns.common:resources.select2FormatNoMatches');
      }
      if (obj.ccFormatLoadMore === undefined || obj.ccFormatLoadMore === null) {
        obj.ccFormatLoadMore = CCi18n.t('ns.common:resources.select2LoadMore');
      }
      if (obj.ccFormatSearching === undefined || obj.ccFormatSearching === null) {
        obj.ccFormatSearching = CCi18n.t('ns.common:resources.select2Searching');
      }
      if (obj.ccPlaceholderAdjustWidth === undefined || obj.ccPlaceholderAdjustWidth === null) {
        obj.ccPlaceholderAdjustWidth = true;
      }

      /*
       * Parse some of the message texts due to placeholders.  Wow, select2
       * really doesn't make this easy.
       */
      obj.formatInputTooShort = function (input, min) {
        var numberUnder = min - input.length,
            msg = CCi18n.t(obj.ccFormatInputTooShortKey, {'numberUnder': numberUnder});
        return msg;
      };
      obj.formatInputTooLong = function (input, max) {
        var numberOver = input.length - max,
            msg = CCi18n.t(obj.ccFormatInputTooLongKey, {'numberOver': numberOver});
        return msg;
      };
      obj.formatSelectionTooBig = function (limit) {
        var msg = CCi18n.t(obj.ccFormatSelectionTooBigKey, {'limit': limit});
        return msg;
      };
      obj.formatNoMatches = function () { return obj.ccFormatNoMatches; };
      obj.formatLoadMore = function (pageNumber) { return obj.ccFormatLoadMore; };
      obj.formatSearching = function() { return obj.ccFormatSearching; };

      $(element).select2(obj);

      // for pre-selected options add reader text to the 'remove' link immediately.
      $(element).select2("container").find('.select2-search-choice-close').each(function(ii, removeButton) {
        $(removeButton).html('<span class="cc-reader-text">' + CCi18n.t('ns.common:resources.removeText') + '</span>').attr('tabindex', 0);
      });

      // add aria-labels to the selected options and available option lists.
      $(element).select2('container').find('.select2-choices').attr('aria-label', CCi18n.t('ns.common:resources.ariaSelectedOptionsText'));
      $('.select2-results').attr('aria-label', CCi18n.t('ns.common:resources.ariaAvailableOptionsText'));

      if(typeof allBindings.select2.placeholder !== "undefined") {
        $(element).attr('placeholder', allBindings.select2.placeholder);
      }

      // Enable/disable the select2 element
      if(typeof allBindings.select2.ccEnabled !== "undefined") {
        $(element).select2("enable", allBindings.select2.ccEnabled);
      }

      var value, valueUpdated, selectedOptions, isPreselect = false;
      if (lookupKey) {
        value = ko.utils.unwrapObservable(allBindings.value);
        $(element).select2('data', ko.utils.arrayFirst(obj.data.results, function(item) {
          return item[lookupKey] === value;
        }));
      }
      ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
        $(element).select2('destroy');
      });

      // if the original value binding used an observable, then update the
      // value of the observable on change.
      value = allBindingsAccessor().value;
      valueUpdated = allBindingsAccessor().valueUpdated;
      isPreselect =  allBindingsAccessor().isPreselect;
      selectedOptions = allBindingsAccessor().selectedOptions;
      
      if(value && value.isModified){
        value.isModified.subscribe(function(newValue) {
          //added to display required field validation status
          if(newValue && $(element).prop('required') && (!value.isValid())){
            $($(element).select2("container")).addClass("invalid");
          }else{
            $($(element).select2("container")).removeClass("invalid");
          }
        });
      }
      if(value){
        value.subscribe(function(newValue) {
          //added to display required field validation status
          if($(element).prop('required') && (!value.isValid())){
            $($(element).select2("container")).addClass("invalid");
          }else{
            $($(element).select2("container")).removeClass("invalid");
          }
        });
      }

      changeFired = false;
      if(valueUpdated) {
        if(isPreselect && selectedOptions) {
          valueUpdated(selectedOptions);
        }
        $(element).on('change', function() {
          if(!changeFired) {
            changeFired = true;
            valueUpdated($(element).val());
            changeFired = false;
          }
        });
      } else if(value && ko.isObservable(value)) {
        $(element).on('change', function() {
          if(!changeFired) {
            changeFired = true;
            value($(element).val());
            
            changeFired = false;
          }
        });
      }

      // trigger the change event on blur
      if(value && ko.isObservable(value)) {
        $(element).on("select2-blur", function(e) {
          $(element).val(value()).trigger('change');
        });
      }

      // hide dropdown - ccHideDrop: true/false
      $(element).on("select2-open select2-close", function(e) {
        if(allBindings.select2.ccHideDrop) {
          $('.select2-drop').toggleClass('cc-select2-hideResults');
        }
      });

      // insert some screen reader text to multi-select remove buttons
      $(element).on('change', function(e) {
        $(element).select2("container").find('.select2-search-choice-close').each(function(ii, removeButton) {
          $(removeButton).html('<span class="cc-reader-text">' + CCi18n.t('ns.common:resources.removeText') + '</span>').attr('tabindex', 0);
        });
        if (element.selectedOptions && element.selectedOptions[0] && element.selectedOptions[0].label) {
          $(element).select2("container").find('.select2-chosen').attr('title', element.selectedOptions[0].label);
        } 
        self.prependLabel(element);
      });

      if(typeof allBindings.select2.placeholder !== "undefined" && allBindings.select2.ccPlaceholderAdjustWidth) {
        // width tester for placeholder text
        ccSelect2PlacholderTester = $('<div />').attr({
          id: 'cc-select2-placeholder-tester'
        }).text(allBindings.select2.placeholder);

        // add the tester, grab the width, remove the tester
        $('body').append(ccSelect2PlacholderTester);
        ccSelect2PlacholderTesterWidth = $('#cc-select2-placeholder-tester').width() + 30;
        $('body').remove('#cc-select2-placeholder-tester');

        // set the min and max width on the input field
        $(element).prev('.select2-container').find('.select2-input')
          .attr('placeholder', allBindings.select2.placeholder)
          .css({
            'min-width': ccSelect2PlacholderTesterWidth + 'px',
            'max-width': ccSelect2PlacholderTesterWidth + 'px'
        });
      }
    },

    /**
      update is run whenever an observable in the binding's properties changes.
      @private
      @param {Object} element The DOM element attached to this binding.
      @param {function(): object} valueAccessor A function that returns all of the values associated with this binding.
      @param {function(): object} allBindingsAccessor Object containing information about other bindings on the same HTML element.
      @param {Object} viewModel The viewModel that is the current context for this binding.
      @param {Object} bindingContext The binding hierarchy for the current context.
    */
    update: function(element, valueAccessor, allBindingsAccessor, bindingContext) {
      var allBindings = allBindingsAccessor(),  values = valueAccessor(), 
        initialDataQuery = allBindings.select2.initializeDataQuery, 
        valueUpdated = values.valueUpdated, self, addedLabelText;

      self = ko.bindingHandlers.select2;

      self.prependLabel(element);

      if (initialDataQuery) {
        var value = allBindingsAccessor().value;
        var currentData = $(element).select2('data');

        if(value && ko.isObservable(value)) {
          if (value() && currentData && currentData.length === 0) {
            initialDataQuery(value(), function(pData) {
              $(element).select2('data', pData);

              // Signal value is initialized and set it to unmodified state
              value.valueHasMutated();
              value.isModified(false);
            }, values.includeInvalidItems, currentData);
          }
          else if (!value()) {
            if(currentData && currentData.length > 0) {
              $(element).select2('data', []);
              // Signal value is initialized and set it to unmodified state
              value.valueHasMutated();
              value.isModified(false);
            } else if (valueUpdated) {
              valueUpdated([]);
            }
          }else if (value() && currentData && currentData.length > 0 && valueUpdated) {
              valueUpdated(currentData);
          }
        }
      }
      if (element.selectedOptions && element.selectedOptions[0] && element.selectedOptions[0].label) {
        $(element).select2("container").find('.select2-chosen').attr('title', element.selectedOptions[0].label);
      } 
    }
  };

  /**
   * @public
   * @class The select2Tags binding handles implementing the Select2 plugin in
   * tag mode.
   * Examples & Documentation: <a href="http://ivaynberg.github.io/select2/index.html">http://ivaynberg.github.io/select2/index.html</a>.
   * 
   * <h2>Parameters:</h2>
   * <ul>
   *   <li><code>{String|function} [ccFormatNoMatches]</code> - The string or function to be used to display the 'no matches' message.</li>
   *   <li><code>{Object} [ccTagOptions]</code> - The tag options - see below:
   *     <ul>
   *       <li><code>{boolean} sortable</code> - Are values sortable?</li>
   *       <li><code>{boolean} lockExisting</code> - Can existing values be removed?</li>
   *       <li><code>{boolean} disabled</code> - Can the user interact with the values?</li>
   *     </ul>
   *   </li>
   * </ul> 
   *
   * <p>
   * It is also possible to supply any of the native plugin options in the binding declaration. 
   * See <a href="http://select2.github.io/select2/#documentation">http://select2.github.io/select2/#documentation</a> for details.
   * </p>
   *
   * @example
   * &lt;input id="cc-optionValues-options" type="hidden" data-bind="
   *    value: $data.values,
   *    select2Tags: {
   *      width: '100%', 
   *      tags: [], 
   *      formatSelection: $parent.formatLocalizedValuesWrapper($data),
   *      ccTagOptions: {
   *        lockExisting: true,
   *        disabled: true
   *      }
   *    }" />
   */
  ko.bindingHandlers.select2Tags = {
    /**
      The logic runs once to initialize the binding for this element.
      @private
      @param {Object} element The DOM element attached to this binding.
      @param {function(): object} valueAccessor A function that returns all of the values associated with this binding.
      @param {function(): object} allBindingsAccessor Object containing information about other bindings on the same HTML element.
    */
    init: function (element, valueAccessor, allBindingsAccessor) {
      var obj = valueAccessor(), ccTagOptions, isNewValue;

      // grab default text for formatNoMatches if none is provided
      if (obj.ccFormatNoMatches === undefined || obj.ccFormatNoMatches === null) {
        obj.ccFormatNoMatches = CCi18n.t('ns.common:resources.select2FormatNoMatches');
      }

      // grab tagging options if they exist
      ccTagOptions = obj.ccTagOptions ? obj.ccTagOptions : null;

      // set the formatNoMatches string
      obj.formatNoMatches = function () { return obj.ccFormatNoMatches; };

      // do not allow duplicates despite case
      obj.createSearchChoice = function(term) {
        isNewValue = true;
        $.each($(element).select2('container').find('.select2-search-choice'), function(ii, choice) {
          if($.trim($(choice).text().toLowerCase()) == $.trim(term.toLowerCase())) {
            isNewValue = false;
          }
        });

        if(isNewValue) {
          return {id: $.trim(term), text: $.trim(term)};
        } else {
          // timeout required to let the dom add the element before we do anything
          window.setTimeout(function(e){
            $('.select2-no-results').text(CCi18n.t('ns.common:resources.select2NoDuplicateText'));
          }, 0);
        }
      };
      
      // calling to override select2 functions. This call must be DELETED after upgrading to latest version of select2.      
      overrideSelect2Functions();
      
      // prevent the removal of items that have been 'locked'
      $(element).select2(obj).on('select2-removing', function(e){
        $.each($(element).select2('container').find('.cc-select2-locked'), function(ii, tag) {
          if($.trim($(tag).text()) == e.val) {
            e.preventDefault();
          }
        });
      });

      // insert some screen reader text to multi-select remove buttons and
      // make them a focusable/tabbable element for usability
      $(element).on('change', function(e) {
        $(element).select2("container").find('.select2-search-choice-close').each(function(ii, removeButton) {
          $(removeButton).html('<span class="cc-reader-text">' + CCi18n.t('ns.common:resources.removeText') + '</span>').attr('tabindex', 0);
        });
      });
      
      // This call must be DELETED after upgrading to latest version of select2. 
      window.Select2.class.multi.prototype.skipDuplicateCheck = false;
      
      // configure tagging for this element
      if(ccTagOptions) {

        // are existing values locked
        if(ccTagOptions.lockExisting) {
          $.each($(element).select2("container").find("ul.select2-choices li.select2-search-choice"), function(ii, tag) {
            $(tag).addClass('cc-select2-locked');
          });
        }

        // is this disabled
        if(ccTagOptions.disabled) {
          $(element).select2("enable", false);
        }

        // is this sortable
        if(ccTagOptions.sortable) {
          $(element).select2("container").find("ul.select2-choices").sortable({
              containment: 'parent',
              start: function() { $(element).select2("onSortStart"); },
              update: function() { $(element).select2("onSortEnd"); }
          });
        }

      }
    },
    /**
      update is run whenever an observable in the binding's properties changes.
      @private
      @param {Object} element The DOM element attached to this binding.
      @param {function(): object} valueAccessor A function that returns all of the values associated with this binding.
      @param {function(): object} allBindingsAccessor Object containing information about other bindings on the same HTML element.
      @param {Object} viewModel The viewModel that is the current context for this binding.
      @param {Object} bindingContext The binding hierarchy for the current context.
    */
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {}
  };

  // 
  /**
   * This function is added to improve performance of rendering sku variant values.
   * 
   * It must be removed after select2 library is upgraded.
   */
  function overrideSelect2Functions() {
    // Added proprty to avoid duplicate check while initialization.
    window.Select2.class.multi.prototype.skipDuplicateCheck = true;
    // This is a workaround to resolve performance issue with select2
    window.Select2.class.multi.prototype.updateSelection = function (data) {
       var ids = [], filtered = [], self = this;
      
       if(!window.Select2.class.multi.prototype.skipDuplicateCheck)  {
         // filter out duplicates
         $(data).each(function () {
            if (indexOf(self.id(this), ids) < 0) {
              ids.push(self.id(this));
              filtered.push(this);
            }
         });
         data = filtered;
       }

       this.selection.find(".select2-search-choice").remove();
       $(data).each(function () {
            self.addSelectedChoice(this);
        });
        self.postprocessResults();
    };
      
    // This is a workaround to resolve performance issue with select2
    window.Select2.class.multi.prototype.setVal = function (val) {
       var unique;
       if (this.select) {
         this.select.val(val);
       } else {
         unique = [];
         if(!window.Select2.class.multi.prototype.skipDuplicateCheck)  {
           // filter out duplicates
           $(val).each(function () {
             if (indexOf(this, unique) < 0) unique.push(this);
           });
                
           this.opts.element.val(unique.length === 0 ? "" : unique.join(this.opts.separator));
        }               
      }
    }
    // This is a workaround to resolve performance issue with select2
    function indexOf(value, array) {
       var i = 0, l = array.length;
       for (; i < l; i = i + 1) {
         if (equal(value, array[i])) return i;
       }
       return -1;
    }

    // This is a workaround to resolve performance issue with select2
    function equal(a, b) {
      if (a === b) return true;
      if (a === undefined || b === undefined) return false;
      if (a === null || b === null) return false;
      // Check whether 'a' or 'b' is a string (primitive or object).
      // The concatenation of an empty string (+'') converts its argument to a string's primitive.
      if (a.constructor === String) return a+'' === b+''; // a+'' - in case 'a' is a String object
      if (b.constructor === String) return b+'' === a+''; // b+'' - in case 'b' is a String object
      return false;
    }
  };
  
  
  /**
   * @public
   * @class Simple binding to execute a function once an element is rendered on the page.
   * The function will be called with two arguments:
   * <ul>
   *   <li><code>element</code> - The element associated with the binding.</li>
   *   <li><code>viewModel</code> - The current view model associated with the binding.</li>
   * </ul>
   * E.g.
   * <pre>
     self.renderHandler = function(element, viewModel) {
       if(!viewModel.totalNumber() && viewModel.totalNumber() !== 0) {
         spinner.create(viewModel.publishScheduleLoadingOptions);
       }
     };
   * </pre>
   * @example
   * &lt;div id="cc-inventory-container" class="row" data-bind="onRender: renderHandler">
   */
  ko.bindingHandlers.onRender = {
    /**
      The logic runs once to initialize the binding for this element.
      @private
      @param {Object} element The DOM element attached to this binding.
      @param {function(): object} valueAccessor A function that returns all of the values associated with this binding.
      @param {function(): object} allBindingsAccessor Object containing information about other bindings on the same HTML element.
      @param {Object} viewModel The viewModel that is the current context for this binding.
      @param {Object} bindingContext The binding hierarchy for the current context.
    */
    init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
      var renderHandler = valueAccessor();
      if(typeof renderHandler === 'function') {
        renderHandler(element, viewModel);
      }
    }
  };

  (function() {
    //X and Y margins control the dynamic moving of which side
    //the tooltip appears on based on where it is in the window.
    var X_MARGIN_SMALL = 200, X_MARGIN_LARGE = 300,
        Y_MARGIN_SMALL = 100, Y_MARGIN_LARGE = 200,
        visible, closeVisible, getPlacement, closePopover, handleExternalEvent;

    /**
     * Handles user action on external elements (clicks or focuses)
     * Causes the popover to close.
     */
    handleExternalEvent = function(e) {
      if($(e.target).closest('.popover').length === 0) {
        closeVisible();
      }
    };

    /**
     * Closes the visible popover
     */
    closeVisible = function() {
      if(visible) {
        visible.data('bs.popover').tip().off('keydown');
        visible.popover('destroy');
        visible = null;
        $(document).off('click', handleExternalEvent);
        $(document).off('focusin', handleExternalEvent);
      }
    };

    /**
     * Gets the ultimate placement of the tooltip based on the window
     */
    getPlacement = function(placement, position) {
      var top, left, result, $win;
      $win = $(window);
      top = position.top - $win.scrollTop();
      left = position.left - $win.scrollLeft();

      //Top/Bottom replacement based on location on the screen
      if(top < Y_MARGIN_SMALL || (top < Y_MARGIN_LARGE && placement === "top")) {
        result = "bottom";
      } else if(top > $win.height() - Y_MARGIN_SMALL ||
                (top > $win.height() - Y_MARGIN_LARGE && placement === "bottom")) {
        result = "top";
      }

      //Left/Right replacement based on location on the screen
      if(left < X_MARGIN_SMALL || (left < X_MARGIN_LARGE && placement === "left")) {
        result = "right";
      } else if (left > $win.width() - X_MARGIN_SMALL ||
                 (left > $win.width() - X_MARGIN_LARGE && placement === "right")) {
        result = "left";
      }

      return result || placement;
    };

   /**
    * @public
    * @class Allows for an in-line popup editor for values.
    * Uses the Bootstrap 'popovers' functionality:
    * <a href="http://getbootstrap.com/javascript/#popovers">http://getbootstrap.com/javascript/#popovers</a>.
    * <h2>Parameters:</h2>
    * <ul>
    *   <li><code>{String} trigger='manual'</code> - The trigger event which will display the popover.</li>
    *   <li><code>{String} class</code> - The name of the CSS class to be given to the popover content DIV.</li>
    *   <li><code>{String} container='body'</code> - The element to append the popover content DIV to.</li>
    *   <li><code>{String} placement='right'</code> - The placement of the popover DIV: top | bottom | left | right | auto.</li>
    *   <li><code>{String} id</code> - The id of the popover.</li>
    *   <li><code>{String} [title]</code> - The title of the popover.</li>
    *   <li><code>{String} [focusElement]</code> - The element to focus on when the popover is shown.</li>
    *   <li><code>{Observable} property</code> - The property to edit.</li>
    *   <li><code>{Object} validate</code> - The validation properties.</li>
    *   <li><code>{Observable} enumeratedValues</code> - The list of selectable values (the tags).</li>
    *   <li><code>{String} type</code> - The editor type. One of:
    *   <ul>
    *    <li>'enumerated'</li>
    *     <li>'longText'</li>
    *     <li>'number'</li>
    *     <li>'price'</li>
    *     <li>'shortText'</li>
    *   </ul>
    *   </li>
    *   <li><code>{boolean} [wideMode]</code> - Use a wider popover header?.</li>
    * </ul>
    * @example
    * &lt;div class="modal" data-bind="popeditor: {type: 'number', class: 'cc-pop-number',
                      placement: 'bottom', validate: {required: true, digit: true, min: 0},
                      property: stockLevel, title: 'stockLevel'}, text: stockLevel}"/>
    */
    ko.bindingHandlers.popeditor = {
      /**
        The logic runs once to initialize the binding for this element.
        @private
        @param {Object} element The DOM element attached to this binding.
        @param {function(): object} valueAccessor A function that returns all of the values associated with this binding.
        @param {function(): object} allBindingsAccessor Object containing information about other bindings on the same HTML element.
        @param {Object} viewModel The viewModel that is the current context for this binding.
        @param {Object} bindingContext The binding hierarchy for the current context.
      */
      init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var $element, options, model, values = valueAccessor(), jetValidation = ko.observable(true), editorType = values.type;
 
        var tabTrap = ko.bindingHandlers.tabTrap;

        //Set the popover options, many can be overwritten by the binding values, but some are static
        //html is needed for the template to render,
        //container is body to ensure popover works on all elements
        //content is a div using the popover class which should set the z-index and height of the popover
        //this is necessary to ensure the popover positions correctly and that it doesn't pop-in awkwardly
        options = {
          html: true,
          trigger: values.trigger || "manual",
          content: "<div class='"+ values['class'] +"'></div>",
          container: values.container || 'body',
          placement: values.placement || "right"
        };

        $element = $(element);

        // plgProperty is a means by which to decouple the currencyMap observables
        // from the viewModel for the popeditor template
        values.plgProperty = ko.observable(null);

        if(editorType === 'currencyMap') {
          var plgProperty = {};

          $.each(values.property(), function(ii){
            plgProperty[ii] = ko.observable(ko.utils.unwrapObservable(this)).extend(values.validate);
            plgProperty[ii].jetValidation = ko.observable(true);
          });

          values.plgProperty(plgProperty);
        }


        if(editorType !== 'currencyMap') {
          values.validate.validatable = true;  
        }

        //Model used to render the popover template. Includes functions for saving and canceling the popover
        model = bindingContext.extend({
          id: values.id,
          title: values.title,
          focusElement: values.focusElement,
          property: ko.observable(ko.utils.unwrapObservable(values.property)).extend(values.validate),
          plgProperty: ko.observable(ko.utils.unwrapObservable(values.plgProperty)).extend(values.validate),
          enumeratedValues: ko.observable(ko.utils.unwrapObservable(values.enumeratedValues)),
          jetValidation: ko.observable(true),
          currencyHelper: currencyHelper,
          priceListGroups: values.priceListGroups,
          type: values.type,

          save: function() {
            if(model.type !== 'currencyMap' && (model.property.isValid() && jetValidation())) {
              //Copies the edit value to the base model value
              if(values.property() != model.property()) {
                values.property(model.property());
              }

              closeVisible();
              if($element.filter(":focusable").length > 0) {
                $element.focus();
              } else {
                $element.find(":focusable").focus();
              }

              // if nothing has changed, don't notify
              if(model.property.isModified()) {
                values.property.notifySubscribers(values.property(), "valueSubmitted");
              }
              return false;
            }

            if(model.type === 'currencyMap') {
              var plgIsModified = false;
              var plgIsValid = false;

              $.each(model.plgProperty(), function(ii) {
                if(this.isModified()) {
                  plgIsModified = this.isModified();
                  plgIsValid = this.isValid();
                }
              });


              if (plgIsModified && plgIsValid) {
                values.property(model.plgProperty());
                values.property.notifySubscribers(model.$parent, "valueSubmitted");
                model.close();
              } else if(plgIsModified && !plgIsValid) {
                return false;
              }
            }
          },

          //The cancel/close function for a manual close button
          close: function() {
            closeVisible();
            if($element.filter(":focusable").length > 0) {
              $element.focus();
            } else {
              $element.find(":focusable").focus();
            }
            return false;
          },

          //Focus on the element after the template has loaded
          focus: function(elements) {
            if(model.focusElement) {
              $(elements).find(model.focusElement).focus();
            } else {
              $(elements).find(":focusable").focus();
            }

            // constrain tabbing
            tabTrap.constrain($('.popover.in'));
          },

           //Catches jet's validation errors for non numric entries
          customJetOptionChangeListener: function(event, data) {
            var prop = null,
                context = ko.contextFor(this),
                currencyMap = context.type === 'currencyMap' ? true : false;

            if(currencyMap) {
              prop = context.plgProperty()[ko.dataFor(this).id];
            } else {
              // prop = ko.dataFor(this);
              prop = context;
            }

            prop.jetValidation(true);

            if (data['option'] === "messagesShown") {
              var valid = $(event.target).ojInputText("isValid");
              if (!valid) {
                prop.jetValidation(false);
              } else {
                prop.jetValidation(true);
              }
            } else {
              prop.jetValidation(true);
            }
          },
          
          // Convert the numbers to appropriate fractions so the number displayed and what gets stored matches.
          computedValueWithFractions : ko.pureComputed({
            read : function() {
              return model.property();
            },
            write : function(value) {
              if (value != undefined) {
                if(editorType === "number") {
                  model.property(value.toFixed(0));
                } else if(editorType === "price") {
                  model.property(value.toFixed(currencyHelper.currencyObject().fractionalDigits));
                }
              } else  {
                model.property(value);
              }
            }
          }),

          //Render the popover model using the page's localization resources
          //TODO: Fix to support storefront & admin with localization
          // commonResources: bindingContext.$root.commonResources,
          // pageResources: bindingContext.$root.pageResources
        });

        //Click handler for the element to open or close the tooltip from the anchor element
        $element.click(function(e) {
          var $tip, position, placement, focusHandler;

          e.preventDefault();
          //Determine placement based off of screen position of the element
          options.placement = getPlacement(values.placement, $element.offset());

          $element.popover(options); //Remake the popover using updated options
          $tip = $element.data('bs.popover').tip();

          //'in' is only present for a visible tip
          if($tip.hasClass('in')) {
            closeVisible();
            if($element.filter(":focusable").length > 0) {
              $element.focus();
            } else {
              $element.find(":focusable").focus();
            }
          } else {
            //Close any other open popover
            closeVisible();

            //Reset the edit value
            if(model.type === 'currencyMap') {

             var plgProperty = {};

              $.each(values.property(), function(ii){
                plgProperty[ii] = ko.observable(ko.utils.unwrapObservable(this)).extend(values.validate);
                plgProperty[ii].jetValidation = ko.observable(true);
              });

              values.plgProperty(plgProperty);

              model.plgProperty(ko.utils.unwrapObservable(values.plgProperty)).extend(values.validate);

              $.each(model.plgProperty(), function(ii) {
                model.plgProperty()[ii].extend({validatable: true});
                model.plgProperty()[ii].errors = null;
                model.plgProperty()[ii].isModified(false);
                model.plgProperty()[ii].forcedModified = false;
              });
            } else {
              model.property(ko.utils.unwrapObservable(values.property));
              model.property.errors = null;
              model.property.isModified(false);
              model.property.forcedModified = false;
            }

            //Add the class and template to the popover
            $tip.addClass(values['class']);
            $tip.children('.popover-content').attr('data-bind', "template: {name: '" + values.type + "', templateUrl: 'templates/popeditors', afterRender: focus}");

            if (values.wideMode) {
              // Add the wide header template to the popover
              $tip.children('.popover-title').attr('data-bind', "template: {name: 'wide-header', templateUrl: 'templates/popeditors'}");

              // add the wide class
              $tip.addClass("cc-pop-wide");

            } else {
              // Add the header template to the popover
              $tip.children('.popover-title').attr('data-bind', "template: {name: 'header', templateUrl: 'templates/popeditors'}");
            }

            //Handle escape key to hide popover
            $tip.keydown(function(event) {
              //27 is escape
              if(event.which === 27) {
                closeVisible();
                if($element.filter(":focusable").length > 0) {
                  $element.focus();
                } else {
                  $element.find(":focusable").focus();
                }
              }
            });

            //Delay the event registration to prevent the current click event from firing handleExternalEvent
            window.setTimeout(function() {
              $(document).click(handleExternalEvent);
              $(document).focusin(handleExternalEvent);
            }, 1);

            $element.popover('show'); //Show the popover
            visible = $element;
            ko.applyBindingsToDescendants(model, $tip[0]);//Render descendant template
          }
        });
      }
    };

   /**
    * @public
    * @class the popover binding allows for a popover to be filled with a rendered template
    * Uses the Bootstrap 'popovers' functionality:
    * <a href="http://getbootstrap.com/javascript/#popovers">http://getbootstrap.com/javascript/#popovers</a>.
    * <h2>Parameters:</h2>
    * <ul>
    *   <li><code>{String} trigger='click'</code> - The trigger event which will display the popover.</li>
    *   <li><code>{String} class</code> - The name of the CSS class to be given to the popover content DIV.</li>
    *   <li><code>{String} container='body'</code> - The element to append the popover content DIV to.</li>
    *   <li><code>{String} placement='right'</code> - The placement of the popover DIV: top | bottom | left | right | auto.</li>
    *   <li><code>{Observable} property</code> - The property to edit.</li>
    *   <li><code>{String} name</code> - The name of the template to be used for the content of the popover.</li>
    *    <li><code>{String} templateUrl</code> - The url of the content template.</li>
    * </ul>
    * @example
    * &lt;div class="modal" data-bind="popover: {class: 'cc-pop-number',
                      placement: 'bottom', name: 'template-name', templateUrl: 'template/path'
                      property: stockLevel}}"/>
    */
    ko.bindingHandlers.popover = {
        /**
         The logic runs once to initialize the binding for this element.
         @private
         @param {Object} element The DOM element attached to this binding.
         @param {function(): object} valueAccessor A function that returns all of the values associated with this binding.
         @param {function(): object} allBindingsAccessor Object containing information about other bindings on the same HTML element.
         @param {Object} viewModel The viewModel that is the current context for this binding.
         @param {Object} bindingContext The binding hierarchy for the current context.
       */
      init: function(element, valueAccessor, allBindingsAccessor, viewModel) {
        var $element, options, model, values = valueAccessor();

        //Set the popover options, many can be overwritten by the binding values, but some are static
        //html is needed for the template to render,
        //container is body to ensure popover works on all elements
        //content is a div using the popover class which should set the z-index and height of the popover
        //this is necessary to ensure the popover positions correctly and that it doesn't pop-in awkwardly
        options = {
          html: true,
          trigger: values.trigger || "click",
          content: "<div class='"+ values['class'] +"'></div>",
          container: values.container || 'body',
          placement: values.placement || "right"
        };

        $element = $(element);

        model = {
          model: values.model || viewModel,
          save: function() {
              if(model.property.isValid()) {
                //Copies the edit value to the base model value
                if(values.property() != model.property()) {
                  values.property(model.property());
                }

                closeVisible();
                if($element.filter(":focusable").length > 0) {
                  $element.focus();
                } else {
                  $element.find(":focusable").focus();
                }
                values.property.notifySubscribers(values.property(), "valueSubmitted");
                return false;
              }
            },

            close: function() {
                closeVisible();
                if($element.filter(":focusable").length > 0) {
                  $element.focus();
                } else {
                  $element.find(":focusable").focus();
                }
                return false;
              },

          //Focus on the element after the template has loaded
          focus: function(elements) {
            $(elements).find(":focusable").focus();

            // constrain tabbing
            tabTrap.constrain($('.popover.in'));
          }
        };

        $element.click(function(e) {
          var $tip, position, placement;

          options.placement = getPlacement(values.placement, $element.offset());

          $element.popover(options);
          $tip = $element.data('bs.popover').tip();

          closeVisible();
          if(!$tip.hasClass('in')) {
            $tip.children('.popover-content').attr('data-bind', "template: {name: '" + values.name +
                   "', templateUrl: '" + values.templateUrl + "', afterRender: focus}");

            //Handle escape key to hide popover
            $tip.keydown(function() {
              //27 is escape
              if(event.which === 27) {
                closeVisible();
              }
            });

            //Delay the event registration to prevent the current click event from firing handleExternalEvent
            window.setTimeout(function() {
              $(document).click(handleExternalEvent);
              $(document).focusin(handleExternalEvent);
            }, 1);

            $element.popover('show');
            ko.applyBindingsToDescendants(model, $tip[0]);
          }
        });
      }
    };
  }());

  (function() {
    //X and Y margins control the dynamic moving of which side
    //the tooltip appears on based on where it is in the window.
    var X_MARGIN_SMALL = 200, X_MARGIN_LARGE = 300,
        Y_MARGIN_SMALL = 100, Y_MARGIN_LARGE = 200,
        visible, closeVisible, getPlacement, closePopover, handleExternalEvent,
        isDescendent, toggle, validDates = true;

    /**
     * Handles user action on external elements (clicks or focuses)
     * Causes the popover to close.
     */
    handleExternalEvent = function(e) {
      if ($(e.target).closest('.popover').length === 0 && !isDescendent(e.target, 'datepicker') && !isDescendent(e.relatedTarget, 'oj-datepicker')) {
        closeVisible();
      }
    };

    /**
     * Checks if the element is descendent of OJET Calendar.
     */
    isDescendent = function(element, ancestorClass) {
      if (element) {
        do {
          if (element.nodeType == 1 && $(element).is('[class*='+ ancestorClass +']')) {
            return true;
          }
        } while ((element = element.parentElement) && element !== undefined && element.nodeType == 1);
      }
      return false;
    };

    /**
     * Closes the visible popover
     */
    closeVisible = function() {
      if(visible) {
        visible.data('bs.popover').tip().off('keydown');
        visible.popover('destroy');
        visible = null;
        $(document).off('click', handleExternalEvent);
        $(document).off('focusin', handleExternalEvent);
      }
    };

    /**
     * Gets the ultimate placement of the tooltip based on the window
     */
    getPlacement = function(placement, position) {
      var top, left, result, $win;
      $win = $(window);
      top = position.top - $win.scrollTop();
      left = position.left - $win.scrollLeft();

      //Top/Bottom replacement based on location on the screen
      if(top < Y_MARGIN_SMALL || (top < Y_MARGIN_LARGE && placement === "top")) {
        result = "bottom";
      } else if(top > $win.height() - Y_MARGIN_SMALL ||
                (top > $win.height() - Y_MARGIN_LARGE && placement === "bottom")) {
        result = "top";
      }

      //Left/Right replacement based on location on the screen
      if(left < X_MARGIN_SMALL || (left < X_MARGIN_LARGE && placement === "left")) {
        result = "right";
      } else if (left > $win.width() - X_MARGIN_SMALL ||
                 (left > $win.width() - X_MARGIN_LARGE && placement === "right")) {
        result = "left";
      }

      return result || placement;
    };

      /**
       * @public
       * @class Provides a datepicker popover component.
       * <h2>Parameters:</h2>
       * <ul>
       *   <li><code>{String} trigger='click'</code> - The trigger event which will display the popover.</li>
       *   <li><code>{String} class</code> - The name of the CSS class to be given to the popover content DIV.</li>
       *   <li><code>{String} container='body'</code> - The element to append the popover content DIV to.</li>
       *   <li><code>{String} placement='right'</code> - The placement of the popover DIV: top | bottom | left | right | auto.</li>
       *   <li><code>{Observable Date} toDate</code> - The 'toDate' property.</li>
       *   <li><code>{Observable Date} fromDate</code> - The 'fromDate' property.</li>
       *   <li><code>{Observable Date} initToDate</code> - The initial 'toDate' property to be shown.</li>
       *   <li><code>{Observable Date} initFromDate</code> - The initial 'fromDate' property to be shown.</li>
       *   <li><code>{Observable Date} dataCollectionStartDate</code> - The property indicating the date after which the selected dates are valid.</li>
       *   <li><code>{Date} yesterday</code> - Yesterday's date.</li>
       *   <li><code>{function(): boolean} validation</code> - The validation function. Returns true when 'from' and 'to' dates are valid. 
       *   When the dates are not invalid, set the appropriate error message text into the errorMessage observable.</li>
       *   <li><code>{Observable String} errorMessage</code> - The error message observable which will be set to the appropriate value by the validation function.</li>
       *   <li><code>{String} zIndex</code> - The z-index for the popover.</li>
       *   <li><code>{String} minHeight</code> - The minimum height of the popover.</li>
       *   <li><code>{String} minWidth</code> - The minimum width of the popover.</li>
       *   <li><code>{String} name</code> - The name of the template to be used for the content of the popover.</li>
       *   <li><code>{String} templateUrl</code> - The url of the content template.</li>
       * </ul>
       * @example
       * &lt;button id="calendar" class="btn btn-primary popover-dismiss" data-toggle="popover"
       *     data-bind="datepopover: {container: '#collapseOne', placement: 'bottom', templateUrl: 'templates/reporting', 
       *          name: 'datepicker', toDate: $data.ojetToDate, fromDate: $data.ojetFromDate, validation: $data.validateDates,
       *          errorMessage: $data.errorMessage, zIndex: 550, minHeight: '390px', minWidth: '290px', yesterday: $data.yesterday,
       *          initToDate: $data.initToDate, initFromDate: $data.initFromDate, dataCollectionStartDate: $data.dataCollectionStartDate}">
       *   &lt;span class="fa fa-calendar"></span>
       * &lt;/button>
       */
      ko.bindingHandlers.datepopover = {
        
      /**
        The logic runs once to initialize the binding for this element.
        @private
        @param {Object} element The DOM element attached to this binding.
        @param {function(): object} valueAccessor A function that returns all of the values associated with this binding.
        @param {function(): object} allBindingsAccessor Object containing information about other bindings on the same HTML element.
        @param {Object} viewModel The viewModel that is the current context for this binding.
      */
        init: function(element, valueAccessor, allBindingsAccessor, viewModel) {
          var $element, options, model, values = valueAccessor();
          var tabTrap = ko.bindingHandlers.tabTrap;
          var initToDate, initFromDate, datesSaved = false;

          //Set the popover options, many can be overwritten by the binding values, but some are static
          //html is needed for the template to render,
          //container is body to ensure popover works on all elements
          //content is a div using the popover class which should set the z-index and height of the popover
          //this is necessary to ensure the popover positions correctly and that it doesn't pop-in awkwardly
          options = {
            html: true,
            trigger: values.trigger || "click",
            content: "<div class='"+ values['class'] +"'></div>",
            container: values.container || 'body',
            placement: values.placement || "right"
          };

          $element = $(element);

          model = {
            toDate: ko.observable(ko.utils.unwrapObservable(values.toDate)),
            fromDate: ko.observable(ko.utils.unwrapObservable(values.fromDate)),
            toDateLabel: CCi18n.t('ns.reporting:resources.toText') + " " + CCi18n.t('ns.reporting:resources.date') + ":" + CCi18n.t('ns.reporting:resources.descriptionToAccessCalender'),
            fromDateLabel: CCi18n.t('ns.reporting:resources.fromText') + " " + CCi18n.t('ns.reporting:resources.date') + ":" + CCi18n.t('ns.reporting:resources.descriptionToAccessCalender'),
            toDateText: CCi18n.t('ns.reporting:resources.toText'),
            fromDateText: CCi18n.t('ns.reporting:resources.fromText'),
            customDateRangeText: CCi18n.t('ns.reporting:resources.customDateRangeText'),
            errorMessage: values.errorMessage,
            dataCollectionStartDate: values.dataCollectionStartDate,
            yesterday: values.yesterday,
            save: function(pFromDate, pToDate) {
              //Copies the edit value to the base model value
              //validate values
              //check if the date is valid
              var dateFormat = $("#cc-fromDate").ojInputDate("option", "placeholder");
              if (dateFormat) {
                dateFormat = dateFormat.toUpperCase();
              }

              if ($("#cc-fromDate").attr("aria-invalid") === "true" || $("#cc-toDate").attr("aria-invalid") === "true") {
                values.toDate(undefined);
                values.fromDate(undefined);
              } else {
                if(model.toDate()===null) {
                  values.toDate(null);
                } else {
                  values.toDate(moment(model.toDate()).toDate());
                }
                if(model.fromDate()===null) {
                  values.fromDate(null);
                } else {
                  values.fromDate(moment(model.fromDate()).toDate());
                }
              }
              validDates = values.validation();
              if (validDates) {
                closeVisible();
              } else {
                return false;
              }
              if($element.filter(":focusable").length > 0) {
                $element.focus();
              } else {
                $element.find(":focusable").focus();
              }
              values.toDate.notifySubscribers(values.toDate(), "valueSubmitted");
              values.fromDate.notifySubscribers(values.fromDate(), "valueSubmitted");
              datesSaved = true;
              return false;
            },

            close: function() {
              closeVisible();
              if($element.filter(":focusable").length > 0) {
                $element.focus();
              } else {
                $element.find(":focusable").focus();
              }
              return false;
            },

            //Focus on the element after the template has loaded
            focus: function(elements) {
              if(values.initFromDate() && values.initToDate()){
                var dateFormat = $("#cc-fromDate").ojInputDate("option", "placeholder");
                if (dateFormat) {
                  dateFormat = dateFormat.toUpperCase();
                }
                $("#cc-fromDate").val(ccDate.formatDateAndTime(values.initFromDate(), null, dateFormat, null));
                $("#cc-toDate").val(ccDate.formatDateAndTime(values.initToDate(), null, dateFormat, null));
                values.fromDate(values.initFromDate());
                values.toDate(values.initToDate());
              }
              $(elements).find("#cc-toDate").focus();
              $(elements).find("#cc-fromDate").focus();
              // constrain tabbing
              tabTrap.constrain($('.popover.in'));
            }
          };

          var $popover = $(values.container);


          $popover.on('hidden.bs.popover', function() {
            if(datesSaved) {
              initFromDate = null;
              initToDate = null;
              values.initFromDate(null);
              values.initToDate(null);
            }
          });

          $element.click(function(e) {
            var $tip, position, placement;
            e.preventDefault();
            options.placement = getPlacement(values.placement, $element.offset());

            $element.popover(options);
            $tip = $element.data('bs.popover').tip();

            if(!$tip.hasClass('in')) {
                closeVisible();
                // if there was no error in the dates saved, fill date popover
                // with the saved values otherwise with no data
                if (values.errorMessage() === ''
                    || values.errorMessage() === undefined) {
                  if (values.toDate() == null || values.toDate() == undefined) {
                    model.toDate(null);
                  } else {
                    model.toDate(ccDate.formatDateAndTime((values.toDate())
                        , null,
                        CCConstants.OJET_INPUT_SHORT_DATE_FORMAT, null));
                  }
                  if (values.fromDate() == undefined
                      || values.fromDate() == null) {
                    model.fromDate(null);
                  } else {
                    model.fromDate(ccDate.formatDateAndTime((values.fromDate())
                        , null,
                        CCConstants.OJET_INPUT_SHORT_DATE_FORMAT, null));
                  }
                  model.errorMessage = values.errorMessage;
                } else { // Reset the edit value
                  model.toDate(null);
                  model.fromDate(null);
                  initFromDate = null;
                  initToDate = null;
                  values.initToDate(null);
                  values.initFromDate(null);
                  values.toDate(null);
                  values.errorMessage("");
                  values.fromDate(null);
                }
            
            $tip.css("z-index", values.zIndex);
            $tip.css("min-height", values.minHeight);
            $tip.css("min-width", values.minWidth);

            $tip.children('.popover-title').attr('data-bind', "template: {name: 'datepickerHeader', " +
                        "templateUrl: 'templates/reporting'}");
            $tip.children('.popover-content').attr('data-bind', "template: {name: '" + values.name +
                      "', templateUrl: '" + values.templateUrl + "', afterRender: focus}");

            //Handle escape key to hide popover
            $tip.keydown(function(event) {
              //27 is escape
              if(event.which === 27) {
                closeVisible();
              }
            });

            //Delay the event registration to prevent the current click event from firing handleExternalEvent
            window.setTimeout(function() {
              $(document).click(handleExternalEvent);
              $(document).focusin(handleExternalEvent);
            }, 1);

            $element.popover('show');
            visible = $element;
            ko.cleanNode($tip[0]);
            ko.applyBindingsToDescendants(model, $tip[0]);
          } else {
              closeVisible();
              if($element.filter(":focusable").length > 0) {
                $element.focus();
              } else {
                  $element.find(":focusable").focus();
              }
            }
          });
        }
      };

    /**
     * @ignore
     * @public
     * @class Creates a popover on a element, filled with a rendered template.
     * <a href="http://getbootstrap.com/javascript/#popovers">http://getbootstrap.com/javascript/#popovers</a>.
     * 
     * <h2>Parameters:</h2>
     * <ul>
     *   <li><code>{String} trigger='click'</code> - The trigger event which will display the popover.</li>
     *   <li><code>{String} class</code> - The name of the CSS class to be given to the popover content DIV.</li>
     *   <li><code>{String} container='body'</code> - The element to append the popover content DIV to.</li>
     *   <li><code>{String} placement='bottom'</code> - The placement of the popover DIV: top | bottom | left | right | auto.</li>
     *   <li><code>{String} [title]</code> - The title of the popover.</li>
     *   <li><code>{Object} [model]</code> - The view model to associate the popover with.</li>
     *   <li><code>{String} zIndex</code> - The z-index for the popover.</li>
     *   <li><code>{String} minHeight</code> - The minimum height of the popover.</li>
     *   <li><code>{String} minWidth</code> - The minimum width of the popover.</li>
     *   <li><code>{String} name</code> - The name of the template to be used for the content of the popover.</li>
     *   <li><code>{String} templateUrl</code> - The url of the content template.</li>
     * </ul>
     * 
     * @example
     * &lt;button class="btn btn-primary popover-dismiss" data-toggle="popover"
     *     data-bind="datepopover: {container: '#containerSection', placement: 'bottom', templateUrl: 'templates/reporting', 
     *          name: 'datepicker', zIndex: 550, minHeight: '390px', minWidth: '290px'}">
     * &lt;/button>
    */
    ko.bindingHandlers.popover = {
      /**
        The logic runs once to initialize the binding for this element.
        @private
        @param {Object} element The DOM element attached to this binding.
        @param {function(): object} valueAccessor A function that returns all of the values associated with this binding.
        @param {function(): object} allBindingsAccessor Object containing information about other bindings on the same HTML element.
        @param {Object} viewModel The viewModel that is the current context for this binding.
      */
      init: function(element, valueAccessor, allBindingsAccessor, viewModel) {
        var $element, options, model, values = valueAccessor();

        //Set the popover options, many can be overwritten by the binding values, but some are static
        //html is needed for the template to render,
        //container is body to ensure popover works on all elements
        //content is a div using the popover class which should set the z-index and height of the popover
        //this is necessary to ensure the popover positions correctly and that it doesn't pop-in awkwardly
        options = {
          html: true,
          trigger: values.trigger || "click",
          content: "<div class='"+ values['class'] +"'></div>",
          container: values.container || 'body',
          placement: values.placement || "right"
        };

        $element = $(element);

        model = {
          model: values.model || viewModel,
          save: function() {
              if(model.property.isValid()) {
                //Copies the edit value to the base model value
                if(values.property() != model.property()) {
                  values.property(model.property());
                }

                closeVisible();
                if($element.filter(":focusable").length > 0) {
                  $element.focus();
                } else {
                  $element.find(":focusable").focus();
                }
                values.property.notifySubscribers(values.property(), "valueSubmitted");
                return false;
              }
            },

            close: function() {
                closeVisible();
                if($element.filter(":focusable").length > 0) {
                  $element.focus();
                } else {
                  $element.find(":focusable").focus();
                }
                return false;
              },

          //Focus on the element after the template has loaded
          focus: function(elements) {
            $(elements).find(":focusable").focus();

            // constrain tabbing
            tabTrap.constrain($('.popover.in'));
          }
        };

        $element.click(function(e) {
          var $tip, position, placement;

          options.placement = getPlacement(values.placement, $element.offset());

          $element.popover(options);
          $tip = $element.data('bs.popover').tip();

          closeVisible();
          if(!$tip.hasClass('in')) {
            $tip.children('.popover-content').attr('data-bind', "template: {name: '" + values.name +
                   "', templateUrl: '" + values.templateUrl + "', afterRender: focus}");
            $tip.children('.popover-title').attr('data-bind', "template: {name: 'datepickerHeader', templateUrl: 'templates/reporting'}");

            //Handle escape key to hide popover
            $tip.keydown(function() {
              //27 is escape
              if(event.which === 27) {
                closeVisible();
              }
            });

            //Delay the event registration to prevent the current click event from firing handleExternalEvent
            window.setTimeout(function() {
              $(document).click(handleExternalEvent);
              $(document).focusin(handleExternalEvent);
            }, 1);

            $element.popover('show');
            ko.applyBindingsToDescendants(model, $tip[0]);
          }
        });
      }
    };

  }());




  //Closure to hide lastZ value from other bindings
  (function() {
    var lastZ = 1052;
    var prevZ, nextZ;
    var topZ;
    var topModal = null;

   /**
    * @public
    * @class The modal bindings extends modal functionality to include several fixes
    * and improvements, including handling focussing and sizing issues.
    * @example
    * &lt;div class="modal width-fixed fade cc-modalForm"
    *   data-bind="attr: {id: 'cc-'+$data.exportReportId()+'-export-modal'},
    *   modal: 0, modalTabbingContraint">
    */
    ko.bindingHandlers.modal = {
      /**
        The logic runs once to initialize the binding for this element.
        @private
        @param {Object} element The DOM element attached to this binding.
        @param {function(): object} valueAccessor A function that returns all of the values associated with this binding.
        @param {function(): object} allBindingsAccessor Object containing information about other bindings on the same HTML element.
      */
      init: function(element, valueAccessor, allBindingsAccessor) {
        var $element, $win, $modalBody,
            resizeHeightMargins, resizeModal, focusTarget, shown,
            focusRelatedTarget, focusRelatedTargetId, preventModalClose = null,
            modalFocusOutHandler, modalKeyupDismissHandler, modalHideHandler, modalAllowCloseHandler,
            MODAL_FOCUSOUT_FOCUS_CLASS = 'cc-modal-focus-out-active', addEscapeHandler, removeEscapeHandler;

        var focusFallbackArray = valueAccessor().focusFallback ? valueAccessor().focusFallback.split(',') : null;

        $win = $(window); //Get the window element once instead of repeatidly
        $element = $(element);
        $modalBody = $element.find('.modal-body');
        
        var isChrome = (!!$win[0].chrome && !!$win[0].chrome.webstore);
        
        // Clicking the escape key in IE resets the text field that has focus, rather than dismissing the modal. This method adds event handles to prevent this.
        addEscapeHandler = function() {
          $(element).on('keydown.modal.cc', ':text', function(event) {
            var keycode = event.which || event.charCode || event.keyCode;
              
            // ESC keycode is 27
            if (keycode == 27) {
              return false; 
            }  
          });
        };
        
        // Remove the event handlers attached in addEscapeHandler
        removeEscapeHandler = function() {
          $(element).off('keydown.modal.cc', ':text');
        };
        
        //Resize the modal based on screen size changes and on initial show of modal
        resizeModal = function() {
          var bottom, height = 0;

          // prepend our modal testing div, for reporting heights
          $('body').prepend($('<div />').attr('id','cc-modalTester'));

          // since auto height elements can't report actual height when hidden, clone them
          // and get the height from the clone instead.
          $element.find('.modal-content').children().each(function() {
            if(this !== $modalBody[0]) {
              $(this).clone().appendTo('#cc-modalTester');
            }
          });

          height = $('#cc-modalTester').outerHeight();
          // remove the testing div
          $('#cc-modalTester').remove();

          //Cut off the height of the other parts of the modal + 21% for the top/bottom gap.
          if($win.width() > 767) {
            bottom = 0.11*$win.height();
          } else {
            bottom = 11;
          }

          $modalBody.css({'max-height': Math.max(128, $win.height() - height - bottom)});
          
          // motoole - this no longer seems necessary. centering is being done with margin: auto;
          //$element.css({left: Math.max(10, $win.width()/2 - $element.width()/2)});
        };

        // figure out what element to focus on in a modal by checking for .cc-focus-target
        // if the class is on a non-tabbable item, focus on the first tabbable child element
        // if the class is on a tabbable element, focus on that
        // otherwise, find the first tabbable element in the modal and focus that.
        focusTarget = function(elm) {
          if($(elm).find('.cc-focus-target').length > 0) {
            if($.inArray($(elm).find('.cc-focus-target')[0], $(elm).find(':tabbable')) === -1) {
              if($(elm).find('.cc-focus-target :tabbable')[0] !== undefined) {
                $(elm).find('.cc-focus-target :tabbable')[0].focus();
              }
            } else {
              $(elm).find('.cc-focus-target')[0].focus();
            }
          } else if($(elm).find(':tabbable')[0]) {
            $(elm).find(':tabbable')[0].focus();
          }
        };

        // function bound to modal focusout event
        modalFocusOutHandler = function(e) {
          if($element.has(document.activeElement).length === 1) {
            preventModalClose = true;
            $(document.activeElement).addClass(MODAL_FOCUSOUT_FOCUS_CLASS)
          }
        }

        // function bound to keyup.dismiss.bs.modal event
        modalKeyupDismissHandler = function(e) {
          preventModalClose = false;
          $('.' + MODAL_FOCUSOUT_FOCUS_CLASS).removeClass(MODAL_FOCUSOUT_FOCUS_CLASS);
        }

        // function bound to keyup.dismiss.bs.modal event
        modalHideHandler = function(e) {
          if(preventModalClose) {
            e.preventDefault();
          }
          $('.' + MODAL_FOCUSOUT_FOCUS_CLASS).focus().removeClass(MODAL_FOCUSOUT_FOCUS_CLASS);
        }

        modalAllowCloseHandler = function(e) {
          preventModalClose = false;
        }

        //Fix stacking modal crash
        $element.on('focusin', function (e) {
          // stop focusin competition war.
          e.stopPropagation();
        });

        // ** MODAL SHOWN EVENT **//
        //When modal is shown setup z-index and responsive positioning
        $element.on('show.bs.modal', function(e) {
          if(!$(e.target).hasClass('modal')) { return; }

          // The product details modal is sometimes opened twice (note: fix that 
          // if possible), so we don't want to increase the z-index a second time, 
          // otherwise the decrease in the 'hide.bs.modal' event handler won't 
          // return the z-index to the original value.  Eventually the element 
          // would sit above elements with fixed z-indices (e.g. the datepicker)
          
          if ($element.data('alreadyOpen')!==true) {
            $element.data('alreadyOpen', true);
            //Delay adjusting the z-levels as the backdrop doesn't exist until
            //after the show event.
            setTimeout(function() {
              //Adjust the z-index for stacked modals
              $element.data('bs.modal').$backdrop.css({'z-index': lastZ - 10});
              $element.css({'z-index': lastZ});
              prevZ = lastZ;
              lastZ += 20;
              //Perform an initial width resizing
              resizeModal();
            }, 1);
          }

          $win.resize(resizeModal);

          //Prevent scrolling
          $('body').addClass('no-scroll');

          //Enable height resizing
          shown = true;
          //resizeHeightMargins();

          //find related target
          if($(e.relatedTarget).length === 1) {
            focusRelatedTarget = $(e.relatedTarget);
            focusRelatedTarget.addClass(CCConstants.MODAL_CLOSE_FOCUS);

            // get the id just in case e.relatedTarget gets updated/rebuilt and
            // we lose the focus class
            if(focusRelatedTarget.attr('id')) {
              focusRelatedTargetId = focusRelatedTarget.attr('id');
            }
          }
        });

        // ** MODAL SHOWN EVENT **//
        $element.on('shown.bs.modal', function(e) {
          focusTarget($element);

          // Bind handlers for chrome esc/focus issues from browser controls
          if(isChrome) {
            $element.on('focusout', modalFocusOutHandler);
            $element.on('focus mousedown', modalAllowCloseHandler);
            $element.on('keyup.dismiss.bs.modal', modalKeyupDismissHandler);
            $element.find('button, a').on('click', modalAllowCloseHandler);
            $element.on('hide.bs.modal', modalHideHandler);
          }
          
          addEscapeHandler();
        });

        $element.on('hide.bs.modal', function() {
          // always, always, always reset the scroll bar to the top of the modal
          $element.find('.modal-body').scrollTop(0);
        });

        // ** MODAL HIDDEN EVENT **//
        //When modal is hidden perform clean-up
        $element.on('hidden.bs.modal', function(e) {
          if(!$(e.target).hasClass('modal')) { return; } //Not a modal event
          lastZ -= 20;
          nextZ = lastZ - 20;
          shown = false;
          topZ = 0;
          topModal = null;
          
          // Reset the property used to detect multiple 'show.bs.modal' events
          $element.data('alreadyOpen', false);
          
          removeEscapeHandler();
          
          $win.off('resize', resizeModal);

          // Unbind handlers for chrome esc/focus issues from browser controls
          if(isChrome) {
            $element.off('focusout', modalFocusOutHandler);
            $element.off('focus mousedown', modalAllowCloseHandler);
            $element.off('keyup.dismiss.bs.modal', modalKeyupDismissHandler);
            $element.find('button, a').off('click', modalAllowCloseHandler);
            $element.off('hide.bs.modal', modalHideHandler);
          }

          preventModalClose = null;

          // if a notification is up with the curtain, make sure the curtain is removed.
          if($element.find('.cc-curtain')) {
            $element.find('.cc-curtain').remove();
          }

          $(element).css('left', '0px');

          //Only re-enable scrolling on last modal hide
          if($('body .modal.in').length === 0) {
            setTimeout(function(){$('body').removeClass('no-scroll');}, 0);

            // find out if there is a fallback item to focus on
            var focusFallbackItem = null;
            if(focusFallbackArray !== null){
              $.each(focusFallbackArray, function(ii, item) {
                if($(item).length !== 0) {
                  focusFallbackItem = item;
                  return false;
                }
              });
            }

            if($(CCConstants.MODAL_CLOSE_FOCUS_CLASS).length !== 0) { // find the class
              // focus by class
              $(CCConstants.MODAL_CLOSE_FOCUS_CLASS).focus();
              $(CCConstants.MODAL_CLOSE_FOCUS_CLASS).removeClass(CCConstants.MODAL_CLOSE_FOCUS);
            } else if($('#' + focusRelatedTargetId).length > 0) {
              // focus by related target id
              $('#' + focusRelatedTargetId).focus();
            } else if(focusFallbackItem !== null){
              // focus by fallback item
              window.setTimeout(function(){
                $(focusFallbackItem).focus();
              }, 10);
            }
          }

          // set focus on the previous one in the stack so ESC is available.
          // figure out which modal has the highest z-index
          $.each($('.modal'), function(ii, modal) {
            if($(modal).css('display') === 'block' && $(modal).css('z-index') > topZ) {
              topZ = $(modal).css('z-index');
              topModal = $(modal);
            }
          });

          // focus on the highest stacked modal
          focusTarget(topModal);
        });

        //Modal clean-up if DOM element changes/is removed. Hides the modal (removes backdrop)
        //and removes the resize listener
        ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
          $element.modal('hide');
        });
      }
    };
  }());

  /**
   * @public
   * @class Implements the jQuery Tags Input plugin, allowing for 'tag' style handling of enumerated lists.
   * Configuration and usage: <a href="https://github.com/xoxco/jQuery-Tags-Input">https://github.com/xoxco/jQuery-Tags-Input</a>
   * 
   * <h2>Parameters:</h2>
   * <ul>
   *   <li><code>{Observable String} list</code> - The observable property which will contain the list of added tags.
   *   The value will be set as a comma-separated list of strings.</li>
   *   <li><code>{Observable String} defaultText='Add item'</code> - String to be used for default 'add' text.</li>
   *   <li><code>{Observable String} width='100px'</code> - Height of the tags input textbox.</li>
   *   <li><code>{Observable String} height='300px'</code> - Width of the tags input textbox.</li>
   *   <li><code>{Observable int} minChars=0</code> - Minimum allowed characters.</li>
   *   <li><code>{Observable int} maxChars</code> - Maximum allowed characters.</li>
   *   <li><code>{Observable boolean} caseInsensitive=true</code> - Value matching is case insensitive.</li>
   *   <li><code>{Observable boolean} isInteractive=true</code> - If set to false, no 'add' link will be displayed.</li>
   * </ul>
   * 
   * @example
   * &lt;input type="text" data-bind="tagsInput: {list: myTags, height: '50px'}"/>
   */
  ko.bindingHandlers.tagsInput = {
      
    /**
      The logic runs once to initialize the binding for this element.
      @private
      @param {Object} element The DOM element attached to this binding.
      @param {function(): object} valueAccessor A function that returns all of the values associated with this binding.
      @param {function(): object} allBindingsAccessor Object containing information about other bindings on the same HTML element.
      @param {Object} viewModel The viewModel that is the current context for this binding.
      @param {Object} bindingContext The binding hierarchy for the current context.
    */
    init: function (element, valueAccessor, allBindingsAccessor) {},
    /**
      update is run whenever an observable in the binding's properties changes.
      @private
      @param {Object} element The DOM element attached to this binding.
      @param {function(): object} valueAccessor A function that returns all of the values associated with this binding.
      @param {function(): object} allBindingsAccessor Object containing information about other bindings on the same HTML element.
      @param {Object} viewModel The viewModel that is the current context for this binding.
      @param {Object} bindingContext The binding hierarchy for the current context.
    */
    update: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
      var value = ko.utils.unwrapObservable(valueAccessor());
      var tagInput = $(element).find('input');
      var newTags, oldTags, existingTags, addedTags, tagInputId;
      var delimiter = ',';

      var defaultText = ko.utils.unwrapObservable(value.defaultText) ? ko.utils.unwrapObservable(value.defaultText) : 'Add item';
      var height = ko.utils.unwrapObservable(value.height) ? ko.utils.unwrapObservable(value.height) : '100px';
      var width = ko.utils.unwrapObservable(value.width) ? ko.utils.unwrapObservable(value.width) : '300px';
      var minChars = ko.utils.unwrapObservable(value.minChars) ? ko.utils.unwrapObservable(value.minChars) : '0';
      var maxChars = ko.utils.unwrapObservable(value.maxChars) ? ko.utils.unwrapObservable(value.maxChars) : '';
      var caseInsensitive = ko.utils.unwrapObservable(value.caseInsensitive) ? ko.utils.unwrapObservable(value.caseInsensitive) : true;
      var isInteractive = ko.utils.unwrapObservable(value.isInteractive) === false ? ko.utils.unwrapObservable(value.isInteractive) : true;

      if(tagInput.val() && tagInput.val().length !== 0) {
        //store the initial value tags value
        existingTags = $(element).find('input').val();

        // remove the delete link from each tag item
        var to = setTimeout(function() {
          // $('.tagsinput .tag').addClass('cc-locked-tag').find('a').remove();
          $('.tagsinput .tag').addClass('cc-locked-tag').find('a').remove();
        }, 0);
      }

      $(tagInput).tagsInput({
        'defaultText': defaultText,
        'hide': true,
        'height': height,
        'width': width,
        'minInputWidth': ko.utils.unwrapObservable(value.minInputWidth) || '149px',
        'minChars': minChars,
        'maxChars': maxChars,
        'interactive': isInteractive,
        'onRemoveTag': function(tag) {
          tagInputId = $(tagInput)[0].id;

          // if the tag we are removing existed already, we can't delete it.
          // import our existingTags
          if(existingTags && existingTags.indexOf(tag) !== -1) {
            $('#' + tagInputId).importTags(existingTags);
          }

          // re-remove the delete links for the existing tags and re-apply
          // the class to indicate the tag is locked.
          if(existingTags) {
            for(var i=0;i<existingTags.split(',').length; i++) {
              var thisTag = $('#'+tagInputId+'_tagsinput .tag')[i];
              $(thisTag).addClass('cc-locked-tag').find('a').remove();
            }
          }
        },
        'onChange': function(elem, elem_tags) {
          valueAccessor().list($(element).find('input').val());
        },
        'onAddTag': function(tag) {
          if(caseInsensitive) {
            var tags = tagInput.val().split(',');
            var id = $(tagInput)[0].id;

            // only run if we have more than 1 tag to compare
            if(tags.length > 1) {
              for(var i=0;i < tags.length - 1;i += 1) {

                //compare everything as lowercase to get exact match
                if(tag.toLowerCase() === tags[i].toLowerCase()) {
                  newTags ='';

                  //store old tags as an array
                  oldTags = $(this).val().split(delimiter);

                  // remove all existing tags
                  $('#'+id+'_tagsinput .tag').remove();

                  // run through the old tags and exclude it from newTags
                  for (var ii= 0; ii < oldTags.length;ii += 1) {
                    if (oldTags[ii].indexOf(tag) !== 0) {
                      newTags = newTags + delimiter + oldTags[ii];
                    }
                  }

                  // import the updated list of tags
                  $('#'+id).importTags(newTags);

                  // re-create the invalid pattern.
                  $('#'+id+'_tag').focus();
                  $('#'+id+'_tag').val(tag);
                  $('#'+id+'_tag').addClass('not_valid');
                }
              }
            }
          }
        }
      });

      if(ko.utils.unwrapObservable(value.isInteractive) === false) {
        $(tagInput).next().addClass('cc-tagsInput-readOnly');
        $(tagInput).next().find('div').remove();
      }
    }
  };

  /**
   * @public
   * @class the datepicker binding handles applying the bootstrap datepicker
   * functionality to a input field. Requires property (same as value). Additional
   * options can be passed in with dpOptions. Events, methods, and option
   * descriptions: <a href="http://www.eyecon.ro/bootstrap-datepicker/">http://www.eyecon.ro/bootstrap-datepicker/</a>
   * NOTE: for the time being datepicker assumes it exists in a modal
   * 
   * <h2>Parameters:</h2>
   * <ul>
   *   <li><code>{Observable String} property</code> - The observable property which will contain the selected date.
   * </ul>
   * @example
   * &lt;input type="text" data-bind="datepicker: property, dpOptions: {format: 'mm/dd/yyyy'}" />
   */
  ko.bindingHandlers.datepicker = {
    /**
      The logic runs once to initialize the binding for this element.
      @private
      @param {Object} element The DOM element attached to this binding.
      @param {function(): object} valueAccessor A function that returns all of the values associated with this binding.
      @param {function(): object} allBindingsAccessor Object containing information about other bindings on the same HTML element.
    */
    init: function (element, valueAccessor, allBindingsAccessor) {
      var nextSibling, $parentContainer, containerHeight, elmBottom, elmRequired, addSpace, computedOffset;
      var options = allBindingsAccessor().dpOptions || {};
      var inModal = $(element).parents('.modal').length === 1 ? true : false;

      // if we're in a modal, nextElementSibling can't be checked.
      if(inModal) {
        nextSibling = '';

        // are we in tabs or not.
        if($(element).parents('.tab-pane')) {
          $parentContainer = $(element).parents('.tab-pane');
        } else {
          $parentContainer = $(element).parents('.modal-body');
        }

      } else {
        nextSibling = $(element).closest('.row')[0].nextElementSibling;
      }

      var format = ko.utils.unwrapObservable(allBindingsAccessor().format);

      if(format || !options.format) {
        options.format = ccDate.getDateFormat(format ? format : "short").toLowerCase();
      }

      $(element).datepicker(options).on('show', function(ev) {
        // we need to move it in the dom, unfix it, and add some positioning
        $.each($('body .datepicker.dropdown-menu'), function(ii, picker) {
          if($(picker).attr('style') !== undefined && $(picker).css('style') != 'none' && nextSibling !== null) {
            $(picker).css({
              'position': 'absolute',
              'top' : '35px',
              'left': '0px'
            }).appendTo($(ev.target).parent());
          }
        });

        elmBottom = $(element).parents('.form-group').position().top + $(element).parents('.form-group').outerHeight(true);
        elmRequired = elmBottom + 240;

        // verify that the datepicker has enough space to be displayed in it's
        // current position and scroll to it. If there is not enough space, add some
        if(inModal) {
          containerHeight = $parentContainer.height();

          if(elmRequired > containerHeight) {
            addSpace = elmRequired - containerHeight;
            $parentContainer.css({'height': containerHeight + addSpace + 'px'});
          }

          // to compensate for padding, extra elements, positioning wierdness,
          // calculate the offset b/w the modal-body and offsetParent() of the element.
          computedOffset = $(element).parents('.modal-body').scrollTop() + $(element).closest('.form-group').offsetParent().position().top;

          $(element).parents('.modal-body').scrollTop($(element).closest('.form-group').position().top + computedOffset);
        } else {

          containerHeight = $(element).parents('.form-group').offsetParent().outerHeight(true);

          if(elmRequired > containerHeight) {
            addSpace = elmRequired - containerHeight;
            $(element).parents('.form-group').offsetParent().css({
              // 'height': containerHeight + addSpace + 'px'
            });
          }

          // $(element).scrollParent().scrollTop($(element).closest('.form-group').position().top);
        }

      }).on('changeDate', function (ev) {
         //It's unclear if this is ever called
         var observable = valueAccessor();
         observable(ev.date);
         $(element).datepicker("setValue", ev.date);
       }).on('dphide', function() {
        if(inModal) {
          $parentContainer.css({'height': 'auto'});
        } else {
          $(element).parents('.form-group').offsetParent().css({
              'height': 'auto'
            });
        }
       });

       ko.utils.domNodeDisposal.addDisposeCallback(element, function(){
         $(element).datepicker('remove');
       });
    },
    /**
      update is run whenever an observable in the binding's properties changes.
      @private
      @param {Object} element The DOM element attached to this binding.
      @param {function(): object} valueAccessor A function that returns all of the values associated with this binding.
      @param {function(): object} allBindingsAccessor Object containing information about other bindings on the same HTML element.
    */
    update: function (element, valueAccessor, allBindingsAccessor) {
      //Update the date value and push it through the date picker's formatting
      //when the date changes. This handles any method of changing the input field's
      //value
      var dateValue = ko.utils.unwrapObservable(allBindingsAccessor().value);
      if(dateValue) {
        var date = new Date(dateValue);
        if(!isNaN(date)) {
          allBindingsAccessor().value(date); //Force input to be a date object and not a string
          $(element).datepicker("setDate", new Date(date.getTime() + (date.getTimezoneOffset()*60000)));
        }
      }
    }
  };

  /**
   * @public
   * @class Applies the bootstrap timepicker
   * functionality to a input field. Requires property (same as value). 
   * NOTE: for the time being datepicker assumes it exists in a modal
   * 
   * <h2>Parameters:</h2>
   * <ul>
   *   <li><code>{Observable String} property</code> - The observable property which will contain the selected time.
   * </ul>
   * 
   * Additional options can be specified through the 'Options' binding. Descriptions of the different options can be found here:
   * <a href="http://jdewit.github.io/bootstrap-timepicker/">http://jdewit.github.io/bootstrap-timepicker/</a>
   * 
   * @example
   * &lt;input type='text' size='10'
   *   data-bind='value: timeProperty,
   *     timepicker: timeProperty, 
   *     Options:{defaultTime:false, minuteStep:1, showInputs: false}'>
   * &lt;/input>
   */
  ko.bindingHandlers.timepicker = {

    /**
      The logic runs once to initialize the binding for this element.
      @private
      @param {Object} element The DOM element attached to this binding.
      @param {function(): object} valueAccessor A function that returns all of the values associated with this binding.
      @param {function(): object} allBindingsAccessor Object containing information about other bindings on the same HTML element.
    */
    init : function(element, valueAccessor, allBindingsAccessor) {
      var value, options = allBindingsAccessor().Options || {};
      $(element).timepicker(options).on('show.timepicker', function(e) {
        $(element).timepicker('setDefaultTime', 'current');
      });
      $(element).timepicker(options).on('focus.timepicker', function(e) {
        $(element).timepicker('showWidget');
      });
      value = ko.utils.unwrapObservable(valueAccessor());
      $(element).timepicker(options).on('changeTime.timepicker', function(ev) {
        var observable = valueAccessor();
        observable(ev.time.value);
      });
      ko.utils.domNodeDisposal.addDisposeCallback(element, function(){
        $(element).timepicker('remove');
      });
    }
  };

  /**
   * @public
   * @class Applies the spectrum color picker (<a href="http://bgrins.github.io/spectrum/">http://bgrins.github.io/spectrum/</a>)
   * functionality to a input field. Requires property (same as value). 
   * 
   * <h2>Parameters:</h2>
   * <ul>
   *   <li><code>{Observable String} property</code> - The observable property which will contain the selected color.
   * </ul>
   * 
   * Additional options can be specified through the 'defaultSettings' binding. Descriptions of the different options can be found here:
   * <a href="http://bgrins.github.io/spectrum/#options">http://bgrins.github.io/spectrum/#options</a>
   * 
   * @example
   * &lt;input type="text" data-bind="spectrum: backgroundColor, 
   *   defaultSettings: { disabled: $data.disabled(), showInput: true, preferredFormat: 'hex6', 
   *   cancelTextKey: 'colorPickerCancelText', chooseTextKey: 'colorPickerChooseText' }" />
   *
   */
  ko.bindingHandlers.spectrum = {
        
    /**
      The logic runs once to initialize the binding for this element.
      @private
      @param {Object} element The DOM element attached to this binding.
      @param {function(): object} valueAccessor A function that returns all of the values associated with this binding.
      @param {function(): object} allBindingsAccessor Object containing information about other bindings on the same HTML element.
    */
    init: function (element, valueAccessor, allBindingsAccessor) {
      var options = allBindingsAccessor().defaultSettings || {};

      if(options.cancelTextKey) {
        options.cancelText = CCi18n.t('ns.common:resources.' + options.cancelTextKey);
      }

      if(options.chooseTextKey) {
        options.chooseText = CCi18n.t('ns.common:resources.' + options.chooseTextKey);
      }

      var currentColor = '#000000';
      var funcOnSelectColor = function () {
        var newSpectrum = $(element).spectrum("get");
        if (typeof newSpectrum.toHex === 'function') {
          currentColor = '#' + newSpectrum.toHex();
        }

        var observable = valueAccessor();

        if(currentColor !== observable()) {
          observable(currentColor);
        }

      };

      var pad = function(num, size) {
          var s = num+"";
          while (s.length < size) {
            s = "0" + s;
          }
          return s;
      };

      //-- also change event to hide
      options.hide = funcOnSelectColor;
      options.clickoutFiresChange = true;

      //===================================================================
      // create a unique class id for the spectrum input we will use
      // this to find the correct color picker for the control
      //===================================================================
      var uniqueInputId = "spectrum-input";
      if (element.id){
        uniqueInputId = element.id + "-spectrum-input";
      } else {
        var now = new Date();
          uniqueInputId = pad(now.getFullYear(),4) + pad((now.getMonth() +1), 2) +
            pad(now.getDay(), 2) + pad(now.getHours(),2) +
            pad(now.getMinutes(),2) + pad(now.getSeconds(),2) +
            pad(now.getMilliseconds(),3) + "-spectrum-input";
      }

      var uniqueClassId = "class-"+uniqueInputId;
      options.className = uniqueClassId;

      $(element).spectrum(options);

      //==================================================
      // add in a label for accessiblity

      var colorInputLbl = $('<label>Color</label>', { htmlFor : uniqueInputId });
      colorInputLbl.attr('for', uniqueInputId);
      colorInputLbl.attr('class', 'cc-reader-text');
      colorInputLbl.text(CCi18n.t('ns.common:resources.colorPickerInputLabel'));

      var inputContainer = $("."+ uniqueClassId);
      var cancelLink = inputContainer.find(".sp-cancel");
      var chooseButton = inputContainer.find(".sp-choose");

      var inputDiv = inputContainer.find(".sp-input-container");

      inputDiv.prepend(colorInputLbl);
      var colorInput = inputContainer.find('.sp-input');
      colorInput.attr("id",uniqueInputId);

      var value = ko.utils.unwrapObservable(valueAccessor());
      $(element).spectrum("set", value);

      //handle the field changing
      ko.utils.registerEventHandler(element, "change", funcOnSelectColor);

      var replacer = $(element).next('.sp-replacer');

      // Remove the tabindex property to make this control instantly tabbable
      replacer.removeAttr('tabindex');

      var a = $('<a></a>', {href : '#'});

      replacer.wrap(a);

      //handle disposal (if KO removes by the template binding)
      ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
        var newSpectrum = $(element).spectrum("get");0
        if (typeof newSpectrum.toHex === 'function') {
          currentColor = '#' + newSpectrum.toHex();
        }

        $(element).spectrum("destroy");
      });

      a = $(element).next('a');

      cancelLink.click(function() {
        a.focus();
        return true;
      });

      chooseButton.click(function() {
        a.focus();
        return true;
      });

      a.click(function() {
        // check to see if the element is disabled before toggling.
        var isDisabled = element.disabled;
        if (!isDisabled){
          // Repositioning the color picker to correct tab order
          var container = $(element).spectrum("container");
          container.appendTo(a);

          // once we have moved the color picker toggle to display it.
          $(element).spectrum("toggle");
        }
        return false;
      });
    },
    
    /**
      update is run whenever an observable in the binding's properties changes.
      @private
      @param {Object} element The DOM element attached to this binding.
      @param {function(): object} valueAccessor A function that returns all of the values associated with this binding.
    */
    update: function (element, valueAccessor) {
      var value = ko.utils.unwrapObservable(valueAccessor());

      $(element).spectrum("set", value);
    }
  };

  /**
   * @public
   * @class Applies the bootstrap slider (<a href="http://www.eyecon.ro/bootstrap-slider">http://www.eyecon.ro/bootstrap-slider</a>)
   * functionality to a input field. Requires property (same as value). 
   * 
   * <h2>Parameters:</h2>
   * <ul>
   *   <li><code>{Observable String} property</code> - The observable property which will contain the value represented by the slider.
   * </ul>
   * 
   * Additional options can be specified through the 'sliderOptions' binding. Descriptions of the different options can be found here:
   * <a href="http://www.eyecon.ro/bootstrap-slider/">http://www.eyecon.ro/bootstrap-slider/</a>
   * 
   * <h2>sliderOptions - Custom Parameters:</h2>
   * <ul>
   *   <li><code>{boolean} liveUpdate</code> - If set to true, the underlying observable value will be set as the slider is moved.
   *   If false, the observable will only updated after the slider movement has stopped.
   * </ul>
   * 
   * @example
   * &lt;div style="margin-top:5px" data-bind="slider: imagePercentSize, 
   *   sliderOptions: {min: 25, max: 100, range: 'min', step: 5, liveUpdate: true}">
   *
   */
  ko.bindingHandlers.slider = {
    /**
      The logic runs once to initialize the binding for this element.
      @private
      @param {Object} element The DOM element attached to this binding.
      @param {function(): object} valueAccessor A function that returns all of the values associated with this binding.
      @param {function(): object} allBindingsAccessor Object containing information about other bindings on the same HTML element.
    */
    init: function (element, valueAccessor, allBindingsAccessor) {
      var options = allBindingsAccessor().sliderOptions || {};
      var value = ko.utils.unwrapObservable(valueAccessor());

      options.value = value;
      options.change = function (event, ui) {
        var observable = valueAccessor();
        observable(ui.value);
      };

      if(options.liveUpdate) {
        options.slide = options.change;
      }

      $(element).slider(options);

      ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
          $(element).slider("destroy");
      });

      ko.utils.registerEventHandler(element, "slidestop", function (event, ui) {
        var observable = valueAccessor();
        observable(ui.value);
      });
    },
    /**
      update is run whenever an observable in the binding's properties changes.
      @private
      @param {Object} element The DOM element attached to this binding.
      @param {function(): object} valueAccessor A function that returns all of the values associated with this binding.
      @param {function(): object} allBindingsAccessor Object containing information about other bindings on the same HTML element.
    */
    update: function (element, valueAccessor, allBindingsAccessor) {
      var options = allBindingsAccessor().sliderOptions || {};
      var value = ko.utils.unwrapObservable(valueAccessor());

      if (isNaN(value)) { value = options.defaultValue || 0; }
      $(element).slider("value", value);
      $(element).slider("option", allBindingsAccessor().sliderOptions);

    }
  };

  /**
   * @public
   * @class Replaces standard select lists with a cleaner,
   * searchable list of select options.
   * <p>
   * With the truncate option passed, the binding will compare the length of the
   * string currently selected and eliminate all but the final split value. For
   * this to function properly the span must have the following CSS applied:
   * <ul>
   *   <li>text-overflow:clip;</li>
   *   <li>display:inline-block;</li>
   *   <li>overflow:auto;</li>
   * </ul>
   *
   * Plugin information: http://harvesthq.github.io/chosen/
   * @example
   * &lt;select class="form-control" data-bind='enable: writable,
   *   value: property,
   *   optionsText: $data.propertyValuesName, optionsValue: $data.propertyValuesValue,
   *   chosen: {truncate: "/", values: $data.propertyValues, options: {no_results_text:  $data.noResultsFound}}'>
   * &lt;/select>
   */
  ko.bindingHandlers.chosen = {
    /**
      Truncate the string to fit the width of the container. Prefix the truncated string with '...'.
      @private
      @param {String} truncate The string to be truncated.
    */
    truncate : function(truncateStr) {
      var selectedWidth, chosenWidth, split;
      // START compare lengths, truncate if necessary
      selectedWidth = $('.chosen-container').find('span').outerWidth(true) + 5;
      chosenWidth = $('.chosen-container').width();
      if (selectedWidth > chosenWidth) {
        if (truncateStr) {
          split = $('.chosen-container').find('span').html().split(truncateStr);
          if (split.length > 1) {
            $('.chosen-container').find('span').text('... ' + truncateStr + ' ' + split[split.length - 1]);
          }
        }
      }
    },
    /**
      Add screen reader text labels for accessibility.
      @private
      @param {String} container The string to be truncated.
    */
    addAccessibility : function(container) {
      var removeLinks = container.find('a.search-choice-close');

      $.each(removeLinks, function() {
        // if there isn't SR text already, add it
        if($(this).find('.cc-reader-text').length === 0) {
          // add localized SR text to the remove button
          $(this).append($('<span />').attr('class', 'cc-reader-text').text(CCi18n.t('ns.common:resources.removeText')));

          // make the remove link a focusable element
          $(this).attr('tabindex', '0');

          // that this is necessary is ridiculous
          // trigger cilck on 'enter' keyup and explicitly set focus on the input
          // NOTE: keyup is the only event that works. keydown/keypress cause
          // automatic selection of the first available option
          $(this).on('keyup', function(e) {
            if(e.keyCode === 13) {
              $(this).trigger('click');
              $(container.find('.search-field input')).focus();
            }
          });
        }
      });
    },
    /**
      The logic runs once to initialize the binding for this element.
      @private
      @param {Object} element The DOM element attached to this binding.
      @param {function(): object} valueAccessor A function that returns all of the values associated with this binding.
      @param {function(): object} allBindingsAccessor Object containing information about other bindings on the same HTML element.
      @param {Object} viewModel The viewModel that is the current context for this binding.
      @param {Object} bindingContext The binding hierarchy for the current context.
    */
    init : function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
      var changeFired, value, self, $chosenContainer, $searchField, $chosenLabel,
        labelId, labelText, options = ko.utils.unwrapObservable(valueAccessor());

      var allSelectedMessage = options.allSelectedMessage ? options.allSelectedMessage : false;

      //Render the template
      ko.bindingHandlers.options.init(element, function() {
        return options.values;
      }, allBindingsAccessor, viewModel, bindingContext);

      self = ko.bindingHandlers.chosen;

      $(element).addClass('chosen-select');

      $(element).chosen(options.options).trigger('chosen:ready');

      // get the container variable
      $chosenContainer = $(element).next();

      // a11y - chosen does not build out a label for it's search field.
      // this fixes that shortcoming.
      labelId = $(element).attr('id') + '-search-field';
      labelText = $(element).attr('data-placeholder') ? $(element).attr('data-placeholder') : CCi18n.t('ns.common:resources.chosenSearchFieldDefaultLabel');
      $searchField = $chosenContainer.find('.search-field');
      $chosenLabel = $('<label />').attr('class', 'cc-reader-text').attr('for', labelId).text(labelText);
      
      // add the id
      $searchField.find('input').attr('id', labelId);
      // add the label
      $searchField.prepend($chosenLabel);


      // when there is a change ensure everything is accessible
      $(element).chosen().change(function(){
        self.addAccessibility($chosenContainer);
      });

      // when dropdown shows, check for any li.active-result elements, and if
      // none are found either insert the provided message or just hide the empty
      // dropdown
      $(element).on('chosen:showing_dropdown', function() {

        // timeout allows chosen to re-apply .active-result as necessary before
        // checking against it.
        window.setTimeout(function() {
          if($chosenContainer.find('li.active-result').length === 0) {
            if(allSelectedMessage) {
              $chosenContainer.find('.chosen-results').append($('<li />').attr('class','cc-chosen-message').html(allSelectedMessage));
            } else {
              $chosenContainer.find('.chosen-drop').addClass('hide');
            }
          } else {
            $('.cc-chosen-message').remove();
            $chosenContainer.find('.chosen-drop').removeClass('hide');
          }
        }, 0);
      });

      var searchId = element.id + "-search";
      $('.chosen-search input').attr('id', searchId);

      // if the original value binding used an observable, then update the
      // value of the observable on change.
      value = allBindingsAccessor().value;
      changeFired = false;
      if (value && ko.isObservable(value)) {
        $(element).on('change', function() {
          if (!changeFired) {
            changeFired = true;
            value($(element).val());
            changeFired = false;
          }
        });
      }

      // bind our truncation function to the change event
      if (options.truncate) {
        $(element).on('change', self.truncate.bind(self, options.truncate));
      }
    },
    /**
      update is run whenever an observable in the binding's properties changes.
      @private
      @param {Object} element The DOM element attached to this binding.
      @param {function(): object} valueAccessor A function that returns all of the values associated with this binding.
      @param {function(): object} allBindingsAccessor Object containing information about other bindings on the same HTML element.
      @param {Object} viewModel The viewModel that is the current context for this binding.
      @param {Object} bindingContext The binding hierarchy for the current context.
    */
    update : function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
      var modalId, self, $chosenContainer, options = ko.utils.unwrapObservable(valueAccessor());
      
      $('.chosen-results').attr('tabindex', '0');

      // get the container variable
      $chosenContainer = $(element).next();

      //Render the template
      ko.bindingHandlers.options.update(element, function() {
        return options.values;
      }, allBindingsAccessor, viewModel, bindingContext);

      self = ko.bindingHandlers.chosen;

      if (allBindingsAccessor().value) {
        $(element).val(ko.utils.unwrapObservable(allBindingsAccessor().value));
      } else if (allBindingsAccessor().selectedOptions) {
        $(element).val(ko.utils.unwrapObservable(allBindingsAccessor().selectedOptions));
      }

      $(element).trigger('chosen:updated');

      // for pre-populated items, add accessibility right away
      self.addAccessibility($chosenContainer);

      if (options.truncate) {
        // check whether we're in a modal or not.
        // if we are, bind to the shown event, otherwise don't.
        modalId = $(element).parents('.modal').attr('id') ? '#' + $(element).parents('.modal').attr('id') : '';
        if (modalId) {
          $(modalId).on('shown.bs.modal', function() {
            self.truncate(options.truncate);
          });
        } else {
          self.truncate(options.truncate);
        }
      }
    }
  };


  /**
   * @public
   * @class The textCheck binding takes in a text value and checks it null status.
   * Depending on other options passed in, the text (whether null or not) can be manipulated
   * with a prepended string, or if null, replaced with a default string.
   * <p>
   * The text will be formatted according to the 'type' attribute. 'percent' and 'number' types
   * will be formatted to 2 decimal places. The 'price' type will be formatted using the
   * CurrencyHelper helper class.
   * 
   * <h2>Parameters:</h2>
   * <ul>
   *   <li><code>{Observable String} text</code> - The text property to be manipulated.</li>
   *   <li><code>{String} [type]</code> - The type of text attribute - one of 'price', 'percent', 'number' or 'digit'.</li>
   *   <li><code>{String} [prePend]</code> - The string to be prepended to the text value.</li>
   *   <li><code>{String} [nullReplace]</code> - The string to be substituted for a 'null' text value.</li>
   *   <li><code>{boolean} [prependNull]</code> - Prepend null strings?</li>
   * </ul>
   * 
   * @see CurrencyHelper
   * @example
   * &lt;span data-bind='textCheck: {text: myText, type: 'price', 
   *   prePend: '$', nullReplace: '-', prependNull: true/false}'>&lt;/span>
   * &lt;span data-bind='textCheck: {text: myText, type: 'percent', 
   *   nullReplace: '-', prependNull: false}'>&lt;/span>
   */
  ko.bindingHandlers.textCheck = {
    /**
      update is run whenever an observable in the binding's properties changes.
      @private
      @param {Object} element The DOM element attached to this binding.
      @param {function(): object} valueAccessor A function that returns all of the values associated with this binding.
      @param {function(): object} allBindingsAccessor Object containing information about other bindings on the same HTML element.
      @param {Object} viewModel The viewModel that is the current context for this binding.
      @param {Object} bindingContext The binding hierarchy for the current context.
    */
    update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
      var value = ko.utils.unwrapObservable(valueAccessor());
      var text = ko.utils.unwrapObservable(value.text);
      var type = ko.utils.unwrapObservable(value.type);
      var prePend = ko.utils.unwrapObservable(value.prePend);
      var nullReplace = ko.utils.unwrapObservable(value.nullReplace);
      var prependNull = ko.utils.unwrapObservable(value.prependNull);

      if((text || text === 0) && !isNaN(parseFloat(text))) {
        //pass price formatting into currencyHelper.handleFractionalDigits().
        if(type == 'price' || type == 'percent' || type == 'number' || type == 'digit') {
          var textToNumber;
          if(typeof text === 'string') {
            textToNumber = parseFloat(text);
          } else {
            textToNumber = text;
          }
          if(typeof text === 'number' || (typeof text === 'string' && text.trim().length > 0)) {
            if (type == 'price') {
              if (textToNumber < 0) {
                text = '-' + (prePend || '') + currencyHelper.handleFractionalDigitsAndLocale(Math.abs(textToNumber));
              } else {
                text = (prePend || '') + currencyHelper.handleFractionalDigitsAndLocale(textToNumber);
              }
            } else if (type == 'percent') {
              text = (prePend || '') + numberFormatHelper.formatNumber(textToNumber, 2, "decimal");
            } else if (type == 'number') {
              text = (prePend || '') + numberFormatHelper.formatNumber(textToNumber, 2, "decimal");
            } else if (type == 'digit') {
              text = (prePend || '') + numberFormatHelper.formatNumber(textToNumber, 0, "decimal");
            }
          } else {
            text = (prePend && prependNull ? prePend : '') + (nullReplace ? nullReplace : '');
          }
        } else {
          text = (prePend || '') + text;
        }
      } else {
        text = (prePend && prependNull ? prePend : '') + (nullReplace ? nullReplace : '');
      }

      //update the elements text value
      ko.bindingHandlers.text.update(element, function() {return text;});
    }
  };

  /**
   * @public
   * @class The scrollAffix binding is used to bind a fixed position to a DOM element
   * based on the amount of window scrolled. With the adjust value set, you can
   * adjust another element (most likely one that sits below your newly affixed
   * element) to make for smoother scrolling.
   *
   * <h2>Parameters:</h2>
   * <ul>
   *   <li><code>{Observable int} scrollDistance</code> - The scroll value to trigger affixing the element.</li>
   *   <li><code>{Observable int} affixPos</code> - The distance from the top, when the element is fixed.</li>
   *   <li><code>{Observable int} affixWidth</code> - The width that the fixed element should be.</li>
   *   <li><code>{Observable Object} affixMatchElm</code> - Match the width of another element in the DOM.</li>
   *   <li><code>{Observable Object} adjust</code> - Element that needs to be adjusted when the target element gets fixed.</li>
   *   <li><code>{Observable int} adjustPos</code> - The top margin to be added to adjust the fixed element.</li>
   * </ul>
   * @example
   * &lt;div data-bind="scrollAffix: {scrollDistance: '100', affixPos: '8px', 
   *   affixWidth: '855px', adjust: '#some-div', adjustPos: '100px'}"/>
   *
   */
  ko.bindingHandlers.scrollAffix = {
    /**
      update is run whenever an observable in the binding's properties changes.
      @private
      @param {Object} element The DOM element attached to this binding.
      @param {function(): object} valueAccessor A function that returns all of the values associated with this binding.
    */
    update: function(element, valueAccessor) {
      var value = ko.utils.unwrapObservable(valueAccessor()),
          scrollFunction,
          scrollDistance,
          affixPos,
          affixWidth,
          affixMatchElm,
          adjust,
          adjustPos,
          width;

      scrollDistance = ko.utils.unwrapObservable(value.scrollDistance);
      affixPos = ko.utils.unwrapObservable(value.affixPos);
      affixWidth = ko.utils.unwrapObservable(value.affixWidth) ? ko.utils.unwrapObservable(value.affixWidth) : null;
      affixMatchElm = ko.utils.unwrapObservable(value.affixMatchElm);
      adjust = ko.utils.unwrapObservable(value.adjust);
      adjustPos = ko.utils.unwrapObservable(value.adjustPos) ? ko.utils.unwrapObservable(value.adjustPos) : null;

      scrollFunction = function() {
        width = null;

        // don't fix elements after a certain point. just let it flow.
        if($(window).width() <= '992') {
          $(element).parent().css({'min-height': 'auto'});
          $(element).css({
            'position': '',
            'top': '',
            'width': ''
          });
          if(adjust !== undefined) {
            $(adjust).css({'margin-top': 'auto'});
          }

          return false;
        }

        if(affixWidth) {
          width = affixWidth;
        } else if(affixMatchElm !== 'undefined' && $(affixMatchElm).css('display') !== 'none') {
          width = $(affixMatchElm).outerWidth(true);
        } else {
          return false;
        }

        if ($(window).scrollTop() > scrollDistance && width !== null) {
          // handle the situation where fixing the element's position would result
          // in the window height changing to less than the elements height + offset.
          //$(element).parent().css({'min-height': $(element).height()});
          $(element).css({
            'position': 'fixed',
            'top': affixPos,
            'width': width
          });
          $(element).addClass('cc-scrollAffix');
          if(adjust !== undefined) {
            $(adjust).css({'margin-top': adjustPos});
          }
        } else {
          $(element).parent().css({'min-height': 'auto'});
          $(element).css({
            'position': '',
            'top': '',
            'width': ''
          });
          $(element).removeClass('cc-scrollAffix');
          if(adjust !== undefined) {
            $(adjust).css({'margin-top': 'auto'});
          }
        }
      };

      $(window).scroll(scrollFunction);
      $(window).resize(scrollFunction);

      //Modal clean-up if DOM element changes/is removed. Hides the modal (removes backdrop)
      //and removes the resize listener
      ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
        $(window).off('scroll', scrollFunction);
        $(window).off('resize', scrollFunction);
      });
    }
  };

  /**
   * @public
   * @class The currency binding takes a numerical value as a parameter and
   * returns it as an internationalized currency string.
   * 
   * <h2>Parameters:</h2>
   * <ul>
   *   <li><code>{String|float} price</code> - The price value.</li>
   *   <li><code>{Object} currencyObj</code> - The currency object, containing the currency symbol.</li>
   *   <li><code>{String} [nullReplace]</code> - The string to be substituted for a 'null' text value.</li>
   *   <li><code>{boolean} [prependNull]</code> - Prepend null strings?</li>
   * </ul>
   * @example
   * &lt;span data-bind="currency: {price: cart().subTotal(), currencyObj: $data.site().selectedPriceListGroup().currency}" class="no-outline">&lt;/span>
   */
  ko.bindingHandlers.currency = {
    /**
      update is run whenever an observable in the binding's properties changes.
      @private
      @param {Object} element The DOM element attached to this binding.
      @param {function(): object} valueAccessor A function that returns all of the values associated with this binding.
      @param {function(): object} allBindingsAccessor Object containing information about other bindings on the same HTML element.
      @param {Object} viewModel The viewModel that is the current context for this binding.
      @param {Object} bindingContext The binding hierarchy for the current context.
     */
    update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
      var value = ko.utils.unwrapObservable(valueAccessor());
      var numberValue = parseFloat(value.price);
      var currencySymbol = value.currencyObj.symbol;
      var nullReplace = value.nullReplace;
      var prependNull = value.prependNull;
      var fractionalDigits = value.currencyObj.fractionalDigits;

      var formattedNumber = null;

      if ((numberValue || numberValue === 0) && !isNaN(parseFloat(numberValue))) {
        if (currencySymbol.match(/^[0-9a-zA-Z]+$/)) {
          currencySymbol = currencySymbol + ' ';
        }
        numberValue = numberValue.toFixed(fractionalDigits);
        // Send the precision along with the number
        formattedNumber = ccNumber.formatNumber(numberValue, true, fractionalDigits);
        var sign = formattedNumber.charAt(0);
        if (sign === '-' || sign === '+') {
          $(element).text(sign + currencySymbol + formattedNumber.slice(1));
        } else {
          $(element).text(currencySymbol + formattedNumber);
        }
      } else {
        $(element).text((currencySymbol && prependNull ? currencySymbol : '') + (nullReplace ? nullReplace : ''));
      }
    }
  };

  /**
   * @public
   * @class The imageSource binding provides the ability to specify an alternate image and image text
   * to be loaded in the event that the desired image cannot be found.
   * <p>
   * Additionally one may specify a product object as the src and an optional imageStyle attribute.
   * The imageType attribute should be one of 'large' or 'small' (no quotes). In this case
   * this binding will attempt to find an image on the product, if one cannot be found it will fall back to the errorSrc image.
   * <p>
   * If imageType is not specified, the default type is 'small'.
   *  
   * <h2>Parameters:</h2>
   * <ul>
   *   <li><code>{Observable String} src</code> - The image source.</li>
   *   <li><code>{Observable String} errorSrc</code> - The alternate image to be used when the image at 'src' does not exist.</li>
   *   <li><code>{Observable String} [imageType='small']</code> - The image type.</li>
   *   <li><code>{Observable String} [alt]</code> - The image 'alt' text.</li>
   *   <li><code>{Observable String} [errorAlt]</code> - The error image 'alt' text.</li>
   *   <li><code>{Observable function(element)} [onerror]</code> - The error callback function, which is called if the initial image does not exist.</li>
   * </ul>
   * @example
   * &lt;img data-bind="imageSource: {src:'images/desiredImage.png', alt:'The desired image', errorSrc:'images/noImage.png', errorAlt:'No Image Found'}">&lt;/img>
   * &lt;img data-bind="imageSource: {src:myProduct, imageType: 'large', alt:'The desired image', errorSrc:'images/noImage.png', errorAlt:'No Image Found'}">&lt;/img>
   */
  ko.bindingHandlers.imageSource = {
    /**
      The logic runs once to initialize the binding for this element.
      @private
      @param {Object} element The DOM element attached to this binding.
      @param {function(): object} valueAccessor A function that returns all of the values associated with this binding.
     */
    init: function(element, valueAccessor) {
      var src, errSrc, tmp, cacheBust = false, values = ko.utils.unwrapObservable(valueAccessor());

      //If not working with values as an object or an image element don't do anything
      if (typeof values !== 'object' || element.nodeName !== 'IMG') {
        return;
      }

      if (values.cacheBust) {
        cacheBust = ko.utils.unwrapObservable(values.cacheBust);
      }

      src = ko.utils.unwrapObservable(values.src);

      if (cacheBust) {
        src = addCacheBustParam(src);
      }
      errSrc = ko.utils.unwrapObservable(values.errorSrc);

      //If both src and errorSrc are defined pre-cache the error image
      //This works under the assumption that error image src generally won't change
      //if it does there would just be a bit of extra delay before displaying the error image
      if (src && errSrc) {
        tmp = new Image();
        tmp.src = errSrc;
      }
    },

    /**
      Attempts to load the desired image from the provided source. 
      If the image fails to load the fallback image & text is instead used.
      @private
      @param {Object} element The DOM element attached to this binding.
      @param {function(): object} valueAccessor A function that returns all of the values associated with this binding.
      @param {function(): object} allBindingsAccessor Object containing information about other bindings on the same HTML element.
      @param {Object} viewModel The viewModel that is the current context for this binding.
      @param {Object} bindingContext The binding hierarchy for the current context.
     */
    update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
      var imageType, tmpImg, src, cacheBust = false, imageSrc, errSrc, alt, errAlt, onerror,
          values = ko.utils.unwrapObservable(valueAccessor());

      //If not working with values as an object or an image element don't do anything
      if (typeof values !== 'object' || element.nodeName !== 'IMG') {
        return;
      }

      if (values.cacheBust) {
        cacheBust = ko.utils.unwrapObservable(values.cacheBust);
      }

      //Unwrap input values
      imageSrc = ko.utils.unwrapObservable(values.src);
      imageType = ko.utils.unwrapObservable(values.imageType);
      if (!imageType) {
        imageType = 'small'; // default to small images if not specified
      }
      // prioritized list of functions for determining the image url
      var imageAccessors = [
        // Check for productImages
        function (source, imageType) {
          var result;
          if (source.productImages && source.productImages.length > 0) {
            result = source.productImages[0].url;
          }
          return result;
        },
        // Check for a url property
        function (source, imageType) {
          return source.url;
        },
        // Check for a property matching imageType + "Image" (e.g., smallImage)
        function (source, imageType) {
          var result, imgFromObj = imageSrc[imageType + 'Image'];
          if (imgFromObj) {
            result = imgFromObj.url;
          }
          return result;
        },
        // Check for a property named by "imageType".  This is a literal
        // property lookup.  e.g., product.primarySmallImageURL
        function (source, imageType) {
          var result;
          // this only works if imageSrc is an object
          if (imageSrc instanceof Object && imageSrc[imageType]) {
            result = imageSrc[imageType];
          }
          return result;
        },
        // Fall back to looking for "imageType + 'Image'" on the first child SKU
        function (source, imageType) {
          var sku, skuList, skuImage, result;
          skuList = source.childSKUs;
          // TODO this series of IFs could be further improved upon
          if (skuList) {
            sku = skuList[0];
            if (sku) {
              skuImage = sku[imageType + 'Image'];
              if (skuImage) {
                result = skuImage.url;
              }
            }
          }
          return result;
        },
        // If that fails, return source if it's a string
        function (source, imageType) {
          if (typeof source == "string") return source;
        }
      ];

      if (imageSrc) {
        // find the first accessor that returns a non-null value
        while (!src && imageAccessors.length) {
          src = imageAccessors.shift().call(this, imageSrc, imageType);
        }
      } else {
        src = values.errorSrc;
      }

      // Add cache bust param if required
      if (cacheBust) {
        src = addCacheBustParam(src);
      }

      errSrc = ko.utils.unwrapObservable(values.errorSrc);
      alt = ko.utils.unwrapObservable(values.alt);
      errAlt = ko.utils.unwrapObservable(values.errorAlt);
      onerror = ko.utils.unwrapObservable(values.onerror);

      //if we have no fallback image, then just load away
      if(!errSrc) {
        element.src = src;
        element.alt = alt ? alt : '';
        return;
      }

      if(src) {
        //Pre-cache image on a hidden element to prevent
        //the 'x' from being displayed
        tmpImg = new Image();

        //If the tmp image successfully loads then have the element display
        //the image.
        tmpImg.onload = function() {
          element.src = src;
          element.alt = alt ? alt : '';
        };

        //If the tmpImage fails to load successfully then display the fallback image
        tmpImg.onerror = function() {
          element.src = errSrc;
          element.alt = errAlt ? errAlt : '';

          //run the binding's onerror event.
          if(onerror) {
            onerror(element);
          }
        };

        tmpImg.src = src;
      } else {
        //If we have no main image at all then just load the fallback image
        element.src = errSrc;
        if(errAlt) {
          element.alt = errAlt;
        } else if(alt) {
          element.alt = alt;
        } else {
          element.alt = '';
        }

        //run the binding's onerror event.
        if(onerror) {
          onerror(element);
        }
      }
    }
  };

  // used in ko.bindingHandlers.makeAccess for selector uniqueness
  var makeAccessNum = 0;

  /**
   * @public
   * @class The makeAccess binding is a simple method for improving accessibility
   * of HTML elements by creating a span with an accessible class for readerText and
   * inserting that into the DOM. 
   * <p>
   * Text can either be specified directly, via the readerText parameter, or via the readerResource
   * parameter, which looks up the internationalized text from the resources.
   * <p>
   * With the cssContent setting you can optionally
   * remove the existing text from the element and replace it with a unique class
   * to display the text that has been removed.
   * 
   * <h2>Parameters:</h2>
   * <ul>
   *   <li><code>{Observable String} readerText</code> - The screen reader text.</li>
   *   <li><code>{Observable String} readerResource</code> - The screen reader text resource name.</li>
   *   <li><code>{Observable String} [cssContent]</code> - Use css content.</li>
   * </ul>
   * 
   * @example
   * &lt;div data-bind="makeAccess: {readerText: 'textForScreenReader', cssContent: 'on'}">&lt;/div>
   */
  ko.bindingHandlers.makeAccess = {
    /**
      The logic runs once to initialize the binding for this element. Wrap the value
      of readerText in a <span> with the cc-reader-text class and prepend that to the
      current element. If cssContent is on, create a unique class name with the :after
      psuedo selector, get the current element text and make that the value of the
      content parameter, write the style to <head>, add the class to the element, and
      remove the text from the DOM.
      @private
      @param {Object} element The DOM element attached to this binding.
      @param {function(): object} valueAccessor A function that returns all of the values associated with this binding.
    */
    init: function(element, valueAccessor) {

      var readerText, cssContent, ranClass,
        options = ko.utils.unwrapObservable(valueAccessor());

      readerText = $('<span class="cc-reader-text"/>');
      if(options.readerText) {
        readerText.text(ko.utils.unwrapObservable(options.readerText));
      } else if(options.readerResource) {
        readerText.text(CCi18n.t(ko.utils.unwrapObservable(options.readerResource)));
      }

      if(options.cssContent && options.cssContent == 'on') {
        cssContent = $(element).text();
        ranClass = 'cc-make-access-' + makeAccessNum++;
        $('<style>').text('.' + ranClass + ':after {content: "' + cssContent + '"}').appendTo('head');
        $(element).empty().addClass(ranClass);
      }

      $(element).prepend(readerText);
    },
    
    /**
      Update is run whenever an observable in the binding's properties changes.
      For localization, replace the current readerText with the localized version.
      @private
      @param {Object} element The DOM element attached to this binding.
      @param {function(): object} valueAccessor A function that returns all of the values associated with this binding.  
    */
    update: function(element, valueAccessor) {
      var options = ko.utils.unwrapObservable(valueAccessor());
      if(options.readerText) {
        $(element).children('.cc-reader-text').text(ko.utils.unwrapObservable(options.readerText));
      } else if(options.readerResource) {
        $(element).children('.cc-reader-text').text(CCi18n.t(ko.utils.unwrapObservable(options.readerResource)));
      }
    }
  };

  /**
   *  @public
   *  @class The hover binding is capable of adding a css class to an element based on whether
   *  or not the element is being hovered over. Can also be configured to enable/disable the hover
   *  functionality using the 'if' property and run functions for when an element
   *  is first hovered over and when the element stops being hovered over.
   *  
   * <h2>Parameters:</h2>
   * <ul>
   *   <li><code>{Observable String} if</code> - The screen reader text.</li>
   *   <li><code>{Observable String} class</code> - The screen reader text resource name.</li>
   *   <li><code>{Observable function(Object, Event)} [start]</code> - Callback function, called when hover starts on the element.</li>
   *   <li><code>{Observable function(Object, Event)} [stop]</code> - Callback function, called when hover stops on the element.</li>
   * </ul>
   *  @see jQueryUI hover
   *  @example
   *  &lt;div data-bind="hover: {if:booleanValue, class:'hoverClass', 
   *    start:onHover, stop:onHoverExit}">&lt;/div>
   */
  ko.bindingHandlers.hover = {
    /**
       The logic runs once to initialize the binding for this element. Does nothing for this binding.
       @private
       @param {Object} element The DOM element attached to this binding.
       @param {function(): object} valueAccessor A function that returns all of the values associated with this binding.
    */
    init: function(element, valueAccessor) {},

    /**
      update is run whenever an observable in the binding's properties changes. Configures the element to respond to
      hover events by updating the class on hover and running functions on the start and end of hovers.
      @private
      @param {Object} element The DOM element attached to this binding.
      @param {function(): object} valueAccessor A function that returns all of the values associated with this binding.
      @param {function(): object} allBindingsAccessor Object containing information about other bindings on the same HTML element.
      @param {Object} viewModel The viewModel that is the current context for this binding.
      @param {Object} bindingContext The binding hierarchy for the current context.
    */
    update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
      var existingClasses, ii, removeKey, infunc, outfunc,
          value = ko.utils.unwrapObservable(valueAccessor());

      //Remove any existing classes.
      existingClasses = element.ko_hoverClassValue;
      if (existingClasses) {
        if (Array.isArray(existingClasses)) {
          for (ii = 0; ii < existingClasses.length; ii += 1) {
            $(element).removeClass(existingClasses[ii]);
          }
        } else if ( typeof existingClasses === 'object') {
          //this should never happen, but just in case
          for (removeKey in existingClasses) {
            if (existingClasses.hasOwnProperty(removeKey)) {
              $(element).removeClass(existingClasses[removeKey]);
            }
          }
        } else {
          $(element).removeClass(existingClasses);
        }
      }

      //Current only an object input is supported
      if(typeof value === 'object') {
        //If the 'if' property is set only enable if it is set to true. Otherwise always display
        if(typeof value['if'] !== 'undefined' && !ko.utils.unwrapObservable(value['if'])) {
          $(element).hover(function(){}, function(){});
          return;
        }

        //Keep track of the in and out functions for hover over and hover exit.
        infunc = ko.utils.unwrapObservable(value.start);
        outfunc = ko.utils.unwrapObservable(value.stop);

        element.ko__hoverClassValue = ko.utils.unwrapObservable(value['class']);
        $(element).hover(function(e) {
          var addClassesKey, classes;
          //The on hover function. Adds all supplied classes and then runs the
          //in function
          classes = this.ko_hoverClassValue;
          if (classes) {
            if (Array.isArray(classes)) {
              for (ii = 0; ii < classes.length; ii += 1) {
                $(this).addClass(classes[ii]);
              }
            } else if ( typeof classes === 'Object') {
              //this should never happen, but just in case
              for (addClassesKey in classes) {
                if (classes.hasOwnProperty(addClassesKey)) {
                  $(this).addClass(classes[removeKey]);
                }
              }
            } else {
              $(this).addClass(classes);
            }
          }
          if(infunc) {
            infunc(viewModel, e);
          }
        }, function(e) {
          var classIndex, classes, removeClassesKey;
          //The out hover function. Removes all supplied classes and then runs the
          //out function.
          classes = this.ko_hoverClassValue;
          if (classes) {
            if (Array.isArray(classes)) {
              for (classIndex = 0; classIndex < classes.length; classIndex += 1) {
                $(this).removeClass(classes[classIndex]);
              }
            } else if ( typeof classes === 'Object') {
          //this should never happen, but just in case
              for (removeClassesKey in classes) {
                if (classes.hasOwnProperty(removeClassesKey)) {
                  $(this).removeClass(classes[removeClassesKey]);
                }
              }
            } else {
              $(this).removeClass(classes);
            }
            if(outfunc) {
              outfunc(viewModel, e);
            }
          }
        });
      }
    }
  };

  /**
   * @public
   * @class Displays a dynamic background image on an html element. Image is found at
   * the combination of path + image + extension. Extension is assumed to be .png if omitted.
   * <h2>Parameters:</h2>
   * <ul>
   *   <li><code>{Observable String} image</code> - The image name.</li>
   *   <li><code>{Observable String} [path]</code> - The image path.</li>
   *   <li><code>{Observable String} [extension='.png']</code> - The image file extension.</li>
   * </ul>
   * @example
   * &lt;div class='cc-paletteWidget'  
   *   data-bind='attr: {id: "CC-" + widget().typeId() + "PaletteButton"}, 
   *     background: {path: widget().imagePath, image: "palette_icon"}'>
   * &lt;/div>
   */
  ko.bindingHandlers.background = {
    /**
      The logic runs once to initialize the binding for this element. Does nothing for this binding.
      @private
      @param {Object} element The DOM element attached to this binding.
      @param {function(): object} valueAccessor A function that returns all of the values associated with this binding.
    */
    init: function(element, valueAccessor) {},

    /**
      update is run whenever an observable in the binding's properties changes. Configures the element to display a background
      image based on a provided image location & extension.
      @private
      @param {Object} element The DOM element attached to this binding.
      @param {function(): object} valueAccessor A function that returns all of the values associated with this binding.
      @param {function(): object} allBindingsAccessor Object containing information about other bindings on the same HTML element.
      @param {Object} viewModel The viewModel that is the current context for this binding.
      @param {Object} bindingContext The binding hierarchy for the current context.
    */
    update: function(element, valueAccessor) {
      var img, path, extension, value = ko.utils.unwrapObservable(valueAccessor());

      if(typeof value === 'object') {
        img = ko.utils.unwrapObservable(value.image);
        if(!img) {
          //If img is null or undefined then remove the background image
          $(element).css('background-image', '');
          return;
        }

        path = '';
        extension = '.png'; //Default to png

        //If an extension was provided use it. Prepend with '.' if it was omitted
        if (value.extension) {
          extension = ko.utils.unwrapObservable(value.extension);

          if (path.charAt(0) !== '.') {
            extension = '.' + extension;
          }
        }

        //If an path was provided use it. Append with '/' if it was omitted
        if (value.path) {
          path = ko.utils.unwrapObservable(value.path) || '';

          if (path.length > 0 && path.charAt(path.length-1) !== '/') {
            path = path + '/';
          }
        }
        $(element).css('background-image', 'url(' + path + img + extension + ')');
      } else {
        //If given a singular value or an undefined value then it is expected to be the
        //full path.
        if(value) {
          $(element).css('background-image', 'url(' + value + ')');
        } else {
          $(element).css('background-image', '');
        }
      }
    }
  };

  /**
   * @public
   * @class The draggable binding provides the ability to dynamically configure an element to be draggable, 
   * using the jQuery UI 'draggable' function.
   * <p>
   * <h2>Parameters:</h2>
   * <ul>
   *   <li><code>{Observable String} [destroy]</code> - Destroy the draggable element.</li>
   *   <li><code>{Observable String} [enabled]</code> - Is the draggable element enabled?</li>
   *   <li><code>{Observable String} [selectable]</code> - Is the text within the draggable element selectable?</li>
   * </ul>
   * <p>
   * In addition, any of the options used by the jQuery UI function may be supplied in the binding declaration:
   * <a href="http://api.jqueryui.com/draggable/">http://api.jqueryui.com/draggable</a>
   * 
   * @see https://jqueryui.com/draggable/
   * @example
   * &lt;div data-bind="draggable: {'selectable': 'false', 'appendTo': 'body', 
   *   'distance': '50', 'helper': 'clone'}">Drag Me!&lt;/div>
   */
  ko.bindingHandlers.draggable = {
    /**
       The logic runs once to initialize the binding for this element. Initializes the current element to be draggable
       using the provided parameters.
       @private
       @param {Object} element The DOM element attached to this binding.
       @param {function(): object} valueAccessor A function that returns all of the values associated with this binding.
    */
    init : function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
      var value = ko.utils.unwrapObservable(valueAccessor());
      if ( typeof value === 'object') {
        if ( typeof value.destroy !== 'undefined' && ko.utils.unwrapObservable(value.destroy)) {
          return;
        }
        //Set the element to be draggable and pass all options on
        $(element).draggable(value).data('viewModel', viewModel);

        //Enable/disable the draggable element based on the value of the enabled property
        //If enabled isn't set to true, just assume it's enabled this prevents having to constantly set
        //enabled since it's likely most things will be enabled by default.
        if ( typeof value.enabled !== 'undefined' && !ko.utils.unwrapObservable(value.enabled)) {
          $(element).draggable('disable');
        }

        //Enable/disable the selection of text contained within this div, this can improve dragging behavior
        //not entirely sure if this propert is working
        if(typeof value.selectable !== 'undefined' && ko.utils.unwrapObservable(value.selectable)) {
          $(element).enableSelection();
        } else {
          $(element).disableSelection();
        }
      } else {
        //Value is not a object so enable dragging without options
        $(element).draggable().data('viewModel', viewModel);

        //The value is assumed to be a truey/falsey value that controls whether
        //or not the object is enabled for dragging
        if (value) {
          $(element).draggable('enable');
        } else {
          $(element).draggable('disable');
        }
      }
    },

    /**
      update is run whenever an observable in the binding's properties changes. Reconfigures the draggable's options.
      @private
      @param {Object} element The DOM element attached to this binding.
      @param {function(): object} valueAccessor A function that returns all of the values associated with this binding.
      @param {function(): object} allBindingsAccessor Object containing information about other bindings on the same HTML element.
      @param {Object} viewModel The viewModel that is the current context for this binding.
      @param {Object} bindingContext The binding hierarchy for the current context.
    */
    update : function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
      var value = ko.utils.unwrapObservable(valueAccessor());
      if ( typeof value === 'object') {

        if ( typeof value.destroy !== 'undefined' && ko.utils.unwrapObservable(value.destroy)) {
          if ($(element).draggable) {
            $(element).draggable('destroy');
          }
          return;
        }
        //Enable/disable the draggable element based on the value of the enabled property
        //If enabled isn't set to true, just assume it's enabled this prevents having to constantly set
        //enabled since it's likely most things will be enabled by default.
        if ( typeof value.enabled !== 'undefined') {
          if (!ko.utils.unwrapObservable(value.enabled)) {
            $(element).draggable('disable');
          } else {
            $(element).draggable('enable');
          }
        }

        if(typeof value.selectable !== 'undefined' && ko.utils.unwrapObservable(value.selectable)) {
          $(element).enableSelection();
        } else {
          $(element).disableSelection();
        }

        //Update any option settings that may have changed
        $(element).draggable('option', value);
      } else {
        //The value is assumed to be a truey/falsey value that controls whether
        //or not the object is enabled for dragging
        if (value) {
          $(element).draggable('enable');
        } else {
          $(element).draggable('disable');
        }
      }
    }
  };

  /**
   * @public
   * @class The droppable binding provides the ability to dynamically configure an element to be droppable.
   * using the jQuery UI 'droppable' function.
   * <p>
   * <h2>Parameters:</h2>
   * <ul>
   *   <li><code>{Observable String} [destroy]</code> - Destroy the droppable element.</li>
   *   <li><code>{Observable String} [enabled]</code> - Is the droppable element enabled?</li>
   * </ul>
   * <p>
   * In addition, any of the options used by the jQuery UI function may be supplied in the binding declaration:
   * <a href="http://api.jqueryui.com/droppable/">http://api.jqueryui.com/droppable</a>
   * 
   * @see https://jqueryui.com/droppable/
   * @example
   * &lt;div data-bind="droppable: {drop: onDrop, destroy: endDrop}">
   *   Drop Something On Me!&lt;/div>
   */
  ko.bindingHandlers.droppable = {
    /**
      The logic runs once to initialize the binding for this element. Initializes the element to be droppable based
      on the provided parameters.
      @private
      @param {Object} element The DOM element attached to this binding.
      @param {function(): object} valueAccessor A function that returns all of the values associated with this binding.
      @param {function(): object} allBindingsAccessor Object containing information about other bindings on the same HTML element.
      @param {Object} viewModel The viewModel that is the current context for this binding.
      @param {Object} bindingContext The binding hierarchy for the current context.
    */
    init : function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
      var value = ko.utils.unwrapObservable(valueAccessor());
      if ( typeof value === 'object') {
        if ( typeof value.destroy !== 'undefined' && ko.utils.unwrapObservable(value.destroy)) {
          return;
        }
        //Set the element to be draggable and pass all options on
        $(element).droppable(value).data('viewModel', viewModel);

        //Enable/disable the draggable element based on the value of the enabled property
        //If enabled isn't set to true, just assume it's enabled this prevents having to constantly set
        //enabled since it's likely most things will be enabled by default.
        if ( typeof value.enabled !== 'undefined' && !ko.utils.unwrapObservable(value.enabled)) {
          $(element).droppable('disable');
        }
      } else if ( typeof value === 'function') {
        //Value is not a object so enable dragging without options
        $(element).droppable({
          drop : value
        }).data('viewModel', viewModel);
      }
    },

    /**
      update is run whenever an observable in the binding's properties changes. Reconfigures the droppable element.
      @private
      @param {Object} element The DOM element attached to this binding.
      @param {function(): object} valueAccessor A function that returns all of the values associated with this binding.
      @param {function(): object} allBindingsAccessor Object containing information about other bindings on the same HTML element.
      @param {Object} viewModel The viewModel that is the current context for this binding.
      @param {Object} bindingContext The binding hierarchy for the current context.
    */
    update : function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
      var value = ko.utils.unwrapObservable(valueAccessor());
      if ( typeof value === 'object') {
        if ( typeof value.destroy !== 'undefined' && ko.utils.unwrapObservable(value.destroy)) {
          if ($(element).droppable) {
            $(element).droppable('destroy');
          }
          return;
        }

        if ($(element).droppable) {
          //Update any option settings that may have changed
          $(element).droppable('option', value);
        } else {
          $(element).droppable(value).data('viewModel', viewModel);
        }
        //Enable/disable the draggable element based on the value of the enabled property
        //If enabled isn't set to true, just assume it's enabled this prevents having to constantly set
        //enabled since it's likely most things will be enabled by default.
        if ( typeof value.enabled !== 'undefined') {
          if (!ko.utils.unwrapObservable(value.enabled)) {
            $(element).droppable('disable');
          } else {
            $(element).droppable('enable');
          }
        }

      } else if ( typeof value === 'function') {
        $(element).droppable({
          drop : value
        }).data('viewModel', viewModel);
      }
    }
  };

  /**
     @public
     @class The selectable binding provides the ability to dynamically configure a group of elements to be selectable,
     by either clicking with the mouse, or dragging a box around the required elements.
     <p>
     Parameters can either be:
     <ul>
       <li>A boolean Observable, to switch the selectability on or off.</li>
       <li>An object, containing the options for the jQuery 'selectable' plugin, specified here: <a href="http://api.jqueryui.com/selectable/">http://api.jqueryui.com/selectable/</a></li>
     </ul> 
     @see https://jqueryui.com/selectable/
     @example
     &lt;div data-bind="selectable: true">...&lt;/div>
     @example
     &lt;div data-bind="selectable: {delay: 150}">...&lt;/div>
   */
  ko.bindingHandlers.selectable = {
    /**
      The logic runs once to initialize the binding for this element.
      Initializes the current element to be selectable using the provided parameters.
      @private
      @param {Object} element The DOM element attached to this binding.
      @param {function(): object} valueAccessor A function that returns all of the values associated with this binding.
      @param {function(): object} allBindingsAccessor Object containing information about other bindings on the same HTML element.
      @param {Object} viewModel The viewModel that is the current context for this binding.
      @param {Object} bindingContext The binding hierarchy for the current context.
    */
    init : function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
      var value = ko.utils.unwrapObservable(valueAccessor());
      if ( typeof value === 'object') {
        if ( typeof value.destroy !== 'undefined' && ko.utils.unwrapObservable(value.destroy)) {
          return;
        }
        $(element).selectable(value).data('viewModel', viewModel);
        if ( typeof value.enabled !== 'undefined' && !ko.utils.unwrapObservable(value.enabled)) {
          $(element).selectable('disable');
        }
        if(typeof value.selectable !== 'undefined' && ko.utils.unwrapObservable(value.selectable)) {
          $(element).enableSelection();
        } else {
          $(element).disableSelection();
        }
      } else {
        $(element).selectable().data('viewModel', viewModel);
        if (value) {
          $(element).selectable('enable');
        } else {
          $(element).selectable('disable');
        }
      }
    },
    /**
      update is run whenever an observable in the binding's properties changes.
      @private
      @param {Object} element The DOM element attached to this binding.
      @param {function(): object} valueAccessor A function that returns all of the values associated with this binding.
      @param {function(): object} allBindingsAccessor Object containing information about other bindings on the same HTML element.
      @param {Object} viewModel The viewModel that is the current context for this binding.
      @param {Object} bindingContext The binding hierarchy for the current context.
    */
    update : function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
      var value = ko.utils.unwrapObservable(valueAccessor());
      if ( typeof value === 'object') {

        if ( typeof value.destroy !== 'undefined' && ko.utils.unwrapObservable(value.destroy)) {
          if ($(element).selectable) {
            $(element).selectable('destroy');
          }
          return;
        }
        if ( typeof value.enabled !== 'undefined') {
          if (!ko.utils.unwrapObservable(value.enabled)) {
            $(element).selectable('disable');
          } else {
            $(element).selectable('enable');
          }
        }
        if(typeof value.selectable !== 'undefined' && ko.utils.unwrapObservable(value.selectable)) {
          $(element).enableSelection();
        } else {
          $(element).disableSelection();
        }
        $(element).selectable('option', value);
      } else {
        if (value) {
          $(element).selectable('enable');
        } else {
          $(element).selectable('disable');
        }
      }
    }
  };

  /**
   * The slide binding provides the ability to slide an element in and out of sight
   * based on the boolean value supplied (true = show)
   * <p>
   * <h2>Parameters:</h2>
   * <ul>
   *   <li><code>{Observable boolean} value</code> - Show/hide the element.</li>
   * </ul>
   * @public
   * @class Slide an element based on a condition.
   * @see http://api.jquery.com/slidedown/
   * @see http://api.jquery.com/slideup/
   * @see http://api.jquery.com/toggle/
   * @example
   * &lt;div data-bind="slide: myValue">...&lt;/div>
   */
  ko.bindingHandlers.slide = {
    /**
      The logic runs once to initialize the binding for this element.
      Initializes the current element to be shown or hidden depending
      on the supplied value.
      @private
      @param {Object} element The DOM element attached to this binding.
      @param {function(): object} valueAccessor A function that returns all of the values associated with this binding.
    */
    init : function (element, valueAccessor) {
      var value = ko.utils.unwrapObservable(valueAccessor());

      $(element).toggle(value);
    },
    /**
      update is run whenever an observable in the binding's properties changes.
      @private
      @param {Object} element The DOM element attached to this binding.
      @param {function(): object} valueAccessor A function that returns all of the values associated with this binding.
    */
    update : function (element, valueAccessor) {
      var value = ko.utils.unwrapObservable(valueAccessor());

      if(value) {
        $(element).slideDown();
      } else {
        $(element).slideUp();
      }

    }
  };

  /**
   * The fade binding provides the ability to fade an element in and out of sight
   * based on the boolean value supplied (true = show)
   * <p>
   * <h2>Parameters:</h2>
   * <ul>
   *   <li><code>{Observable boolean} value</code> - Show/hide the element.</li>
   * </ul>
   * @public
   * @class Fade an element based on a condition.
   * @see http://api.jquery.com/fadein/
   * @see http://api.jquery.com/fadeout/
   * @see http://api.jquery.com/toggle/
   * @example
   * &lt;div data-bind="fade: myValue">...&lt;/div>
   */
  ko.bindingHandlers.fade = {
    /**
      The logic runs once to initialize the binding for this element.
      Initializes the current element to be shown or hidden depending
      on the supplied value
      @private
      @param {Object} element The DOM element attached to this binding.
      @param {function(): object} valueAccessor A function that returns all of the values associated with this binding.
    */
    init : function (element, valueAccessor) {
      var value = ko.utils.unwrapObservable(valueAccessor());

      $(element).toggle(value);
    },
    /**
      update is run whenever an observable in the binding's properties changes.
      @private
      @param {Object} element The DOM element attached to this binding.
      @param {function(): object} valueAccessor A function that returns all of the values associated with this binding.
    */
    update : function (element, valueAccessor) {
      var value = ko.utils.unwrapObservable(valueAccessor());

      if(value) {
        $(element).fadeIn('slow');
      } else {
        $(element).fadeOut('slow');
      }

    }
  };

  /**
   * @public
   * @class The radio binding provides the ability to bind an element to a set
   * of bootstrap radio buttons.
   * <p>
   * <h2>Parameters:</h2>
   * <ul>
   *   <li><code>{Observable String} property</code> - The view model property to be set.</li>
   * </ul>
   * <p>
   * The value of the radio button is specified through the 'radioValue' binding.
   * @example
   *  &lt;div class="btn-group">
   *    &lt;button type="button" class="btn" data-bind="radio: fontAlignment, 
   *        radioValue: 'left'">
   *      &lt;i class="icon-align-left">&lt;/i>
   *    &lt;/button>
   *    &lt;button type="button" class="btn" data-bind="radio: fontAlignment, 
   *        radioValue: 'center'">
   *      &lt;i class="icon-align-center">&lt;/i>
   *    </button>
   *    &lt;button type="button" class="btn" data-bind="radio: fontAlignment, 
   *        radioValue: 'right'">
   *      &lt;i class="icon-align-right">&lt;/i>
   *    &lt;/button>
   *  &lt;/div>
   *
   */
  ko.bindingHandlers.radio = {
    /**
      The logic runs once to initialize the binding for this element.
      @private
      @param {Object} element The DOM element attached to this binding.
      @param {function(): object} valueAccessor A function that returns all of the values associated with this binding.
      @param {function(): object} allBindings Object containing information about other bindings on the same HTML element.
      @param {Object} data The viewModel that is the current context for this binding.
      @param {Object} context The binding hierarchy for the current context.
    */
    init: function(element, valueAccessor, allBindings, data, context) {
      var $buttons, $element, elementBindings, observable;
      observable = valueAccessor();
      if (!ko.isWriteableObservable(observable)) {
          throw "You must pass an observable or writeable computed";
      }
      $element = $(element);
      if ($element.hasClass("btn")) {
          $buttons = $element;
      } else {
          $buttons = $(".btn", $element);
      }
      elementBindings = allBindings();
      $buttons.each(function() {
        var $btn, btn, radioValue;
        btn = this;
        $btn = $(btn);
        radioValue = elementBindings.radioValue || $btn.attr("data-value") || $btn.attr("value") || $btn.text();
        $btn.on("click", function() {
          observable(ko.utils.unwrapObservable(radioValue));
        });
        return ko.computed({
          disposeWhenNodeIsRemoved: btn,
          read: function() {
            $btn.toggleClass("active", observable() === ko.utils.unwrapObservable(radioValue));
          }
        });
      });
    }
  };

  /**
   * @public
   * @class The checkbox binding provides the ability to bind an element to a set
   * of bootstrap buttons.
   * <p>
   * <h2>Parameters:</h2>
   * <ul>
   *   <li><code>{Observable boolean} property</code> - The view model property to be set.</li>
   * </ul>
   * @example
   *  &lt;div class="btn-group">
   *    &lt;button type="button" class="btn" data-bind="checkbox: textDecorationBold">
   *      &lt;i class="icon-bold">&lt;/i>
   *    &lt;/button>
   *    &lt;button type="button" class="btn" data-bind="checkbox: textDecorationItalic">
   *      &lt;i class="icon-italic">&lt;/i>
   *    &lt;/button>
   *  &lt;/div>
   */
  ko.bindingHandlers.checkbox = {
    /**
      The logic runs once to initialize the binding for this element.
      @private
      @param {Object} element The DOM element attached to this binding.
      @param {function(): object} valueAccessor A function that returns all of the values associated with this binding.
      @param {function(): object} allBindings Object containing information about other bindings on the same HTML element.
      @param {Object} data The viewModel that is the current context for this binding.
      @param {Object} context The binding hierarchy for the current context.
    */
    init: function(element, valueAccessor, allBindings, data, context) {
      var $element, observable;
      observable = valueAccessor();
      if (!ko.isWriteableObservable(observable)) {
          throw "You must pass an observable or writeable computed";
      }
      $element = $(element);
      $element.on("click", function() {
          observable(!observable());
      });
      ko.computed({
          disposeWhenNodeIsRemoved: element,
          read: function() {
              $element.toggleClass("active", observable());
          }
      });
    }
  };

  /**
   * @public
   * @class The modalTabbingContraint binding will force tabbed focus changes to cycle
   * through 'tabbable' elements within a particular modal to prevent access to
   * elements behind the curtain.
   * The binding currently has no options.
   * @example
      &lt;div class="modal" data-bind="modalTabbingContraint">...&lt;/div>
   */
  ko.bindingHandlers.modalTabbingContraint = {
    /**
      The logic runs once to initialize the binding for this element.
      @private
      @param {Object} element The DOM element attached to this binding.
      @param {function(): object} valueAccessor A function that returns all of the values associated with this binding.
      @param {function(): object} allBindings Object containing information about other bindings on the same HTML element.
      @param {Object} data The viewModel that is the current context for this binding.
      @param {Object} context The binding hierarchy for the current context.
    */
    init: function(element, valueAccessor, allBindings, data, context) {
      var bindTabbing, tabbable, disabled, delay, elm, hidden;

      // primary tabbing logic
      bindTabbing = function(event, elm) {
        // get the current state of tabbable elements.
        tabbable = $(element).find(':tabbable');

        if(elm == $(tabbable)[0] && event.keyCode === 9 && event.shiftKey) {
          // first tabbable element should shift+tab to the last element in the modal
          event.preventDefault();
          $(tabbable[tabbable.length - 1]).focus();
          return false;
        } else if(elm == $(tabbable)[tabbable.length - 1] && event.keyCode === 9 && !event.shiftKey) {
          // last tabbable element should tab to the first element in the modal
          event.preventDefault();
          $(tabbable[0]).focus();
          return false;
        }
      };

      // when the modal is shown, get all tabbable and disabled element.
      // bind the function that controls tabbing functionality within a modal
      $(element).on('shown.bs.modal', function() {
        tabbable = $(element).find(':tabbable');
        disabled = $(element).find(':disabled');
        hidden = $(element).find(':hidden');

        $.each(tabbable, function(ii, tabItem) {
          $(tabItem).on('keydown' , function(e) {
            bindTabbing(e, tabItem);
          });
        });

        $.each(disabled, function(ii, disabledItem) {
          $(disabledItem).on('keydown' , function(e) {
            bindTabbing(e, disabledItem);
          });
        });

        $.each(hidden, function(ii, hiddenItem) {
          $(hiddenItem).on('keydown' , function(e) {
            bindTabbing(e, hiddenItem);
          });
        });
      });
    }
  };

  /**
   * The imageZoom binding handler is used with the product details widget to show magnified views of product images
   * <p>
   * <h2>Parameters:</h2>
   * <ul>
   *   <li><code>{Observable float} magnifierPercent</code> - The image magnifier percent.</li>
   *   <li><code>{Observable boolean} magnifierEnabled</code> - Enable the image magnifier?</li>
   *   <li><code>{Observable String} smallImageUrl</code> - The URL of the small image.</li>
   *   <li><code>{Observable String} fullImageUrl</code> - The URL of the full image.</li>
   *   <li><code>{Observable int} index</code> - The index of the active image.</li>
   *   <li><code>{Observable int} spinnerDelay</code> - The spinner delay, in ms. If the image is taking longer than this
   *   time to load, the spinner icon will be shown.</li>
   *   <li><code>{Observable String[]} smallImageUrls</code> - The array of small image URLs.</li>
   *   <li><code>{Observable String[]} fullImageUrls</code> - The array of full image URLs.</li>
   *   <li><code>{Observable String} errorImageUrl</code> - The error image URL, shown if the image fails to load.</li>
   * </ul>
   * @public
   * @class Zoom a product image.
   * @see CCImageZoom
   * @example 
   * &lt;div id="cc-image-viewer" data-bind="imageZoom: {
   *     magnifierPercent: 0.35,
   *     magnifierEnabled: false,
   *     smallImageUrl: product().mediumImageURLs()[activeImgIndex()],
   *     fullImageUrl: product().fullImageURLs()[activeImgIndex()],
   *     index: activeImgIndex,
   *     spinnerDelay: 200,
   *     smallImageUrls: product().mediumImageURLs,
   *     fullImageUrls: product().fullImageURLs,
   *     errorImageUrl: '/img/no-image.jpg'}">
   *     &lt;img class="ccz-small img-responsive" data-bind="productImageSource: {src:product, imageType: 'medium', alt:product().displayName(), errorSrc:'/img/no-image.jpg', errorAlt:'No Image Found'}">&lt;/img>
   * &lt;/div>
  */
  ko.bindingHandlers.imageZoom = {
    /**
      The logic runs once to initialize the binding for this element.
      @private
      @param {Object} element The DOM element attached to this binding.
      @param {function(): object} valueAccessor A function that returns all of the values associated with this binding.
    */
    init: function(element, valueAccessor) {
     /* Need a new instance of CCImageZoom for each tag */
     var ccImageZoom = new CCImageZoom();
     ccImageZoom.element = element;
     var values = ko.utils.unwrapObservable(valueAccessor());
     /* sets the given property on the target if it exists and is not null in the values object */
     function set(propertyNames,target) {
      if (!propertyNames) { return; }
      for (var i = propertyNames.length -1; i>=0; i-=1) {
        var value = ko.utils.unwrapObservable(values[propertyNames[i]]);
        if (typeof(value) !== 'undefined' && value !== null) {
          target[propertyNames[i]] = value;
        }
      }
    }
    set(['smallImageUrl',
      'fullImageUrl',
      'imageMetadataDefault',
      'fullImageClass',
      'smallImageClass',
      'magnifierClass',
      'flyoutClass',
      'magnifierPercent',
      'flyoutEnabled',
      'magnifierEnabled',
      'spinnerDelay',
      'replaceImageAtIndex',
      'errorImageUrl'],ccImageZoom);
    ccImageZoom.index = values['index'];
    ccImageZoom.smallImageUrls = values['smallImageUrls'];
    ccImageZoom.fullImageUrls = values['fullImageUrls'];
    ccImageZoom.imageMetadatas = values['imageMetadatas'];
    ccImageZoom.start();
  },
    /**
      update is run whenever an observable in the binding's properties changes.
      @private
      @param {Object} element The DOM element attached to this binding.
      @param {function(): object} valueAccessor A function that returns all of the values associated with this binding.
      @param {function(): object} allBindingsAccessor Object containing information about other bindings on the same HTML element.
      @param {Object} viewModel The viewModel that is the current context for this binding.
      @param {Object} bindingContext The binding hierarchy for the current context.
    */
  update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
  }
  }; // end imageZoom binding

  /**
   * Helper function to add a simple cache busting parameter to the end of a URL.
   * @param pUrl The URL.
   */
  var addCacheBustParam = function(pUrl) {
    var bustKVP = 'bust=' + (new Date()).getTime();
    if (pUrl.indexOf('?') !== -1) {
      if (pUrl.indexOf('?') !== pUrl.length - 1) {
        pUrl += '&' + bustKVP;
      } else {
        // ? is the last character in the URL
        pUrl += bustKVP;
      }
    } else {
      pUrl += '?' + bustKVP;
    }

    return pUrl;
  }

  /**
   * @public
   * @class The productImageSource binding provides scaled images to be displayed.
   * <p>
   * It also provides the ability to specify an alternate image and image text
   * to be loaded in the event that the desired image cannot be found.
   * <p>
   * One may specify a product object as the src and an optional imageType attribute.
   * The imageType attribute should be one of 'large', 'medium', 'small' or 'thumb' (no quotes). In this case
   * this binding will attempt to find an image on the product, if one cannot be found it will fall back to the errorSrc image.
   * <p>
   * If imageType is not specified, the default style is 'medium'.
   * <p>
   * If the image is not found, it will fall back to the errorSrc image.
   *
   * PNG files can optionally be converted to JPEG by specifying the outputFormat attribute. JPEG images compress
   * better and may reduce file sizes without adversely affecting image quality. JPEG images don't support alpha
   * transparency but one may control the alpha replacement color by specifying the alphaChannelColor attribute as
   * a hex color code (defaults to FFFFFF). The quality of the converted image can be controlled via the quality
   * attribute, accepting values in the range of '0.1' (lowest quality, smallest size) to '1.0' (highest quality,
   * largest size).
   *
   * <h2>Parameters:</h2>
   * <ul>
   *   <li><code>{Observable Object} src</code> - The image source object.
   *   This should contain an object of the form:
   *   <pre>
   *   {
   *     'primaryFullImageURL': '..',
   *     'primaryLargeImageURL': '..',
   *     'primaryMediumImageURL': '..',
   *     'primarySmallImageURL': '..',
   *     'primaryThumbImageURL': '..'
   *   }
   *   </pre>
   *   </li>
   *   <li><code>{Observable String} [imageType='medium']</code> - The image type. One of 'full', 'large', 'medium', 'small', 'thumb'</li>
   *   <li><code>{Observable String} [errorSrc]</code> - The error image URL.</li>
   *   <li><code>{Observable String} [alt]</code> - The image 'alt' text.</li>
   *   <li><code>{Observable String} [outputFormat]</code> - PNG images can be converted to a smaller sized JPEG by
   *   setting 'outputFormat' to JPEG.</li>
   *   <li><code>{Observable String} [alphaChannelColor]</code> - Hex color code (default FFFFFF). Used with
   *   'outputFormat' to control the replacement color for the alpha transparency of source image. </li>
   *   <li><code>{Observable String} [quality]</code> - The quality of the converted JPEG image, when used with
   *   'outputFormat'. Valid values: '0.1' to '1.0'. Defaults to '1.0'</li>
   *   <li><code>{Observable String} [errorAlt]</code> - The error image 'alt' text.</li>
   *   <li><code>{Observable function(Object)} [onerror]</code> - The error callback function. Called with the current element.</li>
   * </ul>
   * @example
   * &lt;img data-bind="productImageSource: {src:myProduct, , alt:'The desired image', errorSrc:'images/noImage.png', errorAlt:'No Image Found'}">&lt;/img>
   * &lt;img data-bind="productImageSource: {src:myProduct, imageType: 'large', alt:'The desired image', errorSrc:'images/noImage.png', errorAlt:'No Image Found'}">&lt;/img>
   * &lt;img data-bind="productImageSource: {src:myProduct, outputFormat: 'JPEG', alphaChannelColor: '000000', quality: '0.8', imageType: 'large', alt:'The desired image', errorSrc:'images/noImage.png', errorAlt:'No Image Found'}">&lt;/img>
*/
ko.bindingHandlers.productImageSource = {

  /**
   * Get the 'no-image' site settings, if set.
   * <p>
   * Looks up the parent hierarchy for the SiteViewModel, located at the 'site' property of WidgetViewModel, and
   * uses the noImageSrc property from the site.
   * @param bindingContext The binding context.
   * @returns {*}
   */
  getNoImageSiteSetting: function(bindingContext) {
    var errorSrc = null;

    for (var i=0; i<bindingContext.$parents.length; i++) {
      // Look for the 'site' observable in the widget view model
      if (ko.isObservable(bindingContext.$parents[i].site)) {
        errorSrc = ko.unwrap(bindingContext.$parents[i].site().noImageSrc);
        break;
      }
    }

    return errorSrc;
  },

 /**
    The logic runs once to initialize the binding for this element. Preloads the fallback image if it's already set.
    @private
    @param {Object} element The DOM element attached to this binding.
    @param {function(): object} valueAccessor A function that returns all of the values associated with this binding.
    @param {function(): object} allBindingsAccessor Object containing information about other bindings on the same HTML element.
    @param {Object} viewModel The viewModel that is the current context for this binding.
    @param {Object} bindingContext The binding hierarchy for the current context.
  */
 init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
   var src, defaultErrSrc, siteNoImageSrc, errSrc, tmp, values = ko.utils.unwrapObservable(valueAccessor());

   //If not working with values as an object or an image element don't do anything
   if(typeof values !== 'object' || element.nodeName !== 'IMG') {
     return;
   }

   src = ko.utils.unwrapObservable(values.src);

   // Error source - use the one defined in site settings first, and then fall back to the one specified
   // in the errorSrc attribute.
   defaultErrSrc = ko.utils.unwrapObservable(values.errorSrc);
   siteNoImageSrc = ko.bindingHandlers.productImageSource.getNoImageSiteSetting(bindingContext);
   errSrc = siteNoImageSrc && siteNoImageSrc.length > 0 ? siteNoImageSrc : defaultErrSrc;

   //If both src and errorSrc are defined pre-cache the error image
   //This works under the assumption that error image src generally won't change
   //if it does there would just be a bit of extra delay before displaying the error image
   if(src && errSrc) {
     tmp = new Image();
     tmp.src = errSrc;
   }
 },

 /**
    update is run whenever an observable in the binding's properties changes. Attempts to load the desired image from
    the provided source. If the image fails to load the fallback image & text is instead used.
    @private
    @param {Object} element The DOM element attached to this binding.
    @param {function(): object} valueAccessor A function that returns all of the values associated with this binding.
    @param {function(): object} allBindingsAccessor Object containing information about other bindings on the same HTML element.
    @param {Object} viewModel The viewModel that is the current context for this binding.
    @param {Object} bindingContext The binding hierarchy for the current context.
  */
 update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
   var imageType, tmpImg, src, imageSrc, defaultErrSrc, siteNoImageSrc, errSrc, alt, title, errAlt, onerror,
     extraParameters = "", outputFormat, quality, alphaChannelColor, values = ko.utils.unwrapObservable(valueAccessor());

   //If not working with values as an object or an image element don't do anything
   if(typeof values !== 'object' || element.nodeName !== 'IMG') {
     return;
   }

   //Unwrap input values
   imageSrc = ko.utils.unwrapObservable(values.src);
   imageType = ko.utils.unwrapObservable(values.imageType);
   if (!imageType) {
     imageType = 'medium'; // default to medium images if not specified
   }

   if(imageSrc) {
     switch(imageType) {
       case 'full':
         src = ko.utils.unwrapObservable(imageSrc.primaryFullImageURL);
         break;
       case 'large':
         src = ko.utils.unwrapObservable(imageSrc.primaryLargeImageURL);
         break;
       case 'medium':
         src = ko.utils.unwrapObservable(imageSrc.primaryMediumImageURL);
         break;
       case 'small':
         src = ko.utils.unwrapObservable(imageSrc.primarySmallImageURL);
         break;
       case 'thumb':
         src = ko.utils.unwrapObservable(imageSrc.primaryThumbImageURL);
         break;
       default:
         src = ko.utils.unwrapObservable(imageSrc.primaryMediumImageURL);
         break;
     }

     // add support for image type conversion via outputFormat
     // query parameter: CCSF-7109
     outputFormat = ko.utils.unwrapObservable(values.outputFormat);
     quality = ko.utils.unwrapObservable(values.quality);
     alphaChannelColor = ko.utils.unwrapObservable(values.alphaChannelColor);

     if(outputFormat) {
       extraParameters = "&" + CCConstants.IMAGE_OUTPUT_FORMAT + "=" + outputFormat;
     }
     if(quality) {
       extraParameters = extraParameters + "&" + CCConstants.IMAGE_QUALITY + "=" + quality;
     }
     if(alphaChannelColor) {
       extraParameters = extraParameters + "&" + CCConstants.IMAGE_ALPHA_CHANNEL_COLOR + "=" + alphaChannelColor;
     }
     if(src && extraParameters) {
       src = src + extraParameters;
     }
   } else {
     src = values.errorSrc;
   }

   alt = ko.utils.unwrapObservable(imageSrc.primaryImageAltText);
   title = ko.utils.unwrapObservable(imageSrc.primaryImageTitle);

   // Error source - use the one defined in site settings first, and then fall back to the one specified
   // in the errorSrc attribute.
   defaultErrSrc = ko.utils.unwrapObservable(values.errorSrc);
   siteNoImageSrc = ko.bindingHandlers.productImageSource.getNoImageSiteSetting(bindingContext);
   errSrc = siteNoImageSrc && siteNoImageSrc.length > 0 ? siteNoImageSrc : defaultErrSrc;

   // If the product image URL matches the default error source, use errSrc instead, to allow for a site specific
   // no-image image
   if (src === defaultErrSrc || src === '/img/no-image.jpg') {
     src = errSrc;
   }

   if(!alt) {
     alt = ko.utils.unwrapObservable(values.alt);
   }
   if(!title) {
     title = ko.utils.unwrapObservable(values.title);
   }
   errAlt = ko.utils.unwrapObservable(values.errorAlt);
   onerror = ko.utils.unwrapObservable(values.onerror);

   //if we have no fallback image, then just load away
   if(!errSrc) {
     element.src = src;
     if(alt) {
       element.alt = alt;
     }
     if(title) {
       element.title = title;
     }
     return;
   }
   if(src) {
     if(alt) {
       element.alt = alt;
     }
     if(title) {
       element.title = title;
     }

     // replace the existing onerror handler with one
     // that displays the error image
     element.onerror = function() {
       var errorImage = new Image();

       // On successful load of the error image, display it in place of the product image
       errorImage.onload = function() {
         // If the image fails to load, displays the error image
         element.src = errSrc;

         //run the binding's onerror event.
         if(onerror) {
           onerror(element);
         }
         // clear out the onerror handler to prevent an infinite loop in Firefox and IE browsers
         // if the errorSrc or default site error image is not found
         element.onerror="";
       };

       // Fallback 1.
       // If the error image fails to load, for any reason, fall back to the default error image
       errorImage.onerror = function() {

         var defaultErrorImage = new Image();

         // Default error image loaded
         defaultErrorImage.onload = function() {
           element.src = defaultErrorImage.src;

           //run the binding's onerror event.
           if(onerror) {
             onerror(element);
           }
           // clear out the onerror handler to prevent an infinite loop in Firefox and IE browsers
           // if the errorSrc or default site error image is not found
           element.onerror="";
         };

         // Fallback 2.
         // If the default error image fails, for any reason, as a final fallback, show /img/no-image.jpg
         defaultErrorImage.onerror = function() {
           element.src = "/img/no-image.jpg";

           //run the binding's onerror event.
           if(onerror) {
             onerror(element);
           }
           // clear out the onerror handler to prevent an infinite loop in Firefox and IE browsers
           // if the errorSrc or default site error image is not found
           element.onerror="";
         }

         defaultErrorImage.src = defaultErrSrc;
       }

       // If the image fails to load, displays the error image
       errorImage.src = errSrc;

       if(errAlt) {
         element.alt = errAlt;
       }
     };

     // display the image source immediately (CCSF-7170)
     element.src = src;
   } else {
     //If we have no main image at all then just load the fallback image
     element.src = errSrc;
     if(errAlt) {
       element.alt = errAlt;
     } else if(alt) {
       element.alt = alt;
     }

     //run the binding's onerror event.
     if(onerror) {
       onerror(element);
     }
   }
 }
};

  /**
   * @public
   * @class The carouselSwipe binding provides swipe functionality to a bootstrap carousel.
   * @see http://getbootstrap.com/javascript/#carousel
   * @example
   * &lt;div data-bind="carouselSwipe, attr:{id: 'carousel-id-'+id()}" 
   *   class="cc-related-products-carousel-slide carousel slide" data-interval="false">
   */
  ko.bindingHandlers.carouselSwipe = {

    /**
      The logic runs once to initialize the binding for this element.
      Adds swipe functionality to the carousel.
      @private
      @param {Object} element The DOM element attached to this binding.
      @param {function(): object} valueAccessor A function that returns all of the values associated with this binding.
      @param {function(): object} allBindingsAccessor Object containing information about other bindings on the same HTML element.
    */
    init : function(element, valueAccessor, allBindingsAccessor) {

      var elem = $(element);
      var options = allBindingsAccessor().Options || {};

      elem.unbind('swipeleft');
      elem.unbind('swiperight');

      elem.carousel.interval = false;
      elem.on('swipeleft', function(event) {
        elem.carousel('next');
        elem.carousel({ interval: false });
      });

      elem.on('swiperight', function(event) {
        elem.carousel('prev');
        elem.carousel({ interval: false });
      });
    }
  };

  /**
   *  @private
   *  @class Tab trap elements in popovers to prevent losing focus.
   *  Prevents tab events from taking focus outside the given DOM element.
   */
  ko.bindingHandlers.tabTrap = {
    /**
      Constrain tab events to a certain DOM element. Prevent tab events from setting focus
      outside of the element.
      @private
      @param {Object} element The DOM element that tabbing should be constrained to.
    */
    constrain : function(element) {
      var tabbableElements;
      var totalTabbableElements = $(element).find(':tabbable');
      var totalTabbableCount = totalTabbableElements.size();

      totalTabbableElements.each(function (index) {
        var currentIndex;

        if(!$(this).hasClass('cc-tab-trapped')) {
          $(this).addClass('cc-tab-trapped');

          $(this).on('keydown', function(event) {
            tabbableElements = $(element).find(':tabbable');

            if(event.keyCode === 9) {
              if(event.shiftKey) { // tabbing backwards
                currentIndex = parseInt(tabbableElements.index($(this)), 10) - 1;
                if(currentIndex < 0) {
                  event.preventDefault();
                  tabbableElements[tabbableElements.size() - 1].focus();
                }
              } else { // tabbing forwards
                currentIndex = parseInt(tabbableElements.index($(this)), 10) + 1;
                if(currentIndex === tabbableElements.size()) {
                  event.preventDefault();
                  tabbableElements[0].focus();
                }
              }
            }
          });
        }
      });
    }
  };

  /**
   * @public
   * @class The ccForm binding is used to prevent undesired button events being
   * triggered when an element in the blacklist passes a keydown event with keycode
   * 13 (enter). This overrides the browsers default handling of that keydown event.
   * If an action should be fired on that keydown event, there is an optional
   * 'action' value that can be passed in to the binding that will fire in place
   * of whatever the browser would natively do.
   * <p>
   * <h2>Parameters:</h2>
   * <ul>
   *   <li><code>{Observable function() | String} action</code> - The action function to be called, or a jQuery selector,
   *    which will be triggered with a 'click' event.</li>
   * </ul>
   * @example
   * &lt;form name="name" id="id" data-bind="ccForm: {action: actionValue()">&lt;/form>
   */
  ko.bindingHandlers.ccForm = {
    /**
      The logic runs once to initialize the binding for this element.
      @private
      @param {Object} element The DOM element attached to this binding.
      @param {function(): object} valueAccessor A function that returns all of the values associated with this binding.
    */
    init: function(element, valueAccessor) {
      var $element = $(element), action = valueAccessor().action;
      var blacklist = ['INPUT', 'SELECT'];

      $element.on('keydown', function(e) {
        if(e.which == "13" && blacklist.indexOf(e.target.tagName) !== -1) {
          if(typeof action === 'function') {
            action();
          } else if(typeof action == 'string') {
            $(action).trigger('click');
          }
          return false;
        }
      });
    }
  };

  /**
   * @public
   * @class Simple binding wrapper to get the validation text inserted into
   * the aria announce region in the index page.
   * <p>
   * Sets the validation error text into the element specified by the id 'cc-aria-announce'. 
   * <p>
   * <h2>Parameters:</h2>
   * <ul>
   *   <li><code>{Observable String} value</code> - The validatable property.
   *   Assumes that the property has been extended with validation properties, e.g.
   *   <pre>
   *   myProperty.extend({
   *                 required: true,
   *                 minLength: 3,
   *                 pattern: {
   *                      message: 'Hey this doesnt match my pattern',
   *                      params: '^[A-Z0-9].$'
   *                 }
   *             });
   *   </pre></li>
   * </ul>
   * @example
   * &lt;div class="help-block cc-helptext cc-validation-message" data-bind='ccValidation: property'
          role="alert">&lt;/div>
   */
  ko.bindingHandlers.ccValidation = {
    /**
      The logic runs once to initialize the binding for this element.
      @private
      @param {Object} element The DOM element attached to this binding.
      @param {function(): object} valueAccessor A function that returns all of the values associated with this binding.
      @param {function(): object} allBindingsAccessor Object containing information about other bindings on the same HTML element.
    */
    init: function(element, valueAccessor, allBindingsAccessor) {},
    /**
      update is run whenever an observable in the binding's properties changes.
      @private
      @param {Object} element The DOM element attached to this binding.
      @param {function(): object} valueAccessor A function that returns all of the values associated with this binding.
      @param {function(): object} allBindingsAccessor Object containing information about other bindings on the same HTML element.
      @param {Object} viewModel The viewModel that is the current context for this binding.
      @param {Object} bindingContext The binding hierarchy for the current context.
    */
    update: function(element, valueAccessor, allBindingsAccessor) {
      ko.bindingHandlers.validationMessage.update(element, valueAccessor, allBindingsAccessor);

      // update the aria alert region with the validation text
      if (ko.isObservable(valueAccessor().error)) {
        $('#cc-aria-announce').text(valueAccessor().error());
      } else {
        $('#cc-aria-announce').text(valueAccessor().error);
      }
      
    }
  };

  /**
   * Binding to programmatically determine whether an element and it's children 
   * have focus or are being hovered over.
   * Used to determine whether any hidden children should be shown or not by toggling
   * a class.
   *
   * NOTE: This approach only works if the child elements are 'hidden' by positioning
   * and NOT visibility:hidden; or display:none; due to a lack of native support 
   * for focusin/focusout in Firefox.
   * 
   * @options
   * applyClass: The class to be applied when events fire (default: cc-showhidden)
   * applyTo: The class of the children that should have applyClass toggled
   *
   * @example
   * <li data-bind="handleFocusin: { applyClass: 'cc-showhidden', applyTo: '.cc-ishidden' }"
   **/
  ko.bindingHandlers.handleFocusin = {
    init: function(element, valueAccessor, allBindingsAccessor) {
      var options = ko.utils.unwrapObservable(valueAccessor());
      var applyClass = options.applyClass ? options.applyClass : 'cc-showhidden';
      var applyTo = options.applyTo;

      $(element).on('focusin mouseover', function(event) {
        $(element).find(applyTo).addClass(applyClass);
      }).on('focusout mouseout', function(event) {
        // to emulate browser behavior around focus, only remove the class if the
        // focused element (document.activeElement) IS NOT a descendant of element
        if(!$.contains(element, document.activeElement)) {
          $(element).find(applyTo).removeClass(applyClass);
        }
      });
    }
  };
});

