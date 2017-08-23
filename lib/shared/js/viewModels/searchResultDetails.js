/**
 * @fileoverview searchResultsDetails holds the information returned from a search. 
 * 
 */
define(
  //-------------------------------------------------------------------
  // PACKAGE NAME
  //-------------------------------------------------------------------
  'viewModels/searchResultDetails',
  
  //-------------------------------------------------------------------
  // DEPENDENCIES
  //-------------------------------------------------------------------
  ['knockout', 'ccConstants', 'ccLogger'],
    
  //-------------------------------------------------------------------
  // MODULE DEFINITION
  //-------------------------------------------------------------------
  function (ko, CCConstants, log) {
  
    "use strict";
    var mInstance = null;
    
    
    function SearchResultDetails(){
      
      if(mInstance !== null){
          throw new Error("Cannot instantiate more than one SearchResultDetails, use SearchResultDetails.getInstance()");
      } 
      
      this.initialize();
    }
    
    
    SearchResultDetails.prototype = {
      
             
      initialize: function(){
        // summary:
        // Initializes the singleton.
        
        this.searchResults = [];
        this.totalRecordsFound = 0;
        this.recordsPerPage = CCConstants.DEFAULT_SEARCH_RECORDS_PER_PAGE;
        this.searchAdjustments ={};
        this.breadcrumbs = {};
        this.navigation = {};
        this.pageCount = 0;
        this.recordOffSet = 0;
          
      }, 
      
      // summary: update method, updates the value from the result object
      update: function(result){
        var originalTerms = [];
        var originalSearchTerms = [];
        
        if(result != null){
          
          if (result["@error"]){
            
            log.error("An error occurred while searching -" + result["@error"]);
            
            return;
          }
          
          if (result.resultsList){
            var tmpSearchResults = ("records" in result.resultsList) ? result.resultsList.records : [];
            
            this.searchResults = this.formatSearchResults(tmpSearchResults);
            this.totalRecordsFound = ("totalNumRecs" in result.resultsList) ? result.resultsList.totalNumRecs : 0;
            this.recordsPerPage = ("totalNumRecs" in result.resultsList) ? result.resultsList.recsPerPage : CCConstants.DEFAULT_SEARCH_RECORDS_PER_PAGE;
            this.recordOffSet = ("firstRecNum" in result.resultsList) ? (result.resultsList.firstRecNum -1) : 0;
            
            var additionalPage = (this.totalRecordsFound % this.recordsPerPage) > 0 ? 1 : 0;
            this.pageCount = (this.totalRecordsFound > 0) ? (Math.floor(this.totalRecordsFound / this.recordsPerPage) +  additionalPage ): 0;
            if ("pagingActionTemplate" in result.resultsList) {
              this.pagingActionTemplate = result.resultsList.pagingActionTemplate;
            }
          }
          
          if(result.searchAdjustments) {
            // Need to remove wildcard from search terms
            if(result.searchAdjustments.originalTerms) {
              originalTerms = result.searchAdjustments.originalTerms;
            }
            
            if (typeof String.prototype.endsWith !== 'function') {
              String.prototype.endsWith = function(suffix) {
                return this.indexOf(suffix, this.length - suffix.length) !== -1;
              };
            }
          
            // Remove product displayable flag from search terms
            if (typeof originalTerms[0] != "undefined" && originalTerms[0] == CCConstants.PRODUCT_DISPLAYABLE) {
              originalTerms.splice(0,1);
            }
            originalSearchTerms = originalTerms.slice();
            
            $.each(originalTerms, function(index, value) {   
              if(value.endsWith(CCConstants.SEARCH_WILDCARD)) {
                originalTerms[index] = value.substr(0, (value.length-1));
              }         
            });
          
            result.searchAdjustments.originalTerms = originalTerms;
            result.searchAdjustments.originalSearchTerms = originalSearchTerms;
          }
          this.searchAdjustments = result.searchAdjustments;
          this.breadcrumbs = result.breadcrumbs;
          if (result.navigation) {
            this.navigation = result.navigation.navigation;
          }
        }
          
      }, 
      
      /**
       * Formats the search records  
       * @param {Object} records - the search records 
       */
      formatSearchResults: function(records){
        var formattedRecs = []; 
        for (var i = 0; i < records.length; i++){
          var formattedRec = this.formatRecord(records[i].records[0]);
          formattedRec.childSKUs = this.formatChildSkus(records[i].records);
          //List of attributes (on top level records) to exclude while adding response data to view model
          var exclusionAttributeList = [
            "sku.maxActivePrice", "sku.minActivePrice", "product.repositoryId"
          ];

          // Adding new product attributes (added on top level records) to the formattedRec
          for (var recordKey in records[i].attributes) {
            if (exclusionAttributeList.indexOf(recordKey) == -1) {
              formattedRec[recordKey] = records[i].attributes[recordKey];
            }
          }
          if (records[i].attributes["sku.maxActivePrice"] && records[i].attributes["sku.maxActivePrice"][0]) {
            formattedRec.maxActivePrice = records[i].attributes["sku.maxActivePrice"][0];
          }
          if (records[i].attributes["sku.minActivePrice"] && records[i].attributes["sku.minActivePrice"][0]) {
            formattedRec.minActivePrice = records[i].attributes["sku.minActivePrice"][0];
          }
          formattedRec.originalRecord = records[i];
          formattedRecs.push(formattedRec);
        }
        
        return formattedRecs;
      },
      
      /**
       * Formats the search records child skus  
       * @param {Object} childSKUs - the search records childSKUs
       */
      formatChildSkus: function(childSKUs){
        var childSkusLength = childSKUs.length; 
        var formattedChildSkus = [];
        for (var i = 0; i < childSkusLength; i++){
         formattedChildSkus[i] = {
            "salePrice": (childSKUs[i].attributes["sku.salePrice"]) ? childSKUs[i].attributes["sku.salePrice"][0] : null,
            "listPrice": (childSKUs[i].attributes["sku.listPrice"]) ? childSKUs[i].attributes["sku.listPrice"][0] : null,
            "repositoryId": childSKUs[i].attributes["sku.repositoryId"],
            "largeImage": {
              "url": (childSKUs[i].attributes["sku.listingLargeImageURL"]) ? childSKUs[i].attributes["sku.listingLargeImageURL"][0] : ""
            }, 
            "smallImage": {
              "url": (childSKUs[i].attributes["sku.listingSmallImageURL"]) ? childSKUs[i].attributes["sku.listingSmallImageURL"][0] : ""
            },
            "primaryThumbImageURL":  (childSKUs[i].attributes["sku.listingThumbImageURL"]) ? childSKUs[i].attributes["sku.listingThumbImageURL"][0] : ""         
          };
        }
        
        return formattedChildSkus;
      },
      
      
      /**
       * Formats a search record 
       * @param {Object} record - the record to format.
       */
      formatRecord: function(record){
        var formattedRec = {};
        var variantName, variantValue;

        //List of attributes to exclude while adding response data to view model
        var exclusionAttributeList = [
          "product.repositoryId", "product.displayName", "product.shippingSurcharge", "product.listPrice", "product.salePrice",
          "product.description", "sku.styleProperty", "product.avgCustRating", "product.primaryImageAltText", "product.primaryImageTitle",
          "product.primaryLargeImageURL", "product.primarySmallImageURL", "product.primaryMediumImageURL", "product.primaryFullImageURL",
          "product.primaryThumbImageURL", "sku.listingFullImageURL"
        ];

        // Adding new product attributes to the formattedRec
        for (var recordKey in record.attributes) {
          if (exclusionAttributeList.indexOf(recordKey) == -1) {
            formattedRec[recordKey] = record.attributes[recordKey];
          }
        }
        if (record.attributes["product.repositoryId"]) {
          formattedRec.id = record.attributes["product.repositoryId"];
          formattedRec.repositoryId = record.attributes["product.repositoryId"];
        } else {
          formattedRec.id = "";
          formattedRec.repositoryId = "";
        }
        if (record.attributes["product.displayName"]) {
          formattedRec.displayName = record.attributes["product.displayName"][0];
        }
        // If displayName doesn't exist
        else {
          formattedRec.displayName = "";
        }
        
        if (record.attributes["product.shippingSurcharge"]) {
          formattedRec.shippingSurcharge = Number(record.attributes["product.shippingSurcharge"]);
        } else {
          formattedRec.shippingSurcharge = 0;
        }
        formattedRec.listPrice  = Number(record.attributes["product.listPrice"]);
        formattedRec.salePrice = Number(record.attributes["product.salePrice"]);
        if (record.attributes["product.description"]) {
          if (record.attributes["product.description"] instanceof Array && record.attributes["product.description"].length > 0) {
            formattedRec.description = record.attributes["product.description"][0];
            formattedRec.longDescription = record.attributes["product.description"][0];
          } else {
            formattedRec.description = record.attributes["product.description"];
            formattedRec.longDescription = record.attributes["product.description"];
          }
        } else {
          formattedRec.description = "";
          formattedRec.longDescription = "";
        }
        
        formattedRec.route = (record.attributes["product.route"] && record.attributes["product.route"][0]) ? record.attributes["product.route"][0] : "";
        
        //Extract listing variant name and value from the endeca result records
        if (Array.isArray(record.attributes["sku.styleProperty"])) {
          variantName = record.attributes["sku.styleProperty"][0];
          if (variantName) {
            if (Array.isArray(record.attributes["sku."+variantName])) {
              variantValue = record.attributes["sku."+variantName][0];
            }
            if (variantValue) {
              formattedRec.listingSku = {};
              formattedRec.listingSku.images = [];
              formattedRec.listingSku.route =  formattedRec.route
                                   + "?variantName=" + variantName
                                   + "&variantValue=" + variantValue;
            }
          }
        }

        if (record.attributes["product.avgCustRating"]) {
          formattedRec.avgCustRating = record.attributes["product.avgCustRating"];
        }
        if (record.attributes["product.primaryImageAltText"]) {
          formattedRec.primaryImageAltText = record.attributes["product.primaryImageAltText"];
        }
        if (record.attributes["product.primaryImageTitle"]) {
          formattedRec.primaryImageTitle = record.attributes["product.primaryImageTitle"];
        }
        
        formattedRec["primaryLargeImageURL"] = (record.attributes["product.primaryLargeImageURL"] && record.attributes["product.primaryLargeImageURL"][0]) ? record.attributes["product.primaryLargeImageURL"][0] : "";
        
        formattedRec["primarySmallImageURL"]= (record.attributes["product.primarySmallImageURL"] && record.attributes["product.primarySmallImageURL"][0]) ? record.attributes["product.primarySmallImageURL"][0] : "";
        
        formattedRec["primaryThumbImageURL"] = (record.attributes["product.primaryThumbImageURL"] && record.attributes["product.primaryThumbImageURL"][0]) ? record.attributes["product.primaryThumbImageURL"][0] : "";
        formattedRec["primaryMediumImageURL"] = (record.attributes["product.primaryMediumImageURL"] && record.attributes["product.primaryMediumImageURL"][0]) ? record.attributes["product.primaryMediumImageURL"][0] : "";
        formattedRec["primaryFullImageURL"] = (record.attributes["product.primaryFullImageURL"] && record.attributes["product.primaryFullImageURL"][0]) ? record.attributes["product.primaryFullImageURL"][0] : "";
        
        if (record.attributes["sku.listingFullImageURL"] && record.attributes["sku.listingFullImageURL"][0]) {
          var tempMetaData = {};
          tempMetaData.metadata = {};
		  if(!formattedRec.listingSku) {
        	formattedRec.listingSku = {};
        	formattedRec.listingSku.images = [];
        	formattedRec.listingSku.route =  formattedRec.route;
          }
          formattedRec.listingSku.images.push(tempMetaData);
          if (record.attributes["sku.listingLargeImageURL"]) {
            formattedRec.listingSku["primaryLargeImageURL"] = record.attributes["sku.listingLargeImageURL"][0];
          }
          if (record.attributes["sku.listingSmallImageURL"]) {
            formattedRec.listingSku["primarySmallImageURL"]= record.attributes["sku.listingSmallImageURL"][0];
          }
          if (record.attributes["sku.listingThumbImageURL"]) {
            formattedRec.listingSku["primaryThumbImageURL"] = record.attributes["sku.listingThumbImageURL"][0];
          }
          if (record.attributes["sku.listingMediumImageURL"]) {
            formattedRec.listingSku["primaryMediumImageURL"] = record.attributes["sku.listingMediumImageURL"][0];
          }
          if (record.attributes["sku.listingFullImageURL"]) {
            formattedRec.listingSku["primaryFullImageURL"] = record.attributes["sku.listingFullImageURL"][0];
          }
        }
       
        return formattedRec;
      }
    };
    
    SearchResultDetails.getInstance = function(){
        // summary:
        //      Gets an instance of the singleton. It is better to use 
        if(mInstance === null){
            mInstance = new SearchResultDetails();
        }
        return mInstance;
    };
 
    return SearchResultDetails.getInstance();
});

