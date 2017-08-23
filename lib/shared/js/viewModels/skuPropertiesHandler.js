

/*global define */
define(
    //-------------------------------------------------------------------
    // PACKAGE NAME
    //-------------------------------------------------------------------
    'viewModels/skuPropertiesHandler',

    //-------------------------------------------------------------------
    // DEPENDENCIES
    //-------------------------------------------------------------------
    ['knockout','ccRestClient', 'ccConstants', 'ccLogger', 'ccStoreConfiguration'],

    //-------------------------------------------------------------------
    // MODULE DEFINITION
    //-------------------------------------------------------------------
    function (ko, ccRestClient, CCConstants, log, CCStoreConfiguration) {

        function SkuPropertiesHandler() {
            var self = this;
            /**
             * Find and return all properties for the given SKU
             *
             * @name SkuPropertiesHandler#getSkuProperties
             *
             * @function
             * @returns {Object} Object containing all properties pertaining to the given SKU.
             */
            self.fetchSkuProperties = function(targetArray, productType, options, successCallback, errorsCallback) {
                options.parent="sku";
                var successCustomCallback = function(result) {
                    if(result && result.base) {
                        result.base.forEach(function(property){
                            if(property.propertyType === "sku-base"){
                                targetArray().push(property);
                            }
                        });
                    }
                    if(result && result.specifications) {
                        result.specifications.forEach(function (property) {
                            if (property.propertyType === "sku-custom") {
                                targetArray().push(property);
                            }
                        });
                    }

                    if (typeof successCallback === "function") {
                        successCallback(targetArray);
                    }

                }
                var errorCallback = function(result) {
                    log.error('Failed to fetch SKU properties for ' + productType, result);
                    if (typeof errorsCallback === "function") {
                        errorsCallback();
                    }
                }
                var contextObj = {};
                contextObj[CCConstants.ENDPOINT_KEY] = CCConstants.ENDPOINT_GET_ITEM_TYPE;
                var filterKey = self.storeConfiguration.getFilterToUse(contextObj);
                if (filterKey) {
                  options[CCConstants.FILTER_KEY] = filterKey;
                }
                ccRestClient.request(
                    CCConstants.ENDPOINT_GET_ITEM_TYPE,
                    options,
                    successCustomCallback,
                    errorCallback,
                    productType
                );

            }

            /**
             * Find and return all base SKU properties
             *
             * @name SkuPropertiesHandler#getBase
             *
             * @function
             * @returns {Object} Object containing all properties pertaining to the given SKU.
             */
            self.getBase = function(targetArray, successCallback, errorsCallback) {
                self.fetchSkuProperties(targetArray ,'sku', {"includeBase": true}, successCallback, errorsCallback);
            }

            /**
             * Find and return all SKU properties Including base and product type
             *
             * @name SkuPropertiesHandler#getAll
             *
             * @function
             * @returns {Object} Object containing all properties pertaining to the given SKU.
             */
            self.getAll = function(targetArray, productType, successCallback, errorsCallback) {
                if(productType && (productType + "").trim()) {
                    self.fetchSkuProperties(targetArray, 'sku-' + productType, {"includeBase": true}, successCallback, errorsCallback);
                } else {
                    self.getBase(targetArray, successCallback, errorsCallback);
                }
            }


            /**
             * Find and return all SKU properties for specified product type
             *
             * @name SkuPropertiesHandler#getCustom
             *
             * @function
             * @returns {Object} Object containing all properties pertaining to the given SKU.
             */
            self.getCustom = function(targetArray, productType, successCallback, errorsCallback) {
                if(productType && (productType + "").trim()) {
                    self.fetchSkuProperties(targetArray, 'sku-' + productType, {"includeBase": false}, successCallback, errorsCallback);
                } else {
                    self.fetchSkuProperties(targetArray, 'sku', {"includeBase": false}, successCallback, errorsCallback);
                }
            }
            self.storeConfiguration = CCStoreConfiguration.getInstance();

            return self;
        }

        return new SkuPropertiesHandler();
});

