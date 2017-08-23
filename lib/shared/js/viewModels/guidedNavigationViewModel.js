/**
 * @fileoverview Guided Navigation View Model. 
 * 
 */
define(
  //-------------------------------------------------------------------
  // PACKAGE NAME
  //-------------------------------------------------------------------
  'viewModels/guidedNavigationViewModel',
  
  //-------------------------------------------------------------------
  // DEPENDENCIES
  //-------------------------------------------------------------------
  ['knockout', 'pubsub',
    'ccConstants', 'navigation', 'jquery', 'spinner', 'CCi18n', 'pageLayout/search', 'storageApi', 'pageLayout/site'],
    
  //-------------------------------------------------------------------
  // MODULE DEFINITION
  //-------------------------------------------------------------------  
  function(ko, pubsub, CCConstants, navigation, $, spinner, CCi18n, SearchViewModel, storageApi, SiteViewModel) {
    
    "use strict";
    
    //-------------------------------------------------------
    // Class definition & member variables
    //-------------------------------------------------------
    /**
     * Creates a Guided Navigation view model.
     * @private
     * @class GuidedNavigationViewModel
     * @param {integer} maxDimensionCount The maximum number of dimensions.
     * @param {integer} maxRefinementCount The maximum number of refinements.
     * @param {string} locale The locale.
     * @param {string} searchResultsHash=CCConstants.SEARCH_RESULTS_HASH An optional configurable URL root for search results page.
     *                          
     * @property {String} categoryDimension=CCConstants.SEARCH_RESULTS_HASH Category dimension. 
     * @property {String} priceRangeDimension=CCConstants.GUIDED_NAVIGATION_PRICERANGE Price range dimension. 
     * @property {observable<boolean>} displayWidget=true Display the widget? 
     * @property {integer} maxDimensionCount The maximum number of dimensions.
     * @property {integer} maxRefinementCount The maximum number of refinements.
     * @property {String} searchResultsHash=CCConstants.SEARCH_RESULTS_HASH An optional configurable URL root for search results page.
     * @property {observable} dimensions A collapsible list of dimensions.
     * @property {observableArray} allRefinementCrumbs Search refinement breadcrumbs.
     * @property {string} searchText The current search text.
     * @property {string} categoryHref Category href.
     * @property {string} categoryName Category name.
     * @property {string} categoryDimensionId Category dimension ID.
     * @property {string} categoryRepositoryId Category repository ID.
     */    
    function GuidedNavigationViewModel(maxDimensionCount, maxRefinementCount, locale, searchResultsHash) {
      var self = this;
      self.displayWidget = ko.observable(true);
      self.maxDimensionCount = maxDimensionCount;
      self.maxRefinementCount = maxRefinementCount;
      self.dimensions = self.collapsibleList([], self.maxDimensionCount);
      self.allRefinementCrumbs = ko.observableArray();
      self.searchText = ko.observable('');
      self.categoryHref = ko.observable('');
      self.categoryName = ko.observable('');
      self.categoryDimensionId = ko.observable('');
      self.categoryRepositoryId = ko.observable('');
      self.priceRangeDimension = CCConstants.GUIDED_NAVIGATION_PRICERANGE;
      self.categoryDimension = CCConstants.GUIDED_NAVIGATION_CATEGORY;
      GuidedNavigationViewModel.prototype.locale(locale);
      GuidedNavigationViewModel.prototype.searchResultsHash = searchResultsHash ? searchResultsHash : CCConstants.SEARCH_RESULTS_HASH;
      self.initialize();
      
      /**
       * Remove a refinement breadcrumb.
       * @function GuidedNavigationViewModel#removeRefinement
       * @param {string} refinement The refinement to be removed.
       */
      self.removeRefinement = function(refinement) {
        GuidedNavigationViewModel.prototype.createSpinner ();
        if (self.searchText() === "" && refinement.dimensionName === CCConstants.GUIDED_NAVIGATION_CATEGORY) {
          var navigationState = refinement.removeAction ? refinement.removeAction.navigationState : undefined;
          var navigationArray = navigationState ? navigationState.split("&") : undefined;
          var found = false;
          // redirects to the parent category when its category/sub-category refinement is removed by appending generated id.
          for (var i=0;i < navigationArray.length;i++) {
            if (navigationArray[i].indexOf("N=") !== -1) {
              var id = navigationArray[i].substring(navigationArray[i].indexOf("N=") + 2);
              var generatedId = self.categoryDimensionId()+"+"+id;
              navigationState = navigationState.replace(id, generatedId);
              found = true;
            }
          }
          // No other refinement crumbs are present.
          if (found == false) {
            navigation.goTo(self.categoryHref());
          }
          else {
            navigation.goTo(self.searchResultsHash + navigationState + "&" 
                    + CCConstants.SEARCH_TYPE + "=" + CCConstants.SEARCH_TYPE_GUIDED + "&"
                    + CCConstants.PARAMETERS_TYPE + "=" + CCConstants.PARAMETERS_SEARCH_QUERY);
          }
        }
        else {
          navigation.goTo(self.searchResultsHash + refinement.removeAction.navigationState + "&" 
                  + CCConstants.SEARCH_TYPE + "=" + CCConstants.SEARCH_TYPE_GUIDED + "&"
                  + CCConstants.PARAMETERS_TYPE + "=" + CCConstants.PARAMETERS_SEARCH_QUERY);
        }
      };
      
      /**
       * Remove all refinements.
       * @function GuidedNavigationViewModel#clearAllRefinements
       */
      self.clearAllRefinements = function() {
        GuidedNavigationViewModel.prototype.createSpinner ();
        if (self.searchText().trim()) {
          navigation.goTo(self.searchResultsHash + "?"
            + CCConstants.SEARCH_TERM_KEY + "="
            + encodeURIComponent(self.searchText().trim()) + "&"
            + CCConstants.SEARCH_DYM_SPELL_CORRECTION_KEY + "="
            + encodeURIComponent(CCConstants.DYM_ENABLED) + "&"
            + CCConstants.SEARCH_NAV_ERECS_OFFSET + "=0&"
            + CCConstants.SEARCH_REC_PER_PAGE_KEY + "="
            + CCConstants.DEFAULT_SEARCH_RECORDS_PER_PAGE + "&" 
            + CCConstants.SEARCH_TYPE + "=" + CCConstants.SEARCH_TYPE_SIMPLE + "&"
            + CCConstants.PARAMETERS_TYPE + "=" + CCConstants.PARAMETERS_SEARCH_QUERY);
          }
        else { 
          navigation.goTo(self.categoryHref());
        }
      };
      
      /**
       * Check for range refinement.
       * @function GuidedNavigationViewModel#checkForRange
       */
      self.checkForRange = function(value) {
        var a = "dimval.match_type";
          if (value && value.properties && value.properties[a] === 'range') {
            return true;
          }
          return false;
      };
      
      /**
       * Check if the range is an unbounded range.
       * @function GuidedNavigationViewModel#checkIfUnboundRange
       */
      self.checkIfUnboundRange = function(value) {
        var dGraphSpec = "DGraph.Spec";
        if (value && value.properties && value.properties[dGraphSpec].indexOf('-unbounded') != -1) {
          return true;
        }
        return false;
      };
      
      /**
       * Get the lower bound value of the range.
       * @function GuidedNavigationViewModel#getLowerBound
       */
      self.getLowerBound = function(value) {
        var lowerBoundKey = "dimval.prop.lowerBound";
        if (value && value.properties && value.properties[lowerBoundKey]) {
          return value.properties[lowerBoundKey];
        }
        return null;
      };
      
      /**
       * Get the upper bound value of the range.
       * @function GuidedNavigationViewModel#getUpperBound
       */
      self.getUpperBound = function(value) {
        var upperBoundKey = "dimval.prop.upperBound";
        if (value && value.properties && value.properties[upperBoundKey]) {
          return this.correctUpperBound(value.properties[upperBoundKey]);
        }
        return null;
      };
      
      /**
       * Correct the upper bound value of the range.
       * @function GuidedNavigationViewModel#correctUpperBound
       */
      self.correctUpperBound = function(value) {
        var subtractionAmount = 1;
        for (var i = 0; i < SiteViewModel.getInstance().selectedPriceListGroup().currency.fractionalDigits; i++) { 
          subtractionAmount *= 0.1;
        }
        subtractionAmount = subtractionAmount.toFixed(SiteViewModel.getInstance().selectedPriceListGroup().currency.fractionalDigits);
        return value - subtractionAmount;
      };
      
      /**
       * Get the text from the range if the range is an unbound range.
       * @function GuidedNavigationViewModel#correctUpperBound
       */
      self.getUpperBoundText = function(value) {
        if (value.label) {
          return value.label.substr(value.label.indexOf(' '));
        }
        return null;
      };
      
    }
    
    /**
     * Creates a Dimension.
     * 
     * @private
     * @class Dimension
     * @memberof GuidedNavigationViewModel
     * @param {Object} refinementMenu Provides the details of the dimension.
     * @param {integer} maxRefinementCount The maximum refinement count.
     * @property {string} dimensionName Name of the dimension.
     * @property {observable<boolean>} isExpanded=false Is the dimension expanded?
     * @property {observable<boolean>} shouldDimensionExpand=false Should the dimension expand?
     * @property {string} displayName Display name associated with the current dimension.
     * @property {Object[]} refinements The refinements for the dimension.
     * @property {Object[]} ancestors The list of ancestors.
     */
    function Dimension(refinementMenu, maxRefinementCount) {
      var self = this;
      self.dimensionName = refinementMenu.dimensionName;
      self.isExpanded = ko.observable(false);
      self.shouldDimensionExpand = ko.observable(false);
      self.ariaLabelText = ko.observable('expandText');
      self.displayName = refinementMenu.displayName;
      if (self.displayName === "Category") {
        self.displayName = CCi18n.t('ns.common:resources.categoryText');
      } else if (self.displayName === "Price Range") {
        self.displayName = CCi18n.t('ns.common:resources.priceRangeText');
      }
      self.refinements = GuidedNavigationViewModel.prototype.refinementList(refinementMenu.refinements, maxRefinementCount, self.dimensionName, refinementMenu.multiSelect);
      self.ancestors = refinementMenu.ancestors;
      if (refinementMenu.shouldMultiSelectDimensionExpand) {
        self.shouldDimensionExpand(true);
        self.isExpanded(true);
      }
    }
    
    var Search = SearchViewModel.getInstance();
    GuidedNavigationViewModel.prototype.isSpinnerStarted = ko.observable('false');
    GuidedNavigationViewModel.prototype.locale = ko.observable('');
    GuidedNavigationViewModel.prototype.searchResultsHash = '';
    
    GuidedNavigationViewModel.prototype.refinementIndicatorOptions = {
      parent : '#loadingModal',
    };
    
    /**
     * Removes 'loading' spinner.
     * @function GuidedNavigationViewModel#destroySpinner
     */    
    GuidedNavigationViewModel.prototype.destroySpinner = function() {
      $('#loadingModal').hide();
      spinner.destroy();
    };
    
    /**
     * Creates 'loading' spinner.
     * @function GuidedNavigationViewModel#createSpinner
     */ 
    GuidedNavigationViewModel.prototype.createSpinner = function() {
      $('#loadingModal').removeClass('hide');
      $('#loadingModal').show();
      GuidedNavigationViewModel.prototype.isSpinnerStarted('true');
      
      if (($(window)[0].innerWidth || $(window).width()) < CCConstants.VIEWPORT_TABLET_LOWER_WIDTH) {
        GuidedNavigationViewModel.prototype.refinementIndicatorOptions.posLeft = "40%";
        GuidedNavigationViewModel.prototype.refinementIndicatorOptions.posTop = "80px";
      } else if (($(window)[0].innerWidth || $(window).width()) < CCConstants.VIEWPORT_LARGE_DESKTOP_LOWER_WIDTH) {
        GuidedNavigationViewModel.prototype.refinementIndicatorOptions.posLeft = "45%";
        GuidedNavigationViewModel.prototype.refinementIndicatorOptions.posTop = "100px";
      } else {
        GuidedNavigationViewModel.prototype.refinementIndicatorOptions.posLeft = "50%";
        GuidedNavigationViewModel.prototype.refinementIndicatorOptions.posTop = "150px";
      }
      
      spinner.create(GuidedNavigationViewModel.prototype.refinementIndicatorOptions);   
    };
    
    /**
     * Handle view model changes when the search result is updated
     * Populates the dimensions property with nested refinements collapsible lists.
     * @function GuidedNavigationViewModel#updateWithSearchResultsData
     * @param {Object} obj The calling object.
     * @param {SearchResultDetails} data The search result data.
     * @param {GuidedNavigationViewModel} self The view model instance.
     */    
    GuidedNavigationViewModel.prototype.updateWithSearchResultsData = function(obj, data, self) {
      var refinementCrumbs = [];  
      if (data && data.breadcrumbs && data.breadcrumbs.refinementCrumbs) {
        refinementCrumbs = data.breadcrumbs.refinementCrumbs.slice(0);
        for (var i = 0; i < refinementCrumbs.length ; i++ ) {
          if (refinementCrumbs[i].multiSelect == true && refinementCrumbs[i].count > 0) {
            var found = false;
            for (var j = 0; j < data.navigation.length; j++ ) {
              if (data.navigation[j].dimensionName == refinementCrumbs[i].dimensionName) {
                data.navigation[j].shouldMultiSelectDimensionExpand = true;
                refinementCrumbs[i].isSelected = true;
                found = true;
                //Do not add refinementCrumbs to navigation refinements, if they are already present
                if (data.navigation[j].refinements && data.navigation[j].refinements instanceof Array &&
                  (data.navigation[j].refinements.indexOf(refinementCrumbs[i]) < 0)) {
                  data.navigation[j].refinements.push(refinementCrumbs[i]);
                }
                break;
              }
            }
            // Creating a new dimension and adding the multi select refinement to it.
            if (found == false ) {
              refinementCrumbs[i].isSelected = true;
              var navigation_data = {
                multiSelect: true,
                name: refinementCrumbs[i].name,
                ancestors: [],
                shouldMultiSelectDimensionExpand: true,
                displayName: refinementCrumbs[i].displayName,
                dimensionName: refinementCrumbs[i].dimensionName,
                refinements: [ refinementCrumbs[i] ]
              };
            data.navigation.push(navigation_data);
          }
        }
        if (self.searchText() === "") {
          // Sends category crumb to display as titleText in product listing page.
          if (refinementCrumbs[i].dimensionName == CCConstants.GUIDED_NAVIGATION_CATEGORY) {
            $.Topic(pubsub.topicNames.CATEGORY_CRUMB_UPDATED).publish(self.convertLabel(refinementCrumbs[i]));
            }
          }
        }
        // Removing the default refinementCrumb (first) when category is selected from allRefinementCrumbs.
        if (self.searchText() === "" && (refinementCrumbs.length > 0 && refinementCrumbs[0].dimensionName === CCConstants.GUIDED_NAVIGATION_CATEGORY &&
          refinementCrumbs[0].properties && self.categoryRepositoryId() === refinementCrumbs[0].properties["dimval.prop.category.repositoryId"] )) {
          self.allRefinementCrumbs(refinementCrumbs.slice(1));
        } else {
          self.allRefinementCrumbs(refinementCrumbs.slice(0));
        }
      }
      
      if (data.searchAdjustments && data.searchAdjustments.originalTerms && data.searchAdjustments.originalTerms.length > 0) {
        self.searchText(data.searchAdjustments.originalSearchTerms[0]);
      }

      if ((obj.message === CCConstants.SEARCH_MESSAGE_FAIL)  || !((data.navigation && data.navigation.length > 0) || (refinementCrumbs.length > 0))) {
        self.displayWidget(false);
      } else {
        var categoryListIndex = -1;
        
        self.dimensions(ko.utils.arrayMap(data.navigation, function(refinementMenu) {
          return new Dimension(refinementMenu, self.maxRefinementCount); 
        }), self.maxDimensionCount);
          
        //Check if category refinement list exists in the dimensions list  
        $.each(self.dimensions(), function(index, value) {
          if (value.dimensionName === CCConstants.GUIDED_NAVIGATION_CATEGORY) {
            categoryListIndex= index;
          }  
        });

        //Place the category refinement list at the beginning of dimension list
        if (categoryListIndex != -1) {
          self.dimensions.unshift(self.dimensions.splice(categoryListIndex, 1)[0]);
        }
        
        self.dimensions.showAll(false);
        self.displayWidget(true);
      }
    };
    
    /**
     * Initializes the dimensions property via topic.
     * Subscribes to the needed topic and loads the view model data.
     * @function GuidedNavigationViewModel#initialize
     */
    GuidedNavigationViewModel.prototype.initialize = function() {
      var self = this;  
      $.Topic(pubsub.topicNames.SEARCH_RESULTS_UPDATED).subscribe(function(obj) {
        var data = this;
        GuidedNavigationViewModel.prototype.updateWithSearchResultsData(obj, data, self);
        GuidedNavigationViewModel.prototype.checkSpinner();
      });
      $.Topic(pubsub.topicNames.SEARCH_RESULTS_FOR_CATEGORY_UPDATED).subscribe(function(obj) {
        var data = this;
        GuidedNavigationViewModel.prototype.updateWithSearchResultsData(obj, data, self);
        GuidedNavigationViewModel.prototype.checkSpinner();
      });
      $.Topic(pubsub.topicNames.CATEGORY_UPDATED).subscribe(function(data) {
        self.categoryHref(data.categoryRoute);
        self.categoryName(data.categoryName);
        self.categoryDimensionId(data.dimensionId);
        self.categoryRepositoryId(data.repositoryId);
        self.searchText('');
      }); 
      $.Topic(pubsub.topicNames.OVERLAYED_GUIDEDNAVIGATION_CLEAR).subscribe(function() {
          GuidedNavigationViewModel.prototype.resetViewModel(self);
       });
      
      // On Refresh load the category data from cookie
      if (!self.searchText() && !self.categoryName()) {
        self.loadCategoryFromLocalData();
      }
    };   
    
    /**
     * Loads the category data from local storage ( To avoid problems with refresh.)
     * @function GuidedNavigationViewModel#loadCategoryFromLocalData
     * 
     */
    GuidedNavigationViewModel.prototype.loadCategoryFromLocalData = function() {
      var self = this;
      // load the data from local storage ( To avoid problems with refresh.)
      var localData = null;
      localData = storageApi.getInstance().getItem("category");
      
      if (localData && typeof localData === 'string') {
          localData = JSON.parse(localData);
      }
      
      if (localData != null) {
        self.categoryHref(localData.categoryRoute);
        self.categoryName(localData.categoryName);
        self.categoryRepositoryId(localData.repositoryId);
        self.categoryDimensionId(localData.dimensionId);
      }
    };
    
    /**
     * Converts Label to its locale specific name.
     * @function GuidedNavigationViewModel#convertLabel
     */ 
    GuidedNavigationViewModel.prototype.convertLabel = function(value) {
      var label = value.label;
      var a = "dimval.prop.displayName_"+GuidedNavigationViewModel.prototype.locale();
      if ( value && value.properties && value.properties[a] ) {
        label = value.properties[a];
      }
      return label;
    };
    
    /**
     * Destroys spinner if it is started already.
     * @function GuidedNavigationViewModel#checkSpinner
     */
    GuidedNavigationViewModel.prototype.checkSpinner = function() {
      if (GuidedNavigationViewModel.prototype.isSpinnerStarted()) {
        GuidedNavigationViewModel.prototype.destroySpinner();
      }
      GuidedNavigationViewModel.prototype.isSpinnerStarted('false');
    };
    
    /**
     * Resets the Guided Nav View Model.
     * @function GuidedNavigationViewModel#resetViewModel
     */
    GuidedNavigationViewModel.prototype.resetViewModel = function(self) {
       self.displayWidget(false);
       self.dimensions.removeAll() ;
       self.allRefinementCrumbs.removeAll();
    };

    /**
     * Creates a wrapper object over the observable with the needed parentRefinements/flags/subscriptions
     * It internally uses the collapsibleList method.
     * @function GuidedNavigationViewModel#refinementList
     * @param {Object[]} initialList Initial list of refinements.
     * @param {integer} limit The maximum number of refinements to be displayed.
     * @param {string} dimensionName The name of the dimension, 
     * either CCConstants.GUIDED_NAVIGATION_CATEGORY or CCConstants.GUIDED_NAVIGATION_PRICERANGE
     * @param {boolean} multiSelect Allow multiple selections?
     * @return {observable} The refinement list wrapper object.
     */    
    GuidedNavigationViewModel.prototype.refinementList = function(initialList, limit, dimensionName, multiSelect) {
      var self = this;
      $.each(initialList, function(index, value) {
        value.label = self.convertLabel(value);
        value.refinementValue = CCi18n.t('ns.common:resources.refinementValueText', 
          {dataLabel: value.label, dataCount: value.count});
        if (this.multiSelect == true) {
          value.checkedValue = ko.observable(false);
          // checked attribute is set when it is present in the breadcrumbs.
          if (this.isSelected && this.isSelected == true) {
            value.checkedValue(true);
          }
          value.checkedValue.subscribe(function(newValue) {
            if (!newValue) {
              this.navigationState = this.removeAction.navigationState;
            }
            GuidedNavigationViewModel.prototype.createSpinnerAndHandleRedirect(this.navigationState);
          }, value);
        }
        else {
          value.clickRefinement = function() {
            GuidedNavigationViewModel.prototype.createSpinnerAndHandleRedirect(this.navigationState);
          };
        }
      });
   
      var observable = self.collapsibleList(initialList, limit);
      
      if (dimensionName === CCConstants.GUIDED_NAVIGATION_CATEGORY) {
        observable.sort(function(left, right) {
          return left.label == right.label ? 0 : (left.label < right.label ? -1 : 1) ;
        });
      }      
      else if (dimensionName !== CCConstants.GUIDED_NAVIGATION_PRICERANGE) {
        observable.sort(function(left, right) {
        // If count is same, then sort by label
        return left.count == right.count ? (left.label < right.label ? -1 : 1) : (left.count < right.count ? 1 : -1) ;
      });
    }  
    return observable;
    };
    
    /**
     * Creates spinner and redirects to the navigationState.
     * @function GuidedNavigationViewModel#createSpinnerAndHandleRedirect
     * @param {string} navigationState The navigation state.
     */
    GuidedNavigationViewModel.prototype.createSpinnerAndHandleRedirect = function(navigationState) {
      var self = this;
      GuidedNavigationViewModel.prototype.createSpinner();
      navigation.goTo(self.searchResultsHash + Search.getFilteredNavState(navigationState) + "&" 
      + CCConstants.SEARCH_TYPE + "=" + CCConstants.SEARCH_TYPE_GUIDED + "&"
      + CCConstants.PARAMETERS_TYPE + "=" + CCConstants.PARAMETERS_SEARCH_QUERY); 
    }

    /**
     * Create a list which collapses to a limited size.
     * Creates a wrapper observable object over the observable with the needed flags/subscriptions.
     * <p>
     * Adds a 'display' property to the wrapper, which returns a subset of the list, up to the limit
     * specified.
     * @function GuidedNavigationViewModel#collapsibleList
     * @param {Object[]} initialList The initial list.
     * @param {integer} limit The max size of the list.
     * @return {observable} The observable wrapper object. 
     */    
    GuidedNavigationViewModel.prototype.collapsibleList = function(initialList, limit) {
      var self = this;
      var observable = ko.observableArray(initialList);
      observable.limit = ko.observable(limit);
      observable.showAll = ko.observable(false);
      observable.toggleShowAll = function() {
        observable.showAll(!observable.showAll());
      };
      observable.display = ko.computed(function() {
        if (observable.showAll()) {
          return observable(); 
        }
        return observable().slice(0,observable.limit());
      }, observable);
      return observable;
    };    

    return GuidedNavigationViewModel;
  }  
);

