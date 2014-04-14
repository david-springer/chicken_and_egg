/* Copyright 2014 (c) SoFIE Studios.  All rights reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview  A simple Pub/Sub system based on jQuery callbacks. Taken from the
 * jQuery gist here: http://api.jquery.com/jQuery.Callbacks/
 */

var notifications = {};
 
jQuery.Notifcations = function(id) {
  var callbacks;
  var method;
  var notifcation = id && notifications[id];
 
  if (!notifcation) {
    callbacks = jQuery.Callbacks();
    notifcation = {
      publish: callbacks.fire,
      subscribe: callbacks.add,
      unsubscribe: callbacks.remove
    };
    if (id) {
      notifications[id] = notifcation;
    }
  }
  return notifcation;
};
