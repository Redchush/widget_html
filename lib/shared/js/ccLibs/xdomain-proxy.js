//----------------------------------------
/**
 * this library depends on jquery
 */

define('xDomainProxy',['jquery'], function($) {

  "use strict";

  //----------------------------------------
  /**
   * constructor
   */
  function XDomainProxy(pProfileType, pHttpPort, pHttpsPort) {
    var self = this;
    self.profileType = pProfileType;
    self.httpPort = pHttpPort || "8080";
    self.httpsPort = pHttpsPort || "8443";


    self.parentURL = XDomainProxy.getCrossDomainURL(pProfileType,
                                                    XDomainProxy.HTTP_PROTOCOL,
                                                    self.httpPort,
                                                    false);

    // if the parent doc is https, then we don't need to post a message
    if(document.referrer &&
       XDomainProxy.urlProtocolOnly(document.referrer) != XDomainProxy.HTTPS_PROTOCOL) {
      // post a message informing that we've loaded
      if(window != null && window.parent !=null) {
        window.parent.postMessage(JSON.stringify({
          id: XDomainProxy.IFRAME_INIT_COMPLETE_EVENT,
          success: true,
          payload: null
        }), self.parentURL);
      }
    }
  }

  // constants
  XDomainProxy.POST = "POST";
  XDomainProxy.GET = "GET";
  XDomainProxy.DELETE = "DELETE";
  XDomainProxy.METHOD = "method";
  XDomainProxy.URL = "url";
  XDomainProxy.DATA = "data";
  XDomainProxy.SUCCESS = "success";
  XDomainProxy.FAILURE = "failure";
  XDomainProxy.HEADERS = "headers";
  XDomainProxy.CONTENT_TYPE = "Content-Type";
  XDomainProxy.ACCEPT = "Accept";
  XDomainProxy.TEXT_PLAIN = "text/plain";
  XDomainProxy.APPLICATION_JSON = "application/json";
  XDomainProxy.JSON = "json";
  XDomainProxy.ETAG = "ETag";
  XDomainProxy.ETAG_PROPERTY = "___etag___";
  XDomainProxy.LAST_PUBLISHED_TIME = "LastPublishedTime";
  XDomainProxy.LAST_PUBLISHED_TIME_PROPERTY = "lastPublishedTime";

  XDomainProxy.AMPERSAND = "&";
  XDomainProxy.EQUALS = "=";
  XDomainProxy.DOUBLE_SLASH = "//";
  XDomainProxy.SLASH = "/";
  XDomainProxy.EMPTY_STRING = "";
  XDomainProxy.PROTOCOL_SEP = "://";
  XDomainProxy.COLON = ":";
  XDomainProxy.QUESTION_MARK = "?";
  XDomainProxy.SPACE = " ";
  XDomainProxy.SEMICOLON = ";";
  XDomainProxy.DASH = "-";
  XDomainProxy.CURLY_BRACES = "{}";
  XDomainProxy.PERIOD = ".";

  XDomainProxy.OAUTH_ACCESS_TOKEN_PARAM = "access_token";

  XDomainProxy.LOGIN_SERVICE_PATH = "/ccstoreui/v1/login/";
  XDomainProxy.ADMIN_LOGIN_SERVICE_PATH = "/ccadminui/v1/login/";
  XDomainProxy.AGENT_LOGIN_SERVICE_PATH = "/ccagentui/v1/login/";
  XDomainProxy.HTTP_PROTOCOL = "http";
  XDomainProxy.HTTPS_PROTOCOL = "https";
  XDomainProxy.HTTPS_FRAME_PATH = "/https/https.html";
  XDomainProxy.HTTPS_ADMIN_FRAME_PATH = "/https/httpsAdmin.html";

  XDomainProxy.GRANT_TYPE_PARAM = "grant_type";
  XDomainProxy.PASSWORD_GRANT_TYPE_VALUE = "password";
  XDomainProxy.USERNAME_PARAM = "username";
  XDomainProxy.PASSWORD_PARAM = "password";
  XDomainProxy.SAML_GRANT_TYPE_VALUE = "saml_credentials";
  XDomainProxy.SAML_RESPONSE_PARAM = "saml_response";
  

  XDomainProxy.AUTH_HEADER_NAME = "Authorization";
  XDomainProxy.AUTH_HEADER_PREFIX = "Bearer ";
  XDomainProxy.PROFILE_TYPE_HEADER_NAME = "X-CCProfileType";

  XDomainProxy.IFRAME_INIT_COMPLETE_EVENT = "iframeInitComplete";

  XDomainProxy.ASSET_LANGUAGE_HEADER_NAME = "X-CCAsset-Language";
  XDomainProxy.PRICE_LIST_GROUP_ID = "X-CCPriceListGroup";
  XDomainProxy.ORGANIZATION_ID = "X-CCOrganization";
  XDomainProxy.AGENT_CONTEXT = "X-CCAgentContext";

  XDomainProxy.VIEWPORT_HEADER_NAME = "X-CCViewport";
  XDomainProxy.SITE_ID = "x-ccsite";

  //----------------------------------------
  /**
   * init function
   */
  XDomainProxy.prototype.init = function() {
    var self = this;

    // a map of method names to functions
    self.targetMap = {
      "login": function(pPayload, pSuccessFunc, pErrorFunc) {
        self.loginRequest(pPayload.user, pPayload.password, pSuccessFunc, pErrorFunc);
      },
      "auth": function(pPayload, pSuccessFunc, pErrorFunc) {
        self.request(pPayload.url, pPayload.data, pSuccessFunc, pErrorFunc,
                     pPayload.method, pPayload.clientProps);
      },
      "noauth": function(pPayload, pSuccessFunc, pErrorFunc) {
        self.request(pPayload.url, pPayload.data, pSuccessFunc, pErrorFunc,
                     pPayload.method);
      }
    };

    // create the event listener function
    var eventListener = function(pEvent) {
      var origin = pEvent.origin;

      // origin check
      if(origin != self.parentURL) {
        return;
      }

      var data;
      if (typeof pEvent.data == 'string') {
        data = JSON.parse(pEvent.data);
      } else {
        data = pEvent.data;
      }

      var id = data.id;
      var target = data.target;
      var payload = data.payload;

      var commonFunc = function(pSuccess, pResult) {
        var result = {};
        result.id = id;
        result.success = pSuccess;
        result.payload = pResult;

        // send the result back to the main window
        pEvent.source.postMessage(JSON.stringify(result), origin);
      };
      var successFunc = function(pResult) {
        commonFunc(true, pResult);
      };
      var errorFunc = function(pResult) {
        commonFunc(false, pResult);
      };

      var exe = self.targetMap[target];
      if(exe) {
        exe(payload, successFunc, errorFunc);
      }
    };

    // setup the event listener
    window.addEventListener("message", eventListener, false);
  };

  //----------------------------------------
  /**
   * login
   */
  XDomainProxy.prototype.loginRequest = function(pUser, pPassword, pSuccessFunction,
                                                 pErrorFunction, pData) {
    var self = this;    
    var credentials = {};
    credentials[XDomainProxy.USERNAME_PARAM] = pUser;
    credentials[XDomainProxy.PASSWORD_PARAM] = pPassword;
    credentials[XDomainProxy.GRANT_TYPE_PARAM] = XDomainProxy.PASSWORD_GRANT_TYPE_VALUE;
    self.loginRequestInternal(credentials, pSuccessFunction, pErrorFunction, pData);
  }
  
  //----------------------------------------
  /**
   * SamlLogin
   */
  XDomainProxy.prototype.samlLoginRequest = function(pSamlResponse, pSuccessFunction,
                                                  pErrorFunction, pData) {
    var self = this;    
    var credentials = {};
    credentials[XDomainProxy.SAML_RESPONSE_PARAM] = pSamlResponse;
    credentials[XDomainProxy.GRANT_TYPE_PARAM] = XDomainProxy.SAML_GRANT_TYPE_VALUE;
    self.loginRequestInternal(credentials, pSuccessFunction, pErrorFunction, pData);
  }
  
  //----------------------------------------
  /**
   * login
   */
  XDomainProxy.prototype.loginRequestInternal = function(pCredentials, pSuccessFunction,
                                                 pErrorFunction, pData) {
    var self = this;
    var loginServicePath = XDomainProxy.LOGIN_SERVICE_PATH;
    if(self.profileType == "admin" ||
       self.profileType == "adminUI") {
      loginServicePath = XDomainProxy.ADMIN_LOGIN_SERVICE_PATH;
    } else if(self.profileType == "agent" ||
              self.profileType == "agentUI") {
      loginServicePath = XDomainProxy.AGENT_LOGIN_SERVICE_PATH;
    }

    var data = {};
    data[XDomainProxy.GRANT_TYPE_PARAM] = pCredentials[XDomainProxy.GRANT_TYPE_PARAM];
    
    if (pCredentials[XDomainProxy.GRANT_TYPE_PARAM] == XDomainProxy.PASSWORD_GRANT_TYPE_VALUE) {
      data[XDomainProxy.USERNAME_PARAM] = pCredentials[XDomainProxy.USERNAME_PARAM];    
      data[XDomainProxy.PASSWORD_PARAM] = pCredentials[XDomainProxy.PASSWORD_PARAM];
    }
    else if (pCredentials[XDomainProxy.GRANT_TYPE_PARAM] == XDomainProxy.SAML_GRANT_TYPE_VALUE) {
      data[XDomainProxy.SAML_RESPONSE_PARAM] = pCredentials[XDomainProxy.SAML_RESPONSE_PARAM];
    }
    
    // success function
    var successFunc = function(pResult) {
      var resultData = pResult.data;
      pSuccessFunction(resultData);
    };
    // error function
    var errorFunc = function(pResult) {
      var resultData = pResult.jqXHR.responseText;
      if (resultData) {
        resultData = JSON.parse(resultData);
      }
      pErrorFunction(resultData);
    };

    var headers = null;

    var suppressProfileType = false;
    if(pData)
      suppressProfileType = pData.suppressProfileType;

    // add profile type only if profile type is set
    // unless we are in preview mode
    if(self.profileType && !suppressProfileType) {
      headers = {};
      headers[XDomainProxy.PROFILE_TYPE_HEADER_NAME] = self.profileType;
    }

    if(pData && pData.tokenSecret) {
      if(!headers) {
        headers = {};
      }
      var authHeaderString = XDomainProxy.AUTH_HEADER_PREFIX + pData.tokenSecret;
      headers[XDomainProxy.AUTH_HEADER_NAME] = authHeaderString;
    }

    var obj = {
      type: XDomainProxy.POST,
      dataType: XDomainProxy.JSON,
      url: loginServicePath,
      data: data,
      processData: true,
      success: function(data, textStatus, jqXHR) {
        successFunc({data: data, textStatus: textStatus, jqXHR: jqXHR});
      },
      error: function(jqXHR, textStatus, errorThrown) {
        errorFunc({jqXHR: jqXHR, textStatus: textStatus, errorThrown: errorThrown});
      }
    };

    if(headers) {
      obj["headers"] = headers;
    }

    // perform the login request
    $.ajax(obj);
  };

  //----------------------------------------
  /**
   * request
   * @param {function} pBeforeSendCallback (Optional) If set, this function is invoked immediately
   * before the actual ajax call to the server. If the function returns false, the ajax call is not made.
   * (See jQuery.ajax beforeSend setting.)
   */
  XDomainProxy.prototype.request = function(pUrl, pData,
                                            pSuccessCallback, pErrorCallback,
                                            pMethod, pClientProps,
                                            pAdditionalHeadersMap,
                                            pBeforeSendCallback) {
    var assetLanguage,
        self = this,
        url = pUrl;

    // make sure the url is encoded
    url = encodeURI(url);

    var method = pMethod;
    if(!method) {
      method = XDomainProxy.GET;
    }
    var stringData = null;

    if(pData) {
      // if it's a get, turn data into query params
      if(method === XDomainProxy.GET || method === XDomainProxy.DELETE) {
        url = XDomainProxy.addQueryParams(url, pData, true);
      }
      // for anything else, convert data into json string
      else {
        stringData = JSON.stringify(pData);
      }
    }

    if(method === XDomainProxy.GET) {
      url = XDomainProxy.fixIECaching(url);
    }

    var successFunc = function(pResult) {
      var resultData = pResult.data;
        var etag = pResult.jqXHR.getResponseHeader(XDomainProxy.ETAG);

        if(etag && resultData) {
          // etag is appended with extra quotes in Safari browser.
          // So removing extra quotes from etag.
          etag = etag.replace(/["]+/g, "");
         
          resultData[XDomainProxy.ETAG_PROPERTY] = etag;
        }

        var lastPublishedTime = pResult.jqXHR.getResponseHeader(XDomainProxy.LAST_PUBLISHED_TIME);
        if (resultData && lastPublishedTime) {
          resultData[XDomainProxy.LAST_PUBLISHED_TIME_PROPERTY] = Number(lastPublishedTime);
        }
      pSuccessCallback(resultData);
    };
    var errorFunc = function(pResult) {
      var resultStatus = pResult.jqXHR.status;
      var resultData = pResult.jqXHR.responseText;
      if (resultData) {
        try {
          resultData = JSON.parse(resultData);
        }
        catch(e) {
          resultData = {};
        }
      }
      pErrorCallback(resultData, resultStatus);
    };

    var obj = {
      dataType: XDomainProxy.JSON,
      contentType: XDomainProxy.APPLICATION_JSON,
      type: method,
      url: url,
      processData: false,
      success: function(data, textStatus, jqXHR) {
        successFunc({data: data, textStatus: textStatus, jqXHR: jqXHR});
      },
      error: function(jqXHR, textStatus, errorThrown) {
        errorFunc({jqXHR: jqXHR, textStatus: textStatus, errorThrown: errorThrown});
      },
      beforeSend: pBeforeSendCallback
    };

    var headers = null;

    var suppressProfileType = false;
    if(pClientProps)
      suppressProfileType = pClientProps.suppressProfileType;

    // add profile type only if profile type is set
    // unless we are in preview mode
    if(self.profileType && !suppressProfileType) {
      headers = {};
      headers[XDomainProxy.PROFILE_TYPE_HEADER_NAME] = self.profileType;
    }

    // Setup the additional headers
    if (pAdditionalHeadersMap) {
      if (!headers) {
        headers = {};
      }

      for(var headerName in pAdditionalHeadersMap) {
        if(pAdditionalHeadersMap.hasOwnProperty(headerName)) {
          if (pAdditionalHeadersMap[headerName] instanceof Object) {
            // If the header contains an object, it should be passed as a plain string to Jersey
            headers[headerName] = JSON.stringify(pAdditionalHeadersMap[headerName]);
          } else {
            headers[headerName] = pAdditionalHeadersMap[headerName];
          }
        }
      }
    }

    // Add auth header string
    if(pClientProps && pClientProps.tokenSecret) {
      if(!headers) {
        headers = {};
      }
      var authHeaderString = XDomainProxy.AUTH_HEADER_PREFIX + pClientProps.tokenSecret;
      headers[XDomainProxy.AUTH_HEADER_NAME] = authHeaderString;
    }

    if(stringData) {
      obj["data"] = stringData;
    }
    if(headers) {
      obj["headers"] = headers;
    }
    $.ajax(obj);
  };

  //----------------------------------------
  // static methods
  //----------------------------------------

  //----------------------------------------
  /**
   * parse query params into a map
   */
  XDomainProxy.parseQueryParams = function(pParams) {
    if(pParams === null) {
      return null;
    }
    var pairs = pParams.split(XDomainProxy.AMPERSAND);
    var paramMap = {};
    for(var i=0; i < pairs.length; i++) {
      var pair = pairs[i].split(XDomainProxy.EQUALS);
      paramMap[pair[0]] = pair[1];
    }
    return paramMap;
  };

  //----------------------------------------
  /**
   * add query params to a url
   */
  XDomainProxy.addQueryParams = function(pUrl, pData, pEncode) {
    if(!pUrl) {
      return null;
    }
    if(!pData) {
      return pUrl;
    }
    var keys = Object.keys(pData);
    if(keys && keys.length === 0) {
      return pUrl;
    }

    var url = pUrl;
    var needsQuestionMark = true;
    if(url.indexOf("?") !== -1) {
      needsQuestionMark = false;
    }

    for(var i=0; i < keys.length; i++) {
      var key = keys[i];
      var value = pData[keys[i]];
      if(pEncode) {
        key = encodeURIComponent(key);
        value = encodeURIComponent(value);
      }
      var pair = key + "=" + value;
      var sep = "&";
      if(needsQuestionMark) {
        sep = "?";
        needsQuestionMark = false;
      }
      url += sep + pair;
    }

    return url;
  };

  //----------------------------------------
  /**
   * get a timestamp
   */
  XDomainProxy.getTimestamp = function(pOffset) {
    var current = new Date() / 1000;
    var offset = parseInt(pOffset, 10);
    var withOffset = current + offset;
    return parseInt(+ withOffset, 10);
  };

  //----------------------------------------
  /**
   * get the cross domain url
   */
  XDomainProxy.getCrossDomainURL = function(pProfileType,
                                            pProtocol,
                                            pPort,
                                            pWithFramePath) {
    var crossDomainURL =
      pProtocol +
      XDomainProxy.PROTOCOL_SEP +
      XDomainProxy.urlHostnameOnly(window.location.href) +
      XDomainProxy.COLON +
      pPort;

    if(pWithFramePath === true) {
      if(pProfileType === "storefront" ||
          pProfileType == "storefrontUI") {
        crossDomainURL += XDomainProxy.HTTPS_FRAME_PATH;
      }
      else if(pProfileType === "admin" ||
          pProfileType == "adminUI") {
        crossDomainURL += XDomainProxy.HTTPS_ADMIN_FRAME_PATH;
      }
    }
    return crossDomainURL;
  };

  //----------------------------------------
  /**
   * split a url string into its component parts
   */
  XDomainProxy.convertUrl = function(pUrl) {
    // if it's not a url, just return it
    if(pUrl != null && pUrl.charAt(0) != XDomainProxy.SLASH) {
      return [pUrl];
    }

    var url = XDomainProxy.urlPathPortionOnly(pUrl);

    var rawParts = url.split(XDomainProxy.SLASH);
    // if the array only has one element, just return slash
    if(rawParts.length == 1) {
      return [XDomainProxy.SLASH];
    }
    // if the first element is empty, get rid of it
    if(!rawParts[0]) {
      rawParts = rawParts.slice(1);
    }

    var parts = new Array( rawParts.length + 1);
    parts[0] = XDomainProxy.SLASH;
    parts[1] = rawParts[0];

    for(var i=1; i < rawParts.length; i++) {
      parts[i+1] = XDomainProxy.SLASH + rawParts[i];
    }

    return parts;
  };

  //----------------------------------------
  /**
   * get a url with no query params or protocol
   */
  XDomainProxy.urlNoProtocolOrQueryParams = function(pUrl) {
    if(pUrl == null) {
      return null;
    }
    // first chop off any query params
    var rawParts = pUrl.split(XDomainProxy.QUESTION_MARK);
    var url = null;
    if(rawParts.length > 1) {
      url = rawParts[0];
    }
    else {
      url = pUrl;
    }

    // remove any protocol info
    rawParts = url.split(XDomainProxy.PROTOCOL_SEP);
    if(rawParts.length > 1) {
      // chop off the protocol
      url = rawParts[1];
    }

    return url;
  };

  //----------------------------------------
  /**
   * get only the path portion of a url
   */
  XDomainProxy.urlPathPortionOnly = function(pUrl) {
    var url = XDomainProxy.urlNoProtocolOrQueryParams(pUrl);

    // remove the host/port info
    if(url.substring(0,1) !== XDomainProxy.SLASH) {
      url = XDomainProxy.removeBeforeFirstSlash(url);
    }

    return url;
  };

  //----------------------------------------
  /**
   * get only the hostname + port portion of a url
   */
  XDomainProxy.urlHostnamePortPortionOnly = function(pUrl) {
    var url = XDomainProxy.urlNoProtocolOrQueryParams(pUrl);

    // if there's no hostname + port, then return null
    if(url.substring(0,1) == XDomainProxy.SLASH) {
      return null;
    }

    var rawParts = url.split(XDomainProxy.SLASH);
    return rawParts[0];
  };

  //----------------------------------------
  /**
   * get only the hostname of a url
   */
  XDomainProxy.urlHostnameOnly = function(pUrl) {
    var url = XDomainProxy.urlHostnamePortPortionOnly(pUrl);
    var parts = url.split(XDomainProxy.COLON);
    return parts[0];
  };

  //----------------------------------------
  /**
   * get only the protocol of a url
   */
  XDomainProxy.urlProtocolOnly = function(pUrl) {
    var rawParts = pUrl.split(XDomainProxy.PROTOCOL_SEP);
    return rawParts[0];
  };

  //----------------------------------------
  /**
   * remove everything before the first slash in a string
   */
  XDomainProxy.removeBeforeFirstSlash = function(pUrl) {
    var rawParts = pUrl.split(XDomainProxy.SLASH);
    var url = pUrl.substring(rawParts[0].length);
    return url;
  };

  /**
   * Fix for IE to prevent caching of GET requests.
   */
  XDomainProxy.fixIECaching = function(url) {
    // removed cache-busting query param since it
    // prevents all caching
    return url;
  };

  //----------------------------------------
  /**
   * insert auth headers as query parameters in a URI
   */
  XDomainProxy.insertAuthHeadersAsQueryParams = function(pUri, pConfig, pEncode) {
    return uri;
  };

  //----------------------------------------
  /**
   * parse out the profile id from an access token
   */
  XDomainProxy.parseClaimsFromAccessToken = function(pAccessToken) {
    if(!pAccessToken) {
      return null;
    }
    var parts = pAccessToken.split(XDomainProxy.PERIOD);
    var tokenBody = parts[1];
    var decodedBody = XDomainProxy.decodeBase64(tokenBody);
    var json = JSON.parse(decodedBody);
    return json;
  };

  //----------------------------------------
  /**
   * decode base64
   */
  XDomainProxy.decodeBase64 = function(s) {
    var e={},i,b=0,c,x,l=0,a,r='',w=String.fromCharCode,L=s.length;
    var A="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    for(i=0;i<64;i++){e[A.charAt(i)]=i;}
    for(x=0;x<L;x++){
      c=e[s.charAt(x)];b=(b<<6)+c;l+=6;
      while(l>=8){((a=(b>>>(l-=8))&0xff)||(x<(L-2)))&&(r+=w(a));}
    }
    return r;
  };

  return XDomainProxy;
});

