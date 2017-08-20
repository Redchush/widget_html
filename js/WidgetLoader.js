define(
    [widgetJS, 'jquery','knockout', 'mapping',"loadConfig"],

    function (widget, $, ko, mapping, loadConfig) {
        console.log("Widget loaded");
        addLess();

        function addLess() {
            console.log(LoadConfig.lessPaths);
            if(LoadConfig.lessPaths){

                for (var i = 0; i < LoadConfig.lessPaths.length; i++) {
                    $('head').append($('<link rel="stylesheet/less" type="text/css"/>')
                        .attr('href',LoadConfig.lessPaths[i] ));
                    console.log("added " + LoadConfig.lessPaths[i] )
                }
            }
        }

        function loadWidget(widgetJSON, widget) {

            $.getJSON(widgetJSON, function(data) {
                let config = data.config;
                let viewModel = mapping.fromJS(config);
                console.log(viewModel);
                widget.onLoad(viewModel);
                ko.applyBindings(viewModel);
                console.log( "ITEMS: " +  widget.displayableItems);

                $(".widget").on('change', function () {
                    widget.beforeAppear();
                });
            });
        }

        function loadCss(url) {
            var link = document.createElement("link");
            link.type = "text/css";
            link.rel = "stylesheet";
            link.href = url;
            document.getElementsByTagName("head")[0].appendChild(link);
        }

        console.log("less added");

        return{
            copyContent : function () {
                $('#widget-container').append(
                    $("#widget-frame").contents().find(LoadConfig.widgetCSSClass)
                );
            },
            loadWidget : function() {
                loadWidget(LoadConfig.widgetJSON, widget)
            }
        }
    }
);