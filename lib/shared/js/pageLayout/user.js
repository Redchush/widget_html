/**
 * @fileoverview Defines a UserViewModel used to register and
 * login a user to the site.
 */

/*global $ */
/*global define */
define(
    //-------------------------------------------------------------------
    // PACKAGE NAME
    //-------------------------------------------------------------------
    'pageLayout/user',

    //-------------------------------------------------------------------
    // DEPENDENCIES
    //-------------------------------------------------------------------
    ['knockout', 'pubsub', 'notifier', 'CCi18n',
        'ccRestClient', 'ccConstants', 'koValidate', 'ccKoValidateRules',
        'storeKoExtensions', 'navigation', 'storageApi', 'pageLayout/parent-organisation', 'viewModels/dynamicProperty', 'pageLayout/organization', 'ccStoreConfiguration'],

    //-------------------------------------------------------------------
    // MODULE DEFINITION
    //-------------------------------------------------------------------
    function (ko, pubSub, notifier, CCi18n, ccRestClient,
              CCConstants, koValidate, rules, storeKoExtensions, navigation, storageApi, ParentOrganisation, DynamicProperty, Organization, CCStoreConfiguration) {

        'use strict';

        /**
         * Creates a user view model.
         * <p>
         * The User View Model is a singleton class that provides the context for logged in
         * user data, e.g. Profile data, Preferences, Shipping information.
         *
         * @param {RestAdapter} pAdapter REST adapter.
         * @param {Object} pUserData Additional user data.
         *
         * @public
         * @class Represents a user.
         * @name UserViewModel
         * @property {observable<string>} firstName First part of name
         * @property {observable<string>} lastName Last part of name
         * @property {observable<string>} loggedInUserName Logged in username.
         * @property {observable<string>} emailAddress Primary communication email address.
         * @property {observable<string>} emailAddressForForgottenPwd Email address to use for password retrieval.
         * @property {observable<string>} emailMarketingMails Email address to use for marketing messages.
         * @property {observable<boolean>} emailMarketingModified Flag showing if the marketing email field is modified.
         * @property {observable<string>} password Password.
         * @property {observable<string>} oldPassword Existing password field on change password form.
         * @property {observable<string>} newPassword New password field on change password form.
         * @property {observable<string>} confirmPassword Confirm password field on change password form.
         * @property {observableArray<Address>} shippingAddressBook Shipping addresses associated with user.
         * @property {observable<Address>} defaultShippingAddress helper for default address selection.
         * @property {observable<Address>} editShippingAddress Address object shown on editable address form.
         * @property {observable<boolean>} deleteShippingAddress Flag set to true if an address is being deleted.
         * @property {observable<string>} locale User locale.
         * @property {observable<boolean>} loggedinAtCheckout Flag to determine if user is logged in on the checkout page.
         * @property {observable<boolean>} loggedoutAtCheckout Flag to determine if user if logged out on the checkout page.
         * @property {observable<Object>} persistedOrder Saved recent, or in progress order.
         * @property {observable<string>} orderId ID of recent, or in progress order.
         * @property {observable<number>} countOfSubmittedOrders Track number of orders created by user.
         * @property {observable<boolean>} ignoreEmailValidation Flag to temporarily ignore validation on email address field.
         * @property {observable<boolean>} ignorePasswordValidation Flag to temporarily ignore validation on password field.
         * @property {observable<boolean>} isUserProfileEdited Whether the User profile has unsaved changes.
         * @property {observable<boolean>} delaySuccessNotification Whether to delay the notification popup.
         * @property {observable<boolean>} isSearchInitiatedWithUnsavedChanges Whether there are unsaved changes when a search is initiated.
         * @property {observable<boolean>} isUserSessionExpired True if the user's session has expired.
         * @property {observable<string>} pageToRedirect Hash code for page redirection
         * @property {observable<boolean>} isSessionExpiredDuringSave True if the user's session expires when a save operation is in progress.
         * @property {observable<boolean>} isUserLoggedOut True if user has logged out.
         * @property {observable<boolean>} isPageRedirected True if page was redirected.
         * @property {observable<boolean>} isResourcesLoaded True when resources are loaded.
         * @property {observable<string>} errorMessageKey Resource key to look up current error notification message.
         * @property {observable<string>} successMessageKey Resource key to look up current success notification message.
         * @property {observable<Object[]>} passwordPolicies List of store specific password rules enabled for user accounts.
         * @property {observable<boolean>} isChangePassword Flag to determine if we need to display the password change fields.
         * @property {observable<boolean>} showCreateNewPasswordMsg Flag to determine whether to display the new password prompt.
         * @property {observable<string>} createNewPasswordError Message to display if password creation failed.
         * @property {observable<boolean>} isPasswordExpired True if password has expired.
         * @property {observable<boolean>} hasFieldLevelError True if any of the fields on the profile has an error.
         * @property {observable<boolean>} ignoreConfirmPasswordValidation Flag to temporarily ignore validation on the confirm password field.
         * @property {observable<string>} forgotPasswordMsg Localisable message for 'forgotten password' link.
         * @property {observable<Object[]>} myWishLists List of owned wish lists
         * @property {observable<Object[]>} joinedWishLists List of joined wish lists
         * @property {observable<boolean>} approvalRequired Profile level flag , specifies if Order approval is enabled for profile or not
         * @property {observable<string>} orderPurchaseLimit Profile level purchase Limit
         * @property {CCStoreConfiguration} storeConfiguration An instance of the cc-store-configuration containing store-configuration data.
         */
        function UserViewModel(pAdapter, pUserData) {

            if (UserViewModel.singleInstance) {
                throw new Error("Cannot instantiate more than one UserViewModel, use getInstance(pAdapter, pUserData)");
            }
            var self = this;

            // Provide price list group object to all widgets.
            self.selectedPriceListGroup = ko.observable(pUserData.priceListGroup);
            self.currentOrganization = ko.observable();
            self.activePriceListGroups = ko.observableArray([]);
            self.dynamicProperties = ko.observableArray([]);
            // Adding user data from server to view model.

            // Adding user data from server to the view model
            // Currently ignoring the 'links' property as it is not being used and causing problems in ccLink custom binding
            ko.mapping.fromJS(pUserData, {'ignore': ["links","dynamicProperties"]}, self);
            // Values from context
            self.id = ko.observable('');
            self.login = ko.observable('');
            self.adapter = pAdapter;

            // Flags
            self.resetAll = ko.observable(false);

            // Values to be entered
            self.emailAddress = ko.observable('');
            self.emailAddressForForgottenPwd = ko.observable('');
            self.emailMarketingMails = ko.observable(false);
            self.emailMarketingModified = ko.observable(false);
            self.firstName = ko.observable('');
            self.loggedInUserName = ko.observable('');
            self.lastName = ko.observable('');
            self.password = ko.observable('');
            self.newPassword = ko.observable('');
            self.confirmPassword = ko.observable('');
            self.shippingAddressBook = ko.observableArray().extend({ deferred: true });
            self.defaultShippingAddress = ko.observable(); // For default address radio selection.
            self.editShippingAddress = ko.observable(); // Used when the edit address form is displayed.
            self.deleteShippingAddress = ko.observable(false);
            self.locale = ko.observable('');
            self.supportedLocales = [];

            self.client = ko.observable(ccRestClient);
            self.loginError = ko.observable('');
            self.loggedIn = ko.observable(self.client().loggedIn);
            self.isLoginFailed = ko.observable(false);
            self.readyToDisplay = ko.observable(true);

            self.oldPassword = ko.observable('');


            self.emailAddress.isData = true;
            self.firstName.isData = true;
            self.lastName.isData = true;
            self.password.isData = true;
            self.newPassword.isData = true;
            self.confirmPassword.isData = true;
            self.oldPassword.isData = true;
            self.emailAddressForForgottenPwd.isData = true;
            self.locale.isData = true;

            self.loggedinAtCheckout = ko.observable(false);
            self.loggedoutAtCheckout = ko.observable(false);
            self.persistedOrder =  ko.observable();
            self.orderId = ko.observable('');
            self.countOfSubmittedOrders = ko.observable(0);
            self.ignoreEmailValidation = ko.observable(true);
            self.ignorePasswordValidation = ko.observable(true);
            self.isUserProfileEdited = ko.observable(false);
            self.delaySuccessNotification = ko.observable(false);
            self.isSearchInitiatedWithUnsavedChanges = ko.observable(false);

            self.isUserSessionExpired = ko.observable(false);
            self.pageToRedirect = ko.observable();
            self.isSessionExpiredDuringSave = ko.observable(false);
            self.isUserLoggedOut = ko.observable(true);
            self.isPageRedirected = ko.observable(false);
            self.isResourcesLoaded = ko.observable(false);

            self.errorMessageKey = ko.observable('');
            self.successMessageKey = ko.observable('');

            // Sets the password policies
            self.passwordPolicies = ko.observable();
            // Checks whether the case is a change password
            self.isChangePassword = ko.observable(false);

            self.showCreateNewPasswordMsg = ko.observable(false);
            self.createNewPasswordError = ko.observable('');
            self.isPasswordExpired = ko.observable(false);
            self.hasFieldLevelError = ko.observable(false);
            self.ignoreConfirmPasswordValidation = ko.observable(true);
            self.forgotPasswordMsg = ko.observable('');

            // Social Wish List
            self.myWishLists = ko.observableArray();
            self.joinedWishLists = ko.observableArray();

            self.isSesExpDuringPlaceOrder = ko.observable(false);

            // B2B ViewModel
            self.parentOrganization = new ParentOrganisation();
            if(pUserData.parentOrganization) {
                ko.mapping.fromJS(pUserData.parentOrganization, {}, self.parentOrganization);
            }
            self.refreshPageAfterContactLogout = ko.observable(false);
            self.catalogId = ko.observable('');
            self.roles = ko.observableArray([]);
            self.isDelegatedAdmin = ko.observable(false);
            self.isApprover = ko.observable(false);
            self.organizations = ko.observableArray([]);
            self.defaultShippingAddressType = ko.observable();
            self.defaultBillingAddressType = ko.observable();

            // Used to capture a notification message that should be displayed when a user is redirected.
            self.redirectNotificationMessage = ko.observable('');
            self.sessionExpiredProfileRedirected = false;

            //fields for order approval
            self.approvalRequired = ko.observable(false);
            self.orderPurchaseLimit = ko.observable(null);
            /**
             * Callback invoked when email address field receives focus. Disables email validation.
             *
             * @function
             * @name UserViewModel#emailAddressFocused
             */
            self.emailAddressFocused = function() {
                self.ignoreEmailValidation(true);
                return true;
            };

            /**
             * Callback invoked when email address field loses focus. Re-enable email validation.
             *
             * @function
             * @name UserViewModel#emailAddressLostFocus
             */
            self.emailAddressLostFocus = function() {
                self.ignoreEmailValidation(false);
                return true;
            };

            self.updatedShippingAddress = null;
            self.updatedShippingAddressBook = null;

            /*
             * Callback invoked when confirm password field is modified.
             */
            self.confirmPassword.subscribe(function(newValue) {
                self.newPassword.isModified(true);
            });

            /*
             * Callback invoked when marketing emails field is modified.
             */
            self.emailMarketingMails.subscribe(function(newValue) {
                self.emailMarketingModified(true);
            });

            /**
             * Callback to update shipping address if modified from other parts of the site. Invoked on
             * receiving a CHECKOUT_SAVE_SHIPPING_ADDRESS pubsub event.
             *
             * @private
             * @function
             * @name UserViewModel#updateShippingAddress
             */
            self.updateShippingAddress = function(opts) {
                // Now if any other module is updating a shipping address on the User Profile, it will just be
                // adding a secondary address.
                if (self.shippingAddressBook()) {
                    this.isDefaultAddress(self.shippingAddressBook().length === 0);

                    if (!self.isAddressSaved(this) && this.isValid()) {
                        self.shippingAddressBook.push(this);
                    }
                }
            };

            /**
             * Updates the locale associated to this user. Invoked on receiving
             * a CHECKOUT_USER_LOCALE pubsub event.
             *
             * @private
             * @function
             * @name UserViewModel#updateLocale
             */
            self.updateLocale = function() {
                self.locale(this);
            };

            /**
             * Updates the user locale when it is not part of supported locales. Invoked on receiving
             * a USER_LOCALE_NOT_SUPPORTED pubsub event.
             *
             * @private
             * @function
             * @name UserViewModel#updateLocaleToSupported
             */
            self.updateLocaleToSupported = function() {
                if (self.locale.isModified !== undefined) {
                    var currentLocale = ccRestClient.getStoredValue(CCConstants.LOCAL_STORAGE_USER_CONTENT_LOCALE);
                    var updateLocaleToProfile = false;
                    // Check if the locale is a supported one. If so, do not update profile.
                    var supportedLocaleNames = [];
                    for (var i = 0; i < self.supportedLocales.length; i++) {
                        supportedLocaleNames.push(self.supportedLocales[i].name);
                    }
                    if (supportedLocaleNames.indexOf(self.contextData.global.user.locale) > -1) {
                        self.locale(self.contextData.global.user.locale);
                    } else if (currentLocale) {
                        self.locale(JSON.parse(currentLocale)[0].name);
                        updateLocaleToProfile = true;
                    } else {
                        self.locale(self.contextData.global.locale);
                        updateLocaleToProfile = true;
                    }
                    self.locale.isModified(true);
                    if (updateLocaleToProfile) {
                        $.Topic(pubSub.topicNames.USER_PROFILE_UPDATE_SUBMIT).publishWith(self, [{message: "success"}]);
                        self.locale.isModified(false);
                        $.Topic(pubSub.topicNames.UPDATE_USER_LOCALE_NOT_SUPPORTED_ERROR).publish();
                    }

                }
            };

            /*
             * This computed will return  whether the error message on the
             * create new password modal should be visible or not.
             */
            self.showExpiredPasswordErrorMsg = ko.computed(function() {
                if (self.isPasswordExpired() &&
                    ((self.oldPassword.isModified() && !self.oldPassword.isValid()) ||
                        (self.newPassword.isModified() && !self.newPassword.isValid()) ||
                        (self.confirmPassword.isModified() && !self.confirmPassword.isValid()) ||
                        self.hasFieldLevelError())) {
                    return false;
                }
                return true;
            }, self);

            /**
             * Handle the validation of the user data entered while creating an account.
             *
             * @function
             * @name UserViewModel#validateUser
             * @returns {boolean} <code>true</code> if the user details are valid, and
             * <code>false</code> otherwise.
             */
            self.validateUser = function() {
                self.ignoreEmailValidation(false);
                self.ignorePasswordValidation(false);
                self.ignoreConfirmPasswordValidation(false);
                self.emailAddress.isModified(true);
                self.firstName.isModified(true);
                self.lastName.isModified(true);
                self.newPassword.isModified(true);
                self.confirmPassword.isModified(true);
                return self.isValid();
            };

            /**
             * Check if the complete user profile is valid by checking the components.
             *
             * @function
             * @name UserViewModel#isValid
             * @returns {boolean} true if the user profile is valid, otherwise false.
             */
            self.isValid = function() {
                return (self.emailAddress.isValid() &&
                    self.firstName.isValid() &&
                    self.lastName.isValid() &&
                    self.newPassword.isValid() &&
                    self.confirmPassword.isValid()
                );
            };

            /**
             * Reset all registration details.
             *
             * @function
             * @name UserViewModel#reset
             */
            self.reset = function() {
                if (self.isUserLoggedOut() || (!self.loggedIn() && !self.isUserSessionExpired())) {
                    self.login('');
                    if (self.isResourcesLoaded()) {
                        self.login.isModified(false);
                    }
                    self.loggedInUserName('');
                }
                self.emailAddress('');
                self.firstName('');
                self.lastName('');
                self.loginError('');
                self.resetPassword();
                self.isLoginFailed(false);
                self.emailMarketingMails(false);
                if (self.isResourcesLoaded()) {
                    self.lastName.isModified(false);
                    self.emailAddress.isModified(false);
                    self.firstName.isModified(false);
                }
            };

            /**
             * Reset the password field.
             *
             * @function
             * @name UserViewModel#resetPassword
             */
            self.resetPassword = function() {
                self.password('');
                self.newPassword('');
                self.confirmPassword('');
                self.oldPassword('');
                if (self.isResourcesLoaded()) {
                    self.password.isModified(false);
                    self.newPassword.isModified(false);
                    self.confirmPassword.isModified(false);
                    self.oldPassword.isModified(false);
                }
                self.isChangePassword(false);
            };

            /**
             * Reset all the details from the registration fields without
             * resetting the email address.
             *
             * @function
             * @name UserViewModel#resetDetails
             */
            self.resetDetails = function() {
                self.firstName('');
                self.lastName('');
                self.resetPassword();
                self.emailMarketingMails(false);
                self.firstName.isModified(false);
                self.lastName.isModified(false);
                self.emailMarketingModified(false);
            };

            /**
             * Handle the validation of login.
             *
             * @function
             * @name UserViewModel#isLoginValid
             * @returns {boolean} true if login is valid, otherwise false.
             */
            self.isLoginValid = function() {
                self.ignoreEmailValidation(false);
                return (this.login.isValid()
                    && this.password.isValid());
            };

            /**
             * Handle the validation of user data entered during login. Also raises the modified flags on
             * login and password fields.
             *
             * @function
             * @name UserViewModel#validateLogin
             * @returns {boolean} true if login is valid, otherwise false.
             */
            self.validateLogin = function() {
                var self = this;
                self.login.isModified(true);
                self.password.isModified(true);
                return self.isLoginValid();
            };

            /**
             * Reset login details.
             *
             * @function
             * @name UserViewModel#resetLoginData
             */
            self.resetLoginData =  function() {
                var self = this;
                self.login('');
                self.password('');
                self.loginError('');
                self.isLoginFailed(false);
                if (self.isResourcesLoaded()) {
                    self.login.isModified(false);
                    self.password.isModified(false);
                }
            };

            /**
             * Reset modified flags on knockout observables.
             *
             * @function
             * @name UserViewModel#resetModified
             */
            self.resetModified = function() {
                var self = this;
                self.emailAddress.isModified(false);
                self.firstName.isModified(false);
                self.lastName.isModified(false);
                self.oldPassword.isModified(false);
                self.newPassword.isModified(false);
                self.confirmPassword.isModified(false);
                self.emailMarketingModified(false);
            };

            /**
             * Reset modified flags of address objects in the address book.
             *
             * @function
             * @name UserViewModel#resetShippingAddressBookModified
             */
            self.resetShippingAddressBookModified = function() {
                var self = this;
                ko.utils.arrayForEach(self.shippingAddressBook(), function (shippingAddress) {
                    shippingAddress.resetModified();
                });
            };

            /**
             * Check whether profile is modified.
             *
             * @function
             * @name UserViewModel#isProfileModified
             * @returns {boolean} true if profile has been modified, otherwise false.
             */
            self.isProfileModified = function() {
                // Checking whether user basic profile has been modified.
                if (self.firstName.isModified() || self.lastName.isModified() ||
                    self.emailAddress.isModified() || self.emailMarketingModified() || self.locale.isModified()) {
                    return true;
                }
                return false;
            };

            /**
             * Check whether any of the password fields have been
             * modified: oldPassword, newPassword, confirmPassword.
             *
             * @function
             * @name UserViewModel#isPasswordModified
             * @returns {boolean} true if any password fields are modified, otherwise false.
             */
            self.isPasswordModified = function() {
                if (self.oldPassword.isModified() || self.newPassword.isModified() || self.confirmPassword.isModified()) {
                    return true;
                }
                return false;
            };

            /**
             * Check whether all password fields are valid.
             *
             * @function
             * @name UserViewModel#isPasswordValid
             * @returns {boolean} true if all password fields are valid, otherwise false.
             */
            self.isPasswordValid = function () {
                self.oldPassword.isModified(true);
                self.newPassword.isModified(true);
                self.confirmPassword.isModified(true);

                // Checking whether user password fields are valid.
                if (self.oldPassword.isValid() && self.newPassword.isValid() &&
                    self.confirmPassword.isValid()) {
                    return true;
                }
                return false;
            };

            /**
             * Check whether profile is valid.
             *
             * @function
             * @name UserViewModel#isProfileValid
             * @returns {boolean} true if the profile is valid, otherwise false.
             */
            self.isProfileValid = function () {
                self.firstName.isModified(true);
                self.lastName.isModified(true);
                self.emailAddress.isModified(true);
                self.ignoreEmailValidation(false);
                // Checking whether user basic profile has been modified.
                if (self.firstName.isValid() && self.lastName.isValid() &&
                    self.emailAddress.isValid()) {
                    return true;
                }
                return false;
            };

            /**
             * Checks if the supplied address already exists in the profile address book.
             *
             * @function
             * @name UserViewModel#isAddressSaved
             * @param {Address} addr An address object.
             * @returns {boolean} true if the address is already present, otherwise false.
             */
            self.isAddressSaved = function (addr) {

                for (var k = 0; k < self.shippingAddressBook().length; k++) {
                    if (addr.compare(self.shippingAddressBook()[k]))
                    {
                        return true;
                    }
                }

                return false;
            };

            /**
             * Returns true if current user is b2b user.
             */
            self.isB2BUser = function(){
                if(self.parentOrganization && self.parentOrganization.name()) {
                    return true;
                }
                return false;
            }

            /**
             * Check if the shipping address book contains any addresses which have been modified.
             *
             * @function
             * @name UserViewModel#isShippingAddressBookModified
             * @returns true if any shipping addresses are modified, otherwise false.
             */
            self.isShippingAddressBookModified = function() {
                if (self.deleteShippingAddress())
                {
                    return true;
                }

                for (var k = 0; k < self.shippingAddressBook().length; k++) {
                    if (self.shippingAddressBook()[k].isModified())
                    {
                        return true;
                    }
                }
                return false;
            };

            /**
             * Check if all the addresses in the shipping address book are valid.
             *
             * @function
             * @name UserViewModel#isShippingAddressBookValid
             * @returns true if all shipping addresses are valid, otherwise false.
             */
            self.isShippingAddressBookValid = function() {
                for (var k = 0; k < self.shippingAddressBook().length; k++) {
                    if (!self.shippingAddressBook()[k].isValid())
                    {
                        return false;
                    }
                }
                return true;
            };

            /**
             * Check if the dynamic properties array contains any dynamic property which have been modified.
             *
             * @function
             * @name UserViewModel#isDynamicPropertiesModified
             * @returns true if any dynamic property is modified, otherwise false.
             */
            self.isDynamicPropertiesModified = function() {
                for (var k = 0; k < self.dynamicProperties().length; k++) {
                    if (self.dynamicProperties()[k].value.isModified())
                    {
                        return true;
                    }
                }
                return false;
            };

            /**
             * Select a default shipping address from the shipping address book.
             * Assumes that addr is a reference to an Address object that already exists in the address book.
             *
             * @function
             * @name UserViewModel#selectDefaultAddress
             * @param {Address} addr An address object.
             */
            self.selectDefaultAddress = function(addr) {
                for (var k = 0; k < self.shippingAddressBook().length; k++) {
                    var shippingAddress = self.shippingAddressBook()[k];
                    shippingAddress.isDefaultAddress(shippingAddress === addr);
                }
            };

            /**
             * Sort the addresses in shipping address book by the following requirements:
             *
             * <ol>
             *   <li>Default Shipping Address should always be first.</li>
             *   <li>Then sort addresses by Last Name in ascending order.</li>
             *   <li>Then sort addresses by Address Line 1 in ascending order.</li>
             * </ol>
             *
             * @private
             * @function
             * @name UserViewModel#sortShippingAddresses
             */
            self.sortShippingAddresses = function () {
                if (self.updatedShippingAddressBook && self.updatedShippingAddressBook.length) {
                    self.updatedShippingAddressBook.sort(function(left, right) {
                        // Default Address has the highest sort priority.
                        if (left.isDefaultAddress)
                            return -1;
                        if (right.isDefaultAddress)
                            return 1;

                        if (left.lastName.toLowerCase() == right.lastName.toLowerCase()) {
                            return left.address1.toLowerCase() == right.address1.toLowerCase() ? 0
                                : (left.address1.toLowerCase() < right.address1.toLowerCase() ? -1 : 1);
                        } else if (left.lastName.toLowerCase() < right.lastName.toLowerCase()) {
                            return -1;
                        } else {
                            return 1;
                        }
                    });
                }
            };

            /**
             * Successful Login Callback invoked on receiving a success response from the login service.
             *
             * @private
             * @function
             * @name UserViewModel#loginSuccessFunc
             * @param {boolean} isAutoLogin Flag to track if user was logged in automatically, or
             *        if we need to reset user data.
             */
            self.loginSuccessFunc = function(isAutoLogin) {
                self.loggedIn(self.client().loggedIn);
                self.isUserSessionExpired(false);
                self.isLoginFailed(false);
                self.isSesExpDuringPlaceOrder(false);
                self.isUserLoggedOut(false);
                self.password('');
                self.password.isModified(false);
                notifier.clearError(self.WIDGET_ID);
                self.id(self.client().profileId);
                if (!navigation.isPathEqualTo(self.myAccountHash) && self.pageToRedirect() == self.myAccountHash) {
                    self.sessionExpiredProfileRedirected = true;
                }
                if (self.pageToRedirect() && self.pageToRedirect()!= '' && self.pageToRedirect() != self.checkoutHash) {
                    var hash = self.pageToRedirect();
                    self.pageToRedirect(null);
                    if (navigation.isPathEqualTo(hash)) {
                        var localData = self.getLocalData();
                        //if the session expired during the save on my profile page and if the user logs in with the same user, then do not reload the user data
                        if (localData.login == self.login() && navigation.isPathEqualTo(self.myAccountHash)  && !self.isPasswordExpired() && self.isSessionExpiredDuringSave()) {
                            //self.isSessionExpiredDuringSave(false); this is set to false on the profile page
                        } else {
                            self.getCurrentUser(isAutoLogin, true);
                            //if the session expired during the save on my profile page and if the user logs in with different login, then reset the user data
                            if (navigation.isPathEqualTo(self.myAccountHash)) {
                                self.isSessionExpiredDuringSave(false);
                                $.Topic(pubSub.topicNames.USER_PROFILE_SESSION_RESET).publish();
                            }
                        }
                    }
                    self.isPageRedirected(true);
                    navigation.goTo(hash);
                } else {
                    self.getCurrentUser(isAutoLogin , true);
                }
                self.isPasswordExpired(false);
            };

            /**
             * Failed Login Callback invoked on receiving an error from the login service.
             *
             * @private
             * @function
             * @name UserViewModel#loginErrorFunc
             */
            self.loginErrorFunc = function() {
                self.isLoginFailed(true);
                self.loginError(CCi18n.t('ns.common:resources.loginError'));
                self.password('');
                self.password.isModified(false);
            };

            /**
             * Processes the dynamic property metadata
             * @private
             * @function
             * @name UserViewModel#processDynamicPropertiesMetadata
             * @param {Object[]} data List of dynamic properties
             */
            self.processDynamicPropertiesMetadata = function(data) {
                var self = this;
                var newProperties = [];
                for (var i = 0; i < data.length; i++) {
                    var newProperty = true;
                    // If property already defined, update its metadata
                    for (var j = 0; j < self.dynamicProperties().length && newProperty; j++) {
                        if (data[i].id === self.dynamicProperties()[j].id()) {
                            newProperty = false;
                            self.dynamicProperties()[j].initializeMetadata(data[i], false);
                            self.dynamicProperties()[j].value(data[i].value);
                        }
                    }

                    // Set up new property
                    if (newProperty) {
                        var dynPropItem = new DynamicProperty();
                        dynPropItem.initializeMetadata(data[i], true);
                        dynPropItem.value(data[i].value);
                        newProperties.push(dynPropItem);
                    }
                }

                // Add new properties
                for (var i = 0; i < newProperties.length; i++) {
                    self.dynamicProperties.push(newProperties[i]);
                }
            };
            if (pUserData.dynamicProperties) {
                self.processDynamicPropertiesMetadata(pUserData.dynamicProperties);
            }
            self.populateUserFromLocalData(false);
            self.storeConfiguration = CCStoreConfiguration.getInstance();

            //section for calling the subscriptions
            $.Topic(pubSub.topicNames.USER_REGISTRATION_SUBMIT).subscribe(self.registerUser);
            $.Topic(pubSub.topicNames.USER_LOGIN_SUBMIT).subscribe(self.handleLogin);
            $.Topic(pubSub.topicNames.USER_LOGIN_CANCEL).subscribe(self.handleCancel);
            // Custom extensions for registration fields
            // Wait until i18n is ready before attempting to resolve any resource bundles
            // This isn't strictly required because locale *should* be ready before
            // any view models are created, but just to be safe, subscribe anyway
            $.Topic(pubSub.topicNames.LOCALE_READY).subscribe(self.loadResources.bind(self));
            $.Topic(pubSub.topicNames.USER_PROFILE_UPDATE_SUBMIT).subscribe(self.handleUpdateProfile);
            $.Topic(pubSub.topicNames.USER_PROFILE_UPDATE_CANCEL).subscribe(self.handleUpdateCancel);
            $.Topic(pubSub.topicNames.PAGE_LAYOUT_LOADED).subscribe(self.handlePageChanged.bind(self));
            $.Topic(pubSub.topicNames.PAGE_METADATA_CHANGED).subscribe(self.handlePageChanged.bind(self));
            $.Topic(pubSub.topicNames.USER_LOGOUT_SUBMIT).subscribe(self.handleLogout.bind(self));
            $.Topic(pubSub.topicNames.USER_SESSION_VALID).subscribe(self.handleSessionValid.bind(self));
            $.Topic(pubSub.topicNames.USER_SESSION_EXPIRED).subscribe(self.handleSessionExpired.bind(self));
            $.Topic(pubSub.topicNames.CHECKOUT_SAVE_SHIPPING_ADDRESS).subscribe(self.updateShippingAddress);
            $.Topic(pubSub.topicNames.CHECKOUT_USER_LOCALE).subscribe(self.updateLocale);
            $.Topic(pubSub.topicNames.USER_LOCALE_NOT_SUPPORTED).subscribe(self.updateLocaleToSupported);

            return (self);
        };

        /**
         * Intialize localized validations and error messages. Invoked on receiving a .LOCALE_READY pubsub event.
         *
         * @private
         * @function
         * @name UserViewModel#loadResources
         */
        UserViewModel.prototype.loadResources = function() {
            var self = this;
            self.firstName.extend({ required: { params: true, message: CCi18n.t('ns.common:resources.firstNameRequired')}});
            self.lastName.extend({ required: { params: true, message: CCi18n.t('ns.common:resources.lastNameRequired')}});
            self.locale.extend({ required: { params: true, message: CCi18n.t('ns.common:resources.localeRequired')}});
            self.emailAddressForForgottenPwd.extend({
                required: { params: true, message: CCi18n.t('ns.common:resources.emailAddressRequired')},
                maxLength: { params: CCConstants.CYBERSOURCE_EMAIL_MAXIMUM_LENGTH, message: CCi18n.t('ns.common:resources.maxLengthEmailAdd', {maxLength: CCConstants.CYBERSOURCE_EMAIL_MAXIMUM_LENGTH})},
                email: { params: true, onlyIf: function () { return (!self.ignoreEmailValidation()); }, message: CCi18n.t('ns.common:resources.emailAddressInvalid')}
            });
            self.emailAddress.extend({
                required: { params: true, message: CCi18n.t('ns.common:resources.emailAddressRequired')},
                maxLength: { params: CCConstants.CYBERSOURCE_EMAIL_MAXIMUM_LENGTH, message: CCi18n.t('ns.common:resources.maxLengthEmailAdd', {maxLength: CCConstants.CYBERSOURCE_EMAIL_MAXIMUM_LENGTH})},
                email:{ params: true, onlyIf: function () { return (!self.ignoreEmailValidation()); }, message: CCi18n.t('ns.common:resources.emailAddressInvalid')}});
            self.login.extend({
                required: { params: true, message: CCi18n.t('ns.common:resources.emailAddressRequired')},
                maxLength: { params: CCConstants.CYBERSOURCE_EMAIL_MAXIMUM_LENGTH, message: CCi18n.t('ns.common:resources.maxLengthEmailAdd', {maxLength: CCConstants.CYBERSOURCE_EMAIL_MAXIMUM_LENGTH})},
                email: { params: true, onlyIf: function () { return (!self.ignoreEmailValidation()); }, message: CCi18n.t('ns.common:resources.emailAddressInvalid')}});
            self.password.extend({ required: { params: true, message: CCi18n.t('ns.common:resources.passwordRequired')}});
            self.newPassword.extend({
                password: { params: { policies: self.passwordPolicies, login: self.emailAddress, observable: self.newPassword, includePreviousNPasswordRule: self.isChangePassword},
                    onlyIf: function () { return ( (!self.ignoreEmailValidation() || self.newPassword.isModified()) && !self.ignorePasswordValidation() ); },
                    message: CCi18n.t('ns.common:resources.passwordPoliciesErrorText')},
                required: { params: true, message: CCi18n.t('ns.common:resources.passwordRequired')}
            });
            self.oldPassword.extend({ required: { params: true, message: CCi18n.t('ns.common:resources.currentPasswordRequired')}});
            self.confirmPassword.extend({
                required: { params: true, message: CCi18n.t('ns.common:resources.confirmPasswordRequired')},
                match: { params: self.newPassword, onlyIf: function () { return (!self.ignoreConfirmPasswordValidation()); }, message: CCi18n.t('ns.common:resources.passwordUnmatched')}});
            self.isResourcesLoaded(true);
        };

        /**
         * Read and populate the view model with loggedinAtCheckout, loggedoutAtCheckout,
         * OrderID, loggedInUserName, login and isUserSessionExpired flags.
         *
         * @function
         * @name UserViewModel#populateUserFromLocalData
         * @param {boolean} loadAll Flag to control whether we load all data.
         */
        UserViewModel.prototype.populateUserFromLocalData = function (loadAll) {
            var self = this;
            //load the data from local storage
            var cookieData = self.getLocalData();
            if (cookieData != null) {
                self.loggedinAtCheckout(cookieData.loggedinAtCheckout);
                self.loggedoutAtCheckout(cookieData.loggedoutAtCheckout);
                self.orderId(cookieData.orderId);
                if (loadAll && cookieData.login) {
                    self.loggedInUserName(cookieData.loggedInUserName);
                    self.login(cookieData.login);
                    self.isUserSessionExpired(cookieData.isUserSessionExpired);
                    self.isUserLoggedOut(cookieData.isUserLoggedOut);
                }
            }
        };

        /**
         * Read loggedinAtCheckout, loggedoutAtCheckout, OrderID, loggedInUserName, login
         * and isUserSessionExpired flags from the user local storage.
         *
         * @private
         * @function
         * @name UserViewModel#getLocalData
         * @returns {Object} cookieData Parsed local storage data.
         */
        UserViewModel.prototype.getLocalData = function () {
            var self = this;
            //load the data from local storage
            var cookieData = null;
            try {
                cookieData = storageApi.getInstance().getItem("user");
                if (cookieData) {
                    cookieData = JSON.parse(cookieData);
                }
            }
            catch (pError) {
            }
            return cookieData;
        };

        /**
         * Write the loggedinAtCheckout, loggedoutAtCheckout, OrderID, loggedInUserName, login and
         * isUserSessionExpired flags to user local storage. The argument 'setParam' is a string which
         * may be one of the following:
         *
         * <ul>
         *  <li><b>all</b> - Save all parameters.</li>
         *  <li><b>checkoutFlag</b> - Save loggedInAtCheckout and loggedOutAtCheckout.</li>
         *  <li><b>orderId</b> - Save orderID.</li>
         *  <li><b>sessionExpiry</b> - Save isUserSessionExpired and isUserLoggedOut.</li>
         * </ul>
         *
         * @private
         * @function
         * @name  UserViewModel#setLocalData
         * @param {string} setParam Enumerated string to select parameters saved to local storage.
         * @returns {boolean} true if setParam is falsey or empty, otherwise implicit return.
         */
        UserViewModel.prototype.setLocalData = function (setParam) {
            var self = this;
            if (!setParam && setParam == '') {
                return true;
            }
            var userCookieData = self.getLocalData();
            if (userCookieData == null) {
                userCookieData = {};
            }
            switch (setParam) {
                case 'all':
                    userCookieData = {
                        loggedinAtCheckout: self.loggedinAtCheckout(),
                        loggedoutAtCheckout: self.loggedoutAtCheckout(),
                        orderId: self.orderId(),
                        loggedInUserName: self.loggedInUserName(),
                        login: self.login(),
                        isUserSessionExpired: self.isUserSessionExpired(),
                        isUserLoggedOut: self.isUserLoggedOut()
                    };
                    break;
                case 'checkoutFlag':
                    userCookieData.loggedinAtCheckout = self.loggedinAtCheckout();
                    userCookieData.loggedoutAtCheckout = self.loggedoutAtCheckout();
                    break;
                case 'orderId':
                    userCookieData.orderId = self.orderId();
                    break;
                case 'sessionExpiry':
                    userCookieData.isUserSessionExpired = self.isUserSessionExpired();
                    userCookieData.isUserLoggedOut = self.isUserLoggedOut();
                    break;
            }
            // Write the user to local storage
            try {
                storageApi.getInstance().setItem("user", JSON.stringify(userCookieData));
            }
            catch(pError) {
            }
        };

        /**
         * Update the values of loggedinAtCheckout, and loggedoutAtCheckout and write them to
         * user local storage.
         *
         * @function
         * @name UserViewModel#updateLocalData
         * @param {boolean} loggedinAtCheckout Whether the user is logged in on the checkout page.
         * @param {boolean} loggedoutAtCheckout Whether the user is logged out on the checkout page.
         */
        UserViewModel.prototype.updateLocalData = function(loggedinAtCheckout, loggedoutAtCheckout) {
            var self = this;
            self.loggedinAtCheckout(loggedinAtCheckout);
            self.loggedoutAtCheckout(loggedoutAtCheckout);
            self.setLocalData('checkoutFlag');
        };

        /**
         * Remove user local storage on logout.
         *
         * @function
         * @name UserViewModel#removeLocalData
         */
        UserViewModel.prototype.removeLocalData = function() {
            try {
                storageApi.getInstance().removeItem("user");
            }
            catch(pError) {
            }
        };

        /**
         * Send a reset password email.
         *
         * @function
         * @name #UserViewModel#resetForgotPassword
         */
        UserViewModel.prototype.resetForgotPassword = function() {
            var self = this;
            var inputParams = {};

            inputParams[CCConstants.LOGIN] = self.emailAddressForForgottenPwd();

            self.adapter.persistCreate(CCConstants.ENDPOINT_FORGOT_PASSWORD, 'id', inputParams, null,
                //success callback
                function(data) {
                    $.Topic(pubSub.topicNames.USER_RESET_PASSWORD_SUCCESS).publish(data);
                },
                //error callback when an internal error occurs.
                function(data) {
                    $.Topic(pubSub.topicNames.USER_RESET_PASSWORD_FAILURE).publish(data);
                }
            );
        };

        /**
         * Handle user login. Invoked on receiving a USER_LOGIN_SUBMIT pubsub event.
         *
         * @private
         * @function
         * @name UserViewModel#handleLogin
         */
        UserViewModel.prototype.handleLogin = function() {
            var self = this;

            if (!self.isLoginValid()) {
                self.login.isModified(true);
                self.password.isModified(true);
                return false;
            }
            ccRestClient.setStoredValue(CCConstants.LOCAL_STORAGE_ORGANIZATION_ID, null);
            self.client().login(this.login(), this.password(),
                // Success Function
                function() {
                    self.loginSuccessFunc(false);
                    $.Topic(pubSub.topicNames.USER_LOGIN_SUCCESSFUL).publish();
                },
                // Error function
                function(pResult) {
                    if (pResult.error == CCConstants.PASSWORD_EXPIRED) {
                        self.isPasswordExpired(true);
                        $.Topic(pubSub.topicNames.USER_PASSWORD_EXPIRED).publish();
                    } else if (pResult.error == CCConstants.PASSWORD_GENERATED) {
                        self.isPasswordExpired(true);
                        $.Topic(pubSub.topicNames.USER_PASSWORD_GENERATED).publish();
                    } else {
                        self.loginErrorFunc();
                        $.Topic(pubSub.topicNames.USER_LOGIN_FAILURE).publish(pResult);
                    }
                }
            );
        };

        /**
         * Handle SAML login.
         *
         * @private
         * @function
         * @name UserViewModel#handleSamlLogin
         */
        UserViewModel.prototype.handleSamlLogin = function() {
            var self = this;

            var path = navigation.getPathWithoutLocale();
            if (path.indexOf('?loggedIn=false') > -1) {
                var pagePos = path.indexOf('page=') + 5;
                path = decodeURIComponent(path.substr(pagePos));

                path = (path.charAt(0) === '/' ? path : '/' + path);
            }
            else {
                path = navigation.getRelativePath();
            }

            self.client().setSessionStoredValue("SSO_RETURN_URL", path);

            self.client().generateSamlAuthnRequest(
                function(pResult) {
                    var form = $("<form/>",
                        { action: pResult.authnRequestTarget,
                            method: 'POST'}
                    );
                    form.append(
                        $("<input>",
                            { type:'text',
                                name:'SAMLRequest',
                                value: pResult.authnRequest}
                        )
                    );
                    $(document.body).append(form);
                    form.submit();
                },
                // Error function
                function(pResult) {
                    self.loginErrorFunc();
                    $.Topic(pubSub.topicNames.USER_LOGIN_FAILURE).publish(pResult);
                }
            );
        };

        /**
         * Handle user logout. Invoked on receiving a USER_LOGOUT_SUBMIT pubsub event.
         *
         * @private
         * @function
         * @name UserViewModel#handleLogout
         */
        UserViewModel.prototype.handleLogout = function() {
            var self = this;
            $.Topic(pubSub.topicNames.USER_CLEAR_CART).publish([{message: "success"}]);
            var successFunc = function() {
                $.Topic(pubSub.topicNames.USER_LOGOUT_SUCCESSFUL).publish([{message: "success"}]);
                self.clearUserData();
                self.profileRedirect();
                if(self.refreshPageAfterContactLogout()){
                    self.refreshPageAfterContactLogout(false);
                    window.location.assign(self.contextData.global.links.home.route);
                }
            };
            var errorFunc = function(pResult) {
                self.clearUserData();
                self.profileRedirect();
                window.location.assign(self.contextData.global.links.home.route);
            };
            if (self.loggedIn()) {
                if(self.parentOrganization && self.parentOrganization.name()){
                    self.refreshPageAfterContactLogout(true);
                }
                self.client().logout(successFunc, errorFunc);
            } else {
                self.clearUserData();
                $.Topic(pubSub.topicNames.USER_LOGOUT_SUCCESSFUL).publish([{message: "success"}]);
                self.profileRedirect();
            }

        };

        /**
         * Profile Redirect.
         *
         * @private
         * @function
         * @name UserViewModel#profileRedirect
         */
        UserViewModel.prototype.profileRedirect = function() {
            var self = this;

            if (navigation.isPathEqualTo(self.contextData.global.links.profile.route) ||
                navigation.isPathEqualTo(self.contextData.global.links.orderHistory.route) ||
                navigation.isPathEqualTo(self.contextData.global.links.orderDetails.route) ||
                navigation.isPathEqualTo(self.contextData.global.links.scheduledOrders.route)){

                navigation.goTo(self.contextData.global.links.home.route);
            }
        };

        /**
         * Clear user data after session expiry or logout, if the user does not opt to re-login.
         *
         * @private
         * @function
         * @name UserViewModel#clearUserData
         */
        UserViewModel.prototype.clearUserData = function() {
            var self = this;
            self.isUserSessionExpired(false);
            self.isUserLoggedOut(true);
            self.removeLocalData();
            self.loggedIn(false);
            self.editShippingAddress(null);
            self.deleteShippingAddress(false);
            self.shippingAddressBook([]);
            self.resetLoginData();
            self.reset();
            self.updatedShippingAddress = null;
            self.updatedShippingAddressBook = null;
            self.id(null);
            self.parentOrganization = new ParentOrganisation();
            self.organizations([]);
            self.locale("");
            $.Topic(pubSub.topicNames.USER_LOAD_SHIPPING).publish([{message: "success"}]);
            for (var i = 0; i < self.dynamicProperties().length; i++) {
                self.dynamicProperties()[i].reset();
            }
        };

        /**
         * Handle cancelling a login in progress. Invoked on receiving a .USER_LOGIN_CANCEL pubsub event.
         *
         * @private
         * @function
         * @name UserViewModel#handleCancel
         */
        UserViewModel.prototype.handleCancel = function() {
            var self = this;
            self.resetLoginData();
            notifier.clearError(self.WIDGET_ID);
        };

        /**
         * Handle new user registration. Invoked on receiving a USER_REGISTRATION_SUBMIT pubsub event.
         *
         * @private
         * @function
         * @name UserViewModel#registerUser
         * @param {Object} obj Widget
         */
        UserViewModel.prototype.registerUser = function(obj) {
            var self = this;
            self.receiveEmail = self.emailMarketingMails() ? "yes" : "no";
            var inputParams = {};
            inputParams[CCConstants.PROFILE_EMAIL] = self.emailAddress();
            inputParams[CCConstants.PROFILE_PASSWORD] = self.newPassword();
            inputParams[CCConstants.PROFILE_FIRST_NAME] = self.firstName();
            inputParams[CCConstants.PROFILE_LAST_NAME] = self.lastName();
            inputParams[CCConstants.PROFILE_RECEIVE_EMAIL] = self.receiveEmail;

            // Adding shipping addresses if they exist
            if (self.shippingAddressBook() !== null && self.shippingAddressBook() != undefined && self.isShippingAddressBookValid()) {
                inputParams[CCConstants.PROFILE_SHIPPING_ADDRESSES] = self.shippingAddressBook();
            }

            if (!self.locale()) {
                var currentLocale = ccRestClient.getStoredValue(CCConstants.LOCAL_STORAGE_USER_CONTENT_LOCALE);
                if (currentLocale) {
                    self.locale(JSON.parse(currentLocale)[0].name);
                }
            }
            inputParams[CCConstants.PROFILE_LOCALE] = self.locale();

            self.adapter.persistCreate(CCConstants.ENDPOINT_CREATE_PROFILE, CCConstants.ENDPOINT_CREATE_PROFILE, inputParams,
                //success callback
                function(data) {
                    data.widgetId = obj.widgetId;
                    self.handleAutoLogin(obj);
                },
                function(data) {
                    data.widgetId = obj.widgetId;
                    if (data.errorCode == CCConstants.CREATE_PROFILE_USER_EXISTS){
                        data.message = CCi18n.t('ns.common:resources.accountAlreadyExists');
                    }

                    $.Topic(pubSub.topicNames.USER_CREATION_FAILURE).publish(data);
                }
            );
        };

        /**
         * Handle the auto-login of a user from the front end.
         * This is used to auto-login users after they are registered.
         *
         * THIS SHOULD ONLY BE USED TO AUTO-LOGIN as it does not have
         * a lot of checks needed for normal login. Invoked on registering
         * a user successfully.
         *
         * @private
         * @function
         * @name UserViewModel#handleAutoLogin
         */
        UserViewModel.prototype.handleAutoLogin = function(obj) {
            var self = this;
            self.orderId('');
            self.login(self.emailAddress());
            ccRestClient.setStoredValue(CCConstants.LOCAL_STORAGE_ORGANIZATION_ID, null);
            self.client().login(self.login(), self.newPassword(),
                // Success Function
                function() {
                    var data ={};
                    data.widgetId = obj.widgetId;
                    self.loginSuccessFunc(true);
                    $.Topic(pubSub.topicNames.USER_AUTO_LOGIN_SUCCESSFUL).publish(data);
                },
                // Error function
                function(pResult) {
                    pResult.widgetId = obj.widgetId;
                    self.loginErrorFunc();
                    $.Topic(pubSub.topicNames.USER_AUTO_LOGIN_FAILURE).publish(pResult);
                }
            );
        };

        /**
         * This resets the isModified attribute of dynamic properties's value for the profile
         * @private
         * @function
         * @name UserViewModel#resetDynamicPropertiesValueIsModified
         */
        UserViewModel.prototype.resetDynamicPropertiesValueIsModified = function() {
            var self = this;
            for (var i = 0; i < self.dynamicProperties().length; i++) {
                if (self.dynamicProperties()[i].value.isModified) {
                    self.dynamicProperties()[i].value.isModified(false);
                }
            }
        };

        /**
         * Get current user profile
         * Gets the logged-in user's data via a REST call.
         *
         * @function
         * @name UserViewModel#getCurrentUser
         * @param {boolean} isAutoLogin Flag to suppress some actions for auto-login.
         * @param {boolean} isLogin Flag to perform few actions after login.
         */
        UserViewModel.prototype.getCurrentUser = function(isAutoLogin, isLogin) {
            var self = this;

            // Reset in case it has been set by a previous operation.
            self.redirectNotificationMessage('');
            var params = {};
            var contextObj = {};
            contextObj[CCConstants.ENDPOINT_KEY] = CCConstants.ENDPOINT_GET_CURRENT_USER;
            contextObj[CCConstants.IDENTIFIER_KEY] = "userData";
            var filterKey = self.storeConfiguration.getFilterToUse(contextObj);
            if (filterKey) {
                params[CCConstants.FILTER_KEY] = filterKey;
            }
            self.adapter.loadJSON('getUser', 'getCurrentUser', params,
                //success callback
                function(data) {

                    self.currentOrganization(data.currentOrganization);
                    // Currently ignoring the 'links' property as it is not being used and causing problems in ccLink custom binding
                    ko.mapping.fromJS(data, {'ignore': ["links","dynamicProperties"]}, self);
                    self.populateUserViewModel(data);
                    self.resetModified();
                    self.readyToDisplay(true);
                    if (!isAutoLogin) {
                        if(isLogin && !self.loggedinAtCheckout()) {
                            $.Topic(pubSub.topicNames.CART_READY).subscribe(function(){
                                $.Topic(pubSub.topicNames.USER_LOAD_SHIPPING).publish([{message: "success"}]);
                                $.Topic(pubSub.topicNames.CART_READY).unsubscribe();
                            });
                        } else {
                            $.Topic(pubSub.topicNames.USER_LOAD_SHIPPING).publish([{message: "success"}]);
                        }
                    } else {
                        $.Topic(pubSub.topicNames.AUTO_LOGIN_AND_GET_USER_DATA_SUCCESSFUL).publish();
                    }
                    if (self.sessionExpiredProfileRedirected) {
                        isLogin = true;
                        self.sessionExpiredProfileRedirected = false;
                    }
                    if(isLogin) {
                        if(data.parentOrganization && data.parentOrganization.name) {
                            if(navigation.isPathEqualTo(self.checkoutHash)) {
                                self.navigateToPage(self.checkoutHash);
                            } else {
                                $.Topic(pubSub.topicNames.CART_READY).subscribe(self.navigateToHome());
                            }
                        }

                        $.Topic(pubSub.topicNames.USER_LOAD_CART).publish(data);
                    }
                },
                //error callback
                function(data) {
                    if (data.status == CCConstants.HTTP_UNAUTHORIZED_ERROR) {
                        self.handleSessionExpired();
                        if (navigation.isPathEqualTo(self.contextData.global.links.profile.route) || navigation.isPathEqualTo(self.contextData.global.links.orderHistory.route)) {
                            navigation.doLogin(navigation.getPath(), self.contextData.global.links.home.route);
                        }
                    }
                }
            );

            // Utility function to handle navigation to the home page when a B2B user logs in.
            self.navigateToHome = function () {

                // Give the cart some time to load the user data before navigating to the new page.
                setTimeout(function () {
                    self.navigateToPage(self.contextData.global.links.home.route, function () {
                        if (self.redirectNotificationMessage() !== '') {
                            notifier.sendWarningToPage('UserViewModel', self.redirectNotificationMessage(), true, 'home', true);
                            self.redirectNotificationMessage('');
                        }
                    });
                }, 2000);

            };
        };

        /**
         * Populate the user view model.
         *
         * @function
         * @name UserViewModel#populateUserViewModel
         * @param {Object} userData Object containing source user data.
         */
        UserViewModel.prototype.populateUserViewModel = function(userData) {
            var self = this;
            self.emailAddress(userData.email);
            self.firstName(userData.firstName);
            self.lastName(userData.lastName);
            self.loggedInUserName(userData.firstName);
            self.login(self.emailAddress());
            self.id(userData.id);
            self.approvalRequired(userData.derivedApprovalRequired);
            self.orderPurchaseLimit(userData.derivedOrderPriceLimit);
            self.locale("");
            if(userData.catalog) {
                self.catalogId(userData.catalog.repositoryId);
            }
            // Added this to be backward compatible.
            if(self.catalog) {
                self.catalog = undefined;
            }

            if(userData.currentOrganization){
                self.currentOrganization(userData.currentOrganization);
                if(self.parentOrganization == null){
                    self.parentOrganization = new ParentOrganisation();
                }
                ko.mapping.fromJS(userData.currentOrganization, {}, self.parentOrganization);
                self.parentOrganization.id(userData.currentOrganization.repositoryId);
                var localOrganizationId = JSON.parse(ccRestClient.getStoredValue(CCConstants.LOCAL_STORAGE_ORGANIZATION_ID));
                // if organization id is not present in localStorage, persist the current organization to local storage
                if (!localOrganizationId && userData.currentOrganization) {

                    ccRestClient.setStoredValue(CCConstants.LOCAL_STORAGE_ORGANIZATION_ID,
                        ko.toJSON(userData.currentOrganization.repositoryId));
                }
            }

            else if (userData.parentOrganization) {
                ko.mapping.fromJS(userData.parentOrganization, {}, self.parentOrganization);
                self.parentOrganization.id(userData.parentOrganization.repositoryId);
            }

            if(userData.roles) {
                var roleLength = userData.roles.length;
                self.roles([]);
                for(var role = 0; role < roleLength; role++) {
                    self.roles.push(userData.roles[role]);
                    if(userData.roles[role]["relativeTo"].repositoryId === self.currentOrganization().repositoryId){
                        if(userData.roles[role]["function"] === "admin"){
                            self.isDelegatedAdmin(true);
                        } else if(userData.roles[role]["function"] === "approver") {
                            self.isApprover(true);
                        }
                    }}
            }
            if(self.isB2BUser() && self.isDelegatedAdmin()) {
                self.organizations([]);
                //Currently hardcoded for first organization, as multiple organization is out of scope.
                ccRestClient.request(CCConstants.ENDPOINT_GET_ORGANIZATION, null,
                    //success callback
                    function(data){
                        self.defaultShippingAddressType(data.derivedShippingAddressType);
                        self.defaultBillingAddressType(data.derivedBillingAddressType);
                        self.organizations.push(new Organization(data, self.adapter));
                    },
                    //error callback
                    function(data) {
                        if (data.status == CCConstants.HTTP_UNAUTHORIZED_ERROR) {
                            self.handleSessionExpired();
                            if (navigation.isPathEqualTo(self.contextData.global.links.profile.route) || navigation.isPathEqualTo(self.contextData.global.links.orderHistory.route)) {
                                navigation.doLogin(navigation.getPath(), self.contextData.global.links.home.route);
                            }
                        }
                    },
                    self.parentOrganization.repositoryId());
            }
            self.selectedPriceListGroup(userData.priceListGroup);
            var activePriceListGroups = self.contextData.global.site.priceListGroup.activePriceListGroups;
            if (!self.isB2BUser() && self.selectedPriceListGroup()) {
                var isActive = false;

                if(ccRestClient.getStoredValue(CCConstants.LOCAL_STORAGE_PRICELISTGROUP_ID)) {
                    var storedPriceListGroupId = JSON.parse(ccRestClient.getStoredValue(CCConstants.LOCAL_STORAGE_PRICELISTGROUP_ID));
                    // Check whether the selected price list group is still active
                    for (var i =  0; i < activePriceListGroups.length; i++) {
                        if (storedPriceListGroupId && storedPriceListGroupId == activePriceListGroups[i].id) {
                            self.selectedPriceListGroup(activePriceListGroups[i]);
                            isActive = true;
                            break;
                        }
                    }
                }
                if (!isActive) { // If the selected price list group is not active then set default price list group
                    self.selectedPriceListGroup(self.contextData.global.site.priceListGroup.defaultPriceListGroup);
                }
            }

            ccRestClient.setStoredValue(CCConstants.LOCAL_STORAGE_PRICELISTGROUP_ID, ko.toJSON(self.selectedPriceListGroup().id));
            var recieveEmail = userData.receiveEmail;
            if (recieveEmail == "yes") {
                self.emailMarketingMails(true);
            } else {
                self.emailMarketingMails(false);
            }

            // Reset KO modified properties
            self.deleteShippingAddress(false);
            self.updatedShippingAddress = userData.shippingAddress; // This is the default shipping address the server sends back
            if (self.updatedShippingAddress) {
                self.updatedShippingAddress.isDefaultAddress = true;
            }

            self.updatedShippingAddressBook = userData.shippingAddresses;
            if (self.updatedShippingAddressBook.length) {
                if(self.updatedShippingAddress == null) {
                    //Setting the entry in address book to default address when null is being returned
                    self.updatedShippingAddressBook[0].isDefaultAddress = true;
                } else {
                    for (var k = 0, kMax = self.updatedShippingAddressBook.length; k < kMax; k++) {
                        self.updatedShippingAddressBook[k].isDefaultAddress =
                            (self.updatedShippingAddressBook[k].repositoryId === self.updatedShippingAddress.repositoryId);
                    }
                }
            }

            self.organizationAddressBook = [];
            for(var addressIndex in userData.secondaryAddresses){
                var shippingAddress = userData.secondaryAddresses[addressIndex];
                shippingAddress.isDefaultAddress=false;
                self.organizationAddressBook.push(userData.secondaryAddresses[addressIndex]);
            }

            self.contactShippingAddress = userData.contactShippingAddress;
            self.contactBillingAddress = userData.contactBillingAddress;

            self.sortShippingAddresses();

            self.isUserSessionExpired(false);
            self.isUserLoggedOut(false);
            self.populateUserFromLocalData(false);
            self.setLocalData('all');

            //Assigning profile locale after checking if it is part of supported locales.
            //Update the user locale if it not supported.
            for (var i=0; i<this.supportedLocales.length; i++) {
                if (userData.locale === this.supportedLocales[i].name) {
                    self.locale(userData.locale);
                    if (self.locale.isModified !== undefined) {
                        self.locale.isModified(false);
                    }
                }
            }
            if (!self.locale()) {
                self.updateLocaleToSupported();
            }

            self.processDynamicPropertiesMetadata(userData.dynamicProperties);
            self.resetDynamicPropertiesValueIsModified();
        };

        /**
         * Set the context data from the UserDataInitializer.
         *
         * @function
         * @name UserViewModel#setContext
         * @param {Object} pContext Context Data
         */
        UserViewModel.prototype.setContext = function(pContext) {
            var self = this;
            self.contextData = pContext;
            self.myAccountHash = self.contextData.global.links.profile.route;
            self.checkoutHash = self.contextData.global.links.checkout.route;
            self.homeHash = self.contextData.global.links.home.route;
            self.passwordPolicies(pContext.global.passwordPolicies);
            self.readyToDisplay(true);
            if(pContext.global.user.catalog) {
                self.catalogId(pContext.global.user.catalog.repositoryId);
            }
            // Added this to be backward compatible.
            if(self.catalog) {
                self.catalog = undefined;
            }

            // Set the supported locales in the user view model
            if (pContext.global.supportedLocales && pContext.global.supportedLocales.length > 0) {
                self.supportedLocales = pContext.global.supportedLocales;
            } else {
                self.supportedLocales = pContext.global.site.additionalLanguages;
            }

            if (pContext.global.user.firstName) {
                self.populateUserViewModel(pContext.global.user);
            } else {
                self.populateUserFromLocalData(true);
                if (!self.isUserLoggedOut() && !self.loggedIn() && !self.isUserSessionExpired() && self.login() != undefined && self.login() !='') {
                    self.handleSessionExpired();
                }
            }
        };

        /**
         * Refreshes the data in the user view modal with the current user when the page changes. Invoked on
         * receiving a PAGE_LAYOUT_LOADED, or PAGE_METADATA_CHANGED pubsub event.
         *
         * @private
         * @function
         * @name UserViewModel#handPageChanged
         */
        UserViewModel.prototype.handlePageChanged = function() {
            var self = this;
            if (!self.isPageRedirected() && self.loggedIn() && !self.loggedinAtCheckout()) {
                $.Topic(pubSub.topicNames.REFRESH_USER_CART).publish(self);
            }
            self.isPageRedirected(false);
        };

        /**
         * Handle session expiry- reset all data and reload login data from local storage. Invoked on
         * receiving a USER_SESSION_EXPIRED pubsub event.
         *
         * @private
         * @function
         * @name UserViewModel#handleSessionExpired
         */
        UserViewModel.prototype.handleSessionExpired = function() {
            var self = this;
            if (!self.isUserSessionExpired() && !self.isUserLoggedOut()) {
                self.loggedIn(false);
                if (!navigation.isPathEqualTo(self.myAccountHash) && self.isSesExpDuringPlaceOrder() == false) {
                    self.resetLoginData();
                    self.reset();
                    self.id(null);
                }
                if (!navigation.isPathEqualTo(self.checkoutHash) && !(navigation.getPath().indexOf(self.checkoutHash) >= 0)) {
                    $.Topic(pubSub.topicNames.USER_CLEAR_CART).publish(self);
                }
                self.populateUserFromLocalData(true);
                self.orderId('');
                self.loggedinAtCheckout(false);
                self.loggedoutAtCheckout(false);
                self.isUserSessionExpired(true);
                self.isUserLoggedOut(false);
                self.setLocalData('sessionExpiry');
                self.client().clearRefreshInterval();
                self.readyToDisplay(true);
            }
        };

        /**
         * Handle session validation. Invoked on receiving a USER_SESSION_VALID pubsub event.
         *
         * @private
         * @function
         * @name UserViewModel#handleSessionValid
         */
        UserViewModel.prototype.handleSessionValid = function() {
            var self = this;
            self.loggedIn(self.client().loggedIn);
            self.isUserSessionExpired(false);
            self.isUserLoggedOut(false);
            self.setLocalData('sessionExpiry');
            self.readyToDisplay(true);
        };

        /**
         * Check if user is allowed to navigate to privileged pages and redirect if not. Will do nothing
         * if user profile has unsaved changes.
         *
         * @function
         * @name UserViewModel#validatePrivilagePageRequest
         * @param {Object} data The object bound to the event.
         * @param {Object} event The current event.
         * @returns {boolean} true if the user profile has unsaved changes, otherwise false
         */
        UserViewModel.prototype.validatePrivilagePageRequest = function(data, event) {
            var self = this;
            // returns if the profile has unsaved changes.
            if (self.isUserProfileEdited()) {
                return true;
            }
            var hash = event.currentTarget.pathname;
            var link = '';
            var index = hash.indexOf("#!");
            if (index >= 0) {
                hash = hash.substring(index + 2);
            }
            self.validateAndRedirectPage(hash);
            return false;
        };

        /**
         * Navigates to the page based on the given hash.If given hash and current path is same
         * then it refreshes the current layout with current page id else navigates to the page
         * based on the given hash.
         *
         * @function
         * @name UserViewModel#navigateToPage
         * @param {string} hash page to refresh or redirect to.
         */
        UserViewModel.prototype.navigateToPage = function(hash, callback) {
            if(navigation.isPathEqualTo(hash)) {
                var eventData = {
                    'pageId': navigation.getPath()
                };
                $.Topic(pubSub.topicNames.PAGE_VIEW_CHANGED).publish(eventData);
            } else {
                navigation.goTo(hash);

                if (callback) {
                    callback();
                }
            }
        };

        /**
         * Check user privilege and redirect based on hash.
         *
         * @private
         * @function
         * @name UserViewModel#validateAndRedirectPage
         * @param {string} hash Redirection hash code.
         * @returns {boolean} Always false.
         */
        UserViewModel.prototype.validateAndRedirectPage = function(hash) {
            var redirectLinkDetails, self = this;
            if (!(hash == CCConstants.PAYPAL_CHECKOUT_TYPE)) {
                redirectLinkDetails = [{message: "success", linkToRedirect: hash}];
            }
            if (!self.loggedIn() && self.isUserSessionExpired()) {
                if (hash == CCConstants.PAYPAL_CHECKOUT_TYPE && navigation.isPathEqualTo(self.checkoutHash)) {
                    $.Topic(pubSub.topicNames.CONTINUE_TO_PAYPAL).publish();
                } else {
                    navigation.doLogin(hash);
                }
            } else if (self.loggedIn()) {
                var successFunc = function() {
                    self.handleSessionValid();
                    if (self.pageToRedirect() && self.pageToRedirect()!= '' && self.pageToRedirect() == hash) {
                        self.pageToRedirect(null);
                    }
                    if (hash == CCConstants.PAYPAL_CHECKOUT_TYPE) {
                        $.Topic(pubSub.topicNames.CONTINUE_TO_PAYPAL).publish();
                    } else {
                        navigation.goTo(hash);
                    }
                };
                var errorFunc = function(pResult) {
                    if (pResult) {
                        self.handleSessionExpired();
                        navigation.doLogin(hash);
                    }
                };
                self.client().refresh(successFunc, errorFunc);
            } else {
                navigation.goTo(hash);
            }
            return false;
        };

        /**
         * Update the user profile details. Invoked on receiving a USER_PROFILE_UPDATE_SUBMIT pubsub event.
         *
         * @function
         * @name UserViewModel#updateUserProfile
         */
        UserViewModel.prototype.handleUpdateProfile = function() {
            var self = this;

            var isDataInValid = false;
            var isDataModified = false;
            var includeShippingAddress = false;
            var includeUserProfile = false;
            var includeUserPassword = false;
            var includeDynamicProperties = false;

            // If we're updating because of a change to a shipping address...
            if(self.editShippingAddress() != null)
            {
                // Check if it's a new shipping address and add it to the address book.
                if ($.inArray(self.editShippingAddress(), self.shippingAddressBook()) < 0) {
                    self.shippingAddressBook.push(self.editShippingAddress());
                }

                // If this was the first shipping address added, make it automatically the default.
                if (self.shippingAddressBook().length === 1) {
                    self.shippingAddressBook()[0].isDefaultAddress(true);
                }

                if (self.editShippingAddress().isDefaultAddress()) {
                    self.selectDefaultAddress(self.editShippingAddress());
                }
            }

            // checking whether shipping address is modified/valid.
            if (self.isShippingAddressBookModified()) {
                for (var k = 0; k < self.shippingAddressBook().length; k++) {
                    if (!self.shippingAddressBook()[k].validateNow()) {
                        isDataInValid = true;
                        break;
                    }
                }
                includeShippingAddress = !isDataInValid; // Because addresses are validated first!
                isDataModified = true;
            }

            // checking whether user profile is modified/valid.
            if (self.isProfileModified()) {
                if (!self.isProfileValid()) {
                    isDataInValid = true;
                } else {
                    includeUserProfile = true;
                }
                isDataModified = true;
            }

            // checking whether user profile is modified/valid.
            if (self.isPasswordModified()) {
                if (!self.isPasswordValid()) {
                    isDataInValid = true;
                } else {
                    includeUserPassword = true;
                }
                isDataModified = true;
            }

            if (self.dynamicProperties().length > 0) {
                if (self.isDynamicPropertiesModified()) {
                    for ( var i = 0; i < self.dynamicProperties().length; i++) {
                        var dynProp = self.dynamicProperties()[i];
                        if (!dynProp.isValid()) {
                            isDataInValid = true;
                            break;
                        }
                    }
                    if (!isDataInValid) {
                        includeDynamicProperties = true;
                    }
                    isDataModified = true;
                }
            }
            if (!isDataModified) {
                // If data is not modified, show the view profile page.
                $.Topic(pubSub.topicNames.USER_PROFILE_UPDATE_NOCHANGE).publish();
                return;
            } else if (isDataInValid) {
                // If data is invalid, show error message.
                $.Topic(pubSub.topicNames.USER_PROFILE_UPDATE_INVALID).publish();
                return;
            }

            // Safe to get rid of our temp editing address

            self.receiveEmail = self.emailMarketingMails() ? "yes" : "no";

            var inputParams = {};

            inputParams[CCConstants.PROFILE_EMAIL] = self.emailAddress();
            inputParams[CCConstants.PROFILE_FIRST_NAME] = self.firstName();
            inputParams[CCConstants.PROFILE_LAST_NAME] = self.lastName();
            inputParams[CCConstants.PROFILE_RECEIVE_EMAIL] = self.receiveEmail;
            inputParams[CCConstants.PROFILE_LOCALE] = self.locale();

            if (includeShippingAddress) {
                inputParams[CCConstants.PROFILE_SHIPPING_ADDRESSES] = self.shippingAddressBook();
            }

            //update password changes
            if (includeUserPassword) {
                inputParams[CCConstants.PROFILE_OLD_PASSWORD] = self.oldPassword();
                inputParams[CCConstants.PROFILE_NEW_PASSWORD] = self.newPassword();
                inputParams[CCConstants.PROFILE_CONFIRM_PASSWORD] = self.confirmPassword();
            }

            if (includeDynamicProperties) {
                for (var i = 0; i < self.dynamicProperties().length; i++) {
                    if (self.dynamicProperties()[i].value.isModified && self.dynamicProperties()[i].value.isModified()) {
                        inputParams[self.dynamicProperties()[i].id()] = self.dynamicProperties()[i].value();
                    }
                }
                self.resetDynamicPropertiesValueIsModified();
            }

            self.adapter.loadJSON(CCConstants.ENDPOINT_UPDATE_PROFILE, self.id(), inputParams,
                //success callback
                function(data) {
                    self.editShippingAddress(null);
                    $.Topic(pubSub.topicNames.USER_PROFILE_UPDATE_SUCCESSFUL).publish(data);
                },
                //error callback
                function(data) {
                    $.Topic(pubSub.topicNames.USER_PROFILE_UPDATE_FAILURE).publish(data);
                }
            );

            //reset the password
            self.resetPassword();
        };

        /**
         * Change the Profile Password.
         *
         * @function
         * @name UserViewModel#updateExpiredPassword
         */
        UserViewModel.prototype.updateExpiredPassword = function() {
            var self = this;
            var inputParams = {};
            inputParams[CCConstants.PROFILE_LOGIN] = self.login();
            inputParams[CCConstants.PROFILE_OLD_PASSWORD] = self.oldPassword();
            inputParams[CCConstants.PROFILE_NEW_PASSWORD] = self.newPassword();
            inputParams[CCConstants.PROFILE_CONFIRM_PASSWORD] = self.confirmPassword();
            self.adapter.persistCreate(CCConstants.ENDPOINT_UPDATE_EXPIRED_PASSWORD, 'id', inputParams,
                //success callback
                function(data) {
                    $.Topic(pubSub.topicNames.USER_PROFILE_PASSWORD_UPDATE_SUCCESSFUL).publish(data);
                    var currentPassword = self.newPassword();
                    self.resetPassword();
                    self.password(currentPassword);
                },
                //error callback
                function(data) {
                    self.resetPassword();
                    $.Topic(pubSub.topicNames.USER_PROFILE_PASSWORD_UPDATE_FAILURE).publish(data);
                }
            );
        };

        /**
         * Return the singleton global instance of UserViewModel. Creates it if it doesn't already exist.
         *
         * @function
         * @name UserViewModel.getInstance
         * @param {RestAdapter} pAdapter REST Adapter.
         * @param {Object} pUserData Aditional user data.
         * @param {Object} pParams Some additional params (server data).
         * @returns {UserViewModel} The user view model.
         */
        UserViewModel.getInstance = function(pAdapter, pUserData, pParams) {
            if (!UserViewModel.singleInstance) {
                UserViewModel.singleInstance = new UserViewModel(pAdapter, pUserData);
            } else {
                if (!UserViewModel.singleInstance.loggedInUserName() && pParams.global.user.firstName) {
                    UserViewModel.singleInstance.loggedInUserName(pParams.global.user.firstName);
                }
            }

            // To always populate the view model with latest data from server.
            if (pParams) {
                UserViewModel.singleInstance.setContext(pParams);
            }

            return UserViewModel.singleInstance;
        };

        return UserViewModel;
    }

);

