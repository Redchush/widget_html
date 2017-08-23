/**
 * @fileoverview the search module handle the call to the search service and for updating
 * the search result details.
 */

/*global define */
define(
    //-------------------------------------------------------------------
    // PACKAGE NAME
    //-------------------------------------------------------------------
    'pageLayout/search',

    //-------------------------------------------------------------------
    // DEPENDENCIES
    //-------------------------------------------------------------------
    ['knockout', 'pubsub', 'ccLogger', 'viewModels/searchResultDetails', 'ccConstants', 'pageViewTracker', 'navigation', 'ccStoreConfiguration'],

    //-------------------------------------------------------------------
    // MODULE DEFINITION
    //-------------------------------------------------------------------
    function (ko, pubsub, log, searchResDetails, CCConstants, pageViewTracker, navigation, CCStoreConfiguration) {

        'use strict';

        /**
         * Search view model manages layout of results returned from searches. SearchViewModel is a singleton
         * class and you can access it by calling getInstance.
         *
         * @param {Object} pAdapter
         * @param {Object} data
         *
         * @private
         * @class
         * @name SearchViewModel
         * @property {Object} adapter Internal copy of adapter object.
         * @property {boolean} isNewSearch=true Whether this SearchViewModel is performing a new search.
         * @property {boolean} isCategorySearch=false Whether this SearchViewModel is performing a category search.
         * @property {boolean} isRequesting=false Whether there is a search request in progress.
         * @property {observable<Object>} searchLocale Current locale for this search.
         * @property {CCStoreConfiguration} storeConfiguration An instance of the cc-store-configuration containing store-configuration data.
         */
        function SearchViewModel(pAdapter, data) {

            if(SearchViewModel.prototype.singleInstance) {
                throw new Error("Cannot instantiate more than one SearchViewModel, use SearchViewModel.getInstance(pAdapter, data)");
            }

            var self = this;

            self.adapter = pAdapter;
            self.isNewSearch = true;
            self.isCategorySearch = false;
            self.isRequesting = false;
            self.searchLocale = ko.observable();
            self.storeConfiguration = CCStoreConfiguration.getInstance();
            /**
             * Create a search request.
             * Set the flag getFromUrlParam to true if you want the data from the url
             * instead of providing the params.
             *
             * @function
             * @name SearchViewModel#createSearch
             * @param {Object} otherData
             */
            self.createSearch = function (otherData) {
                var search, url, id, inputParams;

                // Set the this value to a variable and use it as required
                var current = this;

                search = ko.observableArray([]);

                // Set this to the search view model in case the data is to be taken
                // from the url params
                if (current.getFromUrlParam) {
                    current = self;
                }
                // Set all the extra data sent to the current
                for (var property in this) {
                    if (this.hasOwnProperty(property)) {
                        current[property] = this[property];
                    }
                }

                inputParams = {};
                if (current.searchText) {
                    inputParams[CCConstants.SEARCH_TERM_KEY] = current.searchText ;
                }
                if (current.recSearcKey){
                    inputParams[CCConstants.SEARCH_NAV_EREC_SEARCHES_KEY] = current.recSearchKey;
                }
                if (current.recSpellCorrectionKey){
                    inputParams[CCConstants.SEARCH_DYM_SPELL_CORRECTION_KEY] = current.recSpellCorrectionKey;
                }
                inputParams[CCConstants.SEARCH_NAV_ERECS_OFFSET] = current.recordOffSet;
                inputParams[CCConstants.SEARCH_REC_PER_PAGE_KEY] = current.recordsPerPage;
                if (typeof current.navigationDescriptors != "undefined" && current.navigationDescriptors != "") {
                    inputParams[CCConstants.SEARCH_NAV_DESCRIPTORS_KEY] = current.navigationDescriptors;
                }
                if (current.suppressResults) {
                    inputParams[CCConstants.SEARCH_SUPPRESS_RESULTS] = true;
                }

                if (current.sortDirectiveProperty) {

                    var sortParam = current.sortDirectiveProperty;
                    if( (current.sortDirectiveOrder !== undefined) &&
                        (current.sortDirectiveOrder === "desc") ) {
                        sortParam = sortParam + "|1";
                    } else {
                        sortParam = sortParam + "|0";
                    }

                    inputParams[CCConstants.SEARCH_SORT_ORDER] = sortParam;
                }

                inputParams[CCConstants.VISITOR_ID] = pageViewTracker.getVisitorId();
                inputParams[CCConstants.VISIT_ID] = pageViewTracker.getVisitId();
                inputParams[CCConstants.SEARCH_LANGUAGE] = self.searchLocale();
                inputParams[CCConstants.SEARCH_TYPE] = current.searchType;

                if (current.newSearch !== undefined){
                    self.isNewSearch = current.newSearch;
                } else {
                    self.isNewSearch = true;
                }

                id = 'guidedsearch';
                if (!self.isRequesting) {
                    self.isRequesting = true;

                    if (current.searchText !== undefined){
                        self.isCategorySearch = false;
                    } else {
                        self.isCategorySearch = true;
                    }
                    self.adapter.loadJSON('search', id, inputParams, self.searchSuccess, self.searchError);
                }
            };

            /**
             * Creates a search and adds the search data.
             * This is used when an array of data is sent from the parameters.
             *
             * @function
             * @name SearchViewModel#createSearchAndAddData
             * @param {Object} otherData
             */
            self.createSearchAndAddData = function(otherData) {
                // Do not search if the type is undefined or any other type that search.
                if (this.parameters.type != CCConstants.PARAMETERS_SEARCH_QUERY) {
                    return;
                }
                // Adding check for search term parameter for unparameterized guided search
                if (this.parameters.Ntt != null && this.parameters.Ntt != undefined) {
                    self.searchText = decodeURIComponent(this.parameters.Ntt);
                } else {
                    self.searchText = "";
                }
                // Adding check for search property key for guided search
                if (this.parameters.Nr != null && this.parameters.Nr != undefined) {
                    self.recSearchKey = decodeURIComponent(this.parameters.Nr);
                }
                // Update the search key to Ntk value for guided search on category results results
                if (this.parameters.Ntt === '1' && this.parameters.Ntk != null && this.parameters.Ntk != undefined) {
                    self.recSearchKey = decodeURIComponent(this.parameters.Ntk);
                }
                if (self.recSearchKey === undefined) {
                    self.recSearchKey = "";
                }
                if (this.parameters.Nty) {
                    self.recDYMSuggestionKey = decodeURIComponent(this.parameters.Nty);
                } else {
                    self.recDYMSuggestionKey = "";
                }
                // Adding check for the Navigation Descriptors for guided search
                if (this.parameters.N !== null && this.parameters.N !== undefined) {
                    self.navigationDescriptors = decodeURIComponent(this.parameters.N).replace(/\+/g, " ");
                } else {
                    self.navigationDescriptors = "";
                }
                // Adding extra checks for page number
                if (!(this.parameters.page) || (typeof parseInt(this.parameters.page) != "number")) {
                    self.pageNumber = 1;
                } else {
                    self.pageNumber = parseInt(this.parameters.page);
                }
                // Adding simple checks to be sure that the URL is not changed in any way
                if (typeof parseInt(this.parameters.No) != "number") {
                    self.recordOffSet = 0 + (self.pageNumber - 1) * CCConstants.DEFAULT_SEARCH_RECORDS_PER_PAGE;
                } else {
                    self.recordOffSet = parseInt(this.parameters.No) + (self.pageNumber - 1) * CCConstants.DEFAULT_SEARCH_RECORDS_PER_PAGE;
                }
                if (typeof parseInt(this.parameters.Nrpp) != "number") {
                    self.recordsPerPage = CCConstants.DEFAULT_SEARCH_RECORDS_PER_PAGE;
                } else {
                    self.recordsPerPage = parseInt(this.parameters.Nrpp);
                }

                if (this.parameters.Ns) {
                    var sortValues = decodeURIComponent(this.parameters.Ns).split("|");

                    if (sortValues.length === 2) {
                        self.sortDirectiveProperty = sortValues[0];
                        self.sortDirectiveOrder = sortValues[1] == "1" ? "desc" : "asc";
                    }
                }
                else {
                    self.sortDirectiveProperty = "";
                    self.sortDirectiveOrder = "";
                }
            };

            /**
             * Search request success callback function which publishes a pubsub event with the search results.
             *
             * @private
             * @function
             * @name SearchViewModel#searchSuccess
             */
            self.searchSuccess = function(result){
                if(result){
                    //If search result json object contains key as "endeca:redirect"  then we will redirect to url specified in the redirect keyword configuration
                    //In this case search results page will not be shown even if there are any products available with the search term.
                    if(result['endeca:redirect'] && result['endeca:redirect'].link && result['endeca:redirect'].link.url){
                        var redirectUrl= result['endeca:redirect'].link.url;
                        //If redirectUrl starts with / then it might be internal site
                        if(redirectUrl.charAt(0) !== '/'){
                            //It will redirect the user to a configured Redirect URL
                            window.location.replace(redirectUrl);
                        }else{
                            //It will redirect to the uri with the current hostname
                            navigation.goTo(redirectUrl, false, true);
                        }
                        self.isRequesting = false;
                        return;
                    }
                }
                var messageDetails = [{
                    message: CCConstants.SEARCH_MESSAGE_SUCCESS,
                    requestor: self
                }];

                if (result['@error']) {
                    log.error("search error returned :" + result['@error']);

                    messageDetails = [{message: CCConstants.SEARCH_MESSAGE_FAIL}];
                } else {
                    searchResDetails.update(result);
                    searchResDetails.isNewSearch = self.isNewSearch;
                }

                // Publish
                if (self.isCategorySearch) {
                    $.Topic(pubsub.topicNames.SEARCH_RESULTS_FOR_CATEGORY_UPDATED).publishWith(searchResDetails, messageDetails);
                }
                else {
                    $.Topic(pubsub.topicNames.SEARCH_RESULTS_UPDATED).publishWith( searchResDetails,messageDetails);
                }
                self.isRequesting = false;
            };

            /**
             * Search request failure callback function. This publishes a search failed pubsub event.
             *
             * @private
             * @function
             * @name SearchViewModel#searchError
             */
            self.searchError = function(result){

                // Publish
                if (self.isCategorySearch) {
                    $.Topic(pubsub.topicNames.SEARCH_FAILED_TO_PERFORM).publish();
                }
                else {
                    var messageDetails = [{message: CCConstants.SEARCH_MESSAGE_FAIL}];
                    $.Topic(pubsub.topicNames.SEARCH_RESULTS_UPDATED).publishWith(result,messageDetails);
                }
                self.isRequesting = false;
            };

            /**
             * Create a typeahead search request.
             *
             * @function
             * @name SearchViewModel#typeaheadSearch
             * @param {Object} otherData
             */
            self.typeaheadSearch = function (otherData) {
                var id, inputParams;
                this.searchText = this.searchText.trim();
                var visitorId = pageViewTracker.getVisitorId();
                var visitId = pageViewTracker.getVisitId();

                inputParams = {};

                inputParams[CCConstants.SEARCH_TERM_KEY] =  this.searchText;
                inputParams[CCConstants.SEARCH_NAV_EREC_SEARCHES_KEY] = CCConstants.TYPEAHEAD_SEARCH_INTERFACE;
                inputParams[CCConstants.SEARCH_NAV_ERECS_OFFSET] = this.recordOffSet;
                inputParams[CCConstants.SEARCH_REC_PER_PAGE_KEY] = this.recordsPerPage;
                inputParams[CCConstants.VISITOR_ID] = visitorId;
                inputParams[CCConstants.VISIT_ID] = visitId;
                inputParams[CCConstants.SEARCH_TYPE] = CCConstants.SEARCH_TYPE_TYPEAHEAD;
                inputParams[CCConstants.SEARCH_LANGUAGE] = self.searchLocale();
                inputParams[CCConstants.ASSEMBLER_PATH_QUERY_PARAM] = CCConstants.ASSEMBLER_DEFAULT_TYPEAHEAD_PATH;
                inputParams[CCConstants.ASSEMBLER_REDIRECTS_QUERY_PARAM] = "yes";
                inputParams[CCConstants.ASSEMBLER_SITE_QUERY_PARAM] = "default";

                if (this.newSearch !== undefined){
                    self.isNewSearch = this.newSearch;
                }

                id = 'assembler';
                self.adapter.loadJSON('assembler', id, inputParams, self.typeaheadSuccess, self.typeaheadError);
            };

            /**
             * Typeahead search request success callback function which publishes a pubsub event with the search results.
             *
             * @private
             * @function
             * @name SearchViewModel#typeaheadSuccess
             */
            self.typeaheadSuccess = function(result) {

                var messageDetails = [{message: CCConstants.SEARCH_MESSAGE_SUCCESS}];
                if (result['@error']) {
                    log.error("search error returned :" + result['@error']);

                    messageDetails = [{message: CCConstants.SEARCH_MESSAGE_FAIL}];
                }

                // don't update result model or both result lists are updated when on
                // search results page. Just pass through what's needed
                var searchResults = [];

                if((result.resultsList) && (result.resultsList.records)) {
                    var typeaheadResults = [];
                    searchResults = result.resultsList.records;
                    searchResDetails.update(result);
                    typeaheadResults.push(searchResDetails.searchResults);
                    typeaheadResults.push(searchResults);
                }

                $.Topic(pubsub.topicNames.SEARCH_TYPEAHEAD_UPDATED).publishWith(typeaheadResults,[{message:"success"}]);

            };

            /**
             * Typeahead search request failure callback function which publishes a pubsub failure event.
             *
             * @private
             * @function
             * @name SearchViewModel#typeaheadError
             */
            self.typeaheadError = function(result){

                var messageDetails = [{message: CCConstants.SEARCH_MESSAGE_FAIL}];

                var searchResults = [];
                $.Topic(pubsub.topicNames.SEARCH_TYPEAHEAD_UPDATED).publishWith(searchResults,[{message:"success"}]);

            };

            // Subscribe to the search create pubsub.topicNames.SEARCH_CREATE_CATEGORY_LISTING
            $.Topic(pubsub.topicNames.SEARCH_CREATE_CATEGORY_LISTING).subscribe(self.createSearch);
            // Subscribe to the search create pubsub.topicNames.SEARCH_CREATE
            $.Topic(pubsub.topicNames.SEARCH_CREATE).subscribe(self.createSearch);

            // Subscribe to the page parameters pubsub.topicNames.PAGE_PARAMETERS
            // Please note that the SEARCH_CREATE is kept intact since it is also used
            // in searchTypeAhead
            $.Topic(pubsub.topicNames.PAGE_PARAMETERS).subscribe(self.createSearchAndAddData);

            // Subscribe to the search create pubsub.topicNames.SEARCH_TYPEAHEAD
            $.Topic(pubsub.topicNames.SEARCH_TYPEAHEAD).subscribe(self.typeaheadSearch);

            return(self);
        }

        /**
         * setContext
         * Set the context data from the SearchDataInitializer
         *
         * @function
         * @name SearchViewModel#setContext
         * @param {Object} pContext
         */
        SearchViewModel.prototype.setContext = function(pContext) {
            var self = this;
            if (pContext.global.locale) {
                self.searchLocale(pContext.global.locale);
            }
            self.contextData = pContext;
        };

        /**
         * Return the singleton instance of SearchViewModel.
         *
         * @function
         * @name SearchViewModel#getInstance
         * @param {Object} pAdapter
         * @param {Object} data
         * @param {Object} pParams Optional params object which will be used as the context for the search.
         */
        SearchViewModel.getInstance = function(pAdapter, data, pParams) {
            if(!SearchViewModel.prototype.singleInstance) {
                SearchViewModel.prototype.singleInstance = new SearchViewModel(pAdapter, data);
            }
            if (pParams) {
                SearchViewModel.prototype.singleInstance.setContext(pParams);
            }

            return SearchViewModel.prototype.singleInstance;
        };

        /**
         * Get the navigation parameters excluding the additional search params.
         *
         * @function
         * @name SearchViewModel#getFilteredNavState
         * @returns {string} The navigation state as a URI param string.
         */
        SearchViewModel.prototype.getFilteredNavState = function(navivationString) {
            var filteredArray = [];
            var addnlSearchParams = [CCConstants.VISITOR_ID, CCConstants.VISIT_ID, CCConstants.SEARCH_LANGUAGE, CCConstants.SEARCH_TYPE];
            var params = navivationString.split("&");
            for (var i = 0; i < params.length; i++) {
                var tempParam = params[i].split("=");
                if (addnlSearchParams.indexOf(tempParam[0]) == -1){
                    filteredArray.push(params[i]);
                }
            }
            return filteredArray.join("&");
        };

        return SearchViewModel;

    });

