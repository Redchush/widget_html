/*global $, infuser, setTimeout: false */
define('notifications',
  ['jquery',
   'knockout',
   'ccConstants',
   'CCi18n'
  ],

  function(
    $,
    ko,
    CCConstants,
    CCi18n) {

  "use strict";

  /**
   * Custom jQuery function to set the focus of an element.
   * Uses the focus() method if the element is visible, otherwise it
   * triggers the focus handler on the element.
   */
  $.fn.notificationsSetFocus = function() {
    if(this.is(':visible')) {
      this.focus();
    }
    else {
      this.triggerHandler('focus');
    }
    if(this.data && this.data()['select2']) {
      this.select2('open');
    }
  };

  /**
   * Creates a Notification.
   * The notification provides a method for inserting notification
   * into the page. Can be called from any function with
   * notifications.notify() and passing in an array of options
   *
   * @private
   * @static
   * @class
   * @name Notifications
   */
  function Notifications() {
    var self = this;
    var notifyCounter = 0;
    var notifyTopPosition = 65;
    var notifyGrowls;
    var notifyContainerOuter;

    self.enabled = true;

    // private constants
    self.CLOSE_BUTTON_HTML = '<a href="#" class="close cc-notification-close pull-right" data-dismiss="alert"><i class="fa fa-times-circle"></i><span class="cc-reader-text">Close notification</span></a>';

    /**
     * Function called from elsewhere to trigger the notification.
     *
     * @function
     * @name Notifications#notify
     * @param {Object[]} notifyData A list of objects containing settings for notification messages.
     * @param {string} notifyData.style Either 'growl', or 'inline', Determines whether the message appears
     *   as a floating popup, or inline on the page.
     * @param {string} notifyData.id Use with inline notifications to specify which HTML Element will contain the
     *   notification message.
     * @param {string} notifyData.status One of {'info', 'success', 'error', 'danger'} Specifies the intent of the
     *   notification message and adds appropriate style to the message.
     * @param {boolean} notifyData.close Whether to add a manual close button to the notification popup.
     * @param {(number|boolean)} notifyData.fade=500 Whether the notification popup will automatically fade out, and if a number,
     *   how long the delay should be. A value of false means the popup will not fade. Default delay is 500ms.
     * @param {string} notifyData.header Title of notification popup.
     * @param {string} notifyData.message Message to display in the body of the notification popup.
     * @param {Object[]} notifyData.formErrors Pass in the list of errors returned from {@link FormHelper|formHelper}, if available.
     * @param {string} notifyData.code Error Code identifier, if available.
     * @param {Object[]} notifyData.actionOptions Array of Objects which specify actions the user can take from
     *   the notification popup in the form of buttons. The first specified action will automatically gain
     *   focus when the popup is displayed.
     * @param {string} notifyData.actionOptions.text Text display on button.
     * @param {string} notifyData.actionOptions.readerText Optional text to be used for screen readers. By default
     *   'text' will be used.
     * @param {function()} notifyData.actionOptions.action Function/script to be executed on click.
     * @param {string} notifyData.actionOptions.classes Classes to be attached to button.
     * @param {string} notifyData.actionOptions.onCloseFocus JQuery selector for element to gain focus on click.
     * @param {number} notifyData.actionsOptionsFocus Index of action element that should gain focus (overrides
     *   default).
     *
     * @example
     * notifications.notify([
     * {
     *   style: 'inline',
     *   status: 'info',
     *   id: '#myInput',
     *   close: true,
     *   fade: false,
     *   message: self.message().text()
     * }
     * ]);
     *
     * @example
     * notifications.notify([
     * {
     *   style: 'growl',
     *   status: 'confirm',
     *   close: false,
     *   fade: false,
     *   header: "Delete",
     *   message: "Are you sure you want to delete this thing?"
     *   actionOptionsFocus: 1,
     *   actionOptions = [{
     *     actionOption1: [{
     *       text: "Delete",
     *       action: '$(this).closest(\'.cc-notification-growl\').remove();$(\'#deleteButton\').trigger(\'click\');',
     *       classes: 'btn primary',
     *       onCloseFocus: '#myInput'
     *     }],
     *     actionOption2: [{
     *       text: "Cancel",
     *       action: '$(this).closest(\'.cc-notification-growl\').remove();',
     *       classes: 'btn',
     *       onCloseFocus: '#myInput'
     *     }]
     *   }]
     * }]);
     */
    self.notify = function(notifyData, force) {
      if(self.enabled || force) {
        if (Array.isArray(notifyData)) {
          $.each(notifyData, function(ii, item) {
            if(item.style !== null) {
              self.notifyBuild(item);
            } else {
              throw "Notification type unknown";
            }
          });
        } else {
          if(notifyData.style !== null) {
              self.notifyBuild(notifyData);
          } else {
            throw "Notification type unknown";
          }
        }
      }
    };

    /**
     * Call notify with settings for a growl success message.
     * {style: 'growl', status: 'success', close: true, fade: true}
     * @function
     * @name Notifications#growlSuccess
     */
    self.growlSuccess = function(notifyData, force) {
      if (Array.isArray(notifyData)) {
        $.each(notifyData, function(i, data) {
          data.style = 'growl';
          data.status = 'success';
          data.close = true;
          data.fade = true;
          data.header = notifyData.header || CCi18n.t("ns.common:resources.successText");
        });
      } else {
        notifyData.style = 'growl';
        notifyData.status = 'success';
        notifyData.close = true;
        notifyData.fade = true;
        notifyData.header = notifyData.header ||  CCi18n.t("ns.common:resources.successText");
      }
      self.notify(notifyData, force);
    }

    /**
     * Call notify with settings for a growl error message.
     * {style: 'growl', status: 'error', close: true, fade: true}
     * @function
     * @name Notifications#growlError
     */
    self.growlError = function(notifyData, force) {
      if (Array.isArray(notifyData)) {
        $.each(notifyData, function(i, data) {
          data.style = 'growl';
          data.status = 'error';
          data.close = true;
          data.fade = true;
          data.header = notifyData.header || CCi18n.t("ns.common:resources.errorText");
        });
      } else {
        notifyData.style = 'growl';
        notifyData.status = 'error';
        notifyData.close = true;
        notifyData.fade = true;
        notifyData.header = notifyData.header ||  CCi18n.t("ns.common:resources.errorText");
      }
      self.notify(notifyData, force);
    }


    /**
     * Call notify with settings for a growl error message.
     * Parse out the error message and code from the result if there is one
     * {style: 'growl', status: 'error', close: true, fade: true}
     * @function
     * @name Notifications#growlRestError
     */
    self.growlRestError = function(result, notifyData, force) {
      var errorMessage;
      var errorCode;
      var individualErrorCode;
      if (result.errors && result.errors.length > 0) {
        if (result.errors[0].message) {
          notifyData.message = result.errors[0].message;
        }
        if(result.errors[0].errorCode){
          individualErrorCode = result.errors[0].errorCode;
        }
      }
      notifyData.code = result.errorCode || individualErrorCode || " ";
      self.growlError(notifyData, force);
    }

    /**
     * Call notify with settings for an inline error message.
     * {style: 'inlinel', status: 'error', close: false, fade: false}
     * @function
     * @name Notifications#inlineError
     */
    self.inlineError = function(notifyData, force) {
      if (Array.isArray(notifyData)) {
        $.each(notifyData, function(i, data) {
          data.style = 'inline';
          data.status = 'error';
          data.close = false;
          data.fade = false;
        });
      } else {
        notifyData.style = 'inline';
        notifyData.status = 'error';
        notifyData.close = false;
        notifyData.fade = false;
      }
      self.notify(notifyData, force);
    }

    /**
     * Call notify with settings an inline confirm message
     * {style: 'inline', status: 'confirm', curtain: true, close: false, fade: false}
     * @function
     * @name Notifications#inlineConfirm
     */
    self.inlineConfirm = function(notifyData, force) {
      if (Array.isArray(notifyData)) {
        $.each(notifyData, function(i, data) {
          data.style = 'inline';
          data.status = 'confirm';
          data.curtain = true;
          data.close = false;
          data.fade = false;
        });
      } else {
        notifyData.style = 'inline';
        notifyData.status = 'confirm';
        notifyData.curtain = true;
        notifyData.close = false;
        notifyData.fade = false;
      }
      self.notify(notifyData, force);
    }

    /**
     * Call notify with settings for a growl info message.
     * {style: 'growl', status: 'info', close: true, fade: true}
     * @function
     * @name Notifications#growlInfo
     */
    self.growlInfo = function(notifyData, force) {
      if (Array.isArray(notifyData)) {
        $.each(notifyData, function(i, data) {
          data.style = 'growl';
          data.status = 'info';
          data.close = true;
          data.fade = true;
          data.header = this.header || CCi18n.t("ns.common:resources.warningText");
        });
      } else {
        notifyData.style = 'growl';
        notifyData.status = 'info';
        notifyData.close = true;
        notifyData.fade = true;
        notifyData.header = this.header ||  CCi18n.t("ns.common:resources.warningText");
      }
      self.notify(notifyData, force);
    }

    /**
     * Call notify with settings for a inline confirm message with two buttons: ok and cancel
     * {style: 'inline', status: 'confirm', curtain: true, close: false, fade: false}
     * @function
     * @name Notifications#okCancel
     */
    self.okCancel = function(notifyData, force) {
      notifyData.style = 'inline';
      notifyData.status = 'confirm';
      notifyData.curtain = true;

      // If notifyData.close is specified, use it, otherwise set it to false by default.
      if (notifyData.close) {
        // Set initial focus to the ok button
        notifyData.actionOptionsFocus = 1;
      }
      else {
        notifyData.close = false;
      }

      notifyData.fade = false;
      notifyData.actionOptions = [{
        actionOption1: [{
          text: notifyData.okButtonText || CCi18n.t("ns.common:resources.okText"),
          classes: this.PRIMARY_BUTTON_CLASS,
          callback: notifyData.okCallback,
        }],
        actionOption2: [{
          text: notifyData.cancelButtonText || CCi18n.t("ns.common:resources.cancelText"),
          classes: this.BUTTON_CLASS,
          callback: notifyData.cancelCallback
        }]
      }];
      self.notify(notifyData, force);
    }


    /**
     * Call notify with settings for a inline confirm message with one button, continue
     * {style: 'inline', status: 'confirm', curtain: true, close: false, fade: false}
     * @function
     * @name Notifications#okCancel
     */
    self.continueConfirm = function(notifyData, force) {
      notifyData.style = 'inline';
      notifyData.status = 'confirm';
      notifyData.curtain = true;
      notifyData.close = false;
      notifyData.fade = false;
      notifyData.actionOptions = [{
        actionOption1: [{
          text: CCi18n.t('ns.common:resources.continueText'),
          action: '',
          classes: 'btn cc-btn-primary'
        }]
      }];
      self.notify(notifyData, force);
    }

    /**
     * Call okCancel with two buttons: save and discard (optionally you can specify the button
     * text for 'save', e.g. have it say 'create' instead). The callback parameters can be 
     * okCallback and cancelCallback or saveCallback and discardCallback (for readability)
     * {style: 'inline', status: 'confirm', curtain: true, close: false, fade: false}
     * @function
     * @name Notifications#okCancel
     */
    self.unsavedChangesConfirm = function(notifyData, force) {
      notifyData.header = CCi18n.t("ns.common:resources.unsavedChangesHeaderText");
      notifyData.message = CCi18n.t("ns.common:resources.unsavedChangesMsgText"),
      notifyData.okButtonText = notifyData.okButtonText || CCi18n.t("ns.common:resources.saveChangesText"),
      notifyData.cancelButtonText = CCi18n.t("ns.common:resources.discardChangesText"),
      notifyData.okCallback = notifyData.okCallback || notifyData.saveCallback;
      notifyData.cancelCallback = notifyData.cancelCallback || notifyData.discardCallback;
      self.okCancel(notifyData, force);
    }

    /**
     * Clear any notifications that are displayed under the given element.
     *
     * @function
     * @name Notifications#clearNotifications
     * @param {HTMLElement} element HTML Element to clear notifications on.
     */
    self.clearNotifications = function(element) {
      if($(element).find('.cc-notification').length !== 0) {
        $(element).find('.cc-notification').remove();
      }
    };

    /**
     * Empty all child nodes of the given element selector.
     *
     * @function
     * @name Notifications#emptyNotifications
     */
    self.emptyNotifications = function(elementSelector) {
      $(elementSelector).empty();
    };

    /**
     * Clears all visible growl messages.
     *
     * @function
     * @name Notifications#emptyGrowlMessages
     */
    self.emptyGrowlMessages = function() {
      $('.cc-notification-growl').remove();
    };

    /**
     * Generate a unique ID for each notification.
     *
     * @function
     * @name Notifications#notifyID
     * @params {string} style Additional string inserted into ID.
     */
    self.notifyID = function(style) {
      // (Temporarily just returns the same ID. Might not be necessary at all.)
      var baseID = 'cc-notification-' + style + '-';
      return baseID + notifyCounter;
    };

    /**
     * Build out the notification html with options from the array.
     *
     * @private
     * @function
     * @name Notifications#notifyBuild
     * @param {Object[]} notifyData See {@link Notifications#notify|notify()} for param details.
     */
    self.notifyBuild = function(notifyData) {
      var notifyContainer, notifyActions;
      var notificationID;
      var notificationClasses = 'alert cc-notification ';
      var formElementID = '';
      var closeCurtain = '';
      var removeNotification = '';
      var onCloseFocus = '';
      var totalTabbableCount = 0;
      var ariaMessage = '';
      var totalTabbableElements = 0;
      var messageClass = '';
      var hasCallbacks = false;

      $('#cc-notification-aria-message').remove();

      //Assign the notification style (inline/growl)
      notificationClasses += 'cc-notification-' + notifyData.style + ' ';

      //Assign the notification status (info/error/danger/success/confirm)
      if(notifyData.status && notifyData.status !== '') {
        notificationClasses += 'alert-' + notifyData.status;
      }

      // Assign custom id to notification
      if(notifyData.customNotificationID && notifyData.customNotificationID !== '') {
        notificationID = notifyData.customNotificationID;
      }
      else {
        notificationID = self.notifyID(notifyData.style);
      }

      // Build the html to insert into the DOM
      notifyContainer = $('<div />')
        .attr({
          id: notificationID,
          'class': notificationClasses
        });

      // If there is a close button (close: true), add it
      if(notifyData.close) {
        // * data-dismiss can't be added via .attr(), so we build the close button old school
        $(notifyContainer).append(self.CLOSE_BUTTON_HTML);
      }

      // append our header text
      if(notifyData.header) {
        $(notifyContainer)
          .append($('<div />')
            .attr({
              'class': 'cc-notification-header'
            })
            .html($('<div />').text(notifyData.header).html())
        );
        ariaMessage += notifyData.header + ' ';
      }

      // append our message
      if(notifyData.message) {
        messageClass = 'cc-notification-message' + (notifyData.header ? '' : ' cc-notification-message-only');
        if(typeof notifyData.message !== 'string') {
          // handle a message array
          $.each(notifyData.message, function(ii, msg) {
            $(notifyContainer)
              .append($('<div />')
                .attr('class', messageClass)
                .html($('<div />').text(msg).html())
            );
            ariaMessage += msg;
          });
        } else {
          // handle a message string
          $(notifyContainer)
            .append($('<div />')
              .attr('class', messageClass)
              .html($('<div />').text(notifyData.message).html())
          );
          ariaMessage += notifyData.message;
        }

        // Check to see if this is an error notification
        if (notifyData.status === 'error') {
          // This is an error notifiction alert screen reader users of the error
          $('#cc-aria-announce').attr('role', 'alert');
        }
        else {
          // This is not an error notifcation so use standard screen reader role
          $('#cc-aria-announce').attr('role', 'region');
        }


      }

      // append the template, if any
      if (notifyData.template) {
        var templateParts = self.parseTemplateUrl(notifyData.template);
        var templateElement = $('<div/>')
            .attr('data-bind', 'template: {name: "' + templateParts.name + '", templateUrl: "' + templateParts.url + '"}');

        $(notifyContainer).append(templateElement);
        ko.applyBindings(notifyData.templateData, templateElement.get(0));
      }

      // Are there actions associated with this notifications. (actionOptions: [{}])
      // If so, build them out.
      if(notifyData.actionOptions) {

        // notifyData uses callback functions rather than action strings
        hasCallbacks = self.hasCallbacks(notifyData.actionOptions[0]);

        notifyActions = $('<div />').attr('class', 'cc-notification-actions');

        if(notifyData.style === 'inline' && notifyData.curtain === true) {
          $(notifyContainer).addClass('cc-notification-with-curtain');
          closeCurtain = '$(\'.cc-curtain\').remove();';
          removeNotification = '$(this).closest(\'.cc-notification-inline\').remove();$(\'body\').removeClass(\'no-scroll\');';
          removeNotification += 'if($(\'.cc-notification-outer\').length > 0) {$(\'.cc-notification-outer\').remove();}';
          if(notifyData.modal === true) {
            $(notifyData.id).parent('.modal').on('hidden', function() {
              $('.cc-curtain').remove();
            });
          }
        }

        // Iterate over the button definitions setting the (A) classes,
        // (B) onClick action, (C) readerText (optional), and
        // (C) the button Text.
        $.each(notifyData.actionOptions[0], function(ii, actionOption) {
          onCloseFocus = '';

          // if a post action focus target has been passed in, set the script up
          if(actionOption[0].onCloseFocus) {
            onCloseFocus = '$(\'' + actionOption[0].onCloseFocus + '\').notificationsSetFocus();';
          }

          // determine if custom readerText should be used
          // appends blank reader text if none is passed in;
          // not sure if this is a potential problem
          var readerText = "";
          if (actionOption[0].readerText) {
            readerText = actionOption[0].readerText;
          }

          // build the button
          if (hasCallbacks) {
            // if using callbacks, don't attach action string
            $(notifyActions).append($('<button />')
                .attr({
                  id: 'cc-notification-actionbutton-' + ii,
                  'class': 'cc-notification-actionbutton-class ' + actionOption[0].classes,
                })
                .attr('data-bind', 'makeAccess: {readerText: ' + readerText + '}')
                .text(actionOption[0].text)
              );
          }  else {
              $(notifyActions).append($('<button />')
              .attr({
                'class': actionOption[0].classes,
                 onClick: removeNotification + closeCurtain + onCloseFocus + actionOption[0].action
              })
              .attr('data-bind', 'makeAccess: {readerText: ' + readerText + '}')
              .text(actionOption[0].text)
            );
           }
        });

        // Append our actions to the notification
        $(notifyContainer).append(notifyActions);
      }

      // Handle the errors() returned from form-helper
      if(notifyData.formErrors) {
        var formElementIdTab, formElementIdTabHref;
        var formErrorItems = $('<div />').attr('class', 'cc-notification-errorFields').append($('<ul />'));

        // For each error generate an LI with a link that will focus on that particular item
        $.each(notifyData.formErrors, function(ii, formError){
          formElementID = '$(\'#' + formError.formId + '\').notificationsSetFocus()';

          if (notifyData.focusFunction) {
            formErrorItems.append(
              $('<li />').append(
                $('<a />').attr({href: 'javascript:void(0);'}).text(formError.label).on('click', function() {
                  notifyData.focusFunction(formError.formId); } )));
          }
          else if($('#' + formError.formId).parents('.tab-pane').length === 1) {
            formElementIdTabHref = $('#' + formError.formId).parents('.tab-pane');

            // determine if we're in a modal or not, and find the proper tab id.
            if($('#' + formElementIdTabHref[0].id).closest('.modal').length === 1) {
              formElementIdTab = $('#' + formElementIdTabHref[0].id).closest('.modal').find('.cc-nav-tabs a[href=\'#'+ formElementIdTabHref[0].id + '\']').parent();
            } else {
              formElementIdTab = $('#tab-' + formElementIdTabHref[0].id);
              if (formElementIdTab.length === 0) {
                formElementIdTab = $('#' + formElementIdTabHref[0].id).closest('.panel').find('.cc-nav-tabs a[href=\'#'+ formElementIdTabHref[0].id + '\']').parent();
              }
            }

            formErrorItems.append(
              $('<li />').append(
                $('<a />').attr({
                  href: 'javascript:void(0);',
                  onClick: '$(\'#' + formElementIdTab[0].id + ' a\').tab(\'show\');$(\'#' + formError.formId + '\').notificationsSetFocus()'
                })
                .text(formError.label)
              )
            );
          } else {
            formErrorItems.append(
              $('<li />').append(
                $('<a />').attr({href: 'javascript:void(0);', onClick: '$(\'#' + formError.formId + '\').notificationsSetFocus()'})
                .text(formError.label)
              )
            );
          }
          ariaMessage += " " + formError.label;
        });

        $(notifyContainer).append(formErrorItems);
      }

      $('body').prepend(
        $('<div />').attr({
          id: 'cc-notification-aria-message',
          class: 'cc-reader-text',
          role: 'alert',
          'aria-relevant': 'additions removals',
          'aria-live': 'assertive'
        }).text(ariaMessage)
      );

      if(notifyData.code) {
        var returnCodeLabel = CCi18n.t('ns.common:resources.returnCodeLabel');
        $(notifyContainer).append($('<div />').attr({
                  'class':'cc-notification-errorCode'
                }).text(returnCodeLabel + ': ' + notifyData.code));
      }

      // Insert the alert into the DOM
      if(notifyData.style == 'inline') {
        if(notifyData.curtain === true) {
          $(notifyContainer).addClass('cc-inline-curtain');
          notifyContainerOuter = $('<div />').attr({
            'class' : 'cc-notification-outer'
          });

          $(notifyData.id).prepend($(notifyContainerOuter).append($(notifyContainer)));
        }
        // if its an ojTab, put notification window on each tab pane
        else if ($(notifyData.id).hasClass("oj-tabs")) {
          $(notifyData.id).children("div").each(function() {
            $(this).prepend($(notifyContainer).clone(true));
          });
        } else {
          $(notifyData.id).prepend($(notifyContainer));
        }

      } else if(notifyData.style == 'growl') {

        $('body').append($(notifyContainer));

        // Assign the top position for notifications
        self.notifyTop();

        // Adjust height when a growl notification is removed, and focus on
        // the first product link.
        $(notifyContainer).bind('closed', function() {
          var delayUpdate = setTimeout(function() {
            self.notifyTop();
          }, 100);
          self.notifyFocus();
        });
      }

      $('.cc-notification-close').on('click', function() {
        var notificationOuter = $('.cc-notification-outer');

        if($('body').hasClass('no-scroll')){
          $('body').removeClass('no-scroll');
        }

        if($('.cc-curtain')) {
          $('.cc-curtain').remove();
        }

        if(notificationOuter) {
          var parent = notificationOuter.parent();
          $('.cc-notification-outer').remove();
          // Keep focus to first element of parent modal.
          $(parent).find(':tabbable').first().focus();
        }

        if(notifyData.closeHandler) {
          notifyData.closeHandler();
        }

        //self.cleanUp();  TODO: clean up after clicking close
      });

      // Attach callbacks here.
      if (hasCallbacks) {
        $.each(notifyData.actionOptions[0], function(index, actionOption) {
          var $actionButton = $('#cc-notification-actionbutton-' + index);
          if ($actionButton) {
             $actionButton.on('click', function() {
                if(notifyData.style === 'inline' && notifyData.curtain === true) {
                     $(this).closest('.cc-notification-inline').remove();
                     $(this).closest('.cc-notification-growl').remove();
                     $('body').removeClass('no-scroll');
                     if ($('.cc-notification-outer').length > 0) {
                         $('.cc-notification-outer').remove();
                     }
                     $('.cc-curtain').remove();
                 }
                 if (actionOption[0].onCloseFocus) {
                     $(actionOption[0].onCloseFocus).notificationsSetFocus();
                 }
                 if (actionOption[0].callback) {
                     actionOption[0].callback();
                 }
                 self.cleanUp();
            });
          }
        });
      }

      // If fade isn't false, it's either true or a number, so figure that out
      if(notifyData.fade !== false) {
        var notificationFade = CCConstants.NOTIFICATION_FADE_DEFAULT;
        if(notifyData.fade !== true) {
          notificationFade = notifyData.fade;
        }

        var notificationDelay = CCConstants.NOTIFICATION_DELAY_DEFAULT;

        // Check to see if delay is set
        if (notifyData.delay) {
          // Delay is set so update the notification delay accordingly
          notificationDelay = notifyData.delay;
        }

        // Setup to fade notification after a specific delay
        $(notifyContainer)
          .delay(notificationDelay)
          .fadeOut(notificationFade, self.doFade);

        // Setup to stop fade notification on mouseover
        $(notifyContainer)
          .mouseenter(function() {
            $(this).stop(true,true);
          });

        // Setup to restart fade on mouseleave
        $(notifyContainer)
          .mouseleave(function() {
            $(this).fadeOut(notificationFade, self.doFade);
          });
      }

      if(notifyData.curtain === true) {
        if(notifyData.style === 'inline') {
          if($(notifyData.id).parents('.modal-content').length !== 0) {
            $(notifyData.id).parents('.modal-content').append($('<div />').attr('class', 'cc-curtain fade in'));
          } else {
            $(notifyData.id).append($('<div />').attr('class', 'cc-curtain fade in').attr('style', 'z-index:1042'));
            // scroll to the notification and put the no-scroll class on a delay of
            // 0 to allow the scroll event to complete.
            window.scrollTo(0, $(notifyData.id).offset().top);
            window.setTimeout(function(){
              $('body').addClass('no-scroll');
            }, 0);
          }
        } else {
          $('body').append($('<div />').attr('class', 'modal-backdrop fade in'));
        }

        // accessibility tabbing logic
        totalTabbableElements = $(".cc-notification-with-curtain :tabbable");
        totalTabbableCount = totalTabbableElements.size();

        totalTabbableElements.each(function (index) {
          $(this).on('keydown', function(event) {
            if(event.keyCode === 9) {
              var currentIndex;
              if(event.shiftKey) {
                currentIndex = parseInt(totalTabbableElements.index($(this)), 10) - 1;
                if(currentIndex < 0) {
                  event.preventDefault();
                  totalTabbableElements[totalTabbableCount - 1].focus();
                }
              } else {
                currentIndex = parseInt(totalTabbableElements.index($(this)), 10) + 1;
                if(currentIndex === totalTabbableCount) {
                  event.preventDefault();
                  totalTabbableElements[0].focus();
                }
              }
            }
          });
        });

        // handle button focus on display. defaults to first button passed in
        if(notifyData.actionOptionsFocus) {
          $(totalTabbableElements[notifyData.actionOptionsFocus]).focus();
        } else {
          $(totalTabbableElements[0]).focus();
        }
      }
    };

    /**
     * Do the fade animation if notification has the fade option set.
     *
     * This is used when the notification fades 'naturally' or when the mouse
     * leaves focus of the notification.
     *
     * @private
     * @function
     * @name Notifications#doFade
     */
    self.doFade = function() {
      $(this).remove();
      $('#notification-info').text('');
      // delayed to make sure the notification is removed from the DOM
      // before we try to shift any other notifications around.
      var delayUpdate = setTimeout(function(){self.notifyTop();}, 100);
      self.notifyFocus();
    };

    /**
     * Assign the top value to each growl notification.
     *
     * @private
     * @function
     * @name Notifications#notifyTop
     */
    self.notifyTop = function() {
      notifyGrowls = $('body').children('.cc-notification-growl');
      if(notifyGrowls.length >= 0) {
        $.each(notifyGrowls, function(ii, growl){
          if(ii > 0) {
            notifyTopPosition = notifyTopPosition + 30;
          }
          $(growl).css('top', notifyTopPosition); // set css top
          notifyTopPosition = notifyTopPosition + $(growl).height();
        });
      }
      notifyTopPosition = 65;
    };

    /**
     * For accessibility, regain focus on something in the window.
     *
     * @private
     * @function
     * @name Notifications#notifyFocus
     */
    self.notifyFocus = function() {
      // TODO Arbitrarily picked the first navigation item, should this be an array option?
      $('#CC-Oracle-Nav UL.nav.nav-pills LI A:first').focus();
    };

    /**
     * Strip extensions from URL, trim leading slashes and split into URI + name
     *
     * @private
     * @function
     * @name Notifications#parseTemplateUrl
     * @param {string} url The URL to parse
     * @returns {Object} Object containing 'url', and 'name' components with URL parts.
     */
    self.parseTemplateUrl = function(url) {
      // strip any extension, unless there is no default template suffix
      if (infuser.defaults.templateSuffix !== '') {
        if (url.indexOf('.') >= 0) {
          url = url.substring(0, url.lastIndexOf('.'));
        }
      }
      // strip any leading slashes
      while (url.indexOf('/') === 0) {
        url = url.substring(1);
      }

      // split into uri / name
      return {
        url : url.substring(0, url.lastIndexOf("/")),
        name : url.substring(url.lastIndexOf("/") + 1)
      };
    };

    /**
     * Clean up after finished with notification.  Removes callbacks.
     *
     * @function
     * @name Notifications#cleanUp
     */
    self.cleanUp = function() {
       var $actionButtons = $('.cc-notification-actionbutton-class');
       if ($actionButtons) {
          $actionButtons.off('click');
       }
       var $closeButton = $('.cc-notification-close');
       if ($closeButton) {
          $closeButton.off('click');
       }
    };

   /**
     * Does the notify data pass in a callback function (rather than an action string)
     *
     * @private
     * @function
     * @name Notifications#hasCallbacks
     */
    self.hasCallbacks = function(actionOptions) {
       var hasCallback = false;
       $.each(actionOptions, function(jj, actionOption) {
           if (actionOption[0].callback) {
             hasCallback = true;
           }
       });
       return hasCallback;
    }

    //
    // If popping up a notification window over an ojDialog, use these methods to create an overlay
    //
    self.overlayId = "#cc-overlay-clone";
    self.createNotificationOverlay = function() {
      var dialogOverlay = $('div[id$="_layer_overlay"]');
      if (dialogOverlay) {
        var $overlayClone = dialogOverlay.clone();
        $overlayClone.attr("id", "cc-overlay-clone");
        $overlayClone.css("opacity", "1");
        $overlayClone.css("background", "none");
        $("#__oj_zorder_container").append($overlayClone);
      $overlayClone.zIndex($overlayClone.zIndex()+1);
      }
    };
    self.destroyNotificationOverlay = function() {
      var noteOverlay = $("#cc-overlay-clone");
      if (noteOverlay && noteOverlay.length > 0) {
        noteOverlay.remove();
      }
    }


  }

    /**
     * Global variables for users of Notification to set the button classes
     */
    Notifications.prototype.PRIMARY_BUTTON_CLASS = "btn cc-btn-primary pull-right";
    Notifications.prototype.DEFAULT_BUTTON_CLASS = "btn btn-default";
    Notifications.prototype.BUTTON_CLASS = "btn";

  return new Notifications();

});

