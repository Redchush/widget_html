define(
// -------------------------------------------------------------------
// PACKAGE NAME
// -------------------------------------------------------------------

// -------------------------------------------------------------------
// DEPENDENCIES
// -------------------------------------------------------------------
'storageApi',[ 'knockout',
  'xDomainProxy' ],

// -------------------------------------------------------------------
// MODULE DEFINITION
// -------------------------------------------------------------------
function(ko, XDomainProxy) {

  "use strict";
  //----------------------------------------
  /**
   * constructor
   */
  function StorageApi() {
    if (StorageApi.singleInstance) {
      throw new Error(
          "Cannot instantiate more than one StorageApi, use getInstance()");
    }

    var self = this;

    self.data = {};

    self.validSyncSessionKeyPrefixes = [
      "oauth_token_secret"
    ];
    try {
       self.storage = window.localStorage;
       self.sessionStorage = window.sessionStorage;
    } catch (pError) {
       
    }

    self.sessionStorageSupported = false;
    self.localStorageSupported = false;

    //----------------------------------------
    /**
     * check to see if we are on IE or Edge
     */
    self.isIE = function() {
      if(navigator.userAgent.match(/Trident/) ||
         navigator.userAgent.match(/Edge/)) {
        return true;
      }
      return false;
    };

    // IE doesn't save session storage values when tab
    // navigates to different domain, so need to use localStorage
    if(self.isIE()) {
      try {
        self.sessionStorage = window.localStorage;
      } catch (pError) {
      
      }
    }
    
    self.url = XDomainProxy.urlHostnamePortPortionOnly(document.URL);

    self.isSessionStorageSynced = false;

    //----------------------------------------
    // check if local storage is enabled in the current browser session 
    self.hasLocalStorageSupport = function() {
      try {
        var d = new Date();
        var x = "test-" + d.toUTCString();
        self.storage.setItem(x, x);
        var y = self.storage.getItem(x);
        if (x === y) {
          self.storage.removeItem(x);
          return true;
        }
      } catch (e) {
      }

      return false;
    };

    //----------------------------------------
    // check if session storage is enabled in the current browser session 
    self.hasSessionStorageSupport = function() {
      if(self.isIE()) {
        return false;
      }
      
      try {
        var d = new Date();
        var x = "test-" + d.toUTCString();
        self.sessionStorage.setItem(x, x);
        var y = self.sessionStorage.getItem(x);
        if (x === y) {
          self.sessionStorage.removeItem(x);
          return true;
        }
      } catch (e) {
      }

      return false;
    };

    // session storage doesn't work on safari private browsing mode,
    // and it doesn't work on IE, so just disable it in general
    //    self.sessionStorageSupported = self.hasSessionStorageSupport();
    self.localStorageSupported = self.hasLocalStorageSupport();
    
    //----------------------------------------
    // saves a key value pair to local storage    
    self.saveToLocalStorage = function(key, val) {
      try {
        self.storage.setItem(key, val);
        var data = {}
        data[key] = val;
        return true;
      } catch (err) { }
      
      return false;
    };

    //----------------------------------------
    // reads a value from the local storage
    self.readFromLocalStrorage = function(key) {
      try {
        return self.storage.getItem(key);
      } catch (err) { }
      
      return null;
    };

    //----------------------------------------
    // save a key/value pair to session storage
    self.saveToSessionStorage = function(key, val) {
      try {
        self.sessionStorage.setItem(key, val);
        var data = {}
        data[key] = val;
        window.localStorage.setItem('sendSessionStorage', JSON.stringify(data));
        return true;
      } catch (err) { }
      
      return false;
    };

    //----------------------------------------
    // read a value from session storage
    self.readFromSessionStorage = function(key) {
      try {
        var value = self.sessionStorage.getItem(key);
        return value;
      } catch (err) { }
      
      return null;
    };

    //----------------------------------------
    // checks if cookies are supported in the current browser session   
    self.hasCookiesSupport = function() {
      try {
        return window.navigator && window.navigator.cookieEnabled;
      } catch (e) {
        return false;
      }

    };

    //----------------------------------------
    // stores a key value pair into cookies
    self.saveToCookies = function(key, val, daysForCookieExpiry) {
      try {
        var d = new Date();

        d.setTime(d.getTime() + (daysForCookieExpiry * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + d.toUTCString();
        var path = "; path=/"
        document.cookie = key + "=" + val + expires + path;
        return true;
      } catch (err) {
      }
      return false;
    };

    //----------------------------------------
    // stores a key value pair into a session cookie
    self.saveToSessionCookies = function(key, val) {
      try {
        var path = "; path=/"
        document.cookie = key + "=" + val + path;
        return true;
      } catch (err) {
      }
      return false;
    };
    
    //----------------------------------------
    // reads a key from the cookie  
    self.readFromCookies = function(key) {
      try {
        var self = this;
        // load the data from cookie
        var cookieData = null;
        if (document.cookie !== "") {
          var cookieArray = document.cookie.split("; ");
          if (cookieArray !== undefined) {
            for ( var i = 0; i < cookieArray.length; i++) {
              var cookieEntry = cookieArray[i].split("=");
              var cookieEntryKey = cookieEntry[0];
              var cookieEntryValue = cookieEntry[1];

              if (cookieEntryKey == key) {
                cookieData = cookieEntryValue;
                break;
              }
            }
          }
        }
        return cookieData;
      } catch (err) {}
      
      return null;
    };

    //----------------------------------------
    // stores a key value pair in memory
    self.saveToMemory = function(key, val) {
      val = self.encodeData(val); 
      self.data[key] = val;
    };

    //----------------------------------------
    // reads a key from the in-memory map 
    self.readFromMemory = function(key) {
      if (self.data.hasOwnProperty(key))
        return self.decodeData(self.data[key]);
      else
    	return null;
    };

    //----------------------------------------    
    // removes an item from the in-memory map   
    self.removeFromMemory = function(key) {
      self.data[key] = "";
      delete self.data[key];
    };
    
    //----------------------------------------    
    // removes an item from localstore or cookie or in memory map   
    self.removeItem = function(key) {
      try {
        var cookieData = null;

        if(self.localStorageSupported) {
          cookieData = self.readFromLocalStrorage(key);
        }
        
        if (cookieData) {
          self.saveToLocalStorage(key, "");
          self.storage.removeItem(key);
        } else if (self.hasCookiesSupport() && self.readFromCookies(key)) {
          self.saveToCookies(key, "", -1);
        } else {
          self.removeFromMemory(key);
        }
        return true;

      } catch (err) {
      }

      return false;
    };

    //----------------------------------------
    // tries to save a key value pair to localstorage and falls
    // back to cookie or in memory map
    self.setItem = function(key, val) {
      try {
        
        var isStorageSuccess = false;

        // check for localStorage
        if(self.localStorageSupported) {
          isStorageSuccess = self.saveToLocalStorage(key, val);
        }

        // Check for cookie csupport if local Storage is not enabled
        if (!isStorageSuccess && self.hasCookiesSupport()) {
          val = self.encodeData(val); 
          isStorageSuccess = self.saveToCookies(key, val , 365);
        }

        // if cookie is disabled then set into memory
        if (!isStorageSuccess) {
          saveToMemory(key, val);
        }

        return true;
      } catch (err) {

      }
      return false;
    };

    //----------------------------------------
    // fetches a value form localStorage and falls back to cookie or in memory map  
    self.getItem = function(key) {
      var cookieData = null;
      // check for sessionStorage
      if(self.localStorageSupported) {
        cookieData = self.readFromLocalStrorage(key);
      }

      // check in cookie for value in case local storage fails
      if (!cookieData && self.hasCookiesSupport()) {
        cookieData = self.decodeData(self.readFromCookies(key));
      }

      // check for in memory object if cookie fails
      if (cookieData === null) {
        cookieData = self.readFromMemory(key);
      }
      
      return cookieData  ;
      
    };

    //----------------------------------------    
    // removes an item from session store or cookie or in memory map   
    self.removeSessionItem = function(key) {
      try {
        var cookieData = null;

        if(self.sessionStorageSupported) {
          cookieData = self.readFromSessionStrorage(key);
        }
        
        if (cookieData) {
          self.saveToSessionStorage(key, "");
          self.sessionStorage.removeItem(key);
        } else {
          self.removeSessionCookieItem(key);
        }
        return true;

      } catch (err) {
      }

      return false;
    };

    //----------------------------------------
    // tries to save a key value pair to session storage and falls
    // back to session cookie or in memory map
    self.setSessionItem = function(key, val) {
      try {
        
        var isStorageSuccess = false;

        // check for sessionStorage
        if(self.sessionStorageSupported) {
          isStorageSuccess = self.saveToSessionStorage(key, val);
        }

        // Check for cookie csupport if local Storage is not enabled
        if (!isStorageSuccess) {
          self.setSessionCookieItem(key, val);
        }

        return true;
      } catch (err) {
      }
      return false;
    };

    //----------------------------------------
    // fetches a value form sessionStorage and falls back to cookie or in memory map  
    self.getSessionItem = function(key) {
      var cookieData = null;
      // check for sessionStorage
      if(self.sessionStorageSupported) {
        cookieData = self.readFromSessionStrorage(key);
      }

      // check in cookie for value in case local storage fails
      if (cookieData === null) {
        cookieData = self.getSessionCookieItem(key);
      }
      
      return cookieData;
    };
    
    //----------------------------------------    
    // removes an item from session cookie or in memory map   
    self.removeSessionCookieItem = function(key) {
      if (self.hasCookiesSupport() && self.readFromCookies(key)) {
        self.saveToSessionCookies(key, "");
      } else {
        self.data[key] = "";
        delete self.data[key];
      }
    }
    
    //----------------------------------------
    // tries to save a key value pair to session cookie or in memory map
    self.setSessionCookieItem = function(key, val) {
      var isStorageSuccess = false;
      val = self.encodeData(val);

      if(self.hasCookiesSupport()) {
        isStorageSuccess = self.saveToSessionCookies(key, val);
      }

      // if cookie is disabled then set into memory
      if (!isStorageSuccess) {
        self.data[key] = val;
      }
    }
    
    //----------------------------------------
    // fetches a value from session cookie or in memory map  
    self.getSessionCookieItem = function(key) {
      var cookieData = null;
      // check in cookie for value in case local storage fails
      if(self.hasCookiesSupport()) {
        cookieData = self.decodeData(self.readFromCookies(key));
      }

      // check for in memory object if cookie fails
      if (cookieData === null) {
        cookieData = self.decodeData(self.data[key]);
      }
      return cookieData;
    }
    
    //----------------------------------------
    // encodes the data so that special chars wont become a problem in cookie storage  
    self.encodeData = function(cookieData) {
      try {
        if (cookieData) {
          cookieData = encodeURIComponent(JSON.stringify(cookieData));
        }
      } catch (pError) {
      }
      return cookieData;
    };

    //----------------------------------------
    // decodes the encoded data    
    self.decodeData = function(cookieData) {
      try {
        if (cookieData) {
          cookieData = JSON.parse(decodeURIComponent(cookieData));
          return cookieData;
        }
      } catch (pErr) {
      }
      return null;
    };

    //----------------------------------------
    // init session storage syncing
    self.initSyncing = function(pCallback) {
      // don't do any syncing on IE
      // or if session or local storage isn't supported
      if(!self.localStorageSupported ||
         !self.sessionStorageSupported) {
        if(pCallback) {
          pCallback();
        }
        return;
      }
      
      // transfers sessionStorage from one tab to another
      var handleSessionStorageRequest = function(pEvent) {
        // for ie
        if(!pEvent) {
          pEvent = window.event;
        }

        var url = XDomainProxy.urlHostnamePortPortionOnly(pEvent.url);
        // ignore events from other urls
        if(url != self.url) {
          return;
        }

        // no event
        if(!pEvent.newValue) {
          return;
        }
        // other tab is asking for our session storage
        if(pEvent.key == 'getSessionStorage') {
          // another tab asked for the sessionStorage -> send it
          var data = JSON.stringify(self.sessionStorage);
          window.localStorage.setItem('sendSessionStorage', data);
        }
        // other tab sent us their session storage
        else if(pEvent.key == 'sendSessionStorage') {
          var data = JSON.parse(pEvent.newValue);
          for (var key in data) {
            var addIt = false;
            for(var i = 0; i < self.validSyncSessionKeyPrefixes.length && addIt == false; i++) {
              var prefix = self.validSyncSessionKeyPrefixes[i];
              if(key.lastIndexOf(prefix, 0) === 0) {
                addIt = true;
              }
            }
            if(addIt) {
              self.sessionStorage.setItem(key, data[key]);
            }
          }

          // invoke callback after getting response
          // but only if we're transitioning from empty
          // storage
          if(pCallback && !self.isSessionStorageSynced) {
            pCallback();
          }
          self.isSessionStorageSynced = true;
        }
      };

      // listen for changes to localStorage
      if(window.addEventListener) {
        window.addEventListener("storage", handleSessionStorageRequest, false);
      }
      else {
        window.attachEvent("onstorage", handleSessionStorageRequest);
      }

      // Ask other tabs for session storage (this is ONLY to trigger event)
      var d = new Date();
      var x = "test-" + d.toUTCString();
      try {
        window.localStorage.setItem('getSessionStorage', x);
      } catch (pError) {
        
      }
    };

  }

  //----------------------------------------
  // returns a singleton instance of the Storage API 
  StorageApi.getInstance = function() {
    if (!StorageApi.singleInstance) {
      StorageApi.singleInstance = new StorageApi();
    }

    return StorageApi.singleInstance;
  };


  return StorageApi;
});


