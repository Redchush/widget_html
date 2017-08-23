//----------------------------------------
/**
 * @fileoverview This library handles the OAuth token refresh
 *
 * The CCOAuthTimeout object is instantiated with a reference to the
 * ccRestClient object. This is used to obtain info on logged in status,
 * the profile type (Admin, Storefront or Layout Preview) and whether a
 * recent server side request has been made.
 *
 * For Admin, event handlers are attached to the html tag which record
 * user activity - clicks or keypresses.
 *
 * Every 30 seconds, we check for recent activity, and if so, refresh the 
 * OAuth token. On Storefront, we only check for server side activity,
 * for Admin, we take keyboard and mouse activity into account too.
 *
 * In Admin, a warning is displayed if the session will timeout within
 * the next two minutes. Clicking OK on this warning will cause a token
 * refresh immediately
 *
 *
 */

define(
  'ccOAuthTimeout',['ccConstants',
   'jquery',
   'pubsub',
   'notifications',
   'CCi18n'],

 function(CCConstants, $, pubSub, notifications, CCi18n) {

  'use strict';

  /**
  * Constructor for CCOAuthTimeout object
  *
  * @param {ccRestClient} ccRestClient - the admin or storefront REST client
  * @name  CCOAuthTimeout
  * @class Handles the OAuth token refresh timers and timeout warning.
  * @private
  */
  function CCOAuthTimeout(ccRestClient) {

    /**
     * @private
     * @var {boolean} recentUserActivity Flag to record recent client side activity
     * @var {number} storeRefreshIntervalId timeout id for token refresh interval
     * @var {number} logoutWarningTimerId timeout id for session expire warning message
     * @var {number} expireSessionTimerId timeout id for session expire
     * @var {Object} $focusedElement jquery object of most recently focused element
     */
    var recentUserActivity = false,
        storeRefreshIntervalId = null,
        logoutWarningTimerId = null,
        expireSessionTimerId = null,
        $focusedElement = null;

    /**
     * @private
     * @constant {string} ALERT_ID_WARN Id of the div holding the 'your session is about to timeout' warning
     * @constant {string} ALERT_ID_LOGOUT Id of the div holding the 'you have been logged out' message
     */
    var ALERT_ID_WARN = 'cc-warn-session-timeout-alert',
        ALERT_ID_LOGOUT = 'cc-expire-session-alert';

    /**
     * This method is called if the token successfully refreshed here or in another window.
     * @private
     * @function ccOAuthTimeout#handleTokenRefreshedSuccess
     */
    var handleTokenRefreshedSuccess = function() {

      $.Topic(pubSub.topicNames.USER_SESSION_VALID).publish();
      ccRestClient.storeRequestWasMade = false;
      recentUserActivity = false;
      resetTimeoutWarning();
    }

    /**
     * This method is called to refresh the token in specific intervals 
     * @private
     * @function ccOAuthTimeout#doRefreshToken
     */
    var doRefreshToken = function() {

      var errorFunc =  function(pResult) {};

      if (ccRestClient.loggedIn && (recentUserActivity || ccRestClient.storeRequestWasMade)) {
        ccRestClient.refresh(handleTokenRefreshedSuccess, errorFunc);
      }
    };

    /**
     * This method is called to register the timer to refresh the token 
     * @private
     * @function ccOAuthTimeout#setRefreshInterval
     */
    var setRefreshInterval = function() {

      if(ccRestClient.loggedIn && storeRefreshIntervalId == null) {
        storeRefreshIntervalId = setInterval(doRefreshToken, CCConstants.TOKEN_REFRESH_INTERVAL);
      }
    };

    /**
     * This method is called to clear the timer to refresh the token 
     * @private
     * @function ccOAuthTimeout#clearRefreshInterval
     */
    var clearRefreshInterval = function() {

      if (storeRefreshIntervalId) {
        clearInterval(storeRefreshIntervalId);
        storeRefreshIntervalId = null;
      }
    };

    /**
     * Admin only - Capture the current element if we're about to display the warning message.
     *   If we're inside the storefront iframe, handle that scenario correctly.
     * @private
     * @function ccOAuthTimeout#captureFocusedElement
     */
    var captureFocusedElement = function() {
        $focusedElement = $(document.activeElement);
        if ($focusedElement.is('iframe')) {
            try {
                $focusedElement = $(document.activeElement.contentWindow.document.activeElement);
            } catch(e) { }
        }
    }

    /**
     * Admin only - display warning if user login session is about to timeout
     * @private
     * @function ccOAuthTimeout#warnSessionTimeout
     */
    var warnSessionTimeout = function() {

      // Display session timeout warning. Only applies to admin profile.
      // Don't display if another warning on screen.
      //
      if (ccRestClient.profileType == CCConstants.PROFILE_TYPE_ADMIN && $('.cc-notification').length == 0) {

        captureFocusedElement();

        notifications.notify([
          {
            style: 'inline',
            id: '#cc-message-center',
            customNotificationID: ALERT_ID_WARN,
            status: 'confirm',
            curtain: true,
            close: false,
            fade: false,
            header: CCi18n.t('ns.common:resources.sessionTimeoutHeader'),
            message: CCi18n.t('ns.common:resources.sessionTimeoutMessage'),
            actionOptions: [{
              actionOption1: [{
                text: CCi18n.t('ns.common:resources.okText'),
                action: '',
                classes: 'btn cc-submit-changes-btn cc-btn-primary'
              }]
            }]
          }
        ]);

        // OK refreshes token immediately. Also need to handle notification's
        // 'onclick' attribute, and ensure we kill the expiry message timer
        //
        $('button', '#' + ALERT_ID_WARN).each(function() {
          var clickHandler = this.onclick.bind(this);
          $(this).prop('onclick', null).on('click', function() {
            clearExpireTimeout();
            doRefreshToken();
            if ($focusedElement) { $focusedElement.focus(); }
            if (clickHandler instanceof Function) { clickHandler(); }
          });
        });

        // Handle clicks outside the window
        //
        $('#' + ALERT_ID_WARN).closest('div.cc-notification-outer').
          next('div.cc-curtain').on('click', function() {
            $('button', '#' + ALERT_ID_WARN).focus();
        });

        // Setup timer to display Session Expired message
        //
        setExpireTimeout();
      }
    };

    /**
     * Admin only - utility function to hide the session timeout warning,
     * along with its associated modal divs.
     * @private
     * @function ccOAuthTimeout#warnSessionTimeout
     */
    var hideSessionTimeout = function() {
        
        $('#' + ALERT_ID_WARN).
          closest('div.cc-notification-outer').
          next('div.cc-curtain').
          andSelf().remove();
    }

    /**
     * Admin only - display message if user session times out
     * @private
     * @function ccOAuthTimeout#expireSessionMessage
     */
    var expireSessionMessage = function() {

      // Expire session message displayed once timeout reached. Only applies to
      // admin profile. Don't display if previous warning not on screen.
      //
      if (ccRestClient.profileType == CCConstants.PROFILE_TYPE_ADMIN && $('#' + ALERT_ID_WARN).length) {

        hideSessionTimeout();

        notifications.notify([
          {
            style: 'inline',
            id: '#cc-message-center',
            customNotificationID: ALERT_ID_LOGOUT,
            status: 'confirm',
            curtain: true,
            close: false,
            fade: false,
            header: CCi18n.t('ns.common:resources.sessionExpiryHeader'),
            message: CCi18n.t('ns.common:resources.sessionExpiryMessage'),
            actionOptions: [{
              actionOption1: [{
                text: CCi18n.t('ns.common:resources.okText'),
                action: '',
                classes: 'btn cc-submit-changes-btn cc-btn-primary'
              }]
            }]
          }
        ]);

        // 'OK' forces logout
        //
        $('button', '#' + ALERT_ID_LOGOUT).each(function() {
          $(this).prop('onclick', null).on('click', function() {
            var redirectBound = ccRestClient.redirectToAdminLoginScreen.bind(ccRestClient);
            ccRestClient.logout(redirectBound, redirectBound);
          });
        });

        // Handle clicks outside the window
        //
        $('#' + ALERT_ID_LOGOUT).closest('div.cc-notification-outer').
          next('div.cc-curtain').on('click', function() {
            $('button', '#' + ALERT_ID_LOGOUT).focus();
        });
      }
    };

    /**
     * This method is called to set the timer to display the timeout warning
     * @private
     * @function ccOAuthTimeout#resetTimeoutWarning
     */
    var resetTimeoutWarning = function() {

      if (ccRestClient.profileType == CCConstants.PROFILE_TYPE_ADMIN) {
        clearTimeoutWarning();
        logoutWarningTimerId = setTimeout(warnSessionTimeout, CCConstants.TOKEN_WARNING_TIMEOUT);
      }
    };

    /**
     * This method is called to clear the timer to display the timeout warning
     * @private
     * @function ccOAuthTimeout#clearTimeoutWarning
     */
    var clearTimeoutWarning = function() {

      if (logoutWarningTimerId) {
        clearTimeout(logoutWarningTimerId);
        logoutWarningTimerId = null;
      }
    };

    /**
     * This method is called to set the timer to display the session expired message
     * @private
     * @function ccOAuthTimeout#setExpireTimeout
     */
    var setExpireTimeout = function() {

      if (ccRestClient.profileType == CCConstants.PROFILE_TYPE_ADMIN) {
        clearExpireTimeout();
        expireSessionTimerId = setTimeout(expireSessionMessage, CCConstants.TOKEN_EXPIRED_MESSAGE_TIMEOUT);
      }
    }

    /**
     * This method is called to clear the timer to display the session expired message
     * @private
     * @function ccOAuthTimeout#clearExpireTimeout
     */
    var clearExpireTimeout = function() {

      if (expireSessionTimerId) {
        clearTimeout(expireSessionTimerId);
        expireSessionTimerId = null;
      }
    }

    /**
     * Setup for callback timers, and add  event handler to html tag. Called
     * on rest client initialization, and also on subsequent login / register
     * @private
     * @function ccOAuthTimeout#setupRefreshTimers
     */
    var setupRefreshTimers = function() {

      // Clear existing event handlers
      $('html').off('.cctimer');

      if (ccRestClient.loggedIn) {

        // We want this for Admin, Layout Preview and Storefront
        setRefreshInterval();

        // Add event handlers for mousup, keyup
        // If we're in Admin, then record the activity
        // If we're in Layout Preview, then trigger event in parent window.
        if (ccRestClient.profileType == CCConstants.PROFILE_TYPE_ADMIN) {

          // Start the warning timer - just for admin
          resetTimeoutWarning();

          // Add event handlers to window
          $('html').on("keyup.cctimer mouseup.cctimer", function() {
            recentUserActivity = true;
          });

          // $('html').keypress("q", function(e) { if (e.ctrlKey) {  warnSessionTimeout(); } });

          // Handle refresh in other window
          ccRestClient.registerLoginUpdateCallback(function() {
            clearExpireTimeout();
            hideSessionTimeout();
            handleTokenRefreshedSuccess();
          });

          // Handle auto logout in other window
          // Just don't leave a 'you have been logged out' message up.
          ccRestClient.registerLogoutUpdateCallback(function() {
            $('button', '#' + ALERT_ID_LOGOUT).trigger('click');
          });

        } else if (ccRestClient.profileType == CCConstants.PROFILE_TYPE_LAYOUT_PREVIEW) {

          // If we're in Layout Preview, then trigger event in parent window.
          if (parent.$) {
            $('html').on("keyup.cctimer mouseup.cctimer", function(e) {
              parent.$('html', parent.document).trigger(e);
            });
          }
        }
      }
    };

    /**
     * Remove event handlers and stop timers on logout
     * @private
     * @function ccOAuthTimeout#tearDownRefreshTimers
     */
    var tearDownRefreshTimers = function() {

      clearRefreshInterval();
      clearTimeoutWarning();
      clearExpireTimeout();
      $('html').off(".cctimer");
    };

    // Registering this as an init callback, in case we arrive here for the first time already logged in
    ccRestClient.registerInitCallback(setupRefreshTimers);

    // Admin: setup on login tear down on logout or session expiry
    $.Topic(pubSub.topicNames.AUTH_LOGIN_SUCCCESS).subscribe(setupRefreshTimers);
    $.Topic(pubSub.topicNames.AUTH_LOGOUT_SUCCESS).subscribe(tearDownRefreshTimers);

    // Storefront / preview: setup on login or register, tear down on logout or session expiry
    $.Topic(pubSub.topicNames.USER_LOGIN_SUCCESSFUL).subscribe(setupRefreshTimers);
    $.Topic(pubSub.topicNames.USER_AUTO_LOGIN_SUCCESSFUL).subscribe(setupRefreshTimers);
    $.Topic(pubSub.topicNames.USER_LOGOUT_SUCCESSFUL).subscribe(tearDownRefreshTimers);
    $.Topic(pubSub.topicNames.USER_SESSION_EXPIRED).subscribe(tearDownRefreshTimers);

    // Layout preview doesn't try to login, so we have to wait for PAGE_READY instead.
    if (ccRestClient.profileType == CCConstants.PROFILE_TYPE_LAYOUT_PREVIEW) {
      $.Topic(pubSub.topicNames.PAGE_READY).subscribe(setupRefreshTimers);
    }
  }

  return CCOAuthTimeout;
});

