/**
 * @fileoverview navigation library used for any navigation in storefront.
 * The library will use html push api if available, otherwise, it will fallback
 * to do a page load when changing the url.
 * 
 * Any navigation should use the goTo method. setHash is still available for 
 * anything that still requires it.
 * 
 */
define(
  
  //-------------------------------------------------------------------
  // PACKAGE NAME
  //-------------------------------------------------------------------
  'navigation',
  
  //-------------------------------------------------------------------
  // DEPENDENCIES
  //-------------------------------------------------------------------
  ['jquery', 'crossroads', 'hasher', 'pubsub'],

  //-------------------------------------------------------------------
  // MODULE DEFINTIION
  //-------------------------------------------------------------------
  function($, crossroads, hasher, PubSub) {

    "use strict";

    /**
     * Creates a navigation view model.
     * 
     * @class the navigation view model used for any navigation related functionality in storefront.
     * @name Navigation
     * @private
     */
    function Navigation() {
      var self = this, loginHandlerDeferred = $.Deferred(), loginHandler, loginHandlerPage = null;
      
      // Maintaining compatibility with widgets publishing USER_UNAUTHORIZED.
      $.Topic(PubSub.topicNames.USER_UNAUTHORIZED).subscribe(function(pRedirectLinkDetails) {
        // Add the login handler page to the current path to make sure the login modal shows up.
        self.loginHandlerPage = self.getPath();
        loginHandlerDeferred.done(function(){
          loginHandler(pRedirectLinkDetails);
        });  
      });
      
      /**
       * Calls setHash in the hasher library
       * @private
       * @function navigation#setHash
       * @param {String} the hash to set
       */
      self.setHash = function(pHash) {
        hasher.setHash(pHash);
      };
       
      /**
       * Calls getHash in the hasher library
       * @private
       * @function navigation#getHash
       * @return {String} the current hash value
       */
      self.getHash = function() {
        return hasher.getHash();
      };
      
      /**
       * Sets the login handler for this library.
       * @param {Function} pHandler a function that will get called with redirect information when the handler is ready.
       */
      self.setLoginHandler = function(pHandler) {
        loginHandler = pHandler;
        loginHandlerDeferred.resolve();
      };
      
      /**
       * Method checks if 
       * @param {String} pPath The path to check if it has login parameters.
       */
      self.checkLogin = function(pPath) {
        
        if (pPath.indexOf('?loggedIn=false') > -1) {
          var pagePos = pPath.indexOf('page=') + 5;
          var page = decodeURIComponent(pPath.substr(pagePos));
          
          page = (page.charAt(0) === '/' ? page : '/' + page);
          var redirectLinkDetails = [{message: "success", linkToRedirect: page}];
          
          if (pPath.charAt(0) == '/') { 
            self.loginHandlerPage = pPath.substr(1, pPath.indexOf('?') - 1);
          } else {
            self.loginHandlerPage = pPath.substr(0, pPath.indexOf('?') - 1);
          }
          
          loginHandlerDeferred.done(function(){
            loginHandler(redirectLinkDetails);
          });
        }
      };
      
      /**
       * Uses html push state to set the current path, the publishes a push state event
       * that can be picked up for parsing by the crossroads routing rules.
       * 
       * @private
       * @function navigation#goTo
       * @param {String} the path to go to e.g. checkout      
       * @param {boolean} if no history is set, the url will not change, just the routing rules will be fired.                    
       * @param {boolean} if set to true, the new url will replace the current url in the history stack.
       */
      self.goTo = function (pPath, pNoHistory, pReplace) {
        
        var path = self.getPathWithLocale(pPath);
        
        if (pNoHistory) {
          $.Topic(PubSub.topicNames.HISTORY_PUSH_STATE).publish(path);    
        }
        else if (window.history && window.history.pushState) {
          if (pReplace) {
            window.history.replaceState(null, "", path);
          } else {
            window.history.pushState(null, "", path);
          }
          $.Topic(PubSub.topicNames.HISTORY_PUSH_STATE).publish(path);
          
          if (self.checkLogin) self.checkLogin(pPath);
        }  
        else {
          var url = self.getBaseURL() + (path.charAt(0) === '/' ? path : '/' + path);
          window.location.assign(url);
        }  
      };
      
      /**
       * Returns the current path e.g. checkout
       * 
       * @private
       * @function navigation#getPath
       * @return {String} the current path to e.g. checkout
       */
      self.getPath = function () {
        var path = window.location.pathname;
        
        if (path.charAt(0) === '/') {
          path = path.substr(1); 
        }
        
        return path;
      };
      
      /**
       * Returns the relative path e.g. /checkout
       * 
       * @private
       * @function navigation#getRelativePath
       * @return {String} the current path to e.g. /checkout
       */
      self.getRelativePath = function () {
        var path = window.location.pathname;
        
        if (!(path.charAt(0) === '/')) {
          path = '/' + path;
        }
        
        return path;
      };
      
      /**
       * Compares the passed in path to the current one
       * 
       * @private
       * @function navigation#isPathEqualTo
       * @return {Boolean} true if pPath is equal to the current path.
       */
      self.isPathEqualTo = function(pPath) {
        
        if (pPath) {
          var currentPath = self.getPathWithoutLocale();
          var compareToPath = self.getPathWithoutLocale(pPath);
          
          currentPath = (currentPath.charAt(0) === '/') ? currentPath.substr(1) : currentPath;
          compareToPath = (compareToPath.charAt(0) === '/') ? compareToPath.substr(1) : compareToPath;

          return (currentPath.indexOf(compareToPath) === 0);
        }
        
        return false;
      };
      
      /**
       * Returns the current query string e.g. ?ntt=2
       * 
       * @private
       * @function navigation#getQueryString
       * @return {String} the current query string
       */
      self.getQueryString = function() {
        return window.location.search;
      };
      
      /**
       * Returns the base url for the site.
       * 
       * @private
       * @function navigation#getBaseURL
       * @return {String} the base url e.g. http://mysite.com
       */
      self.getBaseURL = function() {
        // IE9 fix
        if (!window.location.origin) {
          window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port: '');
        }
        
        return window.location.origin;
      };
      
      /**
       * Returns the current path, guaranteed not to be preceded with the current locale.
       * 
       * @private
       * @function navigation#getCurrentLocaleWithoutLocale
       */
      self.getPathWithoutLocale = function(pPath) {
        var path = pPath ? pPath : window.location.pathname + window.location.search;
        
        if (window.urlLocale) {
          var browserLanguage = JSON.parse(window.urlLocale)[0].name;
          
          // See if path begins with the current locale e.g. /en/home
          var pathSegments = path.split("/");
          if (pathSegments.length >= 2 && pathSegments[1] == browserLanguage) {

            // Cut the locale out before passing it on.
            path = path.replace("/" + pathSegments[1], "");
          }
        }
        
        return path;
      };
      
      /**
       * Returns the current path, guaranteed not to be preceded with facebook.
       * 
       * @private
       * @function navigation#getPathWithoutFacebookContext
       */
      self.getPathWithoutFacebookContext = function(pPath) {
        var path = pPath ? pPath : window.location.pathname + window.location.search;
        if (window.FacebookCanvas) {
          // See if path begins with facebook context : e.g. /facebook
          var pathSegments = path.split("/");
          if (pathSegments.length >= 2 && pathSegments[1] == "facebook") {
            // Replace /facebook context with /wishlist context 
            path = path.replace("/" + pathSegments[1], "/wishlist");
          }
        }
        
        return path;
      };
        
      /**
       * Returns the current path, guaranteed not to be preceded with the current locale or facebook, e.g /en/home , or /facebook.
       * 
       * @private
       * @function navigation#getPathWithoutContext
       */
      self.getPathWithoutContext = function(request) {
        
        //Strip locale, '/en/home', from path
        request = self.getPathWithoutLocale(request);
        
        //Strip facebook, '/facebook', from path
        request = self.getPathWithoutFacebookContext(request);
        
        return request;
      };
      
      /**
       * Returns the current URL, preceded with the current locale if available.
       * 
       * @private
       * @function navigation#getCurrentLocaleWithLocale
       */
      self.getPathWithLocale = function(pPath) {
        var path = pPath ? pPath : window.location.pathname + window.location.search;

        if (window.urlLocale) {
          var browserLanguage = JSON.parse(window.urlLocale)[0].name;

          path = (path.charAt(0) === '/' ? path : '/' + path);

          if (path.indexOf('/' + browserLanguage) === -1) {
            if (path.indexOf('/') === -1) {
              path = '/' + path;
            }

            path = '/' + browserLanguage + path;
          }
        }

        return path;
      };
      
      /**
       * Returns the current url with the current locale in it.
       * @param {String} pLocale The locale to set in the url.
       */
      self.getLocaleBasedUrl = function(pLocale) {
        var url = self.getBaseURL() + '/' + pLocale + self.getPathWithoutLocale();
        
        return url;
      };
      
      /**
       * Method appends login parameters to current path and redirects.
       * @param {String} pTargetPage The page to go to after successful login.
       * @param {String} pLoginPage  The page to go to before showing the login modal.
       */
      self.doLogin = function(pTargetPage, pLoginPage) {
        
        if (self.getPathWithoutLocale().indexOf('?loggedIn=false') < 0) {
          var path = pLoginPage ? pLoginPage : window.location.pathname;
          path = path + '?loggedIn=false&page=' + encodeURIComponent(pTargetPage);
          self.goTo(path);
        }
        
      }
      
      /**
       * Method removes login and redirect params from the current url, to revert login state.
       */
      self.cancelLogin = function() {
        self.goTo(window.location.pathname);  
      };
    }
    
    return new Navigation();
  }
);

