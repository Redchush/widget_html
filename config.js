

requirejs.config({
    paths: {
        'knockout' : 'lib/knockout-3.4.0.debug',
        'jquery': 'lib/jquery-2.1.3.min',
        'constants' : 'js/Constants',
        'moment': 'lib/moment',
        // "widget": widgetJS,
        'mapping' : 'lib/knockout.mapping-latest.debug',
        'less' : 'lib/less.js-master/dist/less',
        'loadConfig' : 'js/LoadConfig',
        'widgetLoader' : 'js/WidgetLoader'
    },
    shim: {
        "less" : ["widgetLoader"],
        "widgetLoader" : ['loadConfig']
    }
});


// widget_runner/lib/less.js-master/dist/less.min.js
define(['widgetLoader', 'jquery','knockout', 'moment', 'mapping', 'less'],
    function(widgetLoader, $, ko, moment, mapping){
        console.log("START");
        // widgetLoader.copyContent();
        // widgetLoader.loadWidget();
    });
