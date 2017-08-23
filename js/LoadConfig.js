var widgetRoot = "../oeHomeSection/widget/oeHomeSection";
var widgetName = "oeHomeSection";

// var widgetJS = widgetRoot + "/js/" + widgetName;
var widgetJS = widgetRoot + "/js/widgetSpecific";
// D:\project\spinMaster_proj\objectedge\oeHomeSection\widget\oeHomeSection\js\widgetSpecific.js
var LoadConfig = (function() {

    var initialWidgetJSON = widgetRoot + "/widget.json";

    var widgetClass = "oeHomeSection";
    var widgetCSSClass = "." + widgetClass;
    var defaultCssPath = widgetRoot+ "/less/widget.css";
    var defaultLessPath = widgetRoot+ "/less/widget.less";
    var widgetLessPath = defaultLessPath;
    var widgetJSON = "widget.json";

    var lessPaths = [
        "less/all.less"
        // ,
        // defaultLessPath

    ];

    var lessGlobalVars= [

    ];
    console.log("LoadConfig loaded");

    return {
        widgetJSON : widgetJSON,
        widgetClass : widgetClass,
        widgetCSSClass : widgetCSSClass,
        cssPath : defaultCssPath,
        lessPath : widgetLessPath,
        widgetJS : widgetJS,
        lessPaths : lessPaths,
        lessGlobalVars : lessGlobalVars
    }

}());


