

// ["./widgetGeneric.js", "./widgetSpecific.js", "knockout", "pubsub", "notifier", "ccConstants", "ccRestClient",
//     "pageLayout/product", "ccStoreConfiguration"],
requirejs.config({

    paths: {
        "knockout": "lib/knockout-3.4.0.debug",
        "jquery": "lib/jquery-2.1.3.min",
        "constants": "js/Constants",
        "moment": "lib/moment",
        // "widget": widgetJS,
        "mapping": "lib/knockout.mapping-latest.debug",
        "less": "lib/less.js-master/dist/less",
        "loadConfig": "js/LoadConfig",
        "widgetLoader": "js/WidgetLoader",
        "bootstrap": "lib/bootstrap-3.1.1/dist/js/bootstrap",


        // Oracle-CC libs
        "pubsub": "lib/shared/js/ccLibs/pubsub-1.0",
        "ccConstants": "lib/shared/js/ccLibs/cc-constants",
        "ccRestClient": "lib/shared/js/ccLibs/admin-rest-client",
        "pageLayout/product": "lib/shared/js/pageLayout/product",
        "ccStoreConfiguration": "lib/shared/js/ccLibs/cc-store-configuration-1.0",
        "CCi18n": "lib/shared/js/ccLibs/cc-i18n",
        "ccLogger": "lib/shared/js/ccLibs/ccLogger-1.0",
        "viewModels/skuPropertiesHandler": "lib/shared/js/viewModels/skuPropertiesHandler.js",
        "pubsubImpl": "lib/shared/js/ccLibs/pubsub-impl",
        "ccDate": "lib/shared/js/ccLibs/cc-date-format-1.0",

    },


    shim: {
        "bootstrap": ["jquery"],
        "less": ["widgetLoader"],
        "widgetLoader": ["loadConfig"]
    }
});


// widget_runner/lib/less.js-master/dist/less.min.js
define(["widgetLoader", "jquery", "knockout", "moment", "mapping", "less", "bootstrap"
],
        // ,
        // "pubsub", "ccConstants", "ccRestClient", "pageLayout/product"],
    function(widgetLoader, $, ko, moment, mapping){
        console.log("START");
        // widgetLoader.copyContent();
        // widgetLoader.loadWidget();
    });
