/**
 * @fileoverview Message Handler Class
 * Handles notification messages (sent via Notifier) to determine what
 * should be displayed to the user.
 * 
 */
define(
  //-------------------------------------------------------------------
  // PACKAGE NAME
  //-------------------------------------------------------------------
  'viewModels/messageHandler',
  
  //-------------------------------------------------------------------
  // DEPENDENCIES
  //-------------------------------------------------------------------
  ['knockout', 'pubsub', 'notifier', 'notifications', 'jquery'],
    
  //-------------------------------------------------------------------
  // MODULE DEFINITION
  //-------------------------------------------------------------------
  function (ko, pubsub, notifier, notifications, $) {
  
    "use strict";
    
    //------------------------------------------------------------------
    // Class definition & member variables
    //------------------------------------------------------------------
    
    // Member variables for holding current subscriptions
    var mAddMsgListener;
    var mDelMsgListener;
    var mPageContextListener;
    var mUserLogoutListener;
    
    /**
     * Creates a Message Handler view model.
     * @private
     * @class MessageHandler
     * @property {observable<MessageModel>} message The current message being displayed.
     * @property {observable<boolean>} messageFlag Is a message being displayed?
     * @property {MessageModel[]} errorMsgs Array of 'active' error messages.   
     * @property {MessageModel[]} warnMsgs Array of 'active' warning messages.   
     * @property {MessageModel[]} successMsgs Array of 'active' success messages.   
     * @property {MessageModel[]} infoMsgs Array of 'active' info messages.
     * @property {string} pageId The ID of the page that contains the message.
     */
    function MessageHandler() {
      var self = this;

      if(MessageHandler.singleInstance) {
        throw new Error("Cannot instantiate more than one MessageHandler, use getInstance()");  
      }
      
      self.message        = ko.observable();
      self.messageFlag    = ko.observable();
      
      self.errorMsgs      = Array();
      self.warnMsgs       = Array();
      self.successMsgs    = Array();
      self.infoMsgs       = Array();
      
      self.pageId         = '';
      
      /**
       * Scrolls body to element if option set on message.
       * @function MessageHandler.scrollIfNecessary
       * @param {MessageModel} pMessage The message.
       * @param {string} elementId The ID of the containing element on the page.
       */
      self.scrollIfNeccessary = function(pMessage, elementId) {
        if(pMessage.scrollToMessage()) {
          var messagesElement = $(elementId);
          
          if(messagesElement && messagesElement.offset()) {
            $('html, body').animate({
              scrollTop: messagesElement.offset().top
            }, 1000);  
          }
        }
      };
      
      /**
       * Update displayable message list.
       * <p>
       * Adds the first message from the active lists, to the displayable 
       * messages array, in the following order of precedence:
       * <p>
       * ERROR > WARNING > SUCCESS > INFO
       * <p>
       * @function MessageHandler.updateMessages
       */
      self.updateMessages = function() {
        
        for(var i=0;i<self.errorMsgs.length;i++) {
          if(self.errorMsgs[i].pageId == self.pageId) {
            self.message(self.errorMsgs[i]);
            
            if (!self.messageFlag()) {
              notifications.notify([
                {
                  style: 'inline',
                  status: 'error',
                  id: '#CC-messages',
                  close: self.message().dismissable(),
                  fade: false,
                  message: self.message().text()
                }
              ]);
              
              $(".cc-notification-message").addClass("container");
              self.messageFlag(true);
              self.scrollIfNeccessary(self.message(),'#CC-messages');
            }
            
            return;
          }
        }
        
        for(var i=0;i<self.warnMsgs.length;i++) {
          if(self.warnMsgs[i].pageId == self.pageId) {
            self.message(self.warnMsgs[i]);
            
            if (!self.messageFlag()) {
              notifications.notify([
                {
                  style: 'inline',
                  status: 'warning',
                  id: '#CC-messages',
                  close: self.message().dismissable(),
                  fade: false,
                  message: self.message().text()
                }
              ]);
              
              $(".cc-notification-message").addClass("container");
              self.messageFlag(true);
              self.scrollIfNeccessary(self.message(),'#CC-messages');
            }
            
            return;
          }
        }
        
        for(var i=0;i<self.successMsgs.length;i++) {
          if(self.successMsgs[i].pageId == self.pageId) {
            self.message(self.successMsgs[i]);
            
            if (!self.messageFlag()) {
              notifications.notify([
                {
                  style: 'inline',
                  status: 'success',
                  id: '#CC-messages',
                  close: self.message().dismissable(),
                  fade: false,
                  message: self.message().text()
                }
              ]);
              
              $(".cc-notification-message").addClass("container");
              self.messageFlag(true);
              self.scrollIfNeccessary(self.message(),'#CC-messages');
            }
            
            return;
          }
        }
        
        for(var i=0;i<self.infoMsgs.length;i++) {
          if(self.infoMsgs[i].pageId == self.pageId) {
            self.message(self.infoMsgs[i]);
            
            if (!self.messageFlag()) {
              notifications.notify([
                {
                  style: 'inline',
                  status: 'info',
                  id: '#CC-messages',
                  close: self.message().dismissable(),
                  fade: false,
                  message: self.message().text()
                }
              ]);
              
              $(".cc-notification-message").addClass("container");
              self.messageFlag(true);
              self.scrollIfNeccessary(self.message(),'#CC-messages');
            }
            
            return;
          }
        }
        
        self.messageFlag(false);
        notifications.emptyNotifications('#CC-messages');
        self.message(null);
      };
      
      /**
       * Add message to specified list.
       * Used when new message notification received.
       * @function MessageHandler.addMessage
       * @param {MessageModel} message The message to be added.
       * @param {MessageModel[]} messageList The list of messages to add the new message to.
       */
      self.addMessage = function(message, messageList) {
        var messageId = message.id();
        
        //delete the current displayed message
        if (self.messageFlag() && self.message() != null) {
          // Don't add a message with a duplicate id
          if(self.message().id() == messageId && self.message().text() == message.text()) {
            return;
          }
          notifications.emptyNotifications('#CC-messages');
          $.Topic(pubsub.topicNames.NOTIFICATION_DELETE).publishWith(
              self.message(),[{message:"success"}]);
        }        
        
        for(var i=0;i<messageList.length;i++) {
          if(messageList[i].id() == messageId) {
            // duplicate
            messageList[i].text(message.text());
          }
        }
        // store the page context
        message.pageId = self.pageId;
        // add the message
        messageList.push(message);
        self.messageFlag(false);
        self.updateMessages();
        $('.close.cc-notification-close').on('click', function() {
          self.removeCurrentMessage(message);  
        });
      };
      
      /**
       * Clear the current notification message.
       * @function MessageHandler.removeCurrentMessage
       * @param {MessageModel} message The message to be removed.
       */
      self.removeCurrentMessage = function(message) {
        if(self.messageFlag() && self.message() != null && self.message().id() == message.id()) {
          $.Topic(pubsub.topicNames.NOTIFICATION_DELETE).publishWith(
              message,[{message:"success"}]);
          self.messageFlag(false);
          notifications.emptyNotifications('#CC-messages');
          self.message(null);
        }
      };
      
      /**
       * Remove message from specified list.
       * Used when clear message notification received.
       * @function MessageHandler.removeMessage
       * @param {MessageModel} message The message to be removed.
       * @param {MessageModel} messageList The list to remove the message from.
       */
      self.removeMessage = function(message, messageList) {
        var messageId = message.id();
        
        for(var i=0;i<messageList.length;i++) {
          if(messageList[i].id() == messageId) {
            messageList.splice(i,1);
            //remove the message from the notification div if this message is same as the current displayed message.
            self.removeCurrentMessage(message);
            break;
          }
        }
        
        self.updateMessages();
      };
      
      
      /**
       * Remove all messages.
       * @function MessageHandler.removeAllMessages
       */
      self.removeAllMessages = function() {
        self.errorMsgs    = [];
        self.warnMsgs     = [];
        self.successMsgs  = [];
        self.infoMsgs     = [];
        
        self.updateMessages();
      }; 
      
      /**
       * New Message Notification Received.
       * @function MessageHandler.addMessageHandler
       * @param {Object} args The arguments passed as part of the notification.
       */ 
      self.addMessageHandler = function(args) {
        var message = this;
        var messageType = message.type();
                
        switch(messageType) {
          
          case notifier.types.ERROR:
            self.addMessage(message,self.errorMsgs);
            break;
                                
          case notifier.types.WARNING:
            self.addMessage(message,self.warnMsgs);
            break;
                                
          case notifier.types.SUCCESS:
            self.addMessage(message,self.successMsgs);
            break;
                                
          case notifier.types.INFO:
            self.addMessage(message,self.infoMsgs);
            break;
                                
          default:
            break;
        }
      };
      
      
      /**
       * Delete Message Notification Received.
       * @function MessageHandler.deleteMessageHandler
       * @param {Object} args The arguments passed as part of the notification.
       */ 
      self.deleteMessageHandler = function(args) {
        var message = this;
        var messageType = message.type();
        
        switch(messageType) {
          
          case notifier.types.ERROR:
            self.removeMessage(message,self.errorMsgs);
            break;
                                
          case notifier.types.WARNING:  
            self.removeMessage(message,self.warnMsgs);
            break;
                                
          case notifier.types.SUCCESS:  
            self.removeMessage(message,self.successMsgs);
            break;
                                
          case notifier.types.INFO:  
            self.removeMessage(message,self.infoMsgs);
            break;
                                
          default:
            break;
          
        }
      };
      
      
      /**
       * Page View Changed Event Handler.
       * @function MessageHandler.pageContextHandler
       * @param {Object} pageInfo The page data passed as part of the notification.
       */ 
      self.pageContextHandler = function(pageInfo) {
        var pageId = '';
        
        if(pageInfo && pageInfo.pageId) {
          pageId = pageInfo.pageId;
          
          if(pageInfo.contextId) {
            pageId += '-'+pageInfo.contextId;
          }
          
          self.pageId = pageId;
          self.removeAllMessages();
        }
        
      };
      
      // Manage subscriptions so that we don't have multiple subscriptions to the same event
      if(mAddMsgListener != undefined) {
        $.Topic(pubsub.topicNames.NOTIFICATION_ADD).unsubscribe(mAddMsgListener);    
      }
      
      mAddMsgListener = self.addMessageHandler;
      
      if(mDelMsgListener != undefined) {
        $.Topic(pubsub.topicNames.NOTIFICATION_DELETE).unsubscribe(mDelMsgListener);  
      }
      
      mDelMsgListener = self.deleteMessageHandler;
      
      if(mPageContextListener != undefined) {
        $.Topic(pubsub.topicNames.PAGE_VIEW_CHANGED).unsubscribe(mPageContextListener);  
      }
      
      mPageContextListener = self.pageContextHandler;
      
      if(mUserLogoutListener != undefined) {
        $.Topic(pubsub.topicNames.PAGE_VIEW_CHANGED).unsubscribe(mUserLogoutListener);  
      }
      
      mUserLogoutListener = self.removeAllMessages;
      
      // Subscribe to messages
      $.Topic(pubsub.topicNames.NOTIFICATION_ADD).subscribe(mAddMsgListener);
      $.Topic(pubsub.topicNames.NOTIFICATION_DELETE).subscribe(mDelMsgListener);
      $.Topic(pubsub.topicNames.PAGE_VIEW_CHANGED).subscribe(mPageContextListener);
      $.Topic(pubsub.topicNames.USER_LOGOUT_SUCCESSFUL).subscribe(mUserLogoutListener);
      
      self.messageFlag(false);
       
      return self;
    }
    
    /**
     * Returns a single global instance of MessageHandler.
     * @function MessageHandler.getInstance
     * @returns {MessageHandler} The global instance.
     */
    MessageHandler.getInstance = function() {
      if(!MessageHandler.singleInstance) {
        MessageHandler.singleInstance = new MessageHandler();
        notifications.emptyNotifications('#CC-messages');
      }
           
      return MessageHandler.singleInstance;
    };
    
  return MessageHandler;
});

