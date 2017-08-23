//----------------------------------------
/**
 * Routing
 *
 */

define('routing',
  //-------------------------------------------------------------------
  // PACKAGE NAME
  //-------------------------------------------------------------------
  //-------------------------------------------------------------------
  // DEPENDENCIES
  //-------------------------------------------------------------------
  ['jquery',
    'crossroads',
    'hasher',
    'pubsub',
    'ccConstants'
  ],

  //-------------------------------------------------------------------
  // MODULE DEFINTIION
  //-------------------------------------------------------------------
  function($, crossroads, hasher, PubSub, CCConstants) {

    "use strict";

    //----------------------------------------
    // Private Variables
    //----------------------------------------

    // routing variables
    var currentPageId = null,
      currentContextParam = null,
      rootRoute = null,
      pageRoute = null,
      pageContextRoute = null,
      pageContextForCategotyRoute = null,
      productContextRoute = null,
      categoryContextRoute = null,
      pageParameterRoute = null,
      pageRouteParameterRoute = null,
      adminSearchContextRoute = null,
      adminMarketingContextRoute = null,
      currentParameters = null,
      adminAccountsContextRoute = null;

    //----------------------------------------
    /**
     * constructor
     */
    function Routing() {
      var self = this;

      $.Topic(PubSub.topicNames.PAGE_LAYOUT_SERVER_ERROR).subscribe(self.handleServerError.bind(self));
      // ------------------------------------------
      // route definitions
      /*
       * Root route.  Needed so the home/ page layout will load.
       *
       * TODO need to handle the following routes somehow:
       * http://localhost:8080/index.html/
       * http://localhost:8080/index.html/#
       * http://localhost:8080/index.html/#/
       */
      rootRoute = crossroads.addRoute('/', null, 1000);
      rootRoute.matched.add(self.onPageContextMatch.bind(self));

      /*
       * Page route with context and parameter. Triggered when all the three exists.
       */
      pageParameterRoute = crossroads.addRoute('/:seo_slug*:/{pageId}/{contextId}?{parameters}', null, 500);
      pageParameterRoute.matched.add(self.onPageContextAndParameterMatch.bind(self));

      /*
       * Page type route.
       *
       * TODO This part needs to be reviewed.  Possibly removed.
       * I don't see this being used ever.  The page type ID doesn't seem
       * like it would be alone in the requset.
       */
      pageRoute = crossroads.addRoute('{pageId}', null, 500);
      pageRoute.matched.add(self.onPageOnlyMatch.bind(self));

      /*
       * Page route with context. This is likely to be used the most (for now?).
       * This is a page type ID (e.g,. category) with a context ID (e.g.,
       * catFireside).*/
      pageContextRoute = crossroads.addRoute('/:seo_slug*:/{pageId}/{contextId}', null, 200);
      pageContextRoute.matched.add(self.onPageContextMatch.bind(self));

      /*
       * Page route with context. This may be used by the catalog page if the collection is provided as well.
       * This is a catalog page with a context ID (e.g.,
       * /appleCatalog/collection/cat10001).*/
      pageContextForCategotyRoute = crossroads.addRoute('/:seo_slug*:/catalog/{catalogId}/collection/{collectionId}', null, 300);
      pageContextForCategotyRoute.matched.add(self.onCatalogContextMatch.bind(self));

      /*
       * Page route with parameter. This is used in the end search.
       * This is a page type ID (usually searchresults) with one or more parameters
       * (e.g., Ntt, No, Nrpp)
       */
      pageParameterRoute = crossroads.addRoute('/:seo_slug*:/{pageId}?{parameters}', null, 200);
      pageParameterRoute.matched.add(self.onPageParameterMatch.bind(self));

      /*
       * Page route with parameter. This is used in the end search.
       * This is a page type ID (usually searchresults) with trailing slash followed by one or more parameters
       * (e.g., Ntt, No, Nrpp)
       */
      pageRouteParameterRoute = crossroads.addRoute('/:seo_slug*:/{pageId}/?{parameters}', null, 200);
      pageRouteParameterRoute.matched.add(self.onPageParameterMatch.bind(self));

      /*
       * Product page route with context. This is used for triggering a page view change
       * whenever there is navigation between products. This has to be higher in priority to
       * the page context match.
       */
      productContextRoute = crossroads.addRoute('/:seo_slug*:/product/{contextId}', null, 500);
      productContextRoute.matched.add(self.onProductContextMatch.bind(self));

      /*
       * Category page route with context. This is used for loading the category
       * pages with pagination. This has to be higher in priority to
       * the actual context match as this is supposed to take care of all the
       * extra params in the URL rather than just send them to the SEO slug.
       */
      categoryContextRoute = crossroads.addRoute('/:seo_slug*:/category/{contextId}/:pageNumber:', null, 500);
      categoryContextRoute.matched.add(self.onCategoryContextMatch.bind(self));

      /*
       * For the Admin application's Search tab, we need to support multi-level context.
       * This should match before the more-generic pageContextRoute route.
       */
      adminSearchContextRoute = crossroads.addRoute('/search/{contextId*}', null, 500);
      adminSearchContextRoute.matched.add(self.onPageContextMatch.bind(self, "", "search"));

      /**
       * For the Admin application's Marketing tab, we need to support multi-level context.
       * This should match before the more-generic pageContextRoute route.
       */
      adminMarketingContextRoute = crossroads.addRoute('/marketing/{contextId*}', null, 500);
      adminMarketingContextRoute.matched.add(self.onPageContextMatch.bind(self, "", "marketing"));

      /**
       * For the Admin application's Accounts tab, we need to support multi-level context.
       * This should match before the more-generic pageContextRoute route.
       */
      adminAccountsContextRoute = crossroads.addRoute('/accounts/{contextId*}', null, 500);
      adminAccountsContextRoute.matched.add(self.onPageContextMatch.bind(self, "", "accounts"));

      /*
       * This all sets up hasher to do it's thing.  Add a parsing method [1],
       * listen for changes with that parsing method, then initialize (run)
       * Hasher.
       *
       * [1] Maybe there's something clever we want to do here to track the
       * hash values, or something else?  But this is obviously where the old
       * and new values are available for any cleverness.
       */
      function parseHash(newHash, oldHash) {
        var eventData = {'oldHash' : oldHash, 'newHash' : newHash};
        $.Topic(PubSub.topicNames.UPDATE_HASH_CHANGES).publish(eventData);
        crossroads.parse(newHash);
      }

      hasher.prependHash = CCConstants.URL_PREPEND_HASH;
      hasher.initialized.add(parseHash);
      hasher.changed.add(parseHash);
      hasher.init();


      return (self);
    }

    // ----------------------------------------
    /**
     * Initialize CrossroadsJS and Hasher to listen for HASH URL change events.
     * When the URL changes, a new page model will be loaded.
     *
     * extra credit: can we cache this view model to avoid trips to the server?
     */

    /**
     * Handle the case when layout container load returns an error response.
     */
    Routing.prototype.handleServerError = function(args) {
      // set this to null so we'll reload when the server comes back
      currentPageId = null;
      currentContextParam = null;
    };

    /**
     * Does a data-only request to the server.
     * When that data is returned, publishes a PAGE_CONTEXT_CHANGED
     * message containing the server response.
     *
     * data - expected set of values is the following:
     *  pageId
     *    String of the page type ID to load (e.g., category, product, etc.).
     *  contextId
     *    String of the context ID (e.g., category ID, product ID, etc.).
     *  previousContextId
     *    String of the previous context ID.
     */
    Routing.prototype.handleContextChanged = function(data) {
      // Do a "data only" request, last param is true meaning data only.
      $.Topic(PubSub.topicNames.PAGE_CONTEXT_CHANGED).publish(data);
    }; // handleContextData

    /**
     * Listens for viewChanged events
     * Loads the current view model for the view to which we have changed.
     *
     * When we map a view model twice it causes infinite recursion in
     * knockout.mapping. To work around the issue we're just making a new
     * layout view model each time and updating just the regions property
     * on our local model.
     *
     * data - expected set of values is the following:
     *  pageId
     *    String of the page type ID to load (e.g., category, product, etc.).
     *  contextId
     *    String of the context ID (e.g., category ID, product ID, etc.).
     */
    Routing.prototype.handleViewChanged = function(data) {
      $.Topic(PubSub.topicNames.PAGE_VIEW_CHANGED).publish(data);
    }; // handleViewChanged

    /**
     *
     * Listens for the parameter change.
     * data - expected set of values:
     *  pageId
     *    String of the page type ID to load
     *  parameters
     *    String of parameters in amp(&) separated values
     */
    Routing.prototype.handleParametersChanged = function(data) {
      $.Topic(PubSub.topicNames.PAGE_PARAMETERS_CHANGED).publish(data);
    };
    /**
    *
    * Listens for the parameter change.
    * data - expected set of values:
    *  pageId
    *    String of the page type ID to load
    *  parameters
    *    String of parameters in amp(&) separated values
    */
   Routing.prototype.handlePageContextAndParametersChanged = function(data) {
     $.Topic(PubSub.topicNames.PAGE_CONTEXT_AND_PARAMETERS_CHANGED).publish(data);
   };
    /**
     * Matcher method for routing to decide which event to process.
     *
     * pageId
     *   String of the page type ID to load (e.g., category, product, etc.).
     * contextId
     *   String of the context ID (e.g., category ID, product ID, etc.).
     */
    Routing.prototype.onPageContextMatch = function(slug, pageId, contextId) {
      if (typeof pageId == 'undefined') {
        pageId = 'home';
      }
      var eventData = {
        'pageId': pageId,
        'contextId': contextId,
        'seoslug': slug,
        'previousContextId': currentContextParam
      };
      currentParameters = null;
      if (pageId !== currentPageId  || contextId == undefined) {
        // If page id changes, fire a viewChanged event, including the context
        // param if it exists
        this.handleViewChanged(eventData);
        currentPageId = pageId;
      } else {
        // Otherwise, if the context param has changed, fire a context param
        // changed event We don't want to fire both a context param change and
        // view change event at the same time since its an extra trip to the
        // server.
        this.handleContextChanged(eventData);
        // Update the current context param
        currentContextParam = contextId;
      }
      // For discerning code that just cares if the page has changed and doesn't want to
      // deal with individual context or view change events
      $.Topic(PubSub.topicNames.PAGE_CHANGED).publish(eventData);
    }; // onPageContextMatch

    /**
     * Matcher method for routing to decide which event to process.
     *
     * catalogId
     *   String of the catalog ID to load (e.g., masterCatalog, customCatalog1, etc.).
     * collectionId
     *   String of the collection ID (e.g., cat10001, cat20002, etc.).
     */
    Routing.prototype.onCatalogContextMatch = function(slug, catalogId, collectionId) {
        var eventData = {
          'pageId': 'catalog',
          'contextId': catalogId + '/collection/' + collectionId,
          'seoslug': slug,
          'previousContextId': currentContextParam
        };
        if ('catalog' !== currentPageId  || collectionId == undefined) {
          // If page id changes, fire a viewChanged event, including the context
          // param if it exists
          this.handleViewChanged(eventData);
          currentPageId = 'catalog';
        } else {
          // Otherwise, if the context param has changed, fire a context param
          // changed event We don't want to fire both a context param change and
          // view change event at the same time since its an extra trip to the
          // server.
          this.handleContextChanged(eventData);
          // Update the current context param
          currentContextParam = collectionId;
        }
        // For discerning code that just cares if the page has changed and doesn't want to
        // deal with individual context or view change events
        $.Topic(PubSub.topicNames.PAGE_CHANGED).publish(eventData);
      };

   /**
    *
    * Matcher method for routing a product page and put all the relevant data
    * as event data.
    *
    * slug
    *   slug assigned to product
    * pageNumber
    *   String of the current page number
    */
    Routing.prototype.onProductContextMatch = function(slug, contextId) {
      var pageId = 'product';
      var eventData = {
        'pageId': pageId,
        'contextId': contextId,
        'seoslug': slug,
        'previousContextId': currentContextParam
      };
      // Setting the page id and the context to the current values
      currentPageId = pageId;
      currentContextParam = contextId;
      currentParameters = null;
      this.handleViewChanged(eventData);
      // For discerning code that just cares if the page has changed and doesn't want to
      // deal with individual context or view change events
      $.Topic(PubSub.topicNames.PAGE_CHANGED).publish(eventData);
    };

    /**
    *
    * Matcher method for routing a category page and put all the relevant data
    * as event data.
    *
    * contextId
    *   String of the context ID (e.g., category ID, product ID, etc.).
    * pageNumber
    *   String of the current page number
    * sortOrder
    *   String of the current sort order
    */
    Routing.prototype.onCategoryContextMatch = function(slug, contextId, pageNumber) {
      var pageId = 'category';
      var eventData = {
        'pageId': pageId,
        'contextId': contextId,
        'seoslug': slug,
        'previousContextId': currentContextParam
      };
      var paginationOnlyChange = false;
      currentParameters = null;
      // Check whether this is a pagination/sort order only change
      if ((pageId == currentPageId) && (contextId == currentContextParam)) {
        paginationOnlyChange = true;
      }
      // Handle the pagination
      $.Topic(PubSub.topicNames.PAGE_PAGINATION_CHANGE).publish(
          {
            page: pageNumber,
            paginationOnly: paginationOnlyChange
          },[{message:"success"}]);
      if (pageId !== currentPageId || contextId !== currentContextParam) {
        // If page or context id changes, fire a viewChanged event, including the context
        // param if it exists
        this.handleViewChanged(eventData);
        currentPageId = pageId;
        currentContextParam = contextId;
      } else {
        // Otherwise, fire a context param changed event. We don't want
        // to fire both a context param change and view change event
        // at the same time since its an extra trip to the server.

        this.handleContextChanged(eventData);
        // Update the current context param
        currentContextParam = contextId;
      }
      // For discerning code that just cares if the page has changed and doesn't want to
      // deal with individual context or view change events
      $.Topic(PubSub.topicNames.PAGE_CHANGED).publish(eventData);
    };

    /**
     *
     * Matcher method for routing to get all the parameters and put it in a page
     *
     * pageId
     *   String of the page type ID to load
     * parameters
     *   List of parameters to be sent along with the page
     */
    Routing.prototype.onPageParameterMatch = function(slug, pageId, parameters) {
      var eventData = {
        'pageId': pageId,
        'seoslug': slug,
        'parameters': parameters
      };

      if (pageId !== currentPageId) {
        // If page id changes, fire a viewChanged event, including the parameters
        // if they exists
        this.handleViewChanged(eventData);
        currentPageId = pageId;
        currentParameters = parameters;
      } else if (parameters !== currentParameters) {
        // Otherwise, if the current parameters has changed, fire a parameters
        // changed event We don't want to fire both a context param change and
        // view change event at the same time since its an extra trip to the
        // server.
        this.handleParametersChanged(eventData);
        // Update the current context param
        currentParameters = parameters;
      }
      // For discerning code that just cares if the page has changed and doesn't want to
      // deal with individual context or view change events
      $.Topic(PubSub.topicNames.PAGE_CHANGED).publish(eventData);
    };


   /**
    *
    * Matcher method for routing to capture the parameters or context or page change
    *
    * pageId
    *   String of the page type ID to load
    * contextId
    *   String of the context ID (e.g., category ID, product ID, etc.).
    * parameters
    *   List of parameters to be sent along with the page
    */
    Routing.prototype.onPageContextAndParameterMatch = function(slug, pageId, contextId, parameters) {
      var eventData = {
        'pageId': pageId,
        'contextId': contextId,
        'seoslug': slug,
        'parameters': parameters
      };
      if (pageId !== currentPageId) {
        // If page id changes, fire a viewChanged event, including the context
        // param if it exists
        this.handleViewChanged(eventData);
        currentPageId = pageId;
        currentContextParam = contextId;
        currentParameters = parameters;
      } else if (contextId !== currentContextParam) {
        // Otherwise, if the context param has changed, fire a context param
        // changed event We don't want to fire both a context param change and
        // view change event at the same time since its an extra trip to the
        // server.
        this.handleContextChanged(eventData);
        // Update the current context param
        currentContextParam = contextId;
        currentParameters = parameters;
      } else if (parameters !== currentParameters) {
        // Otherwise, if the current parameters have changed, fire a parameters changed
        // event We don't want to fire both a context param change and
        // view change event at the same time since its an extra trip to the
        // server.
        this.handleParametersChanged(eventData);
        // Update the current context param
        currentParameters = parameters;
      }
      // For discerning code that just cares if the page has changed and doesn't want to
      // deal with individual context or view change events
      $.Topic(PubSub.topicNames.PAGE_CHANGED).publish(eventData);

    };

    Routing.prototype.onPageOnlyMatch = function(pageId) {
      this.onPageContextMatch(undefined, pageId, undefined);
    };

    return Routing;
  });

