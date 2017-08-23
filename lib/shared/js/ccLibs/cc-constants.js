//----------------------------------------
/**
 * Constant values should be defined in this module
 */
define('ccConstants', [],function() {
  "use strict";

  function CCConstants() {
  }

  CCConstants.PRICE_GROUPS_SUCCESS_HASH = "price-groups";
  CCConstants.PRICE_GROUPS_DELETION_INLINE_MESSAGE_ID = "#cc-application-price-group";
  CCConstants.ACTIVE_PRICE_GROUPS_EDIT_PRODUCTS_GROWL = "#cc-active-pricegroup-modal-pane";
  CCConstants.EDIT_PRICE_FOR_A_PRODUCT = "#oj-dialog-body-products-page-growl";
  CCConstants.DEFAULT_FIRST = "defaultFirst";
  CCConstants.PRICE_GRP_ID = "id";
  CCConstants.PRICE_GRP_DISPLAY_NAME = "displayName";
  CCConstants.PRICE_GROUP_DISPLAY_NAME = "priceGroupDisplayName";
  CCConstants.PRICE_GRP_START_DATE = "startDate";
  CCConstants.PRICE_GRP_END_DATE = "endDate";
  CCConstants.PRICE_GRP_LOCALE = "locale";
  CCConstants.ENDPOINT_GET_PRICE_LIST_GROUP = 'getPriceListGroup';
  CCConstants.PENDING_ORDER_APPROVAL="Pending approval";
  CCConstants.APPROVER_MESSAGE="approverMessage";
  CCConstants.IGNORE_PRICE_WARNINGS = "ignorePriceWarnings";
  CCConstants.APPROVERS="approvers";
  CCConstants.ORDER_APPROVED="APPROVED";
  CCConstants.STATE_ORDER_APPROVED="Approved";
  CCConstants.APPROVERS_MESSAGES="approverMessages";
  CCConstants.NO_COMMENTS="none";
  CCConstants.ORDER_DETAILS_PAGE_TYPE="orderDetailsPageType";
  CCConstants.SCHEDULED_ORDER_PAGE_TYPE="scheduledOrderPageType";
  CCConstants.ENDPOINT_APPROVE_ORDER="approveOrder";
  CCConstants.ENDPOINT_REJECT_ORDER="rejectOrder";
  // URL Formatting
  CCConstants.ALLOW_HASHBANG = false;
  // URL tokens
  CCConstants.URL_HASH_SIGN = "#";
  CCConstants.URL_PREPEND_HASH = "!";
  CCConstants.URL_FORWARD_SLASH = "/";
  CCConstants.URL_DOT = ".";
  // Serverside ignored
  CCConstants.URL_SERVERSIDE = "?serverside=true";
  // Site Parameter in URL
  CCConstants.URL_SITE_PARAM = "occsite";

  // Session Storage Data
  CCConstants.SESSION_STORAGE_HISTORY_STACK = "historyStackData";

  // Payment Gateways
  CCConstants.CYBERSOURCE_GATEWAY = "CyberSource";
  CCConstants.CYBERSOURCE_GATEWAY_ID = "CS-A";
  CCConstants.PAYPAL_GATEWAY = "PayPal";
  CCConstants.PAYPAL_GATEWAY_ID = "PP-A";
  CCConstants.GENERIC_PAYMENT_GATEWAY = "Generic";
  CCConstants.CHASE_GATEWAY_CC = "chaseCreditCard";
  CCConstants.CHASE_GATEWAY_GC = "chaseGiftCard";


  CCConstants.PAYMENT_GROUP_ID = "paymentGroupId";
  CCConstants.SOP = "sop";
  CCConstants.REDIRECT = "REDIRECT";
  CCConstants.SUBMITTED = "SUBMITTED";
  CCConstants.TEMPLATE = "TEMPLATE";
  CCConstants.REJECTED = "REJECTED";
  CCConstants.FAILED = "FAILED";
  CCConstants.INCOMPLETE = "INCOMPLETE";
  CCConstants.PENDING_APPROVAL = "PENDING_APPROVAL";
  CCConstants.PENDING_APPROVAL_TEMPLATE = "PENDING_APPROVAL_TEMPLATE";
  CCConstants.FAILED_APPROVAL = "FAILED_APPROVAL";
  CCConstants.FAILED_APPROVAL_TEMPLATE = "FAILED_APPROVAL_TEMPLATE";
  CCConstants.PAYMENT_METHOD_TYPES = "paymentMethodTypes";
  CCConstants.CARD_PAYMENT_TYPE = "card";
  CCConstants.GIFT_CARD_PAYMENT_TYPE = "physicalGiftCard";
  CCConstants.CASH_PAYMENT_TYPE = "cash";
  CCConstants.SELECTED_COUNTRIES = "selectedCountries";
  CCConstants.INVOICE_PAYMENT_TYPE = "invoice";
  CCConstants.INVOICE_PAYMENT_METHOD = "invoiceRequest";
  CCConstants.PONUMBER_MAXIMUM_LENGTH = 50;
  CCConstants.SELECTED_DATES="selectedDates";
  CCConstants.GIFT_CARD_NUMBER_MAX_LENGTH = "giftCardMaxLength";
  CCConstants.GIFT_CARD_PIN_REQUIRED = "giftCardPinRequired";
  CCConstants.GIFT_CARD_PIN_MAX_LENGTH = "giftCardPinMaxLength";

  CCConstants.PAYPAL_PAYMENT_TYPE = "paypalCheckout";
  CCConstants.GENERIC_PAYMENT_TYPE = "generic";

  // jwt token properties
  CCConstants.TOKEN_ROLES_PROPERTY = "com.oracle.atg.cloud.commerce.roles";
  CCConstants.TOKEN_SUBJECT_PROPERTY = "sub";
  CCConstants.TOKEN_PROFILEID_PROPERTY = "occs.admin.profileId";

  CCConstants.UNIQUE_ID = 'uniqueId';
  CCConstants.REPRICE = 'reprice';

  CCConstants.LOCAL_STORAGE_USER_CONTENT_LOCALE = 'occs_user_content_locale';
  CCConstants.LOCAL_STORAGE_CURRENCY = 'occs_currency';
  CCConstants.LOCAL_STORAGE_PRICELISTGROUP_ID = 'occs_pricelistgroup_id';
  CCConstants.LOCAL_STORAGE_ORGANIZATION_ID = 'occs_organization_id'
  CCConstants.LOCAL_STORAGE_AGENT_CONTEXT = 'occs_agent_context';
  CCConstants.LOCAL_STORAGE_DASHBOARD_PRICELISTGROUP_ID = 'occs_dashboard_pricelistgroup_id';
  CCConstants.STORE_PRICELISTGROUP_ID = 'storePriceListGroupId';
  CCConstants.PRICE_LIST_GROUP_ID = 'priceListGroupId';
  CCConstants.AGENT_CONTEXT = 'agentContext';
  CCConstants.LOCAL_STORAGE_PRICELISTGROUP_CHANGED_INDICATOR = 'occs_pricelistgroup_changed';
  CCConstants.LOCAL_STORAGE_LANGUAGE_CHANGED_INDICATOR = 'occs_language_changed';
  CCConstants.LOCAL_STORAGE_SITE_ID = 'occs_site_id';
  CCConstants.SITE_ID_PARAM = 'occsite';

  CCConstants.NOTIFICATION_FADE_DEFAULT = 500;
  CCConstants.NOTIFICATION_DELAY_DEFAULT = 5000;

  CCConstants.WIDGET_CONFIG_MULTI_PROPERTIES_TYPE = "multiProperties";

  CCConstants.MODAL_CLOSE_FOCUS = 'cc-body-focus-target';
  CCConstants.MODAL_CLOSE_FOCUS_CLASS = '.' + CCConstants.MODAL_CLOSE_FOCUS;

  CCConstants.INTEGER_MAX_VALUE = 2147483647;

  CCConstants.RADIX_PARAMETER_DECIMAL = 10;

  CCConstants.CONTAINER_DESIGN_STUDIO = "Design Studio";

  CCConstants.FILTER_KEY = "filterKey";
  CCConstants.ENDPOINT_KEY = 'endpoint';
  CCConstants.PAGE_KEY = 'page';
  CCConstants.IDENTIFIER_KEY = 'identifier';
  CCConstants.LAYOUT_NAME = "layoutName";
  CCConstants.LAYOUTS_RENDERED = "layoutsRendered";
  CCConstants.CATREF_ID = "catRefId";
  CCConstants.SKU_ID = "skuId";
  CCConstants.PRODUCTS_PARAM = "products";

  CCConstants.LAYOUT_CONTAIER_ID = "layout_contaier_id";

  CCConstants.OP = "op";

  CCConstants.PROCESS = "process";
  CCConstants.ACTIVATE = "activate";
  CCConstants.DEACTIVATE = "deactivate";

  // Image source output paramters
  CCConstants.IMAGE_OUTPUT_FORMAT = "outputFormat";
  CCConstants.IMAGE_QUALITY = "quality";
  CCConstants.IMAGE_ALPHA_CHANNEL_COLOR = "alphaChannelColor";

  // Maximum number of items an endpoint can (should) return per request,
  // even if the requested fetch size is larger.
  CCConstants.ENDPOINT_RETURN_LIMIT = 250;

  // Standard fetch size for Cloud Commerce client requests.
  CCConstants.DEFAULT_FETCH_SIZE = 40;

  CCConstants.PRODUCT_TYPE_IDS = "productTypeIds";
  CCConstants.PRODUCT_TYPE_ID = "productTypeId";
  CCConstants.PRODUCT_ID = "productId";
  CCConstants.PRODUCT_IDS = "productIds";
  CCConstants.SKU_INFO = "children";
  CCConstants.SKU_IDS = "skuIds";
  CCConstants.CATEGORY_IDS = "categoryIds";
  CCConstants.CATALOG_IDS = "catalogIds";
  CCConstants.COLLECTION_IDS = "collectionIds";
  CCConstants.INCLUDE_HISTORICAL = "includeHistorical";
  CCConstants.INCLUDE_CKILD_SKUS_LISTING_IDS = "includeChildSKUsListingIds";
  CCConstants.IN_STOCK = "IN_STOCK";
  CCConstants.OUT_OF_STOCK = "OUT_OF_STOCK";
  CCConstants.PARENT_PRODUCTS = "parentProducts";

  // Product add to cart error codes
  CCConstants.PRODUCT_ADD_TO_CART_GET_SKU_ERROR = "2001";
  CCConstants.PRODUCT_ADD_TO_CART_INVENTORY_ERROR = "2002";
  CCConstants.PRODUCT_ADD_TO_CART_OUT_OF_STOCK = "2003";
  CCConstants.PRODUCT_ADD_TO_CART_PRICING_ERROR = "2004";

  CCConstants.PROMOTION_ID = "promotionId";
  CCConstants.PATH = "path";
  CCConstants.CLAIMABLE_USE_MAXUSES = "useMaxUses";

  //promotion type ahead changes
  CCConstants.REPORT_OFFSET_VALUE = 0;
  CCConstants.REPORT_LIMIT_VALUE=40;

  CCConstants.COLLECTIONS = "collections";
  CCConstants.COLLECTION_TYPES = "collectionTypes";
  CCConstants.CATEGORY_TYPES = "categoryTypes";
  CCConstants.ROOT_CATEGORY = "rootCategory";
  CCConstants.NON_NAVIGABLE_CATEGORY = "nonNavigableCategory";
  CCConstants.CATEGORY_PATHS = "categoryPaths";
  CCConstants.ALL_CATEGORIES = "All Categories";
  CCConstants.COLLECTIONID_FOR_ALL_COLLECTIONS = "0";
  CCConstants.COLLECTIONID_FOR_UNASSIGNED_PRODUCTS = "2";
  CCConstants.COLLECTIONID_FOR_DELETED_PRODUCTS = "3";
  CCConstants.PRODUCT_NAME = "productName";

  CCConstants.START_INDEX = "startingIndex";
  CCConstants.END_INDEX = "endingIndex";
  CCConstants.INCL_CHILDREN = "includeChildren";
  CCConstants.OFFSET = "offset";
  CCConstants.LIMIT = "limit";
  CCConstants.REQUIRE_COUNT = "requireCount";
  CCConstants.TOTAL_RESULTS = "totalResults";
  CCConstants.TOTAL_EXPANDED_RESULTS = "totalExpandedResults";
  CCConstants.COUNT_ONLY = "countOnly";

  CCConstants.DYNAMIC_ONLY = "dynamicOnly";
  CCConstants.INCLUDE_BASE = "includeBase";

  CCConstants.SHOW_HIDDEN = "showHidden";
  CCConstants.HIDE_SINGLE_CURRENCY_PRICES = "hideSingleCurrencyPrices";
  CCConstants.CONTINUE_ON_MISSING_PRODUCT = "continueOnMissingProduct";
  CCConstants.CONTINUE_ON_MISSING_CATEGORY= "continueOnMissingCategory";

  CCConstants.CATALOG = "catalogId";
  CCConstants.CATEGORY = "categoryId";
  CCConstants.DEPTH = "depth";
  CCConstants.EXPAND = "expand";
  CCConstants.UNASSIGNED = "unassigned";
  CCConstants.SHOW_QUANTITY = "showQuantity";

  CCConstants.COMBINE_YES = "yes";
  CCConstants.COMBINE_NO = "no";

  CCConstants.SORTS = "sort";
  CCConstants.SORTBYCODE = "sortByCode";
  CCConstants.SECONDARY_ORG_COUNT = "includeSecondaryOrganizationsCount";
  CCConstants.COUNTRY = "country";
  CCConstants.REGIONS = "regions";

  CCConstants.PROPERTIES = "properties";
  CCConstants.ORDERED = "ordered";

  CCConstants.COLLECTION_ID = "id";
  CCConstants.COLLECTION_PRODUCT_ID = "productId";
  CCConstants.DISPLAY_NAME = "displayName";
  CCConstants.PRODUCT_DISPLAY_NAME = "productDisplayName";
  CCConstants.NAME = "name";
  CCConstants.FULL_LOAD = "fullLoad";

  CCConstants.SIZE = "size";
  CCConstants.LAST_MODIFIED = "lastModified";
  CCConstants.EXTENSION = "extension";
  CCConstants.EMPTY_FILE = "ZERO_LENGTH_FILE";

  CCConstants.ASCENDING = "asc";
  CCConstants.DESCENDING = "desc";

  CCConstants.UPDATE_OP = "update";
  CCConstants.CREATE_OP = "create";

  CCConstants.PARENT_COLLECTION_ID = "parentCategoryId";

  CCConstants.PROTECTED_COOKIES = ['JSESSIONID', 'atgRecSessionId', 'atgRecVisitorId'];

  CCConstants.CHECKOUT = "checkout";
  CCConstants.PAYPAL_CHECKOUT_TYPE = "paypalCheckout";
  CCConstants.PAYMENT_GROUP_STATE_INITIAL = "initial";
  CCConstants.PAYPAL_PLACE_ORDER_ERROR = "paypal.place.order.error";
  CCConstants.PAYER_ID = "PayerID";
  CCConstants.TOKEN = "token";
  CCConstants.PAYMENT_ID = "paymentId";
  CCConstants.PERSISTENT = "persistent";
  CCConstants.PAGE_PARAM = "pageParam";
  CCConstants.DATA_ONLY = "dataOnly";
  CCConstants.DISABLE_MINIFY = "disableMinify";
  CCConstants.PAYULATAM_CHECKOUT_TYPE = "payULatamWebcheckout";
  CCConstants.PAYULATAM_CHECKOUT_REGISTRATION = "payULatamWebcheckoutRegistration";
  CCConstants.PAYULATAM_CHECKOUT_REGISTRATION_SUCCESS = "payURegSuccess";
  CCConstants.PAYULATAM_CHECKOUT_REGISTRATION_FAILURE = "payURegFail";
  CCConstants.PAYULATAM_RESPONSE_TYPE = "response";
  CCConstants.TRANSACTION_STATUS = "transactionStatus";
  CCConstants.TRANSACTION_TYPE = "transactionType";
  CCConstants.SIGNATURE = "signature";
  CCConstants.PAYU_REFERENCE_POL = "reference_pol";
  CCConstants.PAYU_TRANSACTION_STATE = "transactionState";
  CCConstants.PAYU_TX_VALUE = "TX_VALUE";
  CCConstants.PAYU_REFERENCE_CODE = "referenceCode";
  CCConstants.PAYU_TRANSACTION_APPROVED = "APPROVED";
  CCConstants.PAYU_TRANSACTION_PENDING = "PENDING";
  CCConstants.PAYU_TRANSACTION_DECLINED = "DECLINED";
  CCConstants.PAYU_TRANSACTION_EXPIRED = "EXPIRED";
  CCConstants.PAYU_TRANSACTION_ERROR = "ERROR";
  CCConstants.PAYU_TRANSACTION_APPROVED_CODE = "4";
  CCConstants.PAYU_TRANSACTION_PENDING_CODE = "7";
  CCConstants.PAYU_TRANSACTION_DECLINED_CODE = "6";
  CCConstants.PAYU_TRANSACTION_EXPIRED_CODE = "5";
  CCConstants.PAYU_TRANSACTION_ERROR_CODE = "104";
  CCConstants.PAYU_SIGNATURE_ALGORITHM = "SHA";
  CCConstants.PENDING_PAYMENT = "PENDING_PAYMENT";
  
  CCConstants.ENV_PRODUCTION = "production";
  CCConstants.REDIRECTED_TO_WEB_PAYMENT = "redirectedToWebPayment";

  CCConstants.GUEST = "guest";
  CCConstants.LOGIN = "login";

  CCConstants.PASSWORD_EXPIRED = "password_expired";
  CCConstants.PASSWORD_GENERATED = "password_generated";

  CCConstants.UNITED_STATES = "US";
  CCConstants.CANADA = "CA";
  CCConstants.ALABAMA = "al";
  CCConstants.ALABAMA_DISPLAY = "Alabama";
  CCConstants.WISCONSIN = "wi";
  CCConstants.WISCONSIN_DISPLAY = "Wisconsin";
  CCConstants.WYOMING = "wy";
  CCConstants.WYOMING_DISPLAY = "Wyoming";
  CCConstants.MASSACHUSETTS = "ma";
  CCConstants.MASSACHUSETTS_DISPLAY = "Massachusetts";
  CCConstants.NEWYORK = "ny";
  CCConstants.NEWYORK_DISPLAY = "New York";
  CCConstants.ALBERTA = "al";
  CCConstants.ALBERTA_DISPLAY = "Alberta";
  CCConstants.ALASKA = "ak";
  CCConstants.ALASKA_DISPLAY = "Alaska";
  CCConstants.BRITISHCOLUMBIA = "bc";
  CCConstants.BRITISHCOLUMBIA_DISPLAY = "British Columbia";
  CCConstants.SASKATCHEWAN = "sa";
  CCConstants.SASKATCHEWAN_DISPLAY = "Saskatchewan";
  CCConstants.YUKON = "yu";
  CCConstants.YUKON_DISPLAY = "Yukon";

  CCConstants.FROM_PARENT = "fromParent";
  CCConstants.CHILD = "child";
  CCConstants.PARENT = "parent";
  CCConstants.INDEX = "index";

  CCConstants.CATALOG_MAX_LEVEL = 3;
  CCConstants.CATALOG_MAXLEVEL_PARAM = "maxLevel";

  CCConstants.PROFILE_TYPE_ADMIN = "adminUI";
  CCConstants.PROFILE_TYPE_STOREFRONT = "storefrontUI";
  CCConstants.PROFILE_TYPE_PREVIEW = "preview";
  CCConstants.PROFILE_TYPE_LAYOUT_PREVIEW = "layoutPreview";

  CCConstants.GATEWAY_NAME = "gatewayName";
  CCConstants.SITE_ID = "siteId";

  CCConstants.KEY_CODE_ENTER = 13;       // Enter key
  CCConstants.KEY_CODE_SPACE = 32;       // Space bar
  CCConstants.KEY_CODE_TAB = 9;          // Tab key
  CCConstants.KEY_CODE_LEFT_ARROW = 37;  // left arrow
  CCConstants.KEY_CODE_UP_ARROW = 38;    // Up arrow
  CCConstants.KEY_CODE_RIGHT_ARROW = 39; // right arrow
  CCConstants.KEY_CODE_DOWN_ARROW = 40;  // Down arrow
  CCConstants.KEY_CODE_ESCAPE = 27;      // Escape key
  CCConstants.KEY_CODE_DELETE = 46;      // Delete key
  CCConstants.KEY_CODE_BACKSPACE = 8;    // Backspace key
  CCConstants.KEY_CODE_C = 67;           // C key
  CCConstants.KEY_CODE_SHIFT_TAB = 223;  // Shift + Tab Key
  CCConstants.KEY_CODE_BACKTICK = 192;  // Shift + Tab Key

  CCConstants.TOKEN_REFRESH_INTERVAL = 30000; //this is the polling interval to refresh the token and should be same as the value configured in OAuthService.TOKEN_REFRESH_INTERVAL
  CCConstants.TOKEN_WARNING_TIMEOUT = (13 * 60000) + CCConstants.TOKEN_REFRESH_INTERVAL;
                                                  // this is the time before we warn the user their session is about to expire
                                                  // 2 minutes less than the 15 minutes configured in ShopperPoliciesService.properties,
                                                  // plus 1 * TOKEN_REFRESH_INTERVAL
  CCConstants.TOKEN_EXPIRED_MESSAGE_TIMEOUT = 2 * 60000; // this is the remainder of the session timeout, before we expire the session
  CCConstants.GS_TOKEN_TIMEOUT = 15 * 60000;
  CCConstants.HTTP_UNAUTHORIZED_ERROR = "401";
  CCConstants.HTTP_PRECONDITION_FAILED_ERROR = "412";
  CCConstants.CHECKOUT_SESSION_EXPIRED = "checkoutSessionExpired";
  CCConstants.CHECKOUT_SESSION_EXPIRED_ERROR = "28317";

  // Parameter constants for routing
  CCConstants.PARAMETERS_TYPE = "type";
  CCConstants.PARAMETERS_SEARCH_QUERY = "search";

  CCConstants.DEFAULT_SEARCH_RECORDS_PER_PAGE = 12;  //
  CCConstants.DEFAULT_ROOT_NAVIGATION = 0;  // Root navigation value
  CCConstants.SEARCH_TERM_KEY = "Ntt";
  CCConstants.SEARCH_DYM_SPELL_CORRECTION_KEY = "Nty";
  CCConstants.SEARCH_OPTIONS_KEY = "Ntx";
  CCConstants.SEARCH_NAV_EREC_SEARCHES_KEY = "Ntk";
  CCConstants.SEARCH_REC_PER_PAGE_KEY = "Nrpp";
  CCConstants.SEARCH_RANDOM_KEY = "Rdm";
  CCConstants.SEARCH_SUPPRESS_RESULTS = "suppressResults";

  CCConstants.ORDERS_COUNT = "ordersCount";
  CCConstants.RETURNS_COUNT = "returnsCount";
  CCConstants.REPORT_CHART_ORDERS = "chartOrders";
  CCConstants.REPORT_CHART_ORDERS = "chartOrders";
  CCConstants.REPORT_CHART_RETURNS = "chartReturns";
  CCConstants.REPORT_TABLE_RECENT_ORDERS = "recentOrders";
  CCConstants.REPORT_TABLE_RECENT_ORDERS = "recentOrders";
  CCConstants.REPORT_TABLE_MY_PENDING_ACTIONS = "myPendingActions";

  CCConstants.SEARCH_NAV_DESCRIPTORS_KEY = "N";
  CCConstants.SEARCH_NAV_AGGR_ERECS_OFFSET = "Nao";
  CCConstants.SEARCH_NAV_ERECS_OFFSET = "No";
  CCConstants.SEARCH_NAV_RECORD_FILTER_KEY = "Nr";

  CCConstants.SEARCH_MESSAGE_FAIL = "fail";
  CCConstants.SEARCH_MESSAGE_SUCCESS = "success";
  CCConstants.SEARCH_SORT_ORDER = "Ns";
  CCConstants.SEARCH_WILDCARD = "*";
  CCConstants.SEARCH_RESULTS_HASH = "/searchresults";

  CCConstants.GUIDED_NAVIGATION_CATEGORY = "product.category";
  CCConstants.GUIDED_NAVIGATION_PRICERANGE = "product.priceRange";

  CCConstants.SEARCH_PROPERTY_SEPARATOR = "|";
  CCConstants.SEARCH_COLON_SEPERATOR = ":";
  CCConstants.PRODUCT_DISPLAYABLE = "1";
  CCConstants.DYM_ENABLED = "1";
  CCConstants.PRODUCT_DISPLAYABLE_PROPERTY = "product.active";

  //CCConstants.CYBERSOURCE_GATEWAY_NAME = "cybersource";
  CCConstants.CYBERSOURCE_ALIAS_MAXIMUM_LENGTH = 60;
  CCConstants.CYBERSOURCE_FIRSTNAME_MAXIMUM_LENGTH = 60;
  CCConstants.CYBERSOURCE_LASTNAME_MAXIMUM_LENGTH = 60;
  CCConstants.CYBERSOURCE_ADDRESS_MAXIMUM_LENGTH = 60;
  CCConstants.CYBERSOURCE_CITY_MAXIMUM_LENGTH = 50;
  CCConstants.CYBERSOURCE_PHONE_NUMBER_MAXIMUM_LENGTH = 15;
  CCConstants.CYBERSOURCE_EMAIL_MAXIMUM_LENGTH = 255;
  CCConstants.CYBERSOURCE_CARD_NUMBER_MAXIMUM_LENGTH = 20;
  CCConstants.CYBERSOURCE_POSTAL_CODE_MAXIMUM_LENGTH = 10;

  //ASA Settings Admin Constants
  CCConstants.DASHBOARD_COLLECTION_TYPE = "categorySelector";
  CCConstants.DASHBOARD_PROMOTIONTEXT_TYPE = "promotionalText";
  CCConstants.DASHBOARD_MEDIAPICKER_TYPE = "mediaPicker";
  CCConstants.DASHBOARD_LOGO_ID = "asaCompanyLogo";
  CCConstants.DASHBOARD_HEROIMAGE_ID = "asaHeroImage";
  CCConstants.DASHBOARD_BACKGROUNDIMAGE_ID = "asaBackgroundImage";
  CCConstants.DASHBOARD_COLLECTION_ID = "asaDashBoardCollection";
  CCConstants.DASHBOARD_PROMOTIONTEXT_ID = "asaPromotionalText";
  CCConstants.DASHBOARD_COLLECTION_KEY = "collectionForFeaturedProductsId";
  CCConstants.DASHBOARD_PROMOTIONTEXT_KEY = "dashboardPromotionalText";
  CCConstants.DASHBOARD_LOGO_KEY = "companyLogo";
  CCConstants.DASHBOARD_HEROIMAGE_KEY = "heroImage";
  CCConstants.DASHBOARD_BACKGROUNDIMAGE_KEY = "backgroundImage";
  CCConstants.ONLY_ACTIVE_COLLECTIONS = "onlyActive";

  CCConstants.DPP_EXTERNAL_PROPERTY_KEY = "isExternalProfilePropertiesDisplayEnabled";
  CCConstants.DPP_INTERNAL_PROPERTY_KEY = "isInternalProfilePropertiesDisplayEnabled";


  // Notifications constants. Constants used to show which templates to use in
  // the notification instead of a simple text.
  CCConstants.NOTIFICATION_ADD_TO_CART_SUCCESS = "notification-add-to-cart-success";

  // Endpoint Ids
  //B2B administration
  CCConstants.ENDPOINT_B2B_ADMINISTRATION_LIST_ADDRESSES = "listAddresses"
  CCConstants.ENDPOINT_B2B_ADMINISTRATION_GET_ORGANIZATION = "getOrganization";
  CCConstants.ENDPOINT_B2B_ADMINISTRATION_CREATE_ORGANIZATION = "createOrganization";
  CCConstants.ENDPOINT_B2B_ADMINISTRATION_UPDATE_ORGANIZATION = "updateOrganization";
  CCConstants.ENDPOINT_B2B_ADMINISTRATION_LIST_ORGANIZATIONS = "listOrganizations";
  
  CCConstants.ENDPOINT_B2B_ADMINISTRATION_GET_CONTACT = "getProfile";
  CCConstants.ENDPOINT_B2B_ADMINISTRATION_CREATE_CONTACT = "createProfile";
  CCConstants.ENDPOINT_B2B_ADMINISTRATION_UPDATE_CONTACT = "updateProfile";
  CCConstants.ENDPOINT_B2B_ADMINISTRATION_LIST_PROFILE = "listProfiles";

  CCConstants.B2B_PROFILE_TYPE = "b2b_user";
  CCConstants.IS_B2B_ENABLED = "isB2BEnabled";

  // Sites
  CCConstants.ENDPOINT_SITES_GET_SITE = "getSite";
  CCConstants.ENDPOINT_SITES_UPDATE_SITE = "updateSite";
  CCConstants.ENDPOINT_SITES_GET_SITES = "getSites";

  // Layouts for Design Studio
  CCConstants.ENDPOINT_LAYOUTS_LIST_LAYOUTS  = "listLayouts";
  CCConstants.ENDPOINT_LAYOUTS_GET_LAYOUT    = "getLayout";
  CCConstants.ENDPOINT_LAYOUTS_CREATE_LAYOUT = "createLayout";
  CCConstants.ENDPOINT_LAYOUTS_UPDATE_LAYOUT = "updateLayout";
  CCConstants.ENDPOINT_LAYOUTS_DELETE_LAYOUT = "deleteLayout";
  CCConstants.ENDPOINT_LAYOUTS_CLONE_LAYOUT = "cloneLayout";

  // Locales
  CCConstants.ENDPOINT_LOCALES_LIST_LOCALES  = "listLocales";
  CCConstants.ENDPOINT_LOCALES_CONTENT_LOCALES  = "contentLocales";
  CCConstants.ENDPOINT_LOCALES_GET_DEFAULT_LOCALE = "getDefaultLocale";
  CCConstants.ENDPOINT_LOCALES_UPDATE_DEFAULT_LOCALE = "updateDefaultLocale";

  // Themes for Design Studio
  CCConstants.ENDPOINT_THEMES_LIST_THEMES  = "getThemes";
  CCConstants.ENDPOINT_THEMES_GET_THEME  = "getTheme";
  CCConstants.ENDPOINT_THEMES_GET_ACTIVE_THEME  = "getActiveTheme";
  CCConstants.ENDPOINT_THEMES_SET_ACTIVE_THEME  = "setActiveTheme";
  CCConstants.ENDPOINT_THEMES_RECOMPILE_ACTIVE_THEME  = "recompileActiveTheme";
  CCConstants.ENDPOINT_THEMES_CLONE_THEME  = "cloneTheme";
  CCConstants.ENDPOINT_THEMES_DELETE_THEME  = "deleteTheme";
  CCConstants.ENDPOINT_THEMES_UPDATE_THEME  = "updateTheme";
  CCConstants.ENDPOINT_THEMES_GET_TYPOGRAPHY_DETAILS = "getThemeTypographyStyles";
  CCConstants.ENDPOINT_THEMES_UPDATE_TYPOGRAPHY_DETAILS = "updateThemeTypographyStyles";
  CCConstants.ENDPOINT_THEME_UPDATE_THEME_IMAGE = "updateThemeImage";
  CCConstants.ENDPOINT_THEME_GET_THEME_IMAGE_PATH = "getThemeImagePath";
  CCConstants.ENDPOINT_THEME_IMAGE_DIRECTORY = "/media/sitestudio/";
  CCConstants.ENDPOINT_THEMES_GET_THEME_SOURCE  = "getThemeSource";
  CCConstants.ENDPOINT_THEMES_UPDATE_THEME_SOURCE = "updateThemeSource";
  CCConstants.ENDPOINT_THEMES_RESTORE_THEME_SOURCE = "restoreThemeSource";
  CCConstants.UPLOAD_NEW_FOLDER_PATH = "general/";
  CCConstants.THEME_BACKGROUND_SITE_ID = "Site-cc-theme-background-media-show";
  CCConstants.THEME_BACKGROUND_HEADER_TOP_ID = "HeaderTop-cc-theme-background-media-show";
  CCConstants.THEME_BACKGROUND_HEADER_ID = "Header-cc-theme-background-media-show";
  CCConstants.THEME_BACKGROUND_FOOTER_ID = "Footer-cc-theme-background-media-show";
  CCConstants.THEME_BACKGROUND_MEDIA_ID = "-cc-theme-background-media-show";
  CCConstants.PAGINATION_CLASS_NAME = ".cc-pagination-angle";
  CCConstants.THEME_COMPILE_ERROR_CODE = "70025";
  CCConstants.THEME_LESS_FILE_NOT_FOUND_ERROR_CODE = "20307";

  CCConstants.ENDPOINT_EXTENSIONS_UPLOAD_EXTENSIONS = "/extensions/";
  CCConstants.ENDPOINT_EXTENSIONS_PROCESS_EXTENSION = "processExtension";
  CCConstants.ENDPOINT_EXTENSIONS_CREATE_EXTENSION = "createExtension";
  CCConstants.ENDPOINT_EXTENSIONS_GET_EXTENSIONS = "getAllExtensions";
  CCConstants.ENDPOINT_EXTENSIONS_GET_EXTENSION_IDS = "getApplicationIDs";
  CCConstants.ENDPOINT_EXTENSIONS_GET_APPLICATION_ID = "getApplicationID";
  CCConstants.ENDPOINT_EXTENSIONS_CREATE_EXTENSION_ID = "createApplicationID";
  CCConstants.ENDPOINT_EXTENSIONS_UPDATE_EXTENSION_ID = "updateApplicationID";
  CCConstants.ENDPOINT_EXTENSIONS_DELETE_EXTENSION_ID = "deleteApplicationID";
  CCConstants.ENDPOINT_APPLICATIONS_ADD_ID_OPERATION = "appIdOperation";
  CCConstants.ENDPOINT_EXTENSIONS_DEACTIVATE_EXTENSION = "deactivateExtension";
  CCConstants.ENDPOINT_EXTENSIONS_ACTIVATE_EXTENSION = "activateExtension";
  CCConstants.ENDPOINT_EXTENSIONS_DELETE_EXTENSION = "deleteExtension";
  CCConstants.ENDPOINT_APPLICATION_IDS_EXTENSION_TYPE = "extension";
  CCConstants.ENDPOINT_APPLICATION_IDS_APPLICATION_TYPE = "application";
  CCConstants.ENDPOINT_APPLICATION_IDS_GETAUTHTOKEN = "genAuthToken";
  CCConstants.ENDPOINT_SSO_GET_TOKEN = 'getSSOToken';
  CCConstants.ENDPOINT_SSO_REFRESH_TOKEN = 'refreshSSOToken';

  //endpoint for agent reports
  CCConstants.ENDPOINT_GET_AGENT_REPORT = "getReport";

  // Templates for Design Studio pages/widgets/etc.
  CCConstants.DESIGN_STUDIO_TEMPLATES = "templates/configSettings";
  CCConstants.DESIGN_STUDIO_ELEMENT_TEMPLATES = "templates/pages/controls";

  CCConstants.ENDPOINT_GET_BLOG_ENTRIES = "listBlogEntries";

  CCConstants.ENDPOINT_WIDGETS_LIST_WIDGETS  = "listWidgets";
  CCConstants.ENDPOINT_WIDGETS_CREATE_WIDGET = "createWidgetInstance";
  CCConstants.ENDPOINT_WIDGETS_CLONE_WIDGET = "cloneWidgetInstance";
  CCConstants.ENDPOINT_WIDGETS_GET_WIDGET    = "getWidget";
  CCConstants.ENDPOINT_WIDGETS_UPDATE_WIDGET = "updateWidget";
  CCConstants.ENDPOINT_WIDGETS_GET_LAYOUT_SOURCE = "getWidgetLayoutSource";
  CCConstants.ENDPOINT_WIDGETS_GET_SOURCE_CODE = "getWidgetSourceCode";
  CCConstants.ENDPOINT_WIDGETS_UPDATE_SOURCE_CODE = "updateWidgetSourceCode";
  CCConstants.ENDPOINT_WIDGETS_RESTORE_SOURCE_CODE = "restoreWidgetSourceCode";
  CCConstants.ENDPOINT_WIDGETS_GET_WIDGET_LOCALE_CONTENT = "getWidgetLocaleContent";
  CCConstants.ENDPOINT_WIDGETS_UPDATE_WIDGET_CUSTOM_TRANSLATIONS = "updateWidgetCustomTranslations";

  CCConstants.ENDPOINT_WIDGETDESCRIPTORS_GET_INSTANCES = "getAllWidgetInstances";
  CCConstants.ENDPOINT_WIDGET_DESCRIPTOR_CONFIG = "getConfigDefinitionForWidgetDescriptor";
  CCConstants.ENDPOINT_WIDGET_DESCRIPTOR_JAVASCRIPT = "getWidgetDescriptorJavascriptInfoById";
  CCConstants.ENDPOINT_WIDGET_DESCRIPTOR_UPDATE_JAVASCRIPT = "updateWidgetDescriptorJavascript";
  CCConstants.ENDPOINT_WIDGET_DESCRIPTOR_UPDATE_HIDDEN_FLAG = "updateHiddenWidgetTypes";
  CCConstants.ENDPOINT_WIDGET_DESCRIPTOR_RESTORE_ALL_JAVASCRIPT = "restoreAllWidgetDescriptorJavascript";

  CCConstants.ENDPOINT_LAYOUT_GET_STRUCTURE = "getLayoutStructure";
  CCConstants.ENDPOINT_LAYOUT_SAVE_STRUCTURE = "saveLayoutStructure";

  CCConstants.ENDPOINT_WIDGETS_DESCRIPTORS = "getAllWidgetDescriptors";
  CCConstants.ENDPOINT_WIDGETS_DESC_BY_PAGE_TYPE = "getAllWidgetDescriptorsByPageType";
  CCConstants.ENDPOINT_WIDGETS_DESC_INSTANCES = "getInstancesForWidgetDescriptor";

  CCConstants.ENDPOINT_SLOTS_DESC_BY_PAGE_TYPE = "getAllSlotDescriptors";

  CCConstants.ENDPOINT_STACKS_DESCRIPTORS = "getAllStackDescriptors";
  CCConstants.ENDPOINT_STACKS_DESCRIPTORS_GET_INSTANCES = "getAllStackInstances";
  CCConstants.ENDPOINT_STACKS_DESC_BY_PAGE_TYPE = "getAllStackDescriptorsByPageType";
  CCConstants.ENDPOINT_STACK_DESCRIPTOR_CONFIG = "getConfigDefinitionForStackDescriptor";
  CCConstants.ENDPOINT_STACK_DESCRIPTOR_UPDATE_HIDDEN_FLAG = "updateHiddenStackTypes";

  CCConstants.ENDPOINT_STACKS_GET_STACK   = "getStack";
  CCConstants.ENDPOINT_STACKS_LIST_STACKS  = "listStacks";
  CCConstants.ENDPOINT_STACKS_UPDATE_STACK = "updateStack";

  CCConstants.ENDPOINT_SLOTS_GET_SLOT   = "getSlot";
  CCConstants.ENDPOINT_SLOTS_UPDATE_SLOT = "updateSlot";

  CCConstants.ENDPOINT_STACKS_GET_SOURCE_CODE = "getStackSourceCode";
  CCConstants.ENDPOINT_STACKS_UPDATE_SOURCE_CODE = "updateStackSourceCode";
  CCConstants.ENDPOINT_STACKS_RESTORE_SOURCE_CODE = "restoreStackSourceCode";

  CCConstants.ENDPOINT_STACKS_GET_LESS = "getStackLess";
  CCConstants.ENDPOINT_STACKS_UPDATE_LESS = "updateStackLess";

  CCConstants.ENDPOINT_STACKS_GET_LESS_VARS = "getStackLessVars";
  CCConstants.ENDPOINT_STACKS_UPDATE_LESS_VARS = "updateStackLessVars";

  CCConstants.ENDPOINT_WIDGETS_GET_LESS = "getWidgetLess";
  CCConstants.ENDPOINT_WIDGETS_UPDATE_LESS = "updateWidgetLess";
  CCConstants.ENDPOINT_WIDGETS_RESTORE_LESS = "restoreWidgetLess";

  CCConstants.ENDPOINT_WIDGETS_GET_LAYOUT_DESCRIPTOR_SOURCE = "getWidgetLayoutDescriptorSource";
  CCConstants.ENDPOINT_WIDGETS_CREATE_FRAGMENT_INSTANCE = "createFragmentInstance";
  CCConstants.ENDPOINT_WIDGETS_DELETE_FRAGMENT = "deleteFragment";
  CCConstants.ENDPOINT_WIDGETS_SAVE_FRAGMENTS_CONFIG = "saveFragmentsConfig";
  CCConstants.ENDPOINT_WIDGETS_DISABLE_FRAGMENT = "disableFragment";
  CCConstants.ENDPOINT_WIDGETS_DISABLE_FRAGMENTS = "disableFragments";


  CCConstants.ENDPOINT_WIDGETS_GET_WEB_CONTENT = "getWidgetWebContent";
  CCConstants.ENDPOINT_WIDGETS_UPDATE_WEB_CONTENT = "updateWidgetWebContent";

  CCConstants.ENDPOINT_PAGES_GET_PAGE = "getPage";
  CCConstants.ENDPOINT_GET_LAYOUT = "getLayout";
  CCConstants.ENDPOINT_GET_ASSET_PACKAGE = "getAssetPackage";

  CCConstants.ENDPOINT_PUBLISH_GET_PUBLISH_STATUS = "getPublishStatus";
  CCConstants.ENDPOINT_PUBLISH_GET_PUBLISH_CHANGES = "getPublishingChanges";
  CCConstants.ENDPOINT_PUBLISH_PUBLISH = "publishChangeLists";
  CCConstants.ENDPOINT_PUBLISH_GET_CHANGE_AUTHORS = "getAllPublishingChangeAuthors";
  CCConstants.ENDPOINT_PUBLISH_SCHEDULE = "schedule";
  CCConstants.ENDPOINT_PUBLISH_GET_SCHEDULE_ITEMS = "getPublishSchedule";
  CCConstants.ENDPOINT_PUBLISH_DELETE_SCHEDULE_ITEMS = "deleteScheduledPublish";
  CCConstants.ENDPOINT_PUBLISH_STORE_DEP_INPUT = "storePublishingChangeList";
  CCConstants.ENDPOINT_PUBLISH_LIST_DEPENDENCIES = "getPublishingDependencies";
  CCConstants.ENDPOINT_GET_CURRENT_USER = "getCurrentProfile";

  CCConstants.ENDPOINT_SEARCH_SEARCH = "search";
  CCConstants.ENDPOINT_ASSEMBLE = "assemble";
  CCConstants.ENDPOINT_SEARCH_INDEXES = "listIndexFields";

  CCConstants.ENDPOINT_METADATA_GET_METADATA = "getMetadata";
  CCConstants.ENDPOINT_METADATA_UPDATE_METADATA = "updateMetadata";
  CCConstants.ENDPOINT_GET_ITEM_TYPE = "getItemType";

  CCConstants.ENDPOINT_ITEMTYPES_LIST_PRODUCT_TYPES = "listProductTypes";
  CCConstants.ENDPOINT_ITEMTYPES_CREATE_PRODUCT_TYPE = "createProductType";
  CCConstants.ENDPOINT_ITEMTYPES_GET_PRODUCT_TYPE = "getProductType";
  CCConstants.ENDPOINT_ITEMTYPES_UPDATE_PRODUCT_TYPE = "updateProductType";

  CCConstants.ENDPOINT_SHIPPING_METHODS_LIST_SHIPPING_METHODS = "listShippingMethods";
  CCConstants.ENDPOINT_SHIPPING_METHODS_CREATE_SHIPPING_METHOD = "createShippingMethod";
  CCConstants.ENDPOINT_SHIPPING_METHODS_DELETE_SHIPPING_METHOD = "deleteShippingMethod";
  CCConstants.ENDPOINT_SHIPPING_METHODS_GET_SHIPPING_METHOD = "getShippingMethod";
  CCConstants.ENDPOINT_SHIPPING_METHODS_UPDATE_SHIPPING_METHOD = "updateShippingMethod";

  CCConstants.ENDPOINT_SHIPPING_REGIONS_LIST_SHIPPING_REGIONS = "listShippingRegions";
  CCConstants.ENDPOINT_COUNTRY_REGION_LIST_COUNTRIES = "listCountries";
  CCConstants.ENDPOINT_COUNTRY_REGION_GET_COUNTRY_REGIONS = "getCountryRegions";
  CCConstants.ENDPOINT_SHIPPING_REGIONS_DELETE_SHIPPING_REGION = "deleteShippingRegion";
  CCConstants.ENDPOINT_SHIPPING_REGIONS_GET_SHIPPING_REGION = "getShippingRegion";
  CCConstants.ENDPOINT_SHIPPING_REGIONS_CREATE_SHIPPING_REGION = "createShippingRegion";
  CCConstants.ENDPOINT_SHIPPING_REGIONS_UPDATE_SHIPPING_REGION = "updateShippingRegion";
  CCConstants.ENDPOINT_SHIPPING_REGIONS_GET_SHIPPING_REGIONS_BY_COUNTRY = "getShippingRegionsByCountry";

  CCConstants.ENDPOINT_ORDERS_PRICE_ORDER = "priceOrder";
  CCConstants.ENDPOINT_ORDERS_CREATE_ORDER = "createOrder";
  CCConstants.ENDPOINT_HANDLE_ANONYMOUS_ORDERS = "handleAnonymousOrders";
  CCConstants.ENDPOINT_ORDERS_SUBMIT_ORDER = "submitOrder";
  CCConstants.ENDPOINT_GET_GIFT_CHOICES = "getGiftWithPurchaseChoices";
  CCConstants.ENDPOINT_QUOTE_REQUEST = "requestQuote";
  CCConstants.ENDPOINT_QUOTE_REJECT = "rejectQuote";

  CCConstants.PUBLISHING_CREATE_ACCOUNT = "publishing-createAccount";
  CCConstants.PUBLISHING_UPDATE_ACCOUNT = "publishing-updateAccount";

  CCConstants.ENDPOINT_GET_PAYMENT_GROUP_STATUS = "getPaymentGroupAuthorizationStatus";
  CCConstants.ENDPOINT_GET_PAYMENT_GROUP = "getPaymentGroup";
  CCConstants.ENDPOINT_GET_PAYMENT_GROUP_STATUS = "getPaymentGroupAuthorizationStatus";
  CCConstants.ENDPOINT_LIST_BILLING_COUNTRIES = "listSelectedBillingCountries";
  CCConstants.ENDPOINT_UPDATE_BILLING_COUNTRIES = "updateSelectedBillingCountries";

  CCConstants.ENDPOINT_LIST_COLLECTIONS = "listCollections";
  CCConstants.ENDPOINT_COLLECTIONS_GET_COLLECTION = "getCollection";
  CCConstants.ENDPOINT_COLLECTIONS_CREATE_COLLECTION = "createCollection";
  CCConstants.ENDPOINT_COLLECTIONS_UPDATE_COLLECTION = "updateCollection";
  CCConstants.ENDPOINT_COLLECTIONS_DELETE_COLLECTION = "deleteCollection";
  CCConstants.ENDPOINT_COLLECTIONS_MOVE_COLLECTION = "moveCollection";

  CCConstants.ENDPOINT_UPDATE_ASA_CONFIGURATION = "updateASASettings";
  CCConstants.ENDPOINT_GET_ASA_CONFIGURATION = "getASASettings";

  CCConstants.ENDPOINT_LIST_MEDIA_TAGS = "listMediaTags";

  CCConstants.ENDPOINT_UPDATE_PROFILE_ORDER = "updateCurrentProfileOrder";
  CCConstants.ENDPOINT_CREATE_PROFILE_ORDER = "createCurrentProfileOrder";
  CCConstants.ENDPOINT_GET_PROFILE_ORDER = "getIncompleteOrder";
  CCConstants.ENDPOINT_REMOVE_PROFILE_INCOMPLETE_ORDER = "removeCurrentProfileIncompleteOrder";
  CCConstants.ENDPOINT_GET_ALL_ORDERS_FOR_PROFILE = "getAllOrdersForProfile";
  CCConstants.ENDPOINT_GET_ALL_ORDERS_FOR_APPROVER = "/ccstoreui/v1/orders";
  CCConstants.ENDPOINT_GET_ORDER_COUNT_FOR_PROFILE = "getAllOrdersCountForProfile";
  CCConstants.ENDPOINT_UPDATE_ORDER = "updateOrder";

  CCConstants.ENDPOINT_PRODUCTS_GET_PRODUCT = "getProduct";
  CCConstants.ENDPOINT_PRODUCTS_CREATE_PRODUCT = "createProduct";
  CCConstants.ENDPOINT_PRODUCTS_UPDATE_PRODUCT = "updateProduct";
  CCConstants.ENDPOINT_PRODUCTS_DELETE_PRODUCT = "deleteProduct";
  CCConstants.ENDPOINT_PRODUCTS_LIST_PRODUCTS = "listProducts";
  CCConstants.ENDPOINT_PRODUCTS_LIST_SKUS = "listSkus";
  CCConstants.ENDPOINT_PRICES = "/ccadminui/v1/prices";
  CCConstants.INCLUDE_PRICES = "includePrices";
  CCConstants.ENDPOINT_PRODUCTS_LIST_SKUS = "listSkus";
  CCConstants.PARAM_MINIMAL_LIST = "minimalList";
  CCConstants.PRICE_GRP_INCLUDE_ALL_PRODUCTS = "includeAllProducts";
  CCConstants.PRICE_GRP_IS_TAX_INCLUDED = "isTaxIncluded";
  CCConstants.ASSOCIATE_PRICE_GRP_TO_SITE = "associatePriceListGroupToSite";

  CCConstants.ENDPOINT_PRODUCTS_CREATE_VARIANT = "createProductTypeVariant";
  CCConstants.ENDPOINT_PRODUCTS_UPDATE_VARIANT = "updateProductTypeVariant";

  CCConstants.ENDPOINT_PRODUCT_CREATE_VARIANT_SKUS = "createSkus";
  CCConstants.ENDPOINT_PRODUCT_CREATE_VARIANT_SKU = "createSku";
  CCConstants.ENDPOINT_PRODUCT_UPDATE_VARIANT_SKU = "updateSku";
  CCConstants.ENDPOINT_GET_SKU = "getSku";
  CCConstants.VARIANT_ITEM_TYPE = "sku";
  CCConstants.ENDPOINT_GET_ITEM_TYPE = "getItemType";

  CCConstants.ENDPOINT_GET_PRODUCT_AVAILABILITY = "getStockStatus";
  CCConstants.ENDPOINT_PRODUCTS_AVAILABILITY = "getStockStatuses";
  CCConstants.ENDPOINT_PRODUCTS_CREATE_SPECIFICATION = "createProductTypeSpecification";
  CCConstants.ENDPOINT_PRODUCTS_UPDATE_SPECIFICATION = "updateProductTypeSpecification";
  CCConstants.ENDPOINT_PRODUCTS_CREATE_SKU_PROPERTY = "createSkuProperty";
  CCConstants.ENDPOINT_PRODUCTS_UPDATE_SKU_PROPERTY = "updateSkuProperty";
  CCConstants.ENDPOINT_PRODUCTS_GET_SKU_PROPERTY = "getSkuProperty";
  CCConstants.ENDPOINT_PRODUCTS_GET_SKU_PROPERTIES = "getSkuProperties";
  CCConstants.ENDPOINT_GET_PRODUCT_PRICES = "getAllPrices";

  CCConstants.PROMOTION_TYPE_IDS = "promotionTypeIds";
  CCConstants.ENDPOINT_PROMOTIONS_LIST_PROMOTIONS = "listPromotions";
  CCConstants.ENDPOINT_PROMOTIONS_GET_PROMOTION = "getPromotion";
  CCConstants.ENDPOINT_PROMOTIONS_CREATE_PROMOTION = "createPromotion";
  CCConstants.ENDPOINT_PROMOTIONS_UPDATE_PROMOTION = "updatePromotion";
  CCConstants.ENDPOINT_PROMOTIONS_DELETE_PROMOTION = "deletePromotion";
  CCConstants.ENDPOINT_PROMOTION_TEMPLATE_GET = "getPromotionTemplate";
  CCConstants.ENDPOINT_PROMOTION_CLAIMABLE_CREATE = "createPromotionClaimable";
  CCConstants.ENDPOINT_PROMOTION_CLAIMABLE_DELETE = "deletePromotionClaimable";
  CCConstants.ENDPOINT_PROMOTION_COUPON_BATCH_CREATE = "createPromotionCouponBatch";
  CCConstants.ENDPOINT_PROMOTION_COUPON_BATCH_DELETE = "deletePromotionCouponBatch";
  CCConstants.EXPORT_COUPON_BATCH_BASE_URL = "/ccadminui/v1/couponBatches/export";
  CCConstants.ENDPOINT_PROMOTION_FOLDER_LIST = "listPromotionFolders";
  CCConstants.ENDPOINT_PROMOTION_FOLDER_GET = "getPromotionFolder";
  CCConstants.ENDPOINT_PROMOTION_FOLDER_CREATE = "createPromotionFolder";
  CCConstants.ENDPOINT_PROMOTION_FOLDER_UPDATE = "updatePromotionFolder";
  CCConstants.ENDPOINT_PROMOTION_FOLDER_DELETE = "deletePromotionFolder";

  CCConstants.ENDPOINT_STACKING_RULE_LIST = "listStackingRules";
  CCConstants.ENDPOINT_STACKING_RULE_GET = "getStackingRule";
  CCConstants.ENDPOINT_STACKING_RULE_CREATE = "createStackingRule";
  CCConstants.ENDPOINT_STACKING_RULE_UPDATE = "updateStackingRule";
  CCConstants.ENDPOINT_STACKING_RULE_DELETE = "deleteStackingRule";

  CCConstants.ENDPOINT_INVENTORY_LIST = "listInventories";
  CCConstants.ENDPOINT_INVENTORY_UPDATE = "updateInventory";

  CCConstants.ENDPOINT_IMPORT_UPLOAD_FILE = "uploadAssets";
  CCConstants.ENDPOINT_IMPORT_UPLOAD_FILE_MULTIPART = "/ccadminui/v1/asset/upload";
  CCConstants.ENDPOINT_IMPORT_UPLOAD_FILE_MULTIPART_FROM_UI = "/ccadminui/v1/asset/uploadFromUI";
  CCConstants.ENDPOINT_IMPORT_VALIDATE_FILE = "validateAssets";
  CCConstants.ENDPOINT_IMPORT_FILE = "importAssets";
  CCConstants.ENDPOINT_IMPORT_STATUS  = "getImportStatus";
  CCConstants.VALIDATIONREPORT_BASE_URL = "/ccadminui/v1/asset/validationReport/";
  CCConstants.EXPORT_BASE_URL = "/ccadminui/v1/asset/export";

  CCConstants.ENDPOINT_DOWNLOAD_ASSET_PACKAGE = "getAssetPackage";

  CCConstants.ENDPOINT_VFS_GET_VFS_CONTENTS = "getMediaContents";
  CCConstants.ENDPOINT_VFS_DELETE_VFS_CONTENTS = "deleteMediaItems";
  CCConstants.ENDPOINT_UPDATE_MEDIA_ITEM = "updateMediaItem";

  CCConstants.ENDPOINT_ERRORLOGS_CREATE_ERRORLOG = "logClientErrors";
  CCConstants.ENDPOINT_LOGS_CREATE_LOG = "log";

  CCConstants.ENDPOINT_PAYMENT_GET_PAYMENT_TYPES = "getPaymentTypes";
  CCConstants.ENDPOINT_PAYMENT_ENABLE_PAYMENT_TYPES = "updatePaymentTypes";
  CCConstants.ENDPOINT_PAYMENT_DISABLE_PAYMENT_TYPES = "disablePaymentTypes";
  CCConstants.ENDPOINT_PAYMENT_GET_GATEWAY = "getGateway";
  CCConstants.ENDPOINT_PAYMENT_GET_GATEWAYS = "getGateways";
  CCConstants.ENDPOINT_PAYMENT_CREATE_GATEWAY = "createGateway";
  CCConstants.ENDPOINT_PAYMENT_UPDATE_GATEWAY = "updateGateway";
  CCConstants.ENDPOINT_PAYMENT_AUTH_PAYMENT = "authPayment";
  CCConstants.ENDPOINT_PAYMENT_GET_PAYMENT_AUTH_RESPONSE = "getPaymentResponse";
  CCConstants.ENDPOINT_GET_TAX_PROCESSOR = "getTaxProcessor";
  CCConstants.ENDPOINT_UPDATE_TAX_PROCESSOR = "updateTaxProcessor";
  CCConstants.ENDPOINT_LIST_TAX_PROCESSORS = "listTaxProcessors";
  CCConstants.ENDPOINT_DASHBOARD_REPORTS_LIST_METADATA = "getDashboardReportConfigurations";
  CCConstants.ENDPOINT_DASHBOARD_REPORT_DATA = "getReportData";

  CCConstants.ENDPOINT_LIST_FILTER_CONFIGURATION  = "listReportFilterConfigurations";
  CCConstants.ENDPOINT_SAVE_FILTER_CONFIGURATION  = "saveReportFilterConfiguration";
  CCConstants.ENDPOINT_UPDATE_FILTER_CONFIGURATION  = "updateReportFilterConfiguration";
  CCConstants.ENDPOINT_DASHBOARD_GET_ORDER_DATA = "getOrderChartData";
  CCConstants.ENDPOINT_DASHBOARD_GET_RETURN_REQUESTS_DATA = "getReturnRequestChartData";

  //JsFrameworkAdminEndpoint
  CCConstants.ENDPOINT_STOREFRONT_JS_FRAMEWORK_GET_CURRENT_VERSION_DETAILS = "getCurrentVersionDetails";
  CCConstants.ENDPOINT_STOREFRONT_JS_FRAMEWORK_ROLLBACK_CURRENT_VERSION = "rollbackCurrentVersion";
  CCConstants.ENDPOINT_STOREFRONT_JS_FRAMEWORK_UPGRADE_CURRENT_VERSION = "upgradeCurrentVersion";

  CCConstants.REPORTING_CHART_TIMEFRAME_LAST7DAYS_TEXT = "last7days";
  CCConstants.REPORTING_TIMEFRAME_YD_TEXT = "YD";
  CCConstants.REPORTING_TIMEFRAME_LST7DYS_TEXT = "LST7DYS";
  CCConstants.REPORTING_TIMEFRAME_LSTWK_TEXT = "LSTWK";
  CCConstants.REPORTING_TIMEFRAME_LST30DYS_TEXT = "LST30DYS";
  CCConstants.REPORTING_TIMEFRAME_LST90DYS_TEXT = "LST90DYS";
  CCConstants.REPORTING_CHART_GROUPBY_DAY_TEXT = "day";
  CCConstants.REPORTING_CHART_GROUPBY_WEEK_TEXT = "week";
  CCConstants.REPORTING_CHART_GROUPBY_MONTH_TEXT = "month";
  CCConstants.REPORTING_PROMOTION_SPEND_Y_FOR_ORDER_DISCOUNT = "1";
  CCConstants.REPORTING_PROMOTION_GET_SHIPPING_DISCOUNT = "2";
  CCConstants.REPORTING_PROMOTION_SPEND_Y_FOR_SHIPPING_DISCOUNT = "3";
  CCConstants.REPORTING_PROMOTION_GET_ITEM_DISCOUNT = "4";
  CCConstants.REPORTING_PROMOTION_GET_ITEM_DISCOUNT = "6";
  CCConstants.REPORTING_PROMOTION_BOGO = "7";
  CCConstants.REPORTING_PROMOTION_GIFT_WITH_ITEM_PURCHASE = "8";
  CCConstants.REPORTING_PROMOTION_SPEND_Y_GET_GIFT_WITH_PURCHASE = "9";
  CCConstants.METRIC_NAME = "metricName";
  CCConstants.EXPORT = "export";
  CCConstants.PROMOTION_IDS = "promotionIds";
  CCConstants.PROMOTION_TYPE_ID = "promotionTypeId";
  CCConstants.COUPON_CODES = "couponCodes";
  CCConstants.PROMOTION_NAME = "promotionName";
  CCConstants.DESCRIPTION = "description";
  CCConstants.PROMOTION_TYPE = "promotionType";
  CCConstants.PROMOTIONS_TYPE_ID = "promotionsTypeId";
  CCConstants.PROMOTION_ITEM_TYPE_LIST = "itemTypeList";
  CCConstants.PROMOTION_TEMPLATE_VALUE = "templateValue";
  CCConstants.PERCENT_TOTAL_METRIC = "percentTotalMetric";
  CCConstants.REPORTING_CHART_TIMEFRAME_YESTERDAY_TEXT = "yesterday";
  CCConstants.REPORTING_CHART_TIMEFRAME_CUSTOM_TEXT = "custom";
  CCConstants.REPORTING_CHART_DETAILED_REPORT_TEXT = "detailedReport";
  CCConstants.REPORTING_CHART_REPOSITORY_ID_TEXT = "repositoryId";
  CCConstants.REPORTING_ORDER_RECORD_COUNT_REPORT_ID = "orderTotalCount";
  CCConstants.REPORTING_PRODUCT_RECORD_COUNT_REPORT_ID = "productTotalCount";
  CCConstants.REPORTING_DETAILED_ORDER_METRICS_REPORT_ID = "detailedOrderMetrics";
  CCConstants.REPORTING_PRODUCT_ORDER_METRICS_REPORT_ID = "productOrdersMetric";
  CCConstants.REPORTING_ENGAGEMENT_DETAIL_METRICS_REPORT_ID = "engagementDetailMetrics";
  CCConstants.REPORTING_ENGAGEMENT_SUMMARY_METRICS_REPORT_ID = "engagementSummaryMetric";
  CCConstants.REPORTING_ENGAGEMENT_COUNT_REPORT_ID = "engagementTotalCount";
  CCConstants.REPORTING_MINIMUM_REPORTING_DATE_REPORT_ID = "minimumReportingDate";
  CCConstants.REPORTING_SUMMARY_ORDER_METRICS_REPORT_ID = "orderMetrics";
  CCConstants.REPORTING_TIMEZONE_REPORT_ID = "timeZone";
  CCConstants.REPORTING_SUMMARY_PRODUCT_METRICS_REPORT_ID = "salesByProductMetrics";
  CCConstants.REPORTING_SUMMARY_CONVERSIONS_METRICS_REPORT_ID = "visitorsByConversionMetrics";
  CCConstants.REPORTING_DETAIL_CONVERSIONS_METRICS_REPORT_ID = "detailedConversionMetrics";
  CCConstants.REPORTING_CONVERSIONS_RECORD_COUNT_REPORT_ID = "conversionsTotalCount";
  CCConstants.REPORTING_PRODUCTS_FILTER = "productFilter";
  CCConstants.REPORTING_SHIPPING_LOCATIONS_FILTER = "shippingLocationFilter";
  CCConstants.REPORTING_BILLING_LOCATIONS_FILTER = "billingLocationFilter";
  CCConstants.REPORTING_PROMOTIONS_DETAILED_METRICS_REPORT_ID = "promotionDetailedMetrics";
  CCConstants.REPORTING_PROMOTIONS_RECORD_COUNT_REPORT_ID = "promotionDetailedCount";
  CCConstants.REPORTING_PROMOTION_SUMMARY_METRIC_REPORT_ID = "promotionSummaryMetrics";
  CCConstants.REPORTING_CUSTOMER_SERVICE_OVERVIEW_SUMMARY_REPORT_ID = "customerServiceOverviewSummary";
  CCConstants.ENDPOINT_PROMOTION_CLAIMABLE_LIST_ALL = "listPromotionClaimables";
  CCConstants.REPORTING_SHIPPING_BILLING_SUMMARY_TEXT_LIMIT = 12;
  CCConstants.REPORTING_PRODUCTS_SUMMARY_TEXT_LIMIT = 20;
  CCConstants.REPORTING_SHIPPING_BILLING_TOOLTIP_TEXT_LIMIT = 100;
  CCConstants.REPORTING_PRODUCTS_TOOLTIP_TEXT_LIMIT = 200;
  CCConstants.PRODUCTS = "products";
  CCConstants.REPOSITORY_ID_TEXT = "repositoryId";

  //Reporting Batch coupon changes
  CCConstants.BATCH_COUPON_SIGN = "*";
  CCConstants.USE_MAX_USES = "useMaxUses";
  CCConstants.IS_BATCH_FLAG = "isBatchFlag";
  CCConstants.COUPON_CODE = "couponCode";

  CCConstants.REPORTING_SUMMARY_TRAFFIC_VOLUME_REPORT_ID = "trafficVolumeSummary";
  CCConstants.REPORTING_TRAFFIC_VOLUME_DETAIL_REPORT_ID = "trafficVolumeDetail";
  CCConstants.REPORTING_TRAFFIC_VOLUME_COUNT_REPORT_ID = "trafficVolumeCount";
  CCConstants.REPORTING_OVERVIEW_TOPTEN_PRODUCTS_ID = "salesOverViewProducts";
  CCConstants.REPORTING_CONNECTION_ERROR_CODE  = "94013";
  CCConstants.REPORT_EXPORT_URL = "/ccadminui/v1/reports/export";
  CCConstants.REPORT_EXPORT_ID_ORDER_DETAILS = "exportOrderDetails";
  CCConstants.REPORT_EXPORT_ID_PRODUCT_DETAILS = "exportProductDetails";
  CCConstants.REPORT_EXPORT_ID_PROMOTION_DETAILS = "exportPromotionDetails";
  CCConstants.REPORT_EXPORT_ID_CUSTOMERSERVICE_DETAILS = "exportCustomerServiceDetails";
  CCConstants.REPORT_EXPORT_ID_TRAFFICVOLUME_DETAILS = "exportTrafficVolumeDetails";
  CCConstants.REPORT_EXPORT_ID_CONVERSION_DETAILS = "exportConversionDetails";
  CCConstants.REPORT_EXPORT_ID_ENGAGEMENT_DETAILS = "exportEngagementDetails";
  CCConstants.REPORT_EXPORT_ID_OVERVIEW_ORDER_METRICS = "exportOrderMetrics";
  CCConstants.REPORT_EXPORT_ID_OVERVIEW_PRODUCTS_TOP10 = "exportSalesOverViewProducts";
  CCConstants.REPORT_EXPORT_TIME_ZONE_OFFSET = "timeZoneOffset";
  CCConstants.REPORT_CONTEXT = "context";
  CCConstants.REPORT_FILE_FORMAT = "format";
  CCConstants.FILE_EXTENSION_CSV = "csv";
  CCConstants.REPORT_TIMEFRAME = "timeFrame";
  CCConstants.REPORT_START_DATE = "startDate";
  CCConstants.REPORT_END_DATE = "endDate";
  CCConstants.REPORT_ID = "reportId";
  CCConstants.GROUP_BY = "groupBy";
  CCConstants.METRIC = "metric";
  CCConstants.REPORT_FILTER_SHIPPING_TYPE = "shipping";
  CCConstants.REPORT_FILTER_BILLING_TYPE = "billing";
  CCConstants.REPORT_FILTER_ALL_REGIONS_CODE = "ALL_REGIONS";
  CCConstants.SHIPPING_LOCATIONS = "shippingLocations";
  CCConstants.BILLING_LOCATIONS = "billingLocations";
  CCConstants.LOCATIONS = "Locations";
  CCConstants.PROMOTIONS_TYPE = "promotionsType";
  CCConstants.PROMOTIONS_NAME = "promotionsName";
  CCConstants.COUPONS = "coupons";
  CCConstants.TAB_SUMMARY = "tabSummary";
  CCConstants.TITLE_SUMMARY = "titleSummary";
  CCConstants.BILLING_REGIONS = "billingRegions";
  CCConstants.BILLING_COUNTRY = "billingCountry";
  CCConstants.BILLING_COUNTRIES = "billingCountries";
  CCConstants.SHIPPING_COUNTRIES = "shippingCountries";
  CCConstants.SHIPPING_REGIONS = "shippingRegions";
  CCConstants.SHIPPING_COUNTRY = "shippingCountry";
  CCConstants.CONTEXT_OVERVIEW = "overview";
  CCConstants.CONTEXT_ORDERS = "orders";
  CCConstants.CONTEXT_ACCOUNTS = "accounts";
  CCConstants.CONTEXT_PRODUCTS = "products";
  CCConstants.CONTEXT_PROMOTIONS = "promotions";
  CCConstants.CONTEXT_COLLECTIONS = "collections";
  CCConstants.CONTEXT_TRAFFICVOLUME = "trafficVolume";
  CCConstants.CONTEXT_ENGAGEMENT = "engagement";
  CCConstants.CONTEXT_CONVERSION = "conversion";
  CCConstants.CONTEXT_CUSTOMER_SERVICE_OVERVIEW = "customerServiceOverview";
  CCConstants.CURRENCY = "currency";
  CCConstants.PERCENT = "percent";
  CCConstants.NUMBER = "number";
  CCConstants.DIGIT = 'digit';
  CCConstants.DATATYPE = "dataType";
  CCConstants.TRANSACTION_CURRENCY = "transactionCurrency";
  CCConstants.PRICE_LIST_GROUPS = "priceListGroups";
  CCConstants.CURRENCY_CODE = "currencyCode";
  CCConstants.DEFAULT_PRICE_LIST_GROUP = "defaultPriceListGroup";
  CCConstants.ALL_PRICE_LIST_GROUPS = "allPriceGroups";
  CCConstants.UNDEFINED = "undefined";

  CCConstants.TAX_PROCESSSOR_ID = "ava-p";
  CCConstants.TAX_PROCESSSOR_TYPE = "avalara";

  CCConstants.TAX_PROCESSOR_AVALARA_ID = "ava-p";
  CCConstants.TAX_PROCESSOR_AVALARA_TYPE = "avalara"
  CCConstants.TAX_PROCESSOR_VERTEX_ID = "vertex-p";
  CCConstants.TAX_PROCESSOR_VERTEX_TYPE = "vertex";
  CCConstants.TAX_PROCESSOR_EXTERNAL_ID = "ext-p";
  CCConstants.TAX_PROCESSOR_EXTERNAL_TYPE = "external";

  CCConstants.ENDPOINT_GET_WEBHOOK = "getWebHook";
  CCConstants.ENDPOINT_GET_WEBHOOK_SETTINGS = "getWebHooks";
  CCConstants.ENDPOINT_GET_WEBHOOK_SECRET_KEY = "getWebHookSecretKey";
  CCConstants.ENDPOINT_WEBHOOK_OPERATION = "webHookOperation";
  CCConstants.ENDPOINT_PUT_WEBHOOK_SETTINGS = "updateWebHooks";
  CCConstants.ENDPOINT_PUT_SINGLE_WEBHOOK_SETTINGS = "updateWebHook";
  CCConstants.WEBHOOK_PRODUCTION_ORDER_ID = "production-submitOrder";
  CCConstants.WEBHOOK_PUBLISHING_ORDER_ID = "publishing-submitOrder";
  CCConstants.RESET_WEBHOOK_SECRET_KEY = "resetSecretKey";

  CCConstants.ENDPOINT_GET_FUNCTION_WEBHOOK_SETTINGS = "getFunctionWebHooks";
  CCConstants.ENDPOINT_PUT_FUNCTION_WEBHOOK_SETTINGS = "updateFunctionWebHooks";
  CCConstants.ENDPOINT_FUNCTION_WEBHOOK_OPERATION = "functionWebHookOperation";
  CCConstants.ENDPOINT_GET_FUNCTION_WEBHOOK = "getFunctionWebHook";
  CCConstants.ENDPOINT_PUT_SINGLE_FUNCTION_WEBHOOK_SETTINGS = "updateFunctionWebHook";
  CCConstants.FUNCTION_WEBHOOK = "functionWebhook";

  CCConstants.ENDPOINT_CREATE_PROFILE = "createProfile";
  CCConstants.ENDPOINT_UPDATE_PROFILE = "updateProfile";
  CCConstants.ENDPOINT_GET_CURRENT_ADMIN_USER = "getCurrentAdminProfile";
  CCConstants.ENDPOINT_UPDATE_ADMIN_PROFILE = "updateAdminProfile";
  CCConstants.ENDPOINT_UPDATE_CURRENT_ADMIN_PROFILE = "updateCurrentAdminProfile";
  CCConstants.ENDPOINT_RECORD_PAGEVIEWS_COUNT = "savePageViewsCount";
  CCConstants.SERVERSIDE_PROCESS_STRING = "serverside=true";
  CCConstants.ENDPOINT_SAVE_VISIT_DETAILS = "saveVisitsAndVisitorsMetric";
  CCConstants.ENDPOINT_FORGOT_PASSWORD = "resetPassword";
  CCConstants.ENDPOINT_UPDATE_EXPIRED_PASSWORD = "updateExpiredPassword";
  CCConstants.ENDPOINT_LIST_ADMIN_PROFILES = "listAdminProfiles";
  CCConstants.ENDPOINT_LIST_INTERNAL_PROFILE_ROLES = "listInternalProfileRoles";
  CCConstants.ENDPOINT_CREATE_ADMIN_PROFILE = "createAdminProfile";
  CCConstants.ENDPOINT_UPDATE_ADMIN_PROFILE = "updateAdminProfile";
  CCConstants.ENDPOINT_REQUEST_PASSWORD_RESET = "requestPasswordReset";
  CCConstants.ENDPOINT_SEND_PASSWORD_RESET = "sendPasswordReset";

  CCConstants.ENDPOINT_LIST_AUDIENCE_RULE_PROPERTIES = "listAudienceRuleProperties";
  CCConstants.ENDPOINT_CREATE_AUDIENCE = "createAudience";
  CCConstants.ENDPOINT_LIST_AUDIENCES = "listAudiences";
  CCConstants.ENDPOINT_DELETE_AUDIENCE = "deleteAudience";
  CCConstants.ENDPOINT_GET_AUDIENCE = "getAudience";
  CCConstants.ENDPOINT_UPDATE_AUDIENCE = "updateAudience";

  CCConstants.ENDPOINT_SKUS_DELETE_SKUS = "deleteSkus";
  CCConstants.ENDPOINT_SKUS_DELETE_SKU = "deleteSku";

  CCConstants.ENDPOINT_SETTINGS_GET_POLICIES = "getPolicies";
  CCConstants.ENDPOINT_SETTINGS_SAVE_POLICIES = "savePolicies";
  CCConstants.ENDPOINT_UPDATE_PROFILES = "updateProfiles";
  CCConstants.UPDATE_PROFILES_EXPIRE_PASSWORDS_OPERATION = "expirePasswords";

  CCConstants.ENDPOINT_FILE_MULTIPART_UPLOAD_URL = "/ccadminui/v1/files";
  CCConstants.ENDPOINT_FILE_UPLOAD_URL = "doFileUpload";
  CCConstants.ENDPOINT_FILE_PRE_UPLOAD_URL = "startFileUpload";
  CCConstants.ENDPOINT_FILE_RESUME_UPLOAD_URL = "resumeFileUpload";
  CCConstants.ENDPOINT_FILE_CHUNK_UPLOAD_URL = "doFileSegmentUpload";
  CCConstants.ENDPOINT_FILE_REPORT_BASE_URL = "/ccadminui/v1/files/mediaUploadReport/";

  CCConstants.ENDPOINT_CURRENCIES_LIST_CURRENCIES = "listCurrencies";
  CCConstants.ENDPOINT_CURRENCIES_UPDATE_CURRENCY = "updatePriceLocale";

  CCConstants.ENDPOINT_GET_REPORTING_CURRENCY = "getReportingCurrency";
  CCConstants.ENDPOINT_UPDATE_REPORTING_CURRENCY = "updateReportingCurrency";

  CCConstants.ENDPOINT_LIST_PRICE_LIST_GROUPS = 'listPriceListGroups';
  CCConstants.ENDPOINT_LIST_PRICE_LIST_GROUPS_WITH_PRICES = 'listPriceListGroupsWithPrices';
  CCConstants.ENDPOINT_CREATE_PRICE_LIST_GROUP = 'createPriceListGroup';
  CCConstants.ENDPOINT_UPDATE_PRICE_LIST_GROUP = 'updatePriceListGroup';
  CCConstants.ENDPOINT_DELETE_PRICE_LIST_GROUP = 'deletePriceListGroup';
  CCConstants.ENDPOINT_ACTIVATE_PRICE_LIST_GROUP = 'createPriceListGroupActivationRequest';
  CCConstants.ENDPOINT_UPDATE_DEFAULT_PRICE_LIST_GROUP = 'updateDefaultPriceListGroup';
  CCConstants.ENDPOINT_GET_DEFAULT_PRICE_LIST_GROUP = 'getDefaultPriceListGroup';
  CCConstants.ENDPOINT_ASSOCIATE_PRODUCTS_TO_PRICE_LIST_GROUP = 'associateProductsToPriceListGroup';
  CCConstants.ALL_PRODUCTS = 'allProducts';
  CCConstants.PRODUCTS_WITH_NULL_PRICES = 'productsWithNullPrices';
  CCConstants.SHOW_ONLY_PRODUCTS_WITH_MISSING_PRICES = "showMissingListPrices";


  CCConstants.ENDPOINT_GET_MERCHANT_TIMEZONE = "getMerchantTimezone";
  CCConstants.ENDPOINT_LIST_TIMEZONES = "listTimezones";
  CCConstants.ENDPOINT_UPDATE_MERCHANT_TIMEZONE = "updateMerchantTimezone";
  CCConstants.ENDPOINT_GET_EE_PAGE_TAG_DATA = "getEEPageTagData";
  CCConstants.ENDPOINT_GET_STOREFRONT_URL = 'getStorefrontUrl';

  CCConstants.ENDPOINT_LIST_SITE_SETTINGS = "listSiteSettings";
  CCConstants.ENDPOINT_GET_SITE_SETTINGS = "getCustomSiteSettings";
  CCConstants.ENDPOINT_SET_SITE_SETTINGS_CONFIG ="setSiteSettingConfigData";

  CCConstants.ENDPOINT_SEARCH_LIST_SEARCH_INTERFACES = "listSearchInterfaces";
  CCConstants.ENDPOINT_SEARCH_GET_SEARCH_INTERFACE = "getSearchInterface";
  CCConstants.ENDPOINT_SEARCH_UPDATE_SEARCH_INTERFACE = "updateSearchInterface";

  CCConstants.GUIDED_SEARCH_APPLICATION = "cloud";
  CCConstants.AUTHORIZATION_HEADER = "Authorization";
  CCConstants.BEARER = "Bearer";

  CCConstants.SITE_SETTINGS_IMAGE_SETTINGS_ID = "imageSiteSettings";

  CCConstants.PAYMENT_AUTHORIZATION_DEFAULT_TRIES = 5;
  CCConstants.PAYMENT_AUTHORIZATION_DEFAULT_INTERVAL = 2500;
  CCConstants.PAYMENT_AUTHORIZATION_DECLINE = "DECLINE";
  CCConstants.PAYMENT_AUTHORIZATION_ACCEPT = "ACCEPT";
  CCConstants.GENERIC_PAYMENT_AUTH_ACCEPT = "AUTH-ACCEPT";
  CCConstants.PAYMENT_GROUP_STATE_AUTHORIZED = "AUTHORIZED";
  CCConstants.PAYMENT_GROUP_STATE_SETTLED = "SETTLED";
  CCConstants.PAYMENT_GROUP_STATE_AUTHORIZED_FAILED = "AUTHORIZE_FAILED";
  CCConstants.PAYMENT_GROUP_STATE_PAYMENT_REQUEST_FAILED = "PAYMENT_REQUEST_FAILED";
  CCConstants.PAYMENT_GROUP_STATE_INITIAL = "INITIAL";
  CCConstants.PAYMENT_GROUP_STATE_REMOVED = "REMOVED";
  CCConstants.PAYMENT_AUTHENTICATION_FAILED = "476";
  CCConstants.PAYMENT_STATE_AUTHORIZED = 1;
  CCConstants.PAYMENT_STATE_SETTLED = 2;
  CCConstants.PAYMENT_STATE_PENDING_AUTHORIZATION = 7;
  CCConstants.PAYMENT_STATE_PAYMENT_REQUEST_ACCEPTED = 8;
  CCConstants.PAYMENT_STATE_PAYMENT_DEFERRED = 10;
  CCConstants.PAYMENT_STATE_INITIAL = 0;

  CCConstants.VIEWPORT_TABLET_LOWER_WIDTH = 768;
  CCConstants.VIEWPORT_TABLET_UPPER_WIDTH = 979;
  CCConstants.VIEWPORT_LARGE_DESKTOP_LOWER_WIDTH = 1200;
  CCConstants.VIEWPORT_MOBILE_WIDTH = 480;
  
  CCConstants.DEFAULT_IMG_SIZE_FOR_VIEWPORT = {
	      	"large" : {height: 940 , width: 940 , minWidth:  CCConstants.VIEWPORT_TABLET_UPPER_WIDTH + 1  },
	      	"medium" : {height: 475 , width: 475, minWidth: CCConstants.VIEWPORT_TABLET_LOWER_WIDTH + 1 , maxWidth:CCConstants.VIEWPORT_TABLET_UPPER_WIDTH},
	      	"small" : {height: 300 , width: 300, minWidth: CCConstants.VIEWPORT_MOBILE_WIDTH + 1 , maxWidth:CCConstants.VIEWPORT_TABLET_LOWER_WIDTH },
	      	"xsmall" : {height: 100 , width: 100 , maxWidth: CCConstants.VIEWPORT_MOBILE_WIDTH },
	      };

  CCConstants.DESKTOP_VIEW = 1;
  CCConstants.PHONE_VIEW = 2;
  CCConstants.TABLET_VIEW = 3;
  CCConstants.LARGE_DESKTOP_VIEW = 4;

  CCConstants.VIEWPORT_XS = "xs";
  CCConstants.VIEWPORT_SMALL = "sm";
  CCConstants.VIEWPORT_MEDIUM = "md";
  CCConstants.VIEWPORT_LARGE = "lg";

  CCConstants.CATALOG_NAME = "cloudCatalog";
  CCConstants.ROOT_CATEGORY_ID = "rootCategory";
  CCConstants.NON_NAVIGABLE_CATEGORY_ID = "nonNavigableCategory";

  CCConstants.LIST_VIEW_PRODUCTS = "product";
  CCConstants.LIST_VIEW_SEARCH = "search";
  CCConstants.SEARCH_TYPE = "searchType";
  CCConstants.SEARCH_TYPE_SIMPLE = "simple";
  CCConstants.SEARCH_TYPE_TYPEAHEAD = "typeahead";
  CCConstants.SEARCH_TYPE_GUIDED = "guided";
  CCConstants.SEARCH_LANGUAGE = 'language';

  CCConstants.TYPEAHEAD_SEARCH_INTERFACE = "TypeAhead";
  CCConstants.ASSEMBLER_PATH_QUERY_PARAM = "path";
  CCConstants.ASSEMBLER_REDIRECTS_QUERY_PARAM = 'redirects';
  CCConstants.ASSEMBLER_SITE_QUERY_PARAM = 'site';
  CCConstants.ASSEMBLER_DEFAULT_TYPEAHEAD_PATH = '/typeahead';

  CCConstants.FONT_DECORATION_UNDERLINE = "underline";
  CCConstants.FONT_DECORATION_STRIKETHROUGH = "line-through";
  CCConstants.FONT_DECORATION_BOLD = "bold";
  CCConstants.FONT_DECORATION_ITALIC = "italic";

  CCConstants.FONT_DECORATION_EMPTY = "none";
  CCConstants.FONT_ATTRIBUTE_INHERIT = "inherit";
  CCConstants.FONT_ATTRIBUTE_NORMAL = "normal";
  CCConstants.FONT_SLIDER_DEFAULT_PERCENT_MIN = 25;
  CCConstants.FONT_SLIDER_DEFAULT_PERCENT_MAX = 300;
  CCConstants.FONT_SLIDER_DEFAULT_PX_MIN = 4;
  CCConstants.FONT_SLIDER_DEFAULT_PX_MAX = 50;

  CCConstants.BUTTON_SIZE_LARGE = 'large';
  CCConstants.BUTTON_SIZE_MEDIUM = 'medium';
  CCConstants.BUTTON_SIZE_SMALL = 'small';
  CCConstants.BUTTON_SIZE_EXTRA_SMALL = 'extraSmall';

  CCConstants.BUTTON_RADIUS_MIN = 0;
  CCConstants.BUTTON_RADIUS_MAX = 25;

  CCConstants.FONT_ATTRIBUTE_FAMILY = "font-family";
  CCConstants.FONT_ATTRIBUTE_TEXT_ALIGN = "text-align";
  CCConstants.FONT_ATTRIBUTE_COLOR = "color";
  CCConstants.FONT_ATTRIBUTE_FONT_STYLE = "font-style";
  CCConstants.FONT_ATTRIBUTE_FONT_WEIGHT = "font-weight";
  CCConstants.FONT_ATTRIBUTE_FONT_TEXT_DECORATION = "text-decoration";
  CCConstants.FONT_ATTRIBUTE_FONT_SIZE = "font-size";
  CCConstants.FONT_ATTRIBUTE_LINE_HEIGHT = "line-height";
  CCConstants.FONT_ATTRIBUTE_PIXELS = "px";
  CCConstants.FONT_ATTRIBUTE_PERCENT = "%";
  CCConstants.FONT_ATTRIBUTE_REM = "rem";

  CCConstants.FONT_DEFAULT_COLOR = '#000000';
  CCConstants.FONT_DEFAULT_FAMILY = 'serif';
  CCConstants.FONT_DEFAULT_SIZE_PX = 16;
  CCConstants.FONT_DEFAULT_SIZE_PERCENT = 100;
  CCConstants.FONT_ALIGNMENT_LEFT = "left";
  CCConstants.FONT_ALIGNMENT_CENTE = "center";
  CCConstants.FONT_ALIGNMENT_RIGHT = "right";

  CCConstants.FONT_SPACING_100 = "100";
  CCConstants.FONT_SPACING_SINGLE = "single";
  CCConstants.FONT_SPACING_DOUBLE = "double";
  CCConstants.FONT_SPACING_1_5 = "1.5";

  CCConstants.FONT_FAMILY_SANS_SERIF_VAR = "@sansFontFamily";
  CCConstants.FONT_FAMILY_SANS_SERIF_VALUE = "'Helvetica Neue', Helvetica, Arial, sans-serif";
  CCConstants.FONT_FAMILY_SERIF_VAR = "@serifFontFamily";
  CCConstants.FONT_FAMILY_SERIF_VALUE = "Georgia, 'Times New Roman', Times, serif";

  CCConstants.VERTICAL_ALIGNMENT_MIDDLE = "middle";
  CCConstants.HORIZONTAL_ALIGNMENT_LEFT = "left";
  CCConstants.HORIZONTAL_ALIGNMENT_CENTER = "center";
  CCConstants.HORIZONTAL_ALIGNMENT_RIGHT = "right";

  CCConstants.LINE_BREAK = "line-break";
  CCConstants.FRAGMENT_TYPE_FRAGMENT = "fragment";
  CCConstants.FRAGMENT_TYPE_CONTAINER = "container";
  CCConstants.FRAGMENT_TYPE_HIDDEN = "hidden";
  CCConstants.FRAGMENT_TYPE_INSTANCE = "instance";
  CCConstants.FRAGMENT_NAME_GENERIC_TEXT = "generic-text";
  CCConstants.FRAGMENT_CONFIG_NAV_AVAILABLE = "navAvailable";
  CCConstants.FRAGMENT_CONFIG_AVAILABLE = "available";
  CCConstants.FRAGMENT_CONFIG_ACTUAL = "actual";
  CCConstants.FRAGMENT_CONFIG_CURRENT_CONFIG = "currentConfig";
  CCConstants.FRAGMENT_CONFIG_PREVIEW = "preview";
  CCConstants.FRAGMENT_CONFIG_IMAGE = "image";
  CCConstants.FRAGMENT_CONFIG_PADDING = "padding";
  CCConstants.FRAGMENT_CONFIG_RICH_TEXT = "richText";
  CCConstants.FRAGMENT_CONFIG_ELEMENT_NAME = "elementName";
  CCConstants.FRAGMENT_CONFIG_DEFAULT_HANDLER = "defaultHandler";
  CCConstants.FRAGMENT_CONFIG_BORDER = "border";
  CCConstants.FRAGMENT_CONFIG_COLLECTION_PICKER = "collectionPicker";
  CCConstants.FRAGMENT_MAX_CHILDREN = 20;

  CCConstants.FRAGMENT_CONFIG_VALUES = "values";
  CCConstants.FRAGMENT_IMAGE_CONFIG = "imageConfig";
  CCConstants.FRAGMENT_PADDING_CONFIG = "paddingConfig";
  CCConstants.FRAGMENT_RICH_TEXT_CONFIG = "richTextConfig";
  CCConstants.FRAGMENT_BORDER_CONFIG = "borderConfig";
  CCConstants.FRAGMENT_HORIZONTAL_ALIGNMENT_CONFIG = "horizontalAlignmentConfig";
  CCConstants.FRAGMENT_COLLECTION_CONFIG = "collectionConfig";

  CCConstants.REPOSITORY_STRING_MAX_LENGTH = 250;
  CCConstants.REPOSITORY_ID_GLUE = '-DOM_COMPATIBLE_REPOSITORY_ID_GLUE---';

  CCConstants.PRODUCT_TITLE = 'product-title';
  CCConstants.WRAPPER_TAG = 'wrapperTag';

  CCConstants.WIDGET_TYPE_WEB_CONTENT = 'webContent';

  CCConstants.PROFILE_LOGIN = "login";
  CCConstants.PROFILE_EMAIL = "email";
  CCConstants.PROFILE_ACTIVE = "active";
  CCConstants.PROFILE_PASSWORD = "password";
  CCConstants.PROFILE_FIRST_NAME = "firstName";
  CCConstants.PROFILE_LAST_NAME = "lastName";
  CCConstants.PROFILE_RECEIVE_EMAIL = "receiveEmail";
  CCConstants.PROFILE_SHIPPING_ADDRESS = "shippingAddress";
  CCConstants.PROFILE_SHIPPING_ADDRESSES = "shippingAddresses";
  CCConstants.PROFILE_OLD_PASSWORD = "oldPassword";
  CCConstants.PROFILE_NEW_PASSWORD = "newPassword";
  CCConstants.PROFILE_CONFIRM_PASSWORD = "newConfirmPassword";
  CCConstants.PROFILE_LOCALE = "locale";
  CCConstants.CHECKOUT_PROFILE_DEFAULT_MESSAGE_INTERVAL = 2000;
  CCConstants.PROFILE_UNAUTHORIZED_DEFAULT_TIMEOUT = 500;
  CCConstants.ACCOUNT_ACCESS_ERROR_CODE = "60011";

  CCConstants.TIME = "time";
  CCConstants.SHORT = "short";
  CCConstants.MEDIUM = "medium";
  CCConstants.LONG = "long";
  CCConstants.FULL = "full";
  CCConstants.DEFAULT_LANG = 'en';

  CCConstants.LESS_ATTR_PREFIX          = "@";
  CCConstants.LESS_ATTR_FONT_SIZE       = "FontSize";
  CCConstants.LESS_ATTR_FONT_WEIGHT     = "FontWeight";
  CCConstants.LESS_ATTR_FONT_FAMILY     = "FontFamily";
  CCConstants.LESS_ATTR_FONT_STYLE      = "FontStyle";
  CCConstants.LESS_ATTR_LINE_HEIGHT     = "LineHeight";
  CCConstants.LESS_ATTR_TEXT_ALIGN      = "TextAlign";
  CCConstants.LESS_ATTR_TEXT_COLOR      = "TextColor";
  CCConstants.LESS_ATTR_TEXT_DECORATION = "TextDecoration";

  CCConstants.LESS_ATTR_BACKGROUND_IMAGE_URL = 'BackgroundImageURL';
  CCConstants.LESS_ATTR_BACKGROUND_IMAGE_REPEAT = 'BackgroundImageRepeat';
  CCConstants.LESS_ATTR_BACKGROUND_IMAGE_POSITION = 'BackgroundImagePosition';
  CCConstants.LESS_ATTR_BACKGROUND_IMAGE_ATTACHMENT = 'BackgroundImageAttachment';
  CCConstants.LESS_ATTR_BACKGROUND_COLOR = 'BackgroundColor';
  CCConstants.LESS_ATTR_BACKGROUND_COLOR_TOP = 'BackgroundColorTop';
  CCConstants.LESS_ATTR_BACKGROUND_COLOR_BOTTOM = 'BackgroundColorBottom';

  // Less attributes for colors
  CCConstants.SITE_PAGE_BACKGROUND_COLOR                          = "@SitePageBackgroundColor";

  CCConstants.LESS_ATTR_LINK_COLOR                                = "@LinkColor";
  CCConstants.LESS_ATTR_LINK_HOVER_COLOR                          = "@LinkHoverColor";
  CCConstants.LESS_ATTR_LINK_VISITED_COLOR                        = "@LinkVisitedColor";

  CCConstants.LESS_ATTR_BUTTON_PRIMARY_SIZE                       = "@ButtonPrimarySize";
  CCConstants.LESS_ATTR_BUTTON_PRIMARY_BORDER_RADIUS              = "@ButtonPrimaryBorderRadius";
  CCConstants.LESS_ATTR_BUTTON_PRIMARY_BACKGROUND_COLOR           = "@ButtonPrimaryBackgroundColor";
  CCConstants.LESS_ATTR_BUTTON_PRIMARY_TEXT_COLOR                 = "@ButtonPrimaryTextColor";
  CCConstants.LESS_ATTR_BUTTON_PRIMARY_FONT_FAMILY                = "@ButtonPrimaryFontFamily";
  CCConstants.LESS_ATTR_BUTTON_PRIMARY_FONT_WEIGHT                = "@ButtonPrimaryFontWeight";
  CCConstants.LESS_ATTR_BUTTON_PRIMARY_FONT_STYLE                 = "@ButtonPrimaryFontStyle";
  CCConstants.LESS_ATTR_BUTTON_PRIMARY_TEXT_DECORATION            = "@ButtonPrimaryTextDecoration";
  CCConstants.LESS_ATTR_BUTTON_PRIMARY_USE_GRADIENT               = "@ButtonPrimaryUseGradient";

  CCConstants.LESS_ATTR_BUTTON_SECONDARY_SIZE                     = "@ButtonSecondarySize";
  CCConstants.LESS_ATTR_BUTTON_SECONDARY_BORDER_RADIUS            = "@ButtonSecondaryBorderRadius";
  CCConstants.LESS_ATTR_BUTTON_SECONDARY_BACKGROUND_COLOR         = "@ButtonSecondaryBackgroundColor";
  CCConstants.LESS_ATTR_BUTTON_SECONDARY_TEXT_COLOR               = "@ButtonSecondaryTextColor";
  CCConstants.LESS_ATTR_BUTTON_SECONDARY_FONT_FAMILY              = "@ButtonSecondaryFontFamily";
  CCConstants.LESS_ATTR_BUTTON_SECONDARY_FONT_WEIGHT              = "@ButtonSecondaryFontWeight";
  CCConstants.LESS_ATTR_BUTTON_SECONDARY_FONT_STYLE               = "@ButtonSecondaryFontStyle";
  CCConstants.LESS_ATTR_BUTTON_SECONDARY_TEXT_DECORATION          = "@ButtonSecondaryTextDecoration";
  CCConstants.LESS_ATTR_BUTTON_SECONDARY_USE_GRADIENT             = "@ButtonSecondaryUseGradient";

  CCConstants.LESS_ATTR_NAVBAR_BACKGROUND_COLOR                   = "@NavbarBackgroundColor";
  CCConstants.LESS_ATTR_NAVBAR_BACKGROUND_HOVER_COLOR             = "@NavbarBackgroundHoverColor";
  CCConstants.LESS_ATTR_NAVBAR_LINK_COLOR                         = "@NavbarLinkColor";
  CCConstants.LESS_ATTR_NAVBAR_LINK_HOVER_COLOR                   = "@NavbarLinkHoverColor";
  CCConstants.LESS_ATTR_NAVBAR_TEXT_COLOR                         = "@NavbarTextColor";

  CCConstants.LESS_ATTR_SUBNAVIGATION_BACKGROUND_COLOR            = "@SubNavigationBackgroundColor";
  CCConstants.LESS_ATTR_SUBNAVIGATION_BACKGROUND_HOVER_COLOR      = "@SubNavigationBackgroundHoverColor";
  CCConstants.LESS_ATTR_SUBNAVIGATION_LINK_COLOR                  = "@SubNavigationLinkColor";
  CCConstants.LESS_ATTR_SUBNAVIGATION_LINK_HOVER_COLOR            = "@SubNavigationLinkHoverColor";
  CCConstants.LESS_ATTR_SUBNAVIGATION_TEXT_COLOR                  = "@SubNavigationTextColor";
  CCConstants.LESS_ATTR_MOBILE_NAV_BAR_BUTTON_COLOR               = "@mobileNavBarButtonColor";

  CCConstants.SHIPPING_ADDRESS_FOR_METHODS = "shippingAddress";
  CCConstants.POPULATE_SHIPPING_METHODS = "populateShippingMethods";
  CCConstants.SHIPPING_GROUP_TYPE = "shippingGroupType";
  CCConstants.SHIPPING_METHOD_ENABLED = "enabledOnly";
  CCConstants.PRODUCT_IDS_FOR_SHIPPING = "productIdForShippingSurcharge";
  CCConstants.SHIPPING_GROUPS = "shippingGroups";
  CCConstants.SHIPPING_METHOD = "shippingMethod";

  CCConstants.GV_MAX_COLS = 12;
  CCConstants.GV_COL_CLASS_PREFIX = "col-md-";
  CCConstants.GV_CONTAINER_CLASS = "cc-gv-container";
  CCConstants.GV_WIDGET_CLASS = "cc-gv-widget";
  CCConstants.GV_ROW_CLASS = "cc-gv-row";
  CCConstants.GV_ROW_HEADER_CLASS = "cc-gv-row-heading";
  CCConstants.GV_TOOLBOX_ID = "cc-gv-toolbox";
  CCConstants.TOOLBOX_CLASS = "cc-toolbox";
  CCConstants.RESIZE_LOCATION_EAST = "e";
  CCConstants.RESIZE_LOCATION_WEST = "w";
  CCConstants.GV_ACTION_RESIZE = 1;
  CCConstants.GV_ACTION_INSERT = 2;
  CCConstants.GV_ACTION_APPEND = 3;
  CCConstants.GV_ACTION_DELETE = 4;
  CCConstants.GV_ACTION_DELETE_ACTIVE = 5;

  CCConstants.INCLUDE_WIDGETS_AVAILABLE_TO_ALL_QUERY_PARAM = "includeWidgetsAvailableToAll";

  CCConstants.PAGE_TYPE_CART = "cart";
  CCConstants.PAGE_TYPE_CHECKOUT = "checkout";
  CCConstants.PAGE_TYPE_CONFIRMATION = "confirmation";

  CCConstants.THEME_TYPE_PARAM = "type";
  CCConstants.THEME_TYPE_PURCHASED = "purchased";
  CCConstants.THEME_TYPE_CUSTOM = "custom";

  CCConstants.THEME_SOURCE_ADDITIONAL_STYLES = "additionalStyles";

  CCConstants.WIDGET_CONFIG_SECTION_TITLE_TYPE = 'sectionTitle';
  CCConstants.WIDGET_CONFIG_STRING_TYPE = "text";
  CCConstants.WIDGET_CONFIG_BOOLEAN_TYPE = "checkbox";
  CCConstants.WIDGET_CONFIG_OPTION_TYPE = "option";
  CCConstants.WIDGET_CONFIG_MULTI_SELECT_OPTION_TYPE = "multiSelectOption";
  CCConstants.WIDGET_CONFIG_COUNTRY_PICKER_TYPE = "countryPicker";
  CCConstants.WIDGET_CONFIG_PASSWORD_TYPE = "password";
  CCConstants.WIDGET_CONFIG_COLOR_TYPE = "color";
  CCConstants.WIDGET_CONFIG_MEDIA_TYPE = "media";
  CCConstants.WIDGET_CONFIG_COLLECTION_TYPE = "collection";

  CCConstants.WIDGET_DESCRIPTOR_JAVASCRIPT_UGLIFY_ERROR = "33043";

  CCConstants.CREATE_PROFILE_USER_EXISTS = "22006";
  CCConstants.USER_PROFILE_OLD_PASSWORD_INCORRECT = "23029";
  CCConstants.USER_PROFILE_PASSWORD_POLICIES_ERROR = "23024";
  CCConstants.USER_PROFILE_SHIPPING_UPDATE_ERROR = "23030";
  CCConstants.USER_PROFILE_INTERNAL_ERROR = "23001";

  CCConstants.UPDATE_EXPIRED_PASSWORD_OLD_PASSWORD_INCORRECT = "23034";
  CCConstants.USER_EXPIRED_PASSWORD_POLICIES_ERROR = "23033";

  CCConstants.INVALID_SHIPPING_COUNTRY_STATE = "28128";
  CCConstants.INVALID_SHIPPING_METHOD = "28088";

  CCConstants.VISIT_ID = "visitId";
  CCConstants.VISITOR_ID = "visitorId";
  CCConstants.CUSTOM = "custom";

  CCConstants.INVENTORY_TYPE_PARAM = "type";
  CCConstants.INVENTORY_PRODUCT_TYPE = "product";
  CCConstants.INVENTORY_VARIANT_TYPE = "variant";

  CCConstants.COUPON_APPLY_ERROR_DUPLICATE_CODE = "duplicateCoupon";
  CCConstants.COUPON_STATUS_CLAIMED = "claimed";
  CCConstants.COUPON_STATUS_UNCLAIMED = "unclaimed";
  CCConstants.PROMOTION_APPLIED = true;
  CCConstants.PROMOTION_NOT_APPLIED = false;
  CCConstants.COUPON_APPLY_ERROR = "28326";
  CCConstants.COUPON_LIMIT_EXCEED = "28346";

  CCConstants.FIELDS_QUERY_PARAM = "fields";
  CCConstants.EXPAND_QUERY_PARAM = "expand";

  CCConstants.COLLECTION_UPDATE_PRODUCTS_TYPE_PARAM = "type";
  CCConstants.COLLECTION_APPEND_PRODUCTS_TYPE = "appendProducts";
  CCConstants.COLLECTION_UPDATE_PRODUCTS_TYPE = "updateProducts";

  CCConstants.ORDER_PRICE_CHANGED = "28327";
  CCConstants.EXTERNAL_PRICE_CHANGED="51003";
  CCConstants.EXTERNAL_PRICE_PARTIAL_FAILURE_ERROR="51002";

  CCConstants.ENDPOINT_GET_EMAIL_SERVICE_DATA  = "getEmailServiceData";
  CCConstants.ENDPOINT_SET_EMAIL_SERVICE_DATA  = "setEmailServiceData";
  CCConstants.ENDPOINT_TEST_SMTP_CONNECTION  = "testSmtpConnection";

  CCConstants.PAGE_ADDRESS_STRING_MAX_LENGTH = 100;

  CCConstants.PROMOTION_ITEM_DISCOUNT_TYPE = 0;
  CCConstants.PROMOTION_SHIPPING_DISCOUNT_TYPE = 5;
  CCConstants.PROMOTION_ORDER_DISCOUNT_TYPE = 9;

  CCConstants.SELECTED_CURRENCY_NOT_FOUND = "20186";

  CCConstants.CREATE_ORDER_PRODUCT_NOT_FOUND = "28102";
  CCConstants.CREATE_ORDER_SKU_NOT_FOUND = "28129";
  CCConstants.GET_PRODUCT_NO_PRODUCT_FOUND = "20031";
  CCConstants.GET_SKU_NO_SKU_FOUND = "26060";
  CCConstants.LIST_PRODUCTS_INVALID_COLLECTION = "20140";
  CCConstants.STOCK_LIMIT_EXCEEDED = "28104";
  CCConstants.ORDER_CANNOT_BE_UPDATED = "20140";
  CCConstants.PROCESS_COMPLETION_FAILED_CODE = "28347";
  CCConstants.PROCESS_COMPLETION_FAILED = "processCompletionFailed";
  CCConstants.PAYMENT_REVERSAL_FAILED_CODE = "28348";
  CCConstants.PAYMENT_REVERSAL_FAILED = "paymentReversalFailed";
  CCConstants.PRODUCT_NOT_FOR_INDIVIDUAL_SALE="28155";
  CCConstants.CONFIGURABLE_PRODUCTS_NOT_ALLOWED_FAILURE_CODE = "28360";
  CCConstants.INVENTORY_CONFIGURABLE_ITEM_CHECK_ERROR = "25137";

  /**
   * CC Agent Application constants
   */

  CCConstants.PROFILE_TYPE_AGENT = "agentUI";

  CCConstants.ORDER_ID = "orderId";
  CCConstants.ORDER_STATE = "state";
  CCConstants.ORDER_SEARCH_START_DATE = "startDate";
  CCConstants.ORDER_SEARCH_END_DATE = "endDate";
  CCConstants.ORDER_ACCOUNT = "account";
  CCConstants.ADDRESS_PHONE = "addressPhone";

  CCConstants.PROFILE_ID = "profileId";
  CCConstants.COMMENT = "comment";
  CCConstants.PAGE_NUMBER = "pageNumber";
  CCConstants.ADDRESS_FIRST_NAME = "AddressFirstName";
  CCConstants.ADDRESS_LAST_NAME = "AddressLastName";
  CCConstants.ADDRESS_COUNTRY = "AddressCountry";
  CCConstants.ADDRESS_ADDRESS_LINE1 = "AddressAddressLine1";
  CCConstants.ADDRESS_ADDRESS_LINE2 = "AddressAddressLine2";
  CCConstants.ADDRESS_CITY = "AddressCity";
  CCConstants.ADDRESS_STATE = "AddressState";
  CCConstants.ADDRESS_POSTAL_CODE = "AddressPostalCode";
  CCConstants.BILLING = "billing";
  CCConstants.SHIPPING = "shipping";

  CCConstants.USER_ROLE_ADMIN = "adminRole";
  CCConstants.USER_ROLE_AGENT_SUPERVISOR = "csAgentSupervisorRole";

  CCConstants.SEARCH_CREATED_IN_LAST_FIELD_MAXIMUM_VALUE = 999;
  CCConstants.Q = "q";
  CCConstants.PARAM_QUERY_FORMAT_SCIM = "SCIM";
  CCConstants.PARAM_QUERY_FORMAT = "queryFormat";

  CCConstants.GET_VALID_ACTIONS = "getValidActions";
  CCConstants.CANCEL = "cancel";
  CCConstants.INCLUDE_RESULT = "includeResult";
  CCConstants.INCLUDE_RESULT_FULL = "full";
  CCConstants.CANCEL_REASON = "cancelReason";
  CCConstants.INVALIDATE = "invalidateOrder";
  CCConstants.INCLUDE_DELETED = "includeDeleted";

  CCConstants.DEPTH_MIN = "min";
  CCConstants.CATALOG_MAXLEVEL_1000 = "1000";
  CCConstants.EXPAND_CHILD_CATEGORIES = "childCategories";
  CCConstants.SELECTED_CATEGORY_DETAILS = "selectedCategoryDetails";
  CCConstants.LIST_TYPE_PRODUCT = "product";
  CCConstants.MEGA_MENU_NAME = "cc-categoryNav";
  CCConstants.ENDPOINT_COLLECTIONS_GET_CATEGORY_INFORMATION = "getCategoryData";

  CCConstants.ENDPOINT_GET_USERPROFILE_BY_ID = "getProfileByID";
  CCConstants.ENDPOINT_GET_ORDER = "getOrder";
  CCConstants.ENDPOINT_GET_ORDERS_COUNT = "getOrdersCount";
  CCConstants.ENDPOINT_GET_RETURN_REQUESTS_COUNT = "getReturnsCount";
  CCConstants.ENDPOINT_GET_INITIAL_ORDER = "getInitialOrder";

  CCConstants.ENDPOINT_ORDERS_ORDER_STATES = "getOrderStates";
  CCConstants.ENDPOINT_LIST_COUNTRIES = "listShippingCountries";

  CCConstants.ENDPOINT_SEARCH_CUSTOMERS = "searchProfiles";
  CCConstants.ENDPOINT_ORDERS_SEARCH = "searchOrders";
  CCConstants.ENDPOINT_GET_CUSTOMER = "getProfile";
  CCConstants.ENDPOINT_UPDATE_CUSTOMER = "updateProfile";
  CCConstants.ENDPOINT_CREATE_COMMENT = "createComment";
  CCConstants.ENDPOINT_GET_COMMENTS = "getComments";

  CCConstants.ENDPOINT_HANDLE_ORDER_ACTIONS = "handleOrderActions";
  CCConstants.ENDPOINT_LIST_CANCEL_REASONS = "listCancelReasons";
  CCConstants.SEND_PLACED_ORDER_EMAIL_NOTIFICATION = "sendPlacedOrderEmailNotification";

  CCConstants.ENDPOINT_GET_RETURN_STATES = "getReturnStates";
  CCConstants.ENDPOINT_SEARCH_RETURN_REQUESTS = "searchReturns";
  CCConstants.ENDPOINT_RETURN_ORDER_REASONS = "getReturnReasons";
  CCConstants.ENDPOINT_RETURN_REQUEST = "initiateReturn";
  CCConstants.ENDPOINT_RECEIVE_RETURN_REQUEST  = "getReturnRequest";
  CCConstants.ENDPOINT_UPDATE_RETURN_REQUEST = "updateReturnRequest";
  CCConstants.ENDPOINT_RETURN_ORDER_DISPOSITION_REASONS = "getDispositionReasons";
  CCConstants.ENDPOINT_PRICEOVERRIDE_REASONS = "getPriceOverrideReasons";

  CCConstants.AGENT_SHOPPER_TYPES = "userProfileProperties";
  CCConstants.ENDPOINT_SHOPPER_TYPE = "getShopperType";
  CCConstants.ENDPOINT_SHOPPER_TYPE_PARAM = "user";

  CCConstants.AGENT_ORDER_TYPES = "userOrderProperties";
  CCConstants.ENDPOINT_ORDER_TYPE = "getOrderType";
  CCConstants.ENDPOINT_ORDER_TYPE_PARAM = "order";

  CCConstants.ENDPOINT_COMMERCE_ITEM_TYPE_PARAM = "commerceItem";

  CCConstants.ENDPOINT_GET_POSTS = "getPosts";

  CCConstants.ENDPOINT_HANDLE_POST_CREATION = "createPost";
  CCConstants.ENDPOINT_DELETE_POST = "deletePost";
  CCConstants.ENDPOINT_HANDLE_POST_UPDATES = "handlePostUpdates";

  CCConstants.POST_MAX_ALLOWED_CHARACTERS = 4000;
  CCConstants.LINK_URL_MAX_ALLOWED_CHARACTERS = 254;

  CCConstants.ENDPOINT_UPDATE_POST_OP = "updatePost";

  CCConstants.ENDPOINT_CREATE_EXCHANGE_REQUEST ="createExchangeRequest";
  CCConstants.CREATE_EXCHANGE_REQUEST_OP = "createExchangeRequest";
  CCConstants.SUBMIT_EXCHANGE_ORDER_OP = "submitExchangeOrder";
  CCConstants.PROCESS_EXCHANGES_REQUEST = "processExchangeRequest";

  CCConstants.TRANSACTION_TYPE_AUTHORIZATION = "authorization";
  CCConstants.PAYMENT_METHOD = 'card';
  CCConstants.UNSIGNED_FIELDS = 'card_number';
  CCConstants.AMOUNT_REMAINING = "amountRemaining";

  CCConstants.INITIATE_AMENDMENT_OP = "initiateAmendment";
  CCConstants.CHECK_AMENDMENT_INPROGRESS_OP = "checkAmendmentInProgress";
  CCConstants.PRICE_ORDER_AMENDMENT_OP = "priceOrderAmendment";
  CCConstants.PRE_AUTORIZE_ORDER_AMENDMENT_OP = "preAuthorizeAmendOrder";

  CCConstants.CONTINUE_WITH_EXISTING_EDIT = "continueWithInProgressEdit";

  CCConstants.ENDPOINT_REMOVE_ORDER_AMENDMENT = "removeOrderAmendment";
  CCConstants.ENDPOINT_SUBMIT_ORDER_AMENDMENT = "submitOrderAmendment";
  CCConstants.ENDPOINT_AMEND_ORDER = "handleOrderAmendment";

  CCConstants.VALID_ACTIONS = "validActions";
  CCConstants.VALIDATE_PAYMENT_AUTHORIZATIONS = "validatePaymentAuthorization";
  CCConstants.VALIDATE_ORDER = "validateOrder";

  CCConstants.PRICE_ORDER_INCOMPLETE_OP = "priceOrder";
  CCConstants.PRE_AUTORIZE_ORDER = "preAuthorizeOrder";
  CCConstants.SUBMIT_ORDER_OP = "submitOrder";
  CCConstants.ENDPOINT_PRICE_INCOMPLETE_ORDER = "priceOrderForCreate";
  CCConstants.ENDPOINT_LIST_PRODUCT_VARIANTS = "listProductVariants";
  CCConstants.TRANSACTION_TYPE_FOR_CREATE = "authorization,create_payment_token";

  CCConstants.AGENT_CATALOG_PAGE_HASH = "/catalog";
  CCConstants.AGENT_CATALOG_PAGE_CONTEXT = "catalog";
  CCConstants.AGENT_CATALOG_CATEGORY_CONTEXT = "category";
  CCConstants.AGENT_CATALOG_PRODUCT_CONTEXT = "product";
  CCConstants.AGENT_CATALOG_SEARCH_RESULTS_PAGE_HASH = "/catalog/searchresults";
  CCConstants.AGENT_CATALOG_PRODUCT_HASH = "#!/catalog/product?id=";
  CCConstants.AGENT_CUSTOMERS_HISTORY_HASH = "#/customers/history";
  CCConstants.AGENT_CUSTOMERS_PROFILE_HASH = "#/customers/profile";
  CCConstants.AGENT_PARAM_CUSTOMER_ID = "customerId";
  CCConstants.AGENT_BASE_CONTEXT = "/occs-agent";
  CCConstants.SEARCH_RESULTS = "searchresults";
  CCConstants.CATEGORY_CONTEXT = "category";

  CCConstants.NO_SEARCH_RESULTS = "noSearchResults";
  CCConstants.NO_SEARCH_RESULTS_CONTEXT = "/catalog/noSearchResults";

  CCConstants.AGENT_CUSTOMERS_HISTORY_CONTEXT = "history";
  CCConstants.AGENT_CUSTOMERS_PROFILE_CONTEXT = "profile";
  CCConstants.AGENT_CUSTOMERS_SCHEDULED_ORDERS_CONTEXT = "scheduledOrders";
  CCConstants.AGENT_SEARCH_CONTEXT = "search";

  CCConstants.AGENT_ORDERS_VIEW_OPERATION = "view";
  CCConstants.AGENT_ORDERS_EDIT_OPERATION = "edit";
  CCConstants.AGENT_ORDERS_HAS_INCOMPLETE_ORDER = "hasIncompleteOrder";
  CCConstants.AGENT_ORDERS_CONTINUE_EDIT = "continueEdit";
  CCConstants.AGENT_ORDERS_CREATE_OPERATION = "create";
  CCConstants.VALID_ROLE_FOR_PRICE_OVERRIDE = "csAgentSupervisorRole";
  CCConstants.ENABLE_RECEIVE_EMAIL = "yes";
  CCConstants.DISABLE_RECEIVE_EMAIL = "no";

  CCConstants.AGENT_ORDERS_CACHE_TYPE = "orders";
  CCConstants.AGENT_CUSTOMERS_CACHE_TYPE = "customers";
  CCConstants.AGENT_ORDERS_EDIT_CACHE_TYPE = "edit";
  CCConstants.AGENT_ORDERS_CREATE_CACHE_TYPE = "create";

  CCConstants.RETURN_REQUEST_ID = "returnRequestId";
  CCConstants.DAYS_OF_WEEK="daysOfWeek";
  CCConstants.MONTHS_IN_YEAR="monthsInYear";
  CCConstants.WEEKS_IN_MONTH="weeksInMonth";
  CCConstants.OCCURRENCE_IN_DAY="occurrenceInDay";
  CCConstants.DAYS_IN_MONTH="daysInMonth";
  CCConstants.ADJUST_REFUND_AMOUNTS = "adjustRefundAmounts";
  CCConstants.ADJUSTED_ITEM_REFUND = "adjustedItemRefund";
  CCConstants.RETURN_ITEM_ID = "returnItemId";
  CCConstants.RETURN_ITEMS = "returnItems";
  CCConstants.RETURN_REASON = "returnReason";
  CCConstants.QUANTITY_TO_RETURN = "quantityToReturn";
  CCConstants.CATALOGREF_ID = "catRefId";
  CCConstants.SHIPPING_GROUP_ID = "shippingGroupId";
  CCConstants.CREATE_RETURN_REQUEST = "create";
  CCConstants.PROCESS_RETURN_REQUEST = "process";
  CCConstants.REFUND_FOR_RETURN = "refund";
  CCConstants.SHOW_RETURN_REQUEST = "showReturnRequest";
  CCConstants.CALCULATE_REFUND_AMOUNTS = "calculateRefundAmounts";
  CCConstants.RECEIVE_RETURNS = "receiveReturns";
  CCConstants.QUANTITY_RECEIVED = "quantityReceived";
  CCConstants.DISPOSITION_REASON = "dispositionReason";
  CCConstants.SHOW_RETURN_REQUEST = "showReturnRequest";
  CCConstants.PROCESS_EXCHANGE_ORDER_OP = "processExchangeOrder";
  CCConstants.CREATE_RETUN_REQUEST_OP = "createReturnRequest";
  CCConstants.FULL_RETURN_STATUS = "Full return";
  CCConstants.ADJUSTED_SHIPPING_REFUND = "adjustedShippingRefund";
  CCConstants.ADJUSTED_SHIPPING_SURCHARGE_REFUND = "adjustedShippingSurchargeRefund";
  CCConstants.ADJUSTED_TAX_REFUND = "adjustedTaxRefund";
  CCConstants.RETURN_FEE = "returnFee";
  CCConstants.OTHER_REFUND = "otherRefund";
  CCConstants.INITIATE_REFUND_FOR_RETURN = "initiateRefund";
  CCConstants.VALID_ROLE_FOR_INITIATE_REFUND = "csAgentSupervisorRole";
  CCConstants.REPLACEMENT_SKU_ID = "replacementSkuId";
  CCConstants.PROCESS_EXCHANGE_REQUEST = "processExchangeRequest";
  CCConstants.MARK_MANUAL_REFUND = "markManualRefund";
  CCConstants.RETURN_MARK_AS_COMPLETE = "markAsComplete";
  CCConstants.MANUAL_REFUND_AMOUNT = "manualRefundAmount";

  CCConstants.AGENT_CATALOG_SEARCH_KEY = "action";
  CCConstants.AGENT_CREATE_ORDER_CACHE_KEY = "createOrder";
  CCConstants.AGENT_EDIT_ORDER_CACHE_KEY = "editOrder";

  // get site configuration
  CCConstants.SITE_CONFIGURATION_URL = "/ccadminui/v1/sites/siteUS";
  CCConstants.SITE_DEFAULT_NO_IMAGE_URL = "/img/no-image.jpg";

  // get tenant
  CCConstants.ENDPOINT_TENANTS_GET_TENANT = "getTenantServiceData";

  //merchants
  CCConstants.ENDPOINT_MERCHANT_PUT_EXTERNALDATA = "updateExternalServicesData";
  CCConstants.ENDPOINT_MERCHANT_GET_EXTERNALDATA = "getExternalServiceData";

  //external data
  CCConstants.EXTERNALDATA_PRODUCTION_EXPERIMENTS = "production-Experiments";
  CCConstants.EXTERNALDATA_PRODUCTION_SOCIAL = "production-Social";
  CCConstants.EXTERNALDATA_PRODUCTION_RECS = "production-Recommendations";
  CCConstants.EXTERNALDATA_PREVIEW_FACEBOOK = "publishing-Facebook";
  CCConstants.EXTERNALDATA_PRODUCTION_FACEBOOK = "production-Facebook";

  // wishlist
  CCConstants.GENERATE_STATIC_WISHLIST_PAGE = "generateStaticWishlistPage";

  CCConstants.EMAIL_TEMPLATE_DOWNLOAD_URL = "/ccadminui/v1/email/types";
  CCConstants.EMAIL_TEMPLATES_RESOURCE = "templates";
  CCConstants.EMAIL_TEMPLATES_UPLOAD_LOCATION = "/notifications/uploads/";
  CCConstants.ENDPOINT_UPDATE_EMAIL_TEMPLATES = "updateEmailTemplates";
  CCConstants.FILENAME = "filename";
  CCConstants.VIRUS_SCAN_FAILED = "VIRUS_SCAN_FAILED";
  CCConstants.MALFORMED = "MALFORMED";

  CCConstants.LAYOUTS_EXPORT_BASE_URL = "/ccadminui/v1/assetPackages";

  // file assets
  CCConstants.ENDPOINT_GET_MEDIA_CONTENTS= "/ccadminui/v1/files/mediaContents";
  CCConstants.ENDPOINT_GET_FILE_URI = "getFileURI";

  // resources
  CCConstants.ENDPOINT_RESOURCES_GET_BUNDLE = "getResourceBundle";
  CCConstants.RESOURCES_KEY = "resources";
  CCConstants.ERRORS_KEY = "errorCode";

  CCConstants.ENDPOINT_RESOURCES_GET_STRINGS = "getResourceStrings";
  CCConstants.ENDPOINT_RESOURCES_UPDATE_CUSTOM = "updateCustomTranslations";

  CCConstants.DELETE_KEY_CODE = 46;
  CCConstants.BACKSPACE_KEY_CODE = 8;

  CCConstants.ENDPOINT_SETTINGS_GET_REMORSE_PERIOD = "getRemorsePeriod";
  CCConstants.ENDPOINT_SETTINGS_SAVE_REMORSE_PERIOD = "saveRemorsePeriod";

  CCConstants.ENDPOINT_SETTINGS_GET_ITEM_PRICE_OVERRIDE_PROPERTIES = "getItemPriceOverride";
  CCConstants.ENDPOINT_SETTINGS_SET_ITEM_PRICE_OVERRIDE_PROPERTIES = "saveItemPriceOverride";
  CCConstants.ITEM_PRICE_OVERRIDE_ALLOWED = "itemPriceOverrideAllowed";
  CCConstants.IS_ITEM_PRICE_OVERRIDEN = "isPriceOverridden";
  CCConstants.OVERRIDEN_ITEM_PRICE = "overriddenPrice";
  CCConstants.ITEM_PRICE_OVERRIDE_ALLOWED_FOR_CREATE = "itemPriceOverrideAllowedForCreate";

  CCConstants.ENDPOINT_GET_CLOUD_CONFIGURATION = "getCloudConfiguration";

  CCConstants.INITIATE_EXCHANGE_REQUEST_OP = "initiateExchange";
  CCConstants.OPTION_NAME = "optionName";
  CCConstants.OPTION_VALUE = "optionValue";

  CCConstants.ORDERS_CONTEXT = "/orders/";
  CCConstants.RETURNS_CONTEXT = "/returns/";
  CCConstants.EXCHANGES_CONTEXT = "/exchanges/";
  CCConstants.RETURNS_PROCESS_TYPE = "Returns";
  CCConstants.EXCHANGE_PROCESS_TYPE = "Exchanges";
  CCConstants.ORDER_OP_INITIATE = "initiate";
  CCConstants.ORDER_OP_COMPLETE = "complete";
  CCConstants.PENDING_PAYMENTS = "PENDING_PAYMENT";
  CCConstants.PENDING_PAYMENT_TEMPLATE = "PENDING_PAYMENT_TEMPLATE";

  CCConstants.ORDERS_URL = "/orders";

  // complexPrice resources.
  CCConstants.LIST_VOLUME_PRICE = "listVolumePrice";
  CCConstants.LIST_VOLUME_PRICES = "listVolumePrices";
  CCConstants.PRODUCT_LIST_VOLUME_PRICE = "productListVolumePrices";
  CCConstants.SALE_VOLUME_PRICE = "saleVolumePrice";
  CCConstants.SALE_VOLUME_PRICES = "saleVolumePrices";
  CCConstants.PRODUCT_SALE_VOLUME_PRICE = "productSaleVolumePrices";
  CCConstants.BULK_PRICE = "bulkPrice";
  CCConstants.BULK_PRICE_TEXT = "Bulk";
  CCConstants.TIERED_PRICE_TEXT = "Tiered";
  CCConstants.TIERED_PRICE = "tieredPrice";
  CCConstants.PRODUCT_LIST_PRICE = "productListPrice";
  CCConstants.PRODUCT_SALE_PRICE = "productSalePrice";
  CCConstants.PRICING_SCHEME = "pricingScheme";
  CCConstants.LEVELS = "levels";
  CCConstants.LEVEL_MINIMUM = "levelMinimum";
  CCConstants.PRICE = "price";
  CCConstants.LIST_VOLUME_PRICE_SCHEME = "listVolumePriceScheme";
  CCConstants.SALE_VOLUME_PRICE_SCHEME = "saleVolumePriceScheme";
  CCConstants.PRODUCT_LIST_VOLUME_PRICE_SCHEME = "productListVolumePriceScheme";
  CCConstants.PRODUCT_SALE_VOLUME_PRICE_SCHEME = "productSaleVolumePriceScheme";
  CCConstants.LIST_VOLUME_PRICING_SCHEME = "listVolumePricingScheme";
  CCConstants.SALE_VOLUME_PRICING_SCHEME = "saleVolumePricingScheme";
  CCConstants.LIST_VOLUME_PRICE_TEXT = "listVolumePriceText";
  CCConstants.SALE_VOLUME_PRICE_TEXT = "saleVolumePriceText";
  CCConstants.LIST_PRICES_PROPERTY = "listPrices";
  CCConstants.SALE_PRICES_PROPERTY = "salePrices";
  CCConstants.FORMATTED_LIST_PRICE = "formattedListPrice";
  CCConstants.FORMATTED_PRODUCT_LIST_PRICE = "formattedProductListPrice";
  CCConstants.FORMATTED_SALE_PRICE = "formattedSalePrice";
  CCConstants.FORMATTED_PRODUCT_SALE_PRICE = "formattedProductSalePrice";
  CCConstants.SHIPPING_SURCHARGES_PROPERTY = "shippingSurcharges";
  CCConstants.FORMATTED_SHIPPING_SURCHARGE = "formattedShippingSurcharge";



  // Layout Region Types
  CCConstants.REGION_TYPE_HEADER = 100;
  CCConstants.REGION_TYPE_BODY = 101;
  CCConstants.REGION_TYPE_FOOTER = 102;

  // POST TYPES FOR CONVERSATIONS ENDPOINT
  CCConstants.POST_TYPE_ANNOUNCEMENT = "announcementPost";
  CCConstants.POST_TYPE_QUICK_LINK = "quickLinkPost";
  CCConstants.POSTS_DEFAULT_SORT_OPTION = "creationDate:desc";
  CCConstants.QUICK_LINK_DEFAULT_SORT_OPTION = "creationDate:desc";
  CCConstants.POSTS_TYPE_QUERY_PARAM = "type";
  CCConstants.POST_ACTIVE_STATUS_QUERY_PARAM = "active";
  CCConstants.REPOSITORY_MAX_FETCH_LIMIT = 250;
  CCConstants.CREDIT_CARD = "creditCard";
  CCConstants.ONLINE_REFUND_TYPE="onlinePaymentGroup";
  CCConstants.MANUAL_REFUND_TYPE="manualRefund";
  CCConstants.GIFT_CARD_REFUND_TYPE = "physicalGiftCard";
  CCConstants.MANUAL_REFUND_TEXT="Manual Refund";
  CCConstants.RETURN_CREDIT = "returnCredit";

  CCConstants.SHORT_DATE_FORMAT = "MM/DD/YYYY";
  CCConstants.OJET_INPUT_SHORT_DATE_FORMAT = "YYYY-MM-DD";

  CCConstants.OPERATION_MOVE = "move";
  CCConstants.PROPERTY_IMAGES = "images";

  CCConstants.INPUT = "input";
  //applications
  CCConstants.APPLICATION_NAME = "applicationName";
  CCConstants.REQUEST_CHANNEL = "requestChannel";
  CCConstants.APPLICATION_STOREFRONT = "storefront";
  CCConstants.APPLICATION_AGENT = "agent";
  CCConstants.APPLICATION_PREVIEW = "preview";

  // Pricing tax errors
  CCConstants.PRICING_TAX_REQUEST_ERROR = "40001";

  // Pricing user authentication eror
  CCConstants.PRICING_USER_AUTHENTICATION_ERROR = "60006000";


  //oject date-time formats
  CCConstants.DISPLAY_FORMAT_TYPE_DATE = 'date';
  CCConstants.DISPLAY_FORMAT_SHORT = 'short';
  CCConstants.DISPLAY_FORMAT_TYPE_DATE_OJET = 'date-ojet';
  CCConstants.DISPLAY_FORMAT_TYPE_NUMBER = 'number';

  // Generated repository ID regex
  CCConstants.GENERATED_REPOSITORY_ID_REGEX = /^[a-z]{2}[0-9]+$/;


  // Generated repository ID regex
  CCConstants.GENERATED_REPOSITORY_ID_REGEX = /^[a-z]{2}[0-9]+$/;

  // Ipad device string
  CCConstants.IPAD_STRING = /iPad/i;

  // fragment type
  CCConstants.ENTERED_TEXT_FRAGMENT_TYPE = "enteredTextFragment";
  CCConstants.GENERIC_TEXT_FRAGMENT_TYPE = "generic-textFragment";

  // SEO meta data constants
  CCConstants.SEO_META_INFO_NAME="seoMetaInfo";
  CCConstants.GET_SEO_META_INFO_ID="seoMetaInfo?showHidden=true";

  CCConstants.HYPHEN_CONCATANATER='-';
  CCConstants.COMMA_SEPARATOR=',';

  //CC Agent Return constants
  CCConstants.PAYMENT_REVERSAL_INFO = "paymentReversalInfo";
  CCConstants.AMOUNT = "amount";

  //constant for local storage in productListingViewModel
  CCConstants.LISTING_OFFSET_MAP_KEY = "listingOffsetMap";
  CCConstants.SELECTED_SHIPPING_LOCAL_STORAGE_KEY = "cc.selectedShippingData";

  // CHASE gift Card Constants
  CCConstants.ENDPOINT_GIFTCARD_ADD_BALANCE = "addGiftCardBalance";
  CCConstants.CONTEXT_GIFTCARD = "giftcard";
  CCConstants.GIFTCARD_APPLY_ERROR = "28339";
  CCConstants.INVALID_GIFTCARD_DATA_ERROR = "28340";
  CCConstants.GIFTCARD_ORDER_PROCESSING_ERROR="29000";
  CCConstants.GIFTCARD_INSUFFICIENT_ERROR="28344";
  CCConstants.DUPLICATE_GIFTCARD = "duplicateGiftcardErrMsg";

  CCConstants.CHASE_GATEWAY_GC = "chaseGiftCard";
  CCConstants.PAYULATAM_GATEWAY_ID = "PULAW-A";
  CCConstants.PAYER_AUTH_REQUIRED = "payerAuthRequired";


  //CC Admin Register constants
  CCConstants.VALIDATE_TOKEN_OPERATION = "validateToken";
  CCConstants.CONFIRM_PASSWORD_RESET = "confirmPasswordReset";
  CCConstants.RESEND_URL = "resend";
  CCConstants.ADMIN_REGISTER_URL  = "registerAdmin";
  CCConstants.INVITATION_EXPIRED_ERROR_CODE = "83011";
  CCConstants.ALREADY_REGISTERED_ERROR_CODE = "83010";
  CCConstants.REGISTER_ADMIN_INVALID_TOKEN_ERROR = "83009";

  // Region Structures
  CCConstants.MAX_SUB_REGIONS_DEFAULT = 10;

  CCConstants.FLAT_REGION = 100;
  CCConstants.STACK_REGION = 101;
  CCConstants.SLOT_REGION = 102;

  // Experiments Integration constants
  CCConstants.EXPT_TYPE_SCOPE = "LAYOUT";
  CCConstants.EXPT_TYPE_IDENTIFIER = "SLOT";

  // Admin Price List Groups endpoints
  CCConstants.ENDPOINT_LIST_PRICELIST_GROUP = "listPriceListGroups";

  //Dashboard report constants
  CCConstants.GROSS_REVENUE = "grossRevenue";
  CCConstants.ORDERS = "orders";
  CCConstants.VISITS = "visits";
  CCConstants.TRANSACTION_CURRENCY = "transactionCurrency";
  CCConstants.SUMMARY_REPORT = "summaryReport";

  // Admin container
  CCConstants.ADMIN_CONTENT_CONTAINER = "#cc-admin-content";

  // Nav bar template id
  CCConstants.NAV_BAR_TEMPLATE_ID = "cc-admin-navbar-template";

  // User status menu button template id
  CCConstants.USER_NAVBAR_TOP_TEMPLATE_ID = "cc-navbar-top-template";

  // Commerce Cloud role id
  CCConstants.COMMERCE_CLOUD_ID = "allCloudCommerceRole";

  // page ids for access restriction
  CCConstants.DASHBOARD_TAB = "dashboardTab";
  CCConstants.DASHBOARD_MINI_TAB  = "dashBoardMiniTab";
  CCConstants.CATALOG_TAB = "catalogTab";
  CCConstants.MARKETING_TAB = "marketingTab";
  CCConstants.DESIGN_TAB = "designTab";
  CCConstants.MEDIA_TAB = "mediaTab";
  CCConstants.REPORTS_TAB = "reportsTab";
  CCConstants.SEARCH_TAB = "searchTab";
  CCConstants.SETTINGS_TAB = "settingsTab";
  CCConstants.SETTINGS_LIMITED_TAB  = "settingsLimitedTab";
  CCConstants.PUBLISHING_TAB = "publishingTab";
  CCConstants.ACCOUNTS_TAB  = "accountsTab";
  CCConstants.PREVIEW_BUTTON = "previewButton";
  CCConstants.SHOW = "show";
  CCConstants.HIDE = "hide";
  CCConstants.URL = "url";
  CCConstants.HOME_PAGE = "home";
  CCConstants.MARKETING_PAGE = "/marketing";
  CCConstants.REPORTING_PAGE = "/reporting";
  CCConstants.SEARCH_PAGE = "/search";
  CCConstants.DESIGN_PAGE = "/design";
  CCConstants.CODE_PAGE = "/code";
  CCConstants.PUBLISH_PAGE = "/publish";
  CCConstants.SETTINGS_SHIPPINGMETHODS_PAGE = "/settings/shippingMethods";
  CCConstants.LIST_PRICE_PROPERTY = "listPrice";
  CCConstants.SALE_PRICE_PROPERTY = "salePrice";
  CCConstants.SHIPPING_SURCHARGE_PROPERTY = "shippingSurcharge";
  CCConstants.VOLUME_PRICE_PROPERTY = "volumePrice";
  CCConstants.PROPERTY_ATTR = "attr";

  CCConstants.BUILDING_BLOCK_FILTER_CONTROL = "admin/common/buildingBlocks/FilterControl";

  // pricing callbacks
  CCConstants.PREPRICING = "prepricing";
  CCConstants.PRICING_SUCCESS_CB = "pricingsuccess";
  CCConstants.PRICING_FAILURE_CB = "pricingfailure";

  //Integration Settings Admin
  CCConstants.SETTINGS_INTEGRATION_TYPE = "integrations";
  CCConstants.SETTINGS_INTEGRATION_ENABLED = "enabled";
  CCConstants.LIST_PRICE_PROPERTY = "listPrice";
  CCConstants.B2B_SEARCH_URL = "/settings/accountAdministration";

  // Account constants
  CCConstants.ACCOUNTS = "accounts";
  CCConstants.ACCOUNT_GENERAL_TAB = "general";
  CCConstants.ACCOUNT_ADDRESS = "account-address";
  CCConstants.ACCOUNT_COMPUTED_ADDRESS = "computed-address";
  CCConstants.ACCOUNT_ADDRESS_NICK_NAME = "nickName";
  CCConstants.LIST_PRICES_ID = "listPrices";
  CCConstants.PROPERTY_SEARCH = "productIdOrNameSearchParam";
  CCConstants.SEARCH_STRING_NAME = "name";
  CCConstants.LIST_PRODUCTS_ID = "listProducts";
  CCConstants.LIST_PRICES_NAME = "List Prices";
  CCConstants.SALE_PRICES_ID = "salePrices";
  CCConstants.SALE_PRICES_NAME = "Sale Prices";
  CCConstants.SHIPPING_SURCHARGE_PRICES_ID = "shippingSurchargePrices";
  CCConstants.SHIPPING_SURCHARGE_PRICES_NAME = "Shipping Surcharge Prices";
  CCConstants.CUSTOMER_TYPES_STANDARD_ID = "Standard";
  CCConstants.CUSTOMER_TYPES_STANDARD_NAME = "Standard";
  CCConstants.CUSTOMER_TYPES_PREFERRED_ID = "Preferred";
  CCConstants.CUSTOMER_TYPES_PREFERRED_NAME = "Preferred";
  CCConstants.CUSTOMER_TYPES_ENTERPRISE_ID = "Enterprise";
  CCConstants.CUSTOMER_TYPES_ENTERPRISE_NAME = "Enterprise";
  CCConstants.CUSTOMER_TYPES_OEM_ID = "OEM";
  CCConstants.CUSTOMER_TYPES_OEM_NAME = "OEM";
  CCConstants.CUSTOMER_TYPES_DISTRIBUTOR_ID = "Distributor";
  CCConstants.CUSTOMER_TYPES_DISTRIBUTOR_NAME = "Distributor";
  CCConstants.CUSTOMER_TYPES_SUPPLIER_ID = "Supplier";
  CCConstants.ACCOUNT_TYPES_NONE_ID = "none";
  CCConstants.ACCOUNT_TYPES_COMPANY_ID = "company";
  CCConstants.ACCOUNT_TYPES_DIVISION_ID = "division";
  CCConstants.ACCOUNT_TYPES_DEPARTMENT_ID = "department";
  CCConstants.ACCOUNT_TYPES_GROUP_ID = "group";
  CCConstants.ACCOUNT_TYPES_GROUP_NAME = "Group";
  CCConstants.ACCOUNT_MODEL_FORM_ID = "#cc-AccountModelForm";
  CCConstants.ACCOUNT_PANE_ID = "#cc-account-container";
  CCConstants.ACCOUNT_ADDRESS_FORM_ID = "#cc-AccountAddressForm";
  CCConstants.ACCOUNT_ADDCONTACT_MODEL_ID = "#cc-account-addContact-modal";
  CCConstants.ACCOUNT_ADDCONTACT_CANCEL_ID = "#cc-addContactModel-cancel";
  CCConstants.ACCOUNT_FORM_ID = "#cc-add-account";
  CCConstants.ID = "id";
  CCConstants.REMOVE_CONTACTS = "removeContacts";
  CCConstants.ADD_CONTACTS = "addContacts";
  CCConstants.ACCOUNT_NAME_INPUT_FIELD_ID = "#cc-AccountModelForm-CC-propertyEditor-shortText-accountName-field";
  CCConstants.LIST_CATALOGS = "listCatalogs";
  CCConstants.LIST_COUNTRIES = "listCountries";
  CCConstants.ORGANIZATION_ID = "organizationId";
  CCConstants.ORGANIZATION_IDS = "organizationIds";
  CCConstants.GET_ACCOUNT = "getOrganization";
  CCConstants.NO_ACCOUNT_ASSIGNED_ID = "0";
  CCConstants.NO_ACCOUNT_ASSIGNED="Unspecified";
  CCConstants.CREATE_ACCOUNT_URL = "/organizations";
  CCConstants.ACCOUNT_CONTRACT_TERMS = "terms";
  CCConstants.ACCOUNT_LOGO = "organizationLogo";
  CCConstants.ACCOUT_CREATE_URL = "createOrganization";
  CCConstants.ACCOUT_UPDATE_URL = "updateOrganization";
  CCConstants.ACCOUNT_ADDRESS_MODAL_ID = "#cc-account-address-modal";
  CCConstants.CUSTOMER_ACCOUNT_ADDRESS_MODAL_ID = "#cc-accountAddressModal";
  CCConstants.ACCOUNT_MEDIA_SELECT_ALL_BUTTON_ID = "#cc-media-select-btn";
  CCConstants.ACCOUNT_MEDIA_LIBRARY_CONTEXT = "b2b_logo";
  CCConstants.ACCOUNT_MEMBERS_LIST_VIEW = "list";
  CCConstants.ACCOUNT_NICKNAME_MAXIMUM_LENGTH = 60;
  CCConstants.CONTRACT = "contract";
  CCConstants.CONTRACT_TERMS = "terms";
  CCConstants.APPROVALS = "approvals";
  CCConstants.APPROVAL_REQUIRED = "approvalRequired";
  CCConstants.ORDER_PRICE_LIMIT = "orderPriceLimit";
  CCConstants.DELEGATE_APPROVAL_MANAGEMENT = "delegateApprovalManagement";
  CCConstants.ACCOUNT_TREE_NODE_TITLE = "title";
  CCConstants.ACCOUNT_TREE_NODE_ATTR = "attr";
  CCConstants.ACCOUNT_TREE_NODE_CHILDREN = "children";
  CCConstants.PARENT_ORGANIZATION = "parentOrganization";
  CCConstants.ANCESTOR_ORGANIZATIONS = "ancestorOrganizations";
  CCConstants.CLASS = "class";
  CCConstants.CC_INACTIVE_ACCOUNT = "cc-inactive-account";
  CCConstants.CC_ACTIVE_ACCOUNT = "cc-active-account";
  CCConstants.ACCOUNT_NAME_EDITED = "accountNameEdited";
  CCConstants.ACCOUNT_STATE_EDITED = "accountStateEdited";
  CCConstants.ACCOUNT_PARENT_ORG_EDITED = "accountParentOrganizationEdited";
  CCConstants.PENDING_NAVIGATION_COMPLETE = "pendingNavigationComplete";
  CCConstants.ADD_NEW_ACCOUNT = "addNewAccount";
  CCConstants.MOVE_ACCOUNT = "moveAccount";
  CCConstants.SELECT_ACCOUNT = "selectAccount";
  CCConstants.LOAD_MORE_NODE = "loadMoreNode";

  CCConstants.CATALOG_MEDIA_LIST_ID = "#cc-media-list";

  //Contacts constants
  CCConstants.CONTACTS = "contacts";
  CCConstants.CONTACT_PROFILE_TYPE_B2C_VALUE = "b2c_user";
  CCConstants.CONTACT_PROFILE_TYPE_B2C_NAME = "B2C";
  CCConstants.CONTACT_PROFILE_TYPE_B2B_VALUE = "b2b_user";
  CCConstants.CONTACT_PROFILE_TYPE_B2CB_NAME = "B2B";
  CCConstants.MAX_LENGTH_FOR_VARCHAR = 254;

  CCConstants.ACCOUNT_SORT_ASCENDING = "asc";
  CCConstants.ACCOUNT_SORT_DESCENDING = "desc";

  CCConstants.CONTACT_EMAIL_DISPLAY = "Email";

  CCConstants.ITEMS = "items";
  CCConstants.TOTAL = "total";
  CCConstants.TOTAL_RESULTS = "totalResults";
  CCConstants.PREVIOUS_SEARCH_HASH = "previousSearchHash";
  CCConstants.CREATE_B2B_CONTACT_URL = "#/contacts/general?op=create";
  CCConstants.CREATE_B2B_CONTACT_URL_WITH_ACCOUNT = "#/contacts/general?op=create&accountId=";
  CCConstants.GET_B2B_CONTACT_URL = "#/contacts/general?contactId=";
  CCConstants.DEFAULT_ACCOUNT_BACK_URL = "/organizations";
  CCConstants.ACCOUNT_ID_URL = "?accountId=";
  CCConstants.CONTRACT_TERMS_MODEL_ID = "#cc-account-terms-modal";
  CCConstants.ACCOUNT_PANE_ID = "#cc-account-container";
  CCConstants.URL_LISTVIEW_TRUE = "&listView=true";
  CCConstants.URL_LISTVIEW_FALSE = "&listView=false";

  CCConstants.DUMMY_CATALOG = "SiteContextDummyCatalog";
  CCConstants.CLOUD_CATALOG = "cloudCatalog";
  CCConstants.CLOUD_LAKE_CATALOG = "cloudLakeCatalog";
  CCConstants.DEFAULT_SITE_ID = "siteUS";

  CCConstants.ISDEFAULT_BILLING_ADDRESS = "isDefaultBillingAddress";
  CCConstants.ISDEFAULT_SHIPPING_ADDRESS = "isDefaultShippingAddress";
  CCConstants.ADDRESS_TEXT = "address";
  CCConstants.ADDRESS_ADDRESS_TYPE = "addressType";

  CCConstants.HTTP_OK = "200";
  CCConstants.HTTP_NOT_FOUND = "404";

  CCConstants.GIFT_WITH_PURCHASE_DETAIL = "giftWithPurchaseDetail";
  CCConstants.GIFT_WITH_PURCHASE_TYPE = "giftWithPurchaseType";
  CCConstants.ALWAYS_RETURN_SKUS = "alwaysReturnSkus";

  // publishing
  CCConstants.SELECTIVE_PUBLISH_OPERATION = "selective_publish";
  CCConstants.PUBLISHING_CHANGE_CONTEXT = "changeContext";
  CCConstants.PUBLISHING_CHANGE_CONTEXT_DESIGN_STUDIO = "designStudio";

  //Custom catalogs
  CCConstants.CATALOG_FALLBACK = "#/catalog";
  CCConstants.ALLCATALOGS_ID = "allcatalogs";
  CCConstants.ALLCATALOGS_DISPLAYNAME = "All Catalogs";
  CCConstants.ALL_ACTIVE_CATALOGS_ID = "allactivecatalogs";
  CCConstants.ALL_ACTIVE_CATALOGS_DISPLAYNAME = "All Active Catalogs";
  CCConstants.ALL_INACTIVE_CATALOGS_ID = "allinactivecatalogs";
  CCConstants.ALL_INACTIVE_CATALOGS_DISPLAYNAME = "All In-Active Catalogs";
  CCConstants.DATE_TIME = "datetime";
  CCConstants.ENDPOINT_GET_URL_PATTERNS = "listURLPatterns";
  CCConstants.ENDPOINT_UPDATE_URL_PATTERN = "updateURLPattern";

  CCConstants.ADMIN_CATALOG_PAGE_HASH = "#/catalog";
  CCConstants.ENDPOINT_CATALOG_LIST_CATALOGS = "listCatalogs";
  CCConstants.ENDPOINT_CATALOG_GET_CATALOG_INFORMATION = "getCatalog";
  CCConstants.ENDPOINT_CATALOG_CREATE_CATALOG_INFORMATION = "createCatalog";
  CCConstants.ENDPOINT_CATALOG_UPDATE_CATALOG_INFORMATION = "updateCatalog";
  CCConstants.ENDPOINT_CATALOG_DELETE_CATALOG_INFORMATION = "deleteCatalog";
  CCConstants.CATALOG_GENERAL_TAB = "general";
  CCConstants.CATALOG_COLLECTIONS_TAB = "collections";
  CCConstants.CATALOG_ACCOUNTS_TAB = "accounts";
  CCConstants.INCLUDE_CATEGORIES = "includedCategories";
  CCConstants.ADMIN_CATALOG_PAGE_CONTEXT = "/catalog";
  CCConstants.VIEW = "view";
  CCConstants.DEFAULT_MODE = "default";
  CCConstants.LIST_MODE = "list";
  CCConstants.EDIT_MODE = "edit";
  CCConstants.CREATE_MODE = "create";
  CCConstants.PRODUCT_LIST_DIV_ID = "#cc-productlist";
  CCConstants.ANONYMOUS_USER_ACCESS_CONTROL_ERROR = "00002000";
  CCConstants.ADMIN = "admin";
  CCConstants.BUYER = "buyer";
  CCConstants.APPROVER = "approver";
  CCConstants.CREATE_PROFILE_USER_EXISTS = "22006";
  CCConstants.INVALID_PROFILE_FOR_CHECKOUT = "1002020";

  CCConstants.EXCHANGE_MISSING_PRODUCT_ERROR_CODE = "200185";
  CCConstants.EXCHANGE_NOTFORINDIVIDUALSALE_PRODUCT_ERROR_CODE = "200183";
  CCConstants.REPLACEMENT_ORDER_ID = "replacementOrderId";
  CCConstants.SHOW_INACTIVE_SKU = "showInactiveSkus";
  CCConstants.SHOW_INACTIVE_PRODUCT = "showInactiveProducts";
  CCConstants.PRODUCT_TYPES = "productTypes";

  // Quote states
  CCConstants.QUOTED_STATES = "QUOTED";

  //CPQ Agent configuration setting
  CCConstants.CPQ_CONFIG_TYPE="CPQConfigurationSettings";
  CCConstants.ENDPOINT_GET_MERCHANGT_CONFIG="getConfigurationSettings";

  CCConstants.CHILD_ITEMS = "childItems";
  CCConstants.COMMERCE_ID ="commerceItemId";
  CCConstants.SHIPPING_GROUP_ID ="shippingGroupId";
  CCConstants.CONFIGURATOR_ID="configuratorId";

  CCConstants.CPQ_QUOTE_CONFIG_TYPE="CPQQuotingSettings";
  CCConstants.ENDPOINT_REQUEST_QUOTE_ORDER = "requestQuote";
  CCConstants.ENDPOINT_REJECT_QUOTE_ORDER = "rejectQuote";
  CCConstants.QUOTE_NOTES = "note";
  CCConstants.QUOTED = "Quoted";
  CCConstants.PENDING_QUOTE = "pending_quote";
  CCConstants.REJECTED_QUOTE = "rejected_quote";
  CCConstants.PROFILE_TYPE_QUOTE_MERCHANT = "Merchant";
  CCConstants.PROFILE_TYPE_QUOTE_CUSTOMER = "Customer";
  CCConstants.PROFILE_TYPE_QUOTE_AGENT = "Agent";
  CCConstants.COLOR_CUSTOMER = "blue";
  CCConstants.COLOR_AGENT = "red";
  CCConstants.COLOR_MERCHANT = "black";
  CCConstants.ACCEPTED_QUOTE_ORDER = "accpetedQuoteOrder";
  CCConstants.STATUS_QUOTED_CODE = 9;
  CCConstants.PENDING_QUOTE_STATE = "4004";
  CCConstants.REJECTED_QUOTE_STATE = "4005";
  CCConstants.QUOTE_REQUEST_FAILED_STATE = "4005";

  // ASA Settings keys
  CCConstants.ADMIN_ASA_SETTING_COMPANY_LOGO = "companyLogo";
  CCConstants.ADMIN_ASA_SETTING_BACKGROUND_IMAGE = "backgroundImage";
  CCConstants.ADMIN_ASA_SETTING_DASHBOARD_PROMOTIONAL_TEXT ="dashboardPromotionalText";
  CCConstants.ADMIN_ASA_SETTING_HERO_IMAGE = "heroImage";
  CCConstants.ADMIN_ASA_SETTING_COLLECTION_FOR_FEATURED_PRODUCTS_ID = "collectionForFeaturedProductsId";
  CCConstants.PROFILE_DATA = "profileData";
  //Delegated Admin Constants
  CCConstants.ENDPOINT_LIST_CONTACTS_BY_ORGANIZATION = "listMembers";
  CCConstants.ENDPOINT_GET_ORGANIZATION = "getOrganization";
  CCConstants.ENDPOINT_UPDATE_ORGANIZATION = "updateOrganization";
  CCConstants.ENDPOINT_CREATE_CONTACTS_BY_ORGANIZATION = "createMember";
  CCConstants.ENDPOINT_UPDATE_CONTACTS_BY_ORGANIZATION = "updateMember";
  CCConstants.BUYER_TEXT = "Buyer,";
  CCConstants.BUYER_SMALL_TEXT = "Buyer";
  CCConstants.BUYER_LARGE_TEXT = "buyer";
  CCConstants.APPROVER_TEXT = "Approver,";
  CCConstants.ADMIN_TEXT = "Admin,";
  CCConstants.ADMIN_SMALL_TEXT = "Admin";
  CCConstants.ADMIN_LARGE_TEXT = "admin";
  CCConstants.INACTIVE_TEXT = "inactive";
  CCConstants.ACTIVE_TEXT = "active";
  CCConstants.QUANTITY_TEXT = "quantity";
  CCConstants.BUNDLE_LINKS_TEXT = "bundleLinks";
  CCConstants.FIRST_NAME_TEXT = "firstName";
  CCConstants.LAST_NAME_TEXT = "lastName";
  CCConstants.EMAIL_ADDRESS_TEXT = "email";
  CCConstants.ROLES_TEXT = "roles";
  CCConstants.ROLES_TEXT_PROPERTY = "function";
  CCConstants.YES_TEXT = "yes";
  CCConstants.ROLES_RELATIVE_TO_PROPERTY = "relativeTo";
  CCConstants.ROLE_SELECTED_TEXT = "isRoleSelected";
  CCConstants.PROFILE_TYPE_TEXT = "profileType";
  CCConstants.RECEIVE_MAIL_TEXT = "receiveEmail";
  CCConstants.ORG_SECONDARY_ADDRESSES = "secondaryAddresses";
  CCConstants.ORG_ADDRESS_TYPE= "addressType";
  CCConstants.ORG_IS_DEFAULT_BILLING_ADDRESS= "isDefaultBillingAddress";
  CCConstants.ORG_IS_DEFAULT_SHIPPING_ADDRESS= "isDefaultShippingAddress";
  CCConstants.ORG_POSTAL_CODE= "postalCode";
  CCConstants.ORG_COMPANY_NAME= "companyName";
  CCConstants.ORG_PHONE_NUMBER= "phoneNumber";
  CCConstants.ORG_COUNTRY= "country";
  CCConstants.ORG_STATE= "state";
  CCConstants.ORG_CITY= "city";
  CCConstants.ORG_ADDRESS_1= "address1";
  CCConstants.ORG_ADDRESS_2= "address2";
  CCConstants.ORG_ADDRESS= "address";
  CCConstants.ORG_NAME= "companyName";
  CCConstants.END_POINT_INHERITED_ADDRESSES= "inheritedOnly";
  CCConstants.END_POINT_DELETE_ADDRESSES = "deleteAddress";
  CCConstants.END_POINT_LIST_ADDRESSES = "listAddresses";
  CCConstants.END_POINT_GET_ADDRESSES = "getAddresses";
  CCConstants.END_POINT_GET_ALL_ADDRESSES = "addresses";
  CCConstants.END_POINT_ADD_ADDRESSES = "addAddress";
  CCConstants.END_POINT_ADD_ADDRESS = "addAddress";
  CCConstants.END_POINT_UPDATE_ADDRESSES = "updateAddress";
  CCConstants.AGENT_CUSTOMERS_ADDRESSBOOK_CONTEXT = "addressbook";
  CCConstants.AGENT_CUSTOMERS_CONTACTS_CONTEXT = "accountContacts";
  CCConstants.AGENT_CUSTOMERS_APPROVALS_CONTEXT = "orderApproval";
  CCConstants.APPROVER = "approver";
  CCConstants.ADMIN_TITLE = "Administrator";
  CCConstants.BUYER_TITLE = "Buyer";
  CCConstants.ALL = "All";
  CCConstants.APPROVER_TITLE = "Approver";
  CCConstants.CONTACTS_FETCH_SIZE = 10;

  //Image Endpoint Path
  CCConstants.ENDPOINT_IMAGES = "/ccstore/v1/images/";
  CCConstants.ABANDONED_CART = "abandoned-cart";

  CCConstants.ENDPOINT_GET_SCHEDULED_ORDER = "getScheduledOrder";
  CCConstants.ENDPOINT_CREATE_SCHEDULED_ORDER = "createScheduledOrder";
  CCConstants.ENDPOINT_UPDATE_SCHEDULED_ORDER = "updateScheduledOrder";
  CCConstants.ENDPOINT_DELETE_SCHEDULED_ORDER = "deleteScheduledOrder";
  CCConstants.ENDPOINT_LIST_SCHEDULED_ORDERS_BY_ORDER = "listScheduledOrdersByOrder";
  CCConstants.ENDPOINT_LIST_SCHEDULED_ORDERS_BY_PROFILE= "listScheduledOrdersByProfile";

  /** The set of valid values for the ScheduleOrder.scheduleMode property. */
  CCConstants.SCHEDULE_MODE_QUARTERLY = 'quarterly';
  CCConstants.SCHEDULE_MODE_BI_MONTHLY = 'biMonthly';
  CCConstants.SCHEDULE_MODE_ONCE_MONTHLY = 'onceMonthly';
  CCConstants.SCHEDULE_MODE_TWICE_DAILY = 'twiceDaily';
  CCConstants.SCHEDULE_MODE_ONCE_DAILY = 'onceDaily';
  CCConstants.SCHEDULE_MODE_DAILY = 'daily';
  CCConstants.SCHEDULE_MODE_WEEKLY = 'weekly';
  CCConstants.SCHEDULE_MODE_MONTHLY = 'monthly';
  CCConstants.SCHEDULE_MODE_CUSTOM = 'custom';
  CCConstants.DAILY="Daily";
  CCConstants.WEEKLY = 'Weekly';
  CCConstants.MONTHLY = 'Monthly';
  CCConstants.CUSTOM = 'Custom';

  /** The set of valid values for the ScheduleOrder.state property. */
  CCConstants.SCHEDULED_ORDER_STATE_ACTIVE = 'active';
  CCConstants.SCHEDULED_ORDER_STATE_INACTIVE = 'inactive';
  CCConstants.SCHEDULED_ORDER_STATE_PENDING_APPROVAL_TEMPLATE = 'PENDING_APPROVAL_TEMPLATE';
  CCConstants.SCHEDULED_ORDER_STATE_APPROVED = 'APPROVED_TEMPLATE';
  CCConstants.SCHEDULED_ORDER_STATE_REJECTED = 'FAILED_APPROVAL_TEMPLATE';
  CCConstants.SCHEDULED_ORDER_STATE_ERROR = 'error';
  CCConstants.SCHEDULE_EXPIRED = 'Expired';
  CCConstants.SCHEDULED_ORDER_SCHEDULE_TEXT="schedule";
  CCConstants.SCHEDULED_ORDER_STATE="state";
  CCConstants.SCHEDULE_TYPE_TEXT="scheduleType";
  CCConstants.SCHEDULED_ACTIVE="Active";
  CCConstants.SCHEDULED_SUSPENDED="Suspended";
  CCConstants.SCHEDULED_PENDING_APPROVAL="Pending Approval";
  CCConstants.SCHEDULED_APPROVED="Approved";
  CCConstants.SCHEDULED_REJECTED="Rejected";
  CCConstants.PENDING_SCHEDULED_ORDER_APPROVAL= "PENDING_APPROVAL_TEMPLATE";
  CCConstants.ORDER_STATE_PENDING_PAYMENT = "PENDING_PAYMENT";


  /** Agent Endpoint for scheduled Orders**/

  CCConstants.AGENT_ENDPOINT_LIST_SCHEDULED_ORDER = "listScheduledOrdersByProfile";
  CCConstants.AGENT_ENDPOINT_DELETE_SCHEDULED_ORDER = "deleteScheduledOrder";
  CCConstants.AGENT_ENDPOINT_GET_SCHEDULED_ORDER = "getScheduledOrder";
  CCConstants.AGENT_ENDPOINT_UPDATE_SCHEDULED_ORDER = "updateScheduledOrder";
  CCConstants.AGENT_ENDPOINT_CREATE_SCHEDULED_ORDER = "createScheduledOrder";

  CCConstants.CUSTOMERS_HISTORY_CONTEXT = '/customers/history';
  CCConstants.CUSTOMERS_PROFILE_CONTEXT = '/customers/profile';
  CCConstants.CUSTOMERS_SCHEDULED_ORDERS_CONTEXT = '/customers/scheduledOrders';
  CCConstants.CUSTOMER_ADDRESSBOOK_CONTEXT = '/customers/addressbook';
  CCConstants.CONTACTS_CONTEXT = '/customers/accountContacts';
  CCConstants.APPROVALS_CONTEXT = "/customers/orderApproval";
  CCConstants.APPROVALS_FETCH_SIZE = 10;
  CCConstants.ENDPOINT_LIST_ORDERS_PENDING_APPROVALS = "listOrdersByOrganization";
  CCConstants.ENDPOINT_GET_ORGANIZATION = "getOrganization";
  CCConstants.ENDPOINT_UPDATE_ORGANIZATION = "updateOrganization";
  CCConstants.PENDING_APPROVAL = "PENDING_APPROVAL";
  CCConstants.ENDPOINT_REJECT_ORDER = "rejectOrder";
  CCConstants.ENDPOINT_APPROVE_ORDER = "approveOrder";
  CCConstants.ENDPOINT_REPRICE_ORDER = "repriceOrder";
  CCConstants.APPROVED = "APPROVED";
  CCConstants.REJECTED = "REJECTED";
  CCConstants.CHECK_REQUIRES_APPROVAL = "checkRequiresApproval";
  CCConstants.PENDING_PAYMENT_ORDER_STATE = "11";
  CCConstants.MAX_LENGTH_PURCHASE_LIMIT = 8;
  CCConstants.APPROVED_ORDER = "approvedOrder";
  CCConstants.ORDER_PENDING_APPROVAL = "pendingApproval";
  CCConstants.ADD_ORDER_PAYMENTS = "addPayments";
  CCConstants.PAYMENT_GROUP_PAYMENT_DEFERRED = "PAYMENT_DEFERRED";
  CCConstants.PAYMENT_GROUP_STATE_PAYMENT_REQUEST_ACCEPTED = "PAYMENT_REQUEST_ACCEPTED";
  CCConstants.PAYMENT_GROUP_AFTER_PAYPAL = "paymentGroupIdAfterPaypal";
  CCConstants.ENDPOINT_GET_AGENT_CONFIG="getAgentConfiguration";
  CCConstants.COPY_ORDER_OP = "copyOrder";
  CCConstants.ORDER_PENDING_PAYMENT = "pendingPaymentOrder";
  CCConstants.AGENT_APPROVAL_CONFIGURATION = "agentConfiguration";
  CCConstants.SCHEDULED_ORDER_ID = "scheduleOrderId";
  CCConstants.IS_SCHEDULED_ORDER = "isScheduleOrder";
  CCConstants.APPROVER_REJECT_ORDER_STATE = "5002";
  CCConstants.PENDING_APPROVAL_ORDER_STATE = "5000";
  CCConstants.ORDER_BEING_AMENED_STATE = 10;
  CCConstants.REMOVED = "REMOVED";
  CCConstants.PROFILE = "profile";
  CCConstants.PENDING_AUTHORIZATION = "PENDING_AUTHORIZATION";
  
  /**  Multisite Agent changes ***/
  CCConstants.ENDPOINT_GET_CURRENT_SITES = "getSites";
  CCConstants.SITES = "sites";
  CCConstants.INCOMPLETE_STATE = 0;
  
  /**  Click handler events for unsaved changes dialog ***/
  CCConstants.UNSAVED_CHANGES_NAMESPACE = "unsavedchanges";
  CCConstants.CLICK_UNSAVED_CHANGES_EVT = "click." + CCConstants.UNSAVED_CHANGES_NAMESPACE;

  CCConstants.AGENT_PARAM_APPROVER_ID = "approverId";
  CCConstants.CREATE_ASSET_REQUEST = "app.event.createAssetRequest";
  CCConstants.EDIT_ASSET_REQUEST = "app.event.editAssetRequest";
  CCConstants.VIEW_UNASSIGNED_CONTACTS_REQUEST = "app.event.viewUnassignedContactsRequest";

  // Organization related Constants
  CCConstants.ORG_NAME = "name";
  CCConstants.ORG_ID = "id";
  CCConstants.ORG_ACITVE = "active";
  CCConstants.ORG_PARENT_ORGANIZATION = "parentOrganization";
  CCConstants.ORG_DESCRIPTION = "description";
  CCConstants.ORG_CUSTOMER_TYPE = "customerType";
  CCConstants.ORG_DUNS_NUMBER = "dunsNumber";
  CCConstants.ORG_TYPE = "type";
  CCConstants.ORG_UNIQUE_ID = "uniqueId";
  CCConstants.ORG_TAX_REFERENCE_NUMBER = "taxReferenceNumber";
  CCConstants.ORG_VAT_REFERENCE_NUMBER = "vatReferenceNumber";
  CCConstants.ORG_ORGANIZATION_LOGO = "organizationLogo";
  CCConstants.ORG_ORGANIZATION_LOGO_URL = "organizationLogoURL";
  CCConstants.ORG_DERIVED_DESCRIPTION = "derivedDescription";
  CCConstants.ORG_DERIVED_CUSTOMER_TYPE = "derivedCustomerType";
  CCConstants.ORG_DERIVED_DUNS_NUMBER = "derivedDunsNumber";
  CCConstants.ORG_DERIVED_TYPE = "derivedType";
  CCConstants.ORG_DERIVED_UNIQUE_ID = "derivedUniqueId";
  CCConstants.ORG_DERIVED_TAX_REFERENCE_NUMBER = "derivedTaxReferenceNumber";
  CCConstants.ORG_DERIVED_VAT_REFERENCE_NUMBER = "derivedVatReferenceNumber";
  CCConstants.ORG_DERIVED_ORGANIZATION_LOGO = "derivedOrganizationLogo";
  CCConstants.ORG_DERIVED_ORGANIZATION_LOGO_URL = "derivedOrganizationLogoURL";
  CCConstants.ORG_RELATIVE_ROLES = "relativeRoles";

  CCConstants.CONTRACT = "contract";
  CCConstants.CONTRACT_DISPLAY_NAME = "displayName";
  CCConstants.CONTRACT_CATALOG = "catalog";
  CCConstants.CONTRACT_PRICE_LIST_GROUP = "priceListGroup";
  CCConstants.CONTRACT_DESCRIPTION = "description";
  CCConstants.CONTRACT_CONTRACT_TERMS = "contract_terms";
  CCConstants.CONTRACT_TERMS = "terms";
  CCConstants.CONTRACT_END_DATE = "endDate";
  CCConstants.CONTRACT_START_DATE = "startDate";
  CCConstants.CONTRACT_EXTERNAL_REFERENCE = "externalContractReference";
  CCConstants.DERIVED_CONTRACT = "derivedContract";

  CCConstants.PARENT_ORG_EDITED = "parentOrganizationEdited";

  // Account Asset Editor OJET Component IDs
  CCConstants.ACCOUNT_GENERAL_LOCATION_ID = "cc-account-parent-account-selector";
  CCConstants.ACCOUNT_GENERAL_DESCRIPTION_ID = "cc-account-description-input";
  CCConstants.ACCOUNT_GENERAL_CLASSIFICATION_ID = "cc-account-classification-input";
  CCConstants.ACCOUNT_GENERAL_DUNS_NUMBER_ID = "duns-number-input";
  CCConstants.ACCOUNT_GENERAL_TYPE_ID = "cc-account-type-input";
  CCConstants.ACCOUNT_GENERAL_UIN_ID = "cc-account-uin-input";
  CCConstants.ACCOUNT_GENERAL_TAX_REFERENCE_ID = "cc-account-tax-reference-input";
  CCConstants.ACCOUNT_GENERAL_VAT_REFERENCE_ID = "cc-account-vat-reference-input";

  // Profile endpoint PATH options
  CCConstants.ENDPOINT_B2B_PROFILE_APPEND_SECONDARY_ORGANIZATIONS = "appendSecondaryOrganizations";
  CCConstants.ENDPOINT_B2B_PROFILE_REMOVE_SECONDARY_ORGANIZATIONS = "removeSecondaryOrganizations";
  CCConstants.ENDPOINT_B2B_PROFILE_REPLACE_USER_ROLES = "replaceUserRoles";

  // TODO: To be removed once replace endpoint is ready
  CCConstants.ENDPOINT_B2B_PROFILE_APPEND_USER_ROLES = "appendUserRoles";
  CCConstants.ENDPOINT_B2B_PROFILE_UPDATE_USER_ROLES = "updateUserRoles";

  // Merchant Admin Contacts Section Constants
  CCConstants.SECONDARY_ORGANIZATIONS = "secondaryOrganizations";

  CCConstants.ITEM_TYPE_CART_ITEM = "cartItem";
  CCConstants.ITEM_TYPE_RETURN_ITEM = "returnItem";
  CCConstants.DYNAMIC_PROPERTIES = "dynamicProperties";

  CCConstants.USE_ADVANCED_PARSER = "useAdvancedQParser";
  CCConstants.Q_IGNORE_CASE = "qIgnoreCase";

  return CCConstants;
});

