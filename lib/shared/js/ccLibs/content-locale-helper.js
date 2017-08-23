/*global $ */

/**
 * contentLocaleHelper fetches the list of supported content locales for a storefront via
 * a rest call. It stores the default locale, selected locale and supported locales.
 */
define('contentLocaleHelper',
  ['knockout',
   'ccRestClient',
   'ccConstants',
   'pubsub',
   'ccStoreConfiguration',
   'ojs/ojtoolbar'],

function(ko, CCRestClient, ccConstants, PubSub) {
  "use strict";

  /**
   * Creates a ContentLocaleHelper.
   */
  function ContentLocaleHelper () {
    var self = this;

    // This is bound to the language picker in the admin header and used to
    // determine current content locale. Its value must be a valid LocaleId.
    this.selectedLocaleId = ko.observable(null);

    // This must also be the LocaleId of the default content language.
    this.defaultLocaleId = ko.observable();

    this.supportedLocales = ko.observableArray();

    // subscription that will refresh the navbar toolbar when the number of
    // supported languages changes. Necessary to add/remove the language picker
    // element from the keyboard navigation order.
    this.supportedLocales.subscribe(function(value) {
      $('#cc-navbar-toolbar').ojToolbar('refresh');
    });

    this.lastPublishedLocaleId = null;
    this.pageChange = false;

    this.getSupportedLocalesBinding = this.getSupportedLocales.bind(this);
    $.Topic(PubSub.topicNames.SUPPORTED_LOCALES_UPDATE).subscribe(this.getSupportedLocalesBinding);

    return (this);
  }

  /**
   * Sort Locales alphabetically by Display Name.
   */
  ContentLocaleHelper.prototype.sortLocales = function () {
    this.supportedLocales.sort(function(left, right) {
      return left.displayName == right.displayName ? 0 : (left.displayName < right.displayName ? -1 : 1);
    });
  };

  /**
   * REST Call to get the list of support content locales.
   *
   * This is called at every page transition to make sure we have the most
   * current locale options and default locale value.
   *
   * {
   *   defaultLocale: {localeId, name, displayName, repositoryId},
   *   items: [{localeId, name, displayName, repositoryId}, ...]
   * }
   */
  ContentLocaleHelper.prototype.getSupportedLocales = function () {
    CCRestClient.request(ccConstants.ENDPOINT_LOCALES_CONTENT_LOCALES,
      {includeAllSites: true},
      this.getSupportedLocalesSuccess.bind(this),
      this.getSupportedLocalesError.bind(this)
    );
  };

  /**
   * Repopulate the list of supported locales and resolve the localeId of the
   * selected locale against the new list of supported locales. If necessary,
   * select the default locale.
   *
   * @param  {Object} pResponse Endpoint response.
   */
  ContentLocaleHelper.prototype.getSupportedLocalesSuccess = function (pResponse) {
    // get what's in local storage
    var localStorageLocale =
      CCRestClient.getStoredValue(ccConstants.LOCAL_STORAGE_USER_CONTENT_LOCALE);

    var localeArray = JSON.parse(localStorageLocale);

    // This is a value like "1" for English, "18" for Greek etc.
    // The array should never have more than one element (?) as it
    // represents the user's selection in the language picker
    var localStorageLocaleId = localeArray && localeArray[0] ? localeArray[0].localeId : null;

    // update the locale list based on the response
    this.supportedLocales(pResponse.items);
    this.sortLocales();

    // must retrieve the default locale from the response for other functions to use
    var defaultLocale = $.grep(this.supportedLocales(), function (item) {
      return item.localeId === pResponse.defaultLocale.localeId;
    });

    this.defaultLocaleId(defaultLocale[0]['localeId']);

    // If we have a value in local storage and that value exists in
    // the supported locale list, set the selection to that.
    // Otherwise use the default locale.
    // BUT only do that if there is a Content Language selector
    // (i.e., supportedLocales is longer than 1 item)
    if (this.supportedLocales().length > 1 &&
        localStorageLocaleId &&
        $.grep(this.supportedLocales(), function (item) {
            return item.localeId === localStorageLocaleId
        }).length > 0) {
      this.setSelectedLocaleFromLocalStorage(localStorageLocale);

    } else {
      // If nothing exists in local storage, use the default locale
      if (this.selectedLocaleId() == null
          || !this.isLocaleSupported(this.selectedLocaleId())) {
        this.selectLocaleById(this.defaultLocaleId());
        this.handleContentLanguageChange();
      }
    }

  };

  /**
   * No-op error for fetching supported locale list.
   *
   * @param  {Object} pResponse Endpoint response.
   */
  ContentLocaleHelper.prototype.getSupportedLocalesError = function (pResponse) {
    // Do nothing instead of barking errors
  };

  /**
   * Sets the value backing the Content Language selector to be the locale
   * value from local storage, assuming it exists.
   *
   * @param {String} pLocaleJSON JSON String of the locale object to set the
   *                             "Content Language" selector to.  This parameter
   *                             is intended to be passed only from
   *                             getSupportedLocaleSuccess().
   */
  ContentLocaleHelper.prototype.setSelectedLocaleFromLocalStorage = function (pLocaleJSON) {
    var localStorageLocale, localeId, localeArray;
    if (pLocaleJSON) {
      localStorageLocale = pLocaleJSON;
    } else {
      localStorageLocale = CCRestClient.getStoredValue(ccConstants.LOCAL_STORAGE_USER_CONTENT_LOCALE);
    }

    // make sure we can get the ID off the object in local storage
    if(localStorageLocale) {

      // this returns as an array, but we know it will be only one item
      if (typeof localStorageLocale == 'string') {
        localeArray = JSON.parse(localStorageLocale);
      } else {
        localeArray = localStorageLocale;
      }

      if (localeArray && localeArray[0]) {
        localeId = localeArray[0]['localeId'];
      }
    }

    // check if we have a locale ID for content language already
    if(localeId) {
      this.selectLocaleById(localeId);
    }
  }

  /**
   * Determines if the localeId in the parameter matches a locale in the list
   * of supported locales.  This is to help handle the list of locales being
   * out of sync with the UI selection.
   *
   * @param  {String}  localeId ID of the locale to test.
   * @return {Boolean} True if the localeId matches a supported locale.
   */
  ContentLocaleHelper.prototype.isLocaleSupported = function (pLocaleId) {
    var selectedLocale = $.grep(this.supportedLocales(), function (item) {
      return item.localeId === pLocaleId;
    });

    return selectedLocale.length > 0;
  };

  /**
   * Gets the locale Object from the list of supported locales based on
   * the ID parameter.
   *
   * @param  {String} pLocaleId Locale ID to lookup.
   * @return {Object} Locale object matching the ID provided.
   */
  ContentLocaleHelper.prototype.getLocaleById = function (pLocaleId) {
    var selectedLocale = $.grep(this.supportedLocales(), function (item) {
      return item.localeId === pLocaleId;
    });

    if (selectedLocale.length > 0)
    {
      return selectedLocale[0];
    }

    return null;
  };

  /**
   * Handle changing the value in the select ("Content Langauge" selector).
   * This will update the local storage so that page refreshes, etc., will
   * remember the selected locale.
   *
   * @param {Object} pData Data passed in from the call.  This ends up being
   *                       the ContentLocaleHelper.
   * @param {Object} pEvent Event information.  This event should only ever be
   *                        'onchange'.
   */
  ContentLocaleHelper.prototype.handleContentLanguageChange = function (pData, pEvent) {
    //get the value of page change, to know if the selectLocaleById
    //function is being executed in parallel
    var pageChange = this.pageChange;

    // "selectedLocale" is really the locale ID
    if (pData) {
      this.selectLocaleById($(pData.originalEvent.currentTarget).attr('id'));  
    } else {
      this.selectLocaleById(this.selectedLocaleId());
    }

    // This check added because this pubsub event is firing twice.
    if(this.lastPublishedLocaleId !== this.selectedLocaleId() || pageChange){
      /*
       * Any set of data that needs to be updated when the Content Language
       * changes should subscribe to this event.  At this point, the following
       * are subscribed to this:
       * - product-listing
       * - handle-product
       * - promotions-listing
       * - settings-shipping
       */
      $.Topic(PubSub.topicNames.ADMIN_CONTENT_LANGUAGE_CHANGED).publish();
      this.lastPublishedLocaleId = this.selectedLocaleId();
    }
  };

  /**
   * Sets the stored locale based on the ID provided.  If no ID is provided
   * then the default locale will be used.
   *
   * @param  {String} pLocaleId The ID of the locale to look up and store.
   */
  ContentLocaleHelper.prototype.selectLocaleById = function (pLocaleId) {
    // This function gets called on a page change and locale dropdown change
    // and sometimes could go in a race condition and return incorrect result
    // so added a pagechange variable that gets set and unset at the begining and end of the function.
    this.pageChange = true;
    var selectedLocaleId;
    var selectedLocale = $.grep(this.supportedLocales(), function (item) {
      return item.localeId === pLocaleId;
    });

    if (selectedLocale.length > 0) {
      selectedLocaleId = selectedLocale[0].localeId;
      this.selectedLocaleId(null);
    } else {
      selectedLocaleId = this.defaultLocaleId();
    }

    // Yes, this is strange...  1) set it to null -- 2) set the actual value
    // Otherwise, the Content Language selector randomly switches when
    // changing pages
    this.selectedLocaleId(selectedLocaleId);

    // store selectedLocale in localStorage FOR cc-rest-client
    // This needs to be the full locale ITEM, not the ID
    CCRestClient.setStoredValue(ccConstants.LOCAL_STORAGE_USER_CONTENT_LOCALE, ko.toJSON(selectedLocale));
    this.pageChange = false;
    // Set a custom property on the window object - this will get picked up by
    // the cc rest client in child iframes when they are refreshed.
    window.urlLocale = ko.toJSON(selectedLocale);
  };

  /**
   * Test to see if default locale is the currently selected locale.  This is
   * primarily used to ensure that items cannot be created in secondary locales.
   * For example creating a product must be done in the "Store Default Locale"
   * first.
   *
   * @return {Boolean} True if the "Content Language" selector has the default
   * locale seleted.
   */
  ContentLocaleHelper.prototype.isDefaultLocaleSelected = function () {
    return this.selectedLocaleId() === this.defaultLocaleId();
  };

  /**
   * Gets the current language object for the currently selected language
   * @return {Object} the currently selected language object.
   */
  ContentLocaleHelper.prototype.getCurrentLanguage = function() {
    return this.getLocaleById(this.selectedLocaleId());
  };

  /**
   * Unloads this view model by unsubscribing from pubsub events.
   * @private
   */
  ContentLocaleHelper.prototype.unload = function() {
    $.Topic(PubSub.topicNames.SUPPORTED_LOCALES_UPDATE).unsubscribe(this.getSupportedLocalesBinding);
  };

  /**
   * Return the model.
   */
  return new ContentLocaleHelper();
});

