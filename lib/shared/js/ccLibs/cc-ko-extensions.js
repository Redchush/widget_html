/**
 * @fileoverview Includes knockout extensions that contain logic specific
 * to cloud commerce functionality. Any extensions that require knowledge
 * about cloud's functionality should go here. Other extensions live
 * under ko-extensions.js
 *
 * @author jonathon.walsh@oracle.com
 */

/*global $ */
/**
 * @module ccKoExtensions
 */
define(
//-------------------------------------------------------------------
// PACKAGE NAME
//-------------------------------------------------------------------
  'ccKoExtensions',

//-------------------------------------------------------------------
// DEPENDENCIES
//-------------------------------------------------------------------
  ['knockout', 'jqueryui', 'currencyHelper', 'CCi18n', 'ccDate', 'ccNumber', 'profileHelper',
    'ccLogger', 'dateTimeUtils', 'pubsub', 'ccConstants', 'ojs/ojcore', 'i18next', 'navigation'],

//-------------------------------------------------------------------
// MODULE DEFINITION
//-------------------------------------------------------------------
  function (ko, jqueryui, currencyHelper, CCi18n, CCDate, CCNumber, profileHelper, CCLogger, dateTimeUtils, PubSub, CCConstants, ojs, i18next, navigation) {

    "use strict";

    var useHashBang = CCConstants.ALLOW_HASHBANG;
    var useHistoryApi = false;
    if (window.history && window.history.pushState) {
      useHistoryApi = true;
    }
    //-----------------------------------------------------------------------------------------------------
    // PROPERTY EDITOR EXTENSION
    //-----------------------------------------------------------------------------------------------------
    (function() {
      var layoutViewMapping,modelUpdated, hasValue, isNumber, clearStatus, validate,
        togglePasswordVisibility, setPasswordVisible, clickOrKeydownToUpdatePassword,
        blurPasswordField, keyUpInPasswordField, setValuesFromObservable, addonFocusInput,
        validateOjetDate, validateOjetTime, clearValueFunction;

      var PROPERTY_EDITOR_PREFIX = 'CC-propertyEditor-';

      /**
       * Function to clear/null the value of a property editor
       * @param {Object} data Additional data for currencyMap observables
       **/
      clearValueFunction = function(data, data2) {


        if(this.type === 'currencyMap' && data) {
          this.property()[data.id](null);
          $('#' + this.property()[data.id].formId).focus();
        } else {
          this.property(null);
          $('#' + this.property.formId).focus();
        }
      };

      /**
       * Determine whether or not the current Address object is valid
       * based on the validity of its component parts. This will not
       * cause error messages to be displayed for any observable values
       * that are unchanged and have never received focus on the
       * related form field(s).
       * @private
       * @function
       * @name ko.bindingHandlers.propertyEditor#validate
       * @return {boolean} true if address is valid, otherwise false.
       */
      validate = function(data, event){
        var prop;

        // set the appropriate property to validate
        if(this.type === 'currencyMap') {
          prop = this.property()[data.id];
        } else {
          prop = this.property;
        }

        // Temporary change to get around validation on cart layout settings
        if(prop != undefined && !prop.isModified() && !prop.isValid()) {
          prop.isModified(true);
          prop.forcedModified = true;
        } else if(prop && prop.forcedModified && prop()) {
          prop.forcedModified = false;
        }
      };

      /**
       * This function takes care of showing and hiding the inline messages
       * and takes care of validation for ojet dates for required and valid dates.
       * @private
       * @function
       * @name ko.bindingHandlers.propertyEditor#validateOjetDate
       */
      validateOjetDate = function() {
        var valid = true;
        var inputText = $('#'+this.idBase +'field').val();
        if(inputText === '') {
          $('#'+this.idBase +'controlGroup .cc-required-message').css('display', 'inline-block');
        } else {
          $('#'+this.idBase +'controlGroup .cc-required-message').css('display', 'none');
        }
        valid = dateTimeUtils.validateDate(inputText);
        if(valid === false) {
          $('#'+this.idBase +'controlGroup .cc-invalid-date').css('display', 'inline-block');
        } else {
          $('#'+this.idBase +'controlGroup .cc-invalid-date').css('display', 'none');
        }
      };

      /** This function takes care of changing the time to 00:00 in case the
       * time input by user is not a valid time
       * @private
       * @function
       * @name ko.bindingHandlers.propertyEditor#validateOjetTime
       */
      validateOjetTime = function() {
        var valid = true;
        var inputText = $('#'+this.idBase +'field').val();
        valid = dateTimeUtils.validateTime(inputText);
        if(valid === false) {
          $('#'+this.idBase +'field').val('T00:00:00');
          this.property('T00:00:00');
        }
      };

      /**
       * Focus on input from input addon (or any element within a given property editor)
       * @private
       * @function
       * @name ko.bindingHandlers.propertyEditor#addonFocusInput
       * @param {string} elementId ID of property editor form field
       */
      addonFocusInput = function(elementId){
        $('#'+elementId).focus();
      };

      /**
       * Toggle visibility of a password field.
       * @private
       * @function
       * @name ko.bindingHandlers.propertyEditor#togglePasswordVisibility
       * @param {string} elementId ID of a field of type password to be toggled between obscured and clear
       * @param {Object} event Click event on hide/reveal button
       */
      togglePasswordVisibility = function(elementId, event) {
        var passwordEl = $('#' + elementId).get(0);
        var toggle = $('#' + event.target.id);
        if(passwordEl.type == 'text') {
          setPasswordVisible(passwordEl, toggle, false);
        } else {
          setPasswordVisible(passwordEl, toggle, true);
        }
      };

      /**
       * Set password visibility and toggle hide/reveal button.
       * @private
       * @function
       * @name ko.bindingHandlers.propertyEditor#setPasswordVisible
       * @param {HTMLElement} passwordEl HTML element for password field
       * @param {HTMLElement} toggle HTML element for hide/reveal button.
       * @param {boolean} visible Visibility to be applied to password field
       */
      setPasswordVisible = function(passwordEl, toggle, visible) {
        if (visible) {
          passwordEl.type = 'text';
          toggle.text(CCi18n.t('ns.common:resources.hideText'));
        } else {
          passwordEl.type = 'password';
          toggle.text(CCi18n.t('ns.common:resources.revealText'));
        }
      };

      /**
       * Change the display of input password field on a click or keydown event.
       * @private
       * @function
       * @name ko.bindingHandlers.propertyEditor#clickOrKeydownToUpdatePassword
       * @param {Object} data Object containing data passed to the event handler
       * @param {Object} event Click event from input field
       */
      clickOrKeydownToUpdatePassword = function(data, event) {
        var updateMsg = $(event.target);
        var inputPasswordField = $(event.target).prev('input');
        var acceptKeyEvent = event.which === 1 || event.which === 32 || event.which === 13;
        if (acceptKeyEvent) {
          if (updateMsg.css("display") == "block" || updateMsg.css("display") == "inline-block") {
            updateMsg.toggle(false);
            $(event.target).prev('input').attr('disabled', false);
            inputPasswordField.select();
            inputPasswordField.val('');
            inputPasswordField.focus();
          }
        } else if(event.which === 9){
          return true;
        }
      };

      /**
       * Change the display of input password field on a blur event.
       * @private
       * @function
       * @name ko.bindingHandlers.propertyEditor#blurPasswordField
       * @param {boolean} hasPassword flag indicating if the field has a password
       * @param {BlurEvent} event blur event from input field
       */
      blurPasswordField = function(hasPassword, event) {
        var inputPasswordField = $(event.target);
        var clickToUpdateButton = inputPasswordField.next('input');
        if (inputPasswordField.val().length === 0) {
          if (hasPassword) {
            inputPasswordField.attr('disabled', 'true');
            clickToUpdateButton.toggle(true);
          }
          this.validate();
        }
      };

      /**
       * Set the values of the bg 1
       * @private
       * @function
       * @name ko.bindingHandlers.propertyEditor#setValuesFromObservable
       * @param {Observable Object} pObservable Observable data source.
       * @param {Object} pViewModel
       */
      setValuesFromObservable = function(pObservable, pViewModel) {
        var rules, rule, type, ii;

        type = ko.utils.unwrapObservable(pViewModel.type);
        pViewModel.prefix = pViewModel.prefix || pObservable.prefix;
        pViewModel.unit = pViewModel.unit || pObservable.unit;

        if(!type && pViewModel.values) {
          type = 'radio';
        }

        if(pObservable.rules) {
          rules = pObservable.rules();
          for(ii = 0; ii < rules.length; ii += 1) {
            rule = rules[ii];

            if(rule.rule === 'required' && rule.params &&
              (!rule.condition || rule.condition()) &&
              pViewModel.required !== false) {
              pViewModel.required = true;
            }

            if(!type) {
              switch(rule.rule) {
                case 'number':
                  type = 'number';
                  break;
                case 'date':
                  type = 'date-ojet';
                  break;
                case 'bool':
                  type = 'checkbox';
                  break;
              }
            }
          }
        }

        if(!ko.utils.unwrapObservable(pViewModel.type)) {
          pViewModel.type = type || 'shortText';
        }

        if(!pViewModel.label) {
          pViewModel.label = pObservable.label;
        }
      };

      /**
       * The propertyEditor binding provides a way to easily display a
       * form input field for any arbitrary property based on a provided
       * type, label, and editor. The 'property' attribute of the binding will
       * be the observable that is updated by the generated form field.
       * @public
       * @class ko.bindingHandlers.propertyEditor
       */
      ko.bindingHandlers.propertyEditor = {
        /**
         * The logic run once to initialize the binding for this element.
         * Indicates that this binding controls descendant bindings.
         * @private
         * @function
         * @param {HTMLElement} element The DOM element attached to this binding
         * @param {function(): object} valueAccessor A function that returns
         * all of the values associated with this binding.
         */
        init: function(element, valueAccessor) {
          var values = ko.utils.unwrapObservable(valueAccessor());
          return {'controlsDescendantBindings' : true};
        },

        /**
         * Update is run whenever an observable in the binding's
         * properties changes. Attempts to load the desired image from
         * the provided source. If the image fails to load the fallback
         * image & text is instead used.
         * @private
         * @function
         * @param {object} element The DOM element attached to this binding.
         * @param {function(): object} valueAccessor A function that returns
         * all of the values associated with this binding.
         * @param {function(): object} allBindingsAccessor Object containing
         * information about other bindings on the same HTML element.
         * @param {object} viewModel The viewModel that is the current
         * context for this binding.
         * @param {object} bindingContext The binding hierarchy for
         * the current context.
         */
        update: function(pElement, pValueAccessor, pAllBindingsAccessor, pViewModel, pBindingContext) {
          var values = ko.utils.unwrapObservable(pValueAccessor()), date, minDate, numericJetValidation= ko.observable(true),
            editorViewModel, templateValues, key, property, clearValue,
            id, formElement, type, numericValidationErrorMessage = CCi18n.t('ns.common:resources.numberValidation');
          //Values must have a property that's an observable
          //and a type as a minimum requirement

          if(!values.property || !ko.isObservable(values.property)) {
            return;
          }

          property = values.property;
          // make the property validatable to work better with the property editor
          // validate() function and unsaved changes functionality
          property.extend({validatable: true});

          id = ko.utils.unwrapObservable(values.id);
          type = ko.utils.unwrapObservable(values.type);
          date = new Date();
          minDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
          clearValue = values.clearValue ? false : true;

          // ensure that the property being used in a property editor is validatable
          // regardless of whether validation is required or not.
          // necessary for 2 reasons:
          // 1] will avoid a breaking error in ccValidation binding where valueAccessor().error()
          // is not a function
          // 2] allows form handler to check isModified state on all properties
          // for unsaved changes dialog to work properly
          property.extend({ validatable: true });

          //Create a viewModel to be rendered by the propertyEditor template.
          //Copy all passed attributes to the editorViewModel.
          editorViewModel = {
            writable: ko.observable(true), //Default writable status
            visible: ko.observable(true), //Default visibility status
            currentDate: date, //Default current date
            minDate: minDate,
            valueUpdate: 'change', //Default valueUpdate
            numericValidationErrorMessage: numericValidationErrorMessage,
          };

          for(key in values) {
            if(values.hasOwnProperty(key)) {
              if(key === 'writable' && !ko.isObservable(values[key])){
                editorViewModel.writable(values[key]);
              }
              else {
                editorViewModel[key] = values[key];
              }
            }
          }
          // Catches validation errors for jet's input number
          var customJetOptionChangeListener = function(event, data) {
            var prop = null;
            var context = ko.contextFor(this);
            var currencyMap;
            if (context.$parent) {
              currencyMap = context.$parent.type === 'currencyMap' ? true : false;
            } else {
              currencyMap = context.$parents[1].type === 'currencyMap' ? true : false;
            }

            if(currencyMap) {
              prop = context.$parent.property()[ko.dataFor(this).id];
            } else {
              prop = ko.dataFor(this);
            }

            prop.numericJetValidation(true);

            if (data['option'] === "messagesShown") {
              var valid = $(event.target).ojInputText("isValid");
              if (!valid) {
                prop.numericJetValidation(false);
              } else {
                prop.numericJetValidation(true);
              }
            } else {
              prop.numericJetValidation(true);
            }
          };

          // Convert the numbers to appropriate fractions so the number displayed and what gets stored matches.
          var computedValueWithFractions = ko.pureComputed({
            read : function() {
              return property();
            },
            write : function(value) {
              var fractionToFixed = editorViewModel.fractionalDigits, isADigit = false;
              if(ko.utils.unwrapObservable(editorViewModel.type) === "digit") {
                isADigit = true;
              }
              if (value != undefined) {
                if(!fractionToFixed) {
                  var decimals = value.toString().split(".");
                  if(decimals && decimals.length == 2){
                    if (isADigit) {
                      property(value.toFixed(0));
                      return;
                    }
                    if(decimals[1].length > 3) {
                      property(value.toFixed(3));
                    } else {
                      property(value);
                    }
                  } else {
                    property(value);
                  }
                } else {
                  property(value.toFixed(fractionToFixed));
                }
              } else {
                property(value);
              }
            }
          });

          setValuesFromObservable(property, editorViewModel);

          if (values.writable === false) {
            editorViewModel.writable(false);
          }

          // Help text (if any) is displayed when there isn't a status message
          editorViewModel.helpText = ko.observable(ko.utils.unwrapObservable(values.helpText));

          // Returns true if the field (like product name) is required, but
          // user has modified it and left it blank. Otherwise returns false.
          editorViewModel.isRequiredButMissing = ko.computed(function() {
            return (editorViewModel.required && ko.isObservable(editorViewModel.property.isModified) && editorViewModel.property.isModified() && editorViewModel.property()==null);
          }, editorViewModel);

          editorViewModel.titleText = ko.computed(function() {
            var newTitleText = '';

            if (editorViewModel.property.hasOwnProperty('isValid')) {
              if (editorViewModel.property.isValid()) {
                newTitleText = editorViewModel.helpText();
              }
              else {
                newTitleText = editorViewModel.property.error;
              }
            }
            else {
              newTitleText = editorViewModel.helpText();
            }

            return newTitleText;
          }, editorViewModel);

          //Setup template values which mimic the binding of a template.
          templateValues = {};
          var typeEditor = ko.utils.unwrapObservable(editorViewModel.type);
          // Passing appropriate fractionaldigits arguments For prices and digit type of entries for the jet inut number converter
          //For rest of the decimal numbers, jet uses default maxFractionalDigits = 3 and minFractionalDigits = 0
          if (typeEditor === "currency" || typeEditor === "currencyMap" || typeEditor === "digit") {
            if (typeEditor == "currency" || typeEditor === "currency") {
              editorViewModel.fractionalDigits = currencyHelper.currencyObject().fractionalDigits;
            } else {
              editorViewModel.fractionalDigits = 0;
              editorViewModel.numericValidationErrorMessage = CCi18n.t('ns.common:resources.digitValidation');
            }

            if(typeEditor !== 'currencyMap') {
              typeEditor = "number";
            }

          }
          templateValues.name = PROPERTY_EDITOR_PREFIX + typeEditor;

          /*
           * The following editorViewModel properties are not observable
           * because they are only expected to change when the parent
           * binding changes (which will re-render the template anyways).
           */

          // Try to get the id of the nearest form.
          var nearestUsefulId = $(pElement).closest('form').attr('id');

          // If this didn't work out, try for id of nearest div.
          if (!nearestUsefulId) {
            nearestUsefulId = $(pElement).parent().attr('id');
          }

          // Set up a base ID to prefix all elements displayed in the propertyEditor template using the base ID we got.
          editorViewModel.idBase = nearestUsefulId + '-' + templateValues.name + '-' + (id ? id + '-' : '');

          if(typeEditor === 'currencyMap') {
            for(key in property()) {
              if(property().hasOwnProperty(key)) {
                property()[key].formId = editorViewModel.idBase + key + '-field';
              }
            }
          } else {
            property.formId = editorViewModel.idBase + 'field';
          }

          //Add the view model to the templateValues.
          templateValues.data = editorViewModel;

          // templateValues['if'] = ko.utils.unwrapObservable(values['if']);
          templateValues['if'] = ko.utils.unwrapObservable(values['if']) ||
            typeof ko.utils.unwrapObservable(values['if']) === 'undefined';

          //The property is required if either the property itself or the binding claims so.
          editorViewModel.required = ko.utils.unwrapObservable(editorViewModel.required || property.required);

          // if this is a currencyMap we need to apply to the child observables
          if(editorViewModel.type === 'currencyMap') {
            $.each(editorViewModel.property(), function(ii) {
              editorViewModel.property()[ii].validate = validate;
              editorViewModel.property()[ii].numericJetValidation = ko.observable(true);
              editorViewModel.property()[ii].addonFocusInput = addonFocusInput;
            });
          } else {
            editorViewModel.validate = validate;
            editorViewModel.numericJetValidation = numericJetValidation;
            editorViewModel.addonFocusInput = addonFocusInput;
          }

          editorViewModel.clearValueFunction = clearValueFunction;

          if (editorViewModel.type === "revealablePassword") {
            editorViewModel.togglePasswordVisibility = togglePasswordVisibility;
            editorViewModel.clickOrKeydownToUpdatePassword = clickOrKeydownToUpdatePassword;
            editorViewModel.blurPasswordField = blurPasswordField;
            editorViewModel.keyUpInPasswordField = keyUpInPasswordField;
          } else if(editorViewModel.type === "number" || editorViewModel.type === "currency" || editorViewModel.type === "digit" || ko.isObservable(editorViewModel.type) && editorViewModel.type() === "number") {
            editorViewModel.customJetOptionChangeListener = customJetOptionChangeListener;
            editorViewModel.computedValueWithFractions = computedValueWithFractions;
          } else if(editorViewModel.type === "currencyMap") {
            $.each(editorViewModel.property(), function(ii) {
              editorViewModel.property()[ii].customJetOptionChangeListener = customJetOptionChangeListener;
              editorViewModel.property()[ii].computedValueWithFractions = computedValueWithFractions;
            });
          }

          if((editorViewModel.type === "date-ojet") || (editorViewModel.type === "time-ojet") || (editorViewModel.type === "date-time-ojet")) {
            editorViewModel.validateOjetDate = validateOjetDate;
            editorViewModel.validateOjetTime = validateOjetTime;
            editorViewModel.dateTitleText = CCi18n.t('ns.common:resources.datePicker');
            editorViewModel.timeTitleText = CCi18n.t('ns.common:resources.timePicker');
          } else if (ko.isObservable(editorViewModel.type) && ((editorViewModel.type() === "date-ojet") || (editorViewModel.type() === "time-ojet") || (editorViewModel.type === "date-time-ojet"))) {
            editorViewModel.validateOjetDate = validateOjetDate;
            editorViewModel.validateOjetTime = validateOjetTime;
            editorViewModel.dateTitleText = CCi18n.t('ns.common:resources.datePicker');
            editorViewModel.timeTitleText = CCi18n.t('ns.common:resources.timePicker');
          }
          //Render the template
          ko.bindingHandlers.template.update(pElement,
            function() { return templateValues;},
            pAllBindingsAccessor, editorViewModel, pBindingContext);
        }
      };
    })();

    /** @namespace ko.bindingHandlers */

    /**
     * The inTabFlow binding takes a boolean value as a parameter and sets
     * the tabindex attribute, of all descendant input elements or a specific link element, appropriately.
     *
     * NB: The jQuery ':input' selector is used here to selects all input,
     * textarea, select and button elements.
     * This is helpful to add/remove inputs from the tab flow when they can be
     * hidden, for example, by the Bootstrap collapse functionality.
     *
     * @public
     * @class
     * @example &lt;div data-bind="inTabFlow: booleanValue" ... &gt;
     */
    ko.bindingHandlers.inTabFlow = {
      /**
       * update is run whenever an observable in the binding's properties
       * changes.
       * @private
       * @function
       * @param {object} element The DOM element attached to this binding
       * @param {function(): object} valueAccessor A function that returns all of the values associated with this binding
       */
      update: function(element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());

        // If item itself is a link, enable or disable tabbing depending on value.
        if ($(element).prop('tagName') == 'A') {
          $(element).attr('tabindex', value ? 0 : -1);
        } else {
          // Item is not a link - set tab index on child input elements
          $(element).find(":input").attr('tabindex', value ? 0 : -1);
        }
      }
    };

    /**
     *  The validatableValue binding wraps the standard value binding.
     *  It allows an observable to be marked as updated (or modified) when the element,
     *  which it provides the value for, loses focus.
     *  This is helpful for required form fields, where empty fields should be marked
     *  as an error as soon as they lose focus and not just when the value has been
     *  modified to be empty.
     *  we can ignore the default blur by passing the ignoreBlur as true.
     *  which will not show the error messages even if we focus out. for example in case of
     *  cancel scenarios, we can pass this true then it will not show the message before cancel.
     *
     *  @public
     *  @class ko.bindingHandlers.validatableValue
     *  @example &lt;input data-bind="validatableValue: inputValue" ...&gt;
     */
    ko.bindingHandlers.validatableValue = {
      /**
       * The logic run once to initialize the binding for this element.
       * Adds an event handler for onBlur
       * @private
       * @function
       * @param {object} element The DOM element attached to this binding
       * @param {function(): object} valueAccessor A function that returns all of the values associated with this binding
       * @param {function(): object} allBindingsAccessor Object containing information about other bindings on the same HTML element
       * @param {object} viewModel The viewModel that is the current context for this binding.
       * @param {object} bindingContext The binding hierarchy for the current context
       */
      init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var valueObservable = valueAccessor();
        var ignoreBlur = bindingContext.$parent.ignoreBlur;
        $(element).blur(function() {
          if(ignoreBlur && ignoreBlur()) {
            return true;
          }
          // Value must be set as modified for validation message to be shown
          if(valueObservable.isModified && ko.isObservable(valueObservable.isModified)) {
            valueObservable.isModified(true);
          }
        });

        if(valueObservable.rules && ko.isObservable(valueObservable.rules)) {
          // set the required attribute if the observable is required
          var rulesLength = valueObservable.rules().length;

          for(var i=0; i<rulesLength; ++i){
            if(valueObservable.rules()[i].rule === "required"){
              if(valueObservable.rules()[i].params === true){
                $(element).attr("required", "required");
              }
              break;
            }
          }
        }

        ko.bindingHandlers.value.init(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);
      },

      /**
       * Update is invoked whenever an observable in the binding's properties
       * changes.
       * @private
       * @function
       * @param {object} element The DOM element attached to this binding
       * @param {function(): object} valueAccessor A function that returns all of the values associated with this binding
       * @param {function(): object} allBindingsAccessor Object containing information about other bindings on the same HTML element
       * @param {object} viewModel The viewModel that is the current context for this binding.
       * @param {object} bindingContext The binding hierarchy for the current context
       */
      update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        ko.bindingHandlers.value.update(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);
      }
    };


    /**
     * The validatableTarget binding is a variation on validatableValue.
     * It allows an observable to be marked as updated (or modified) when an element
     * loses focus, but where the observable in question does not provide the value.
     * This is helpful for select fields, where different observables may hold the
     * currently selected value (e.g. 'us') and the actual value (e.g. 'United States')
     * to be used for validation purposes.
     *
     * @public
     * @class ko.bindingHandlers.validatableTarget
     * @example &lt;select data-bind="value: optionObservable, validatableTarget: targetObservable" ...&gt;
     */
    ko.bindingHandlers.validatableTarget = {
      /**
       * The logic run once to initialize the binding for this element.
       * Adds an event handler for onBlur.
       * @private
       * @function
       * @param {object} element The DOM element attached to this binding
       * @param {function(): object} valueAccessor A function that returns all of the values associated with this binding
       * @param {function(): object} allBindingsAccessor Object containing information about other bindings on the same HTML element
       * @param {object} viewModel The viewModel that is the current context for this binding.
       * @param {object} bindingContext The binding hierarchy for the current context
       */
      init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var targetObservable = valueAccessor();

        $(element).blur(function() {
          // Value must be set as modified for validation message to be shown
          if(targetObservable.isModified && ko.isObservable(targetObservable.isModified)) {
            targetObservable.isModified(true);
          }
        });
      }
    };

    /**
     * ccLink is a binding that allows us to use keywords to derive the href for links. Keyword mappings are
     * stored on the widget view model. When we resolve a ccLink, we start on the current widget context,
     * and walk up through the widget parents until we find a link that matches the keyword.
     *
     * @public
     * @class ko.bindingHandlers.ccLink
     * @example &lt;a data-bind="ccLink: 'cart'"&gt;
     */
    ko.bindingHandlers.ccLink = {
      /**
       * The logic run once to initialize the binding for this element.
       * @private
       * @function
       * @param {HTMLElement} element The DOM element attached to this binding
       * @param {function(): object} valueAccessor A function that returns all of the values associated with this binding
       * @param {function(): object} allBindingsAccessor Object containing information about other bindings on the same HTML element
       * @param {object} viewModel The viewModel that is the current context for this binding.
       * @param {object} bindingContext The binding hierarchy for the current context
       */
      init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        // If we are using the histor api, then we'll use pushState to update the browser url/history
        // Additionally we'll add a click handler to "preventDefault" on the tag so we don't go
        // back to the server again
        element.addEventListener("click", function(e) {
          var data = {usingCCLink:true};
          // Trigger unsaved changes event if needs be
          $(element).trigger('click.cc.unsaved', data);

          if (!data.preventDefault) {
            var url = element.pathname + element.search;
            // If we are already on the url, don't push that url again
            if(window.location.pathname !== url)
              navigation.goTo(url);
          }
          else {
            e.stopImmediatePropagation();
          }

          e.preventDefault();
          return false;
        }, false);

        // This will be called when the binding is first applied to an element
        // Set up any initial state, event handlers, etc. here
        var valueObject = ko.utils.unwrapObservable(valueAccessor());
        var parents;
        var link = valueObject; // link gets set to the object we are linking to
        if (!valueObject) {
          return;
        }
        // Page is a special case in that we need to look up
        // the link data
        // Guess what is going on based off the type passed into 'value'
        // for example assume 'string' is page and for 'object'
        // we read values for displayName and url directly
        if (typeof valueObject === 'string') {
          // Walk bindingContext's $parents array to find WidgetViewModel
          var widget = null;
          var value = valueObject;

          if (viewModel.links) {
            widget = viewModel;
          } else {
            parents = bindingContext.$parents;
            // Walk the parents array, it's in there somewhere.
            for (var i = 0; i < parents.length; i++) {
              if (parents[i].links) {
                widget = parents[i];
                break;
              }
            }
          }
          if (widget) {
            // if it's a page look it up here
            link = widget.links()[value];
            // otherwise read the value from the thing we are linking from
          }
        }
        if (link) {
          var target = "";

          if(link.url) {
            target = link.url;
          }
          // categories, products, pages have routes instead of urls
          else if(link.route) {
            target = link.route;
          }
          var finalTarget = target;
          if (useHashBang) {
            finalTarget = '#!' + target;
          }

          var prefix = "";

          if (window.urlLocale) {
            var browserLanguage = JSON.parse(window.urlLocale)[0].name;

            prefix = "/" + browserLanguage;
          }

          $(element).prop('href',  prefix + target);

          // If element has no child elements and no text, we'll assume tag should have some text in it if available
          if($(element).children().size() === 0 && $.trim($(element).text()) == '') {
            if(link.displayName) {
              $(element).text(link.displayName);
            }
            else {
              $(element).text(window.location.href + finalTarget);
            }
          }
        }
      }
    };

    ko.bindingHandlers.ccNavigation = {

      /**
       * Update is invoked whenever an observable in the binding's properties
       * changes.
       * @private
       * @function
       * @param {object} element The DOM element attached to this binding
       * @param {function(): object} valueAccessor A function that returns all of the values associated with this binding
       * @param {function(): object} allBindingsAccessor Object containing information about other bindings on the same HTML element
       * @param {object} viewModel The viewModel that is the current context for this binding.
       * @param {object} bindingContext The binding hierarchy for the current context
       */
      update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var value = ko.utils.unwrapObservable(valueAccessor());

        $(element).on('click.cc.nav', function(e) {
          var url = element.pathname + element.search;

          var data = {usingCCLink:true};
          // Trigger unsaved changes event if needs be
          $(element).trigger('click.cc.unsaved', data);

          if (value != 'prevent' && !data.preventDefault) {
            navigation.goTo(url);
          }

          e.preventDefault();
          e.stopImmediatePropagation();
          return false;
        });
      }
    };

    /**
     * The triggerMessage binding wraps the standard text & visibility
     * bindings. It should be used in conjunction with the trigger extender
     * to display the message when triggered.
     *
     * @public
     * @class ko.bindingHandlers.triggerMessage
     * @example &lt;span data-bind="triggerMessage: observable" ...&gt;
     */
    ko.bindingHandlers.triggerMessage = {
      /**
       * update is run whenever an observable in the binding's properties
       * changes.
       * @private
       * @function
       * @param {object} element The DOM element attached to this binding
       * @param {function(): object} valueAccessor A function that returns all of the values associated with this binding
       */
      update: function(element, valueAccessor) {

        var observable = valueAccessor();

        if(observable.triggerFired && ko.isObservable(observable.triggerFired)) {

          // create a handler to correctly return the message
          var msgAccessor = function () {
            if (observable.triggerFired()) {
              return observable.triggerMessage;
            } else {
              return null;
            }
          };

          // toggle visibility on message when triggered
          var visiblityAccessor = function () {
            if(observable.triggerFired()) {
              return true;
            } else {
              return false;
            }

          };

          ko.bindingHandlers.text.update(element, msgAccessor);
          ko.bindingHandlers.visible.update(element, visiblityAccessor);
        }
      }
    };

    /**
     * The widgetLocaleText binding allows translated strings to be specified for an element which are
     * looked up by resource key. The bindingValue can be given either as a string or an object. If it's a
     * string then the translated string will simply be placed in the 'text' slot of the element. If it's an
     * object then the expected structure is:
     *
     * <pre>
     * {
   *   value: &lt;resourceName&gt;,
   *   attr: &lt;name of slot to place resource&gt;,
   *   params: &lt;Parameterized variable replacement dictionary&gt;,
   *   custom: &lt;Custom settings for translation&gt;
   * }
     * </pre>
     *
     * If attr is undefined, the translated string will be placed in the default 'text' slot.
     *
     * @public
     * @class ko.bindingHandlers.widgetLocaleText
     * @example &lt;span data-bind="widgetLocaleText: 'resourceName'"&gt;&lt;/span&gt;
     * @example &lt;span data-bind="widgetLocaleText: {value:'resourceName', attr:'title'}"&gt;&lt;/span&gt;
     */
    ko.bindingHandlers.widgetLocaleText = {
      /**
       * update is run whenever an observable in the binding's properties
       * changes.
       * @private
       * @function
       * @param {object} element The DOM element attached to this binding
       * @param {function(): object} valueAccessor A function that returns all of the values associated with this binding
       */
      update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var bindingValue = valueAccessor();
        var resources, token, translatedString;

        var widgetModel;

        // If the view model is the WidgetViewModel, can just access the resources
        if(viewModel.translate){
          widgetModel = viewModel;
        } else {
          // Otherwise the WidgetViewModel will be in the array of parents somewhere
          var parents = bindingContext.$parents;
          for(var i=0;i<parents.length;i++){
            if(parents[i].translate) {
              widgetModel = parents[i];
              break;
            }
          }
        }

        if(typeof bindingValue == 'string') {
          translatedString = widgetModel.translate(bindingValue,null,true);
        }
        else if(typeof bindingValue == 'object' && bindingValue.value != undefined) {
          translatedString = widgetModel.translate(bindingValue.value,
            bindingValue.params,
            true,
            bindingValue.custom);
        }

        if(translatedString) {
          if((typeof bindingValue == 'string') || (typeof bindingValue == 'object' && bindingValue.attr == 'innerText')) {
            $(element).text(translatedString);
          }
          else if(typeof bindingValue == 'object' && bindingValue.attr != undefined) {
            $(element).attr( bindingValue.attr, translatedString );
          }
        }
      }
    };


    /**
     * @public
     * @class The disabled binding conditionally adds the disabled class to an element based on a condition.
     * Optionally a click event handler can be specified to apply to the element if it's enabled. For <a> tags,
     * when the condition resovles to false, a click handler specifiying "return false;" will be added to prevent
     * any navigation from that anchor tag
     *
     * @example
     * &lt;a data-bind="disabled: 'boolean condition'" ...&gt;
     * &lt;a data-bind="disabled: {condition:'boolean condition',click: eventHandler}" ...&gt;
     */
    ko.bindingHandlers.disabled = {
      'update': function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var value = false;
        var clickEvent, link;
        var bindingValue = valueAccessor();

        if(typeof bindingValue == 'boolean') {
          value = ko.utils.unwrapObservable(bindingValue);
        }
        else if(typeof bindingValue == 'object' && bindingValue.condition != undefined) {
          value = ko.utils.unwrapObservable(bindingValue.condition);

          if(bindingValue.click != undefined) {
            clickEvent = ko.utils.unwrapObservable(bindingValue.click);
          }

          if(bindingValue.link != undefined) {
            link = function() {
              return ko.utils.unwrapObservable(bindingValue.link);
            };
          }
        }

        if (value) {
          $(element).off('click.handler');

          var tag = $(element).prop('tagName');

          if('A' == tag) {
            $(element).attr('href','#');
          }

          $(element).on('click.handler', function(e){
            e.stopImmediatePropagation();
            return false;
          });

          $(element).addClass('disabled');
        }
        else {
          $(element).removeClass('disabled');
          $(element).off('click.handler');

          if(clickEvent) {

            $(element).on('click.handler', function() {
              var clickHandler = clickEvent.bind(viewModel);
              clickHandler();
              return false;
            });
          }

          if(link) {
            ko.bindingHandlers['ccLink'].init(element, link, allBindingsAccessor, viewModel, bindingContext);
          }
        }
      }
    };

    /**
     * @public
     * @class The ccDate binding uses cc-date-format.js library to format and localize the date.
     * The input can be given in any of the standard formats and a return type can be
     * specified. WidgetViewModel has implementation of the formatting.
     * @author arnav.maiti@oracle.com
     *
     * @example
     * <div data-bind="ccDate: {date: '12-03-2013', format: 'DD-MM-YYYY', returnedType: 'f+l', separator: 'at'}"></div>
     * <div data-bind="ccDate: {date: '12-03-2013', format: 'DD-MM-YYYY', returnedType: 'f'}"></div>
     * <div data-bind="ccDate: {date: '12-03-2013', format: 'DD-MM-YYYY', returnedType: '+l'}"></div>
     * <div data-bind="ccDate: {date: '12-03-2013', returnedType: 'l+s'}"></div>
     * <div data-bind="ccDate: {date: '12-03-2013'"}></div>
     */
    ko.bindingHandlers.ccDate = {
      update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var bindingValue = valueAccessor();
        var value = ko.utils.unwrapObservable(bindingValue);
        var uDate = ko.utils.unwrapObservable(value.date);
        var format = ko.utils.unwrapObservable(value.format);
        var returnedType = ko.utils.unwrapObservable(value.returnedType);
        var returnedDate = ko.utils.unwrapObservable(value.returnedDate);

        returnedDate = CCDate.formatDateAndTime(uDate, format, returnedType, returnedDate);
        $(element).text(returnedDate);
      }
    };

    /**
     * @public
     * @class The ccResizeImage binding provides scaled images to be displayed based on the current viewport
     * <p>
     * It also provides the ability to specify an alternate image and image text
     * to be loaded in the event that the desired image cannot be found.
     * <p>
     * One may specify an image URL as the source. The binding simply returns image based on the current viewport size.
     * This binding also provides an option to the user to override the default dimensions for a specific viewport.
     * For e.g. user can specify override dimension for mobile viewport as xsmall: '50,50' as an option directly in the binding.
     * Binding then fetches image of size 50x50 dimensions only for mobile viewport and will continue to fetch responsive image for other viewports
     * based upon viewport dimension.
     * This binding gives an additional option to give 'size' option. This works only in case if override dimensions are not found for a particular viewport.
     * User can simply provide default size for the viewports for which override dimension is not provided. For e.g. size:'x,y' or size:'medium'.
     * If 'size' option is provided in the binding it will always override the viewport's default dimensions (only when the override dimension
     * is not provided in the binding for the current viewport).
     * This binding will attempt to find an image at the specified source URL, if one cannot be found it will fall back to the errorSrc image.
     *
     * <h2>Parameters:</h2>
     * <ul>
     *   <li><code>{Observable String} [source]</code> - The image source URL</li>
     *   <li><code>{Observable String} [large]</code> - The override dimensions for large viewport</li>
     *   <li><code>{Observable String} [medium]</code> - The override dimensions for medium viewport</li>
     *   <li><code>{Observable String} [small]</code> - The override dimensions for small viewport</li>
     *   <li><code>{Observable String} [xsmall]</code> - The override dimensions for x-small viewport</li>
     *   <li><code>{Object} [size]</code> - The default dimension if the override dimension is not found for the current viewport.</li>
     *   <li><code>{Observable String} [errorSrc]</code> - The error image URL.</li>
     *   <li><code>{Observable String} [alt]</code> - The image 'alt' text.</li>
     *   <li><code>{Observable String} [errorAlt]</code> - The error image 'alt' text.</li>
     *   <li><code>{Observable function(Object)} [onerror]</code> - The error callback function. Called with the current element.</li>
     * </ul>
     * @example
     * &lt;img data-bind="ccResizeImage: {source: '/file/v2/products/ST_AntiqueWoodChair_full.jpg', alt:'The desired image', errorSrc:'images/noImage.png', errorAlt:'No Image Found'}">&lt;/img>
     * This returns image with the current viewports default dimensions.
     * &lt;img data-bind="ccResizeImage: {source: '/file/v2/products/ST_AntiqueWoodChair_full.jpg', xsmall: '80,80', alt:'The desired image', errorSrc:'images/noImage.png', errorAlt:'No Image Found'}">&lt;/img>
     * This returns image with the current viewports default dimensions. But for x-small viewport, it returns image of size 80x80.
     * &lt;img data-bind="ccResizeImage: {source: '/file/v2/products/ST_AntiqueWoodChair_full.jpg', xsmall: '80,80', medium: '120,120', size:'50,50', alt:'The desired image', errorSrc:'images/noImage.png', errorAlt:'No Image Found'}">&lt;/img>
     * This returns image of size 80x80 and 120x120 respectively for x-small and medium viewports. For other viewports it returns image of size 50x50.
     */
    ko.bindingHandlers.ccResizeImage = {

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

          var tmpImg, src, source, imageSrc, defaultErrSrc, siteNoImageSrc, errSrc, alt, title, errAlt, onerror, imageHeight, imageWidth, 
              extraParameters = "", values = ko.utils.unwrapObservable(valueAccessor());
          
          var defaultImgSizeForViewPorts = CCConstants.DEFAULT_IMG_SIZE_FOR_VIEWPORT;
          
          var validSizes = ["xsmall","small","medium","large"];
          
          //---- Start Of Utility Methods used here -----
          var isValidDimension = function (data) {
              if (data) {
                var splittedData = data.split(',');
                if (splittedData.length != 2) {
                  return false;
                } else if (isNaN(splittedData[0]) || isNaN(splittedData[1])) {
                  return false;
                } else {
                  return true;
                }
              } else {
                return false;
              }
          };
          
          // Closure to check if Srcset and Sizes are supported 
          var isSrcSetandSizesSupported = function(){
          	var img = document.createElement('img');
          	var isSrcSetSupported = ('srcset' in img);
          	var isSizesSupported = ('sizes' in img);
          	var isSrcSetEnabled = values.isSrcSetEnabled &&  ko.utils.unwrapObservable(values.isSrcSetEnabled);
          	
          	return isSrcSetSupported && isSizesSupported && isSrcSetEnabled ;
          }; 
          
       // Closure to get the Extra Params  
         var getExtraParams = function(){
      	   
      	   var xtraParams = "";
      	    // add support for image type conversion via outputFormat
             // query parameter: CCSF-7109
             var outputFormat = ko.utils.unwrapObservable(values.outputFormat);
             var quality = ko.utils.unwrapObservable(values.quality);
             var alphaChannelColor = ko.utils.unwrapObservable(values.alphaChannelColor);

             if(outputFormat) {
          	   xtraParams = "&" + CCConstants.IMAGE_OUTPUT_FORMAT + "=" + outputFormat;
             }
             if(quality) {
          	   xtraParams = xtraParams + "&" + CCConstants.IMAGE_QUALITY + "=" + quality;
             }
             if(alphaChannelColor) {
          	   xtraParams = xtraParams + "&" + CCConstants.IMAGE_ALPHA_CHANNEL_COLOR + "=" + alphaChannelColor;
             }
             
             return xtraParams;
         } ;
          
         // Closure to get the Url for a given size dimensions
          var getUrlForSize = function(size, imgDimensions , source){
          	var src = "";
          	
          	if (values[size+"_img"]){
          	   src = ko.utils.unwrapObservable(values[size+"_img"]);
          	}else if(source) {
          	   src = replaceHeightAndWidthInUrl(source, imgDimensions["imageHeight"], imgDimensions["imageWidth"]);
          	}
          	
          	var xtraParams = getExtraParams();
          	if (xtraParams){
          		if ( src.startsWith(CCConstants.ENDPOINT_IMAGES + "?source=")){
          			src = src+xtraParams;
          		} else{
          			src = CCConstants.ENDPOINT_IMAGES + "?source="+src+xtraParams;
          		}
          	}
          	
          	var imgWidth = defaultImgSizeForViewPorts[size]["width"];
          	
          	
          	if(src && imgDimensions.imageWidth){
          	 src = src+" "+imgDimensions.imageWidth+"w";
          	 return src;
          	}
          };
          
          // Clousure to get the image Dimensions for a given ViewPort. Defaults to Widow Width if the ViewPort is not provided.
          var getImageDimensions = function(viewPort){
          	
          	var imgDimensions = {};	
          	var currentSize;
          	
      		// Get the current viewport default dimensions
              var currentWidth =  viewPort ? viewPort : ($(window)[0].innerWidth || $(window).width());
              if (currentWidth == 'large' || currentWidth >= CCConstants.VIEWPORT_LARGE_DESKTOP_LOWER_WIDTH) {
              	imgDimensions.imageHeight = defaultImgSizeForViewPorts.large.height;
              	imgDimensions.imageWidth = defaultImgSizeForViewPorts.large.width;
              	imgDimensions.minWidth = defaultImgSizeForViewPorts.large.minWidth;
              	currentSize = 'large';
              } else if (currentWidth == 'medium' || (currentWidth > CCConstants.VIEWPORT_TABLET_UPPER_WIDTH  && currentWidth < CCConstants.VIEWPORT_LARGE_DESKTOP_LOWER_WIDTH)) {
              	imgDimensions.imageHeight = defaultImgSizeForViewPorts.medium.height;
              	imgDimensions.imageWidth = defaultImgSizeForViewPorts.medium.width;
              	imgDimensions.minWidth = defaultImgSizeForViewPorts.medium.minWidth;
              	imgDimensions.maxWidth = defaultImgSizeForViewPorts.medium.maxWidth;
              	currentSize = 'medium';
              } else if (currentWidth == 'small' || (currentWidth >= CCConstants.VIEWPORT_TABLET_LOWER_WIDTH && currentWidth <= CCConstants.VIEWPORT_TABLET_UPPER_WIDTH)) {
              	imgDimensions.imageHeight = defaultImgSizeForViewPorts.small.height;
              	imgDimensions.imageWidth = defaultImgSizeForViewPorts.small.width;
              	imgDimensions.minWidth = defaultImgSizeForViewPorts.small.minWidth;
              	imgDimensions.maxWidth = defaultImgSizeForViewPorts.small.maxWidth ;
              	currentSize = 'small';
              } else {
              	imgDimensions.imageHeight = defaultImgSizeForViewPorts.xsmall.height;
              	imgDimensions.imageWidth = defaultImgSizeForViewPorts.xsmall.width;
              	imgDimensions.maxWidth = defaultImgSizeForViewPorts.xsmall.maxWidth;
              	currentSize = 'xsmall';
              }
              // If override dimensions provided in the binding then use it to override default dimensions.
              var useOverrideDimensions = false;
              switch (currentSize) {
                case 'large':
                  if (isValidDimension(ko.utils.unwrapObservable(values.large))) {
                  	imgDimensions.imageHeight = values.large.split(',')[0];
                  	imgDimensions.imageWidth = values.large.split(',')[1];
                    useOverrideDimensions = true;
                  }
                  break;
                case 'medium':
                  if (isValidDimension(ko.utils.unwrapObservable(values.medium))) {
                  	imgDimensions.imageHeight = values.medium.split(',')[0];
                  	imgDimensions.imageWidth = values.medium.split(',')[1];
                    useOverrideDimensions = true;
                  }
                  break;
                case 'small':
                  if (isValidDimension(ko.utils.unwrapObservable(values.small))) {
                  	imgDimensions.imageHeight = values.small.split(',')[0];
                  	imgDimensions.imageWidth = values.small.split(',')[1];
                    useOverrideDimensions = true;
                  }
                  break;
                case 'xsmall':
                  if (isValidDimension(ko.utils.unwrapObservable(values.xsmall))) {
                  	imgDimensions.imageHeight = values.xsmall.split(',')[0];
                  	imgDimensions.imageWidth = values.xsmall.split(',')[1];
                    useOverrideDimensions = true;
                  }
                  break;
              }
              // If override dimension for current viewport not found then search for 'size' option. size option can be in the form: 'x,y' or 'small'.
              // If valid 'size' option is provided in the binding then it overrides the dimension for all the viewports.
              if (!useOverrideDimensions) {
                if (isValidDimension(ko.utils.unwrapObservable(values.size))) {
              	  imgDimensions.imageHeight = values.size.split(',')[0];
              	  imgDimensions.imageWidth = values.size.split(',')[1];
                } else {
                  if (ko.utils.unwrapObservable(values.size)) {
                    switch (ko.utils.unwrapObservable(values.size)) {
                      case 'large':
                        if (isValidDimension(ko.utils.unwrapObservable(values.large))) {
                      	  imgDimensions.imageHeight = values.large.split(',')[0];
                      	  imgDimensions.imageWidth = values.large.split(',')[1];
                          useOverrideDimensions = true;
                        } else {
                      	  imgDimensions.imageHeight = defaultImgSizeForViewPorts.large.height ;
                      	  imgDimensions.imageWidth = defaultImgSizeForViewPorts.large.width ;
                        }
                        break;
                      case 'medium':
                        if (isValidDimension(ko.utils.unwrapObservable(values.medium))) {
                      	  imgDimensions.imageHeight = values.medium.split(',')[0];
                      	  imgDimensions.imageWidth = values.medium.split(',')[1];
                          useOverrideDimensions = true;
                        } else {
                      	  imgDimensions.imageHeight = defaultImgSizeForViewPorts.medium.height;
                      	  imgDimensions.imageWidth = defaultImgSizeForViewPorts.medium.width;
                        }
                        break;
                      case 'small':
                        if (isValidDimension(ko.utils.unwrapObservable(values.small))) {
                      	  imgDimensions.imageHeight = values.small.split(',')[0];
                      	  imgDimensions.imageWidth = values.small.split(',')[1];
                          useOverrideDimensions = true;
                        } else {
                      	  imgDimensions.imageHeight = defaultImgSizeForViewPorts.small.height;
                      	  imgDimensions.imageWidth = defaultImgSizeForViewPorts.small.width;
                        }
                        break;
                      case 'xsmall':
                        if (isValidDimension(ko.utils.unwrapObservable(values.xsmall))) {
                      	  imgDimensions.imageHeight = values.xsmall.split(',')[0];
                      	  imgDimensions.imageWidth = values.xsmall.split(',')[1];
                          useOverrideDimensions = true;
                        } else {
                      	  imgDimensions.imageHeight = defaultImgSizeForViewPorts.xsmall.height;
                      	  imgDimensions.imageWidth = defaultImgSizeForViewPorts.xsmall.width;
                        }
                        break;
                    }
                  }
                }
              }
          	return imgDimensions;
          };
          
          // Get the Media query for the Given size.
          var getImageMediaQuery = function(imgDimensions) {
          	
          	
          	if ( !imgDimensions ){
          		return ;
          	}
          	var minWidth = imgDimensions["minWidth"]   ;
          	var maxWidth = imgDimensions["maxWidth"]   ;
          	var imgWidth = imgDimensions["imageWidth"] ;
          	
          	var minWidthQuery = "";
          	if(minWidth){
          		minWidthQuery = "(min-width:"+minWidth+"px)";
          	}
          	
          	var maxWidthQuery = "";
          	if(maxWidth){
          		maxWidthQuery = "(max-width:"+maxWidth+"px)";
          	}
          	
          	if(minWidthQuery && maxWidthQuery && imgWidth  ){
          		return minWidthQuery+ " and " + maxWidthQuery + " "+ imgWidth +"px";
          	} else if (minWidthQuery && imgWidth) {
          		return minWidthQuery+" "+ imgWidth +"px";
          	} else if (maxWidthQuery && imgWidth ){
          		return  maxWidthQuery + " "+ imgWidth +"px";
          	} else {
          		return "";
          	}
          };
          
          var replaceHeightAndWidthInUrl = function (url, height, width){
          	
          	if (url.indexOf(CCConstants.ENDPOINT_IMAGES + "?source=") > -1){
          	 //URL already contains /ccstore/v1/images so we dont need to add it again. We need to just replace the height and width.
          	  var heightPattern = /height=[0-9]+/i ;	
          	  if(url.search(heightPattern)){
          		 url = url.replace(heightPattern , "height="+height) ;
          	  }
          	  
          	  var widthPattern = /width=[0-9]+/i ;
          	  if(url.search(widthPattern)){
          		 url = url.replace(widthPattern , "width="+width) ;
          	  }
          		
          		return url;
          	}
          	
          	return CCConstants.ENDPOINT_IMAGES + "?source=" + source + "&height=" + height + "&width=" + width ;
          	
          }
          
         //----- End Of Local Utility Closure's -----
          
         /* ----- Start of the Update Method for the ccImageResize Tag ----  
           If not working with values as an object or an image element don't do anything
         */
         
         if(typeof values !== 'object' || element.nodeName !== 'IMG') {
            return;
          } 
          
          // Set the Default minHeight of the Image.
          var imageDimensions = getImageDimensions();
          imageHeight = imageDimensions.imageHeight;
          imageWidth =  imageDimensions.imageWidth;
          
          var setMinHeightBeforeImageLoad =  (values.setMinHeightBeforeImageLoad &&  ko.utils.unwrapObservable(values.isSetMinHeightBeforeImageLoad)) ? 
        		  								ko.utils.unwrapObservable(values.isSetMinHeightBeforeImageLoad)
        		  								: true ;
          
          if (element.parentNode && setMinHeightBeforeImageLoad){
            var parent = element.parentNode;
            
            if (parent.getAttribute("id") !== "cc_img__resize_wrapper"){
              var wrapper = document.createElement('div');
            
              element.onload = function() {
            	wrapper.style.minHeight = "0px";	
              }
            
              // Set the Default minHeight of the Image.
              wrapper.style.maxWidth =  "100%";
              wrapper.style.minHeight = imageHeight+"px";
              wrapper.style.height = "100%";
              wrapper.setAttribute("id", "cc_img__resize_wrapper");
              // set the wrapper as child (instead of the element)
              parent.replaceChild(wrapper, element);
              // set element as child of wrapper
              wrapper.appendChild(element);
            }
          }
          
          extraParameters = getExtraParams();
          source = ko.utils.unwrapObservable(values.source);
          if(source) {
            src = isSrcSetandSizesSupported() ? source : replaceHeightAndWidthInUrl(source, imageHeight, imageWidth);
            if(extraParameters) {
              src = src + extraParameters;
            }
          } else {
            src = values.errorSrc;
          }
        
          // Error source - use the one defined in site settings first, and then fall back to the one specified
          // in the errorSrc attribute.
          defaultErrSrc = ko.utils.unwrapObservable(values.errorSrc);
          siteNoImageSrc = ko.bindingHandlers.ccResizeImage.getNoImageSiteSetting(bindingContext);
          errSrc = defaultErrSrc ? defaultErrSrc : siteNoImageSrc;
          
         // If the product image URL matches the default error source, use errSrc instead, to allow for a site specific
	 	 // no-image image
	 	 if ( src === "/img/no-image.jpg" ) {
	 	   src = errSrc;
	 	   source = errSrc;
	 	 }
          
          // Load the no-image image for the site
          if (siteNoImageSrc && siteNoImageSrc.length > 0) {
            var siteNoImageImage = new Image();
        
            // On error, set errSrc to the default error image
            siteNoImageImage.onerror = function() {
              errSrc = defaultErrSrc;
            }
        
            siteNoImageImage.src = siteNoImageSrc;
          }
        
          if(!alt) {
          alt = ko.utils.unwrapObservable(values.alt);
          }
          if(!title) {
            title = ko.utils.unwrapObservable(values.title);
          }
          
          errAlt = ko.utils.unwrapObservable(values.errorAlt);
          onerror = ko.utils.unwrapObservable(values.onerror);
        
          
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
                 
                 if(element.srcset){
              	   element.removeAttribute("srcset");
                 }
                 
                 if(element.sizes){
              	   element.removeAttribute("sizes");
                 }
                 
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
                   
                   if(element.srcset){
                	   element.removeAttribute("srcset");
                   }
                   
                   if(element.sizes){
                	   element.removeAttribute("sizes");
                   }
                   
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
                   
                   if(element.srcset){
                	   element.removeAttribute("srcset");
                   }
                   
                   if(element.sizes){
                	   element.removeAttribute("sizes");
                   }

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
             
             // Browser supports Html5 srcset and sizes attributes.
             if(isSrcSetandSizesSupported() ){
             	
                var srcSetVal = "";
                var sizesVal = "";
                 
                 for(var key=0; key < validSizes.length ; key++){
             	  // Set the img SrcSet Val
                   var imgDimensions = getImageDimensions(validSizes[key]);	
                   var url = getUrlForSize(validSizes[key], imgDimensions, source);
                   if(url && ( srcSetVal.indexOf(url) < 0)) {
             	     srcSetVal = srcSetVal ? srcSetVal + "," + url :  url  ;
              	    }
             	  
             	  //Set the img Size Val
             	  var currSize = getImageMediaQuery(imgDimensions);
             	  if(currSize){
             		  sizesVal =  sizesVal ? sizesVal + "," + currSize : currSize ;
             	  }
             	}
                
                // assign this to elements Srcset.
                if(srcSetVal ){ 
             	   element.srcset = srcSetVal;
                }
                
                if(sizesVal){
             	   element.sizes = sizesVal ;
                }
             } 
              
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
     * @class The dateTime binding uses date-time-utils.js helper class to format and localize the date.
     * The input can be given in any of the standard formats
     * @example
     * <div data-bind="dateTime: {date: '2014-08-22T21:25:00.000Z', format: 'datetime', dateFormat: 'short', timeFormat: 'short'}"></div>
     */
    ko.bindingHandlers.ccDateTime = {
      update : function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var bindingValue = valueAccessor();
        var value = ko.utils.unwrapObservable(bindingValue);
        var uDate = ko.utils.unwrapObservable(value.date);
        var formatType = ko.utils.unwrapObservable(value.format);
        var displayDateFormat = ko.utils.unwrapObservable(value.dateFormat);
        var displayTimeFormat = ko.utils.unwrapObservable(value.timeFormat);
        var returnedDateTimeDisplay = ko.utils.unwrapObservable(value.date);
        returnedDateTimeDisplay = dateTimeUtils.getFormattedDateTime(uDate, formatType, displayDateFormat, displayTimeFormat);
        $(element).text(returnedDateTimeDisplay);
      }
    };

    /**
     * @public
     * @class The ccNumber binding uses the cc-numberformat.js to format
     * and internationalize numbers
     * @author arnav.maiti@oracle.com
     *
     * @example
     * <div data-bind="ccNumber: '1234.5'"></div>
     */
    ko.bindingHandlers.ccNumber = {
      update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var bindingValue = valueAccessor();
        var value = ko.utils.unwrapObservable(bindingValue);
        var returnedNumber = null;
        returnedNumber = CCNumber.formatNumber(value);
        $(element).text(returnedNumber);
      }
    };

    /**
     * Helper binding to add a variable to the knockout binding context
     * widgetLayout can then be accessed on the bindingContext i.e. bindingContext.$widgetLayout.
     *
     * @public
     * @class
     * @example &lt;!-- ko setContextVariable:{name:'widgetLayout',value:'test'} --&gt;
     */
    ko.bindingHandlers.setContextVariable = {

      update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {

        var value = ko.utils.unwrapObservable(valueAccessor());
        bindingContext['$' + value.name] = ko.utils.unwrapObservable(value.value);
        var i = value;
      }
    };

    // allows containerless binding
    ko.virtualElements.allowedBindings.setContextVariable = true;

    /**
     * The element binding.
     * @public
     * @class
     * @param {string} type The element type - This determines the template to load
     * @param {string} id Unique instance ID for element
     * Will also check for an id value in the allBindingsAccessor
     * @example
     * data-bind="element: 'product-title'"
     * data-bind="element: 'product-title', id: '100004'"
     * data-bind="element: {type: 'product-title', id: '100004'}"
     */
    ko.bindingHandlers.element = {
      /**
       * The logic run once to initialize the binding for this element.
       * Indicates that this binding controls decendantBindings.
       * @private
       * @function
       * @param {Object} element The DOM element attached to this binding
       * @param {function(): object} valueAccessor A function that returns
       * all of the values associated with this binding.
       */
      init: function(element, valueAccessor, allBindingsAccessor, widget, bindingContext) {
        var values = ko.utils.unwrapObservable(valueAccessor());
        var mappingBase = widget.jsPath() + '/';

        for (var key in widget.elementsJs) {
          if (values === key) {

            if(widget.elementsJs.hasOwnProperty(key)) {
              var elementJs = widget.elementsJs[key]();

              if (elementJs !== null) {

                var BASE_URL_END_STRING = 'widget/';

                var urlSeparatorIndex = elementJs.indexOf(BASE_URL_END_STRING)
                  + BASE_URL_END_STRING.length;
                var jsMappingBase =
                  elementJs.substring(0, urlSeparatorIndex - 1);
                var jsIdx = elementJs.lastIndexOf('.');

                require({baseUrl: mappingBase}, [elementJs], function(js) {

                  if (typeof js === 'function') {
                    js();
                  }
                  else if (js.hasOwnProperty('onLoad')
                    && typeof js.onLoad === 'function') {
                    js.onLoad(widget);
                  }

                  var elementName = js.elementName;

                  // Store element JS in widget property <elementName> provided
                  // that it does not clash with existing widget property
                  if (widget.hasOwnProperty(elementName)) {
                    CCLogger.warn("Element name " + elementName +
                        " is same as existing property");
                  }
                  else {
                    widget[elementName] = js;
                  }

                  widget.elements[elementName] = js;

                  // Block is asynchronous so reset widget as initialized
                  if (widget.initialized()) {
                    widget.initialized.valueHasMutated();
                  }
                });
              }
            }

          }
        }

        return {'controlsDescendantBindings' : true};
      },

      /**
       * update is run whenever an observable in the binding's properties
       * changes.
       * @private
       * @function
       * @param {object} element The DOM element attached to this binding
       * @param {function(): object} valueAccessor A function that returns all of the values associated with this binding
       * @param {function(): object} allBindingsAccessor Object containing information about other bindings on the same HTML element
       * @param {object} viewModel The viewModel that is the current context for this binding.
       * @param {object} bindingContext The binding hierarchy for the current context
       */
      update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var value = ko.utils.unwrapObservable(valueAccessor());
        var type, id;

        if (!value) {
          return;
        }

        if(typeof(value) === "string") {
          type = value;
        } else if(typeof value === "object" && value.type != undefined) {
          type = value.type;

          if(value.id != undefined) {
            id = value.id;
          }
        } else {
          return;
        }

        if(!id || id === "") {
          if(allBindingsAccessor().id && allBindingsAccessor().id !== "") {
            id = allBindingsAccessor().id;
          } else {
            id = "id";
          }
        }

        var widgetId = (bindingContext.$data.id && bindingContext.$data.id()) ? bindingContext.$data.id() : "";
        var widgetType = (bindingContext.$data.typeId && bindingContext.$data.typeId()) ? bindingContext.$data.typeId() : "";

        var elementInstance = {};
        elementInstance.type = type;
        elementInstance.fullType = widgetType + "-" + type;
        elementInstance.id = id;
        elementInstance.textId = "text." + id;
        elementInstance.elementId = widgetId +"-" + type + "-" + id;

        elementInstance.styles = "";

        if(id !== "" && bindingContext.$elementConfig) {
          elementInstance.config = bindingContext.$elementConfig[id];

          if(elementInstance.config && elementInstance.config.font) {
            elementInstance.styles = elementInstance.config.font.styles || "";

            // If we are a block level element with an associated font,
            // check for padding and it to the wrapper tag as an inline style.
            if (elementInstance.config.font.styles.display && elementInstance.config.font.styles.display === "block" &&
                elementInstance.config.padding &&
                (elementInstance.config.padding.paddingTop > 0 || elementInstance.config.padding.paddingBottom > 0 ||
                 elementInstance.config.padding.paddingLeft > 0 || elementInstance.config.padding.paddingRight > 0)) {
              /* top | right | bottom | left */
              elementInstance.styles["padding"] = elementInstance.config.padding.paddingTop + "px " +
                  elementInstance.config.padding.paddingRight + "px " +
                  elementInstance.config.padding.paddingBottom + "px " +
                  elementInstance.config.padding.paddingLeft + "px";
            }
          }
        }

        // Set ID and styles on the current element
        // (i.e. the one with the element binding)
        $(element).attr('id', elementInstance.elementId);
        if (elementInstance.styles != "") {
          $(element).css(elementInstance.styles);
        }
        bindingContext['$elementInstance'] = elementInstance;

        // Setup template values which mimic the binding of a template.
        var templateValues = {};
        templateValues.name = elementInstance.fullType;
        templateValues.data = viewModel;
        templateValues.url = "";

        //Render the template
        ko.bindingHandlers.template.update(element,
          function() {
            return templateValues;
          }, allBindingsAccessor, viewModel, bindingContext
        );

      }

    };

    /**
     * The addTemplateBinding
     * @public
     * @class
     * @param {string} type The template code to add
     */
    ko.bindingHandlers.addTemplate = {
      /**
       * update is run whenever an observable in the binding's properties
       * changes.
       * @private
       * @function
       * @param {object} element The DOM element attached to this binding
       * @param {function(): object} valueAccessor A function that returns all of the values associated with this binding
       * @param {function(): object} allBindingsAccessor Object containing information about other bindings on the same HTML element
       * @param {object} viewModel The viewModel that is the current context for this binding.
       * @param {object} bindingContext The binding hierarchy for the current context
       */
      update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var value = ko.utils.unwrapObservable(valueAccessor());

        if(typeof(value) === "string") {

          $(value).not('text').each( function() {
            var id = this.id;

            if(id && id !== "") {
              if($('body').find('#'+id).length == 0) {
                $('body').append(this);
              }
            }
          });

        }
      }
    };

    // allows containerless binding
    ko.virtualElements.allowedBindings.addTemplate = true;


    /**
     * The previewBar binding
     * @public
     * @class
     * @param {bool} are we in preview
     */

    ko.bindingHandlers.previewBar = {
      /**
       * update is run whenever an observable in the binding's properties
       * changes.
       * @private
       * @function
       * @param {object} element The DOM element attached to this binding
       * @param {function(): object} valueAccessor A function that returns all of the values associated with this binding
       * @param {function(): object} allBindingsAccessor Object containing information about other bindings on the same HTML element
       * @param {object} viewModel The viewModel that is the current context for this binding.
       * @param {object} bindingContext The binding hierarchy for the current context
       */
      update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var isPreview = ko.utils.unwrapObservable(valueAccessor());

        if (!isPreview) {
          return;
        }

        if (bindingContext.$data.previewBar) {
          var previewBar = bindingContext.$data.previewBar;
          var cssPath = previewBar.cssPath;
          var templateUrl = previewBar.templateUrl;
          var templateName = previewBar.templateName;
        } else {
          return;
        }

        // Get the CSS if we need it
        if (!$("link[href='" + cssPath + "']").length)
          $('<link href="' + cssPath + '" rel="stylesheet">').appendTo("head");

        // Setup template values which mimic the binding of a template.
        var templateValues = {};
        templateValues.name = templateName;
        templateValues.data = viewModel;
        templateValues.templateUrl = templateUrl;
        templateValues.afterRender = previewBar.attachEventHandlers;

        // Render the template, once the jet menu components have loaded
        $.when(previewBar.ojLoaded).done(function() {
          ko.bindingHandlers.template.update(element,
            function() {
              return templateValues;
            }, allBindingsAccessor, viewModel, bindingContext);
        });
      }
    };

    // allows containerless binding
    ko.virtualElements.allowedBindings.previewBar = true;

    /**
     * The embeddedAssistance extender works with the password validator to provide an embedded assistance
     * for a password field in case there is an error in the password validation.
     * @public
     * @class
     * @param {Object} element The DOM element attached to this binding
     * @param {function(): object} valueAccessor A function that returns
     * all of the values associated with this binding.
     */
    ko.bindingHandlers.embeddedAssistance = {
      /**
       * The logic run once to initialize the binding for this element.
       * Indicates that this binding controls decendantBindings.
       * @private
       * @function
       * @param {Object} element The DOM element attached to this binding
       * @param {function(): object} valueAccessor A function that returns
       * all of the values associated with this binding.
       * @param {function(): object} allBindingsAccessor Object containing information about other bindings on the same HTML element
       * @param {object} viewModel The viewModel that is the current context for this binding.
       * @param {object} bindingContext The binding hierarchy for the current context
       */
      init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var observable = valueAccessor();
        observable.subscribe(function(){
          ko.bindingHandlers.embeddedAssistance.update(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);
        });
      },

      /**
       * update is run whenever an observable in the binding's properties changes.
       * @private
       * @function
       * @memberOf embeddedAssistance
       * @name update
       * @param {object} element The DOM element attached to this binding
       * @param {function(): object} valueAccessor A function that returns all of the values associated with this binding
       * @param {function(): object} allBindingsAccessor Object containing information about other bindings on the same HTML element
       * @param {object} viewModel The viewModel that is the current context for this binding.
       * @param {object} bindingContext The binding hierarchy for the current context
       */
      update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var observable = valueAccessor();

        observable.extend({ validatable: true });

        var isModified = false;
        var isValid = false;

        isModified = observable.isModified() && observable().length > 0;
        isValid = observable.isValid();

        // create a handler to correctly return embedded assistance
        var embeddedMessageAccessor = function () {
          if (isModified) {
            return isValid ? null : observable.embeddedAssistance;
          } else {
            return null;
          }
        };

        //toggle visibility on validation messages when validation hasn't been evaluated, or when the object isValid
        var visiblityAccessor = function () {
          return isModified ? !isValid : false;
        };

        ko.bindingHandlers.text.update(element, embeddedMessageAccessor);
        ko.bindingHandlers.visible.update(element, visiblityAccessor);
      }
    };

    /** @namespace ko.extenders */

    /**
     * The propertyWatch extender provides the ability to listen for any changes within an
     * observable object's properties, without having to subscribe to each property individually.
     *
     * @public
     * @function
     * @param {observable ...} root Base observable to watch for changes.
     * @example
     * myObservable = ko.observable().extend({ propertyWatch: myObservable });
     *
     * myObservable.hasChanged.subscribe(function(hasChanged){...});
     */
    ko.extenders.propertyWatch = function (root) {

      root.initialState = ko.observable(ko.toJSON(root));

      root.resetWatch = function() {
        root.initialState(ko.toJSON(root));
      };

      root.hasChanged = ko.computed(function() {
        var changed = root.initialState() !== ko.toJSON(root);

        if (changed) {
          root.resetWatch();
        }
        return changed;
      }).extend({notify: "always", throttle: 100})
        .extend({notify: "always"});

      return root;
    };

    /**
     * The trigger extender allows a message to be triggered when the
     * observable has a given value. This extender should be used in conjunction
     * with the triggerMessage binding, which will display the message.
     * This could possibly be reworked, at a later date, to accept a list of
     * values or multiple value:message pairs, but for now it does what's needed.
     *
     * @public
     * @function
     * @param {observable ...} observable The target observable.
     * @param {Object} params A trigger value for the observable and a message that
     * is to be triggered when the observable has that value.
     * @example
     * myObservable = ko.observable().extend({ trigger: {value: myTriggerValue, message: myTriggerMessage} });
     */
    ko.extenders.trigger = function(observable, params) {

      observable.triggerSet     = false;
      observable.triggerValue   = null;
      observable.triggerMessage = '';

      observable.triggerFired   = ko.observable(false);

      if(params) {
        if(params.value) {
          observable.triggerValue = params.value;
          observable.triggerSet = true;
        }

        if(params.message) {
          observable.triggerMessage = params.message;
        }
      }

      observable.trigger = function(newValue) {
        if(observable() ===  observable.triggerValue) {
          observable.triggerFired(true);
        } else {
          observable.triggerFired(false);
        }
      };

      observable.clearTrigger = function() {
        observable.triggerFired(false);
      };

      if(observable.triggerSet) {
        // listen for changes to the observable
        observable.subscribe(observable.trigger);
      }

      return observable;
    };

    /**
     * The accessControl binding to restrict elements according to the role.
     * The accessKey has to be given in the binidng which has to be restricted.
     * The accessKey is verified against the role of the current admin profile.
     * If the accessKey exists in the allowedAccesses for the profile the element
     * will be shown else it has to be hidden.
     *
     * Supports both strong binding as well as virtual element binding.
     *
     * @example
     * <div id="cc-publish-dropdown" class="btn-group pull-right"  data-bind="accessControl: {accessKey: 'publishing-button'}">
     *
     * <!-- ko accessControl: {accessKey: 'publishing-title'} -->
     *       <h2 class="cc-page-title" data-bind="localeText: 'updatesToPublishText'"></h2>
     * <!-- /ko -->
     *
     */
      ko.bindingHandlers.accessControl = {
          init : function(element, valueAccessor, allBindingsAccessor) {
            var accessControl = allBindingsAccessor().accessControl;
            var defaultAction = accessControl.defaultAction ? accessControl.defaultAction : CCConstants.HIDE;

            if (!profileHelper.isAuthorized(accessControl.accessKey)) {
              // if this is not a virtual binding, show/hide only that element
              if(defaultAction === CCConstants.SHOW){
                //any action incase of showing element
              }else{
                $(element).hide();
                ko.virtualElements.emptyNode(element);
              }
            }else{
              if(defaultAction === CCConstants.SHOW){
                $(element).hide();
                ko.virtualElements.emptyNode(element);
              }else{
              }
            }
          }
      };
    //allows containerless binding, i.e., virtual element binding
    ko.virtualElements.allowedBindings.accessControl = true;

  });

