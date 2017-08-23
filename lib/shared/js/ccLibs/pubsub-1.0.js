/**
 * @fileoverview Oracle Cloud Commerce Publish / Subscribe API.
 */
/*global $ */
define(
    //-------------------------------------------------------------------
    // PACKAGE NAME
    //-------------------------------------------------------------------
    'pubsub',

    //-------------------------------------------------------------------
    // DEPENDENCIES
    //-------------------------------------------------------------------
    ['pubsubImpl', 'jquery'],

    //-------------------------------------------------------------------
    // MODULE DEFINTIION
    //-------------------------------------------------------------------
    function (PubSubImpl) {

        "use strict";

        /**
         * @class This module defines what is effectively a central PubSubImpl upon which the
         * entire client may publish and subscribe to messages. As a convenience, it also sets
         * $.Topic to the global PubSubImpl's topic function.
         * The default Oracle Cloud Commerce messages are
         * defined as constants in "topicNames".
         * <p>
         * This module returns the central PubSubImpl instance, not a constructor function.
         * <p>
         * <b>Topics Overview:</b>
         * <p>
         * Topics are identified by id. Messages are published to topics and subscribers
         * to a given topic will receive the messages published to that topic.
         * The use of topics encourages loose coupling between javascript modules.
         * <p>
         * <b>Creating a new topic:</b>
         * <p>
         * To create a topic call the "topic" function passing in the id of your
         * topic. Common cloud commerce topics are defined in the topicNames map.
         * <p>
         * <b>Returning an existing topic:</b>
         * <p>
         * The topic function will return an existing topic by id if it already exists.
         * Otherwise it will create and return a new topic.
         * <p>
         * <b>Publishing to a Topic:</b>
         * <p>
         * Use the "publish" or "publishWith" function to publish to a Topic.
         * The "publish" function takes one parameter, this is the object you wish to publish.
         * Example: <pre><code>$.Topic("foo").publish("Something interesting happened.")</code></pre>
         * <p>
         * Often you will need to control the context (this)in which subscribers receive your message.
         * To control that context use "publishWith" rather than "publish".
         * The first parameter to "publishWith" is the object to be used as "this" in the receiver's
         * callback.
         * Example: <pre><code>$.Topic("foo").publishWith(this,"Something interesting happened, and I supplied this.")</code></pre>
         * <p>
         * <b>Subscribing to a Topic:</b>
         * <p>
         * Use the "subscribe" function to subscribe your callback function to a topic. When a message
         * is posted to a given topic the callbacks for all subscribers will be invoked.
         * Note that the value for "this" in your callback may vary depedending on how the message
         * was published so save the current value of this if you need to guarantee it will remain constant.
         * Example: <pre><code>$.Topic("foo").subscribe(function(message){ console.log("Incoming message: " + message); })</code></pre>
         * <p>
         * <b>Unsubscribing from a Topic:</b>
         * <p>
         * Use the "unsubscribe" function to remove your callback subscription to a given topic.
         * @private
         */

        /**
         * Topic name constants.
         * Names with the suffix .memory will have memory enabled for
         * the topic.
         *
         * @readonly
         * @name PubSub.topicNames
         * @class
         * @static
         * @property {string} REGISTER_SUBMIT
         * @property {string} REGISTER_SUBMIT
         @property {string} REGISTER_SUCCESS
         @property {string} REGISTER_FAILURE
         @property {string} CART_ADD
         @property {string} CART_REMOVE
         @property {string} CART_UPDATE_QUANTITY
         @property {string} CART_READY
         @property {string} CART_UPDATED
         @property {string} CART_UPDATED_PENDING_PAYMENT
         @property {string} CART_ADD_SUCCESS
         @property {string} CART_PRICE_COMPLETE
         @property {string} REFRESH_USER_CART
         @property {string} REMOVE_INVALID_ITEMS
         @property {string} CART_REMOVE_SUCCESS
         @property {string} CART_UPDATE_QUANTITY_SUCCESS
         @property {string} MINI_CART_SHOW
         @property {string} MINI_CART_HIDE
         @property {string} USER_LOAD_CART
         @property {string} PAGE_VIEW_CHANGED
         @property {string} PAGE_CONTEXT_CHANGED
         @property {string} PAGE_CHANGED
         @property {string} PAGE_READY
         @property {string} PAGE_METADATA_CHANGED
         @property {string} PAGE_LAYOUT_LOADED
         @property {string} PAGE_LAYOUT_SERVER_ERROR
         @property {string} PAGE_PARAMETERS_CHANGED
         @property {string} PAGE_PARAMETERS
         @property {string} PAGE_PAGINATION_CHANGE
         @property {string} PAGE_PAGINATION_CALCULATED
         @property {string} RECORD_PAGINATION_PAGE_CHANGE
         @property {string} UPDATE_HASH_CHANGES
         @property {string} HISTORY_PUSH_STATE
         @property {string} REGION_METADATA_CHANGED
         @property {string} AUTH_LOGIN_SUBMIT
         @property {string} AUTH_LOGIN_SUCCCESS
         @property {string} AUTH_LOGIN_FAILURE
         @property {string} AUTH_LOGOUT_SUBMIT
         @property {string} AUTH_LOGOUT_SUCCESS
         @property {string} AUTH_LOGOUT_FAILURE
         @property {string} AUTH_REQUEST_FAILURE
         @property {string} USER_CREATION_FAILURE
         @property {string} USER_LOGIN_SUCCESSFUL
         @property {string} USER_LOGIN_FAILURE
         @property {string} USER_LOGOUT_SUCCESSFUL
         @property {string} USER_LOGOUT_FAILURE
         @property {string} USER_REGISTRATION_SUBMIT
         @property {string} USER_LOGOUT_SUBMIT
         @property {string} USER_LOGIN_SUBMIT
         @property {string} USER_LOGIN_CANCEL
         @property {string} USER_LOAD_SHIPPING
         @property {string} USER_PROFILE_LOADED
         @property {string} USER_PROFILE_UPDATE_SUCCESSFUL
         @property {string} USER_PROFILE_PASSWORD_UPDATE_SUCCESSFUL
         @property {string} USER_PROFILE_PASSWORD_UPDATE_FAILURE
         @property {string} USER_PROFILE_UPDATE_FAILURE
         @property {string} USER_PROFILE_UPDATE_SUBMIT
         @property {string} USER_PROFILE_UPDATE_CANCEL
         @property {string} USER_PROFILE_UPDATE_INVALID
         @property {string} USER_PROFILE_UPDATE_NOCHANGE
         @property {string} USER_AUTO_LOGIN_SUCCESSFUL
         @property {string} AUTO_LOGIN_AND_GET_USER_DATA_SUCCESSFUL
         @property {string} USER_AUTO_LOGIN_FAILURE
         @property {string} USER_PROFILE_PASSWORD_UPDATE
         @property {string} USER_UNAUTHORIZED
         @property {string} USER_SESSION_EXPIRED
         @property {string} USER_SESSION_VALID
         @property {string} USER_SESSION_RESET
         @property {string} USER_PROFILE_SESSION_RESET
         @property {string} USER_CLEAR_CART
         @property {string} USER_RESET_PASSWORD_FAILURE
         @property {string} USER_RESET_PASSWORD_SUCCESS
         @property {string} USER_PASSWORD_EXPIRED
         @property {string} USER_PASSWORD_GENERATED
         @property {string} USER_NETWORK_ERROR
         @property {string} USER_LOCALE_NOT_SUPPORTED
         @property {string} UPDATE_USER_LOCALE_NOT_SUPPORTED_ERROR
         @property {string} PRODUCT_VIEWED
         @property {string} SKU_SELECTED
         @property {string} UPDATE_FOCUS
         @property {string} UPDATE_LISTING_FOCUS
         @property {string} CHECKOUT_BILLING_ADDRESS
         @property {string} CHECKOUT_SHIPPING_ADDRESS
         @property {string} PAYPAL_CHECKOUT_SHIPPING_ADDRESS
         @property {string} EXTERNAL_CHECKOUT_BILLING_ADDRESS
         @property {string} LOADED_ORDER_SHIPPING_ADDRESS
         @property {string} LOAD_ORDER_RESET_ADDRESS
         @property {string} GET_INITIAL_ORDER_FAIL
         @property {string} CONTINUE_TO_PAYPAL
         @property {string} PAYPAL_EMAIL_VALIDATION
         @property {string} CHECKOUT_SHIPPING_ADDRESS_INVALID
         @property {string} CHECKOUT_SHIPPING_METHOD
         @property {string} PAYPAL_CHECKOUT_SHIPPING_METHOD_VALUE
         @property {string} CHECKOUT_RESET_SHIPPING_METHOD
         @property {string} CHECKOUT_EMAIL_ADDRESS
         @property {string} CHECKOUT_VALIDATE_NOW
         @property {string} CHECKOUT_NOT_VALID
         @property {string} CHECKOUT_PAYMENT_DETAILS
         @property {string} CHECKOUT_REGISTER_USER
         @property {string} CHECKOUT_USER_LOCALE
         @property {string} ORDER_CREATE
         @property {string} ORDER_CREATED
         @property {string} ORDER_CREATED_INITIAL
         @property {string} ORDER_RETRIEVED_INITIAL
         @property {string} ORDER_COMPLETED
         @property {string} ORDER_SUBMISSION_FAIL
         @property {string} ORDER_SUBMISSION_SUCCESS
         @property {string} ORDER_AUTHORIZE_PAYMENT
         @property {string} ORDER_PRICING_FAILED
         @property {string} ORDER_PRICING_SUCCESS
         @property {string} DESTROY_SHIPPING_METHODS_SPINNER
         @property {string} ORDERS_GET_HISTORY_FAILED
         @property {string} POPULATE_SHIPPING_METHODS
         @property {string} PAYMENT_AUTH_SUCCESS
         @property {string} PAYMENT_AUTH_DECLINED
         @property {string} PAYMENT_AUTH_TIMED_OUT
         @property {string} PAYMENT_GET_AUTH_RESPONSE
         @property {string} PAYULATAM_WEB_CHECKOUT
         @property {string} SEARCH_CREATE
         @property {string} SEARCH_CREATE_CATEGORY_LISTING
         @property {string} SEARCH_RESULTS_UPDATED
         @property {string} SEARCH_RESULTS_FOR_CATEGORY_UPDATED
         @property {string} SEARCH_TYPEAHEAD
         @property {string} SEARCH_TYPEAHEAD_UPDATED
         @property {string} SEARCH_TYPEAHEAD_CANCEL
         @property {string} SEARCH_TERM
         @property {string} SEARCH_FAILED_TO_PERFORM
         @property {string} OVERLAYED_GUIDEDNAVIGATION_HIDE
         @property {string} COUPON_ADD_CLEAR_INPUT
         @property {string} ADMIN_CONTENT_LANGUAGE_CHANGED
         @property {string} ADMIN_USER_UPDATE
         @property {string} ADMIN_TOUR_REQUESTED
         @property {string} ADMIN_TOUR_STARTED
         @property {string} ADMIN_TOUR_ENDED
         @property {string} ADMIN_TOUR_CANCELED
         @property {string} ADMIN_AUTH_API_UNAUTHORIZED
         @property {string} ADMIN_AUTH_SSO_REFRESH
         @property {string} ADMIN_AUTH_SSO_SUCCESS
         @property {string} ADMIN_AUTH_SSO_FAILURE
         @property {string} PRODUCT_EDIT
         @property {string} PRODUCT_EDIT_CREATE_PERSIST
         @property {string} PRODUCT_EDIT_CREATE_SUCCESS
         @property {string} PRODUCT_EDIT_CREATE_ERROR
         @property {string} PRODUCT_FILTER_MODE
         @property {string} PRODUCT_VIEW_UPDATE_REQUESTED
         @property {string} PRODUCT_VIEW_UPDATED
         @property {string} PRODUCT_VIEW_CLEAR_DATA
         @property {string} PRODUCT_VIEW_SET_DATA
         @property {string} PRODUCT_PRICE_CHANGED
         @property {string} PRODUCT_SKUS_UPDATED
         @property {string} PRODUCT_LISTING_CONFIGS_UPDATED
         @property {string} CATALOG_VIEW_MODE_CHANGED
         @property {string} COLLECTION_EDIT
         @property {string} COLLECTION_CREATE
         @property {string} COLLECTION_REFRESH_GRID
         @property {string} COLLECTION_EDIT_CREATE_PERSIST
         @property {string} COLLECTION_EDIT_CREATE_SUCCESS
         @property {string} COLLECTION_DELETE_SUCCESS
         @property {string} COLLECTION_EDIT_CREATE_ERROR
         @property {string} COLLECTION_REMOVE_PRODUCT
         @property {string} COLLECTION_REORDER_PRODUCTS
         @property {string} COLLECTION_REORDER_PRODUCTS_SUCCESS
         @property {string} COLLECTION_REORDER_PRODUCTS_ERROR
         @property {string} COLLECTION_RELOAD_PRODUCTLIST
         @property {string} COLLECTION_APPLY_DROPPABLE
         @property {string} PRODUCT_DEFINITION_UPDATE
         @property {string} LOCALE_AWARE_PRODUCT_DEFINITION_UPDATE
         @property {string} PRODUCT_DEFINITION_UPDATE_PROPERTIES
         @property {string} COLLECTION_DEFINITION_UPDATE
         @property {string} PRODUCT_TYPE_EDIT_CREATE_PERSIST
         @property {string} PRODUCT_TYPE_EDIT_CREATE_SUCCESS
         @property {string} PRODUCT_TYPE_EDIT_CREATE_ERROR
         @property {string} PRODUCT_TYPE_UPDATE
         @property {string} PRODUCT_TYPE_MANAGE_UPDATE
         @property {string} INVENTORY_REFRESH
         @property {string} PROMOTION_EDIT
         @property {string} PROMOTION_CLONE
         @property {string} PROMOTION_SELECTION
         @property {string} PROMOTION_LIST_REFRESH
         @property {string} STACKING_RULE_LOAD_CREATE
         @property {string} STACKING_RULE_LIST_REFRESH
         @property {string} LAYOUT_EDIT
         @property {string} LAYOUT_CLONE
         @property {string} LAYOUT_EDIT_CREATE_PERSIST
         @property {string} LAYOUT_EDIT_CREATE_SUCCESS
         @property {string} LAYOUT_EDIT_CREATE_ERROR
         @property {string} LAYOUT_DELETE_SUCCESS
         @property {string} LAYOUT_DEFINITION_UPDATE
         @property {string} LAYOUT_LIST_UPDATE
         @property {string} LAYOUT_LIST_HIDE
         @property {string} LAYOUT_REFRESH_DISPLAY
         @property {string} LAYOUT_REFRESH_COMPLETE
         @property {string} LAYOUT_WIDGET_LOADED
         @property {string} LAYOUT_STACK_LOADED
         @property {string} WIDGET_LAYOUT_EDIT
         @property {string} WIDGET_LIBRARY_HIDE
         @property {string} THEME_UPDATE
         @property {string} CODE_VIEW_MAXIMIZE
         @property {string} CODE_VIEW_MINIMIZE
         @property {string} ORGANIZE_MODE_STATE
         @property {string} STOP_ORGANIZE_MODE
         @property {string} NOTIFICATION_ADD
         @property {string} NOTIFICATION_DELETE
         @property {string} NOTIFICATION_TEMPLATE_ADD
         @property {string} ALL_COLLECTIONS_UPDATED
         @property {string} EXCEPTION_HANDLER
         @property {string} ONERROR_EXCEPTION_HANDLER
         @property {string} LOADING_INDICATOR_ADD
         @property {string} SHIPPING_METHODS_LOADED
         @property {string} LOAD_SHIPPING_METHODS_FAILED
         @property {string} SHIPPING_METHOD_SUCCESS
         @property {string} SHIPPING_METHOD_EDIT
         @property {string} SHIPPING_METHOD_DEFINITION_UPDATE
         @property {string} RELOAD_SHIPPING_METHODS
         @property {string} NO_SHIPPING_METHODS
         @property {string} VERIFY_SHIPPING_METHODS
         @property {string} SHIPPING_REGION_LOADED
         @property {string} SHIPPING_REGION_SUCCESS
         @property {string} SHIPPING_REGION_EDIT
         @property {string} SHIPPING_REGION_DEFINITION_UPDATE
         @property {string} RELOAD_SHIPPING_REGIONS
         @property {string} CATEGORY_GROUP_CHANGED
         @property {string} CATEGORY_UPDATED
         @property {string} CATEGORY_CRUMB_UPDATED
         @property {string} SHOPPINGCART_VALIDATE_NOW
         @property {string} LOAD_CHECKOUT
         @property {string} SOCIAL_SPACE_ADD
         @property {string} SOCIAL_SPACE_ADD_SUCCESS
         @property {string} SOCIAL_SPACE_PRODUCT_REMOVED
         @property {spring} SOCIAL_SPACE_PRODUCT_MOVED
         @property {string} SOCIAL_SPACE_SELECT
         @property {string} SOCIAL_SPACE_UNAVAILABLE
         @property {string} SOCIAL_SPACE_DELETED
         @property {string} SOCIAL_POST_MESSAGE
         @property {string} SOCIAL_SPACE_MEMBER_JOIN
         @property {string} SOCIAL_SPACE_MEMBER_LEFT
         @property {string} SOCIAL_REFRESH_SPACES
         @property {string} SOCIAL_CURRENT_USER
         @property {string} SOCIAL_SPACE_MODEL_MEMBERS_CHANGED
         @property {string} SOCIAL_SPACE_MEMBERS_INFO_CHANGED
         @property {string} RECS_WANT_RECS
         @property {string} RECS_WHO_WANT_RECS
         @property {string} RECS_HAVE_RECS
         @property {string} RECS_RECOMMENDATIONS_CHANGED
         @property {string} ORDER_EDIT_POST_ACTION
         @property {string} ORDER_EDIT_INIT_ACTION
         @property {string} RETURN_CCI18N_RESOURCE_LOADED
         @property {string} SEARCH_SELECTED
         @property {string} LOAD_DEFAULT_CATEGORY
         @property {string} LOCALE_SET
         @property {string} LOCALE_READY
         @property {string} PAGINATION_PAGE_CHANGE
         @property {string} REPORTING_TIMEFRAME_UPDATED
         @property {string} REPORTING_SELECTED_SUMMARY_METRIC
         @property {string} REPORTING_FILTER_CHANGES
         @property {string} REPORTING_DATA_LOADED
         @property {string} REPORTING_MULTIPLE_DAYS_RANGE_SELECTED
         @property {string} REPORTING_SINGLE_DAY_RANGE_SELECTED
         @property {string} REPORTING_APPLIED_USER_SELECTIONS_UPDATED
         @property {string} ITEM_TRIGGER_RECONFIGURE
         @property {string} GWP_QUALIFIED_MESSAGE
         @property {string} GWP_INVALIDATED_MESSAGE
         @property {string} GWP_CLEAR_QUALIFIED_MESSAGE
         @property {string} PLACE_HOLDER_REMOVE
         @property {string} GET_GIFT_CHOICES_SUCCESSFUL
         @property {string} GET_GIFT_CHOICES_FAILURE
         @property {string} GWP_FAILURE_MESSAGE
         @property {string} OVERLAYED_GUIDEDNAVIGATION_CLEAR
         */
        var topicNames = {

            //----------------------------------------
            // Registration
            //----------------------------------------
            REGISTER_SUBMIT : "register.submit",
            REGISTER_SUCCESS : "register.success",
            REGISTER_FAILURE : "register.failure",

            //----------------------------------------
            // Cart
            //----------------------------------------
            CART_ADD : "cart.add",
            CART_REMOVE : "cart.remove",
            CART_UPDATE_QUANTITY : "cart.updatequantity",
            CART_READY : "cart.ready",
            CART_UPDATED : "cart.updated",
            CART_UPDATED_PENDING_PAYMENT : "cart.updated.pendingpayment",
            CART_ADD_SUCCESS : "cart.add.success",
            CART_UPDATE_SUCCESS : "cart.update.success",
            CART_PRICE_COMPLETE : "cart.price.complete",
            REFRESH_USER_CART : "cart.refresh",
            REMOVE_INVALID_ITEMS : "cart.remove.invalid.items",
            CART_REMOVE_SUCCESS : "cart.remove.success",
            CART_UPDATE_QUANTITY_SUCCESS : "cart.updatequantity.success",
            MINI_CART_SHOW : "mini.cart.show",
            MINI_CART_HIDE : "mini.cart.hide",
            USER_LOAD_CART : "user.cart.load",
            CART_ADD_SUCCESS_CPQ : "cart.add.success.cpq",
            //----------------------------------------
            // Routing
            //----------------------------------------
            PAGE_VIEW_CHANGED : "page.view.changed",
            PAGE_CONTEXT_CHANGED : "page.context.changed",
            PAGE_CHANGED : "page.changed.memory",
            PAGE_READY : "page.ready.memory",
            PAGE_METADATA_CHANGED : "page.metadata.changed",
            PAGE_LAYOUT_LOADED : "page.layout.loaded.memory",
            PAGE_LAYOUT_SERVER_ERROR : "page.layout.server.error",
            PAGE_LAYOUT_UPDATED : "page.layout.updated.memory",
            PAGE_PARAMETERS_CHANGED : "page.parameters.changed",
            PAGE_PARAMETERS : "page.parameters.memory",
            PAGE_PAGINATION_CHANGE : "page.pagination.change.memory",
            PAGE_PAGINATION_CALCULATED : "page.pagination.calculated.memory",
            RECORD_PAGINATION_PAGE_CHANGE : "record.pagination.page.changed",
            UPDATE_HASH_CHANGES: "update.hash.changes.memory",
            HISTORY_PUSH_STATE: "history.push.state.memory",
            REGION_METADATA_CHANGED: "region.metadata.changed.memory",
            //----------------------------------------
            // Authentication
            //----------------------------------------
            AUTH_LOGIN_SUBMIT : "auth.login.submit",
            AUTH_LOGIN_SUCCCESS : "auth.login.success",
            AUTH_LOGIN_FAILURE : "auth.login.failure",
            AUTH_LOGOUT_SUBMIT : "auth.logout.submit",
            AUTH_LOGOUT_SUCCESS : "auth.logout.success",
            AUTH_LOGOUT_FAILURE : "auth.logout.failure",
            AUTH_REQUEST_FAILURE : "auth.request.failure",

            //----------------------------------------
            // Storefront Authentication and Login
            //----------------------------------------
            USER_CREATION_FAILURE : "user.creation.failure.memory",
            USER_LOGIN_SUCCESSFUL : "user.login.successful",
            USER_LOGIN_FAILURE : "user.login.failure",
            USER_LOGOUT_SUCCESSFUL : "user.logout.successful",
            USER_LOGOUT_FAILURE : "user.logout.failure",
            USER_REGISTRATION_SUBMIT : "user.registration.submit",
            USER_LOGOUT_SUBMIT : "user.logout.submit",
            USER_LOGIN_SUBMIT : "user.login.submit",
            USER_LOGIN_CANCEL : "user.login.cancel",
            USER_LOAD_SHIPPING : "user.load.shipping",
            USER_PROFILE_LOADED : "user.profile.loaded",
            USER_PROFILE_UPDATE_SUCCESSFUL : "user.profile.update.successful.memory",
            USER_PROFILE_PASSWORD_UPDATE_SUCCESSFUL : "user.profile.pwd.update.successful",
            USER_PROFILE_PASSWORD_UPDATE_FAILURE : "user.profile.pwd.update.failure",
            USER_PROFILE_UPDATE_FAILURE : "user.profile.update.failure.memory",
            USER_PROFILE_UPDATE_SUBMIT : "user.profile.update.submit",
            USER_PROFILE_UPDATE_CANCEL : "user.profile.update.cancel",
            USER_PROFILE_UPDATE_INVALID : "user.profile.update.invalid",
            USER_PROFILE_UPDATE_NOCHANGE : "user.profile.update.nochange",
            USER_PROFILE_ADDRESSES_REMOVED : "user.profile.addresses.removed",
            USER_AUTO_LOGIN_SUCCESSFUL : "user.auto.login.successful",
            AUTO_LOGIN_AND_GET_USER_DATA_SUCCESSFUL : 'auto.login.and.get.user.data.successful',
            USER_AUTO_LOGIN_FAILURE : "user.auto.login.failure.memory",
            USER_PROFILE_PASSWORD_UPDATE : "user.profile.password.update",
            USER_UNAUTHORIZED : "user.unauthorized.memory",
            USER_SESSION_EXPIRED : "user.session.expired.memory",
            USER_SESSION_VALID : "user.session.validated.memory",
            USER_SESSION_RESET : "user.session.reset",
            USER_PROFILE_SESSION_RESET : "user.profile.session.reset",
            USER_CLEAR_CART : "user.clear.cart",
            USER_RESET_PASSWORD_FAILURE: "user.reset.password.failure",
            USER_RESET_PASSWORD_SUCCESS: "user.reset.password.success",
            USER_PASSWORD_EXPIRED: "user.password.expired",
            USER_PASSWORD_GENERATED: "user.password.generated",
            USER_NETWORK_ERROR: "user.network.error",
            USER_LOCALE_NOT_SUPPORTED: "user.locale.not.supported",
            UPDATE_USER_LOCALE_NOT_SUPPORTED_ERROR: "update.user.locale.not.supported.error.memory",
            //----------------------------------------
            // Storefront Browsing
            //----------------------------------------
            PRODUCT_VIEWED : "product.viewed.memory",
            SKU_SELECTED : "sku.selected",
            //----------------------------------------
            // Storefront focus update
            //----------------------------------------
            UPDATE_FOCUS: "update.focus.memory",
            UPDATE_LISTING_FOCUS: "update.listing.focus.memory",

            //----------------------------------------
            // Configuration
            //----------------------------------------
            ITEM_TRIGGER_RECONFIGURE: "item.trigger.reconfigure",

            //----------------------------------------
            // Checkout
            //----------------------------------------
            CHECKOUT_BILLING_ADDRESS : "checkout.billing.address",
            CHECKOUT_SHIPPING_ADDRESS : "checkout.shipping.address",
            CHECKOUT_SHIPPING_ADDRESS_UPDATED : "checkout.shipping.address.updated",
            PAYPAL_SHIPPING_ADDRESS_ALTERED : "paypal.shipping.address.altered",
            ADD_NEW_CHECKOUT_SHIPPING_ADDRESS: "add.new.checkout.shipping.address",
            CART_SHIPPING_ADDRESS_UPDATED : "cart.shipping.address.updated",
            BILLING_ADDRESS_POPULATED : "billing.address.populated.memory",
            SHIPPING_ADDRESS_POPULATED : "shipping.address.populated.memory",
            PAYPAL_CHECKOUT_SHIPPING_ADDRESS : "paypal.checkout_shipping_address",
            EXTERNAL_CHECKOUT_BILLING_ADDRESS : "external.checkout_billing_address",
            LOADED_ORDER_SHIPPING_ADDRESS : "loaded.order.shipping.address.memory",
            GET_INITIAL_ORDER_FAIL : "order.retrieval.fail",
            WEB_CHECKOUT_SHIPPING_ADDRESS : "web.checkout.shipping.address",
            CHECKOUT_SAVE_SHIPPING_ADDRESS : "checkout.save.shipping.address",
            LOAD_ORDER_RESET_ADDRESS : "load.order.reset.address",
            CONTINUE_TO_PAYPAL : "continue.to.paypal",
            PAYPAL_EMAIL_VALIDATION : "paypal.email.validation",
            CHECKOUT_SHIPPING_ADDRESS_INVALID : "checkout.shipping.address.invalid",
            CHECKOUT_SHIPPING_METHOD: "checkout.shipping.method",
            PAYPAL_CHECKOUT_SHIPPING_METHOD_VALUE: "paypal.checkout.shipping.method.value",
            PAYPAL_CHECKOUT_NO_SHIPPING_METHOD: "paypal.checkout.no.shipping.method",
            CHECKOUT_RESET_SHIPPING_METHOD: "checkout.reset.shipping.method",
            CHECKOUT_EMAIL_ADDRESS : "checkout.email.address.memory",
            CHECKOUT_VALIDATE_NOW : "checkout.validate.now",
            CHECKOUT_NOT_VALID : "checkout.not.valid",
            CHECKOUT_PAYMENT_DETAILS : "checkout.payment.details",
            CHECKOUT_REGISTER_USER : "checkout.register.user",
            CHECKOUT_USER_LOCALE : "checkout.user.locale",
            ORDER_CREATE : "order.create",
            ORDER_CREATED : "order.created",
            ORDER_CREATED_INITIAL : "order.created.initial",
            ORDER_RETRIEVED_INITIAL : "order.retrieved.initial",
            ORDER_COMPLETED : "order.completed",
            ORDER_SUBMISSION_FAIL : "order.submission.fail",
            ORDER_SUBMISSION_SUCCESS : "order.submission.success",
            ORDER_AUTHORIZE_PAYMENT : "order.payment.auth.memory",
            ORDER_PRICING_FAILED : "order.pricing.failed",
            ORDER_PRICING_SUCCESS : "order.pricing.success",
            DESTROY_SHIPPING_METHODS_SPINNER : "destroy_shipping_methods_spinner",
            ORDERS_GET_HISTORY_FAILED : "orders.getOrderHistory.failed",
            ORDERS_GET_PENDING_APPROVAL_LIST_FAILED: "orders.getPendingApprovalList.failed",
            POPULATE_SHIPPING_METHODS : "populate.shipping.methods",
            PAYMENT_AUTH_SUCCESS : "payment.auth.success",
            PAYMENT_AUTH_DECLINED : "payment.auth.declined",
            PAYMENT_AUTH_TIMED_OUT : "payment.auth.timedout",
            PAYMENT_GET_AUTH_RESPONSE : "payment.auth.getresponse",
            PAYULATAM_WEB_CHECKOUT : "payulatam.web.checkout",

            //----------------------------------------
            // schedule orders
            //----------------------------------------

            SCHEDULE_ORDERS_LIST_FAILED : "scheduleorders.scheduleOrderList.failed",
            SCHEDULED_ORDER_SUBMISSION_SUCCESS : "scheduledorder.submission.success",
            SCHEDULED_ORDER_LOAD_SCUCCESS : "scheduledorder.load.success",
            SCHEDULED_ORDER_LOAD_ERROR: "scheduledorder.load.error",

            //----------------------------------------
            // Search
            //----------------------------------------
            SEARCH_CREATE: "search.create",
            SEARCH_CREATE_CATEGORY_LISTING: "search.create.listing",
            SEARCH_RESULTS_UPDATED: "search.results.updated.memory",
            SEARCH_RESULTS_FOR_CATEGORY_UPDATED: "search.results.category.updated.memory",
            SEARCH_TYPEAHEAD: "search.typeahead",
            SEARCH_TYPEAHEAD_UPDATED: "search.typeahead.updated",
            SEARCH_TYPEAHEAD_CANCEL: "search.typeahead.cancel",
            SEARCH_TERM: "search.terms.memory",
            SEARCH_FAILED_TO_PERFORM: "search.failed.memory",
            OVERLAYED_GUIDEDNAVIGATION_HIDE: "overlayed.guidednavigation.hide",
            OVERLAYED_GUIDEDNAVIGATION_SHOW: "overlayed.guidednavigation.show",
            OVERLAYED_GUIDEDNAVIGATION_CLEAR: "guidednavigation.clear.memory",

            //----------------------------------------
            // Coupons
            //----------------------------------------
            COUPON_ADD_CLEAR_INPUT: "add.coupon.clearInput",
            COUPON_APPLY_SUCCESSFUL: "add.coupon.successful",
            COUPON_DELETE_SUCCESSFUL: "delete.coupon.successful",

            //----------------------------------------
            // GiftCard
            //----------------------------------------
            GIFTCARD_UPDATE_FROM_CART: "giftcard.updateGiftCards",
            UPDATE_AMOUNT_REMAINING: "giftcard.update.amountRemaining",
            GIFTCARD_PRICING_FAILED : "giftcard.pricing.failed",
            GIFTCARD_REAPPLY_PINS: "giftcard.reapply.pins",
            SHOW_GIFT_CARD_ERROR_PANEL: "giftcard.error.panel",
            UPDATE_AMOUNT_REMAINING_PENDING_PAYMENT: "giftcard.update.amountRemainingPendingPayment",


            //========================================
            // ADMIN TOPICS
            //========================================

            //----------------------------------------
            // Admin Content language selector change event.  Any set of data that
            // needs to be updated when the Content Language changes should subscribe
            // to this event.
            //----------------------------------------
            ADMIN_CONTENT_LANGUAGE_CHANGED: "admin.content.language.changed",

            //----------------------------------------
            // Admin Users (aka Internal Users)
            //----------------------------------------
            ADMIN_USER_UPDATE: "admin.user.update",

            //----------------------------------------
            // Admin Tours
            //----------------------------------------
            ADMIN_TOUR_REQUESTED: "admin.tour.requested",
            ADMIN_TOUR_STARTED: "admin.tour.started",
            ADMIN_TOUR_ENDED: "admin.tour.ended",
            ADMIN_TOUR_CANCELED: "admin.tour.canceled",

            //----------------------------------------
            // Admin SSO Authentication for external APIs.
            //----------------------------------------
            ADMIN_AUTH_API_UNAUTHORIZED: "admin.auth.api-unauthorized",
            ADMIN_AUTH_SSO_REFRESH: "admin.auth.sso-refresh",
            ADMIN_AUTH_SSO_SUCCESS: "admin.auth.sso-refresh-success",
            ADMIN_AUTH_SSO_FAILURE: "admin.auth.sso-refresh-failure",

            //----------------------------------------
            // Catalog Management
            //----------------------------------------
            PRODUCT_EDIT: "catalog.product.edit",
            PRODUCT_EDIT_CREATE_PERSIST: "catalog.product.persist",
            PRODUCT_EDIT_CREATE_SUCCESS: "catalog.product.success",
            PRODUCT_EDIT_CREATE_ERROR: "catalog.product.error",
            PRODUCT_FILTER_MODE: "catalog.product.filter.mode",
            PRODUCT_VIEW_UPDATE_REQUESTED: "catalog.view.updateRequested",
            PRODUCT_VIEW_UPDATED: "catalog.view.updated",
            PRODUCT_VIEW_CLEAR_DATA: "catalog.view.clearData",
            PRODUCT_VIEW_SET_DATA: "catalog.view.setData",
            PRODUCT_PRICE_CHANGED: "product.price.changed",
            PRODUCT_SKUS_UPDATED: "product.skus.updated",
            PRODUCT_LISTING_CONFIGS_UPDATED: "product.listingConfigs.updated",
            CATALOG_VIEW_MODE_CHANGED: "catalog.view.mode.changed",

            COLLECTION_EDIT: "catalog.collection.edit",
            COLLECTION_CREATE: "catalog.collection.create",
            COLLECTION_REFRESH_GRID: "catalog.collection.refresh.grid",
            COLLECTION_EDIT_CREATE_PERSIST: "catalog.collection.persist",
            COLLECTION_EDIT_CREATE_SUCCESS: "catalog.collection.editcreate.success",
            COLLECTION_DELETE_SUCCESS: "catalog.collection.delete.success",
            COLLECTION_EDIT_CREATE_ERROR: "catalog.collection.error",
            COLLECTION_REMOVE_PRODUCT: "catalog.collection.remove.product",
            COLLECTION_REORDER_PRODUCTS: "catalog.collection.reorder.products",
            COLLECTION_REORDER_PRODUCTS_SUCCESS: "catalog.collection.reorder.products.success",
            COLLECTION_REORDER_PRODUCTS_ERROR: "catalog.collection.reorder.products.error",
            COLLECTION_RELOAD_PRODUCTLIST: "catalog.collection.reload.productlist",
            COLLECTION_APPLY_DROPPABLE: "catalog.collection.apply.droppable",

            PRODUCT_DEFINITION_UPDATE: "catalog.product.definition.update",
            LOCALE_AWARE_PRODUCT_DEFINITION_UPDATE: "catalog.product.localeAwareDefinition.update",
            LOCALE_AWARE_SKU_UPDATE: "catalog.product.localeAwareSku.update",
            PRODUCT_DEFINITION_UPDATE_PROPERTIES: "catalog.product.definition.update.properties",
            COLLECTION_DEFINITION_UPDATE: "catalog.collection.definition.update",

            PRODUCT_TYPE_EDIT_CREATE_PERSIST: "product.type.persist",
            PRODUCT_TYPE_EDIT_CREATE_SUCCESS: "product.type.success",
            PRODUCT_TYPE_EDIT_CREATE_ERROR: "product.type.error",
            PRODUCT_TYPE_UPDATE: "product.type.update",
            PRODUCT_TYPE_MANAGE_UPDATE: "product.type.manage.update",
            PRICE_LIST_GROUP_UPDATE: "price.list.group.update",

            //----------------------------------------
            // Accounts/Organizations
            //----------------------------------------
            ACCOUNTS_LIST_REFRESH: "accounts.list.refresh",
            CONTACTS_LIST_REFRESH: "contacts.list.refresh",
            CONTACT_ROLE_CHANGED: "contact.role.changed",
            ACCOUNT_CONTACTS_LIST_REFRESH: "accounts.contacts.list.refresh",
            REFRESH_OVERLAY_FOR_CREATE : "refresh.overlay.for.create",
            REFRESH_OVERLAY_FOR_EDIT : "refresh.overlay.for.edit",

            //----------------------------------------
            // Promotion Management
            //----------------------------------------
            INVENTORY_REFRESH: "inventory.update",

            //----------------------------------------
            // Promotion Management
            //----------------------------------------
            PROMOTION_EDIT: "marketing.promotion.edit",
            PROMOTION_CLONE: "marketing.promotion.clone",
            PROMOTION_SELECTION: "marketing.promotion.selection",
            PROMOTION_LIST_REFRESH: "marketing.promotion.listRefresh",
            PROMOTION_TEMPLATE_EDITOR_HIDE: "marketing.promotion.templateEditorHide",
            PROMOTION_TEMPLATE_EDITOR_SHOW: "marketing.promotion.templateEditorShow",
            PROMOTION_TEMPLATE_EDITOR_CHANGE_VALUE: "marketing.promotion.templateEditorChangeValue",

            //----------------------------------------
            // Stacking Rule
            //----------------------------------------
            STACKING_RULE_LOAD_CREATE: "marketing.stackingRule.loadCreate",
            STACKING_RULE_LIST_REFRESH: "marketing.stackingRule.listRefresh",

            //----------------------------------------
            // Audience Management
            //----------------------------------------
            AUDIENCE_LOAD_CREATE: "marketing.audience.loadCreate",
            AUDIENCE_LIST_REFRESH: "marketing.audience.listRefresh",

            //----------------------------------------
            // Layout Management
            //----------------------------------------
            LAYOUT_EDIT: "sitestudio.layout.edit",
            LAYOUT_CLONE: "sitestudio.layout.clone",
            LAYOUT_EDIT_CREATE_PERSIST: "sitestudio.layout.persist",
            LAYOUT_EDIT_CREATE_SUCCESS: "sitestudio.layout.success",
            LAYOUT_EDIT_CREATE_ERROR: "sitestudio.layout.error",
            LAYOUT_DELETE_SUCCESS: "sitestudio.layout.delete.success",
            LAYOUT_DEFINITION_UPDATE: "sitestudio.layout.definition.update",
            LAYOUT_LIST_UPDATE: "sitestudio.layout.list.update",
            LAYOUT_LIST_HIDE: "sitestudio.layout.list.hide",
            LAYOUT_REFRESH_DISPLAY: "sitestudio.layout.refresh.display",
            LAYOUT_REFRESH_COMPLETE: "sitestudio.layout.refresh.complete",
            LAYOUT_WIDGET_LOADED: "sitestudio.layout.widget.loaded",
            LAYOUT_STACK_LOADED: "sitestudio.layout.stack.loaded",
            LAYOUT_SELECTED: "sitestudio.layout.selected",
            WIDGET_LAYOUT_EDIT : "sitestudio.widget.layout.edit.memory",
            WIDGET_LIBRARY_HIDE : "sitestudio.widget.library.hide",

            //----------------------------------------
            // Theme Management
            //----------------------------------------
            THEME_UPDATE: "sitestudio.theme.update",

            //----------------------------------------
            // Code Management
            //----------------------------------------
            CODE_VIEW_MAXIMIZE: "sitestudio.codeview.maximize",
            CODE_VIEW_MINIMIZE: "sitestudio.codeview.minimize",

            //----------------------------------------
            // Organize Mode
            //----------------------------------------
            ORGANIZE_MODE_STATE: "organize.state",
            STOP_ORGANIZE_MODE: "organize.stop",

            //----------------------------------------
            // Notification Messages
            //----------------------------------------
            NOTIFICATION_ADD: "notification.message.add",
            NOTIFICATION_DELETE: "notification.message.delete",
            NOTIFICATION_TEMPLATE_ADD: "notification.template.add",
            ALL_COLLECTIONS_UPDATED: "catalog.allcollections.updated",

            //Exception handler topics
            EXCEPTION_HANDLER: "exception.handler",
            ONERROR_EXCEPTION_HANDLER: "onerror.exception.handler",

            //----------------------------------------
            // Loading indicator
            //----------------------------------------
            LOADING_INDICATOR_ADD: "loading.indicator.add",

            //--------------------------------------------
            // Shipping method messages
            //--------------------------------------------
            SHIPPING_METHODS_LOADED: "shipping.method.loaded",
            LOAD_SHIPPING_METHODS_FAILED: "load.shipping.methods.failed",
            SHIPPING_METHOD_SUCCESS: "shipping.method.success",
            SHIPPING_METHOD_EDIT: "shipping.method.edit",
            SHIPPING_METHOD_DEFINITION_UPDATE: "shipping.method.definition.update",
            RELOAD_SHIPPING_METHODS: "shipping.method.reload",
            NO_SHIPPING_METHODS: "no.shipping.methods.available",
            VERIFY_SHIPPING_METHODS: "verify.shipping.methods",
            INVALID_SHIPPING_METHOD: "invalid.shipping.method",

            //--------------------------------------------
            // Shipping region messages
            //--------------------------------------------
            SHIPPING_REGION_LOADED: "shipping.region.loaded",
            SHIPPING_REGION_SUCCESS: "shipping.region.success",
            SHIPPING_REGION_EDIT: "shipping.region.edit",
            SHIPPING_REGION_DEFINITION_UPDATE: "shipping.region.definition.update",
            RELOAD_SHIPPING_REGIONS: "shipping.region.reload",

            //--------------------------------------------
            // Category / collection change message
            //--------------------------------------------
            CATEGORY_GROUP_CHANGED: "category.group.changed",
            CATEGORY_UPDATED: "category.updated",
            CATEGORY_CRUMB_UPDATED: "send.category.memory",
            SHOPPINGCART_VALIDATE_NOW : "shoppingcart.validate.now",
            LOAD_CHECKOUT : "redirect.checkout.cart",

            //--------------------------------------------
            // Social
            //--------------------------------------------
            SOCIAL_SPACE_ADD: "social.space.add",
            SOCIAL_SPACE_ADD_TO_SELECTED_SPACE: "social.space.add.selected",
            SOCIAL_SPACE_ADD_SUCCESS: "social.space.add.success",
            SOCIAL_SPACE_SELECTOR_ADD: "social.space.selector.add",
            SOCIAL_SPACE_PRODUCT_REMOVED: "social.space.product.removed",
            SOCIAL_SPACE_PRODUCT_MOVED: "social.space.product.moved",
            SOCIAL_SPACE_SELECT: "social.space.select",
            SOCIAL_SPACE_UNAVAILABLE: "social.space.unavailable",
            SOCIAL_SPACE_DELETED: "social.space.deleted",
            SOCIAL_SPACE_MEMBER_JOIN: "social.space.member.join",
            SOCIAL_SPACE_MEMBER_LEFT: "social.space.member.left",
            SOCIAL_SPACE_MODEL_MEMBERS_CHANGED: "social.space.model.members.changed",
            SOCIAL_SPACE_MEMBERS_INFO_CHANGED: "social.space.member.info.changed",
            SOCIAL_REFRESH_SPACES: "social.refresh.spaces",
            SOCIAL_CURRENT_USER: "social.current.user",
            SOCIAL_POST_MESSAGE: "social.space.post.message",
            SOCIAL_FACEBOOK_JS_READY: "social.facebook.js.ready",

            //--------------------------------------------
            // Recommendation
            //--------------------------------------------
            RECS_WANT_RECS: "recs.display.want.recs.memory",
            RECS_WHO_WANT_RECS: "recs.display.who.want.recs.memory",
            RECS_HAVE_RECS: "recs.display.have.recs.memory",
            RECS_RECOMMENDATIONS_CHANGED: "recs.display.recommendations.changed",

            //--------------------------------------------
            // Agent
            //--------------------------------------------
            ORDER_EDIT_POST_ACTION: "edit.order.post.action",
            ORDER_EDIT_INIT_ACTION: "edit.order.init.action",
            RETURN_CCI18N_RESOURCE_LOADED: "return.cci18n.resource.loaded",
            AGENT_UNSELECT_SHIPPING_METHOD: "shipping.unselect.price.order",

            SEARCH_SELECTED: "search.selected",

            LOAD_DEFAULT_CATEGORY: "load.default.category",

            //--------------------------------------------
            // Locale
            //--------------------------------------------
            LOCALE_SET: "cc.locale.set",
            LOCALE_READY: "cc.locale.ready.memory",
            SUPPORTED_LOCALES_UPDATE: "supported.locales.update",

            //--------------------------------------------
            // Pagination
            //--------------------------------------------
            PAGINATION_PAGE_CHANGE: "pagination.page.change",

            REPORTING_TIMEFRAME_UPDATED: "reporting.timeframe.updated",
            REPORTING_SELECTED_SUMMARY_METRIC: "reporting.selected.summaryMetric",
            REPORTING_FILTER_CHANGES: "reporting.filter.changes.memory",
            REPORTING_DATA_LOADED: "reporting.data.loaded.memory",
            REPORTING_MULTIPLE_DAYS_RANGE_SELECTED: "reporting.validdate.selected",
            REPORTING_SINGLE_DAY_RANGE_SELECTED: "reporting.invaliddate.selected",
            REPORTING_APPLIED_USER_SELECTIONS_UPDATED: "reporting.applied.user.selections.updated",
            REPORTING_CURRENCY_LOADED: "reporting.currency.loaded",
            REPORTING_RESET_FILTERS:"reporting.reset.filters",

            COLLECTION_SELECTION_CHANGED: "collection.selection.changed",

            // Gift With Purchase
            GWP_QUALIFIED_MESSAGE: "gwp.qualified.message",
            GWP_INVALIDATED_MESSAGE: "gwp.invalidated.message",
            GWP_CLEAR_QUALIFIED_MESSAGE: "gwp.clear.qualified.message",
            PLACE_HOLDER_REMOVE: "place.holder.remove",
            GET_GIFT_CHOICES_SUCCESSFUL: "get.gift.choices.successful",
            GET_GIFT_CHOICES_FAILURE: "get.gift.choices.failure",
            GIFT_CHOICES_NOT_AVAILABLE: "gift.choices.not.available",
            GWP_FAILURE_MESSAGE: "gwp.failure.message",

            //--------------------------------------------
            // Guided Search
            //--------------------------------------------
            GUIDED_SEARCH_INDEX_FIELDS_REFRESH: "guided.search.index.fields.refresh",

            //--------------------------------------------
            // Pagination
            //--------------------------------------------
            ADD_PRODUCTS_TAB_TO_PRICE_GROUP: "add.products.tab.to.price.group",
            ADD_NEW_NAVIGATION: "add.new.navigation",
            UPDATE_NAVIGATION: "update.navigation",
            REMOVE_NAVIGATION: "remove.navigation",
            NAVIGATE_TO_INTERCEPTED_LINK: "go.to.intercepted.link",
            SET_IS_NEW_FLAG: "set.is.new.flag",

            DELEGATED_CONTACTS_LIST_FAILED: "delegated.contacts.list.failed",

            //--------------------------------------------
            // Media Helper Event in Account Asset Editor
            //--------------------------------------------
            ACCOUNT_LOGO_ITEM_IMAGE_DELETED: "account.logo.item.image.deleted",

            //--------------------------------------------
            // Contacts Asset Editor Events
            //--------------------------------------------
            DEFAULT_ACCOUNT_MODIFIED: "default.account.modified"

        };

        var centralPubSubImpl = new PubSubImpl();

        /**
         * Map of known topic names to ids for this PubSubImpl.
         * e.g., {WIDGET_ADD: "widget.add", WIDGET_REMOVE: "widget.remove"}
         * Ids with the suffix ".memory" will have memory enabled for the topic.
         */
        centralPubSubImpl.topicNames = topicNames;

        $.Topic = centralPubSubImpl.topic.bind(centralPubSubImpl);

        return centralPubSubImpl;
    });

