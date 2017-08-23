/**
 * @fileoverview Defines a ProductViewModel used to represent a product
 * and its properties
 */

/*global define */
define(
    //-------------------------------------------------------------------
    // PACKAGE NAME
    //-------------------------------------------------------------------
    'pageLayout/product',

    //-------------------------------------------------------------------
    // DEPENDENCIES
    //-------------------------------------------------------------------
    ['knockout', 'ccRestClient', 'ccConstants', 'pubsub', 'CCi18n', 'ccLogger' ,'viewModels/skuPropertiesHandler', 'ccStoreConfiguration'],

    function(ko, ccRestClient, CCConstants, pubsub, CCi18n, log, SkuPropertiesHandler, CCStoreConfiguration) {

        'use strict';

        //-------------------------------------------------------
        // View Model
        //-------------------------------------------------------

        /**
         * The Product View Model is used to handle product details in category selection, product list,
         * search results and product details. A product view model may represent one or more SKUs with varying
         * prices, and which may currently be a sale item.
         *
         * @param {Object} pProduct Object representing product details.
         * @param {Object} params Additional construction parameters.
         *
         * @public
         * @class Represents a product.
         * @name ProductViewModel
         * @property {Object} product Internally stored product.
         * @property {number} minPrice Minimum price of product.
         * @property {number} maxPrice Maximum price of product.
         * @property {number} productSalePrice Sale price of the product if product is on sale.
         * @property {number} productListPrice List price of the product.
         * @property {boolean} isOnSale Flag to convey whether the product is on sale. (i.e. productSalePrice will
         *   only be meaningful if this flag is raised.)
         * @property {boolean} hasPriceRange Flag to convery whether product has a price range. (i.e. minPrice and maxPrice
         *   will only be meaningful is this flag is raised.)
         * @property {observable<Object>} stockStatus Dictionary object storing stock availability of this product
         *   and associated SKUs.
         * @property {Object[]} relatedProducts List of related products using the same object format as `product'.
         * @property {observable<string>} id Product ID.
         * @property {observable<string>} repositoryId ID of object in repository.
         * @property {observable<string>} type Product type.
         * @property {observable<number>} height Product height.
         * @property {observable<number>} width Product width.
         * @property {observable<number>} length Product length.
         * @property {observable<number>} weight Product weight.
         * @property {observable<boolean>} active Flag conveying whether product is currently active.
         * @property {observable<string>} displayName Name of product to display.
         * @property {observable<string>} brand Product manufacturer.
         * @property {observable<string>} description Product description.
         * @property {observable<string>} longDescription Extended product description.
         * @property {observable<number>} listPrice Product list price.
         * @property {observable<number>} salePrice Product sale price, may be unset.
         * @property {observable<number>} orderLimit Maximum amount of this product available for order.
         * @property {observable<Object>} stockStatus Stock availability information for this product.
         * @property {observable<?>} avgCustRating
         * @property {observable<Object>} parentCategory Direct parent category of this product.
         * @property {observable<Object[]>} parentCategories Category path of this product as list of categories.
         * @property {observable<Object[]>} childSKUs List of child SKUs under this product.
         * @property {observable<Object[]>} relatedProducts List of related Products.
         * @property {observable<string>} route URI Path to this product.
         * @property {observable<?>} shippingSurcharge
         * @property {observable<string>} seoDescriptionDerived Derived product description for search engines.
         * @property {observable<string>} seoKeywordsDerived Derived product keywords for search engines.
         * @property {observable<?>} seoMetaInfo
         * @property {observable<string>} seoTitleDerived Derived product title for search engines.
         * @property {observable<string[]>} fullImageURLs List of URLs to full-sized product images.
         * @property {observable<string[]>} largeImageURLs List of URLs to large product images.
         * @property {observable<string[]>} mediumImageURLs List of URLs to medium sized product images.
         * @property {observable<string[]>} smallImageURLs List of URLs to small product images.
         * @property {observable<string[]>} sourceImageURLs List of URLs to source images.
         * @property {observable<string[]>} thumbImageURLs List of URLs to thumbnail images.
         * @property {observable<string>} primaryFullImageURL URL to primary full-sized image.
         * @property {observable<string>} primaryLargeImageURL URL to primary large image.
         * @property {observable<string>} primaryMediumImageURL URL to primary medium image.
         * @property {observable<string>} primarySmallImageURL URL to primary small image.
         * @property {observable<string>} primarySourceImageURL URL to primary source image.
         * @property {observable<string>} primaryThumbImageURL URL to primary thumbnail image.
         * @property {observable<string>} primaryImageAltText Text to display in product image alt attribute.
         * @property {observable<string>} primaryImageTitle Text to display in product image title attribute.
         * @property {observable<Object[]>} productImagesMetadata
         * @property {CCStoreConfiguration} storeConfiguration An instance of the cc-store-configuration containing store-configuration data.
         */
        function ProductViewModel(pProduct, params) {
            var self = this;
            //Emptying child sku array if the data is unavailable (usually in case of related products)
            if(!pProduct.childSKUs) {
                pProduct.childSKUs = [];
            }
            ko.mapping.fromJS(pProduct, {}, self);
            self.product             = pProduct;
            // create observables for the existing properties that didn't come in pProduct data (which are currently been refernced at various places)
            var inclusionObservableList = ["id", "salePrice", "listPrice", "primaryFullImageURL", "primaryLargeImageURL", "primaryMediumImageURL", "primarySmallImageURL", "primaryThumbImageURL", "shippingSurcharge", "type", "displayName"];
            var inclusionObservableArrayList = ["childSKUs", "thumbImageURLs", "smallImageURLs", "mediumImageURLs", "largeImageURLs", "fullImageURLs", "sourceImageURLs", "productImagesMetadata"];
            for (var recordKey in inclusionObservableList) {
                if (self[inclusionObservableList[recordKey]] == undefined) {
                    self[inclusionObservableList[recordKey]] = ko.observable('');
                }
            }
            for (var recordKey in inclusionObservableArrayList) {
                if (self[inclusionObservableArrayList[recordKey]] == undefined) {
                    self[inclusionObservableArrayList[recordKey]] = ko.observableArray([]);
                }
            }
            self.minPrice            = self.getMinimumPrice();
            self.maxPrice            = self.getMaximumPrice(false);
            self.productSalePrice    = self.getSalePrice();
            self.productListPrice    = self.getListPrice();
            self.isOnSale            = self.isOnSale();
            self.hasPriceRange       = self.hasRange();
            self.stockStatus         = ko.observable();
            self.variantName              = ko.observable();
            self.variantValue             = ko.observable();
            self.relatedProducts     = pProduct.relatedProducts;
            if (self.productVariantOptions && self.productVariantOptions()) {
                self.variantOptionsArray = self.populateVariantOptions(ko.mapping.toJS(self.productVariantOptions()));
            }
            self.inStock             = ko.observable(false);
            self.showStockStatus     = ko.observable(false);
            self.filtered            = ko.observable(false);
            self.skuProperties	   = ko.observableArray([]);
            self.storeConfiguration  = CCStoreConfiguration.getInstance();

            return self;
        }

        /**
         * Calculate the minimum price for this product. This will be the lowest price taking
         * into consideration the prices of child SKUs and whether any SKUs are currently on sale.
         *
         * @name ProductViewModel#getMinimumPrice
         * @function
         * @returns {number} Minimum price of this product.
         */
        ProductViewModel.prototype.getMinimumPrice = function() {
            var self = this;
            var productPrice, minPrice, sku, skuPrice, index;
            var productChildSKUsLength = self.childSKUs() ? self.childSKUs().length : 0;
            if (self.minActivePrice) {
                return self.minActivePrice();
            } else {
                productPrice = (self.salePrice() || self.salePrice() === 0) ? self.salePrice() : self.listPrice();
                if (self.childSKUs()) {
                    if (productChildSKUsLength > 0) {
                        for (var index in self.childSKUs()) {
                            sku = self.childSKUs()[index];
                            skuPrice = (sku.salePrice() || sku.salePrice() === 0) ? sku.salePrice() : sku.listPrice();
                            if (!skuPrice && skuPrice != 0 && skuPrice != null) {
                                skuPrice = productPrice;
                            }
                            if ((!minPrice && minPrice != 0) || skuPrice < minPrice) {
                                minPrice = skuPrice;
                            }
                        }
                    } else {
                        minPrice = productPrice;
                    }
                }
                return minPrice;
            }
        };

        /**
         * Get the maximum price for this product. This will be the highest price for the product taking into
         * consideration the prices of child SKUs.
         *
         * @name ProductViewModel#getMaximumPrice
         * @function
         * @param {boolean} listPriceOnly Only consider the list price.
         * @returns {number} Maximum price of this product.
         */
        ProductViewModel.prototype.getMaximumPrice = function(listPriceOnly) {
            var self = this;
            var productPrice, maxPrice, sku, skuPrice, index;
            var productChildSKUsLength = self.childSKUs().length;
            if (self.maxActivePrice && !listPriceOnly) {
                return self.maxActivePrice();
            } else {
                if (listPriceOnly) {
                    productPrice = self.listPrice();
                } else {
                    productPrice = (self.salePrice() || self.salePrice() === 0) ? self.salePrice() : self.listPrice();
                }
                if (self.childSKUs()) {
                    if (productChildSKUsLength > 0) {
                        for (var index in self.childSKUs()) {
                            sku = self.childSKUs()[index];
                            if (listPriceOnly) {
                                skuPrice = sku.listPrice();
                            } else {
                                skuPrice = (sku.salePrice() || sku.salePrice() === 0) ? sku.salePrice() : sku.listPrice();
                            }
                            if (!skuPrice && skuPrice != 0 && skuPrice != null) {
                                skuPrice = productPrice;
                            }
                            if ((!maxPrice && maxPrice != 0) || skuPrice > maxPrice) {
                                maxPrice = skuPrice;
                            }
                        }
                    } else {
                        maxPrice = productPrice;
                    }
                }
                return maxPrice;
            }
        };

        /**
         * Determine if this product is on sale. If a product has variant SKUs then it is
         * considered on sale if any of the SKUs are on sale.
         *
         * @name ProductViewModel#isOnSale
         * @function
         * @returns {boolean} true if this product or any of its child SKUs are on sale, otherwise false.
         */
        ProductViewModel.prototype.isOnSale = function() {
            var self = this;
            var productChildSKUsLength = self.childSKUs().length;
            if (!productChildSKUsLength && self.product.salePrice) {
                return true;
            }
            for (var index in self.childSKUs()) {
                var sku = self.childSKUs()[index];
                if (sku.salePrice() != null && sku.salePrice() >= 0) {
                    return true;
                }
            }
            return false;
        };

        /**
         * Determine if this product has a price range. It does if minimum and maximum prices are different.
         *
         * @name ProductViewModel#hasRange
         * @function
         * @returns {boolean} true if this product has a price range, otherwise false.
         */
        ProductViewModel.prototype.hasRange = function() {
            var self = this;
            self.minPrice = self.getMinimumPrice();
            self.maxPrice = self.getMaximumPrice(false);
            if (self.minPrice != self.maxPrice && !isNaN(parseFloat(self.minPrice)) && !isNaN(parseFloat(self.maxPrice))) {
                return true;
            }
            return false;
        };

        /**
         * Get this product's list price. If product has one or more than one child skus the list price of
         * the product is the maximum of list price among the child skus.
         *
         * @name ProductViewModel#getListPrice
         * @function
         * @returns {number} Maximum list price of this product.
         */
        ProductViewModel.prototype.getListPrice = function() {
            var self = this;
            if (self.childSKUs().length >= 1) {
                return self.getMaximumPrice(true);
            } else {
                return self.listPrice();
            }
        };

        /**
         * Get this product's sale price. If minPrice and maxPrice for a product is same, sale price is
         * same as minPrice only if product is on sale.
         *
         * @name ProductViewModel#getSalePrice
         * @function
         * @returns {number} Sale price of the product.
         */
        ProductViewModel.prototype.getSalePrice = function() {
            var self = this;
            if (!self.hasRange() && self.isOnSale()) {
                return self.minPrice;
            }
            return self.salePrice();
        };

        /**
         * Fetch the price information for this product via a REST call. On successful response, updates the
         * view model.
         *
         * @ProductViewModel#getPrices
         * @function
         * @param {string} productId Repository ID of product to fetch prices.
         * @param {string} skuId Repository ID of SKU to limit price results (currently unused).
         */
        ProductViewModel.prototype.getPrices = function(productId, skuId) {
            var self = this;
            var input = {};
            // Not using the sku ID, because currently only use the product level
            // prices for product details. We will need to update this for options
            // support.
            var pathParam = productId;
            var contextObj = {};
            contextObj[CCConstants.ENDPOINT_KEY] = CCConstants.ENDPOINT_GET_PRODUCT_PRICES;
            var filterKey = self.storeConfiguration.getFilterToUse(contextObj);
            if (filterKey) {
                input[CCConstants.FILTER_KEY] = filterKey;
            }
            var url = CCConstants.ENDPOINT_GET_PRODUCT_PRICES;
            ccRestClient.request(url, input,
                // success callback
                function(data) {

                    // Utility function to update the volume pricing levels and numLevels observables.
                    var updateVolumePricing = function (oldVolumePrice, newVolumePrice) {
                        // Update levels observable.
                        oldVolumePrice.levels(newVolumePrice.levels);

                        // Update numLevels observable.
                        oldVolumePrice.numLevels(newVolumePrice.numLevels);
                    };

                    // Process the data response.
                    if (data.skuPrices) {
                        var skuPricesLength = self.childSKUs().length;
                        var dataSkuLength = data.skuPrices.length;
                        for (var index = 0; index < skuPricesLength; index += 1) {
                            for (var indexData = 0; indexData < dataSkuLength; indexData += 1) {
                                if (self.childSKUs() && (self.childSKUs()[index].repositoryId() ==  data.skuPrices[indexData].skuId)) {
                                    self.childSKUs()[index].listPrice(data.skuPrices[indexData].listPrice);
                                    self.childSKUs()[index].salePrice(data.skuPrices[indexData].salePrice);

                                    // List price list volume price data.
                                    if (data.skuPrices[indexData].hasOwnProperty(CCConstants.LIST_VOLUME_PRICE)) {
                                        if (data.skuPrices[indexData].listVolumePrice.hasOwnProperty(CCConstants.BULK_PRICE)) {

                                            updateVolumePricing(self.childSKUs()[index].listVolumePrice.bulkPrice,
                                                data.skuPrices[indexData].listVolumePrice.bulkPrice);
                                        }
                                        else if (data.skuPrices[indexData].listVolumePrice.hasOwnProperty(CCConstants.TIERED_PRICE)) {

                                            updateVolumePricing(self.childSKUs()[index].listVolumePrice.tieredPrice,
                                                data.skuPrices[indexData].listVolumePrice.tieredPrice);
                                        }
                                    }

                                    // Sale price list volume price data.
                                    if (data.skuPrices[indexData].hasOwnProperty(CCConstants.SALE_VOLUME_PRICE)) {
                                        if (data.skuPrices[indexData].saleVolumePrice.hasOwnProperty(CCConstants.BULK_PRICE)) {

                                            updateVolumePricing(self.childSKUs()[index].saleVolumePrice.bulkPrice,
                                                data.skuPrices[indexData].saleVolumePrice.bulkPrice);
                                        }
                                        else if (data.skuPrices[indexData].saleVolumePrice.hasOwnProperty(CCConstants.TIERED_PRICE)) {

                                            updateVolumePricing(self.childSKUs()[index].saleVolumePrice.tieredPrice,
                                                data.skuPrices[indexData].saleVolumePrice.tieredPrice);
                                        }
                                    }
                                }
                            }
                        }
                    }

                    self.hasPriceRange = data.priceRange;

                    if (data.priceRange === true) {
                        self.maxPrice = data.priceMax;
                        self.minPrice = data.priceMin;
                    }
                    if (data.list) {
                        self.listPrice(data.list);
                    }

                    if (self.product.type === null && data.skuPrices) {
                        if (self.childSKUs() && self.childSKUs()[0]) {
                            self.childSKUs()[0].listPrice(data.skuPrices.listPrice || data.list);
                            self.listPrice(data.skuPrices.listPrice || data.list);
                        }

                        // List price list volume price data.
                        if (data.skuPrices.hasOwnProperty(CCConstants.LIST_VOLUME_PRICE)) {
                            if (data.skuPrices.listVolumePrice.hasOwnProperty(CCConstants.BULK_PRICE)) {

                                updateVolumePricing(self.childSKUs()[0].listVolumePrice.bulkPrice,
                                    data.skuPrices.listVolumePrice.bulkPrice);
                            }
                            else if (data.skuPrices.listVolumePrice.hasOwnProperty(CCConstants.TIERED_PRICE)) {

                                updateVolumePricing(self.childSKUs()[0].listVolumePrice.tieredPrice,
                                    data.skuPrices.listVolumePrice.tieredPrice);
                            }
                        }

                        // Sale price list volume price data.
                        if (data.skuPrices.hasOwnProperty(CCConstants.SALE_VOLUME_PRICE)) {
                            if (data.skuPrices.saleVolumePrice.hasOwnProperty(CCConstants.BULK_PRICE)) {

                                updateVolumePricing(self.childSKUs()[0].saleVolumePrice.bulkPrice,
                                    data.skuPrices.saleVolumePrice.bulkPrice);
                            }
                            else if (data.skuPrices.saleVolumePrice.hasOwnProperty(CCConstants.TIERED_PRICE)) {

                                updateVolumePricing(self.childSKUs()[0].saleVolumePrice.tieredPrice,
                                    data.skuPrices.saleVolumePrice.tieredPrice);
                            }
                        }
                    }

                    if (data.sale || data.sale === 0) {
                        self.salePrice(data.sale);
                    } else {
                        self.salePrice(null);
                    }
                    if (self.product.type === null && data.skuPrices) {
                        if (self.childSKUs() && self.childSKUs()[0]) {
                            self.childSKUs()[0].salePrice(data.skuPrices.salePrice);
                        }
                        self.salePrice(data.skuPrices.salePrice);
                    }
                    $.Topic(pubsub.topicNames.PRODUCT_PRICE_CHANGED).publish();
                },
                // error callback
                function(data) {
                    // do nothing
                },
                pathParam);
        };

        /**
         * Fetch the stock availability for this product via a REST call. On successful response, updates the
         * view model.
         *
         * @name ProductViewModel#getAvailability
         * @function
         * @param {string} productId Repository ID of product to fetch stock availability information.
         * @param {string} skuId Repository ID of SKU to limit availability results.
         * @param {string} catalogId Repository ID of catalog.
         */
        ProductViewModel.prototype.getAvailability = function(productId, skuId, catalogId) {
            var self = this;
            var input = {};
            var pathParam = productId;
            input[CCConstants.SKU_ID] = skuId;
            input[CCConstants.CATALOG] = (catalogId == null ? '' : catalogId);
            var url = CCConstants.ENDPOINT_GET_PRODUCT_AVAILABILITY;
            var contextObj = {};
            contextObj[CCConstants.ENDPOINT_KEY] = CCConstants.ENDPOINT_GET_PRODUCT_AVAILABILITY;
            contextObj[CCConstants.IDENTIFIER_KEY] = "productStockStatus";
            var filterKey = self.storeConfiguration.getFilterToUse(contextObj);
            if (filterKey) {
                input[CCConstants.FILTER_KEY] = filterKey;
            }
            ccRestClient.request(url, input,
                function(data) {
                    if (data["productSkuInventoryStatus"] != null) {
                        var productSkuInventoryMap = data["productSkuInventoryStatus"];
                        var productChildSKUsLength = self.product.childSKUs ? self.product.childSKUs.length : 0;
                        for (var index = 0; index < productChildSKUsLength; index++) {
                            var sku = self.product.childSKUs[index];
                            sku.quantity = productSkuInventoryMap[sku.repositoryId];
                        }
                    }
                    self.stockStatus(data);
                },
                //error callback
                function(data) {
                    var stockStatus = {
                        stockStatus : CCConstants.OUT_OF_STOCK
                    };
                    self.stockStatus(stockStatus);
                },
                pathParam);
        };

        /**
         * Get the prices for a specific SKU associated with this product.
         *
         * @name ProductViewModel#getSkuPrice
         * @function
         * @param {Object} skuObj SKU child object
         * @returns {Object} Object with 'listPrice' and 'salePrice' keys containing SKU prices.
         */
        ProductViewModel.prototype.getSkuPrice = function(skuObj) {
            var self = this;
            var skuPrices = {};
            // TODO(shacking) This loop looks like it could exit early.
            for (var index in self.childSKUs()) {
                if (self.childSKUs()[index].repositoryId() ==  skuObj.repositoryId) {
                    skuPrices.listPrice = self.childSKUs()[index].listPrice();
                    skuPrices.salePrice = self.childSKUs()[index].salePrice();
                    skuPrices.listVolumePrice = self.childSKUs()[index].listVolumePrice;
                    skuPrices.saleVolumePrice = self.childSKUs()[index].saleVolumePrice;
                }
            }
            return skuPrices;
        };

        /**
         * Checks if the product is contains one or more configurable SKUs.
         * This should validate on two levels. We can expect a flag from the server
         * at product level. We also need to check if one of the SKU is configurable.
         * @function
         * @returns {boolean} whether the product contains one or more configurable SKUs.
         */
        ProductViewModel.prototype.isConfigurable = function() {
            var self = this;
            // Check if the configurable flag exists and is true. If not proceed to
            // the next condition.
            if (self.configurable()) {
                return true;
            } else {
                // Get all the SKUs for the product
                for (var index in self.childSKUs()) {
                    // Break out when one SKU is configurable
                    if (self.childSKUs()[index].configurable()) {
                        return true;
                    }
                }
                // If none of the SKUs are configurable, return false.
                return false;
            }
        };

        /**
         * Find and return all properties for the given SKU
         *
         * @name ProductViewModel#getSkuProperties
         * @function
         * @returns {Object} Object containing all properties pertaining to the given SKU.
         */
        ProductViewModel.prototype.fetchSkuProperties = function() {
            var self =this;
            self.skuProperties([]);
            SkuPropertiesHandler.getAll(self.skuProperties, self.product.type);
        };

        /**
         * Populates productVariantOption model to display the variant options of the product.
         *
         * @name ProductViewModel#populateVariantOptions
         * @function
         * @param {Object} options product variant options
         * @returns {Array} variantOptionsArray variant options array.
         */
        ProductViewModel.prototype.populateVariantOptions = function(options) {
            var self = this;
            if (options && options !== null && options.length > 0) {
                var optionsArray = [], optionValues, productVariantOption, variants;

                for (var i = 0; i < options.length; i++) {
                    optionValues = self.mapOptionsToArray(options[i].optionValueMap);
                    productVariantOption = self.productVariantModel(options[i].optionName, options[i].mapKeyPropertyAttribute, optionValues, options[i].optionId);
                    optionsArray.push(productVariantOption);
                }
            } else {
                self.imgMetadata = self.productImagesMetadata;
            }
            return optionsArray;
        };

        //this method convert the map to array of key value object and sort them based on the enum value
        //to use it in the select binding of knockout
        ProductViewModel.prototype.mapOptionsToArray = function(variantOptions) {
            var optionArray = [];

            for(var key in variantOptions) {
                if (variantOptions.hasOwnProperty(key)) {
                    optionArray.push({ key: key, value: variantOptions[key], visible: ko.observable(true) });
                }
            }
            return optionArray;
        };

        /*this create view model for variant options this contains
        name of the option, possible list of option values for the option
        selected option to store the option selected by the user.
        ID to map the selected option*/
        ProductViewModel.prototype.productVariantModel= function(optionDisplayName, optionId, optionValues, actualOptionId) {
            var self = this;
            var productVariantOption = {};
            var productImages = {};
            productVariantOption.optionDisplayName = optionDisplayName;
            productVariantOption.parent = this;
            productVariantOption.optionId = optionId;
            productVariantOption.originalOptionValues = ko.observableArray(optionValues);
            productVariantOption.actualOptionId = actualOptionId;

            var showOptionCation = ko.observable(true);
            if (optionValues.length === 1) {
                showOptionCation(self.checkOptionValueWithSkus(optionId, optionValues[0].value));
            }
            //If there is just one option value in all Skus we dont need any caption
            if (showOptionCation()) {
                productVariantOption.optionCaption = CCi18n.t('ns.common:resources.optionCaption', {optionName: optionDisplayName}, true);
            }
            productVariantOption.selectedOptionValue = ko.observable();
            productVariantOption.countVisibleOptions = ko.computed(function() {
                var count = 0;
                for (var i = 0; i < productVariantOption.originalOptionValues().length; i++) {
                    if (optionValues[i].visible() == true) {
                        count = count + 1;
                    }
                }
                return count;
            }, productVariantOption);
            productVariantOption.disable = ko.computed(function() {
                if (productVariantOption.countVisibleOptions() == 0) {
                    return true;
                } else {
                    return false;
                }
            }, productVariantOption);
            productVariantOption.selectedOption = ko.computed({
                write: function(option) {
                    self.filtered(false);
                    productVariantOption.selectedOptionValue(option);
                    self.filterOptionValues(productVariantOption.optionId);
                },
                read: function() {
                    return productVariantOption.selectedOptionValue();
                },
                owner: productVariantOption
            });
            productVariantOption.selectedOption.extend({
                required: { params: true, message:CCi18n.t('ns.common:resources.optionRequiredMsg', {optionName: optionDisplayName}, true) }
            });
            productVariantOption.optionValues = ko.computed({
                write: function(value) {
                    productVariantOption.originalOptionValues(value);
                },
                read: function() {
                    return ko.utils.arrayFilter(
                        productVariantOption.originalOptionValues(),
                        function(item) { return item.visible() == true; }
                    );
                },
                owner: productVariantOption
            });

            // DONOT KNOW WHAT TO DO
            productImages.thumbImageURLs = ( self.thumbImageURLs().length == 1 && self.thumbImageURLs()[0].indexOf("/img/no-image.jpg&")>0 ) ?
                [] : ( self.thumbImageURLs() );
            productImages.smallImageURLs = (self.smallImageURLs().length == 1 && self.smallImageURLs()[0].indexOf("/img/no-image.jpg&")>0 ) ?
                [] : ( self.smallImageURLs() );
            productImages.mediumImageURLs = ( self.mediumImageURLs().length == 1 && self.mediumImageURLs()[0].indexOf("/img/no-image.jpg&")>0 ) ?
                [] : ( self.mediumImageURLs );
            productImages.largeImageURLs = ( self.largeImageURLs().length == 1 && self.largeImageURLs()[0].indexOf("/img/no-image.jpg&")>0 ) ?
                [] : ( self.largeImageURLs() );
            productImages.fullImageURLs = ( self.fullImageURLs().length == 1 && self.fullImageURLs()[0].indexOf("/img/no-image.jpg&")>0 ) ?
                [] : ( self.fullImageURLs() );
            productImages.sourceImageURLs = ( self.sourceImageURLs().length == 1 && self.sourceImageURLs()[0].indexOf("/img/no-image.jpg")>0 ) ?
                [] : ( self.sourceImageURLs() );

            var prodImgMetadata =[];
            if(self.thumbImageURLs && self.thumbImageURLs().length>0) {
                for(var index=0; index< self.thumbImageURLs().length;index++) {
                    prodImgMetadata.push(self.productImagesMetadata[index]);
                }
            }

            return productVariantOption;
        };

        //this method is triggered whenever there is a change to the selected option.
        ProductViewModel.prototype.filterOptionValues = function(selectedOptionId) {
            var self = this;

            if (self.filtered()) {
                return;
            }
            var variantOptions = self.variantOptionsArray;
            for (var i = 0; i < variantOptions.length; i++) {
                var currentOption = variantOptions[i];
                var matchingSkus = self.getMatchingSKUs(variantOptions[i].optionId);
                var optionValues = self.updateOptionValuesFromSku(matchingSkus, selectedOptionId, currentOption);
                variantOptions[i].optionValues(optionValues);
                self.filtered(true);
            }
            self.updateSingleSelection(selectedOptionId);
        };

        // get all the matching SKUs
        ProductViewModel.prototype.getMatchingSKUs = function(optionId) {

            var self = this;

            var childSkus = self.childSKUs();
            var matchingSkus = [];
            var variantOptions = self.variantOptionsArray;
            var selectedOptionMap = {};
            for (var j = 0; j < variantOptions.length; j++) {
                if (variantOptions[j].optionId != optionId && variantOptions[j].selectedOption() != undefined) {
                    selectedOptionMap[variantOptions[j].optionId] = variantOptions[j].selectedOption().value;
                }
            }
            for (var i = 0; i < childSkus.length; i++) {
                var skuMatched = true;
                for (var key in selectedOptionMap) {
                    if (selectedOptionMap.hasOwnProperty(key)) {
                        if (!childSkus[i].dynamicPropertyMapLong[key] ||
                            childSkus[i].dynamicPropertyMapLong[key]() != selectedOptionMap[key]) {
                            skuMatched = false;
                            break;
                        }
                    }
                }
                if (skuMatched) {
                    matchingSkus.push(childSkus[i]);
                }
            }
            return matchingSkus;
        };

        //this method constructs option values for all the options other than selected option
        //from the matching skus.
        ProductViewModel.prototype.updateOptionValuesFromSku = function (skus, selectedOptionID, currentOption) {
            var optionId = currentOption.optionId;
            var options = [];
            var optionValues = currentOption.originalOptionValues();
            for (var k = 0; k < skus.length; k++) {
                var optionValue = skus[k].dynamicPropertyMapLong[optionId];
                if (optionValue!= undefined ) {
                    options.push(optionValue());
                }
            }
            for (var j = 0; j < optionValues.length; j++) {
                var value = optionValues[j].value;
                var visible = false;
                var index = options.indexOf(value);
                if (index != -1) {
                    visible = true;
                }
                optionValues[j].visible(visible);
            }
            return optionValues;
        };

        //This method updates the selection value for the options wiht single option values.
        ProductViewModel.prototype.updateSingleSelection = function(selectedOptionID) {
            var self = this;

            var variantOptions = self.variantOptionsArray;
            for (var i = 0; i < variantOptions.length; i++) {
                var optionId = variantOptions[i].optionId;
                if (variantOptions[i].countVisibleOptions() == 1 && variantOptions[i].selectedOption()== undefined && optionId != selectedOptionID ) {
                    var isValidForSingleSelection = self.validForSingleSelection(optionId);
                    var optionValues = variantOptions[i].originalOptionValues();
                    for (var j = 0; j < optionValues.length; j++) {
                        if (optionValues[j].visible() == true) {
                            variantOptions[i].selectedOption(optionValues[j]);
                            break;
                        }
                    }
                }
            }
        };

        //This method returns true if the option passed is the only one not selected
        //and all other options are either selected or disabled.
        ProductViewModel.prototype.validForSingleSelection = function(optionId) {
            var self = this;

            var variantOptions = self.variantOptionsArray;
            for (var j = 0; j < variantOptions.length; j++) {
                if (variantOptions[j].disable() || (variantOptions[j].optionId != optionId && variantOptions[j].selectedOption()!= undefined)) {
                    return true;
                }
                if (variantOptions[j].optionId != optionId && variantOptions[j].selectedOption()== undefined && variantOptions[j].countVisibleOptions() == 1) {
                    return true;
                }
            }
            return false;
        };

        //this method is triggered to check if the option value is present in all the child Skus.
        ProductViewModel.prototype.checkOptionValueWithSkus = function(optionId, value) {
            var self = this;
            var childSkus = self.childSKUs();
            var childSkusLength = childSkus.length;
            for (var i = 0; i < childSkusLength; i++) {
                if (!childSkus[i].dynamicPropertyMapLong[optionId] || childSkus[i].dynamicPropertyMapLong[optionId]() === undefined) {
                    return true;
                }
            }
            return false;
        };

        // this method  returns a map of all the options selected by the user for the product
        ProductViewModel.prototype.getSelectedSkuOptions = function(variantOptions) {
            var selectedOptions = [];
            for (var i = 0; i < variantOptions.length; i++) {
                if (!variantOptions[i].disable()) {
                    selectedOptions.push({'optionName': variantOptions[i].optionDisplayName, 'optionValue': variantOptions[i].selectedOption().key, 'optionId': variantOptions[i].actualOptionId, 'optionValueId': variantOptions[i].selectedOption().value});
                }
            }
            return selectedOptions;
        };

        return ProductViewModel;
    }
);

