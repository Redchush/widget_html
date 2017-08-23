/**
 * @fileoverview Defines a view model for product listing searches.
 */
define(
  //-------------------------------------------------------------------
  // PACKAGE NAME
  //-------------------------------------------------------------------
  'viewModels/productListingSearchViewModel',
  
  //-------------------------------------------------------------------
  // DEPENDENCIES
  //-------------------------------------------------------------------
  ['knockout','viewModels/productListingViewModel', 'pubsub',
    'CCi18n', 'ccConstants', 'ccNumber', 'navigation', 'pageLayout/product', 'pageLayout/search'],
  
  function(ko, ProductListingViewModel, pubsub, CCi18n, CCConstants, ccNumber, navigation, Product, SearchViewModel) {
    
    "use strict";
    
    //-------------------------------------------------------
    // View Model
    //-------------------------------------------------------
    /**
     * Deals with performing searches for product listings.
     * 
     * @public
     * @class ProductListingSearchViewModel
     * @extends ProductListingViewModel
     * @param {Object} data - The widget associated with this view model.
     * 
     * @property {boolean} initializationComplete=false Initialization flag.
     * @property {integer} itemsPerRowInDesktopView=4 Number of items per row - desktop view.
     * @property {integer} itemsPerPage=12 Number of items per page.
     * @property {integer} blockSize=12 Number of items per block.
     * @property {Object[]} currentProducts List of current products.
     * @property {Object[]} searchResults List of search results.
     * @property {observable<integer>} recordsPerPage=CCConstants.DEFAULT_SEARCH_RECORDS_PER_PAGE Number of search records per page.
     * @property {Object[]} searchAdjustments={} The search adjustments.
     * @property {Object} breadcrumbs={} Breadcrumbs.
     * @property {Object} navigation={} Navigation entries.
     * @property {integer} pageCount=0 The current number of pages.
     * @property {integer} recordOffSet=0 The current record offset, for paging through results.
     * @property {observableArray<Object>} searchTerms The current search terms.
     * @property {observableArray<Object>} adjustedSearchTerms The adjusted search terms.
     * @property {observableArray<Object>} suggestedSearches The suggested searches.
     * @property {observable<String>} navigationDescriptors The current navigation descriptors.
     * @property {observable<boolean>} display=true Display the search results?
     * @property {integer} totalNumber=0 Total number of search results.
     * @property {integer} pageStartIndex=0 Starting page index.
     * @property {integer} pageEndIndex=0 Ending page index.
     * @property {observable<String>} searchText Current search text.
     * @property {observable<String>} resultsText Search results text.
     * @property {observable<String>} categoryName Category name.
     * @property {observable<String>} noSearchResultsText 'No search results' text;
     * @property {observable<String>} pageLoadedText 'Page loaded' text.
     * @property {integer} itemsPerRowInTabletView=4 Number of items per row in tablet view
     * @property {integer} itemsPerRowInPhoneView=2 Number of items per row in phone view.
     * @property {integer} itemsPerRowInDesktopView=4 Number of items per row in desktop view.
     * @property {integer} itemsPerRowInLargeDesktopView=4 Number of items per row in large desktop view.
     * @property {observable<integer>} itemsPerRow=4 Number of items per row.
     * @property {string} type='ProductListingSearchViewModel' The view model type.
     * @property {observable<boolean>} searchFailed=false Search failed flag.
     * @property {Object} idToSearchIdMap Map of sort property to object property.
     * @property {observable<string>} category Category.
     */
    function ProductListingSearchViewModel(data) {
      var self = this;

      self.initializationComplete = ko.observable(false);
      
      // call super constructor
      ProductListingViewModel.call(this);
      self.widget = data;
      self.initialize();
    
      self.itemsPerRowInDesktopView = 4;
 
      // additional public variables
      self.itemsPerPage = 12;
      self.blockSize = 12;
      // overwrite public method
      self.currentProducts = ko.computed( { read:this.getCurrentProducts, deferEvaluation: true}, this);
    }

    var Search = SearchViewModel.getInstance();
    // setup the inheritance chain    
    var Temp = function(){};
    Temp.prototype = ProductListingViewModel.prototype;
    ProductListingSearchViewModel.prototype = new Temp();
    ProductListingSearchViewModel.prototype.constructor = ProductListingSearchViewModel;
    // Add a reference to the parent's prototype
    ProductListingSearchViewModel.base = ProductListingViewModel.prototype;
    /**
     * Number of items per row in tablet view. Defaults to 4.
     * @type {integer}
     */
    ProductListingSearchViewModel.prototype.itemsPerRowInTabletView = 4;
    /**
     * Number of items per row in phone view. Defaults to 2.
     * @type {integer}
     */
    ProductListingSearchViewModel.prototype.itemsPerRowInPhoneView = 2;
    /**
     * Number of items per row in desktop view. Defaults to 4.
     * @type {integer}
     */
    ProductListingSearchViewModel.prototype.itemsPerRowInDesktopView = 4;
    /**
     * Number of items per row in large desktop view. Defaults to 4.
     * @type {integer}
     */
    ProductListingSearchViewModel.prototype.itemsPerRowInLargeDesktopView = 4;
    /**
     * Number of items per row. Defaults to 4.
     * @type {observable(integer)}
     */
    ProductListingSearchViewModel.prototype.itemsPerRow = ko.observable(4);
    /**
     * View Model Type. Defaults to 'ProductListingSearchViewModel'.
     * @type {string}
     */
    ProductListingSearchViewModel.prototype.type = 'ProductListingSearchViewModel';
    /**
     * Search failed flag. Defaults to false.
     * @type {boolean}
     */
    ProductListingSearchViewModel.prototype.searchFailed = ko.observable(false);
    /**
     * Map of sort property to object property.
     * @type {Object}
     */
    ProductListingSearchViewModel.prototype.idToSearchIdMap = {"displayName": "product.relevance", "listPrice": "sku.activePrice"};
    /**
     * Category.
     * @type {observable(string)}
     */
    ProductListingSearchViewModel.prototype.category = ko.observable();
    
    /**
     * initialize function.
     * Initialize search results and related properties, and subscribe to 
     * SEARCH_RESULTS_UPDATED events.
     */
    ProductListingSearchViewModel.prototype.initialize = function(){
      
      var self = this;
      // summary:
      // Initializes the singleton.
            
      self.searchResults = [];
      self.recordsPerPage = ko.observable(CCConstants.DEFAULT_SEARCH_RECORDS_PER_PAGE);
      self.searchAdjustments ={};
      self.breadcrumbs = {};
      self.navigation = {};
      self.pageCount = 0;
      self.recordOffSet = 0;
      self.searchTerms = ko.observableArray([]);
      self.adjustedSearchTerms = ko.observableArray([]);
      self.suggestedSearches = ko.observableArray([]);
      self.navigationDescriptors = ko.observable();
      self.display = ko.observable(true);
  
      self.totalNumber(0);
      self.pageStartIndex(0);
      self.pageEndIndex(0);
      self.searchText = ko.observable();
      self.resultsText = ko.observable();
      self.categoryName = ko.observable();
      self.noSearchResultsText = ko.observable();
      self.pageLoadedText = ko.observable();
      
      var getSelectedSort = function(pRequestor) {
        var sortOrder = pRequestor.sortDirectiveOrder;
        var sortProp = (pRequestor.sortDirectiveProperty === 'sku.activePrice' ? 'listPrice' : 'default');
        
        for (var i = 0; i < self.sortOptions().length; i += 1) {
          var option = self.sortOptions()[i];
          
          if (option.id === sortProp) {
            if (option.order() === sortOrder) {
              return option; 
            }
          }
        }
      };
      
      /**
       * CategoryName is populated when the category is updated.
       */
      $.Topic(pubsub.topicNames.CATEGORY_CRUMB_UPDATED).subscribe(function(data){
        self.categoryName(data);
      });
      
      /**
       * Handle widget responses when the search result 
       */
      $.Topic(pubsub.topicNames.SEARCH_RESULTS_UPDATED).subscribe(function(obj) {
        self.noSearchResultsText('');      
        if (obj.message === CCConstants.SEARCH_MESSAGE_FAIL) {
          self.searchFailed(true);
          navigation.goTo(self.widget.links().noSearchResults.route, false, true);
          $.Topic(pubsub.topicNames.SEARCH_FAILED_TO_PERFORM).publish();

        } else {
          if (this.totalRecordsFound === 0 && !this.searchAdjustments.suggestedSearches) {
            navigation.goTo(self.widget.links().noSearchResults.route, false, true);
            $.Topic(pubsub.topicNames.SEARCH_TERM).publishWith(
              this.searchAdjustments.originalTerms, [{message: "success"}]);
            self.display(false);
            return;
          } else {
            self.display(true);
          }
          self.totalNumber(this.totalRecordsFound);
          self.searchTerms(this.searchAdjustments.originalTerms);
          if(this.searchAdjustments.adjustedSearches) {
            self.adjustedSearchTerms(this.searchAdjustments.adjustedSearches[self.getSearchTerms()]);
          } else {
            self.adjustedSearchTerms([]);
          }
          if(this.searchAdjustments.suggestedSearches) {
            self.formatSuggestedSearches(this.searchAdjustments.suggestedSearches[self.getSearchTerms()]);
            self.suggestedSearches(this.searchAdjustments.suggestedSearches[self.getSearchTerms()]);           
          } else {
            self.suggestedSearches([]);
          }
          self.searchFailed(false);
          if (this.pagingActionTemplate) {
            self.navigationDescriptors(self.getParameterByName(this.pagingActionTemplate.navigationState, CCConstants.SEARCH_NAV_DESCRIPTORS_KEY));  
          }          
          if (this.isNewSearch === true){
            self.clearOnLoad = true;
            if(self.sortDirectiveProp() !== "displayName") {
              self.selectedSort(self.sortOptions()[0]);  
            }
          } else {
            self.clearOnLoad = false;
            
            if (obj.requestor) {
              var selectedSort = getSelectedSort(obj.requestor);
              
              if (selectedSort) {
                self.selectedSort(selectedSort);  
              }
              else {
                self.selectedSort(self.sortOptions()[0]);
              }
            }
          }
          if (this.searchResults && this.searchResults.length > 0) {
            self.addData(this.searchResults, self.totalNumber(), this.recordOffSet);
          } else {
            self.targetPage = 1;
            if(!this.searchAdjustments.suggestedSearches) {
              // Passing in true for noHistory param (2nd param), we don't want the url to change on 404 pages.
              navigation.goTo(self.widget.links()['404'].route, true, true);
            }
          }
          self.titleText(self.getTitleText(this.searchResults.length));
          self.resultsText(self.getResultsText());
          self.pageLoadedText(self.getPageLoadedText());
        }
      });
      self.initializationComplete(true);
    };
    /**
     * Constructs the message for screen reader when search results page loaded, including the search term.
     */
    ProductListingSearchViewModel.prototype.getPageLoadedText = function() {
      var pageLoadedText = CCi18n.t('ns.common:resources.searchPageLoadedText',
      { results: this.resultsText(),
        searchTerm: this.searchTerms()[0]
      });
      return pageLoadedText;
    };
    
    /**
     *  In desktop mode, returns the products for the current page.
     *  In tablet/phone, returns all the products .
     */
    ProductListingSearchViewModel.prototype.getCurrentProducts = function() {
      
      var pageProducts;

      if(($(window)[0].innerWidth || $(window).width()) > CCConstants.VIEWPORT_TABLET_UPPER_WIDTH) {
        var startPosition, endPosition;
        // Get the products in the current page
        startPosition = (this.currentPage() - 1) * this.itemsPerPage;
        endPosition = startPosition + this.itemsPerPage;

        pageProducts = this.data.slice(startPosition, endPosition);
      }
      else {
        pageProducts = this.data();
      }

      var products = [], product;
      var pageProductsLength = pageProducts.length;
      for (var index = 0; index < pageProductsLength; index++) {
        if (pageProducts[index]) {
          product = new Product(pageProducts[index]);
          if (product.listingSku) {
            product.listingSku.route = product.listingSku.route();
            product.listingSku.images = product.listingSku.images();
          }
          products.push(product);
        }
      }
      $('#typeaheadDropdown').hide();
      this.setFocus();
      return products;    
    };   
    
    
    /**
     * Gets the specified page of results. Will fetch needed results if they
     * are not already loaded.
     * @param {int} pPageNumber the page number of results to get.
     * @private
     */
    ProductListingSearchViewModel.prototype.getPage = function(pPageNumber) {
      var  i;
      this.resultsText("");
      this.clickedPage(pPageNumber);
      this.adjustStartAndEndPageIndex(pPageNumber);
      // Pagination for mobile views
      if(pPageNumber !== this.currentPage() && pPageNumber !== this.targetPage && this.isMobileView()) { 
        $.Topic(pubsub.topicNames.RECORD_PAGINATION_PAGE_CHANGE).publish();
      }
      if(pPageNumber !== this.currentPage()) {
        this.targetPage = pPageNumber;
      }
      if ((this.parameters) || (ProductListingSearchViewModel.prototype.idToSearchIdMap[this.sortDirectiveProp()] !== 'product.relevance')) {
        this.fetchBlock(this.pageStartIndex());
      }
      this.setFocus();
      return;
    };
    
    /**
     * @param {string} url Input URL from which the paramValue for a specific paramName is to be retrieved.
     * @param {string} paramName Name of the parameter for which the value is to be retrieved.
     * @return the value of a parameters from the URL.
     */    
    ProductListingSearchViewModel.prototype.getParameterByName = function(url, paramName) {
      var regex = new RegExp("[\\?&]" + paramName + "=([^&#]*)");
      var results = regex.exec(url);
      return (results === null) ? "" : results[1];
    };
    
    /**
     * Fetch a block of records, starting at a given index.  
     * @param {Object} pStartingIndex The starting index.
     */
    ProductListingSearchViewModel.prototype.fetchBlock = function(pStartingIndex) {
  
      if (this.initializationComplete()) {
        this.recordOffSet = pStartingIndex;
        this.searchText(this.searchTerms().length > 0 ? this.searchTerms()[0]: "");
        this.blockSize = this.recordsPerPage();
        
        if (($(window)[0].innerWidth || $(window).width()) < CCConstants.VIEWPORT_TABLET_UPPER_WIDTH) {
          this.recordOffSet = 0;
          this.blockSize = pStartingIndex + this.recordsPerPage();
        }
        
        this.submitSearch();
        }
    };
    
    /**
     * Submits the search .
     * Builds the search parameter object, and publishes the SEARCH_CREATE event with the search parameters.
     * The search is taken care of by the 'pageLayout/search' view model.
     * @see module:pageLayout/search
     */
    ProductListingSearchViewModel.prototype.submitSearch = function(){
      var searchTerm = '';
      var recSearchType = '';
      if (this.searchText().trim()) {
        searchTerm = CCConstants.PRODUCT_DISPLAYABLE + CCConstants.SEARCH_PROPERTY_SEPARATOR + this.searchText().trim();
      }
      
      if (this.parameters && this.parameters.searchType) {
        recSearchType = this.parameters.searchType;
      }
      var searchParams = { getFromUrlParam : true, 
          newSearch : false,
          recordsPerPage : this.blockSize, 
          recordOffSet : this.recordOffSet,
          recDYMSuggestionKey : this.recDYMSuggestionKey,
          searchType : recSearchType};
      
      if (this.parameters.Ns) {
        var sortValues = decodeURIComponent(this.parameters.Ns).split("|");

        if (sortValues.length === 2) {
          searchParams.sortDirectiveProperty = sortValues[0];
          searchParams.sortDirectiveOrder = sortValues[1] == "1" ? "desc" : "asc";
        }
      }
      else {
        this.sortDirectiveProp('displayName');
      }
      
      if (ProductListingSearchViewModel.prototype.idToSearchIdMap[this.sortDirectiveProp()] !== 'product.relevance') {
        searchParams.sortDirectiveProperty = ProductListingSearchViewModel.prototype.idToSearchIdMap[this.sortDirectiveProp()];
        searchParams.sortDirectiveOrder = (searchParams.sortDirectiveProperty == "product.relevance") ? "none" : this.sortDirectiveOrder();    
      }
                
      $.Topic(pubsub.topicNames.SEARCH_CREATE).publishWith(
        searchParams,
        [{message:"success"}]);
    };
        
    /**
     * Get search results text. Builds a string from the number of the search results, the total
     * number of items etc.  
     * @return {string} The formatted search results string.
     */
    ProductListingSearchViewModel.prototype.getResultsText = function() {
      var startIndex = this.pageStartIndex();
      var searchMessage = '';
      if(this.totalNumber() === 0)
        return ;
      if((this.viewportMode() !== CCConstants.DESKTOP_VIEW) && (this.viewportMode() !== CCConstants.LARGE_DESKTOP_VIEW)) {
        startIndex = 0;  
      }
      
      if ((this.searchFailed) && (! this.searchFailed())) {
       
        // create the search results messages
        var searchTerms = this.getSearchTerms();        
        var resourceKey = 'ns.common:resources.searchresultsText';         
        var endValue = this.pageEndIndex();
        if (this.pageEndIndex() > this.totalNumber()){
          endValue = this.totalNumber();          
        }
        
        if (ccNumber.formatNumber(this.totalNumber())) {
          searchMessage = CCi18n.t(resourceKey, 
            {
              count: ccNumber.formatNumber(this.totalNumber()),
              searchterm: searchTerms,
              startIndex: ccNumber.formatNumber(startIndex + 1), 
              endIndex: ccNumber.formatNumber(endValue)            
            }); 
        }
        
      } else {
        searchMessage = CCi18n.t('ns.common:resources.searchFailedText');
      }
      
      return searchMessage;    
    };
    
    /**
     * The search terms.
     * @return {string} A space separated string containing the search terms.
     */
    ProductListingSearchViewModel.prototype.getSearchTerms = function() {
      var allSearchTerms = '';
      var termCount = 0;
      
      if (this.searchTerms){
        // loop through the search terms
        ko.utils.arrayForEach(this.searchTerms(), function(item){
          if (termCount === 0){
            allSearchTerms = item;
          } else {
            allSearchTerms = allSearchTerms + ' ' +  item;
          }
          termCount ++;
        });
      }

      return allSearchTerms;
    };
    
    /**
     * The search title text. 
     * If the list of search terms is empty, the category name will be returned.
     * If the list of adjusted search times is populated, the adjusted search terms will be
     * returned.
     * If the list of suggested search terms is populated, but there are no results the 
     * localized 'no search results' message will be returned.
     * Finally, if there are search results, the list of search terms will be returned.
     * @return {string} The search title.
     */
    ProductListingSearchViewModel.prototype.getTitleText = function(recordCount) {
      var titleText = "";
      if (this.getSearchTerms() == "") {
        //sets title text for category page
        titleText = this.categoryName();
      } else if(this.adjustedSearchTerms().length > 0) {
        //If there are some adjusted search terms then title text is set to the 
        //adjusted search term and noSearchResultsText is also set
        titleText =  CCi18n.t('ns.common:resources.searchText', {searchTerm : "\""+this.adjustedSearchTerms()[0].adjustedTerms+"\""});
        this.noSearchResultsText (CCi18n.t('ns.common:resources.noSearchResultsText', {searchTerm: "\""+this.getSearchTerms()+"\""})); 
      } else if(this.suggestedSearches().length > 0 && recordCount === 0){
        //If there are some suggested search terms and no results returned for 
        //search term
        this.noSearchResultsText(CCi18n.t('ns.common:resources.noSearchResultsText', {searchTerm: "\""+this.getSearchTerms()+"\""})); 
      } else {
        titleText =  CCi18n.t('ns.common:resources.searchText', {searchTerm : "\""+this.getSearchTerms()+"\""});
      } 
      return titleText;
    };
        
    /**
     * Create a list of pages to display.
     * @private
     * @return {Object[]} The list of page objects.
     */
    ProductListingSearchViewModel.prototype.pagesFunction = function() {
      
      var numberOfPages, numberOfFullPages, numberOfPartialPages,
        i, offset = 1;
      
      if(this.clearOnLoad){
        this.adjustStartAndEndPageIndex(this.pageNumber);
      }
      
      if (this.totalNumber()) {
        // Calculate the number of pages
        numberOfFullPages = 
        (this.totalNumber() - (this.totalNumber() % this.itemsPerPage)) / this.itemsPerPage;
        numberOfPartialPages = (this.totalNumber() % this.itemsPerPage > 0 ? 1 : 0);
        numberOfPages = numberOfFullPages + numberOfPartialPages;
      } else {
        numberOfPages = 0;
      }
      
      // The total number of pages should be calculated only if the current page is search results page
      if( Search.contextData && "/"+navigation.getPath() == Search.contextData.global.links.searchresults.route){
        this.totalNumberOfPages(numberOfPages);
      }
      
      this.adjustPageIndex(this.pageNumber);
      // Create the objects to represent the pages

      var allPages = [];
      for (i = 0; i < numberOfPages; i++){
        
        var newPage = {};
        
        newPage.pageNumber = i + 1;
        // Determine whether or not this page is currently selected
        newPage.selected = (newPage.pageNumber === this.currentPage());
        
        allPages.push(newPage);        
      }
      
      // now return a subset 
      var retPages = [];
      if (this.pageWindowSize >= numberOfPages){
        retPages = allPages.slice(0);
      } else {
        var indexEnd = (this.startIndex + this.pageWindowSize);
        
        if (indexEnd > numberOfPages){
          indexEnd = numberOfPages;
        }
        retPages = allPages.slice(this.startIndex, indexEnd);
 
      }
              
      return retPages;
    };
    
    /**
     * Format suggested searches.
     * Attaches a 'clickSuggestion' function to each search suggestion, which, when called,
     * sets the location hash based on the object's navigation state.
     * 
     * @param {Object[]} initialList The list of search suggestions.
     */  
    ProductListingSearchViewModel.prototype.formatSuggestedSearches = function(initialList) {
      var self = this;
      $.each(initialList, function(index, value) {
        value.clickSuggestion = function() {
          navigation.goTo(CCConstants.SEARCH_RESULTS_HASH + Search.getFilteredNavState(this.navigationState) + "&"
            + CCConstants.SEARCH_TYPE + "=" + CCConstants.SEARCH_TYPE_SIMPLE + "&"
            + CCConstants.PARAMETERS_TYPE + "=" + CCConstants.PARAMETERS_SEARCH_QUERY);  
        };
      });
    };
    
    /**
     * Sets focus to the first element of product listing.
     */
    ProductListingSearchViewModel.prototype.setFocus = function() {
      var id = $("#region-megaMenu").next().attr("id");
      var idGen="#"+id+" :focusable";
      $(idGen).first().focus(); 
    };
    
    return ProductListingSearchViewModel;
  }  
);

