/*global $ */
/**
 * 
 */

define('profileHelper',
['knockout', 'ccConstants'],

function(ko, ccConstants) {
  "use strict";

  /**
   * Creates a ProfileHelper
   */
  function ProfileHelper() {
    var self = this;
    this.profileData = ko.observable(null);
    this.allowedActions = ko.observableArray(null);
    /**
     * We are having more than one page user one tab. So we are maintaining this
     * map in JS. We can find more optimal way in future
     */
    this.pageAccesskeys = {
            home : [ccConstants.DASHBOARD_TAB , ccConstants.DASHBOARD_MINI_TAB],
            catalog: [ccConstants.CATALOG_TAB],
            'price-groups': [ccConstants.CATALOG_TAB],
            'price-group': [ccConstants.CATALOG_TAB],
            marketing: [ccConstants.MARKETING_TAB],
            reporting: [ccConstants.REPORTS_TAB],
            search: [ccConstants.SEARCH_TAB],
            accounts: [ccConstants.ACCOUNTS_TAB],
            contacts: [ccConstants.ACCOUNTS_TAB],
            design: [ccConstants.DESIGN_TAB],
            code: [ccConstants.DESIGN_TAB],
            publish: [ccConstants.PUBLISHING_TAB],
            settings: [ccConstants.SETTINGS_TAB, ccConstants.SETTINGS_LIMITED_TAB],
            inventory: [ccConstants.CATALOG_TAB],
            css: [ccConstants.DESIGN_TAB],
            theme: [ccConstants.DESIGN_TAB],
            layout: [ccConstants.DESIGN_TAB],
            media: [ccConstants.MEDIA_TAB]
          };
    
    this.restrictedSubTabAccess = {
        emailSettings: [ccConstants.SETTINGS_TAB],
        webAPI: [ccConstants.SETTINGS_TAB],
        accessControl: [ccConstants.SETTINGS_TAB],
        extensions: [ccConstants.SETTINGS_TAB],
        'abandonedCartSettings': [ccConstants.SETTINGS_TAB],
        'storeEndpointSettings': [ccConstants.SETTINGS_TAB]
    };
    
    this.tourNavigationData = {
          home : {
            url : ccConstants.HOME_PAGE
          },
          catalog : {
            url : ccConstants.AGENT_CATALOG_PAGE_CONTEXT
          },
          marketing : {
            url : ccConstants.MARKETING_PAGE
          },
          reporting : {
            url : ccConstants.REPORTING_PAGE
          },
          search : {
            url : ccConstants.SEARCH_PAGE
          },
          accounts : {
            url : ccConstants.CREATE_ACCOUNT_URL,
            lastStop : false
          },
          design : {
            url : ccConstants.DESIGN_PAGE
          },
          code : {
            url : ccConstants.CODE_PAGE
          },
          publish : {
            url : ccConstants.PUBLISH_PAGE
          },
          settings : {
            url : ccConstants.SETTINGS_SHIPPINGMETHODS_PAGE,
            lastStop : false
          }
    };
    return (this);
  }
  
  /**
   * This will return true if user is allowed to do this particular action represented by <i>key</i>
   * @param key action identifier
   */
  ProfileHelper.prototype.isAuthorized = function (keys) {
    var self = this;
    if(keys){
      var currentActions = [];
      if($.isArray(keys)){
        currentActions = keys;
      }else{
        currentActions.push(keys);
      }
      if(self.allowedActions && self.allowedActions().length > 0 &&
          ($(self.allowedActions()).filter(currentActions).length > 0)){
        return true;
      }
    }
    return false;
  };
  
  /**
   * This will return true if user is allowed to page represented by <i>pageId</i>
   * @param pageId action identifier
   */
  ProfileHelper.prototype.isAuthorizedForPage = function (pageId) {
    var self = this;
    var keys = self.pageAccesskeys[pageId];
    if(typeof keys === "undefined" || keys === null){
      return undefined;
    }
    return self.isAuthorized(keys);
  };
  
  /**
   * This will return true if user is allowed to tab represented by <i>tabId</i>
   * @param tabId tab identifier
   */
  ProfileHelper.prototype.isAuthorizedForSubTab = function (tabId) {
    if(!tabId){
      return true;
    }
    var self = this;
    var keys = self.restrictedSubTabAccess[tabId];
    if(typeof keys === "undefined" || keys === null){
      return true;
    }
    return self.isAuthorized(keys);
  };
  
  /**
   * This will return true if user is allowed to page represented by <i>pageId</i>
   * @param pageId action identifier
   */
  ProfileHelper.prototype.nextAuthorizedPage = function (pageId) {
    if(pageId){
      var self = this;
      var urlParts = pageId.split("/");
      if(urlParts){
        pageId = (urlParts[0] && urlParts[0].length > 0) ? urlParts[0] : urlParts[1];
      }
      if(typeof pageId === "undefined" || pageId === null){
        return undefined;
      }
      var keyFound = false;
      for (var property in self.pageAccesskeys) {
        if (self.pageAccesskeys.hasOwnProperty(property)) {
          if(property === pageId){
            keyFound = true;
          }
          if(keyFound){
            var keys = self.pageAccesskeys[property];
            if(self.isAuthorized(keys)){
              return self.tourNavigationData[property];
            }
          }
        }
      }
      return null;
    }
  };

  return new ProfileHelper();
});

