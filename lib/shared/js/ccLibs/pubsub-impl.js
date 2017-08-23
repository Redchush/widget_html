/**
 * @fileoverview Module returning a PubSubImpl constructor used for pub/sub implementations.
 */
/*global $ */
define(
  //-------------------------------------------------------------------
  // PACKAGE NAME
  //-------------------------------------------------------------------
  'pubsubImpl',

  //-------------------------------------------------------------------
  // DEPENDENCIES
  //-------------------------------------------------------------------
  ['jquery'],

  //-------------------------------------------------------------------
  // MODULE DEFINITION
  //-------------------------------------------------------------------
  function () {

    "use strict";

    /**
     * @class A pub-sub implementation based on jQuery.Callbacks. Maintains a list of "topics" used for
     * publish/subscribe messaging.
     * <p>
     * <b>Topics Overview:</b>
     * <p>
     * Topics are identified by id. Messages are published to topics and subscribers
     * to a given topic will receive the messages published to that topic.
     * The use of topics encourages loose coupling between javascript modules.
     * <p>
     * <b>Creating a new topic:</b>
     * <p>
     * To create a topic call the "topic" function passing in the id of your topic.
     * <p>
     * <b>Returning an existing topic:</b>
     * <p>
     * The topic function will return an existing topic by id if it already exists.
     * Otherwise it will create and return a new topic.
     * <p>
     * <b>Publishing to a Topic:</b>
     * <p>
     * Use the "publish" or "publishWith" function to publish to a topic.
     * The "publish" function takes one parameter, this is the object you wish to publish.
     * Example: <pre><code>pubsubImpl.topic("foo").publish("Something interesting happened.")</code></pre>
     * <p>
     * Often you will need to control the context (this) in which subscribers receive your message.
     * To control that context use "publishWith" rather than "publish".
     * The first parameter to "publishWith" is the object to be used as "this" in the receiver's
     * callback.
     * Example: <pre><code>pubsubImpl.topic("foo").publishWith(this,"Something interesting happened, and I supplied this.")</code></pre>
     * <p>
     * <b>Subscribing to a Topic:</b>
     * <p>
     * Use the "subscribe" function to subscribe your callback function to a topic. When a message
     * is posted to a given topic the callbacks for all subscribers will be invoked.
     * Note that the value for "this" in your callback may vary depedending on how the message
     * was published so save the current value of this if you need to guarantee it will remain constant.
     * Example: <pre><code>pubsubImpl.topic("foo").subscribe(function(message){ console.log("Incoming message: " + message); })</code></pre>
     * <p>
     * <b>Unsubscribing from a Topic:</b>
     * <p>
     * Use the "unsubscribe" function to remove your callback subscription to a given topic.
     * @private
     * @name PubSubImpl
     */
    function PubSubImpl() {
      /**
       * The list of topics.
       */
      this.topics = {};
    }

    /**
     * Return an existing topic by id. If there are
     * no existing topics matching id, a new topic will
     * be created and returned.
     * (Note: Topic ids with the suffix ".memory" will have memory enabled for the topic.)
     * <p>
     * A topic object contains the following functions.
     * <ul>
     *   <li><code>publish</code> - Publish the topic.</li>
     *   <li><code>publishWith</code> - Publish the topic with additional data.</li>
     *   <li><code>subscribe</code> - Subscribe to the topic.</li>
     *   <li><code>unsubscribe</code> - Unsubscribe from the topic.</li>
     * </ul>
     *
     * @function
     * @static
     * @name PubSubImpl.topic
     * @param {string} id Topic id, typically from the topicNames constants.
     * @returns {topic} The topic object.
     * @see https://api.jquery.com/jQuery.Callbacks/
     * @example
     * pubsubImpl.topic(pubsubImpl.topicNames.ORDER_COMPLETED).subscribe(function (obj) {
     * alert("Hurray! Your order was completed.");
     * });
     */
    PubSubImpl.prototype.topic = function (id) {
      var callbacks,
        method,
        topic = id && this.topics[id],
        callbackOptions = "unique";
      if (!topic) {
        if (/\.memory/.test(id)) {
          callbackOptions += " memory";
        }
        callbacks = $.Callbacks(callbackOptions);
        window.pubsubevents = callbacks;
        topic = {
          publish: callbacks.fire,
          publishWith: callbacks.fireWith,
          subscribe: callbacks.add,
          unsubscribe: callbacks.remove
        };
        if (id) {
          this.topics[id] = topic;
        }
      }
      return topic;
    };

    return PubSubImpl;
  }
);

