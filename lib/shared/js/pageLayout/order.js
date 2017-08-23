/**
 * @fileoverview Defines an OrderViewModel used to represent and maintain an
 *               order.
 */
/* global $ */
/* global define */
define(
    // -------------------------------------------------------------------
    // PACKAGE NAME
    // -------------------------------------------------------------------
    'pageLayout/order',

    // -------------------------------------------------------------------
    // DEPENDENCIES
    // -------------------------------------------------------------------
    [
        'knockout',
        'pubsub',
        'notifier',
        'CCi18n',
        'ccLogger',
        'ccRestClient',
        'ccConstants',
        'jquery',
        'navigation',
        'spinner',
        'viewModels/address',
        'viewModels/paymentDetails',
        'viewModels/giftCardViewModel',
        'storageApi',
        'viewModels/dynamicProperty',
        'ccStoreServerLogger',
        'viewModels/cashViewModel',
        'pageViewTracker',
        'sfExceptionHandler',
        'ccStoreConfiguration'
    ],

    // -------------------------------------------------------------------
    // MODULE DEFINITION
    // -------------------------------------------------------------------
    function(
        ko,
        pubsub,
        notifier,
        CCi18n,
        log,
        ccRestClient,
        ccConstants,
        $,
        navigation,
        spinner,
        address,
        PaymentDetails,
        GiftCardViewModel,
        storageApi,
        DynamicProperty,
        StoreServerLogger,
        cashModel,
        pageViewTracker,
        ExceptionHandler,
        CCStoreConfiguration
    ) {

        "use strict";

        // ------------------------------------------------------------------
        // Class definition & member variables
        // ------------------------------------------------------------------

        var ORDER_VIEW_MODEL_ID = "OrderViewModel";

        /**
         * Creates an order view model.
         *
         * @public
         * @name OrderViewModel
         * @param {RestAdapter}
         *          pAdapter The rest adapter.
         * @param {CartViewModel}
         *          pCart The cart.
         * @param {Object}
         *          [pData] Additional data passed to the view model.
         *
         * @property {RestAdapter} adapter An adapter used to make the REST calls.
         * @property {CartViewModel} cart The shopping cart
         * @property {observable<string>} id The ID of the view model.
         * @property {observable<Address>} billingAddress The valid billing
         *           address.
         * @property {observable<Address>} shippingAddress The valid shipping
         *           address.
         * @property {observable<string>} emailAddress The order email address.
         * @property {observable<string>} orderProfileId The order profile ID.
         * @property {observable<OrderViewModel.PaypalPaymentDetails>} paymentGateway Payment details.
         * @property {observable<Object>} selectedShippingOption The selected
         *           shipping option.
         * @property {observable<boolean>} isPaypalVerified Has the paypal
         *           account been verified?
         * @property {observable<Object>} order The current order.
         * @property {observable<Object>} giftCards Array of the applied GiftCards.
         * @property {observable<boolean>} isInvoicePayment Whether using invoice payment as payment method.
         * @property {observable<Object>} poNumber Purchase order number for invoice payment.
         * @property {CCStoreConfiguration} storeConfiguration An instance of the cc-store-configuration containing store-configuration data.
         * @class Represents an order.
         */
        function OrderViewModel(pAdapter, pCart, pData, pUser) {

            if (OrderViewModel.prototype.singleInstance) {
                throw new Error(
                    "Cannot instantiate more than one OrderViewModel, use OrderViewModel.getInstance(pAdapter, pCart, pData)");
            }

            var self = this;

            self.adapter = pAdapter;
            self.cart = pCart;

            // Schedule order details
            self.schedule = ko.observable();
            self.showSchedule = ko.observable(false);

            self.id = ko.observable();
            self.billingAddress = ko.observable();
            self.shippingAddress = ko.observable();
            self.paymentDetails = ko.observable(PaymentDetails.getInstance());
            self.emailAddress = ko.observable();
            self.order = ko.observable();
            self.orderProfileId = ko.observable();
            self.paymentGateway = ko.observable();
            self.selectedShippingOption = ko.observable();
            self.isPaypalVerified = ko.observable(false);
            self.isPayULatamCheckout = ko.observable(false);
            self.op = ko.observable();
            self.giftCards = ko.observableArray([]);
            self.amountRemaining = ko.observable();
            self.amountRemaining(null);
            self.isCashPayment = ko.observable(false);
            self.cashModel = ko.observable(cashModel.getInstance());
            self.cashModel().isPayingByCash(self.isCashPayment());
            self.isInvoicePayment = ko.observable(false);
            self.isPayLater = ko.observable(false);
            self.poNumber = ko.observable();
            self.isOrderValid = ko.observable(false);

            self.enableOrderButton = ko.observable(true);
            self.isOrderLocked = false;
            self.isOrderEditable = ko.observable(true);
            self.isOrderSubmitted = false;
            self.checkoutGuest = ko.observable(ccConstants.GUEST);
            self.checkoutLogin = ko.observable(ccConstants.LOGIN);
            // Keeping the guest as the default check option
            self.checkoutOption =   ko.observable(ccConstants.GUEST).extend({ throttle: 400 });
            self.guestEmailAddress = ko.observable('');
            self.createAccount = ko.observable(false);

            self.user = pUser;
            self.registerUser = false;
            self.webCheckoutShippingMethodValue = null;
            self.storeServerLog = StoreServerLogger.getInstance();
            self.exceptionHandler = new ExceptionHandler();
            self.loadedOrderShippingAddress = null;

            // generic payments
            self.payments = ko.observableArray([]);
            self.approvalRequired = ko.observable(false);
            self.isAutherizeCalled = false;
            // validation callbacks
            self.validationCallbacks = [];

            self.fields = null;
            self.storeConfiguration = CCStoreConfiguration.getInstance();

            self.isCashPayment.subscribe(function(newValue) {
                self.cashModel().isPayingByCash(newValue);
            });

            self.guestEmailAddress.subscribe(function(newValue) {
                if (self.guestEmailAddress.isValid()) {
                    self.cart().emailAddressForGuestUser = self.guestEmailAddress();
                } else {
                    self.cart().emailAddressForGuestUser = "";
                }
            });

            /**
             * Update shipping address on a CHECKOUT_BILLING_ADDRESS event.
             * @private
             * @function OrderViewModel#updateBillingAddress
             */
            self.updateBillingAddress = function() {
                self.billingAddress(this);
            };

            /**
             * Prepare PayULatam Payment Data for Create Order.
             * @private
             * @function OrderViewModel#preparePayULatamDataForCreateOrder
             * @param {string} type PayPal Payment type.
             * @param {Object} paymentDetails PaymentDetails.
             */
            self.preparePayULatamDataForCreateOrder = function(type) {
                self.paymentGateway(
                    new PayULatamPaymentDetails(
                        type, self.cart().total(), self.cart().currency.currencyCode)
                );
            };

            /**
             * Update shipping address on a CHECKOUT_SHIPPING_ADDRESS event.
             * @private
             * @function OrderViewModel#updateShippingAddress
             */
            self.updateShippingAddress = function() {
                self.shippingAddress(this);
                // This is done as a workaround to avoid multiple pricing calls.
                // All  widgets and view-models will update the shipping address in the cart. Cart will decide if the pricing has to be called and will avoid widgets calling pricing directly.
                // Retaining the  shippingAdress of order for backward compatibilty. We should remove this from the order in the future.
                var shippingAddressWithProductIDs = {};
                shippingAddressWithProductIDs[ccConstants.SHIPPING_ADDRESS_FOR_METHODS] = self.shippingAddress();
                shippingAddressWithProductIDs[ccConstants.PRODUCT_IDS_FOR_SHIPPING] = pCart().getProductIdsForItemsInCart();

                pCart().updateShippingAddress.bind(shippingAddressWithProductIDs)();
            };

            /**
             * Update PayPal Payment Type.
             * @private
             * @function OrderViewModel#updatePaypalPaymentType
             * @param {string} type PayPal Payment type.
             */
            self.updatePaypalPaymentType = function(type) {
                var customProperties;
                if (self.paymentGateway() && self.paymentGateway().type === type &&
                    self.paymentGateway().customProperties) {
                    customProperties = self.paymentGateway().customProperties;
                }
                self.paymentGateway(new PaypalPaymentDetails(type));
                if (customProperties) {
                    self.paymentGateway().customProperties = customProperties;
                }
            };

            /**
             * Update shipping method on a CHECKOUT_SHIPPING_METHOD event.
             * @private
             * @function OrderViewModel#updateShippingMethod
             */
            self.updateShippingMethod = function() {
                if (this && this.repositoryId) {
                    var shippingItem = {};
                    shippingItem.value = this.repositoryId;
                    shippingItem.shippingOption = this;
                    self.selectedShippingOption(shippingItem);
                } else {
                    self.selectedShippingOption('');
                }
            };

            /**
             * Update the email address on a CHECKOUT_EMAIL_ADDRESS event.
             * @private
             * @function OrderViewModel#updateEmail
             */
            self.updateEmail = function() {
                self.emailAddress(this);
            };

            /**
             * Reset the billing and shipping addresses.
             * @private
             * @function OrderViewModel#resetAddress
             */
            self.resetAddress = function() {
                if (self.billingAddress()) {
                    self.billingAddress().reset();
                }
                if (self.shippingAddress()) {
                    self.shippingAddress().reset();
                }
            };

            /**
             * Update payment details on a CHECKOUT_PAYMENT_DETAILS event.
             * @private
             * @function OrderViewModel#updatePaymentDetails
             */
            self.updatePaymentDetails = function() {
                var details = this;

                if (self.paymentDetails && self.paymentDetails()) {
                    for (var prop in details) {
                        if (self.paymentDetails()[prop]) {
                            self.paymentDetails()[prop](details[prop]);
                        }
                    }
                }
                else {
                    self.paymentDetails(details);
                }
            };

            /**
             * Update Payment Gateway data on a page change.
             * @private
             * @function OrderViewModel#updatePaymentGatewayData
             * @param {Object} data Page change data.
             */
            self.updatePaymentGatewayData = function(data) {
                var parameterString = data.parameters;
                if (parameterString) {
                    var params = parameterString.split('&');
                    var result = {};
                    for (var i = 0; i < params.length; i++) {
                        var entries = params[i].split('=');
                        result[entries[0]] = entries[1];
                    }
                    if (result[ccConstants.PAYMENT_ID] && result[ccConstants.TOKEN] && result[ccConstants.PAYER_ID]) {
                        self.paymentGateway(new PaypalPaymentDetails(
                            ccConstants.PAYPAL_CHECKOUT_TYPE,
                            result[ccConstants.PAYMENT_ID], result[ccConstants.TOKEN],
                            result[ccConstants.PAYER_ID]));
                        self.isPaypalVerified(true);
                    } else if (parameterString.indexOf(ccConstants.PAYU_REFERENCE_POL) != -1) {
                        self.createSpinner();
                        var txstatus_payu = result[ccConstants.PAYU_TRANSACTION_STATE];
                        if (txstatus_payu == ccConstants.PAYU_TRANSACTION_APPROVED_CODE ||
                            txstatus_payu == ccConstants.PAYU_TRANSACTION_PENDING_CODE ||
                            txstatus_payu == ccConstants.PAYU_TRANSACTION_DECLINED_CODE ||
                            txstatus_payu == ccConstants.PAYU_TRANSACTION_EXPIRED_CODE ||
                            txstatus_payu == ccConstants.PAYU_TRANSACTION_ERROR_CODE) {
                            var referenceCode = result[ccConstants.PAYU_REFERENCE_CODE];
                            var tx_value = result[ccConstants.PAYU_TX_VALUE];
                            var currency = result[ccConstants.CURRENCY];
                            var signature = result[ccConstants.SIGNATURE];
                            self.paymentGateway(new PayULatamPaymentDetails(
                                ccConstants.PAYULATAM_CHECKOUT_TYPE, tx_value, currency, referenceCode,
                                txstatus_payu, ccConstants.PAYULATAM_RESPONSE_TYPE, signature));
                            self.getOrder();
                        }
                    } else {
                        self.clearPaypalData();
                    }
                } // When user navigates away from paypal checkout page.
                else if (self.isPaypalVerified() && !(navigation.getPathWithoutLocale() == self.checkoutLink)) {
                    self.clearPaypalData();
                }
            };

            /**
             * Loads an order to the checkout page with proper shipping address and
             * shipping groups
             *
             * @function
             * @name OrderViewModel#loadOrderForSubmit
             * @param {Object} data the page data
             */
            self.loadOrderForSubmit = function(data) {
                var self = this;
                if ((data.pageId == ccConstants.PAGE_TYPE_CHECKOUT)  && (self.user()) &&
                    (self.user().loggedIn() && (!self.user().isUserSessionExpired())) &&
                    (self.cart().currentOrderId())) {
                    // Get the order
                    var data = {};
                    var contextObj = {};
                    contextObj[ccConstants.ENDPOINT_KEY] = ccConstants.ENDPOINT_GET_ORDER;
                    contextObj[ccConstants.IDENTIFIER_KEY] = "orderForSubmit";
                    var filterKey = self.storeConfiguration.getFilterToUse(contextObj);
                    if (filterKey) {
                        data[ccConstants.FILTER_KEY] = filterKey;
                    }
                    ccRestClient.request(ccConstants.ENDPOINT_GET_ORDER, data,
                        function(order) {
                            // For now we will only allow orders in incomplete or quoted state.
                            var state = order.state;
                            if (state == ccConstants.QUOTED_STATES || state == ccConstants.INCOMPLETE) {
                                // Load the order and stop using the cart items
                                self.cart().loadOrderForProfile(order, self.user);
                                // Now load the shipping address
                                $.Topic(pubsub.topicNames.LOADED_ORDER_SHIPPING_ADDRESS)
                                    .publish(order.shippingAddress);
                                // Now fix the shipping method
                                self.cart().shippingMethod(order.shippingMethod.value);
                                // Add the user order details
                                self.user().orderId(self.cart().currentOrderId());
                                self.user().setLocalData('orderId');
                            }
                            else if(state==ccConstants.PENDING_PAYMENTS || state==ccConstants.PENDING_PAYMENT_TEMPLATE)
                            {
                                self.isOrderEditable(false);
                                // Load the order and stop using the cart items
                                self.cart().loadOrderForProfile(order, self.user);
                                // Now load the shipping address
                                var translateHelper =  {
                                    translate: function(key, options) {
                                        return CCi18n.t('ns.common:resources.' + key, options);
                                    }
                                };
                                var shippingAddress = new address('cart-shipping-address', '', translateHelper, self.contextData.page.shippingCountriesPriceListGroup, self.contextData.page.defaultShippingCountry);
                                shippingAddress.copyFrom(order.shippingGroups[0].shippingAddress, self.contextData.page.shippingCountriesPriceListGroup);
                                shippingAddress.resetModified();
                                //Load shipping Address in Cart
                                $.Topic(pubsub.topicNames.CHECKOUT_SHIPPING_ADDRESS)
                                    .publishWith(shippingAddress,[{message:"success"}]);

                                // Now fix the shipping method
                                var shippingAddressWithProductIDs = {};
                                shippingAddressWithProductIDs[ccConstants.SHIPPING_ADDRESS_FOR_METHODS] = self.shippingAddress();
                                shippingAddressWithProductIDs[ccConstants.PRODUCT_IDS_FOR_SHIPPING] = pCart().getProductIdsForItemsInCart();

                                $.Topic(pubsub.topicNames.VERIFY_SHIPPING_METHODS).publishWith(shippingAddressWithProductIDs, [{
                                    message: "success"
                                }]);

                                self.cart().shippingMethod(order.shippingMethod.value);
                                $.Topic(pubsub.topicNames.LOADED_ORDER_SHIPPING_ADDRESS).publish(order.shippingAddress);
                                self.loadedOrderShippingAddress = order.shippingAddress;
                                self.amountRemaining(order.priceInfo.total);
                                $.Topic(pubsub.topicNames.CART_UPDATED_PENDING_PAYMENT).publish(self);
                                if(order.scheduledOrder && order.scheduledOrder.length>0){
                                    self.showSchedule(true);
                                    if(self.schedule()){
                                        self.schedule().fromJS(order.scheduledOrder[0]);
                                    }
                                }
                                // Add the user order details
                                self.user().orderId(self.cart().currentOrderId());
                                self.user().setLocalData('orderId');
                                if(!self.isAutherizeCalled){
                                    notifier.sendWarning(ORDER_VIEW_MODEL_ID, CCi18n.t('ns.common:resources.orderCannotBeUpdatePendingPaymentText'), true);
                                }
                                if (!self.emailAddress() && self.user().emailAddress()) {
                                    self.emailAddress(self.user().emailAddress());
                                }
                            }
                            else {
                                // If not go 404
                                navigation.goTo(self.contextData.global.links['404'].route);
                            }
                        },
                        function(data) {
                            // If not go 404
                            navigation.goTo(self.contextData.global.links['404'].route);
                        },
                        self.cart().currentOrderId());
                }
                self.isOrderEditable(true);
            };

            /**
             * Update all payments for the order.
             * Removes any existing.
             * @function OrderViewModel#updatePayments
             * @param {String} pPayments the new payments array
             */
            self.updatePayments = function(pPayments) {
                self.payments([]);
                var length = pPayments.length;
                for (var i = 0; i < length; i++) {
                    self.payments().push(pPayments[i]);
                }
            };

            /**
             * Add payment to the list for the order.
             * @function OrderViewModel#addPayment
             * @param {string} pPayment the new payment.
             */
            self.addPayment = function(pPayment) {
                self.payments.push(pPayment);
            };

            /**
             * Returns true if the current payments has the specified type.
             * @function OrderViewModel#addPayment
             * @param {string} pPaymentType.
             */
            self.hasPaymentType = function(pPaymentType) {
                var length = self.payments().length;
                for (var i = 0; i < length; i++) {
                    if (self.payments()[i].type === pPaymentType) {
                        return true;
                    }
                }
                return false;
            };

            /**
             * Determine if there are any validation errors with ShippingGroupRelationships in the cart, if there are the
             * relevant error messages are displayed to the user.
             * <b>NB</b> this validation is only relevant is split shipping is is selected.
             *
             * @private
             * @function OrderViewModel#validateShippingGroupRelationships
             * @param {string} pPaymentType.
             */
            self.validateShippingGroupRelationships = function () {
                // clear any previous errors
                notifier.clearError("checkoutAddressBook-ShippingGroupRelationships");

                // If the split shipping user selections in the cart are invalid, flag an error.
                if (!this.cart().hasSplitShippingInformation()) {
                    this.errorFlag = true;
                    notifier.sendError("checkoutAddressBook-ShippingGroupRelationships", CCi18n.t('ns.checkoutaddressbook:resources.checkoutErrorMsg'), true);
                }
            };

            self.validateShippingAddress = function () {
                // clear any previous errors
                notifier.clearError("checkoutAddressBook-Shipping");

                if (self.shippingAddress) {
                    if (!self.shippingAddress().validateNow()) {
                        //error in shippingAddress
                        this.errorFlag = true;
                        notifier.sendError("checkoutAddressBook-Shipping", CCi18n.t('ns.common:resources.checkoutErrorMsg'), true);
                    } else {
                        this.shippingAddress().afterValidation = true;
                    }
                }
            };

            self.validateSchedule = function () {
                // clear any previous errors
                notifier.clearError("checkoutScheduledOrder-Schedule");

                if (self.showSchedule() && self.schedule) {
                    if (!self.schedule().validateNow()) {
                        //error in schedule
                        this.errorFlag = true;
                        notifier.sendError("checkoutScheduledOrder-Schedule", CCi18n.t('ns.common:resources.checkoutErrorMsg'), true);
                    } else {
                        this.schedule().afterValidation = true;
                    }
                }
            };

            self.validateBillingAddress = function () {
                // clear any previous errors
                notifier.clearError("checkoutAddressBook-Billing");

                if (! self.billingAddress().phoneNumber.isValid()){
                    self.billingAddress().phoneNumber(self.shippingAddress().phoneNumber());
                }

                if (self.billingAddress) {
                    if (!self.isPaypalVerified() && self.billingAddress()) {
                        if (!self.billingAddress().validateNow()) {
                            this.errorFlag = true;
                            notifier.sendError("checkoutAddressBook-Billing", CCi18n.t('ns.common:resources.checkoutErrorMsg'), true);
                        }
                    }
                }

            };

            self.validateCheckoutCartSummary = function () {
                // clear any previous errors
                notifier.clearError("checkoutCartSummary");

                if (self.cart().items().length === 0) {
                    //error in cart summary
                    this.errorFlag = true;
                    notifier.sendError("checkoutCartSummary", CCi18n.t('ns.checkoutcartsummary:resources.checkoutErrorMsg'), true);
                }
            };

            self.validateCheckoutOrderSummary = function () {
                if (this.selectedShippingOption && !this.selectedShippingOption()) {
                    this.errorFlag = true;
                    notifier.sendError("checkoutOrderSummary", CCi18n.t('ns.ordersummary:resources.checkoutErrorMsg'), true);
                } else {
                    // clear any previous error messages.
                    notifier.clearError('checkoutOrderSummary-shippingMethods');
                }
            };

            self.validateCheckoutPaymentDetails = function () {
                // clear any previous errors
                notifier.clearError("checkoutPaymentDetails");

                if (this.paymentDetails && this.payments() < 1) {
                    if (!this.isPaypalVerified() && !this.cashModel().isPayingByCash() && !this.isPayULatamCheckout() && !this.isInvoicePayment() &&
                        !(this.showSchedule() && !this.paymentDetails().isCardEnabledForScheduledOrder())) {
                        if ((this.amountRemaining() == null || this.amountRemaining() > 0) &&!this.paymentDetails().validatePaymentDetails()) {
                            this.errorFlag = true;
                            notifier.sendError("checkoutPaymentDetails", CCi18n.t('ns.checkoutpaymentdetails:resources.paymentDetailsError'), true);
                        }
                    }
                }
            };

            self.validateGiftcards = function () {
                // clear any previous errors
                notifier.clearError("checkoutGiftCards");

                if (this.giftCards && this.giftCards().length > 0) {
                    if(!this.cart().validateGiftCards()) {
                        $.Topic(pubsub.topicNames.SHOW_GIFT_CARD_ERROR_PANEL).publish();
                        this.errorFlag = true;
                        notifier.sendError("checkoutGiftCards", CCi18n.t('ns.checkoutpaymentdetails:resources.paymentDetailsError'), true);
                    }
                }
            };

            self.validatePaymentMethodsForScheduledOrder = function () {
                // clear any previous errors
                notifier.clearError("checkoutPaymentMethodsForScheduledOrder");
                if (this.showSchedule()) {
                    if (!(this.cashModel().isPayingByCash() || (this.paymentDetails &&
                            this.paymentDetails().isCardEnabledForScheduledOrder())  || (this.giftCards && this.giftCards().length > 0)
                            || this.isInvoicePayment() || this.isPayULatamCheckout() || this.isPaypalVerified())) {
                        this.errorFlag =true;
                        notifier.sendError("checkoutPaymentMethodsForScheduledOrder", CCi18n.t('ns.checkoutpaymentdetails:resources.paymentDetailsError'), true);
                    }
                }
            };

            self.validateRegisteredUser = function () {
                this.user().validateLogin();
                if (!this.user().isLoginValid()) {
                    this.errorFlag = true;
                    notifier.sendError("checkoutRegistration", CCi18n.t('ns.checkoutRegistration:resources.checkoutErrorMsg'), true);
                } else {
                    $.Topic(pubsub.topicNames.CHECKOUT_EMAIL_ADDRESS).publishWith(
                        this.user().emailAddress(),[{message:"success"}]);
                    $.Topic(pubsub.topicNames.USER_PROFILE_UPDATE_SUBMIT).publishWith(
                        this.user(), [{message: "success"}]);
                }
            };

            self.validateGuestUser = function () {
                if (!this.guestEmailAddress.isValid() && this.createAccount() === false) {
                    this.guestEmailAddress.isModified(true);
                    this.errorFlag = true;
                    notifier.sendError("checkoutRegistration", CCi18n.t('ns.checkoutRegistration:resources.checkoutErrorMsg'), true);
                } else if (!this.user().isValid() && this.createAccount() === true) {
                    this.user().validateUser();
                    this.errorFlag = true;
                    notifier.sendError("checkoutRegistration", CCi18n.t('ns.checkoutRegistration:resources.checkoutErrorMsg'), true);
                } else {
                    var currentLocale = ccRestClient.getStoredValue(ccConstants.LOCAL_STORAGE_USER_CONTENT_LOCALE);
                    if (currentLocale != null) {
                        currentLocale = JSON.parse(currentLocale);
                        $.Topic(pubsub.topicNames.CHECKOUT_USER_LOCALE).publishWith(
                            (currentLocale[0].name), [{
                                message: "success"}]);
                    }
                    $.Topic(pubsub.topicNames.CHECKOUT_EMAIL_ADDRESS).publishWith(
                        this.guestEmailAddress(), [{message:"success"}]);
                }
            };

            self.validateCheckoutRegistration = function () {
                // clear any previous errors
                notifier.clearError("checkoutRegistration");

                if (!this.user().loggedIn()) {
                    if (this.checkoutOption() === this.checkoutLogin()) {
                        self.validateRegisteredUser();
                    } else {
                        self.validateGuestUser();
                    }
                }
            };

            self.isGiftCardDisabled = ko.computed(function(){
                if(self.approvalRequired()){
                    return true;
                }
                else if(self.cart().items().length == 0 || self.amountRemaining()  == 0 || self.isCashPayment() || self.isInvoicePayment() ||
                    (self.showSchedule() && !self.paymentDetails().isGiftCardEnabledForScheduledOrder()) ||
                    (self.approvalRequired() && !self.paymentDetails().isGiftCardEnabledForApproval())) {
                    return true;
                }else {
                    return false;
                }
            });

            self.validateDynamicProperties = function () {
                // clear any previous errors
                notifier.clearError("checkoutDynamicProperties");
                var isValid = true;

                // Dynamic properties are held in the cart view model
                if (!this.cart().validateDynamicProperties()) {
                    this.errorFlag = true;
                    notifier.sendError("checkoutDynamicProperties", CCi18n.t('ns.common:resources.checkoutErrorMsg'), true);
                }
            };

            self.validatePlaceHolderItems = function() {
                // clear any previous errors
                notifier.clearError("placeHolderItems");
                if (this.cart().placeHolderItems().length) {
                    this.errorFlag = true;
                    this.placeHolderItemsMsgDisplayed = true;
                    notifier.sendWarning("placeHolderItems", CCi18n.t('ns.common:resources.placeHolderItemsErrorMsg'), true);
                    // If any change happens in place holder items array, reset the flag so the validation can happen again.
                    this.cart().placeHolderItems.subscribe(function() {
                        if (this.cart().placeHolderItems().length) {
                            this.placeHolderItemsMsgDisplayed = false;
                        }
                    }, this);
                }
            };

            self.reset = function() {
                this.user().reset();
                this.createAccount(false);
                if (this.guestEmailAddress.isModified) {
                    this.guestEmailAddress.isModified(false);
                }
                this.guestEmailAddress('');
                self.cart().emailAddressForGuestUser = '';
            };


            self.checkSingleException = function(data){
                if (data.errorCode == ccConstants.CHECKOUT_SESSION_EXPIRED_ERROR) {
                    notifier.sendError(ccConstants.CHECKOUT_SESSION_EXPIRED,
                        data.message, true);
                    return true;
                } else if (data.errorCode == ccConstants.CREATE_ORDER_PRODUCT_NOT_FOUND
                    || data.errorCode == ccConstants.CREATE_ORDER_SKU_NOT_FOUND
                    || data.errorCode == ccConstants.PRODUCT_NOT_FOR_INDIVIDUAL_SALE) {
                    // reload the cart, so that cart is validated and updated
                    // accordingly
                    self.cart().loadCart();
                    return true;
                } else if (data.errorCode == ccConstants.ORDER_CANNOT_BE_UPDATED) {
                    self.id('');
                    var orderError = CCi18n.t('ns.common:resources.orderSubmissionFailed');
                    notifier.sendError(ORDER_VIEW_MODEL_ID, orderError, true);
                    return true;
                } else if (data.errorCode == ccConstants.COUPON_APPLY_ERROR) {
                    // Handle coupon related error
                    self.cart().handleCouponPricingError(data, null);
                } else if (data.errorCode == ccConstants.PROCESS_COMPLETION_FAILED_CODE) {
                    var orderError = CCi18n.t('ns.common:resources.processCompletionFailed');
                    data.message = orderError;
                    notifier.sendError(ORDER_VIEW_MODEL_ID, orderError, true);
                } else if (data.errorCode == ccConstants.CONFIGURABLE_PRODUCTS_NOT_ALLOWED_FAILURE_CODE) {
                    var orderError = CCi18n.t('ns.common:resources.orderPricingPromotionError');
                    data.message = orderError;
                    notifier.sendError(ORDER_VIEW_MODEL_ID, orderError, true);
                } else if(data.errorCode == ccConstants.PAYMENT_REVERSAL_FAILED_CODE) {
                    self.id('');
                    var orderError = CCi18n.t('ns.common:resources.paymentReversalFailed');
                    data.message = orderError;
                    notifier.sendError(ORDER_VIEW_MODEL_ID, orderError, true);
                } else if (data.errorCode == ccConstants.INVALID_PROFILE_FOR_CHECKOUT) {
                    var invalidProfileForCheckoutErrorMessage = CCi18n.t('ns.common:resources.invalidProfileForCheckout');
                    data.message = invalidProfileForCheckoutErrorMessage;
                    notifier.sendError(ORDER_VIEW_MODEL_ID, invalidProfileForCheckoutErrorMessage, true);
                } else if ( !(data.status == ccConstants.HTTP_UNAUTHORIZED_ERROR) ){
                    // We are stopping paypal error messages from being displayed here as
                    // they are handled in handleRedirect method after store url changes.
                    if (!self.isPaypalVerified()) {
                        notifier.sendError(ORDER_VIEW_MODEL_ID, data.message, true);
                        return true;
                    }
                } else {
                    var orderError = CCi18n.t('ns.common:resources.orderSubmissionFailed');
                    notifier.sendError(ORDER_VIEW_MODEL_ID, orderError, true);
                    return false;
                }
            }

            // Subscribe
            $.Topic(pubsub.topicNames.ORDER_CREATE).subscribe(
                this.createOrder.bind(this));
            $.Topic(pubsub.topicNames.CHECKOUT_EMAIL_ADDRESS).subscribe(
                self.updateEmail);
            $.Topic(pubsub.topicNames.CHECKOUT_BILLING_ADDRESS).subscribe(
                self.updateBillingAddress);
            $.Topic(pubsub.topicNames.CHECKOUT_SHIPPING_ADDRESS).subscribe(
                self.updateShippingAddress);
            $.Topic(pubsub.topicNames.USER_PROFILE_ADDRESSES_REMOVED).subscribe(
                self.resetAddress);
            $.Topic(pubsub.topicNames.CHECKOUT_PAYMENT_DETAILS).subscribe(
                self.updatePaymentDetails);
            $.Topic(pubsub.topicNames.ORDER_CREATED).subscribe(
                this.authPayment.bind(this));
            $.Topic(pubsub.topicNames.PAYMENT_AUTH_SUCCESS).subscribe(
                this.paymentAuthorized.bind(this));
            $.Topic(pubsub.topicNames.PAYMENT_AUTH_DECLINED).subscribe(
                this.paymentDeclined);
            $.Topic(pubsub.topicNames.PAYMENT_AUTH_TIMED_OUT).subscribe(
                this.paymentTimeout);
            $.Topic(pubsub.topicNames.CHECKOUT_SHIPPING_METHOD).subscribe(
                self.updateShippingMethod);
            $.Topic(pubsub.topicNames.ORDER_COMPLETED).subscribe(
                this.clear.bind(this));
            $.Topic(pubsub.topicNames.ORDER_SUBMISSION_FAIL).subscribe(
                self.handleRedirect.bind(self));
            $.Topic(pubsub.topicNames.ORDER_SUBMISSION_SUCCESS).subscribe(
                self.handleSubmissionSuccess.bind(self));
            $.Topic(pubsub.topicNames.SCHEDULED_ORDER_SUBMISSION_SUCCESS).subscribe(self.handleScheduledOrderSubmissionSuccess.bind(self));
            // Handle the page change event data to store payerId, token and
            // paymentID
            $.Topic(pubsub.topicNames.PAGE_CHANGED).subscribe(
                self.updatePaymentGatewayData.bind(self));
            // Handle loading of an order
            $.Topic(pubsub.topicNames.PAGE_READY).subscribe(
                self.loadOrderForSubmit.bind(self));
            $.Topic(pubsub.topicNames.CONTINUE_TO_PAYPAL).subscribe(
                this.createOrder.bind(this));
            $.Topic(pubsub.topicNames.USER_LOGOUT_SUCCESSFUL).subscribe(
                this.resetAddress.bind(this));
            $.Topic(pubsub.topicNames.GIFTCARD_UPDATE_FROM_CART).subscribe(this.updateGiftCards.bind(this));
            $.Topic(pubsub.topicNames.UPDATE_AMOUNT_REMAINING).subscribe(this.updateAmountRemaining.bind(this));
            $.Topic(pubsub.topicNames.UPDATE_AMOUNT_REMAINING_PENDING_PAYMENT).subscribe(this.updateAmountRemainingPendingPayment.bind(this));
            $.Topic(pubsub.topicNames.USER_CREATION_FAILURE).subscribe(this.createOrderAfterRegistration.bind(this));
            $.Topic(pubsub.topicNames.AUTO_LOGIN_AND_GET_USER_DATA_SUCCESSFUL).subscribe(this.createOrderAfterRegistration.bind(this));
            $.Topic(pubsub.topicNames.USER_AUTO_LOGIN_FAILURE).subscribe(this.createOrderAfterRegistration.bind(this));
            $.Topic(pubsub.topicNames.USER_PROFILE_UPDATE_SUCCESSFUL).subscribe(this.createOrderAfterProfileUpdate.bind(this));
            $.Topic(pubsub.topicNames.USER_PROFILE_UPDATE_NOCHANGE).subscribe(this.createOrderAfterProfileUpdate.bind(this));
            $.Topic(pubsub.topicNames.USER_PROFILE_UPDATE_INVALID).subscribe(this.createOrderAfterProfileUpdate.bind(this));
            $.Topic(pubsub.topicNames.USER_PROFILE_UPDATE_FAILURE).subscribe(this.createOrderAfterProfileUpdate.bind(this));

            return (self);
        }

        /** Updates the gift cards array
         * with the applied gift cards
         */
        OrderViewModel.prototype.updateGiftCards = function(pGiftCards) {
            var self = this;
            self.giftCards([]);
            for ( var i = 0; i < pGiftCards.length; i++) {
                var giftCardPayment = pGiftCards[i];
                self.giftCards.push(giftCardPayment);
            }
        };

        /**
         * this method updates remaining amount on the order
         */
        OrderViewModel.prototype.updateAmountRemaining = function(
            pAmountRemaining) {
            var self = this;
            self.amountRemaining(pAmountRemaining);
        };
        OrderViewModel.prototype.updateAmountRemainingPendingPayment = function(
            pAmountRemaining) {
            var self = this;
            var tempAmount=self.amountRemaining()+pAmountRemaining;
            self.amountRemaining(tempAmount);
        };



        OrderViewModel.prototype.createOrderAfterRegistration = function(data) {
            if (this.registerUser && !(!this.contextData.global.guestCheckoutEnabled &&
                    data && data.errorCode === ccConstants.CREATE_PROFILE_USER_EXISTS)) {
                this.createOrder();
                this.registerUser = false;
            }
            else {
                this.destroySpinner();
                this.enableOrderButton(true);
                this.registerUser = false;
                if (data) {
                    notifier.sendError(ORDER_VIEW_MODEL_ID, data.message, true);
                }

                // Remove the registration failure from the stored values. This ensures that
                // it doesn't get incorrectly captured by the confirmation page once the user
                // places the order with a valid email address.
                if (ccRestClient.getStoredValue(ccConstants.PAYULATAM_CHECKOUT_REGISTRATION) ===
                    ccConstants.PAYULATAM_CHECKOUT_REGISTRATION_FAILURE) {

                    ccRestClient.clearStoredValue(ccConstants.PAYULATAM_CHECKOUT_REGISTRATION);
                }
            }
        };

        /**
         * this method creates a order after update profile call.
         */
        OrderViewModel.prototype.createOrderAfterProfileUpdate = function() {
            if (this.user && !this.user().isUserSessionExpired()) {
                if (this.placeOrder) {
                    if(this.cart().currentOrderState()== ccConstants.PENDING_PAYMENTS){
                        this.addPaymentsToOrder();
                    }
                    else {
                        this.createOrder();
                    }
                    this.enableOrderButton(true);
                    this.placeOrder = false;
                }
                this.destroySpinner();
            } else {
                this.destroySpinner();
            }
        };

        OrderViewModel.prototype.handleSubmissionSuccess = function(data) {
            var self = this;
            navigation.goTo(this.contextData.global.links.confirmation.route +'/'+ data[0].uuid);
            self.isOrderSubmitted = true;
            self.approvalRequired(false);
            self.enableOrderButton(true);
            if (self.isPaypalVerified()) {
                self.clearPaypalData();
            }
            if (!self.user().loggedIn()) {
                self.reset();
            }
        };

        /**
         * Callback for schedule order submit success
         * Redirects to schedule order details page
         */
        OrderViewModel.prototype.handleScheduledOrderSubmissionSuccess = function(data) {
            var self = this;
            navigation.goTo(this.contextData.global.links.scheduledOrders.route + "/" + data[0].scheduleOrderId);
            self.isOrderSubmitted = true;
            self.enableOrderButton(true);
            if (self.isPaypalVerified()) {
                self.clearPaypalData();
            }
            if (!self.user().loggedIn()) {
                self.reset();
            }
            this.destroySpinner();
        };

        /**
         * Redirects to the checkout page if the page is not checkout.
         * @private
         * @function OrderViewModel.handleRedirect
         * @param {OrderViewModel} data Order data.
         */
        OrderViewModel.prototype.handleRedirect = function(data) {
            var self = this;
            self.enableOrderButton(true);
            // As order creation can fail at cart page if checkout with paypal is
            // clicked
            if (navigation.getPathWithoutLocale() == self.cartLink && (self.isPaypalVerified() ||
                    self.cart().checkoutWithPaypalClicked())) {
                navigation.goTo(self.cartLink);
            } else if (navigation.getPathWithoutLocale() == self.checkoutLink && self.isPaypalVerified()) {
                navigation.goTo(self.checkoutLink);
            } else {
                var navPath=navigation.getPathWithoutLocale().split("?");
                if((navPath[0] == self.checkoutLink) && (navigation.getPathWithoutLocale().indexOf('orderId=')!= -1)){
                    navigation.goTo(navigation.getPathWithoutLocale());
                }else{
                    navigation.goTo(self.checkoutLink);
                }
            }
            if (data.data && (self.isPaypalVerified() || self.cart().checkoutWithPaypalClicked())) {
                notifier.sendErrorToPage(ccConstants.PAYPAL_PLACE_ORDER_ERROR,
                    data.data.message, true, 'checkout', true);
            }
            if (self.isPaypalVerified() || self.cart().checkoutWithPaypalClicked()) {
                self.clearPaypalData();
            }
        };

        /**
         * Perform appropriate validations when checkout with paypal is clicked.
         * @private
         * @function OrderViewModel.handleCheckoutWithPaypal
         */
        OrderViewModel.prototype.handleCheckoutWithPaypal = function() {
            var self = this;
            // Clearing 'Pay By Cash' option.
            self.cashModel().isPayingByCash(false);
            // Email address is mandatory if user enters shipping address on
            // checkout page
            if (self.shippingAddress() && self.shippingAddress().address1()
                && !self.emailAddress() && navigation.getPathWithoutLocale() == self.checkoutLink
                && !self.user().loggedIn()) {
                $.Topic(pubsub.topicNames.PAYPAL_EMAIL_VALIDATION).publishWith(self,
                    [ {
                        message : "fail"
                    } ]);
            } else {
                self.continueCheckoutWithPaypal();
            }
        };

        /**
         * Continue checkout with PayPal.
         * Called after initial validation on shipping address and email address.
         * @private
         * @function OrderViewModel.continueCheckoutWithPaypal
         */
        OrderViewModel.prototype.continueCheckoutWithPaypal = function() {
            var self = this;
            if (!self.cart().shippingMethod() && self.shippingAddress() && self.shippingAddress().validateForShippingMethod()) {
                storageApi.getInstance().setItem("checkoutAddressWithoutShippingMethod", JSON.stringify(self.shippingAddress().toJSON()));
            }
            if (self.guestEmailAddress() ){
                storageApi.getInstance().setItem("guestEmailAddress", self.guestEmailAddress());
            }
            self.updatePaypalPaymentType(ccConstants.PAYPAL_CHECKOUT_TYPE);
            // this flag tells us whether checkout with paypal was clicked
            self.cart().checkoutWithPaypalClicked(true);
            self.cart().skipPriceChange(true);
            self.cart().handleValidateCart();
            // To clear order id as initial call to create order should not have
            // order id
            self.id(null);
            self.op(ccConstants.ORDER_OP_INITIATE);
        };

        /**
         * Clear down order details.
         * @private
         * @function OrderViewModel.clear
         */
        OrderViewModel.prototype.clear = function() {
            var self = this;
            self.id(null);
            self.emailAddress('');
            self.order(null);
            self.orderProfileId(null);
            self.selectedShippingOption(null);
            self.op(null);
            self.giftCards([]);
            self.isInvoicePayment(false);
            self.isPayLater(false);
            self.poNumber('');
            self.enableOrderButton(true);
            self.createAccount(false);
            if (self.guestEmailAddress.isModified) {
                self.guestEmailAddress.isModified(false);
            }
            self.guestEmailAddress('');
            self.checkoutOption(ccConstants.GUEST);
            self.isOrderLocked = false;
            self.isOrderSubmitted = false;
            self.payments([]);
            self.amountRemaining(null);
            self.approvalRequired(false);
            self.isAutherizeCalled = false;
            self.loadedOrderShippingAddress = null;
            self.cart().currentOrderId(null);
            self.cart().currentOrderState(null);
        };

        /**
         * Clear down paypal payment details.
         * @private
         * @function OrderViewModel.clearPaypalData
         */
        OrderViewModel.prototype.clearPaypalData = function() {
            var self = this;
            self.paymentGateway(new PaypalPaymentDetails());
            self.cart().checkoutWithPaypalClicked(false);
            self.isPaypalVerified(false);
            self.id(null);
            self.op(null);
        };

        /**
         * Get order details of initial order created during checkout with paypal.
         * On success, publish the PAYPAL_CHECKOUT_SHIPPING_ADDRESS topic, with
         * the shipping address retrieved from the order.
         * @private
         * @function OrderViewModel.getOrder
         */
        OrderViewModel.prototype.getOrder = function() {
            var self = this;
            self.giftCards([]);
            self.cart().giftCards([]);
            self.cart().dynamicProperties([]);
            var paymentType = self.paymentGateway().type;
            var params = {};
            if (self.paymentGateway().type == ccConstants.PAYPAL_CHECKOUT_TYPE) {
                params[ccConstants.PAYER_ID] = self.paymentGateway().PayerID;
                params[ccConstants.TOKEN] = self.paymentGateway().token;
                params[ccConstants.PAYMENT_ID] = self.paymentGateway().paymentId;
            } else if (self.paymentGateway().type == ccConstants.PAYULATAM_CHECKOUT_TYPE) {
                params[ccConstants.AMOUNT] = self.paymentGateway().amount;
                params[ccConstants.CURRENCY] = self.paymentGateway().currency;
                params[ccConstants.PAYMENT_ID] = self.paymentGateway().paymentId;
                params[ccConstants.TRANSACTION_STATUS] = self.paymentGateway().transactionStatus;
                params[ccConstants.TRANSACTION_TYPE] = self.paymentGateway().transactionType;
                params[ccConstants.SIGNATURE] = self.paymentGateway().signature;
            } else if (self.payments().length > 0) {
                // take the first in the list for the payment type
                paymentType = self.payments()[0].type;
                if (self.payments()[0].customProperties) {
                    params.customProperties = self.payments()[0].customProperties;
                }
            }
            var contextObj = {};
            contextObj[ccConstants.ENDPOINT_KEY] = ccConstants.ENDPOINT_GET_INITIAL_ORDER;
            contextObj[ccConstants.IDENTIFIER_KEY] = "getOrder";
            var filterKey = self.storeConfiguration.getFilterToUse(contextObj);
            if (filterKey) {
                params[ccConstants.FILTER_KEY] = filterKey;
            }
            self.adapter.loadJSON(ccConstants.ENDPOINT_GET_INITIAL_ORDER,
                paymentType, params,
                // success callback
                function(data) {
                    //As the CartViewModel is reset on redirection, update the cart with server data.
                    var isUserLoggedIn = self.user() && self.user().loggedIn() ? true : false;
                    if (isUserLoggedIn) {
                        self.cart().emptyCart();
                        self.cart().mergeItems(data);
                        self.cart().updateCartData(data, false, isUserLoggedIn);
                        self.cart().cartUpdated();
                        if (data.state == ccConstants.PENDING_PAYMENT){
                            self.cart().currentOrderState(ccConstants.PENDING_PAYMENTS);
                            self.cart().currentOrderId(data.id);
                            self.cart().orderCurrency=data.priceListGroup.currency;
                            self.cart().orderItems(data.shoppingCart.items);
                            self.amountRemaining(data.priceInfo.total);
                            self.isAutherizeCalled=true;
                            self.isOrderEditable(false);
                        }
                    } else {
                        self.cart().loadCart();
                        var guestEmailAddress = storageApi.getInstance().getItem("guestEmailAddress");
                        if(guestEmailAddress){
                            self.guestEmailAddress(guestEmailAddress);
                            storageApi.getInstance().removeItem("guestEmailAddress");
                        }
                    }

                    if (self.isPaypalVerified()) {
                        self.id(data.id);
                        var paymentGroups = data.payments;
                        var paymentGpId = "";

                        for (var i=0 ; i<paymentGroups.length ; i++) {
                            if (paymentGroups[i] && paymentGroups[i].gatewayName == ccConstants.PAYPAL_GATEWAY_ID) {
                                paymentGpId = paymentGroups[i].paymentGroupId;
                                var paymentDetails = new PaypalPaymentDetails(ccConstants.PAYPAL_CHECKOUT_TYPE,
                                    self.paymentGateway().paymentId, self.paymentGateway().token, self.paymentGateway().PayerID, paymentGpId);
                                self.paymentGateway(paymentDetails);
                            }
                        }
                        var savedShippingAddressWithoutMethod = storageApi.getInstance().getItem("checkoutAddressWithoutShippingMethod");

                        $.Topic(pubsub.topicNames.PAYPAL_CHECKOUT_SHIPPING_ADDRESS)
                            .publish(data.shippingAddress);
                        $.Topic(pubsub.topicNames.EXTERNAL_CHECKOUT_BILLING_ADDRESS)
                            .publish(data.billingAddress);

                        // To set the shipping method selected by the user
                        if (data.shippingMethod && !savedShippingAddressWithoutMethod) {
                            $.Topic(pubsub.topicNames.PAYPAL_CHECKOUT_SHIPPING_METHOD_VALUE)
                                .publishWith(data.shippingMethod.value);
                        } else {
                            $.Topic(pubsub.topicNames.PAYPAL_CHECKOUT_NO_SHIPPING_METHOD)
                                .publish();
                        }

                        // Dynamic properties
                        if (data.dynamicProperties) {
                            self.cart().updateDynamicProperties(data);
                        }

                        if (paymentGroups.length == 1
                            && paymentGroups[0] && paymentGroups[0].gatewayName == ccConstants.PAYPAL_GATEWAY_ID
                            && paymentGroups[0].amount != data.priceInfo.total) {
                            var reappyGcs = CCi18n.t('ns.common:resources.reapplyGIftCards');
                            notifier.sendError("GC", reappyGcs, true);
                        }
                    } else if (self.paymentGateway().type == ccConstants.PAYULATAM_CHECKOUT_TYPE) {
                        if (data.payments[0].transactionStatusByQuery == ccConstants.PAYU_TRANSACTION_APPROVED ||
                            data.payments[0].transactionStatusByQuery == ccConstants.PAYU_TRANSACTION_PENDING ||
                            data.payments[0].paymentState == ccConstants.PAYMENT_GROUP_STATE_SETTLED) {
                            $.Topic(pubsub.topicNames.ORDER_SUBMISSION_SUCCESS).publish([{
                                message : "success",
                                id : data.id,
                                uuid : data.uuid
                            }]);
                        } else if (data.payments[0].transactionStatusByQuery == ccConstants.PAYU_TRANSACTION_DECLINED ||
                            data.payments[0].transactionStatusByQuery == ccConstants.PAYU_TRANSACTION_EXPIRED ||
                            data.payments[0].transactionStatusByQuery == ccConstants.PAYU_TRANSACTION_ERROR) {
                            $.Topic(pubsub.topicNames.WEB_CHECKOUT_SHIPPING_ADDRESS)
                                .publish(data.shippingAddress);
                            // To set the shipping method selected by the user
                            if (data.shippingMethod) {
                                self.webCheckoutShippingMethodValue = data.shippingMethod.value;
                            }
                            if (!self.user().loggedIn() && data.shippingAddress.email) {
                                self.guestEmailAddress(data.shippingAddress.email);
                            }
                            var payUNotifierMsg = "";
                            if (data.payments[0].transactionStatusByQuery == ccConstants.PAYU_TRANSACTION_DECLINED) {
                                payUNotifierMsg = CCi18n.t('ns.paymentGatewayOptions:resources.paymentDeclinedMsg');
                            } else if (data.payments[0].transactionStatusByQuery == ccConstants.PAYU_TRANSACTION_EXPIRED) {
                                payUNotifierMsg = CCi18n.t('ns.paymentGatewayOptions:resources.paymentExpiredMsg');
                            } else if (data.payments[0].transactionStatusByQuery == ccConstants.PAYU_TRANSACTION_ERROR) {
                                payUNotifierMsg = CCi18n.t('ns.paymentGatewayOptions:resources.paymentErrorMsg');
                            }
                            ccRestClient.clearStoredValue(ccConstants.PAYULATAM_CHECKOUT_REGISTRATION);
                            navigation.goTo(self.checkoutLink);
                            notifier.sendErrorToPage(ORDER_VIEW_MODEL_ID, payUNotifierMsg, true, 'checkout', true);
                            $("#CC-messages").attr("aria-live","assertive");
                        }
                        self.paymentGateway(null);
                        self.destroySpinner();
                    }
                    $.Topic(pubsub.topicNames.ORDER_RETRIEVED_INITIAL).publishWith(data, [{
                        message : "success",
                        order : data
                    }]);
                },
                // error callback
                function(data) {
                    self.destroySpinner();
                    self.clearPaypalData();
                    self.paymentGateway(null);
                    self.payments([]);
                    $.Topic(pubsub.topicNames.GET_INITIAL_ORDER_FAIL).publish([{message: "fail"}]);
                    notifier.sendError(ORDER_VIEW_MODEL_ID, data.message, true);
                });
        };

        /**
         * Update an order.
         * <p>
         * Build up a list of OrderItems, from the existing cart ({@link CartViewModel}). Create an
         * (internal) ShoppingCart object with these items, along with any coupons from the cart,
         * and finally create an Order object, from the cart and the payment details.
         * Send this Order object to the endpoint to submit the order.
         * @private
         * @function OrderViewModel.addPaymentsToOrder
         */
        OrderViewModel.prototype.addPaymentsToOrder = function() {
            var self = this;
            var billingAddress = undefined;
            if (self.billingAddress()) {
                billingAddress = self.billingAddress().toJSON();
            }

            var op = '';
            if (self.op() == ccConstants.ORDER_OP_INITIATE) {
                op = self.op();
            }
            else{
                var paymentGroup= storageApi.getInstance().getItem(ccConstants.PAYMENT_GROUP_AFTER_PAYPAL);
            }

            var payments = [];

            if (self.cashModel().isPayingByCash()) {
                var payment = {};
                payment.paymentMethodType = ccConstants.CASH_PAYMENT_TYPE;
                if(self.cashModel().customProperties && (Object.keys(self.cashModel().customProperties).length - 1) > 0) {
                    payment.customProperties = ko.mapping.toJS(self.cashModel().customProperties);
                }
                payment.billingAddress = billingAddress;
                payment.amount=self.amountRemaining();
                payments.push(payment);
                op = ccConstants.ORDER_OP_INITIATE;
            } else {
                //Gift Cards
                if (self.giftCards()) {
                    for ( var i = 0; i < self.giftCards().length; i++) {
                        var payment = {};
                        payment.paymentMethodType = ccConstants.GIFT_CARD_PAYMENT_TYPE;
                        payment.giftCardNumber = self.giftCards()[i].giftCardNumber();
                        payment.giftCardPin = self.giftCards()[i].giftCardPin();
                        if (!self.giftCards()[i].isAmountRemaining() || self.isPaypalVerified()) {
                            payment.amount = self.giftCards()[i].amountUsed();
                        }
                        payment.paymentGroupId = self.giftCards()[i].paymentGroupId;
                        if(self.giftCards()[i].customProperties && (Object.keys(self.giftCards()[i].customProperties).length - 1) > 0) {
                            payment.customProperties = ko.mapping.toJS(self.giftCards()[i].customProperties);
                        }
                        payment.amount=self.giftCards()[i].amountUsed();
                        payment.billingAddress = billingAddress;
                        payments.push(payment);
                    }
                }

                if (self.payments().length > 0) {
                    // Add any generic payments.
                    ko.utils.arrayForEach(self.payments(), function (payment) {
                        payment.billingAddress = billingAddress;
                        if(payment.type){
                            payment.paymentMethodType = payment.type;
                            delete payment.type;
                        }
                        payments.push(payment);
                    });
                }
                // These entries are for Paypal and credit card respectively. Update here
                // for other payment scenarios.
                else if (self.isPaypalVerified() || (self.amountRemaining && self.amountRemaining() != 0)) {
                    if (self.paymentGateway() && self.paymentGateway().type) {
                        var payment = {};
                        payment.paymentMethodType = self.paymentGateway().type;
                        payment.billingAddress = billingAddress;
                        if(op=='' && self.paymentGateway().type == ccConstants.PAYPAL_CHECKOUT_TYPE){
                            payment.PayerID = self.paymentGateway().PayerID;
                            payment.token = self.paymentGateway().token;
                            payment.paymentId = self.paymentGateway().paymentId;
                            payment.paymentGroupId = paymentGroup;
                        }
                        else if(self.paymentGateway().type == ccConstants.PAYULATAM_CHECKOUT_TYPE){
                            payment.currency = self.paymentGateway().currency;
                        }
                        payment.amount=self.amountRemaining();
                        payments.push(payment);
                        self.createSpinner();
                    } else if(self.isInvoicePayment()) {
                        var payment = {};
                        payment = {paymentMethodType:ccConstants.INVOICE_PAYMENT_TYPE, PONumber:self.poNumber()};
                        payment.billingAddress = billingAddress;
                        payment.amount=self.amountRemaining();
                        payments.push(payment);
                    } else if (self.paymentDetails && self.paymentDetails()) {
                        var payment = {};
                        payment = new CreditCardPaymentDetailsClientSide(self.paymentDetails());
                        if(self.paymentDetails().customProperties && (Object.keys(self.paymentDetails().customProperties).length - 1) > 0) {
                            payment.customProperties = ko.mapping.toJS(self.paymentDetails().customProperties);
                        }

                        payment.paymentMethodType = ccConstants.CARD_PAYMENT_TYPE;

                        payment.billingAddress = billingAddress;
                        payment.amount=self.amountRemaining();
                        payments.push(payment);
                    }
                }

            }

            // check if OrderViewModel has order id and the user is logged-in to
            // reuse the order to update and submit with changes.
            if (self.user() && self.user().orderId()
                && self.user().loggedIn()
                && !self.hasPaymentType(ccConstants.GENERIC_PAYMENT_TYPE)) {

                var url = "addPayments";
                var inputData = {};
                inputData["orderId"] = self.user().orderId();
                if(op != ""){
                    inputData["op"] = op;
                }
                inputData["profileId"] = self.user().id();
                inputData["payments"] = payments;

                // Update the order
                ccRestClient.request(url, inputData,
                    // success callback
                    function(data) {
                        self.postPaymentOrderUpdateSuccess(data);
                    },
                    // error callback
                    function(data) {
                        var param = new Object();

                        param.orderId = self.id();
                        param.errorCode = data.errorCode;

                        self.storeServerLog.logError("updateOrderFailure",self.storeServerLog.getMessage("updateOrderFailure", param));
                        self.postOrderCreateOrUpdateFailure(data);
                    });
            }

        };

        /**
         * Create an order.
         * <p>
         * Build up a list of OrderItems, from the existing cart ({@link CartViewModel}). Create an
         * (internal) ShoppingCart object with these items, along with any coupons from the cart,
         * and finally create an Order object, from the cart and the payment details.
         * Send this Order object to the endpoint to submit the order.
         * @private
         * @function OrderViewModel.createOrder
         */
        OrderViewModel.prototype.createOrder = function() {
            this.cart().isOrderSubmissionInProgress = true;
            if(this.cart().currentOrderState()== ccConstants.PENDING_PAYMENTS){
                this.addPaymentsToOrder();
            } else {
                var self = this;

                var items = ko.observableArray([]);
                var giftWithPurchaseOrderMarkers = self.cart().giftWithPurchaseOrderMarkers;
                var cartItems = self.cart().items;
                for (var i = 0; i < cartItems().length; i++) {
                    var cartItem = new OrderItem(
                        cartItems()[i].productId,
                        cartItems()[i].quantity,
                        cartItems()[i].productData().childSKUs[0].repositoryId,
                        cartItems()[i].externalPrice,
                        cartItems()[i].externalPriceQuantity,
                        cartItems()[i].giftWithPurchaseCommerceItemMarkers,
                        cartItems()[i].externalData(),
                        cartItems()[i].actionCode(),
                        cartItems()[i].commerceItemId
                    );
                    if (cartItems()[i].childItems) {
                        cartItem.childItems = cartItems()[i].childItems;
                        cartItem.configuratorId = cartItems()[i].configuratorId;
                    }
                    for(var j = 0; j < self.cart().lineAttributes().length; j++) {
                        cartItem[self.cart().lineAttributes()[j].id()] = cartItems()[i][self.cart().lineAttributes()[j].id()];
                    }
                    items.push(cartItem);
                }

                var shoppingCart = new ShoppingCart(items, self.cart().coupons(), self
                    .cart().total());

                var shippingGroups = self.cart().createShippingGroups();

                var schedule = undefined;

                if (self.showSchedule() && self.schedule()) {
                    schedule = self.schedule().toJSON();
                }

                var shippingAddress = undefined;
                if (self.shippingAddress()) {
                    if (self.paymentGateway() && self.paymentGateway().type === ccConstants.PAYPAL_CHECKOUT_TYPE &&
                        navigation.isPathEqualTo(self.cartLink)) {
                        var paypalShippingCheck = self.shippingAddress().isValid();
                        if (paypalShippingCheck) {
                            shippingAddress = self.shippingAddress().toJSON();
                        }
                    }
                    else {
                        shippingAddress = self.shippingAddress().toJSON();
                    }
                }

                var billingAddress = undefined;
                if (self.billingAddress()) {
                    billingAddress = self.billingAddress().toJSON();
                }

                var isAnonymousCheckout = true;
                if (self.user().loggedIn()) {
                    isAnonymousCheckout = false;
                    if (!self.emailAddress() && self.user().emailAddress()) {
                        self.emailAddress(self.user().emailAddress());
                    }
                }

                if (self.emailAddress()) {
                    var emailAddress = self.emailAddress().toString();

                    if (shippingGroups) {
                        // update the email address on shipping address of each shipping group
                        shippingGroups.forEach(function(shippingGroup){
                            shippingGroup.shippingAddress.email = emailAddress;
                        });
                    } else if (shippingAddress) {
                        shippingAddress.email = emailAddress;
                    }
                }

                var appliedPromotions = [];
                for (var i = 0; i < self.cart().orderDiscountDescList().length; i++) {
                    appliedPromotions
                        .push(self.cart().orderDiscountDescList()[i].promotionId);
                }

                for (var couponIndex = 0; couponIndex < self.cart().claimedCouponMultiPromotions().length; couponIndex++) {
                    for(var promoIndex = 0; promoIndex < self.cart().claimedCouponMultiPromotions()[couponIndex].promotions().length; promoIndex++) {
                        appliedPromotions
                            .push(self.cart().claimedCouponMultiPromotions()[couponIndex].promotions()[promoIndex].promotionId());
                    }
                }
                if(!self.isPayLater()){
                    var payments = [];

                    if (self.cashModel().isPayingByCash()) {
                        var payment = {};
                        payment.type = ccConstants.CASH_PAYMENT_TYPE;
                        if(self.cashModel().customProperties && (Object.keys(self.cashModel().customProperties).length - 1) > 0) {
                            payment.customProperties = ko.mapping.toJS(self.cashModel().customProperties);
                        }
                        payments.push(payment);
                    } else {
                        //Gift Cards
                        if (self.giftCards()) {
                            for ( var i = 0; i < self.giftCards().length; i++) {
                                var payment = {};
                                payment.type = ccConstants.GIFT_CARD_PAYMENT_TYPE;
                                payment.giftCardNumber = self.giftCards()[i].giftCardNumber();
                                payment.giftCardPin = self.giftCards()[i].giftCardPin();
                                if (!self.giftCards()[i].isAmountRemaining() || self.isPaypalVerified()) {
                                    payment.amount = self.giftCards()[i].amountUsed();
                                }
                                payment.paymentGroupId = self.giftCards()[i].paymentGroupId;
                                if(self.giftCards()[i].customProperties && (Object.keys(self.giftCards()[i].customProperties).length - 1) > 0) {
                                    payment.customProperties = ko.mapping.toJS(self.giftCards()[i].customProperties);
                                }
                                payments.push(payment);
                            }
                        }

                        if (self.payments().length > 0) {
                            // Add any generic payments.
                            ko.utils.arrayForEach(self.payments(), function (payment) {
                                payments.push(payment);
                            });
                        }
                        // These entries are for Paypal and credit card respectively. Update here
                        // for other payment scenarios.
                        else if (self.isPaypalVerified() || (self.amountRemaining && self.amountRemaining() != 0)) {
                            if (self.paymentGateway() && self.paymentGateway().type) {
                                payments.push(self.paymentGateway());
                                self.createSpinner();
                            } else if(self.isInvoicePayment()) {
                                payments.push({type:ccConstants.INVOICE_PAYMENT_TYPE, PONumber:self.poNumber()});
                            } else if (self.paymentDetails && self.paymentDetails()) {
                                var payment = {};
                                if (!self.isCardPaymentClientSide) {
                                    payment = new CreditCardPaymentDetails(self.paymentDetails());
                                    if(self.paymentDetails().customProperties && (Object.keys(self.paymentDetails().customProperties).length - 1) > 0) {
                                        payment.customProperties = ko.mapping.toJS(self.paymentDetails().customProperties);
                                    }
                                }
                                payment.type = ccConstants.CARD_PAYMENT_TYPE;
                                payments.push(payment);
                            }
                        }

                    }
                }
                var op = '';
                if (self.op() != ccConstants.ORDER_OP_INITIATE) {
                    op = ccConstants.ORDER_OP_COMPLETE;
                } else {
                    op = self.op();
                }

                // Clear any previous errors before
                // attempting a new order submission
                notifier.clearError(ORDER_VIEW_MODEL_ID);

                var visitorId = pageViewTracker.getVisitorId();
                var visitId = pageViewTracker.getVisitId();

                // check if OrderViewModel has order id and the user is logged-in to
                // reuse the order to update and submit with changes.
                if (self.user() && self.user().orderId()
                    && self.user().loggedIn() && !self.user().loggedinAtCheckout()
                    && !self.hasPaymentType(ccConstants.GENERIC_PAYMENT_TYPE)) {
                    var updateOrderData = ko.observable(new Order(self.user().orderId, shoppingCart,
                        appliedPromotions, self.selectedShippingOption(), schedule,
                        shippingAddress, billingAddress, visitorId, visitId,
                        isAnonymousCheckout, null, payments, op, giftWithPurchaseOrderMarkers, shippingGroups, self.cart().combineLineItems));

                    // Update the order
                    self.adapter.persistUpdate('updateOrder', self.user().orderId(),
                        self.addDynamicProperties(JSON.parse(ko.toJSON(updateOrderData))),
                        // success callback
                        function(data) {
                            self.postOrderCreateOrUpdateSuccess(data);
                        },
                        // error callback
                        function(data) {
                            var param = new Object();
                            if (data && data.errors && data.errors instanceof Array) {
                                param.orderId = self.id();
                                param.errorCode = "";
                                data.errors.forEach (function(error) {
                                    param.errorCode += error.errorCode +", ";
                                });
                                param.errorCode = param.errorCode.slice(0,-2);
                            } else {
                                param.orderId = self.id();
                                param.errorCode = data.errorCode;
                            };
                            self.storeServerLog.logError("updateOrderFailure",self.storeServerLog.getMessage("updateOrderFailure", param));
                            self.postOrderCreateOrUpdateFailure(data);
                        });
                } else {
                    if ((!self.paymentGateway() || self.paymentGateway().type != ccConstants.PAYPAL_CHECKOUT_TYPE) &&
                        !self.hasPaymentType(ccConstants.PAYPAL_CHECKOUT_TYPE) &&
                        !self.hasPaymentType(ccConstants.GENERIC_PAYMENT_TYPE)) {
                        self.id('');
                    }
                    if (self.cart().currentOrderId()) {
                        self.id(self.cart().currentOrderId());
                    }
                    var newOrder = ko.observable(new Order(self.id(), shoppingCart,
                        appliedPromotions, self.selectedShippingOption(), schedule,
                        shippingAddress, billingAddress, visitorId, visitId,
                        isAnonymousCheckout, self.user().id(), payments, op, giftWithPurchaseOrderMarkers, shippingGroups, self.cart().combineLineItems));

                    // Create the order
                    self.adapter.persistCreate('order', 'id',
                        self.addDynamicProperties(JSON.parse(ko.toJSON(newOrder))),
                        // success callback
                        function(data) {
                            self.postOrderCreateOrUpdateSuccess(data);
                        },
                        // error callback
                        function(data) {
                            var param = new Object();
                            if (data && data.errors && data.errors instanceof Array) {
                                param.errorCode = "";
                                data.errors.forEach (function(error) {
                                    param.errorCode += error.errorCode +", ";
                                });
                                param.errorCode = param.errorCode.slice(0,-2);
                            } else {
                                param.errorCode = data.errorCode;
                            };
                            self.storeServerLog.logError("createOrderFailure",self.storeServerLog.getMessage("createOrderFailure", param));
                            self.postOrderCreateOrUpdateFailure(data);
                        });
                }
            }
        };

        /**
         * This adds dynamic properties to the order
         * @private
         * @function
         * @name OrderViewModel#addDynamicProperties
         * @param {Object} orderModel
         * @returns {Object} The updated order model
         */
        OrderViewModel.prototype.addDynamicProperties = function(orderModel) {
            var self = this;
            for ( var i = 0; i < self.cart().dynamicProperties().length; i++) {
                var dynPropItem = self.cart().dynamicProperties()[i];
                var dynPropId = dynPropItem.id();
                var dynPropValue = null;
                if (dynPropItem.value != null) {
                    dynPropValue = dynPropItem.value();
                }
                orderModel[dynPropId] = dynPropValue;
            }
            return orderModel;
        };

        /**
         * Success callback function for order create or update.
         * @private
         * @function OrderViewModel.postOrderCreateOrUpdateSuccess
         * @param {Object} data Order data.
         */
        OrderViewModel.prototype.postOrderCreateOrUpdateSuccess = function(data) {
            var self = this;
            self.cart().isOrderSubmissionInProgress = false;
            self.id(data.id);
            self.order(data);
            self.orderProfileId(data.orderProfileId);
            self.op('');
            if (self.user() && self.user().loggedIn()
                && self.user().id() == data.orderProfileId) {
                self.user().orderId(data.id);
                self.user().setLocalData('orderId');
            }
            if (data.state == ccConstants.SUBMITTED ) {
                $.Topic(pubsub.topicNames.ORDER_COMPLETED).publish({
                    message : "success",
                    id : data.id,
                    uuid : data.uuid,
                    payment : data.payments
                });
                // Redirecting to order confirmation page
                $.Topic(pubsub.topicNames.ORDER_SUBMISSION_SUCCESS).publish([ {
                    message : "success",
                    id : data.id,
                    uuid : data.uuid
                } ]);
            } else {
                if (data.state == ccConstants.TEMPLATE ) {
                    $.Topic(pubsub.topicNames.ORDER_COMPLETED).publish({
                        message : "success",
                        id : data.id,
                        uuid : data.uuid,
                        payment : data.payments
                    });
                    // Redirecting to order confirmation page
                    $.Topic(pubsub.topicNames.SCHEDULED_ORDER_SUBMISSION_SUCCESS).publish([ {
                        message : "success",
                        id : data.id,
                        scheduleOrderId: data.scheduledOrder.id ? data.scheduledOrder.id :data.scheduledOrder[0].id,
                        uuid : data.uuid
                    } ]);
                } else if(data.state == ccConstants.PENDING_APPROVAL || data.state == ccConstants.PENDING_SCHEDULED_ORDER_APPROVAL){
                    $.Topic(pubsub.topicNames.ORDER_COMPLETED).publish({
                        message : "success",
                        id : data.id,
                        uuid : data.uuid,
                        payment : data.payments
                    });
                    self.destroySpinner();
                    // Redirecting to order confirmation page
                    $.Topic(pubsub.topicNames.ORDER_SUBMISSION_SUCCESS).publish([ {
                        message : "success",
                        id : data.id,
                        uuid : data.uuid
                    } ]);
                }else {
                    var paymentGroups = data.payments;
                    var isPaymentFailed = false;
                    var isProcessed = false;
                    var isPayPalGeneric = false;
                    for ( var i = 0; i < paymentGroups.length; i++) {
                        if (paymentGroups[i].paymentState == ccConstants.PAYMENT_GROUP_STATE_AUTHORIZED_FAILED ||
                            paymentGroups[i].paymentState == ccConstants.PAYMENT_GROUP_STATE_PAYMENT_REQUEST_FAILED) {
                            this.destroySpinner();
                            isProcessed =  true;
                            // clear the order if the authorization fails for anonymous user,
                            // so that it should create the order.
                            var orderError = "";
                            if (paymentGroups[i] && paymentGroups[i].message
                                && paymentGroups[i].message !== '') {
                                orderError = paymentGroups[i].message;
                                var param = {
                                    orderId        : data.id,
                                    paymentState   : paymentGroups[i].paymentState,
                                    paymentGroupId : paymentGroups[i].paymentGroupId
                                };
                                self.storeServerLog.logError("paymentGroupFailure",self.storeServerLog.getMessage("paymentGroupFailure", param));
                            } else {
                                var param = {
                                    orderId : data.id,
                                };
                                self.storeServerLog.logError("orderSubmissionFailure",self.storeServerLog.getMessage("orderSubmissionFailure", param));
                                orderError = CCi18n.t('ns.common:resources.orderSubmissionFailed');
                            }
                            notifier.sendError(ORDER_VIEW_MODEL_ID, orderError, true);
                            $.Topic(pubsub.topicNames.ORDER_SUBMISSION_FAIL).publishWith(data, [ {
                                message : "fail",
                                data : paymentGroups[i]
                            } ]);
                            isPaymentFailed = true;
                            if (self.isPaypalVerified() || self.cart().checkoutWithPaypalClicked()) {
                                self.clearPaypalData();
                            }
                            break;
                        }
                    }

                    //if any payment failed then do not process other payments
                    if (!isPaymentFailed) {
                        for (var i=0 ; i<paymentGroups.length ; i++){
                            if (paymentGroups[i].gatewayName == ccConstants.PAYPAL_GATEWAY_ID
                                && paymentGroups[i].uiIntervention == ccConstants.REDIRECT) {
                                isProcessed =  true;
                                // After being redirected to web payment page if a shopper clicks the 'back' button
                                // then in Safari, the page is not refreshed. This leads to all view models holding stale
                                // data. Thus, currently paymentGateway data needs to be reset.
                                self.paymentGateway(null);
                                //set a flag in local storage to indicate that the page is redirected to a web url.
                                //so, when coming back to store page, as all the view models are reset, use this flag to determine
                                // whether the page was redirected to a web payment page.
                                storageApi.getInstance().setItem(ccConstants.REDIRECTED_TO_WEB_PAYMENT, 'true');
                                window.location = data.payments[i].REDIRECT;
                                break;
                            } else if (paymentGroups[i].type === ccConstants.PAYPAL_PAYMENT_TYPE ||
                                paymentGroups[i].type === ccConstants.GENERIC_PAYMENT_TYPE) {
                                isPayPalGeneric = true;
                                isProcessed =  true;
                                break;
                            } else if (paymentGroups[i].gatewayName == ccConstants.CYBERSOURCE_GATEWAY_ID
                                && paymentGroups[i].uiIntervention == ccConstants.SOP) {
                                isProcessed =  true;
                                // Redirecting to the payment page.
                                this.destroySpinner();
                                navigation.goTo(self.paymentLink, true);
                                $.Topic(pubsub.topicNames.ORDER_CREATED).publish([{
                                    message: "success",
                                    id: data.id,
                                    uuid: data.uuid
                                }]);
                                break;
                            } else if(paymentGroups[i].uiIntervention == ccConstants.PAYER_AUTH_REQUIRED){
                                isProcessed =  true;
                                this.destroySpinner();
                                navigation.goTo(self.paymentLink, true);
                                $.Topic(pubsub.topicNames.ORDER_CREATED).publish([{
                                    message: "success",
                                    id: data.id,
                                    uuid: data.uuid,
                                    customPaymentProperties:paymentGroups[i].customPaymentProperties
                                }]);
                                break;
                            } else if (paymentGroups[i].gatewayName == ccConstants.PAYULATAM_GATEWAY_ID
                                && paymentGroups[i].uiIntervention == ccConstants.SOP) {
                                isProcessed =  true;
                                $.Topic(pubsub.topicNames.PAYULATAM_WEB_CHECKOUT).publishWith(
                                    paymentGroups[i],
                                    [{message: "success", id: data.id, uuid: data.uuid}]
                                );
                                storageApi.getInstance().setItem(ccConstants.REDIRECTED_TO_WEB_PAYMENT, 'true');
                                break;
                            }
                        }
                    }

                    //this should not happen at all
                    if (!isProcessed) {
                        this.destroySpinner();
                        var orderError = CCi18n.t('ns.common:resources.orderSubmissionFailed');
                        notifier.sendError(ORDER_VIEW_MODEL_ID, orderError, true);
                        $.Topic(pubsub.topicNames.ORDER_SUBMISSION_FAIL).publishWith(data, [ {
                            message : "fail",
                            data : data
                        } ]);
                    } else {
                        if (data.state === ccConstants.INCOMPLETE || isPayPalGeneric) {
                            // Send an event that the initial Order was created.
                            $.Topic(pubsub.topicNames.ORDER_CREATED_INITIAL).publishWith(data, [{
                                message : "success",
                                order : data
                            }]);
                        }
                        this.destroySpinner();
                    }
                }
            }
        };

        /**
         * Error callback function for order create or update.
         * @private
         * @function OrderViewModel.postOrderCreateOrUpdateFailure
         * @param {Object} data Callback data.
         */
        OrderViewModel.prototype.postOrderCreateOrUpdateFailure = function(data) {
            var self = this;
            this.destroySpinner();
            self.cart().isOrderSubmissionInProgress = false;
            if (data && data.message && data.message !== '') {
                if (data.errorCode == ccConstants.INVENTORY_CONFIGURABLE_ITEM_CHECK_ERROR) {
                    data.message = CCi18n.t('ns.common:resources.orderPricingPromotionError');
                    notifier.sendError(ORDER_VIEW_MODEL_ID, data.message, true);
                }
                else if (data.errors instanceof Array) {
                    var errorCaught = false;
                    for (var i in data.errors) {
                        if (data.errors[i].errorCode == ccConstants.EXTERNAL_PRICE_CHANGED ||
                            data.errors[i].errorCode == ccConstants.EXTERNAL_PRICE_PARTIAL_FAILURE_ERROR) {
                            data.message = CCi18n.t('ns.common:resources.orderPricingPromotionError');
                            notifier.sendError(ORDER_VIEW_MODEL_ID, data.message, true);
                            errorCaught = true;
                            break;
                        }
                        else{
                            errorCaught = self.checkSingleException(data);
                            if (errorCaught == true)
                                break;
                        }
                    }
                }
                else{
                    self.checkSingleException(data);
                }
            }
            $.Topic(pubsub.topicNames.ORDER_SUBMISSION_FAIL).publishWith(data, [ {
                message : "fail",
                data : data
            } ]);
        };

        /**
         * Order Created. Auth Payment.
         * @private
         * @function OrderViewModel.authPayment
         */
        OrderViewModel.prototype.authPayment = function() {
            var self = this;
            var order = self.order();
            var paymentAuthDetails = new PaymentAuthDetails(self.emailAddress(), ko
                .toJS(self.billingAddress()), self.paymentDetails(), self.order());

            $.Topic(pubsub.topicNames.ORDER_AUTHORIZE_PAYMENT).publish([ {
                message : "success",
                details : paymentAuthDetails
            } ]);

        };

        /**
         * Payment Authorized. Submit the order.
         * @private
         * @function OrderViewModel.paymentAuthorized
         * @param {Object} data Payment data.
         */
        OrderViewModel.prototype.paymentAuthorized = function(data) {
            $.Topic(pubsub.topicNames.ORDER_SUBMISSION_SUCCESS).publish([ {
                message : "success",
                id : data[0].id,
                uuid : data[0].uuid
            } ]);
        };

        /**
         * Payment Declined. Order submission failed.
         * <p>
         * Publishes an ORDER_SUBMISSION_FAIL message.
         * @private
         * @function OrderViewModel.paymentDeclined
         * @param {Object} data (unused)
         */
        OrderViewModel.prototype.paymentDeclined = function(data) {

            $.Topic(pubsub.topicNames.ORDER_SUBMISSION_FAIL).publish([ {
                message : "fail"
            } ]);

        };

        /**
         * Payment auth timed out. Order submission failed.
         * <p>
         * Publishes an ORDER_SUBMISSION_FAIL message.
         * @private
         * @function OrderViewModel.paymentTimeout
         * @param {Object} data (unused)
         */
        OrderViewModel.prototype.paymentTimeout = function(data) {

            $.Topic(pubsub.topicNames.ORDER_SUBMISSION_FAIL).publish([ {
                message : "fail"
            } ]);

        };

        /**
         * Set context data.
         * @function OrderViewModel.setContext
         * @param {Object} pContext Context data.
         */
        OrderViewModel.prototype.setContext = function(pContext) {
            this.contextData = pContext;
            this.paymentLink = this.contextData.global.links.payment.route;
            this.checkoutLink = this.contextData.global.links.checkout.route;
            this.cartLink = this.contextData.global.links.cart.route;
            this.isCardPaymentClientSide = this.contextData.page.payment.isCardPaymentClientSide;
            if(this.contextData && this.contextData.global && this.contextData.global.site
                && this.contextData.global.site.extensionSiteSettings
                && this.contextData.global.site.extensionSiteSettings.storeEndpointSettings
                && this.contextData.global.site.extensionSiteSettings.storeEndpointSettings.cartFields)
                this.fields = this.contextData.global.site.extensionSiteSettings.storeEndpointSettings.cartFields;
        };

        /**
         * Destroy the 'loading' spinner.
         * @function  OrderViewModel.destroySpinner
         */
        OrderViewModel.prototype.destroySpinner = function() {
            $('#loadingModal').hide();
            spinner.destroy();
        };

        /**
         * Create the 'loading' spinner.
         * @function  OrderViewModel.createSpinner
         */
        OrderViewModel.prototype.createSpinner = function(loadingText) {
            var indicatorOptions = {
                parent : '#loadingModal',
                posTop : '0',
                posLeft : '50%'
            };
            var loadingText = CCi18n.t('ns.common:resources.loadingText');
            $('#loadingModal').removeClass('hide');
            $('#loadingModal').show();
            indicatorOptions.loadingText = loadingText;
            spinner.create(indicatorOptions);
        };

        /**
         * Add an Order Calidation Callback. Will be invoked by handlePlaceOrder.
         * @function OrderViewModel.addValidationCallback
         * @param {Object} pCallbackFunction the callback function
         */
        OrderViewModel.prototype.addValidationCallback = function(pCallbackFunction) {
            if (pCallbackFunction && typeof(pCallbackFunction) === "function") {
                this.validationCallbacks.push(pCallbackFunction);
            }
        };

        /**
         * Trigger any Order Validation Callbacks currently registered.
         * @function OrderViewModel.triggerValidationCallbacks
         */
        OrderViewModel.prototype.triggerValidationCallbacks = function() {
            if (this.validationCallbacks.length > 0) {
                var length = this.validationCallbacks.length;
                for (var i = 0; i < length; i++) {
                    if (this.validationCallbacks[i] &&
                        typeof(this.validationCallbacks[i]) === "function") {
                        this.validationCallbacks[i]();
                    }
                }
            }
        };

        /**
         * Add an Order Validation Error.
         * @function OrderViewModel.addValidationError
         * @param {String} pMessageId the message ID. Can be used to clear message later.
         * @param {String} pMessage the message. If not set, default message used.
         */
        OrderViewModel.prototype.addValidationError = function(pMessageId, pMessage) {
            this.errorFlag = true;
            var message = pMessage;
            if (!message || message === '') {
                message = CCi18n.t('ns.common:resources.checkoutErrorMsg');
            }
            notifier.sendError(pMessageId, message, true);
        };

        OrderViewModel.prototype.postPaymentOrderUpdateSuccess = function(paymentData) {
            var self = this;
            var oId=paymentData.orderId;
            //Get Order with orderId
            var url=ccConstants.ENDPOINT_GET_ORDER;
            for(var i=0; i < paymentData.paymentResponses.length ; i++){
                if(paymentData.paymentResponses[i].type == ccConstants.PAYPAL_PAYMENT_TYPE){
                    storageApi.getInstance().setItem(ccConstants.PAYMENT_GROUP_AFTER_PAYPAL, paymentData.paymentResponses[i].paymentGroupId);
                }
            }
            ccRestClient.request(url, null,
                // success callback
                function(data) {
                    for(var i=0; i < paymentData.paymentResponses.length ; i++){
                        for(var j=0; j < data.payments.length ; j++){
                            if(paymentData.paymentResponses[i].paymentGroupId == data.payments[j].paymentGroupId){
                                data.payments[j].customPaymentProperties = paymentData.paymentResponses[i].customPaymentProperties;
                                data.payments[j].uiIntervention = paymentData.paymentResponses[i].uiIntervention;
                                break;
                            }
                        }
                    }

                    self.postOrderCreateOrUpdateSuccess(data);
                },
                // error callback
                function(data) {
                    self.destroySpinner();
                    notifier.sendError(ORDER_VIEW_MODEL_ID, data.message, true);
                },oId);
        };


        /**
         * Represents an order object.
         *
         * @private
         * @class Order
         * @memberof OrderViewModel
         * @param {integer} pOrder ID The order ID.
         * @param {ShoppingCart} pShoppingCart The shopping cart.
         * @param {string[]} pAppliedPromotions The list of applied promotions.
         * @param {string} pSelectedShippping Selected shipping method.
         * @param {Address} pShippingAddress The shipping address.
         * @param {string} pVisitorId The visitor ID.
         * @param {string} pVisitId The visit ID.
         * @param {boolean} pIsAnonymousCheckout Anonymous checkout?
         * @param {string} pProfileId The profile ID
         * @param {PaypalPaymentDetails} pPayment The payment details object.
         * @param {string} pOp The operation
         *
         * @property {integer} id The order ID.
         * @property {ShoppingCart} shoppingCart The shopping cart.
         * @property {string[]} appliedPromotions The list of applied promotions.
         * @property {boolean} isAnonymousCheckout Anonymous checkout?
         * @property {string} shippingMethod The shipping method.
         * @property {Address} shippingAddress The shipping address.
         * @property {PaypalPaymentDetails} payment The payment details object.
         * @property {string} visitorId The visitor ID.
         * @property {string} visitId The visit ID.
         * @property {string} profileId The profile ID, set when not checking out anonymously.
         * @property {string} op The operation
         * @property {array} giftWithPurchaseOrderMarkers The order marker information
         * @property {array} shippingGroups The shipping groups
         * @property {boolean} combineLineItems yes if line items are to be combined.
         */
        function Order(pOrderId, pShoppingCart, pAppliedPromotions,
                       pSelectedShippping, pSchedule, pShippingAddress, pBillingAddress, pVisitorId,
                       pVisitId, pIsAnonymousCheckout, pProfileId, pPayments, pOp,
                       pGiftWithPurchaseOrderMarkers, pShippingGroups, pCombineLineItems) {
            var self = this;

            if (pOrderId) {
                self.id = pOrderId;
            }

            self.shoppingCart = pShoppingCart;
            self.appliedPromotions = pAppliedPromotions;
            self.isAnonymousCheckout = pIsAnonymousCheckout;
            self.combineLineItems = pCombineLineItems;

            //Add Schedule information to order if not present
            if (pSchedule) {
                self.scheduleOnly = true;
                self.schedule = pSchedule;
            }

            // Are there multiple shipping addresses for this order.
            if (pShippingGroups) {
                // Yes - Populate the shipping groups structure.
                self.shippingGroups = pShippingGroups;
            }
            else{
                // No - Set single shipping address and shipping method.
                if (pShippingAddress) {
                    self.shippingAddress = pShippingAddress;
                }
                if (pSelectedShippping) {
                    // Sending only the shipping method id for the create/update order endpoint input
                    self.shippingMethod = {"value" : pSelectedShippping.value};
                }
            }
            if (pBillingAddress) {
                self.billingAddress = pBillingAddress;
            }
            if (pPayments) {
                self.payments = pPayments;
            }
            self.visitorId = pVisitorId;
            self.visitId = pVisitId;
            if (!pIsAnonymousCheckout) {
                self.profileId = pProfileId;
            }
            self.op = pOp;
            self.giftWithPurchaseOrderMarkers = pGiftWithPurchaseOrderMarkers;
        }

        /**
         * Represents an order item
         * @private
         * @class OrderItem
         * @memberof OrderViewModel
         * @param {string} pProductId The product ID.
         * @param {integer} pQuantity The quantity.
         * @param {string} pCatRefId The catalog reference ID.
         * @param {string} pExternalPrice
         * @param {string} pExternalPriceQuantity
         * @param {string} pGiftWithPurchaseCommerceItemMarkers
         * @param {Array} pExternalData The dynamic externalData state for this order item.
         * @param {string} pActionCode The action code for this order item.
         * @property {string} productId The product ID.
         * @property {integer} quantity The quantity.
         * @property {string} catRefId The catalog reference ID.
         * @property {Array} giftWithPurchaseCommerceItemMarkers The commerce item marker information.
         * @property {Array} externalData The dynamic externalData for this order item.
         * @property {string} actionCode The action code for this order item.
         */
        function OrderItem(
            pProductId,
            pQuantity,
            pCatRefId,
            pExternalPrice,
            pExternalPriceQuantity,
            pGiftWithPurchaseCommerceItemMarkers,
            pExternalData,
            pActionCode,
            pCommerceItemId
        ) {
            var self = this;
            self.productId = pProductId;
            self.catRefId = pCatRefId;
            self.quantity = pQuantity;
            self.externalPrice = pExternalPrice;
            self.externalPriceQuantity = pExternalPriceQuantity;
            self.giftWithPurchaseCommerceItemMarkers = pGiftWithPurchaseCommerceItemMarkers;
            self.externalData = pExternalData;
            self.actionCode = pActionCode;
            self.commerceItemId = pCommerceItemId;
        }

        /**
         * Represents a shopping cart.
         * @private
         * @class ShoppingCart
         * @memberof OrderViewModel
         * @param {OrderItem[]} pItems The items in the cart.
         * @param {string[]} pCoupons List of coupons.
         * @param {float} pOrderTotal Order total.
         * @property {OrderItem[]} items The items in the cart.
         * @property {string[]} coupons List of coupons.
         * @property {float} orderTotal Order total.
         */
        function ShoppingCart(pItems, pCoupons, pOrderTotal) {
            var self = this;
            self.items = pItems;
            self.coupons = pCoupons;
            self.orderTotal = pOrderTotal;
        }

        /**
         * Payment authorisation details.
         * @private
         * @class PaymentAuthDetails
         * @memberof OrderViewModel
         * @param {string} pEmailAddress Email address.
         * @param {Address} pBillingAddress Billing address.
         * @param {Object} pPaymentDetails The payment details.
         * @param {Object} pOrderDetails The order details.
         * @property {string} emailAddress Email address.
         * @property {Address} billingAddress Billing address.
         * @property {Object} paymentDetails The payment details.
         * @property {Object} orderDetails The order details.
         */
        function PaymentAuthDetails(pEmailAddress, pBillingAddress,
                                    pPaymentDetails, pOrderDetails) {
            var self = this;
            self.emailAddress = pEmailAddress;
            self.billingAddress = pBillingAddress;
            self.paymentDetails = pPaymentDetails;
            self.orderDetails = pOrderDetails;
        }

        /**
         * Credit Card Payment Details.
         * @private
         * @class CreditCardPaymentDetails
         * @memberof OrderViewModel
         * @param {Object} pPaymentDetails Payment Details.
         * @property {string} nameOnCard The name on card.
         * @property {Address} billingAddress Billing address.
         * @property {Object} paymentDetails The payment details.
         * @property {Object} orderDetails The order details.
         */
        function CreditCardPaymentDetails(pPaymentDetails) {
            var self = this;
            self.nameOnCard = pPaymentDetails.nameOnCard();
            //self.cardType = pPaymentDetails.cardType();
            if (pPaymentDetails.selectedCardType() == null) {
                self.cardType = pPaymentDetails.cardType();
            } else {
                self.cardType = pPaymentDetails.selectedCardType();
            }
            self.cardNumber = pPaymentDetails.cardNumber();
            self.cardCVV = pPaymentDetails.cardCVV();
            self.endMonth = pPaymentDetails.endMonth();
            self.endYear = pPaymentDetails.endYear();
            if (pPaymentDetails.selectedCardType() == null) {
                self.selectedCardType = pPaymentDetails.cardType();
            } else {
                self.selectedCardType = pPaymentDetails.selectedCardType();
            }
            if (pPaymentDetails.selectedEndMonth() == null) {
                self.selectedEndMonth = pPaymentDetails.endMonth();
            } else {
                self.selectedEndMonth = pPaymentDetails.selectedEndMonth();
            }
            if (pPaymentDetails.selectedEndYear() == null) {
                self.selectedEndYear = pPaymentDetails.endYear();
            } else {
                self.selectedEndYear = pPaymentDetails.selectedEndYear();
            }
        }

        /**
         * Credit Card Payment Details.
         * @private
         * @class CreditCardPaymentDetails
         * @memberof OrderViewModel
         * @param {Object} pPaymentDetails Payment Details.
         * @property {string} nameOnCard The name on card.
         * @property {Address} billingAddress Billing address.
         * @property {Object} paymentDetails The payment details.
         * @property {Object} orderDetails The order details.
         */
        function CreditCardPaymentDetailsClientSide(pPaymentDetails) {
            var self = this;
            self.nameOnCard = pPaymentDetails.nameOnCard();
            //self.cardType = pPaymentDetails.cardType();
            if (pPaymentDetails.selectedCardType() == null) {
                self.cardType = pPaymentDetails.cardType();
            } else {
                self.cardType = pPaymentDetails.selectedCardType();
            }
            self.cardNumber = pPaymentDetails.cardNumber();
            self.cardCVV = pPaymentDetails.cardCVV();
            self.expiryMonth = pPaymentDetails.endMonth();
            self.expiryYear = pPaymentDetails.endYear().toString();
            if (pPaymentDetails.selectedCardType() == null) {
                self.selectedCardType = pPaymentDetails.cardType();
            } else {
                self.selectedCardType = pPaymentDetails.selectedCardType();
            }
            if (pPaymentDetails.selectedEndMonth() == null) {
                self.selectedEndMonth = pPaymentDetails.endMonth();
            } else {
                self.selectedEndMonth = pPaymentDetails.selectedEndMonth();
            }
            if (pPaymentDetails.selectedEndYear() == null) {
                self.selectedEndYear = pPaymentDetails.endYear();
            } else {
                self.selectedEndYear = pPaymentDetails.selectedEndYear();
            }
        }
        /**
         * PayPal Payment details.
         * @private
         * @class PaypalPaymentDetails
         * @memberof OrderViewModel
         * @param {string} pPaymentType Payment type.
         * @param {string} pPaymentId Payment ID.
         * @param {string} pToken The payment token.
         * @param {string} pPayerID The payer ID.
         * @property {string} type Payment type.
         * @property {string} paymentId Payment ID.
         * @property {string} token The payment token.
         * @property {string} PayerID The payer ID.
         */
        function PaypalPaymentDetails(pPaymentType, pPaymentId, pToken, pPayerID, pPaymentGroupId) {
            var self = this;
            self.type = pPaymentType;
            self[ccConstants.PAYMENT_ID] = pPaymentId;
            self[ccConstants.TOKEN] = pToken;
            self[ccConstants.PAYER_ID] = pPayerID;
            self[ccConstants.PAYMENT_GROUP_ID] = pPaymentGroupId;
        }

        /**
         * PayULatam Payment details.
         * @private
         * @class PayULatamPaymentDetails
         * @memberof OrderViewModel
         * @param {string} pPaymentType Payment type.
         * @param {string} pAmount amount.
         * @param {string} pCurrency Currency Code.
         * @param {string} pPaymentId ReferenceCode of the payment.
         * @param {string} pTransactionStatus Transaction Status in PayU System.
         * @param {string} pTransactionType TransactionType such as initial, response, etc.
         * @param {string} pSignature Signature received in PayU response.
         * @property {string} type Payment type.
         * @property {string} amount Amount.
         * @property {string} currency Currency Code.
         * @property {string} paymentId ReferenceCode of the payment.
         * @property {string} transactionStatus Transaction Status in PayU System.
         * @property {string} transactionType TransactionType such as initial, response, etc.
         * @property {string} Signature received in PayU response.
         */
        function PayULatamPaymentDetails(pPaymentType, pAmount, pCurrency,
                                         pPaymentId, pTransactionStatus, pTransactionType, pSignature) {
            var self = this;
            self.type = pPaymentType;
            self[ccConstants.AMOUNT] = pAmount;
            self[ccConstants.CURRENCY] = pCurrency;
            self[ccConstants.PAYMENT_ID] = pPaymentId;
            self[ccConstants.TRANSACTION_STATUS] = pTransactionStatus;
            self[ccConstants.TRANSACTION_TYPE] = pTransactionType;
            self[ccConstants.SIGNATURE] = pSignature;
        }

        function ExceptionMessage(pError, pShoppingCartItems, pEmailId, pVisitorId, pVisitId) {
            var errMessage = {};
            errMessage.msg = pError.toString();
            errMessage.shoppingCartItems = pShoppingCartItems;
            errMessage.emailId = pEmailId;
            errMessage.visitorId = pVisitorId;
            errMessage.visitId = pVisitId;

            errMessage.toJSON = function() {
                var copy = ko.toJS(errMessage);
                return copy;
            };
            return errMessage;
        }

        // Click handler for the place order button when order is in PENDING_PAYMENT state.
        OrderViewModel.prototype.handlePayments = function() {
            try {
                this.enableOrderButton(false);
                this.errorFlag = false;
                this.isOrderSubmitted = false;
                // If its somehow possible that a second click got through
                // before the button was disabled, then stop it here
                if (!this.isOrderLocked && !this.isOrderSubmitted) {
                    this.isOrderLocked = true;

                    this.triggerValidationCallbacks();

                    // validating checkout-payment-details
                    this.validateCheckoutPaymentDetails();

                    this.validateGiftcards();

                    // validating is any payment method selected for scheduled order
                    this.validatePaymentMethodsForScheduledOrder();

                    //validating billingAddress
                    this.validateBillingAddress();

                    //validating dynamic properties
                    this.validateDynamicProperties();

                    // Any invalid data will have caused the error flag to be set
                    if (!this.errorFlag) {
                        this.createSpinner();
                        // Check if the payment is a payU type checkout
                        if (this.isPayULatamCheckout()) {
                            this.preparePayULatamDataForCreateOrder(ccConstants.PAYULATAM_CHECKOUT_TYPE);
                        }
                        // All good. proceed with order.
                        if (this.user().loggedIn() && !this.user().isB2BUser()) {
                            this.placeOrder = true;
                            this.user().handleUpdateProfile();
                        } else {
                            this.addPaymentsToOrder();
                        }
                    } else {
                        // Enable button again
                        this.enableOrderButton(true);
                    }
                    this.isOrderLocked = false;
                }
            } catch (e) {
                var emailAddr = this.user().loggedIn() ? this.user().emailAddress() : this.emailAddress();
                var msg = new ExceptionMessage(e, this.cart().items(), emailAddr, pageViewTracker.getVisitorId(), pageViewTracker.getVisitId());
                this.exceptionHandler.logWindowOnError(JSON.stringify(msg),'','');
            }
        };

        // Click handler for the place order button
        OrderViewModel.prototype.handlePlaceOrder = function() {
            try {
                this.enableOrderButton(false);
                this.errorFlag = false;
                this.isOrderSubmitted = false;
                // If its somehow possible that a second click got through
                // before the button was disabled, then stop it here
                if (!this.isOrderLocked && !this.isOrderSubmitted) {
                    this.isOrderLocked = true;

                    //validating checkoutRegistration
                    this.validateCheckoutRegistration();

                    //validating checkout-cart-summary
                    this.validateCheckoutCartSummary();

                    //validating schedule order information
                    if (this.showSchedule()) {
                        this.validateSchedule();
                    }
                    // if split shipping
                    if (this.cart().isSplitShipping()) {
                        this.validateShippingGroupRelationships();
                    }
                    else {
                        // validating shippingAddress
                        this.validateShippingAddress();


                        //validating checkout-order-summary
                        this.validateCheckoutOrderSummary();
                    }

                    this.triggerValidationCallbacks();
                    if(!this.isPayLater()){
                        //validating checkout-payment-details
                        this.validateCheckoutPaymentDetails();

                        this.validateGiftcards();

                        //validating is any payment method selected for scheduled order
                        this.validatePaymentMethodsForScheduledOrder();
                    }else{
                        // Clear any previous Payment errors before attempting a PayLater order submission for approvals.
                        notifier.clearError("checkoutPaymentDetails");
                        notifier.clearError("checkoutGiftCards");
                        notifier.clearError("checkoutPaymentMethodsForScheduledOrder");
                    }
                    //validating billingAddress
                    this.validateBillingAddress();

                    //validating dynamic properties
                    this.validateDynamicProperties();

                    // check if any placeholder items exist in the cart
                    if (!this.placeHolderItemsMsgDisplayed) {
                        this.validatePlaceHolderItems();
                    }

                    // Any invalid data will have caused the error flag to be set
                    if (!this.errorFlag) {
                        $.Topic(pubsub.topicNames.CHECKOUT_SAVE_SHIPPING_ADDRESS).
                        publishWith(this.shippingAddress(), [{message: "success"}]);
                        this.createSpinner();
                        // Check if the payment is a payU type checkout
                        if (this.isPayULatamCheckout()) {
                            this.preparePayULatamDataForCreateOrder(ccConstants.PAYULATAM_CHECKOUT_TYPE);
                        }
                        // All good. proceed with order.
                        if (this.createAccount() === true) {
                            // Publish the pubsub to login
                            var obj = {widgetId: "checkoutRegistration"};
                            this.user().updateLocalData(true, false);
                            this.user().registerUser(obj);
                            this.registerUser = true;
                        } else if (this.user().loggedIn() && !this.user().isB2BUser()) {
                            this.placeOrder = true;
                            this.user().handleUpdateProfile();
                        } else {
                            this.createOrder();
                        }
                    } else {
                        // Enable button again
                        this.enableOrderButton(true);
                    }
                    this.isOrderLocked = false;
                }
            } catch (e) {
                var emailAddr = this.user().loggedIn() ? this.user().emailAddress() : this.emailAddress();
                var msg = new ExceptionMessage(e, this.cart().items(), emailAddr, pageViewTracker.getVisitorId(), pageViewTracker.getVisitId());
                this.exceptionHandler.logWindowOnError(JSON.stringify(msg), '', '', '', e);
                this.cart().isOrderSubmissionInProgress = false;
            }
        };
        /**
         * Function to verify if order requires approval.
         * @private
         * @function OrderViewModel.checkOrderForApproval
         * @param {Object} data {orderId}
         */
        OrderViewModel.prototype.checkOrderForApproval = function(data) {
            var self = this;
            var inputData = {};
            inputData["orderId"] = data.orderId;
            var url = "checkRequiresApproval";
            ccRestClient.request(url, inputData, function(pData){
                self.approvalRequired(pData.requiresApproval);
            },function(pError){
                //TODO: Handle if error occurs
            });
        };

        /**
         * Returns a single global instance of OrderViewModel.
         * Creates the instance if it does not already exist.
         *
         * @function OrderViewModel.getInstance
         * @param {Object} pAdapter The rest adapter.
         * @param {CartViewModel} pCart The cart.
         * @param {Object} pData Additional data.
         * @returns {OrderViewModel} The single global instance.
         */
        OrderViewModel.getInstance = function(pAdapter, pCart, pData, params, pUser) {
            if (!OrderViewModel.prototype.singleInstance) {
                OrderViewModel.prototype.singleInstance = new OrderViewModel(
                    pAdapter, pCart, pData, pUser);
            }

            if (params) {
                OrderViewModel.prototype.singleInstance.setContext(params);
            }
            return OrderViewModel.prototype.singleInstance;
        };

        return OrderViewModel;
    });

