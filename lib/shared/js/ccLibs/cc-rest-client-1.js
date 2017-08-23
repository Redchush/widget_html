//----------------------------------------
/**
 * This library handles making rest calls to jersey
 * style endpoints running on a CloudCommerce server.
 * The actual rest calls are made through the XDomainProxy
 * class.
 *
 * After creating an instance of the CCRestClient() class, the
 * init method should be called.
 *
 * Any functions that need to be executed
 * after the client initialization is complete should be passed in via
 * calls to the registerInitCallback() method.
 *
 * To make a request, just call the request() method, passing in the url,
 * input data and success/error functions.
 */

define(
  'ccRestClientConstructor',['xDomainProxy',
   'ccConstants',
   'jquery',
   'pubsub',
   'storageApi',
   'viewportHelper'],

function(XDomainProxy, CCConstants, $, pubSub, storageApi, viewportHelper) {

  "use strict";

  //----------------------------------------
  /**
   * constructor
   */
  function CCRestClient(pProfileType, pCommonErrorCallback) {
    var self = this;
    self.profileId = null;
    self.profileRoles = null;
    self.tokenSecret = null;
    self.endpointRegistry = null;
    self.loggedIn = false;
    self.initComplete = false;
    self.initCompleteCallbacks = [];
    self.initCompleteCallbacksDone = false;

    self.storageSyncCallbacks = [];
    self.storageSyncDone = false;

    self.loginUpdateCallbacks = [];
    self.logoutUpdateCallbacks = [];

    self.loginAdminUpdateCallbacks = [];
    self.logoutAdminUpdateCallbacks = [];

    self.iframeLoadCompleteCallbacks = [];
    self.initIframeLoadComplete = false;
    self.initIframeLoadCompleteDone = false;
    self.profileType = pProfileType;

    self.previewMode = false;

    // Whether to allow  switching on production.
    // Setting this to false to disallow site switching on production
    self.allowSiteSwitchingOnProduction = false;

    self.initFailed = false;

    self.disableLoginErrorRedirect = false;

    self.commonErrorCallback = pCommonErrorCallback;

    self.url = XDomainProxy.urlHostnamePortPortionOnly(document.URL);
    self.urlProtocol = XDomainProxy.urlProtocolOnly(document.URL);

    // constants available through reference
    self.NULL = CCRestClient.NULL;

    self.currentRequestId = 0;

    //flag to check if a server request is generated
    self.storeRequestWasMade = false;

    //refresh interval Id. This is used to clear the interval
    self.storeRefreshIntervalId = null;

    self.etagCache = [];

    //This method is called to refresh the token in specific intervals
    self.doRefreshToken = function() {
      if (self.loggedIn && self.storeRequestWasMade) {
        var successFunc = function() {
          $.Topic(pubSub.topicNames.USER_SESSION_VALID).publish();
        };
        var errorFunc =  function(pResult) {};
        self.refresh(successFunc, errorFunc);
        self.storeRequestWasMade = false;
      }
    };

    //this method handles the session expiry for storefront
    self.handleSessionExpiry = function() {
      $.Topic(pubSub.topicNames.USER_SESSION_EXPIRED).publish();
      self.clearRefreshInterval();
    };

    //This method is called to register the timer to refresh the token
    self.setRefreshInterval = function() {
    if(self.loggedIn && self.storeRefreshIntervalId == null) {
        self.storeRefreshIntervalId = setInterval(self.doRefreshToken, CCConstants.TOKEN_REFRESH_INTERVAL);
      }
    };

    //this method is called to clear the timer to refresh the token
    self.clearRefreshInterval = function() {
   if(self.storeRefreshIntervalId != null) {
        clearInterval(self.storeRefreshIntervalId);
        self.storeRefreshIntervalId = null;
      }
    };

    self.registerInitCallback(self.setRefreshInterval);

    self.isRefreshRequired = false;
    self.lastPublishedTimeStamp = null;

    self.isNotStore = (window.isPreviewMode ||
        (self.profileType != CCConstants.PROFILE_TYPE_STOREFRONT)) ? true : false;

  }

  /*
   * Constants
   */
  CCRestClient.NULL = "cc-rest-null";

  CCRestClient.LOCAL_STORAGE_TOKEN = "oauth_token_secret";
  CCRestClient.LOCAL_STORAGE_LAST_UPDATE = "oauth_last_update";
  CCRestClient.LOCAL_STORAGE_EXPIRES = ";expires=";

  CCRestClient.LOCAL_STORAGE_LIFE_DAYS = 1;
  // token remain fresh for one hour
  CCRestClient.TOKEN_FRESH_TIME = 3600000;

  CCRestClient.HTTP_UNAUTHORIZED_ERROR = "401";

  CCRestClient.DELETE = "delete";

  // Admin paths
  CCRestClient.ADMIN_LOGOUT_SERVICE_PATH = "/ccadminui/v1/logout";
  CCRestClient.ADMIN_REFRESH_SERVICE_PATH = "/ccadminui/v1/refresh";
  CCRestClient.ADMIN_ENDPOINT_REGISTRY_SERVICE_PATH = "/ccadminui/v1/registry";
  CCRestClient.ADMIN_VERIFY_SERVICE_PATH = "/ccadminui/v1/verify";
  CCRestClient.ADMIN_LOGIN_SCREEN_URL = "/occs-admin";

  // Storefront paths
  CCRestClient.LOGOUT_SERVICE_PATH = "/ccstoreui/v1/logout";
  CCRestClient.REFRESH_SERVICE_PATH = "/ccstoreui/v1/refresh";
  CCRestClient.ENDPOINT_REGISTRY_SERVICE_PATH = "/ccstoreui/v1/registry";
  CCRestClient.VERIFY_SERVICE_PATH = "/ccstoreui/v1/verify";
  CCRestClient.SAML_AUTHN_REQUEST_SERVICE_URL = "/ccstoreui/v1/samlAuthnRequest?encode=true";

  //Added urls for Agent
  CCRestClient.AGENT_LOGOUT_SERVICE_PATH = "/ccagentui/v1/logout";
  CCRestClient.AGENT_REFRESH_SERVICE_PATH = "/ccagentui/v1/refresh";
  CCRestClient.AGENT_ENDPOINT_REGISTRY_SERVICE_PATH = "/ccagentui/v1/registry";
  CCRestClient.AGENT_VERIFY_SERVICE_PATH = "/ccagentui/v1/verify";
  CCRestClient.AGENT_LOGIN_SCREEN_URL = "/occs-agent";

  CCRestClient.LOCAL_STORAGE_LOGIN_KEY = "cc.login.update.";
  CCRestClient.LOCAL_STORAGE_LOGOUT_KEY = "cc.logout.update.";

  // Unused?
  CCRestClient.INPUT_ELEMENT = "input";

  // Cross Domain iframe constants
  CCRestClient.IFRAME_ELEMENT = "iframe";
  CCRestClient.ZERO = "0";
  CCRestClient.IFRAME_STYLE = "width: 0; height: 0; border: none;";
  CCRestClient.IFRAME_NAME = "https_iframe";
  CCRestClient.ID_ATTRIBUTE = "id";
  CCRestClient.NAME_ATTRIBUTE = "name";
  CCRestClient.WIDTH_ATTRIBUTE = "width";
  CCRestClient.HEIGHT_ATTRIBUTE = "height";
  CCRestClient.BORDER_ATTRIBUTE = "border";
  CCRestClient.STYLE_ATTRIBUTE = "style";
  CCRestClient.SRC_ATTRIBUTE = "src";
  CCRestClient.MAX_INT = 4294967295;

  // Locale header constants
  CCRestClient.LOCALE_HINT = "localeHint";
  CCRestClient.HINT_BROWSER = "browser";
  CCRestClient.HINT_ASSET_LANGUAGE_OPTIONAL = "assetLanguageOptional";
  CCRestClient.HINT_ASSET_LANGUAGE_REQUIRED = "assetLanguageRequired";

  CCRestClient.BEFORE_SEND_NOT_SUPPORTED = "Before-send callback not supported for proxy requests.";

  CCRestClient.LAST_PUBLISHED_TIME_STAMP = "lastPublishedTimeStamp";

  //----------------------------------------
  /**
   * init the x-domain proxy
   */
  CCRestClient.prototype.initProxy = function(pHttpPort, pHttpsPort) {
    var self = this;
    var httpPort = pHttpPort;
    var httpsPort = pHttpsPort;
    if(!httpPort)
      httpPort = location.port;
    if(!httpsPort)
      httpsPort = location.port;

    self.crossDomainURL = XDomainProxy.getCrossDomainURL(self.profileType,
                                                         XDomainProxy.HTTPS_PROTOCOL,
                                                         httpsPort,
                                                         true);
    self.crossDomainURLNoPath = XDomainProxy.getCrossDomainURL(self.profileType,
                                                         XDomainProxy.HTTPS_PROTOCOL,
                                                         httpsPort,
                                                         false);

    // create proxy to execute rest calls
    self.proxy = new XDomainProxy(self.profileType, httpPort, httpsPort);
  };

  //----------------------------------------
  /**
   * add a callback to notify if the init has failed
   */
  CCRestClient.prototype.registerInitFailCallback = function(pCallback) {
    var self = this;
    self.initFailCallback = pCallback;
    if(self.initFailed) {
      self.initFailCallback();
    }
  };

  //----------------------------------------
  /**
   * add a callback to run when storage sync has completed
   */
  CCRestClient.prototype.registerStorageSyncCallback = function(pCallback) {
    var self = this;
    if(self.storageSyncDone) {
      pCallback();
    }
    else {
      self.storageSyncCallbacks.push(pCallback);
    }
  };

  //----------------------------------------
  /**
   * add a callback to notify when init of the client is complete
   */
  CCRestClient.prototype.registerInitCallback = function(pCallback) {
    var self = this;
    // if the init has already completed, then just invoke the callback
    // else add the callback to the array
    if(self.initComplete){
      pCallback();
    }
    else {
      self.initCompleteCallbacks.push(pCallback);
    }
  };

  //----------------------------------------
  /**
   * add a callback to notify when oauth stored values have changed
   * due to a login event
   */
  CCRestClient.prototype.registerLoginUpdateCallback = function(pCallback) {
    var self = this;
    self.loginUpdateCallbacks.push(pCallback);
  };

  //----------------------------------------
  /**
   * add a callback to notify when oauth stored values have changed
   * due to a logout event
   */
  CCRestClient.prototype.registerLogoutUpdateCallback = function(pCallback) {
    var self = this;
    self.logoutUpdateCallbacks.push(pCallback);
  };

  //----------------------------------------
  /**
   * add a callback to notify when oauth stored values have changed
   * due to a login event from admin
   */
  CCRestClient.prototype.registerLoginAdminUpdateCallback = function(pCallback) {
    var self = this;
    self.loginAdminUpdateCallbacks.push(pCallback);
  };

  //----------------------------------------
  /**
   * add a callback to notify when oauth stored values have changed
   * due to a logout event from admin
   */
  CCRestClient.prototype.registerLogoutAdminUpdateCallback = function(pCallback) {
    var self = this;
    self.logoutAdminUpdateCallbacks.push(pCallback);
  };

  //----------------------------------------
  /**
   * init the client. The following operations take place
   * when this method is called:
   * 1) a registry request is made to get registry info
   * 2) a refresh request is made to refresh login state
   * 3) all initCompleteCallbacks are invoked in the order
   * in which they were registered
   * 4) checks if there is a language in the URL. If so,
   * updates it to the locale localstorage
   */
  CCRestClient.prototype.init = function(pNoRegistry, pNoPreviewCheck, pEndpointRegistry) {
    var self = this;

    // when the refresh has completed, invoke any callbacks
    // that were registered to notify them that the init is complete
    var invokeInitCompleteCallbacks = function() {
      if(self.initCompleteCallbacksDone) {
        return;
      }
      self.initComplete = true;
      for(var i=0; i < self.initCompleteCallbacks.length; i++) {
        // execute each callback
        self.initCompleteCallbacks[i]();
      }
      // clear out the array
      self.initCompleteCallbacks.length = 0;
      self.initCompleteCallbacksDone = true;
    };

    // issue a refresh request
    var refreshLoginState = function() {
      // refresh the login state, when the request returns,
      // invoke the initCompleteCallbacks method
      self.refresh(invokeInitCompleteCallbacks, invokeInitCompleteCallbacks);
    };


    // make sure storage api is initialized to
    // enable session storage syncing
    var invokeStorageSyncCallbacks = function() {
      for(var i=0; i < self.storageSyncCallbacks.length; i++) {
        // execute each callback
        self.storageSyncCallbacks[i]();
      }
      self.storageSyncDone = true;
    };
    storageApi.getInstance().initSyncing(function() {
      self.reloadStoredValueAuth();
      if(self.proxy) {
        self.refresh(invokeStorageSyncCallbacks, invokeStorageSyncCallbacks);
      }
    });

    // check local storage for oauth settings
    self.reloadStoredValueAuth();

    // register as a listener for login/logout events
    // from other tabs
    self.registerAsLoginLogoutEventListener();


    // once the registry call returns, create the iframe,
    // once the iframe is loaded, refresh login state
    var invokeCreateIframe = function() {
      // use cross domain iframe only if we're not already https
      if(self.urlProtocol != XDomainProxy.HTTPS_PROTOCOL &&
         self.crossDomainRequestsEnabled === true) {
        self.useIframe = true;
        // map of event ids to event handler functions
        self.eventHandlerMap = {};

        // add event handler for iframe init complete
        self.eventHandlerMap[XDomainProxy.IFRAME_INIT_COMPLETE_EVENT] = {
          success: refreshLoginState,
          error: refreshLoginState
        };
        self.initXDomainMessageListener();

        // create proxy frame for cross domain requests
        var proxyFramResponse = self.createCrossDomainIFrame();
        if(proxyFramResponse != null) {
          self.proxyFrame = proxyFramResponse.contentWindow;
        }
      }
      // don't use iframes
      else {
        self.useIframe = false;
        refreshLoginState();
      }
    };

    // let us set the value of the url language in the localstorage before
    // any endpoint call to make sure that the calls are made in the right
    // locale
    if (window.urlLocale) {
      self.setStoredValue(CCConstants.LOCAL_STORAGE_USER_CONTENT_LOCALE, window.urlLocale);
    } else {
      self.clearStoredValue(CCConstants.LOCAL_STORAGE_USER_CONTENT_LOCALE);
    }

    // Function to get a URL parameter value
    var getURLParameterByName = function (name) {
      name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
      var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
      var results = regex.exec(location.search);
      return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };

    // Preview mode only - look for a site ID in the window's URL and use it
    if (self.previewMode) {
      var siteId = getURLParameterByName(CCConstants.URL_SITE_PARAM);

      // Set the site ID in local storage
      if (siteId) {
        self.setStoredValue(CCConstants.LOCAL_STORAGE_SITE_ID, siteId);
      }
    }

    // before we can use this client we need registry info from
    // the server
    var invokeGetRegistry = function() {
      // get the endpoint registry
      if(self.endpointRegistry == null) {
        var requestEndpointRegistrySuccess = function(pResult) {
          self.initProxy(pResult.httpPort, pResult.httpsPort);
          // refresh the login state if we got the registry
          // successfully
          invokeCreateIframe();
        };
        var requestEndpointRegistryError = function(pResult) {
          // on preview, not logged in
          var resultData = JSON.parse(pResult);
          if(resultData.status == "401") {
            self.redirectToAdminLoginScreen();
          }

          if(self.initFailCallback != null) {
            self.initFailCallback();
          }
          self.initFailed = true;
        };
        self.requestEndpointRegistry(requestEndpointRegistrySuccess,
                                     requestEndpointRegistryError);
      }
      else {
        // if there was no need to get the registry, then just
        // refresh the login state
        invokeCreateIframe();
      }
    };

    // make a request to see if we're in a preview context or not
    var checkIfPreview = function() {
      if(self.profileType != CCConstants.PROFILE_TYPE_STOREFRONT || self.previewMode)
        return;
      var previewAuthCheckFailure = function(pResult) {
        if(pResult.status == "401") {
          self.redirectToAdminLoginScreen();
        }
      };
      self.request(CCConstants.ENDPOINT_GET_MERCHANT_TIMEZONE,
                   {},
                   function(pResult) {},
                   previewAuthCheckFailure);
    };

    if(pNoRegistry) {
      if(pEndpointRegistry) {
        var registryObject = pEndpointRegistry;

        if (typeof pEndpointRegistry === 'string') {
          registryObject = JSON.parse(pEndpointRegistry);
        }

        self.endpointRegistry = registryObject.endpointMap;
        self.crossDomainRequestsEnabled = registryObject.crossDomainRequestsEnabled;
        if (self.profileType == CCConstants.PROFILE_TYPE_STOREFRONT) {
          self.initializeLastPublishedTimeStamp();
        }
      }

      if(window.isPreviewMode){
        self.previewMode = window.isPreviewMode ;
      }
      self.initProxy(location.port, location.port);
      refreshLoginState();
    }
    else {
      invokeGetRegistry();
      if(!pNoPreviewCheck)
        checkIfPreview();
    }
  };

  //----------------------------------------
  /**
   * init the message listener for cross domain
   * request callbacks
   */
  CCRestClient.prototype.initXDomainMessageListener = function() {
    var self = this;

    // listen for messages returing from the proxy
    window.addEventListener("message", function(event) {
      var origin = event.origin;

      // origin check
      if(origin != self.crossDomainURLNoPath) {
        return;
      }

      var data;
      if (typeof event.data == 'string') {
        data = JSON.parse(event.data);
      } else {
        data = event.data;
      }

      var id = data.id;
      var success = data.success;
      var payload = data.payload;
      var handler = self.eventHandlerMap[id];
      if(handler) {
        if(success) {
          handler.success(payload);
        } else {
          handler.error(payload);
        }
      }
    }, false);
  };

  //----------------------------------------
  /**
   * perform a proxy request
   */
  CCRestClient.prototype.proxyRequest = function(pTarget, pPayload,
                                                 pSuccessFunc, pErrorFunc,
                                                 pAdditionalHeadersMap) {
    var self = this;
    // increment the request id
    if(self.currentRequestId >= CCRestClient.MAX_INT) {
      self.currentRequestId = 0;
    } else {
      self.currentRequestId++;
    }

    var requestId = self.currentRequestId;
    self.eventHandlerMap[requestId] = {
      success: pSuccessFunc,
      error: pErrorFunc
    };

    // send the message
    var messageObj = {};
    messageObj.id = requestId;
    messageObj.target = pTarget;
    messageObj.payload = pPayload;
    self.proxyFrame.postMessage(JSON.stringify(messageObj), self.crossDomainURL, pAdditionalHeadersMap);
  };

  //----------------------------------------
  /**
   * determine if a proxy request is needed
   */
  CCRestClient.prototype.proxyRequestRequired = function(pEndpointSettings) {
    var self = this;
    var required = false;
    if(pEndpointSettings &&
       (pEndpointSettings.httpsRequired === true) &&
       (self.urlProtocol != "https")) {
      return true;
    }
    else {
      return false;
    }
  };

  //----------------------------------------
  /**
   * oauth login method
   */
  CCRestClient.prototype.login = function(pUser, pPassword, pSuccessFunction, pErrorFunction) {
    var self = this;
    var credentials = {user: pUser, password: pPassword};
    self.loginInternal(credentials, pSuccessFunction, pErrorFunction);
  };

  //----------------------------------------
  /**
   * oauth login method
   */
  CCRestClient.prototype.samlLogin = function(pSamlResponse, pSuccessFunction, pErrorFunction) {
    var self = this;
    var credentials = {samlResponse: pSamlResponse};
    self.loginInternal(credentials, pSuccessFunction, pErrorFunction);
  };

  //----------------------------------------
  /**
   * oauth login method
   */
  CCRestClient.prototype.loginInternal = function(pCredentials, pSuccessFunction, pErrorFunction) {
    var self = this;
    var successFunc = function(pResult) {
      // set client properties from results
      self.tokenSecret = pResult[XDomainProxy.OAUTH_ACCESS_TOKEN_PARAM];
      self.parseAndStoreClaims();
      // store the values in local storage
      self.storeToken(self.tokenSecret);
      self.loggedIn = true;
      self.setRefreshInterval();
      pSuccessFunction();
    };
    var errorFunc = function(pResult) {
      self.loggedIn = false;
      if (!pResult) {
        $.Topic(pubSub.topicNames.USER_NETWORK_ERROR).publish([{message:"failure"}]);
      } else {
        pErrorFunction(pResult);
      }
    };

    var data = {};
    if(self.previewMode) {
      // sometimes the local admin token is lost
      // after logging out preview user, so make sure we have
      // latest here
      self.resetAdminPreviewToken();
      data.tokenSecret = self.tokenSecret;
    } else {
      // Clear layout preview token
      self.clearSessionStoredValue(CCRestClient.LOCAL_STORAGE_TOKEN, CCConstants.PROFILE_TYPE_LAYOUT_PREVIEW);
    }

    if (pCredentials.samlResponse != null) {
      self.doSamlLogin(pCredentials.samlResponse, successFunc, errorFunc, data);
    }
    else  {
      self.doLogin(pCredentials.user, pCredentials.password, successFunc, errorFunc, data);
    }
  };

  //----------------------------------------
  /**
   * route the login call to the appropriate proxy
   */
  CCRestClient.prototype.doLogin = function(pUser, pPassword, pSuccessFunction, pErrorFunction,
                                            pData) {
    var self = this;
    if(self.useIframe &&
       self.proxyRequestRequired({ httpsRequired: true })) {
      self.proxyRequest("login",
                        { user: pUser, password: pPassword },
                        pSuccessFunction, pErrorFunction);
    }
    else {
      self.proxy.loginRequest(pUser, pPassword, pSuccessFunction, pErrorFunction, pData);
    }
  };

  //----------------------------------------
  /**
   * route the login call to the appropriate proxy
   */
  CCRestClient.prototype.doSamlLogin = function(pSamlResponse, pSuccessFunction, pErrorFunction,
                                            pData) {
    var self = this;
    if(self.useIframe &&
       self.proxyRequestRequired({ httpsRequired: true })) {
      self.proxyRequest("login",
                        { samlResponse: pSamlResponse },
                        pSuccessFunction, pErrorFunction);
    }
    else {
      self.proxy.samlLoginRequest(pSamlResponse, pSuccessFunction, pErrorFunction, pData);
    }
  };

  //----------------------------------------
  /**
   * Iniate the SAML login by requesting a SAML AuthnRequest
   */
  CCRestClient.prototype.generateSamlAuthnRequest = function(pSuccessFunction, pErrorFunction) {
      var self = this;

      self.authenticatedRequest(CCRestClient.SAML_AUTHN_REQUEST_SERVICE_URL, {},
        pSuccessFunction, pErrorFunction,
        XDomainProxy.POST);
  };

  //----------------------------------------
  /**
   * oauth logout method
   */
  CCRestClient.prototype.logout = function(pSuccessFunction, pErrorFunction) {
    var self = this;
    var url = CCRestClient.LOGOUT_SERVICE_PATH;
    if(self.profileType == CCConstants.PROFILE_TYPE_ADMIN) {
      url = CCRestClient.ADMIN_LOGOUT_SERVICE_PATH;
    } else if(self.profileType == CCConstants.PROFILE_TYPE_AGENT){
    	url = CCRestClient.AGENT_LOGOUT_SERVICE_PATH;
    }

    var cleanup = function() {
      self.clearStoredValues();
      self.clearValues();
      self.loggedIn = false;
      self.resetAdminPreviewToken();
    };

    var successFunc = function(pResult) {
      cleanup();
      pSuccessFunction();
    };
    var errorFunc = function(pResult) {
      cleanup();
      pErrorFunction(pResult);
    };
    self.authenticatedRequest(url, {}, successFunc, errorFunc, XDomainProxy.POST);
    self.clearRefreshInterval();
  };

  //----------------------------------------
  /**
   * oauth verify method
   * verify that the current token is still valid
   * this is the same as a refresh, without doing an actual token refresh
   */
  CCRestClient.prototype.verify = function(pSuccessFunction, pErrorFunction) {
    var self = this;
    var successFunc = function() {
      self.loggedIn = true;
      pSuccessFunction();
    };
    var errorFunc = function(pResult) {
      self.clearStoredValues();
      self.clearValues();
      self.resetAdminPreviewToken();
      pErrorFunction(pResult);
    };

    var url = CCRestClient.VERIFY_SERVICE_PATH;
    if(self.profileType == CCConstants.PROFILE_TYPE_ADMIN) {
      url = CCRestClient.ADMIN_VERIFY_SERVICE_PATH;
    } else if(self.profileType == CCConstants.PROFILE_TYPE_AGENT) {
      url = CCRestClient.AGENT_VERIFY_SERVICE_PATH;
    }
    if(self.tokenSecret) {
      self.authenticatedRequest(url, {}, successFunc, errorFunc, XDomainProxy.POST);
    } else {
      errorFunc();
    }
  };

  //----------------------------------------
  /**
   * oauth refresh method
   */
  CCRestClient.prototype.refresh = function(pSuccessFunction, pErrorFunction) {
    var self = this;
    var url = CCRestClient.REFRESH_SERVICE_PATH;
    if(self.profileType == CCConstants.PROFILE_TYPE_ADMIN || self.profileType == CCConstants.PROFILE_TYPE_LAYOUT_PREVIEW) {
      url = CCRestClient.ADMIN_REFRESH_SERVICE_PATH;
    } else if(self.profileType == CCConstants.PROFILE_TYPE_AGENT) {
      url = CCRestClient.AGENT_REFRESH_SERVICE_PATH;
    }

    var successFunc = function(pResult) {
      self.tokenSecret = pResult[XDomainProxy.OAUTH_ACCESS_TOKEN_PARAM];
      self.parseAndStoreClaims();
      self.storeToken(self.tokenSecret);
      self.loggedIn = true;
      pSuccessFunction(pResult);
    };
    var errorFunc = function(pResult) {
      // if we failed to refresh, then clear
      // out oauth settings
      if (pResult) {
        self.handleSessionExpiry();
        self.clearStoredValues();
        self.clearValues();

        self.resetAdminPreviewToken();
      }

      pErrorFunction(pResult);
    };

    if (self.tokenSecret) {
      self.authenticatedRequest(url, {}, successFunc, errorFunc, XDomainProxy.POST, false, true);
    } else {
      errorFunc();
    }
  };

  //----------------------------------------
  /**
   * register as a listener for login or logout events
   * from other tabs
   */
  CCRestClient.prototype.registerAsLoginLogoutEventListener = function() {
    var self = this;

    // deal with incoming login/logout event from other tabs
    var handleStorageFunc = function(pEvent) {
      if(!pEvent) {
        pEvent = window.event;
      }

      var url = XDomainProxy.urlHostnamePortPortionOnly(pEvent.url);

      // ignore events from other urls
      if(url != self.url) {
        return;
      }

      // login/logout events
      if(pEvent.key == self.getStoredValueName(CCRestClient.LOCAL_STORAGE_TOKEN)) {
        var loggedIn = false;

        // get the token value from the event, since it's possible
        // on some browsers (IE) that the localStorage has not been updated
        // at this point.
        if(pEvent.newValue) {
          loggedIn = true;
          self.tokenSecret = pEvent.newValue;
          self.parseAndStoreClaims();
        }

        // login
        if(loggedIn) {
          self.loggedIn = true;
          for(var loginUpdateIdx = 0; loginUpdateIdx < self.loginUpdateCallbacks.length; loginUpdateIdx++) {
            // execute each callback
            self.loginUpdateCallbacks[loginUpdateIdx]();
          }
        }
        // logout
        else {
          self.clearValues();
          for(var logoutUpdateIdx = 0; logoutUpdateIdx < self.logoutUpdateCallbacks.length; logoutUpdateIdx++) {
            // execute each callback
            self.logoutUpdateCallbacks[logoutUpdateIdx]();
          }
        }
      }

      // preview mode, getting event from
      // admin
      else if(self.previewMode &&
              pEvent.key == self.getStoredValueName(CCRestClient.LOCAL_STORAGE_TOKEN,
                                                    CCConstants.PROFILE_TYPE_ADMIN)) {
        // there's an old value, but no new value? that's a logout
        if(!pEvent.newValue && pEvent.oldValue) {
          for(var logoutUpdateIdx = 0; logoutUpdateIdx < self.logoutAdminUpdateCallbacks.length;
              logoutUpdateIdx++) {
            // execute each callback
            self.logoutAdminUpdateCallbacks[logoutUpdateIdx]();
          }
        }
        // else it's a login
        else {
          for(var loginUpdateIdx = 0; loginUpdateIdx < self.loginAdminUpdateCallbacks.length;
              loginUpdateIdx++) {
            // execute each callback
            self.loginAdminUpdateCallbacks[loginUpdateIdx]();
          }
        }
      }
    };

    if(window.addEventListener) {
      window.addEventListener("storage", handleStorageFunc, false);
    }
    else {
      window.attachEvent("onstorage", handleStorageFunc);
    }
  };

  //----------------------------------------
  /**
   * Request stored value authentication to be reloaded. Used to support
   * tabbed browser situations where logging in one one tab should
   * allow the other tab to realize authentication status may have
   * changed before performing an action.
   */
  CCRestClient.prototype.reloadStoredValueAuth = function() {
    // check local storage for oauth settings
    var tempTokenSecret = this.readToken();
    if(tempTokenSecret) {
      this.tokenSecret = tempTokenSecret;
      this.parseAndStoreClaims();

      // Check for admin token anyway, in case we're in preview mode
      this.checkPreviewWhenLoggedIn();

      return true;
    } else {
      // check to see if we're in preview mode by detecting
      // an adminui token in local storage
      return(this.resetAdminPreviewToken());
    }
  };

  //----------------------------------------
  /**
   * If shopper logged in, in preview mode,
   * don't overwrite login token
   */
  CCRestClient.prototype.checkPreviewWhenLoggedIn = function() {
    return this.resetAdminPreviewToken(true);
  }

  //----------------------------------------
  /**
   * reset auth token to be admin's auth token
   * when in preview mode
   */
  CCRestClient.prototype.resetAdminPreviewToken = function(pShopperLoggedIn) {
    var self = this;
    pShopperLoggedIn = pShopperLoggedIn && typeof pShopperLoggedIn === 'boolean';

    var adminTokenName = self.getStoredValueName(CCRestClient.LOCAL_STORAGE_TOKEN,
                                                 CCConstants.PROFILE_TYPE_ADMIN);
    var  tempTokenSecret = self.getSessionStoredValue(adminTokenName);
    if(tempTokenSecret &&
       (self.profileType == CCConstants.PROFILE_TYPE_STOREFRONT ||
        self.profileType == CCConstants.PROFILE_TYPE_LAYOUT_PREVIEW) && self.isNotStore) {
      if (!pShopperLoggedIn) {
        self.tokenSecret = tempTokenSecret;
      }

      // first time setting as preview mode
      if(!self.previewMode) {
        // register for login/logout events
        self.registerLoginAdminUpdateCallback(function() {
          self.resetAdminPreviewToken();
        });
        self.registerLogoutAdminUpdateCallback(function() {
          // logout user, clear out values and anything in local storage
          self.clearStoredValues();
          self.clearValues();
          self.loggedIn = false;
          storageApi.getInstance().removeItem("user");
          self.redirectToAdminLoginScreen();
        });
      }

      self.previewMode = true;
      return true;
    }
    else {
      return false;
    }
  };

  //----------------------------------------
  /**
   * Utility function for getting hold of the ajax configuration built up and passed to
   * jQuery.ajax() when CCRestClient.request is called. This function passes its parameters
   * along to CCRestClient.request, allowing the request method to run various configuration
   * steps, including adding authorization headers, if necessary, and then returns the
   * configuration properties without sending the request. getAjaxConfig can be used in
   * JET common model customURL implementations as a tool for building ajax configs with
   * the proper headers for Cloud.
   * @returns {Object} The jQuery ajax configuration that would be used if the given
   * parameters were passed directly to CCRestClient.request.
   */
  CCRestClient.prototype.getAjaxConfig = function(pUrl, pData,
                                                  pSuccessCallback, pErrorCallback,
                                                  pParam1, pParam2, pParam3, pParam4,
                                                  pBeforeSendCallback) {
    var ajaxConfig = null;

    // Define a function used as a substitute before-send callback in the
    // request call made below. It grabs a reference to the ajax config object
    // built by the request method and then cancels the request so it's not
    // sent. It also swaps the real before-send callback back into the ajax config.
    var beforeSend = function(jqXHR, config) {
      config.beforeSend = pBeforeSendCallback;
      ajaxConfig = config;
      return false; // Cancel the request.
    }

    this.request(pUrl, pData, pSuccessCallback, pErrorCallback, pParam1, pParam2, pParam3, pParam4, beforeSend);
    return ajaxConfig;
  };

  //----------------------------------------
  /**
   * make a rest request
   */
  CCRestClient.prototype.request = function(pUrl, pData,
                                            pSuccessCallback, pErrorCallback,
                                            pParam1, pParam2, pParam3, pParam4,
                                            pBeforeSendCallback) {

    this.requestWithSite(pUrl, false, pData, pSuccessCallback, pErrorCallback,
      pParam1, pParam2, pParam3, pParam4, pBeforeSendCallback);
  };

    //----------------------------------------
  /**
   * make a rest request
   */
  CCRestClient.prototype.requestWithSite = function(pUrl, pPassSiteId, pData,
                                            pSuccessCallback, pErrorCallback,
                                            pParam1, pParam2, pParam3, pParam4,
                                            pBeforeSendCallback) {
    var self = this;
    // lookup the url in the endpoint registry to determine if we need
    // to make an authenticated call or not
    var sendRequest = function() {
      var endpointSettings = self.registryLookup(pUrl),
        method = "GET",
        authenticated = false,
        uri = pUrl,
        headersMap = {};

      if(endpointSettings != null) {
        authenticated = endpointSettings.authRequired;
        method = endpointSettings.method;
        // if pUrl isn't a url, then get the real url
        if(uri != null && uri.charAt(0) != XDomainProxy.SLASH) {
          uri = endpointSettings.url;
        }
      }

      uri = self.insertParamsIntoUri(uri, [pParam1, pParam2, pParam3, pParam4]);

      var useProxy = false;
      if(self.useIframe &&
         self.proxyRequestRequired(endpointSettings)) {
        useProxy = true;
      }

      var successCallback = function(pResult) {
      	// If the response object contains an Etag, cache it to send back on the next PUT/POST
      	// to test version preconditions if the endpoint supports optimistic locking.
      	if (pResult && pResult[XDomainProxy.ETAG_PROPERTY]) {
      	  try {
        	  var etagObj = JSON.parse(XDomainProxy.decodeBase64(pResult[XDomainProxy.ETAG_PROPERTY]));

        	  if (etagObj && etagObj['user']) {
        	    pResult['etag_lastModifiedBy'] = etagObj['user'];
        	  }

        		self.etagCache[uri] = pResult[XDomainProxy.ETAG_PROPERTY];
      	  } catch(err) {
      	    console.log('ETAG parse error: ', err);
      	  }
      	}

        if (pResult && pResult[XDomainProxy.LAST_PUBLISHED_TIME_PROPERTY]) {
          var serverLastPublishedTimeStamp = pResult[XDomainProxy.LAST_PUBLISHED_TIME_PROPERTY];

          if (self.lastPublishedTimeStamp != null &&
              self.lastPublishedTimeStamp < serverLastPublishedTimeStamp) {
            self.lastPublishedTimeStamp = serverLastPublishedTimeStamp;
            self.isRefreshRequired = true;
          }
        }

        pSuccessCallback(pResult);
      };

      // authenticate any request as long as we are logged in
      if(!authenticated && self.loggedIn) {
        authenticated = true;
      }

      // Check if a specific locale needs to be used; add it as X-CCAsset-Language.
      headersMap = self.updateHeaderWithLocaleHint(endpointSettings);

      //Check if the selected price list group id exists in local storage; add it to X-CCPriceListGroup in headerMap.
      headersMap = self.updateHeaderWithPriceListGroupId(headersMap);

      //check if the selected organization exists in local storage; add it to X-CCOrganization in headerMap
      headersMap = self.updateHeaderWithSelectedOrganization(headersMap);

      //Check if the agentContext exists in local storage; add it to X-CCAgentContext in headerMap.
      headersMap = self.updateHeaderWithAgentContext(headersMap);

      // Add viewport header.
      headersMap = self.updateHeaderWithViewport(headersMap);

      // Add site id
      headersMap = self.updateHeaderWithSiteId(headersMap, false, pPassSiteId);

      // Handle optimistic locking for write requests if we have an ETag and the method
      // type is PUT:
      if (endpointSettings != null && endpointSettings.method === 'PUT' && self.etagCache[uri]) {
        headersMap[XDomainProxy.ETAG] = self.etagCache[uri];
        delete self.etagCache[uri];

        if (endpointSettings.useOptimisticLock) {
          headersMap['If-Match'] = headersMap[XDomainProxy.ETAG];
        }
      }

      if(authenticated == true) {
        // if the request fails with a 401,
        // send out a logout event to other tabs
        var errorFunc = function(pResult) {
          if(pResult){
            if(pResult.status == CCRestClient.HTTP_UNAUTHORIZED_ERROR) {
              self.clearStoredValues();
              self.clearValues();
              self.handleSessionExpiry();
            }
          }
          pErrorCallback(pResult);
        };
        self.authenticatedRequest(uri, pData, successCallback, errorFunc,
                                  method, useProxy, null, headersMap, pBeforeSendCallback);
      }
      else {
        self.unauthenticatedRequest(uri, pData, successCallback, pErrorCallback,
                                    method, null, headersMap, pBeforeSendCallback);
      }
    };

    self.registerInitCallback(sendRequest);
  };

  /**
   * Updates the header information based on the existence of a localeHint on
   * the endpoint settings.
   *
   * @param {Object} pEndpointSettings Map of settings for a specific endpoint.
   * @param {Object} pHeaders (Optional) Existing Map of headers
   * @param {boolean} pOverride (Default = false) Override existing locale property.
   * @param New Header Map with Locale Hint Property.
   */
  CCRestClient.prototype.updateHeaderWithLocaleHint = function(pEndpointSettings, pHeaders, pOverride) {
    // Always modify and return a copy.
    var headers = $.extend({}, pHeaders);
    var override = pOverride || false;

    // Leave if we don't have endpoint settings
    if (!pEndpointSettings) {
      return headers;
    }

    // Leave if there is an X-CCAsset-Language header already specified
    // Existing value of this should be allowed to win, unless the caller
    // has requested to override.
    if (!override && headers[XDomainProxy.ASSET_LANGUAGE_HEADER_NAME]) {
      return headers;
    }

    // Get the locale hint
    var localeHint = pEndpointSettings[CCRestClient.LOCALE_HINT];
    if (!localeHint) {
      return headers;
    }

    var requestLocale;
    if (localeHint === CCRestClient.HINT_ASSET_LANGUAGE_OPTIONAL ||
        localeHint === CCRestClient.HINT_ASSET_LANGUAGE_REQUIRED) {
      // "Content Locale" selection from the UI is stored in local storage
      // Fetch the selection from there and use it as the request locale
      var userContentLocale = JSON.parse(this.getStoredValue(CCConstants.LOCAL_STORAGE_USER_CONTENT_LOCALE));
      if(userContentLocale && userContentLocale[0]) {
        requestLocale = userContentLocale[0].name;
      } else if (localeHint === CCRestClient.HINT_ASSET_LANGUAGE_REQUIRED) {
        // Bad times, request requires a locale but local storage data is missing.
        requestLocale = "en";
      }
    }

    if (requestLocale && requestLocale.length > 0) {
      headers[XDomainProxy.ASSET_LANGUAGE_HEADER_NAME] = requestLocale;
    }

    return headers;
  };

  /**
   * Updates the header information with the PriceListGroupId.
   *
   * @param {Object} pHeaders (Optional) Existing Map of headers.
   * @param {boolean} pOverride (Default = false) Override existing Price Group Id.
   * @return New Header Map with Price List Group Id.
   */
  CCRestClient.prototype.updateHeaderWithPriceListGroupId = function(pHeaders, pOverride) {
    // Always modify and return a copy.
    var headers = $.extend({}, pHeaders);
    var override = pOverride || false;

    // Leave if there is an X-CCPriceListGroup header already specified
    // Existing value of this should be allowed to win
    if (!override && headers[XDomainProxy.PRICE_LIST_GROUP_ID]) {
      return headers;
    }

    // Fetch the selection from local storage and use it as the request price list group id
    // Set the X-CCPriceListGroup header if applicable
    var requestPriceListGroupId;
    if (typeof this.getStoredValue(CCConstants.LOCAL_STORAGE_PRICELISTGROUP_ID) === 'string') {
      requestPriceListGroupId = JSON.parse(this.getStoredValue(CCConstants.LOCAL_STORAGE_PRICELISTGROUP_ID));
    } else {
      requestPriceListGroupId = this.getStoredValue(CCConstants.LOCAL_STORAGE_PRICELISTGROUP_ID);
    }

    if(requestPriceListGroupId) {
      headers[XDomainProxy.PRICE_LIST_GROUP_ID] = requestPriceListGroupId;
    }

    return headers;
  };

  /**
   * Updates the header information with the OrganizationId.
   *
   * @param {Object} pHeaders (Optional) Existing Map of headers.
   * @param {boolean} pOverride (Default = false) Override existing value for
   *                    Organization Id.
   * @return New Header Map with Organization Id.
   */
  CCRestClient.prototype.updateHeaderWithSelectedOrganization = function(pHeaders, pOverride) {
    var self = this;

    // Always modify and return a copy.
    var headers = $.extend({}, pHeaders);
    var override = pOverride || false;

    if (!override && headers[XDomainProxy.ORGANIZATION_ID]) {
      return headers;
    }

    var requestOrgId;
    if (typeof self.getStoredValue(CCConstants.LOCAL_STORAGE_ORGANIZATION_ID) === 'string') {
      requestOrgId = JSON.parse(self.getStoredValue(CCConstants.LOCAL_STORAGE_ORGANIZATION_ID));
    } else {
      requestOrgId = self.getStoredValue(CCConstants.LOCAL_STORAGE_ORGANIZATION_ID);
    }

    if (self.profileType === CCConstants.PROFILE_TYPE_AGENT){
      requestOrgId = storageApi.getInstance().readFromMemory(CCConstants.LOCAL_STORAGE_ORGANIZATION_ID);
    }

    if (requestOrgId) {
      headers[XDomainProxy.ORGANIZATION_ID] = requestOrgId;
    }

    return headers;
  };

  /**
   * Updates the header information with the AgentContext
   *
   * @param {Object} pHeaders (Optional) Existing Map of headers.
   * @param {boolean} pOverride (Default = false) Override existing AgentContext.
   * @return New Header map with Agent Context.
   */
  CCRestClient.prototype.updateHeaderWithAgentContext = function(pHeaders, pOverride) {
    // Always modify and return a copy.
    var headers = $.extend({}, pHeaders);
    var override = pOverride || false;

    // Leave if there is an X-CCAgentContext header already specified
    // Existing value of this should be allowed to win
    if (!override && headers[XDomainProxy.AGENT_CONTEXT]) {
      return headers;
    }

    // Fetch the AgentContext from memory and use it as the request agent context,
    // i.e., set the X-CCAgentContext header if applicable
    var requestAgentContext = storageApi.getInstance().readFromMemory(CCConstants.LOCAL_STORAGE_AGENT_CONTEXT);
    if (typeof requestAgentContext === 'string')
      requestAgentContext = JSON.parse(requestAgentContext);

    if(requestAgentContext) {
      headers[XDomainProxy.AGENT_CONTEXT] = requestAgentContext;
    }

    return headers;
  };

  /**
   * Updates the header information with Viewport Hint.
   *
   * @param {Object} pHeaders (Optional) Existing Map of headers
   * @param {boolean} pOverride (Default = false) Override existing Viewport
   * @return New Header Map with Viewport hint.
   */
  CCRestClient.prototype.updateHeaderWithViewport = function(pHeaders, pOverride) {
    // Always modify and return a copy.
    var headers = $.extend({}, pHeaders);
    var override = pOverride || false;

    // Leave if there is an X-CCViewport header already specified
    // Existing value of this should be allowed to win
    if (!override && headers[XDomainProxy.VIEWPORT_HEADER_NAME]) {
      return headers;
    }

    // Get the viewport
    var userViewport = viewportHelper.viewportDesignation();
    if (userViewport) {
      headers[XDomainProxy.VIEWPORT_HEADER_NAME] = userViewport;
    }

    return headers;
  };

  /**
   * Updates the header information with Site ID.
   *
   * @param {Object} pHeaders (Optional) Existing Map of headers
   * @param {boolean} pOverride (Default = false) Override existing Site ID.
   * @param {boolean} pPassSiteId (Default = false) In Preview Mode
   * @return New Header Map with Site ID.
   */
  CCRestClient.prototype.updateHeaderWithSiteId = function(pHeaders, pOverride, pPassSiteId) {
    var self = this;

    // Always modify and return a copy.
    var headers = $.extend({}, pHeaders);
    var override = pOverride || false;
    var passSiteId = pPassSiteId || false;

    // Leave if there is an x-ccsite header already specified
    // Existing value of this should be allowed.
    if (!override && headers[XDomainProxy.SITE_ID]) {
      return headers;
    }

    // Ideally this should not be allowed on the production. But since the site
    // switching based on URL is not yet completed, the setting is turned on for
    // right now. Once done allowSiteSwitchingOnProduction can be set to false.
    var siteId;
    if (self.allowSiteSwitchingOnProduction || self.previewMode || passSiteId) {
      // Get the site id value from the local storage if it exists.
      siteId = self.getStoredValue(CCConstants.LOCAL_STORAGE_SITE_ID);
      if (siteId) {
        headers[XDomainProxy.SITE_ID] = siteId;
      }
    }

    if (self.profileType === CCConstants.PROFILE_TYPE_AGENT){
      siteId = storageApi.getInstance().readFromMemory(CCConstants.LOCAL_STORAGE_SITE_ID);
      if (siteId) {
        headers[XDomainProxy.SITE_ID] = siteId;
      }
    }

    return headers;
  };

  /**
   * DANGER!!!
   * Make a request using an overridden locale. This should only be used in very specific and
   * targeted circumstances where you absolutely need this functionality.
   * Ideally this call will disappear when more robust calling functionality is implemented
   * that allows for a robust set of translation data to be returned from the server.
   */
  CCRestClient.prototype.requestWithoutAssetLocale = function(pUrl, pData,
                                            pSuccessCallback, pErrorCallback,
                                            pParam1, pParam2, pParam3, pParam4) {
    var self = this;
    // lookup the url in the endpoint registry to determine if we need
    // to make an authenticated call or not
    var sendRequest = function() {
      var endpointSettings = self.registryLookup(pUrl),
        method = "GET",
        authenticated = false,
        uri = pUrl,
        headersMap,
        localeHint;

      if(endpointSettings != null) {
        authenticated = endpointSettings.authRequired;
        method = endpointSettings.method;
        // if pUrl isn't a url, then get the real url
        if(uri != null && uri.charAt(0) != XDomainProxy.SLASH) {
          uri = endpointSettings.url;
        }
      }

      uri = self.insertParamsIntoUri(uri, [pParam1, pParam2, pParam3, pParam4]);

      var useProxy = false;
      if(self.useIframe &&
         self.proxyRequestRequired(endpointSettings)) {
        useProxy = true;
      }

      var successCallback = function(pResult) {
        pSuccessCallback(pResult);
      };

      // authenticate any request as long as we are logged in
      if(!authenticated && self.loggedIn) {
        authenticated = true;
      }

      // Check if a specific locale needs to be used; add it as X-CCAsset-Language
      headersMap = self.updateHeaderWithLocaleHint(endpointSettings);

      // Add viewport header
      headersMap = self.updateHeaderWithViewport(headersMap);

      // Remove the locale hint unless it is required
      localeHint = endpointSettings[CCRestClient.LOCALE_HINT];
      if (!localeHint || localeHint === CCRestClient.HINT_ASSET_LANGUAGE_OPTIONAL) {
        delete headersMap[XDomainProxy.ASSET_LANGUAGE_HEADER_NAME]; //Remove the locale
      }

      if(authenticated == true) {
        // if the request fails with a 401,
        // send out a logout event to other tabs
        var errorFunc = function(pResult) {
          if(pResult){
            if(pResult.status == CCRestClient.HTTP_UNAUTHORIZED_ERROR) {
              self.clearStoredValues();
              self.clearValues();
              self.handleSessionExpiry();
            }
          }
          pErrorCallback(pResult);
        };
        self.authenticatedRequest(uri, pData, successCallback, errorFunc,
                                  method, useProxy, null, headersMap);
      }
      else {
        self.unauthenticatedRequest(uri, pData, successCallback, pErrorCallback,
                                    method, null, headersMap);
      }
    };

    self.registerInitCallback(sendRequest);
  };

  //----------------------------------------
  /**
   * make an authenticated request
   * do not call this method directly, use request() instead
   */
  CCRestClient.prototype.authenticatedRequest = function(pUrl, pData,
                                                         pSuccessCallback, pErrorCallback,
                                                         pMethod, pUseProxy,
                                                         pNoRedirectOnAuthError,
                                                         pAdditionalHeadersMap,
                                                         pBeforeSendCallback) {
    var self = this;

    self.storeRequestWasMade = true;

    var clientProps = {
      tokenSecret: self.tokenSecret,
    };

    var successFunc = function(pResult) {
      var result = pResult;
      if(result != null &&
         result.items &&
         result.autoWrap) {
        result = result.items;
      }
      pSuccessCallback(result);
    };
    var errorFunc = function(pResult, status) {
      if(self.previewMode && status == 401 &&
         !pNoRedirectOnAuthError) {
        self.redirectToAdminLoginScreen();
      }

      // call the error callback to ensure that the
      // common error callback is invoked if it is set
      // If the token secret has changed ignore the
      // error (it's a stale error from previous login)
      if(self.commonErrorCallback != null &&
          clientProps.tokenSecret === self.tokenSecret) {
        self.commonErrorCallback(pResult, status);
      }
      pErrorCallback(pResult, status);
    };

    self.doAuthRequest(pUrl, pData, successFunc, errorFunc, clientProps, pMethod,
      pUseProxy, pAdditionalHeadersMap, pBeforeSendCallback);
  };

  //----------------------------------------
  /**
   * route authenticated request call to the appropriate proxy
   */
  CCRestClient.prototype.doAuthRequest = function(pUrl, pData,
                                                  pSuccessCallback, pErrorCallback,
                                                  pClientProps, pMethod, pUseProxy,
                                                  pAdditionalHeadersMap, pBeforeSendCallback) {
    var self = this;
    if(pUseProxy) {
      if (pBeforeSendCallback) {
        throw CCRestClient.BEFORE_SEND_NOT_SUPPORTED;
      }
      self.proxyRequest("auth",
                        { url: pUrl, data: pData, clientProps: pClientProps, method: pMethod },
                        pSuccessCallback, pErrorCallback, pAdditionalHeadersMap);
    }
    else {
      // Calls the XDomainProxy (xdomain-proxy.js -> request())
      self.proxy.request(pUrl, pData, pSuccessCallback, pErrorCallback,
        pMethod, pClientProps, pAdditionalHeadersMap, pBeforeSendCallback);
    }
  };

  //----------------------------------------
  /**
   * route unauthenticated request call to the appropriate proxy
   */
  CCRestClient.prototype.unauthenticatedRequest = function(pUrl, pData,
                                                           pSuccessCallback, pErrorCallback,
                                                           pMethod, pUseProxy, pAdditionalHeadersMap,
                                                           pBeforeSendCallback) {
    var self = this;

    self.storeRequestWasMade = true;

    var successFunc = function(pResult) {
      var result = pResult;
      if(result != null &&
         result.items &&
         result.autoWrap) {
        result = result.items;
      }
      pSuccessCallback(result);
    };

    // call the error callback to ensure that the
    // common error callback is invoked if it is set
    var wrappedErrorCallback = function(pResult, status) {
      if(self.commonErrorCallback != null) {
        self.commonErrorCallback(pResult, status);
      }
      pErrorCallback(pResult, status);
    };

    if(pUseProxy) {
      if (pBeforeSendCallback) {
        throw CCRestClient.BEFORE_SEND_NOT_SUPPORTED;
      }
      self.proxyRequest("noauth",
                        { url: pUrl, data: pData, method: pMethod },
                        pSuccessCallback, wrappedErrorCallback,
                        pAdditionalHeadersMap);
    }
    else {
      self.proxy.request(pUrl, pData, successFunc, wrappedErrorCallback,
        pMethod, null, pAdditionalHeadersMap, pBeforeSendCallback);
    }
  };

  //----------------------------------------
  /**
   * issue a request to get the endpoint registry
   */
  CCRestClient.prototype.requestEndpointRegistry = function(pSuccessCallback,
                                                             pErrorCallback) {
    var self = this;
    var successFunc = function(pResult) {
      self.endpointRegistry = pResult.endpointMap;
      self.crossDomainRequestsEnabled = pResult.crossDomainRequestsEnabled;
      if (self.profileType == CCConstants.PROFILE_TYPE_STOREFRONT) {
        self.initializeLastPublishedTimeStamp();
      }
      pSuccessCallback(pResult);
    };
    var errorFunc = function(pResult) {
      pErrorCallback(pResult);
    };
    var uri = CCRestClient.ENDPOINT_REGISTRY_SERVICE_PATH;
    if(self.profileType == CCConstants.PROFILE_TYPE_ADMIN ) {
      uri = CCRestClient.ADMIN_ENDPOINT_REGISTRY_SERVICE_PATH;
    } else if(self.profileType == CCConstants.PROFILE_TYPE_AGENT) {
      uri = CCRestClient.AGENT_ENDPOINT_REGISTRY_SERVICE_PATH;
    }
    var headers = null;
    var obj = {
      dataType: XDomainProxy.JSON,
      type: XDomainProxy.GET,
      url: uri,
      processData: false,
      success: function(data, textStatus, jqXHR) {
        successFunc(data);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        var resultData = jqXHR.responseText;
        if (resultData !== "") {
          try {
            resultData = JSON.parse(resultData);
          }
          catch(error) {
          }
        }
        errorFunc(jqXHR.responseText);
      }
    };
    if(self.profileType && !self.previewMode) {
      headers = {};
      headers[XDomainProxy.PROFILE_TYPE_HEADER_NAME] = self.profileType;
    }
    if(self.tokenSecret) {
      if(headers == null)
        headers = {};
      headers[XDomainProxy.AUTH_HEADER_NAME] =
        XDomainProxy.AUTH_HEADER_PREFIX + self.tokenSecret;
    }
    if(headers) {
      obj["headers"] = headers;
    }
    $.ajax(obj);
  };

  //----------------------------------------
  /**
   * Get the last published time from the server and initialize self.lastPublishedTimeStamp
   */
  CCRestClient.prototype.initializeLastPublishedTimeStamp = function() {
    var self = this;
    var pSuccessFunc = function(pResult) {
      if (pResult && pResult.hasOwnProperty(CCRestClient.LAST_PUBLISHED_TIME_STAMP)) {
        self.lastPublishedTimeStamp = pResult[CCRestClient.LAST_PUBLISHED_TIME_STAMP];
      }
    };
    var pErrorFunc = function(pResult) {};
    self.request("getLastPublishedTime", null, pSuccessFunc, pErrorFunc);
  }

  //----------------------------------------
  /**
   * search the registry for a matching entry for the given url
   */
  CCRestClient.prototype.registryLookup = function(pUrl) {
    var self = this;
    if(this.endpointRegistry == null) {
      return null;
    }

    // break up the url into its component parts
    var urlParts = XDomainProxy.convertUrl(pUrl);
    if(urlParts == null) {
      return null;
    }
    var item = null;

    // loop through the parts, building up urls and
    // trying them against the endpoint registry
    for(var i = urlParts.length; (i > 0) && (item == null); i--) {
      var urlString = null;
      var tempUrlParts = urlParts.slice(0, i);
      urlString = tempUrlParts.join(XDomainProxy.EMPTY_STRING);

      // try the url
      item = self.endpointRegistry[urlString];

      // if there's no match, replace levels with param placeholders
      if(item == null) {
        for(var j = 0; j < tempUrlParts.length && item == null; j++) {
          // swap in placeholders
          for(var k = 0; k < j; k++) {
            var index = tempUrlParts.length - 1 - k;
            if(index == 1) {
              tempUrlParts[index] = XDomainProxy.CURLY_BRACES;
            } else {
              tempUrlParts[index] = XDomainProxy.SLASH + XDomainProxy.CURLY_BRACES;
            }
          }
          urlString = tempUrlParts.join(XDomainProxy.EMPTY_STRING);
          item = self.endpointRegistry[urlString];
        }
      }
    }

    return item;
  };

  //----------------------------------------
  /**
   * insert params into a uri
   */
  CCRestClient.prototype.insertParamsIntoUri = function(pUri, pParamsArray) {
    var uri = pUri;
    for(var i=0; i < pParamsArray.length; i++) {
      if(pParamsArray[i]) {
        uri = uri.replace(XDomainProxy.CURLY_BRACES, pParamsArray[i]);
      }
    }
    return uri;
  };

  //----------------------------------------
  /**
   * get a stored value name
   */
  CCRestClient.prototype.getStoredValueName = function(pName, pSuffix) {
    var self = this;
    var suffix = pSuffix;
    if(!suffix)
      suffix = self.profileType;
    if(!suffix) {
      return pName;
    } else {
      return pName + XDomainProxy.DASH + suffix;
    }
  };

  //----------------------------------------
  /**
   * store a token
   */
  CCRestClient.prototype.storeToken = function(pTokenSecret) {
    var self = this;
    var name = self.getStoredValueName(CCRestClient.LOCAL_STORAGE_TOKEN);
    self.setSessionStoredValue(name, pTokenSecret);
  };

  //----------------------------------------
  /**
   * read a token
   */
  CCRestClient.prototype.readToken = function() {
    var self = this;
    var name = self.getStoredValueName(CCRestClient.LOCAL_STORAGE_TOKEN);
    var token = null;
    token = self.getSessionStoredValue(name);
    return token;
  };

  //----------------------------------------
  /**
   * clear all stored values
   */
  CCRestClient.prototype.clearStoredValues = function() {
    var self = this;
    self.clearSessionStoredValue(CCRestClient.LOCAL_STORAGE_TOKEN);

    // Also remove the layout preview token if not in that profile already
    if (self.profileType !== CCConstants.PROFILE_TYPE_LAYOUT_PREVIEW) {
      self.clearSessionStoredValue(CCRestClient.LOCAL_STORAGE_TOKEN, CCConstants.PROFILE_TYPE_LAYOUT_PREVIEW);
    }
  };

  //----------------------------------------
  /**
   * clear all oauth values
   */
  CCRestClient.prototype.clearValues = function() {
    var self = this;
    self.tokenSecret = null;
    self.profileId = null;
    self.loggedIn = false;
  };

  //----------------------------------------
  /**
   * set a stored value
   */
  CCRestClient.prototype.setStoredValue = function(pName, pValue) {
    var self = this;
    var name = self.getStoredValueName(pName);
    try {
      storageApi.getInstance().setItem(name, pValue);
    }
    catch(pError) {
      // safari in private browsing mode does not allow
      // setting stored values
    }
  };

  //----------------------------------------
  /**
   * get a stored value
   */
  CCRestClient.prototype.getStoredValue = function(pName) {
    var self = this;
    var name = self.getStoredValueName(pName);
    var value = null;
    try {
      value = storageApi.getInstance().getItem(name);
    }
    catch(pError) {
    }

    return value;
  };

  //----------------------------------------
  /**
   * remove a stored value
   */
  CCRestClient.prototype.clearStoredValue = function(pName) {
    var name = this.getStoredValueName(pName);
    if (name !== undefined && name !== null ) {
      storageApi.getInstance().removeItem(name);
    }
  };

  //----------------------------------------
  /**
   * set a session stored value
   */
  CCRestClient.prototype.setSessionStoredValue = function(pName, pValue) {
    var self = this;
    try {
      storageApi.getInstance().setSessionItem(pName, pValue);
    }
    catch(pError) {
      // safari in private browsing mode does not allow
      // setting stored values
    }
  };

  //----------------------------------------
  /**
   * get a session stored value
   */
  CCRestClient.prototype.getSessionStoredValue = function(pName) {
    var self = this;
    var value = null;
    try {
      value = storageApi.getInstance().getSessionItem(pName);
    }
    catch(pError) {
    }

    return value;
  };

  //----------------------------------------
  /**
   * remove a session stored value
   */
  CCRestClient.prototype.clearSessionStoredValue = function(pName, pSuffix) {
    var name = this.getStoredValueName(pName, pSuffix);
    if (name !== undefined && name !== null ) {
      storageApi.getInstance().removeSessionItem(name);
    }
  };

  //----------------------------------------
  /**
   * parse and store token claims
   */
  CCRestClient.prototype.parseAndStoreClaims = function() {
    var self = this;
    var claims = XDomainProxy.parseClaimsFromAccessToken(self.tokenSecret);
    if(claims != null) {
      self.profileId = claims[CCConstants.TOKEN_PROFILEID_PROPERTY];
      self.profileLogin = claims[CCConstants.TOKEN_SUBJECT_PROPERTY];
      self.profileRoles = claims[CCConstants.TOKEN_ROLES_PROPERTY];
    }
  };

  //----------------------------------------
  /**
   * insert auth headers as query parameters in a
   * URI
   */
  CCRestClient.prototype.insertAuthHeadersAsQueryParams = function(pUri, pEncode) {
    return pUri;
  };

  //----------------------------------------
  /**
   * create iframe for https cross domain requests
   */
  CCRestClient.prototype.createCrossDomainIFrame = function() {
    var self = this;
    var iframeName = CCRestClient.IFRAME_NAME + "_" + self.profileType;
    var url = self.crossDomainURL;

    var iframe = document.createElement(CCRestClient.IFRAME_ELEMENT);

    iframe.setAttribute(CCRestClient.ID_ATTRIBUTE, iframeName);
    iframe.setAttribute(CCRestClient.NAME_ATTRIBUTE, iframeName);
    iframe.setAttribute(CCRestClient.WIDTH_ATTRIBUTE, CCRestClient.ZERO);
    iframe.setAttribute(CCRestClient.HEIGHT_ATTRIBUTE, CCRestClient.ZERO);
    iframe.setAttribute(CCRestClient.BORDER_ATTRIBUTE, CCRestClient.ZERO);
    iframe.setAttribute(CCRestClient.STYLE_ATTRIBUTE, CCRestClient.IFRAME_STYLE);
    iframe.setAttribute(CCRestClient.SRC_ATTRIBUTE, url);

    var iframeId = null;
    try {
      document.body.appendChild(iframe);
      window.frames[iframeName].name = iframeName;

      iframeId = document.getElementById(iframeName);
    }
    catch(pError) {
    }

    return iframeId;
  };

  //----------------------------------------
  /**
   * redirect to admin login screen
   */
  CCRestClient.prototype.redirectToAdminLoginScreen = function() {
    var self = this;
    if(!self.disableLoginErrorRedirect) {
      if (window.top !== window.self && self.profileType == CCConstants.PROFILE_TYPE_LAYOUT_PREVIEW) {
        window.top.location.href = CCRestClient.ADMIN_LOGIN_SCREEN_URL;
      } else {
        document.location.href = CCRestClient.ADMIN_LOGIN_SCREEN_URL;
      }
    }
  };

  //----------------------------------------
  /**
   * generate an authenticated (if required) url with query parameters
   */
  CCRestClient.prototype.generateAuthUrl = function(pEndpoint, pParams, pData) {
    var self = this,
  	 endpointSettings = self.registryLookup(pEndpoint),
     url = pEndpoint,
     authenticated;

    if(endpointSettings != null) {
      authenticated = endpointSettings.authRequired;
      url = endpointSettings.url;
    }
    url = self.insertParamsIntoUri(url, pParams);
    url = XDomainProxy.addQueryParams(url, pData);
    if (authenticated) {
    	url = self.insertAuthHeadersAsQueryParams(url, true);
    }
    return url;
  };

  return CCRestClient;
});

