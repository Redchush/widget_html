/* global $, requirejs, require, define */
requirejs.config({

  waitSeconds: 30,
  baseUrl: '',

  // The shim config allows us to configure dependencies for
  // scripts that do not call define() to register a module
  shim: {
    'jqueryui': {
      deps: ['jquery']
    },

    'jquery': {
      deps: [],
      exports: ['$','jQuery']
    },

    'jqueryEventDrag' : {
      deps: ['jquery']
    },

    'jqueryEventDrop' : {
      deps: ['jquery']
    },

    'viewportVisible': {
      deps: ['jquery']
    },

    'bootstrap': {
      deps: ['jquery', 'jqueryui']
    },

    'bootstrapDatePicker': {
      deps: ['jquery']
    },

    'bootstrapTimePicker': {
      deps: ['jquery']
    },

    'spectrumColorPicker': {
      deps: ['jquery']
    },

    'infuser': {
      deps: ['jquery', 'trafficCop']
    },

    'trafficCop': {
      deps: ['jquery']
    },
    'slickCore': {
      deps: ['jquery', 'jqueryui', 'jqueryEventDrag', 'jqueryEventDrop']
    },
    'slickFormatters': {
      deps: ['jquery', 'jqueryui', 'jqueryEventDrag', 'jqueryEventDrop']
    },
    'slickEditors': {
      deps: ['jquery', 'jqueryui', 'jqueryEventDrag', 'jqueryEventDrop']
    },
    'slickDataview': {
      deps: ['jquery', 'jqueryui', 'jqueryEventDrag', 'jqueryEventDrop']
    },
    'slickCellRangeSelector': {
      deps: ['jquery', 'jqueryui', 'jqueryEventDrag', 'jqueryEventDrop']
    },
    'slickCellSelectionModel': {
      deps: ['jquery', 'jqueryui', 'jqueryEventDrag', 'jqueryEventDrop']
    },
    'slickRowSelectionModel': {
      deps: ['jquery', 'jqueryui', 'jqueryEventDrag', 'jqueryEventDrop']
    },

    'slickAdvRowMoveManager': {
      deps: ['jquery', 'jqueryui', 'jqueryEventDrag', 'jqueryEventDrop']
    },
    'slickGrid': {
      deps: ['jquery', 'jqueryui', 'jqueryEventDrag', 'jqueryEventDrop', 'slickCore', 'slickFormatters', 'slickEditors', 'slickDataview', 'slickCellRangeSelector', 'slickCellSelectionModel', 'slickRowSelectionModel', 'slickAdvRowMoveManager']
    },

    'less': {
      deps: [],
      exports: 'less'
    },

    'select2': {
      deps: ['jquery', 'jqueryui']
    },

    'tagsInput': {
      deps: ['jquery']
    },

    'imagesloaded': {
      deps: ['jquery']
    },

    'chosen' : {
      deps: ['jquery']
    },

    /*
     * TODO remove when we're really done with WYSIHTML5x
     */
    'advanced' : {
      deps: ['jquery']
    },
    'wysihtml5' : {
      deps: ['jquery', 'advanced']
    },
    /*
     * TODO end WYSIHTML5x
     */

    'ckeditor' : {
      deps: []
    },
    'ckadapter' : {
      deps: ['jquery','ckeditor']
    },
    'joyride' : {
      deps: ['jquery','jquerycookie','modernizr']
    },
    'jquerycookie' : {
      deps: ['jquery']
    }
  },

  // paths to resolve the reference names
  // names on the left will be used for the requires/depends parameters
  paths : {

    // OracleJET v2.0.2
    hammerjs: 'js/oraclejet/js/libs/hammer/hammer-2.0.4.min',
    jquery: 'js/oraclejet/js/libs/jquery/jquery-2.1.3.min',
    'jqueryui-amd': 'js/oraclejet/js/libs/jquery/jqueryui-amd-1.11.4.min',
    knockout: 'js/oraclejet/js/libs/knockout/knockout-3.4.0',
    ojdnd: 'js/oraclejet/js/libs/dnd-polyfill/dnd-polyfill-1.0.0.min',
    ojs: 'js/oraclejet/js/libs/oj/v2.0.2/min',
    ojL10n: 'js/oraclejet/js/libs/oj/v2.0.2/ojL10n',
    ojtranslations: 'js/oraclejet/js/libs/oj/v2.0.2/resources',
    promise: 'js/oraclejet/js/libs/es6-promise/promise-1.0.0.min',
    signals: 'js/oraclejet/js/libs/js-signals/signals.min',
    template: 'js/oraclejet/js/libs/require/text',

    // 3rd party libs
    // joyride
    joyride : 'js/libs/joyride-2.1/jquery.joyride-2.1',
    modernizr : 'js/libs/joyride-2.1/modernizr.mq-2.8.3',
    jquerycookie : 'js/libs/joyride-2.1/jquery.cookie-1.4.1',

    // jquery
    jqueryui : '../shared/js/libs/jquery-ui-1.11.4.custom',
    jquerymswipe : '/shared/js/libs/jquery.mobile.swipe-1.4.5.min',
    jqueryEventDrag : 'js/libs/slickgrid/lib/jquery.event.drag-modified-2.2',
    jqueryEventDrop : 'js/libs/slickgrid/lib/jquery.event.drop-modified-2.2',

    // i18next ++
    i18next : '../shared/js/libs/i18next.3.5.0.min',
    i18nextBackend: '../shared/js/libs/i18nextXHRBackend.1.2.1',
    CCi18n : '../shared/js/ccLibs/cc-i18n',

    // knockout
    koMapping : '../shared/js/libs/knockout.mapping-2.4.1.min',
    koValidate : '../shared/js/libs/knockout.validation-2.0.3',

    bootstrap : '../shared/js/libs/bootstrap.3.1.1',
    infuser: '../shared/js/libs/infuser',
    trafficCop: '../shared/js/libs/TrafficCop',
    nestedSortables: '../shared/js/libs/jquery.mjs.nestedSortable-2.0',
    chosen : '../shared/js/libs/chosen.jquery-1.4.2.min',
    viewportVisible : '../shared/js/libs/jquery.visible.min',
    imagesloaded : '../shared/js/libs/imagesloaded.pkgd-3.1.8',
    tagsInput : '../shared/js/libs/jquery.tagsinput-1.3.5',
    ccDate : '../shared/js/ccLibs/cc-date-format-1.0',
    ccNumber : '../shared/js/ccLibs/cc-number-format-1.0',
    ccPasswordValidator : '../shared/js/ccLibs/cc-password-validator',
    // Moment library for date and time formatting
    moment : '../shared/js/libs/moment-2.10.3',
    // Moment language bundles are stored in this path
    momentLangs : '../shared/js/libs/moment',

    // crossroads, etc,. for routing
    crossroads : '../shared/js/libs/crossroads-0.12.0.min',
    hasher : '../shared/js/libs/hasher-1.2.0',

    select2 : 'js/libs/select2-3.5.1/select2',

    // slickgrid
    slickCore : 'js/libs/slickgrid/slick.core',
    slickFormatters : 'js/libs/slickgrid/slick.formatters',
    slickEditors : 'js/libs/slickgrid/slick.editors',
    slickGrid : 'js/libs/slickgrid/slick.grid',
    slickDataview : 'js/libs/slickgrid/slick.dataview',
    slickCellRangeSelector : 'js/libs/slickgrid/plugins/slick.cellrangeselector',
    slickCellSelectionModel : 'js/libs/slickgrid/plugins/slick.cellselectionmodel',
    slickRowSelectionModel : 'js/libs/slickgrid/plugins/slick.rowselectionmodel',
    slickAdvRowMoveManager : 'js/libs/slickgrid/plugins/slick.advrowmovemanager',

    // library for ACE code editor
    ace : 'js/libs/ace-1.1.9',
    less : 'js/libs/less-2.1.1',

    // individual lib to handle the bootstrap date widget
    bootstrapDatePicker: '../shared/js/libs/bootstrap-datepicker',
    bootstrapTimePicker: '../shared/js/libs/bootstrap-timepicker',
    bootstrapSlider: '../shared/js/libs/bootstrap-slider',
    spectrumColorPicker: '../shared/js/libs/spectrum-1.7.0',

    dateTimeUtils : '../shared/js/ccLibs/date-time-utils',
    numberFormatHelper : '../shared/js/ccLibs/number-format-helper',

    // Mousetrap library for handling keyboard shortcuts
    mousetrap: '../shared/js/libs/mousetrap',

    //CKEditor rich-text editor
    ckeditor: 'js/libs/ckeditor-4.4.8/ckeditor',
    ckadapter: 'js/libs/ckeditor-4.4.8/adapters/jquery',
    ckeditorBootstrapIePatch: 'js/libs/ckeditor-4.4.8/ckeditor-bootstrap-ie-patch',

    // Oracle-CC libs
    ccStoreConfiguration : '../shared/js/ccLibs/cc-store-configuration-1.0',
    ccConstants : '../shared/js/ccLibs/cc-constants',
    koExtensions : '../shared/js/ccLibs/ko-extensions',
    storageApi : '../shared/js/ccLibs/cc-storage-api-1.0',
    ccOAuthTimeout : '../shared/js/ccLibs/cc-oauth-timeout',
    ccRestClientConstructor : '../shared/js/ccLibs/cc-rest-client-1.0',
    ccRestClient : '../shared/js/ccLibs/admin-rest-client',
    searchRestClientConstructor : '../shared/js/ccLibs/search-rest-client',
    searchRestClient : '../shared/js/ccLibs/admin-search-rest-client',
    xDomainProxy : '../shared/js/ccLibs/xdomain-proxy',
    koExternalTemplate: '../shared/js/ccLibs/koExternalTemplateEngine-amd-2.0.5-modified',
    ccKoExtensions: '../shared/js/ccLibs/cc-ko-extensions',
    adminKoExtensions: '../shared/js/ccLibs/admin-ko-extensions',
    siteStudioKoExtensions: '../shared/js/ccLibs/site-studio-ko-extensions',
    pubsub: '/shared/js/ccLibs/pubsub-1.0',
    pubsubImpl: '/shared/js/ccLibs/pubsub-impl',
    routing: '/shared/js/ccLibs/routing-1.0',
    navigation : '/shared/js/ccLibs/cc-navigation-1.0',

    ccLogger: '../shared/js/ccLibs/ccLogger-1.0',
    notifier: '../shared/js/ccLibs/notifier-1.0',
    notifications: '../shared/js/ccLibs/notifications-1.0',
    paginated: '../shared/js/ccLibs/paginated',
    storeKoExtensions: '../shared/js/ccLibs/store-ko-extensions',
    viewModels: '../shared/js/viewModels',
    ccClientErrorCodes: '../shared/js/ccLibs/cc-client-error-codes',
    ccKoValidateRules: '../shared/js/ccLibs/cc-ko-validate-rules',
    spinner: '/shared/js/ccLibs/spinner-1.0',
    ccFileUpload : '../shared/js/ccLibs/cc-file-upload',
    ccConfig : '../shared/js/ccLibs/cc-config',
    ccImageZoom : '../shared/js/ccLibs/cc-image-zoom-2.0',
    currencyHelper: '../shared/js/ccLibs/currency-helper',
    profileHelper: '../shared/js/ccLibs/profile-helper',
    contentLocaleHelper: '../shared/js/ccLibs/content-locale-helper',
    viewportHelper : '../shared/js/ccLibs/viewport-helper',
    dateTimeHelper : '../shared/js/ccLibs/date-time-helper',
    pageLayout: '../shared/js/pageLayout',
    utils: '../shared/js/utils',

    // Oracle-CC Admin
    fontControls : 'js/admin/controls/fontcontrol-settings',
    additionalFontViewModel : 'js/admin/viewModels/additionalFontViewModel',
    fontViewModel : 'js/admin/viewModels/fontViewModel',
    imageConfigViewModel : 'js/admin/viewModels/imageConfigViewModel',
    paddingConfigViewModel : 'js/admin/viewModels/paddingConfigViewModel',
    borderConfigViewModel : 'js/admin/viewModels/borderConfigViewModel',
    horizontalAlignmentConfigViewModel : 'js/admin/viewModels/horizontalAlignmentConfigViewModel',
    richTextConfigViewModel : 'js/admin/viewModels/richTextConfigViewModel',
    collectionConfigViewModel : 'js/admin/viewModels/collectionConfigViewModel',
    cartPickerControls : 'js/admin/controls/cartpickercontrol-settings',
    cartPickerItemViewModel : 'js/admin/viewModels/cartPickerItemViewModel',
    metaTagControls : 'js/admin/controls/metatagcontrol-settings',
    metaTagItemViewModel : 'js/admin/viewModels/metaTagItemViewModel',
    defaultPageSelectorSettings : 'js/admin/controls/defaultpageselector-settings',
    targetSelectorSettings : 'js/admin/controls/targetselector-settings',
    viewportPickerSettings : 'js/admin/controls/viewportpicker-settings',
    tour : 'js/admin/viewModels/tour-1.0',
    koComponents: 'js/ccLibs/koComponents',
    // admin ui files
    admin : 'js/admin',
    shared: '../shared/js'
  }

});

require(
  ['knockout',
   'koValidate',
   'admin/admin-page-container',
   'routing',
   'shared/loader',
   'pubsub',
   'hasher',
   'admin/core/view/templateEngine',
   'ojs/ojcore',
   'ojs/ojmodule',
   'adminKoExtensions',
   'koComponents',
   'ckeditorBootstrapIePatch'],

  function (ko, koValidate, AdminPageContainer, Routing, loader, PubSub, Hasher, templateEngine, oj) {
    "use strict";
    var clientDebugMode, container, options, routing;

    clientDebugMode = true;
    container = new AdminPageContainer('admin/', 'templates/pages', clientDebugMode);
    routing = new Routing();

    $.get('../shared/templates/editors.template', {}, function (data) {
      $(data).appendTo('body');
    }, 'html');

    // Configuration Options for Validation Plugin
    // See https://github.com/ericmbarnard/Knockout-Validation/wiki/Configuration
    options = {};
    options.errorsAsTitle = false;
    options.insertMessages = false;
    options.decorateInputElement = true;
    options.errorElementClass = "invalid";

    // Use a custom Knockout template engine.
    ko.setTemplateEngine(templateEngine);

    // Initialize Validation Plugin
    ko.validation.init(options);

    // Override ojModule defaults in order to allow views and models to coexist
    // in the same directory.
    var moduleDefaults = oj.ModuleBinding.defaults;
    moduleDefaults.modelPath = "./";
    moduleDefaults.viewPath = "template!./";

    ko.applyBindings(container);

  }

);

define("js/admin-require", function(){});

