/* Copyright 2014 (c) SoFIE Studios.  All rights reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview  A simple Pub/Sub system based on jQuery callbacks. The API is loosely
 * modelled after the Apple NSNotificationCenter API (see http://goo.gl/9RCsfo).
 */

/**
 * Factory method to access the notification center. Returns a singleton.
 * @return The singleton NotificationCenter instance.
 */
NotificationDefaultCenter = function() {
  if (NotificationDefaultCenter.prototype._singletonInstance == null) {
    NotificationDefaultCenter.prototype._singletonInstance = new NotificationCenter();
  }
  return NotificationDefaultCenter.prototype._singletonInstance;
}

/**
 * The private constructor for NotificationCenter. Do not use this function, use the
 * above factory method instead.
 * @constructor.
 */
NotificationCenter = function() {
  /**
   * The notifications as a dictionary ("associative array"). Keys are the notification
   * names, values are the jQuery Callbacks objects holding the notification handlers.
   */
  this._notificationDict = {};
}
NotificationCenter.prototype.constructor = NotificationCenter;

/**
 * Return all the observers associated with a notification. If there are no observers,
 * returns null.
 * @param {String} notification The notification to query.
 * @return {Array.<Object>} The list of observers. Can be null.
 */
NotificationCenter.prototype.hasObserversForNotification = function(notification) {
  var callbacks = notification && this._notificationDict[notification];
  return callbacks ? callbacks.has() : false;
}

/**
 * Add an observer for a notification. If there are no observers registered yet, adds a
 * new entry in the dictionary.
 * @param {String} notification The notification to observe.
 * @param {Function} observer The function to call when posting the notification.
 */
NotificationCenter.prototype.addNotificationObserver = function(notification, observer) {
  var callbacks = notification && this._notificationDict[notification];
  if (!callbacks) {
    callbacks = jQuery.Callbacks("unique");
  }
  if (notification) {
    callbacks.add(observer);
    this._notificationDict[notification] = callbacks;
  }
}

/**
 * Remove an observer for a notification. Does nothing if there are no observers
 * registered yet. If all observers of a notification are removed, also removes the
 * notification entry from the internal dictionary.
 * @param {String} notification The notification to modify.
 * @param {Function} observer The function to call when posting the notification.
 */
NotificationCenter.prototype.removeNotificationObserver =
    function(notification, observer) {
  var callbacks = notification && this._notificationDict[notification];
  if (!callbacks) {
    return;
  }
  if (observer) {
    callbacks.remove(observer);
    // has() with no parameters returns the length of the list.
    if (!callbacks.has()) {
      delete this._notificationDict[notification];
    }
  } 
}

/**
 * Remove all the observers and all notifications from the notification center.
 */
NotificationCenter.prototype.removeAllNotifications = function() {
  this._notificationDict = {};
}

/**
 * Post the notification, which causes all the observing functions to be called. Calling
 * order is not guaranteed. Does nothing if no observers have been registered.
 * @param {String} notification The notification to post.
 */
NotificationCenter.prototype.postNotification = function(notification) {
  var callbacks = notification && this._notificationDict[notification];
  if (!callbacks) {
    return;
  }
  if (notification) {
    callbacks.fire();
  }
}
