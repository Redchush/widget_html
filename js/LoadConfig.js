var widgetJS = '../oeHomeSection/js/oeHomeSection';

var LoadConfig = (function() {

    var widgetClass = "oeHomeSection";

    var widgetCSSClass = "." + widgetClass;
    var cssPath = "../oeHomeSection/less/widget.css";
    var lessPath = "../oeHomeSection/less/widget.less";
    var widgetJSON = "widget.json";

    var lessPaths = [

        lessPath,
        "less/all.less"
        // "less/custom/vars_absent.less",
        // "less/spinmaster/variables/buttons.less",
        // "less/spinmaster/variables/cards.less",
        // "less/spinmaster/variables/carousel.less",
        // "less/spinmaster/variables/colors.less",
        // "less/spinmaster/variables/forms.less",
        // "less/spinmaster/variables/header.less",
        // "less/spinmaster/variables/links.less",
        // "less/spinmaster/variables/modals.less",
        // "less/spinmaster/variables/navbar.less",
        // "less/spinmaster/variables/pagination.less",
        // "less/spinmaster/variables/product-card.less",
        // "less/spinmaster/variables/product-card-list.less",
        // "less/spinmaster/variables/site.less",
        // "less/spinmaster/variables/spacings.less",
        // "less/spinmaster/variables/stars.less",
        // "less/spinmaster/variables/subnav.less",
        // "less/spinmaster/variables/tables.less",
        // "less/spinmaster/variables/tabs.less",
        // "less/spinmaster/variables/typography.less",
        // "less/theme/theme.less"

    ];

    console.log("LoadConfig loaded");

    return {
        widgetJSON : widgetJSON,
        widgetClass : widgetClass,
        widgetCSSClass : widgetCSSClass,
        cssPath : cssPath,
        lessPath : lessPath,
        widgetJS : widgetJS,
        lessPaths : lessPaths
    }

}());


