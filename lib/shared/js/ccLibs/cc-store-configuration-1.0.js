/**
 * @fileoverview CCStoreConfiguration Class
 *
 * It is used to store configurations that will be used in storefront.
 *
 * Usage:
 *
 * 1) Include in the proper require.js main module with the following
 * line:
 *
 * CCStoreConfiguration: '/shared/js/ccLibs/cc-store-configuration-1.0'
 *
 * 2) include in the module as follows:
 *
 * define(
 *   [... 'ccStoreConfiguration' ...]
 *   function( ... CCStoreConfiguration ...)
 * )
 *
 * 3) Create a singleton instance for the library
 *    storeConfiguration = CCStoreConfiguration.getInstance();
 *
 * 4) invoke as follows:
 *  var filterKey = storeConfiguration.getFilterToUse(contextObject);
 *
 */

define (
  //----------------------
  // PACKAGE NAME
  //----------------------
  'ccStoreConfiguration',

  //------------------------
  // MODULE DEFINITION
  //------------------------
  [],function () {

    "use strict";

    /**
     * Creates a StoreConfiguration object.
     * @name CCStoreConfiguration
     * @class CCStoreConfiguration
     */
    function CCStoreConfiguration() {

      if (CCStoreConfiguration.prototype.singleInstance) {
        throw new Error ("Cannot instantiate more than one CCStoreConfiguration. Use getInstance() method");
      }

      var self = this;
    }

    /**
     * An object containing the filterKeys to be used corresponding to a endpointCall contextData
     * The key of this object is constructed using contextData, whereas the value corresponds to the
     * filterKey that should be returned for the passed contextData
     */
    CCStoreConfiguration.prototype.filterMap = {
        "getCollection":{
          "megaMenuNavigation": {"ccFilterConfigKey": "categoryNavData"},
          "categoryNavigation": {"ccFilterConfigKey": "categoryNavData"}
        },
        "listProducts":{
          "productListingData": {"ccFilterConfigKey": "PLPData"},
          "collectionWidget": {"ccFilterConfigKey": "collectionData"},
          "getProductData": {"ccFilterConfigKey": "productData"},
          "getProductDataAndRedirect": {"ccFilterConfigKey": "productData"}
        }
    };

    /**
     * An array containing the priority of data, that will be used to search the filterKey using context object.
     */
    CCStoreConfiguration.prototype.priorityList = ["endpoint","page","identifier"];

    /**
     * A boolean flag to enable or disable the filter usage for endpoint responses
     */
    CCStoreConfiguration.prototype.filterEnabled = false;

    /**
     * A boolean flag to enable or disable the functionality of resetting shipping group relationship on cart update
     */
    CCStoreConfiguration.prototype.resetShippingGroupRelationships = true;

    /**
     * Method to get the filter key based on the context passed as a parameter.
     * The context is expected to have "endpoint","currentPage" and an "identifier".
     * The unique combination endpoint+currentPage+identifier will help to locate
     * the filterKey that will be returned from this function.
     * An additional parameter overrideFilterUsage that can be used to override
     * the enable flag for this function call
     * @param {Object} pContext - Object that has context data, corresponding to which
     *        filterKey will be returned
     * @return filterKey {String} The key to be used for the passed context object.
     */
    CCStoreConfiguration.prototype.getFilterToUse = function (pContext) {
      var self = this;
      if (self.filterEnabled) {
        if (null != pContext && pContext.constructor === Object) {
          var contextRemaining = Object.keys(pContext).length;
          var parentData = self.filterMap;
          var key="";
          var keyData = null;
          for (var i = 0; i < self.priorityList.length; i++) {
            key = self.priorityList[i];
            if (pContext[key]) {
              contextRemaining--;
              keyData = parentData[pContext[key]];
              // If all the keys of contextData has been used, and we have a key, return the key
              if (null != keyData && keyData.constructor === Object && keyData["ccFilterConfigKey"]
              && contextRemaining == 0) {
                return keyData["ccFilterConfigKey"];
              } else if (null != keyData && keyData.constructor === Object) {
                parentData = keyData;
              } else if (null == keyData && parentData["default"]) {
                // If keyData is null, but we have default at parentLevel, go to default node.
                keyData = parentData["default"];
                // If all the keys of contextData has been used, and we have a key, return the key
                if (keyData.constructor === Object && keyData["ccFilterConfigKey"] && contextRemaining == 0) {
                  return keyData["ccFilterConfigKey"];
                } else if (keyData.constructor === Object) {
                  parentData = keyData;
                } else if ((null == keyData || contextRemaining == 0) && parentData["ccFilterConfigKey"]) {
                  // If the list has been exhausted, and we have a key at parentLevel, return the key.
                  return parentData["ccFilterConfigKey"];
                } else {
                  // If contextData couldn't point to a key, return null
                  return null;
                }
              } else if ((null == keyData || contextRemaining == 0) && parentData["ccFilterConfigKey"]) {
                // If the list has been exhausted, and we have a key at parentLevel, return the key.
                return parentData["ccFilterConfigKey"];
              } else {
                // If contextData couldn't point to a key, return null
                return null;
              }
            }
          }
          // If the priorityList has ended, and no key is returned. Return the filterKey at this level, if exists.
          if (null != keyData && keyData.constructor === Object && keyData["ccFilterConfigKey"]) {
            return keyData["ccFilterConfigKey"];
          }
        }
      }
      return null;
    };

    /**
     * Method to enable the filter usage
     */
    CCStoreConfiguration.prototype.enableFilter = function () {
      this.filterEnabled = true;
    };

    /**
     * Method to disable the filter usage
     */
    CCStoreConfiguration.prototype.disableFilter = function () {
      this.filterEnabled = false;
    };

    /**
     * Method to add or update the filterKey corresponding to a contextKey
     * contextKey = endpoint+currentPage+identifier
     * @param {Object} pFilterMap - Object that will have the contextKey and its corresponding filterKey
     */
    CCStoreConfiguration.prototype.updateFiltersToUse = function (pFilterMap) {
      var self = this;
      if (null != pFilterMap && pFilterMap.constructor === Object) {
        var filterIdentifiers = Object.keys(pFilterMap);
        for (var i = 0; i< filterIdentifiers.length; i ++) {
          self.filterMap[filterIdentifiers[i]] = pFilterMap[filterIdentifiers[i]];
        }
      }
    };

    /**
     * Method to replace all the filterKeys, with the passed contextKey to
     * filterKey mapped object.
     * @param {Object} pFilterMap - Object that has contextKey mapped to its corresponding filterKey
     */
    CCStoreConfiguration.prototype.replaceAllFiltersToUse = function (pFilterMap) {
      var self = this;
      if (null != pFilterMap && pFilterMap.constructor === Object) {
        self.filterMap = pFilterMap;
      }
    };

    /**
     * Method to add new data to the priorityList
     * @param {Array} pList - Data that needs to be appended to the priorityList
     */
    CCStoreConfiguration.prototype.addDataToPriorityList = function (pList) {
      var self = this;
      if (null != pList && pList.constructor === Array) {
        for(var i = 0; i < pList.length; i++) {
          self.priorityList.push(pList[i]);
        }
      }
    };

    /**
     * Method to replace data of the priorityList
     * @param {Array} pList - Data that will replace the priorityList data
     */
    CCStoreConfiguration.prototype.replacePriorityList = function (pList) {
      var self = this;
      if (null != pList && pList.constructor === Array) {
        self.priorityList = pList;
      }
    };

    /**
     * Array to store the layout ids rendered on the browser.
     */
    CCStoreConfiguration.prototype.layoutIdsRendered = [];

    /**
     * Array size for layoutIdsRendered.
     */
    CCStoreConfiguration.prototype.layoutsRenderedArraySize = 15;

    /**
     * Used to enable or disable passing layoutsRendered query paramater in the
     * layout call. Enabling this will make the layout call response return from
     * server instead of JSONStoreCache/Akamai cache. But by passing this
     * parameter, the content size of the response significantly reduces.
     */
    CCStoreConfiguration.prototype.enableLayoutsRenderedForLayout = false;

    /**
     * Returns the layoutIdsRendered array.
     */
    CCStoreConfiguration.prototype.getLayoutIdsRendered = function () {
      return this.layoutIdsRendered;
    }

    /**
     * Pushes all the layouts visited by shopper in the layoutIdsRendered array.
     * Currently we are limiting the array size to 'layoutsRenderedArraySize'
     * so that the layout endpoint request is not too long.
     * @param {Object} pLayout
     *   Object that holds the layout data.
     */
    CCStoreConfiguration.prototype.storeLayoutIdsRendered = function (pLayout) {
      var self = this;
      if (pLayout && pLayout.layout && pLayout.layout != null &&
          self.layoutIdsRendered.indexOf(pLayout.layout) == -1) {
        if (self.layoutIdsRendered.length == self.layoutsRenderedArraySize) {
          self.layoutIdsRendered.shift();
        }
        self.layoutIdsRendered.push(pLayout.layout);
      }
    }

    /**
     * Method to return an instance of library.
     * If the instance is not available, create a new instance
     */
    CCStoreConfiguration.getInstance = function () {
      if (!CCStoreConfiguration.singleInstance) {
        CCStoreConfiguration.singleInstance = new CCStoreConfiguration();
      }
      return CCStoreConfiguration.singleInstance;
    };

    return CCStoreConfiguration;
  }
);

