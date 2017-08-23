  /**
   * @fileoverview Password Validator Based on a set of Policies
   * @version: 1.0
   * 
   */
define(
//-------------------------------------------------------------------
// PACKAGE NAME
//-------------------------------------------------------------------
'ccPasswordValidator',

//-------------------------------------------------------------------
// DEPENDENCIES
//-------------------------------------------------------------------
['knockout', 'CCi18n'],

//-------------------------------------------------------------------
// MODULE DEFINITION
//-------------------------------------------------------------------
function(ko, CCi18n) {
  "use strict";

  function CCPasswordValidator() {
  }

  // Constants
  CCPasswordValidator.prototype.LOWER_CASE_LETTERS = "abcdefghijklmnopqrstuvwxyz";
  CCPasswordValidator.prototype.UPPER_CASE_LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  CCPasswordValidator.prototype.NUMBER_LIST = "0123456789";
  CCPasswordValidator.prototype.SYMBOLS_LIST = "~!@#$%^&*()_-+={}[]|:;<>,./?";
  
  CCPasswordValidator.prototype.embeddedAssistance = "";
  
  /**
   * Validator method for password
   * 
   * @param the password to check
   * @param the email of the user
   * @param the password policies
   * @returns whether the validation passed or failed
   *  
   */
  CCPasswordValidator.prototype.validate = function(password, email, policies, includePreviousNPasswordRule) {
    var self = this;
    
    // Empty policies check to ensure that it passes in case there is no policies 
    if (!policies) {
      return true;
    }
    
    var useMinPasswordLength = policies.useMinPasswordLength;
    var minPasswordLength = policies.minPasswordLength;
    var cannotUseUsername = policies.cannotUseUsername;
    var useMixedCase = policies.useMixedCase;
    var useNumber = policies.useNumber;
    var useSymbol = policies.useSymbol;
    var cannotUsePreviousPasswords = policies.cannotUsePreviousPasswords;
    var numberOfPreviousPasswords = policies.numberOfPreviousPasswords;
    var emptyPassword = false;
    
    // Initial check to make sure that when password is empty
    // to give no password policies error and only show the
    // embedded assistance. Let the require clause handle it.
    if (password == null || password == undefined || password == "") {
      emptyPassword = true;
    }
    
    var errorFlag = false;
    var result;
    
    // Minimum Password Length check
    if (useMinPasswordLength == "true") {
      if (password.length < minPasswordLength) {
        errorFlag = true;
      }
    }
    // Cannot use username check      
    if ((cannotUseUsername == "true") && (email != "") && (password.toLowerCase() === email.toLowerCase())) {
      errorFlag = true;
    }
    // Use Number
    if (useNumber == "true") {
      result = self.checkAgainst(password, self.NUMBER_LIST);
      if (!result) {
        errorFlag = true;
      }
    }
    // Use Symbol
    if (useSymbol == "true") {
      result = self.checkAgainst(password, self.SYMBOLS_LIST);
      if (!result) {
        errorFlag = true;
      }
    }
    // Use Mixed Case
    if (useMixedCase == "true") {
      result = self.hasMixedCase(password);
      if (!result) {
        errorFlag = true;
      }
    }
    
    var returnFlag = false;
    // Make the check happen
    if (errorFlag) {
      returnFlag = false;
      self.embeddedAssistance = self.getAllEmbeddedAssistance(policies, includePreviousNPasswordRule);
    } else {
      self.embeddedAssistance = "";
      returnFlag = true;
    }
    
    // Empty password check
    if (emptyPassword) {
      return true;
    } else {
      return returnFlag;
    }
  };
  
  /**
   * Gives all the enabled embedded assistance
   * 
   * @param should the previousNPasswordRule check be included or not
   * @returns the embedded assistance
   */
  CCPasswordValidator.prototype.getAllEmbeddedAssistance = function(policies, includePreviousNPasswordRule) {
    var useMinPasswordLength = policies.useMinPasswordLength;
    var minPasswordLength = policies.minPasswordLength;
    var cannotUseUsername = policies.cannotUseUsername;
    var useMixedCase = policies.useMixedCase;
    var useNumber = policies.useNumber;
    var useSymbol = policies.useSymbol;
    var cannotUsePreviousPasswords = policies.cannotUsePreviousPasswords;
    var numberOfPreviousPasswords = policies.numberOfPreviousPasswords;
    
    var embeddedAssistance = CCi18n.t('ns.common:resources.embeddedAssistancePreText');
    
    var eAFlag = false;
    
    // Minimum Password Length check
    if (useMinPasswordLength == "true") {
      embeddedAssistance += " " + CCi18n.t('ns.common:resources.embeddedAssistanceMinPasswordLengthText', {min: minPasswordLength});
      eAFlag = true;
    }
    // Cannot use username check      
    if (cannotUseUsername == "true") {
      if (eAFlag == true) {
        embeddedAssistance += ", ";
      } else {
        embeddedAssistance += " ";
      }
      embeddedAssistance += CCi18n.t('ns.common:resources.embeddedAssistanceCannotUseUsernameText');
      eAFlag = true;
    }
    // Use Number
    if (useNumber == "true") {
      if (eAFlag == true) {
        embeddedAssistance += ", ";
      } else {
        embeddedAssistance += " ";
      }
      embeddedAssistance += CCi18n.t('ns.common:resources.embeddedAssistanceUseNumber');
      eAFlag = true;
    }
    // Use Symbol
    if (useSymbol == "true") {
      if (eAFlag == true) {
        embeddedAssistance += ", ";
      } else {
        embeddedAssistance += " ";
      }
      embeddedAssistance += CCi18n.t('ns.common:resources.embeddedAssistanceUseSymbol');
      eAFlag = true;
    }
    // Use Mixed Case
    if (useMixedCase == "true") {
      if (eAFlag == true) {
        embeddedAssistance += ", ";
      } else {
        embeddedAssistance += " ";
      }
      embeddedAssistance += CCi18n.t('ns.common:resources.embeddedAssistanceUseMixedCase');
      eAFlag = true;
    }
    // Previous N passwords
    if ((includePreviousNPasswordRule == true) && (cannotUsePreviousPasswords == "true")) {
      if (eAFlag == true) {
        embeddedAssistance += ", ";
      } else {
        embeddedAssistance += " ";
      }
      embeddedAssistance += CCi18n.t('ns.common:resources.embeddedAssistanceNotInPreviousNPasswords');
      eAFlag = true;
    }
    embeddedAssistance += ".";
    return embeddedAssistance;
  };
  
  /**
   * Mixed character check
   * 
   * @param the password to validate
   * @returns whether the password contains mixed case
   */
  CCPasswordValidator.prototype.hasMixedCase = function(password) {
    var self = this;
    var passed = false;
    if (password == null) {
      return false;
    }
    var hasLowerCase = false;
    var hasUpperCase = false;
    for (var i = 0; i < password.length; i++) {
      var testchar = password.charAt(i);
      if (self.LOWER_CASE_LETTERS.lastIndexOf(testchar) != -1) {
        hasLowerCase = true;
      } 
      if (self.UPPER_CASE_LETTERS.lastIndexOf(testchar) != -1) {
        hasUpperCase = true;
      } 
    }
    if (hasLowerCase && hasUpperCase) {
      passed = true;
    } 
    return passed;
  };
  
  /**
   * Check against a set of characters
   * 
   * @param the password to validate
   * @param the character set
   * @returns whether the password contains at least 
   * one of the character from the set
   */
  CCPasswordValidator.prototype.checkAgainst = function(password, characterSet) {
    var passed = false;
    if (password == null) {
      return false;
    }
    // rule should pass if the required list is set to empty
    if (characterSet.length == 0) {
      return true;
    }
    for (var i = 0; i < password.length; i++) {
      var testchar = password.charAt(i);
      if (characterSet.lastIndexOf(testchar) != -1) {
        passed = true;
      }
    }
    return passed;
  };

  return new CCPasswordValidator();
});

