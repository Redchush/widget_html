define(
  //-------------------------------------------------------------------
  // PACKAGE NAME
  //-------------------------------------------------------------------
  'viewModels/productListingViewModelFactory',
  
  //-------------------------------------------------------------------
  // DEPENDENCIES
  //-------------------------------------------------------------------
  ['viewModels/productListingViewModel', 
    'viewModels/productListingSearchViewModel', 'ccConstants'],
  
  //-------------------------------------------------------------------
  // MODULE DEFINITION
  //-------------------------------------------------------------------
  function(ProductListingViewModel, ProductListingSearchViewModel, CCConstants) {
    
    "use strict";
    var mInstance = null;
       
    function ProductListingViewModelFactory() {
   
      if(mInstance !== null){
          throw new Error("Cannot instantiate more than one ProductListingViewModelFactory, use ProductListingViewModelFactory.getInstance()");
      } 
    }
    
    ProductListingViewModelFactory.prototype = {
      
      createListingViewModel: function(widget) {
        
        var pListingType = widget.listType();
        var listViewModel; 
        
        if (pListingType === CCConstants.LIST_VIEW_PRODUCTS){
          
          listViewModel = this.createProductListingViewModel(widget);
          
        } if (pListingType === CCConstants.LIST_VIEW_SEARCH){
         
          listViewModel = this.createProductListingSearchViewModel(widget);
        }
        return listViewModel;
      },
      
      // Returns a new instance of ProductListingViewModel
      createProductListingViewModel: function(widget) {
        
        /*
        var instance = ProductListingViewModelFactory.prototype.listingViewModelInstance;
        
        if(!instance) {
          instance = new ProductListingViewModel();
          ProductListingViewModelFactory.prototype.listingViewModelInstance = instance;
        }
        
        return instance;
        */ 
        return new ProductListingViewModel(widget);
      },
      
      // Returns a new instance of ProductListingSearchViewModel
      createProductListingSearchViewModel: function(widget) {
        return new ProductListingSearchViewModel(widget);  
      }
    };
    
    // Return a single instance of ProductListingViewModelFactory
    ProductListingViewModelFactory.getInstance = function(){
        
      if(mInstance === null){
        mInstance = new ProductListingViewModelFactory();
      }
      return mInstance;
    };
 
    return ProductListingViewModelFactory.getInstance();  
    
  }
);

