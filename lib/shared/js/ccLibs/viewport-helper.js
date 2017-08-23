/*global $ */
/**
 * @fileoverview Determine Viewport size in one place rather than many.
 */
define('viewportHelper',
  ['jquery', 'knockout', 'ccConstants'],

  function($, ko, ccConstants) {
    "use strict";

    /**
     * Create a Viewport helper
     */
   function ViewportHelper() {
     if(ViewportHelper.singleInstance) {
       throw new Error("Cannot instantiate more than one ViewportHelper, use getInstance()");
     }

     var self = this;
     this.viewportMode = ko.observable(null);
     this.viewportDesignation = ko.observable(null);
     this.layoutViewports = ko.observable(null);
     this.setViewport($(window)[0].innerWidth || $(window).width());

     $(window).resize(function() {
       self.setViewport($(window)[0].innerWidth || $(window).width());
     });

     return (this);
   }

   ViewportHelper.XS_CLASS = "col-xs-";
   ViewportHelper.SM_CLASS = "col-sm-";
   ViewportHelper.MD_CLASS = "col-md-";
   ViewportHelper.LG_CLASS = "col-lg-";

   ViewportHelper.XS_OFFSET = "col-xs-offset-";
   ViewportHelper.SM_OFFSET = "col-sm-offset-";
   ViewportHelper.MD_OFFSET = "col-md-offset-";
   ViewportHelper.LG_OFFSET = "col-lg-offset-";


   /**
     * Checks the size of the current viewport and sets the viewport
     * mode accordingly.
     * @private
     * @param {integer} viewportWidth The width of the viewport.
     */
    ViewportHelper.prototype.setViewport = function(viewportWidth) {
      if (viewportWidth >= ccConstants.VIEWPORT_LARGE_DESKTOP_LOWER_WIDTH) {
        if (this.viewportMode() !== ccConstants.LARGE_DESKTOP_VIEW) {
          this.viewportMode(ccConstants.LARGE_DESKTOP_VIEW);
          this.viewportDesignation(ccConstants.VIEWPORT_LARGE);
        }
      } else if (viewportWidth > ccConstants.VIEWPORT_TABLET_UPPER_WIDTH  && viewportWidth < ccConstants.VIEWPORT_LARGE_DESKTOP_LOWER_WIDTH) {
        if (this.viewportMode() !== ccConstants.DESKTOP_VIEW) {
          this.viewportMode(ccConstants.DESKTOP_VIEW);
          this.viewportDesignation(ccConstants.VIEWPORT_MEDIUM);
        }
      } else if (viewportWidth >= ccConstants.VIEWPORT_TABLET_LOWER_WIDTH && viewportWidth <= ccConstants.VIEWPORT_TABLET_UPPER_WIDTH) {
        if (this.viewportMode() !== ccConstants.TABLET_VIEW) {
          this.viewportMode(ccConstants.TABLET_VIEW);
          this.viewportDesignation(ccConstants.VIEWPORT_SMALL);
        }
      } else if (this.viewportMode() !== ccConstants.PHONE_VIEW) {
        this.viewportMode(ccConstants.PHONE_VIEW);
        this.viewportDesignation(ccConstants.VIEWPORT_XS);
      }
    };

    /**
     * Returns a string representing the class to be applied to an entity based
     * on the smallest assigned viewport for the current layout and the supplied
     * width and offset values.
     *
     * @param {integer} width The width, in columns, of the entity.
     * @param {integer} offset The width, in columnes, of the offset from the previous entityt.
     */
    ViewportHelper.prototype.getWidthClass = function(width, offset) {
      var viewportClass = ViewportHelper.SM_CLASS,
      offsetClass = ViewportHelper.SM_OFFSET;

      if (!width || width === "" || isNaN(width)) {
        return "";
      }

      if (this.layoutViewports && this.layoutViewports() != null && this.layoutViewports() !== "") {
        if (this.layoutViewports().toLowerCase().indexOf(ccConstants.VIEWPORT_XS.toLowerCase()) !== -1) {
          viewportClass = ViewportHelper.XS_CLASS;
          offsetClass = ViewportHelper.XS_OFFSET;
        } else if (this.layoutViewports().toLowerCase().indexOf(ccConstants.VIEWPORT_SMALL.toLowerCase()) !== -1) {
          viewportClass = ViewportHelper.SM_CLASS;
          offsetClass = ViewportHelper.SM_OFFSET;
        } else if (this.layoutViewports().toLowerCase().indexOf(ccConstants.VIEWPORT_MEDIUM.toLowerCase()) !== -1) {
          viewportClass = ViewportHelper.MD_CLASS;
          offsetClass = ViewportHelper.MD_OFFSET;
        } else if (this.layoutViewports().toLowerCase().indexOf(ccConstants.VIEWPORT_LARGE.toLowerCase()) !== -1) {
          viewportClass = ViewportHelper.LG_CLASS;
          offsetClass = ViewportHelper.LG_OFFSET;
        }
      }

      viewportClass += width;

      if (offset && offset !== "" && !isNaN(offset)) {
        viewportClass += " " + offsetClass + offset;
      }

      return viewportClass;

    };

    /**
     * Returns the singleton instance of ViewportHelper. Creates it if it doesn't exist.
     */
     ViewportHelper.getInstance = function() {
      if(!ViewportHelper.singleInstance) {
        ViewportHelper.singleInstance = new ViewportHelper();
      }

      return ViewportHelper.singleInstance;
    };


    /**
     * return the singleton
     **/
    return ViewportHelper.getInstance();
  }
);

