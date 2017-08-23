define(
  // -------------------------------------------------------------------
  // PACKAGE NAME
  // -------------------------------------------------------------------
  'viewModels/dynamicProperty',

  //-------------------------------------------------------------------
  //DEPENDENCIES
  //-------------------------------------------------------------------
  [ 'knockout', 'koValidate', 'ccKoValidateRules',
    'storeKoExtensions', 'CCi18n' ],

  //-------------------------------------------------------------------
  // MODULE DEFINITION
  //-------------------------------------------------------------------
  function(ko, koValidate, rules, storeKoExtensions, CCi18n) {
  
    'use strict';
  
    //-------------------------------------------------------
    // Class definition & member variables
    //-------------------------------------------------------
    /**
     * Creates a Dynamic Property view model.
     * @name DynamicProperty
     * @class DynamicProperty
     * @property {observable<string>} id Unique identifier
     * @property {observable<string>} label Label or display name
     * @property {observable<string>} type Data type
     * @property {observable<string>} uiEditorType UI editor type
     * @property {observable<Object>} default Default value
     * @property {observable<boolean>} required Whether a value is required
     * @property {observable<string>} value Value
     */
    function DynamicProperty() {
      var self = this;
      
      // Property metadata
      self.id = ko.observable();
      self.label = ko.observable();
      self.type = ko.observable();
      self.uiEditorType = ko.observable();
      self.default = ko.observable(null);
      self.required = ko.observable(false);
      self.length = ko.observable();

      // Property value
      self.value = ko.observable();
      self.value.extend({required: false});
      
      /**
       * Check whether the dynamic property is valid
       * 
       * @function
       * @name DynamicProperty#isValid
       * @returns {boolean} <code>true</code> if the dynamic property is valid, and <code>false</code> otherwise.
       */
      self.isValid = function() {
        // Validate the value
        if (self.value() === undefined || self.value() === null) {
          if (self.required()) {
            return false;
          }
          else {
            return true;
          }
        }
        else if (self.value.isValid !== undefined) {
          return self.value.isValid();
        }
        else {
          return true;
        }
      };


      /**
       * Validates the dynamic property
       * 
       * @function
       * @name DynamicProperty#validateNow
       * @returns {boolean} <code>true</code> if the dynamic property is valid, and <code>false</code> otherwise.
       */
      self.validateNow = function() {
        if (self.value.isModified !== undefined) {
          self.value.isModified(true);
        } 
        return self.isValid();
      };
      
      /**
       * Resets the dynamic property
       * 
       * @function
       * @name DynamicProperty#reset
       */
      self.reset = function() {
        // Reset the value
        self.value(null);
        self.value.isModified(false);
      };
    
      /**
       * Initializes the dynamic properties metadata
       * @function
       * @name DynamicProperty#initializeMetadata
       * @param {Object} pPropertyJson JSON containing property metadata
       * @param {boolean} pIsNewProperty Indicates if this is a new property
       */
      self.initializeMetadata = function(pPropertyJson, pIsNewProperty) {
        
        // ID and label
        self.id(pPropertyJson.id);
        self.label(pPropertyJson.label);
        
        // Data type
        self.type(pPropertyJson.type);
        self.uiEditorType(pPropertyJson.uiEditorType);

        // Default value
        if (pPropertyJson.default != null) {
          self.default(pPropertyJson.default);
        }
        
        // Whether value is required
        self.required(pPropertyJson.required);
        
        // Maximum length of the value
        if (pPropertyJson.length) {
          self.length(pPropertyJson.length);
        }
      
        // Validation for the property value
        var validationObject = { required : false };
        validationObject.required = {
            params: self.required(),
            message: CCi18n.t('ns.common:resources.dynamicPropertyRequired',{})
        };
        if (self.length() > 0 && self.type() !== 'checkbox' && self.type() !== 'number' && self.type() != 'date') {
          validationObject.maxLength = {
              params: self.length(),
              message: CCi18n.t('ns.common:resources.maxlengthValidationMsg',{maxLength: self.length(), fieldName: self.label()})
          };
        }
        self.value.extend(validationObject);
        
        // Initialize value
        if (self.value() === undefined || self.value() === null) {
          self.value(self.default());
        }
        
        // Special case for checkboxes
        if (self.type() === 'checkbox' && self.value() !== true) {
          self.value(false);
        }
      };
      
      /**
       * Gathers metadata information into an object
       * @function
       * @name DynamicProperty#initializeMetadata#
       * @return {Object} Object containing metadata
       */
      self.getMetadata = function() {
        var metadata = new Object();
        metadata.id = self.id();
        metadata.label =  self.label();
        metadata.type = self.type();
        metadata.uiEditorType = self.uiEditorType();
        metadata.default = self.default();
        metadata.required = self.required();
        metadata.length = self.length();
        return metadata;
      };
    }

    return DynamicProperty;
  }
);
