/**
 * @fileoverview Price List Group View Model.
 *  *
 *
 * @typedef {Object} PaymentDetails
 */
/*global define */
define(
    //-------------------------------------------------------------------
    // PACKAGE NAME
    //-------------------------------------------------------------------
    'pageLayout/site',

    //-------------------------------------------------------------------
    // DEPENDENCIES
    //-------------------------------------------------------------------
    ['knockout', 'ccRestClient', 'ccConstants', 'jquery', 'storageApi', 'pageViewTracker'],

    //-------------------------------------------------------------------
    // MODULE DEFINITION
    //-------------------------------------------------------------------
    function(ko, ccRestClient, CCConstants, $, storageApi, pageViewTracker) {

        "use strict";

        function SiteViewModel(pAdapter, data, pContextData) {

            if (SiteViewModel.singleInstance) {
                throw new Error("Cannot instantiate more than one SiteViewModel, use getInstance(pAdapter, data, pParams)");
            }

            var self = this;

            // Provide price list group object to all widgets.
            self.selectedPriceListGroup = ko.observable(data ? data.priceListGroup.defaultPriceListGroup : null);
            self.activePriceListGroups = ko.observableArray([]);

            // No-Image Image Source
            var noImageSrc = '/img/no-image.jpg';

            if (data && data.siteInfo && data.siteInfo.noimage) {
                noImageSrc = data.siteInfo.noimage
            }

            self.noImageSrc = ko.observable(noImageSrc);
            return (self);
        };

        /**
         * Returns the current site locale
         * @function
         * @name SiteViewModel.getCurrentLocale
         */
        SiteViewModel.prototype.getCurrentLocale = function() {
            var storedLocale = ccRestClient.getStoredValue(CCConstants.LOCAL_STORAGE_USER_CONTENT_LOCALE);
            if(storedLocale != null) {
                return JSON.parse(storedLocale)[0].name
            } else {
                return $(':root').attr('lang');
            }
        }

        SiteViewModel.prototype.setContextData = function(data) {
            var self = this;
            // Populating view model with server data.
            for (var key in data) {
                self[key] = data[key];
            }

            if (self.selectedPriceListGroup()) {
                var isActive = false;
                var storedPriceListGroupId = JSON.parse(ccRestClient.getStoredValue(CCConstants.LOCAL_STORAGE_PRICELISTGROUP_ID));
                // Check whether the selected price list group is still active
                for (var i =  0; i < self.priceListGroup.activePriceListGroups.length; i++) {
                    if (storedPriceListGroupId && storedPriceListGroupId == self.priceListGroup.activePriceListGroups[i].id) {
                        self.selectedPriceListGroup(self.priceListGroup.activePriceListGroups[i]);
                        isActive = true;
                        break;
                    }
                }
                if (!isActive) { // If the selected price list group is not active then set default price list group
                    self.selectedPriceListGroup(data.priceListGroup.defaultPriceListGroup);
                }
            }

            self.activePriceListGroups(data.priceListGroup.activePriceListGroups);
        };

        /**
         * This method initializes the visitor service by loading the configured java script asynchronously.
         * @param {Object} [data] Additional data.
         */
        SiteViewModel.initializeVisitorService = function(data) {
            if (data && data.visitorServiceHost && data.tenantId && data.oracleUnifiedVisitHost) {
                window.OracleUnifiedVisit = {
                    accountId : data.tenantId + "_" + data.siteInfo.id,
                    host : data.visitorServiceHost,
                    handle : function() {
                        window.ATGSvcs && ATGSvcs.visitIDsLoaded();
                        storageApi.getInstance().setItem(CCConstants.VISITOR_ID,
                            window.OracleUnifiedVisit.visitorId());
                        storageApi.getInstance().setItem(CCConstants.VISIT_ID,
                            window.OracleUnifiedVisit.visitId());
                        pageViewTracker.handleVisitDetails();
                    }
                };

                require([data.oracleUnifiedVisitHost]);
            }
        };

        /**
         * Return the single instance of PriceListGroup. Create it if it doesn't exist.
         *
         * @function
         * @name PriceListGroup.getInstance
         * @param {RestAdapter} pAdapter The REST adapter.
         * @param {Object} [data] Additional data.
         * @return {PaymentDetails} Singleton instance.
         */
        SiteViewModel.getInstance = function(pAdapter, data, pParams) {
            if(!SiteViewModel.singleInstance) {
                SiteViewModel.singleInstance = new SiteViewModel(pAdapter, data, pParams);
                SiteViewModel.initializeVisitorService(data);
            }

            if (data) {
                SiteViewModel.singleInstance.setContextData(data);
            }

            return SiteViewModel.singleInstance;
        };

        return SiteViewModel;

    }
);

