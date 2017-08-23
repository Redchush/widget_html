// Copyright (C) 2016, Oracle and/or its affiliates. All rights reserved.
define('searchRestClientConstructor',['require','jquery','ccConstants','xDomainProxy','ccRestClient','storageApi'],function(require) {

  "use strict";

  var $ = require("jquery");
  var CCConstants = require("ccConstants");
  var XDomainProxy = require("xDomainProxy");
  var ccRestClient = require("ccRestClient");
  var storageApi = require("storageApi");

  /**
   * @alias SearchRestClient
   * @classdesc REST Client for communication with Guided Search API.
   * @version $Id$$Change$
   * @constructor
   * @param {function} commonErrorCallback Callback to use for any failed GS API request
   */
  function SearchRestClient(commonErrorCallback) {
    var self = this;

    self.apiHostname = window.location.hostname;
    self.apiPort = window.location.port;
    self.commonErrorCallback = commonErrorCallback;
    self.debug = false;
    self.refreshIntervalId = null;
    self.expirationTimeoutId = null;
    self.registry = {
      "listSearchInterfaces": {
        "method": "GET",
        "url": "/gsadmin/v1/" + CCConstants.GUIDED_SEARCH_APPLICATION + "/searchInterfaces"
      },
      "getSearchInterface": {
        "method": "GET",
        "url": "/gsadmin/v1/" + CCConstants.GUIDED_SEARCH_APPLICATION + "/searchInterfaces/{}"
      },
      "updateSearchInterface": {
        "method": "PUT",
        "url": "/gsadmin/v1/" + CCConstants.GUIDED_SEARCH_APPLICATION + "/searchInterfaces/{}"
      },
      "listIndexFields": {
        "method": "GET",
        "url": "/gsadmin/v1/" + CCConstants.GUIDED_SEARCH_APPLICATION + "/attributes.merge.json"
      },
      "getThesaurus": {
        "method": "GET",
        "url": "/gsadmin/v1/" + CCConstants.GUIDED_SEARCH_APPLICATION + "/thesaurus"
      },
      "getRedirects": {
        "method": "GET",
        "url": "/gsadmin/v1/" + CCConstants.GUIDED_SEARCH_APPLICATION + "/redirects/Default"
      },
      "deleteRedirect": {
        "method": "DELETE",
        "url": "/gsadmin/v1/" + CCConstants.GUIDED_SEARCH_APPLICATION + "/redirects/Default/{}"
      },
      "updateThesaurus": {
        "method": "PUT",
        "url": "/gsadmin/v1/" + CCConstants.GUIDED_SEARCH_APPLICATION + "/thesaurus/{}"
      },
      "addThesaurusEntry": {
        "method": "POST",
        "requestType": "application/json",
        "url": "/gsadmin/v1/" + CCConstants.GUIDED_SEARCH_APPLICATION + "/thesaurus"
      },
      "addRedirect": {
        "method": "POST",
        "requestType": "application/json",
        "url": "/gsadmin/v1/" + CCConstants.GUIDED_SEARCH_APPLICATION + "/redirects/Default"
      },
      "updateRedirect": {
        "method": "PUT",
        "url": "/gsadmin/v1/" + CCConstants.GUIDED_SEARCH_APPLICATION + "/redirects/Default/{}"
      },
      "deleteThesaurusEntry": {
        "method": "DELETE",
        "url": "/gsadmin/v1/" + CCConstants.GUIDED_SEARCH_APPLICATION + "/thesaurus/{}"
      }
    };
    self.ssoTokenKey = "GS_SSO_TOKEN";
    self.APPLICATION_JSON = "application/json";
    self.CURLY_BRACES = "{}";
    self.GET = "GET";
    self.JSON = "json";
    self.recentUserActivity = false;
    
    $('html').on("keyup.searchtimer mouseup.searchtimer", function() {
      self.recentUserActivity = true;
    });

    // remove an existing token if we reload the page
    // prevents having a dead token if page is reloaded when not in search tab, and timer does not restart
    self.removeStoredSSOToken();
  }

  /**
   * Execute a callback after the client has a valid OAuth token
   */
  SearchRestClient.prototype.registerCallback = function(userSuccessCallback) {
    var self = this;

    var ssoSuccessCallback = function() {
      // Set interval for token refresh
      if(self.refreshIntervalId !== null) {
        clearInterval(self.refreshIntervalId);
      }
      var refreshFunction = function() {
        self.refreshToken();
      };
      self.refreshIntervalId = setInterval(refreshFunction, CCConstants.TOKEN_REFRESH_INTERVAL);

      userSuccessCallback();
    };

    // may still return true when logged out?
    if(ccRestClient.loggedIn) {
      self.requireSSOToken(ssoSuccessCallback);
    }
    else {
      self.showErrorModal();
    }
  };
  
  /**
   * Make a request to the guided search API
   * 
   * Make the request after we have an SSO token.
   * 
   * @param {string} url The endpoint ID to look up in the registry
   * @param {object} data Map of params to pass as query params (GET) or json data (PUT, POST)
   * @param {function} success Function to call if request succeeds
   * @param {function} error Function to call if request fails
   * @param {string} param1 Path param 1
   * @param {string} param2 Path param 2
   * @param {string} param3 Path param 3
   * @param {string} param4 Path param 4
   * @param {function} beforeSend Function to call before sending the request (used by jet components)
   */
  SearchRestClient.prototype.request = function(url, data, success, error, param1, param2, param3, param4, beforeSend) {
    var self = this;
    var doRequestFunc = function() {
      self.doRequest(url, data, success, error, param1, param2, param3, param4, beforeSend);
    }
    self.registerCallback(doRequestFunc);
  };

  /**
   * Show the error modal
   */
  SearchRestClient.prototype.showErrorModal = function() {
    $("#errorModal").modal("show");
    $(document).off("focusin.modal");
  };

  /**
   * If SSO token exists, run the callback
   * If not, get the token then run the callback
   * 
   * @param {function} successCallback Function to call if request succeeds
   */
  SearchRestClient.prototype.requireSSOToken = function(successCallback) {
    var self = this;

    var SSOToken = self.getStoredSSOToken();
    if(SSOToken) {
      successCallback();
    }
    else {
      self.requestSSOToken(successCallback);
    }
  };

  /**
   * Request an SSO token from admin.
   * 
   * If token is returned, store it and run success callback
   * 
   * @param {function} successUserCallback Function to call if request succeeds
   */
  SearchRestClient.prototype.requestSSOToken = function(successUserCallback) {
    var self = this,
      url = CCConstants.ENDPOINT_SSO_GET_TOKEN,
      data = {};

    var successCallback = function(result) {
      self.setStoredSSOToken(result.token);
      self.resetExpirationTimer();

      if(successUserCallback) {
        successUserCallback();
      };
    };

    var errorCallback = function(result, status) {
      self.showErrorModal();
    };
    ccRestClient.request(url, data, successCallback, errorCallback);
  };

  /**
   * Reset token expiration timer.
   * Create the timer if it doesn't exist.
   */
  SearchRestClient.prototype.resetExpirationTimer = function() {
    var self = this;

    if(self.expirationTimeoutId !== null) {
      clearTimeout(self.expirationTimeoutId);
    }

    var expirationFunction = function() {
      clearInterval(self.refreshIntervalId);
      self.removeStoredSSOToken();
    };

    self.expirationTimeoutId = setTimeout(expirationFunction, CCConstants.GS_TOKEN_TIMEOUT);
  };

  /**
   * Refresh the sso token
   */
  SearchRestClient.prototype.doRefreshToken = function() {
    var self = this,
      url = CCConstants.ENDPOINT_SSO_REFRESH_TOKEN,
      data = {};

    data.token = self.getStoredSSOToken();

    var successCallback = function(result) {
      self.setStoredSSOToken(result.token);
      self.resetExpirationTimer();
    };
    var errorCallback = function(result, status) {
      self.requestSSOToken();
    };
    ccRestClient.request(url, data, successCallback, errorCallback);
  };

  /**
   * If recent user activity is present, refresh token
   */
  SearchRestClient.prototype.refreshToken = function() {
    var self = this;
    if(self.recentUserActivity === true) {
      self.recentUserActivity = false;
      if (ccRestClient.loggedIn) {
        self.doRefreshToken();
      }
    }
  };

  /**
   * Get sso token from session storage
   */
  SearchRestClient.prototype.getStoredSSOToken = function() {
    return storageApi.getInstance().getSessionItem(this.ssoTokenKey);
  };

  /**
   * Set sso token in session storage
   * 
   * @param {string} token The token to store
   */
  SearchRestClient.prototype.setStoredSSOToken = function(token) {
    storageApi.getInstance().setSessionItem(this.ssoTokenKey, token);
  };

  /**
   * Remove sso token in session storage
   */
  SearchRestClient.prototype.removeStoredSSOToken = function() {
    storageApi.getInstance().removeSessionItem(this.ssoTokenKey);
  };

  /**
   * Get endpoint info from registry
   * 
   * @param {string} url The url to look up
   * @returns {Object} An object containing properties of the endpoint
   */
  SearchRestClient.prototype.getEndpointInfo = function(url) {
    var endpoint = this.registry[url];
    return endpoint;
  };

  //----------------------------------------
  /**
   * Utility function for getting hold of the ajax configuration built up and passed to
   * jQuery.ajax() when searchRestClient.request is called. The function passes the parameters
   * along to searchRestClient.request, allowing it to run various configuration steps, including
   * adding authorization headers, if necessary, and then returns the configuration properties
   * without sending the request. Can be used for customURL implementations of JET components
   * that make their own ajax calls.
   * 
   * @param {string} url The endpoint ID to look up in the registry
   * @param {object} data Map of params to pass as query params (GET) or json data (PUT, POST)
   * @param {function} success Function to call if request succeeds
   * @param {function} error Function to call if request fails
   * @param {string} param1 Path param 1
   * @param {string} param2 Path param 2
   * @param {string} param3 Path param 3
   * @param {string} param4 Path param 4
   * @param {function} beforeSendFunc Function to call before sending the request (used by jet components)
   * @returns {Object} The ajax configuration that would be used if the given parameters
   * were passed directly to searchRestClient.request.
   */
  SearchRestClient.prototype.getAjaxConfig = function(url, data, success, error, param1, param2, param3, param4, beforeSendFunc) {
    var ajaxConfig = null;

    // Use this beforeSend in the request call below to set the ajaxConfig.
    // Swaps itself out of the config and puts the original beforeSend callback in.
    var beforeSend = function(jqXHR, config) {
      config.beforeSend = beforeSendFunc;
      ajaxConfig = config;
      return false; // Cancel the request.
    }

    this.request(url, data, success, error, param1, param2, param3, param4, beforeSend);
    return ajaxConfig;
  };

  /**
   * Look up the endpoint URL and method, then make the ajax request
   * 
   * @param {string} urlID The endpoint ID to look up in the registry
   * @param {object} data Map of params to pass as query params (GET) or json data (PUT, POST)
   * @param {function} success Function to call if request succeeds
   * @param {function} error Function to call if request fails
   * @param {string} param1 Path param 1
   * @param {string} param2 Path param 2
   * @param {string} param3 Path param 3
   * @param {string} param4 Path param 4
   * @param {function} beforeSend Function to call before sending the request (used by jet components)
   */
  SearchRestClient.prototype.doRequest = function(urlID, data, requestSuccessCallback, requestErrorCallback, param1, param2, param3, param4, beforeSend) {
    var self = this;
    var endpoint = this.getEndpointInfo(urlID);
    this.doRequestWithURL(endpoint.url, endpoint.method, data, requestSuccessCallback, requestErrorCallback, param1, param2, param3, param4, beforeSend);
  };

  /**
   * Actually make the ajax request and execute callback
   * 
   * @param {string} urlPath The url to request
   * @param {string} method The method for the request
   * @param {object} data Map of params to pass as query params (GET) or json data (PUT, POST)
   * @param {function} success Function to call if request succeeds
   * @param {function} error Function to call if request fails
   * @param {string} param1 Path param 1
   * @param {string} param2 Path param 2
   * @param {string} param3 Path param 3
   * @param {string} param4 Path param 4
   * @param {function} beforeSend Function to call before sending the request (used by jet components)
   */
  SearchRestClient.prototype.doRequestWithURL = function(urlPath, method, data, requestSuccessCallback, requestErrorCallback, param1, param2, param3, param4, beforeSend) {
    var self = this,
      url,
      options = {}, 
      headers = {},
      stringData = "";
    url = this.insertParamsIntoUri(urlPath, [param1, param2, param3, param4]);

    if(method === this.GET) {
      url = XDomainProxy.addQueryParams(url, data, true);
    }
    else {
      stringData = JSON.stringify(data);
    }

    headers[CCConstants.AUTHORIZATION_HEADER] = CCConstants.BEARER + " " + this.getStoredSSOToken();

    var ajaxRequestSuccessCallback = function(result) {
      var resultData = result.data;
      requestSuccessCallback(resultData);
    };

    var ajaxRequestErrorCallback = function(result) {
      var resultStatus = result.jqXHR.status;
      var resultData = result.jqXHR.responseText;
      if (resultData) {
        try {
          resultData = JSON.parse(resultData);
        }
        catch(e) {
          resultData = null;
        }
      }
      requestErrorCallback(resultData, resultStatus);
      self.commonErrorCallback(resultData, resultStatus);
    };

    if (method==='GET')
      options.cache = false; // Fix for CCSUI-812, CCSUI-893
    options.method = method;
    options.url = this.fullURL(url);
    options.contentType = this.APPLICATION_JSON,
    options.dataType = this.JSON,
    options.processData = false;
    options.jsonp = false;
    options.success = function(data, textStatus, jqXHR) {
      ajaxRequestSuccessCallback({data: data, textStatus: textStatus, jqXHR: jqXHR});
    },
    options.error = function(jqXHR, textStatus, errorThrown) {
      ajaxRequestErrorCallback({jqXHR: jqXHR, textStatus: textStatus, errorThrown: errorThrown});
    },
    options.headers = headers;
    options.beforeSend = beforeSend;
    if(stringData) {
      options.data = stringData;
    }

    $.ajax(options);
  };

  /**
   * Return the full URL including protocol, host, port and path.
   * 
   * @param {string} url The base URL of the endpoint
   * @returns {string} The full URL
   */
  SearchRestClient.prototype.fullURL = function(url) {
    var full, port = "";
    if(this.apiPort) {
      port = ":" + this.apiPort;
    }
    full = location.protocol + "//" + this.apiHostname + port + url;
    return full;
  };

  /**
   * Replace placeholders with param values
   * 
   * @param {string} uri URI in which to replace params
   * @param {string} paramsArray Array of params to replace
   * @returns {string} The URI with params inserted
   */
  SearchRestClient.prototype.insertParamsIntoUri = function(uri, paramsArray) {
    for(var i=0; i < paramsArray.length; i++) {
      if(paramsArray[i]) {
        uri = uri.replace(this.CURLY_BRACES, paramsArray[i]);
      }
    }
    return uri;
  };

  return SearchRestClient;
});

