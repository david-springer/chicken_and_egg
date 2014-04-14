/* Copyright 2014 (c) SoFIE Studios.  All rights reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview  A simple Pub/Sub system based on jQuery callbacks. Taken from the
 * jQuery gist here: http://api.jquery.com/jQuery.Callbacks/
 */

/**
 * The singleton that holds the mapping from notification names to jQuery callbacks
 * for that notification.
 * @private
 */
var _notifications = _notifications || {};
 
jQuery.Notifcations = function(id) {
  var callbacks;
  var notifcation = id && _notifications[id];
 
  if (!notifcation) {
    callbacks = jQuery.Callbacks("unique");
    notifcation = {
      post: callbacks.fire,
      addObserver: callbacks.add,
      removeObserver: callbacks.remove
    };
    if (id) {
      _notifications[id] = notifcation;
    }
  }
  return notifcation;
};
