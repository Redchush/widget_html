/**
 * @fileoverview Defines an API builder that constructs an API for widgets to
 * communicate with the rest of the system.
 */
/*global $ */
/*global require */
define(
    //-------------------------------------------------------------------
    // PACKAGE NAME
    //-------------------------------------------------------------------
    'pageLayout/api-builder',

    //-------------------------------------------------------------------
    // DEPENDENCIES
    //-------------------------------------------------------------------
    ['knockout'],

    //-------------------------------------------------------------------
    // MODULE DEFINTIION
    //-------------------------------------------------------------------
    function (ko) {

        "use strict";

        /**
         * @namespace APIBuilder
         * @name APIBuilder
         * @private
         */
        return {

            /**
             * Builds the API for a region. Adds methods and functionality to the
             * RegionViewModel so regions can interact with the system without having
             * access to the system.
             * @private
             * @name regionBuilder
             * @memberOf APIBuilder
             * @function
             * @param {RegionViewModel} RegionViewModel The RegionViewModel to extend
             * @param {LayoutContainer} LayoutContainer The layoutContainer.
             */
            regionBuilder: function(RegionViewModel, layoutContainer) {
            },

            /**
             * Builds the API for a widget. Adds methods and functionality to the
             * WidgetViewModel so regions can interact with the system without having
             * access to the system.
             * @private
             * @name widgetBuilder
             * @memberOf APIBuilder
             * @function
             * @param {WidgetViewModel} WidgetViewModel The WidgetViewModel to extend
             * @param {LayoutContainer} LayoutContainer The layoutContainer.
             */
            widgetBuilder: function(WidgetViewModel, layoutContainer) {

                /**
                 Gets an object from the contextual data.
                 @public
                 @function
                 @name getCurrent
                 @memberof WidgetViewModel
                 @param {String} type The type of data to get.
                 @return {observable<Object>} An observable containing the contextual data or null.
                 */
                WidgetViewModel.prototype.getCurrent = function(type) {
                    var builder = layoutContainer.viewModelBuilder[type];
                    if(builder) {
                        if(builder.scope) {
                            return layoutContainer.contextHandler.get(type, builder.scope);
                        }
                        return layoutContainer.contextHandler.get(type, 'page');
                    }
                    return layoutContainer.contextHandler.get(type);
                };

                /**
                 Sets the contextual data for the provided type to the provided value.
                 @public
                 @function
                 @name setCurrent
                 @memberof WidgetViewModel
                 @param {String} type The type of data to get.
                 @param {Object} viewModel The data to set as the contextual data.
                 */
                WidgetViewModel.prototype.setCurrent = function(type, viewModel) {
                    var builder = layoutContainer.viewModelBuilder[type];
                    if(builder) {
                        if(builder.scope) {
                            layoutContainer.contextHandler.set(type, viewModel, builder.scope);
                        } else {
                            layoutContainer.contextHandler.set(type, viewModel, 'page');
                        }
                    } else {
                        layoutContainer.contextHandler.set(type, viewModel);
                    }
                };

                /**
                 Registers an event handler to be run on changes to the contextual data of the
                 given type. The handler is also invoked immediately for the current value of the
                 contextual data.
                 @public
                 @function
                 @name listen
                 @memberof WidgetViewModel
                 @param {String} type The type of data whose changes will invoke the handler.
                 @param {function} handler The handler to run. The function accepts (event, value) parameters.
                 */
                WidgetViewModel.prototype.listen = function(type, handler) {
                    layoutContainer.contextHandler.listen(type, handler);
                };

                /**
                 Request to load a piece of external data based on type, id, and params. The data is loaded and converted
                 to a view model before being passed to the success callback.
                 @public
                 @function
                 @name load
                 @memberof WidgetViewModel
                 @param {String} type The type of data being requested.
                 @param {String|Array} id The id of the object(s) being loaded using either a simple id (string) or
                 complex id (an array of values).
                 @param {map} [params] Additional parameters used for the request.
                 @param {function} success A success function callback. Passes paramters (viewModel, caller). viewModel is the result of the load,
                 caller is used to reference the calling context.
                 @param {function} [error] An error function callback invoked if there was an error with loading the data.
                 @param {Object} [caller] The caller to be passed to the success and error callbacks.
                 */
                WidgetViewModel.prototype.load =  function(type, id, params, success, error, caller) {
                    layoutContainer.load(type, id, params, success, error, caller);
                };

                /**
                 Request to persist an update of an object.
                 @public
                 @function
                 @name update
                 @memberof WidgetViewModel
                 @param {String} type The type of data being updated.
                 @param {String|Array} id The id of the object being updated using either a simple id (string) or
                 complex id (an array of values).
                 @param {Object} model The viewModel to update.
                 @param {map} [params] Additional parameters used for the request.
                 @param {function} success A success function callback. Passes paramters (value, caller). value is the result of the update,
                 caller is used to reference the calling context.
                 @param {function} [error] An error function callback invoked if there was an error with updating the data.
                 @param {Object} [caller] The caller to be passed to the success and error callbacks.
                 */
                WidgetViewModel.prototype.update = function(type, id, model, params, success, error, caller) {
                    layoutContainer.update(type, id, model, params, success, error, caller);
                };

                /**
                 Request to persist the creation of a new object.
                 @public
                 @function
                 @name create
                 @memberof WidgetViewModel
                 @param {String} type The type of data being created.
                 @param {String|Array} id The id of the object being created using either a simple id (string) or
                 complex id (an array of values).
                 @param {Object} model The viewModel to persist the creation of.
                 @param {map} [params] Additional parameters used for the request.
                 @param {function} success A success function callback. Passes paramters (value, caller). value is the result of the create,
                 caller is used to reference the calling context.
                 @param {function} [error] An error function callback invoked if there was an error with creation of the object.
                 @param {Object} [caller] The caller to be passed to the success and error callbacks.
                 */
                WidgetViewModel.prototype.create = function(type, id, model, params, success, error, caller) {
                    layoutContainer.create(type, id, model, params, success, error, caller);
                };

                /**
                 Request to persist the deletion of a new object.
                 @public
                 @function
                 @name remove
                 @memberof WidgetViewModel
                 @param {String} type The type of data being deleted.
                 @param {String|Array} id The id of the object being deleted using either a simple id (string) or
                 complex id (an array of values).
                 @param {map} [params] Additional parameters used for the request.
                 @param {function} success A success function callback. Passes paramters (value, caller). value is the result of the deletion,
                 caller is used to reference the calling context.
                 @param {function} [error] An error function callback invoked if there was an error with deletion of the object.
                 @param {Object} [caller] The caller to be passed to the success and error callbacks.
                 */
                WidgetViewModel.prototype.remove = function(type, id, params, success, error, caller) {
                    layoutContainer.remove(type, id, params, success, error, caller);
                };
            }
        };
    }
);


