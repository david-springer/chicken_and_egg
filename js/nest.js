/* Copyright 2014 (c) SoFIE Studios.  All rights reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview  The Nest class. The Nest object implements all the behaviour of a nest:
 *   The nest has a maximum capacity of 1 egg.
 *   A nest starts empty.
 *   You can only add an egg to an empty nest.
 *   As soon as an egg is added to the nest, it begins to hatch. When the egg hatches,
 *     the {@code DID_HATCH_EGG_NOTIFICATION} is posted.
 */

/**
 * Constructor for the Nest.
 * @constructor
 */
Nest = function() {
  /**
   * Number of eggs in the nest.
   * @type {number}
   * @private
   * @readonly
   */
  this._eggCount = 0;
  /**
   * The time in seconds that an egg takes to incubate. If this value is 0, the egg
   * incubates and hatches immediately. Can be set for testing.
   * @private
   * @readonly
   */
  this._incubateInterval = Nest.INCUBATE_INTERVAL;
}
Nest.prototype.constructor = Nest;

/**
 * Default incubation time, measured in seconds.
 * @type {number}
 */
Nest.INCUBATE_INTERVAL = 30.0;

/**
 * Notification sent when the egg hatches.
 * @type {String}
 */
Nest.DID_HATCH_EGG_NOTIFICATION = 'eggDidHatchNotification';

/**
 * Exposed for testing. Do Not use.
 * @param {number} incubateInterval The time in seconds that an egg takes to incubate.
 *     Setting this to 0 or a negative number means eggs incubate (and then hatch)
 *     instantly.
 */
Nest.prototype.setIncubateInterval = function(incubateInterval) {
  this._incubateInterval = incubateInterval;
}

/**
 * Whether there is an egg in the nest.
 * @return {boolean} egg exists.
 */
Nest.prototype.hasEgg = function() {
  return this._eggCount > 0;
}

/**
 * Add an egg. If there is already an egg in the nest, does nothing.
 * @param {Function} opt_incubateCallback An optional callback function to call when the
 *     egg has hatched. Used for testing. By default, the private _incubate() function
 *     is called.
 * @return {boolean} if adding the egg was successful.
 */
Nest.prototype.addEgg = function(opt_incubateCallback) {
  if (this.hasEgg()) {
    return false;
  }
  var incubateCB = opt_incubateCallback || this._incubate;
  this._eggCount = 1;
  incubateCB.bind(this)(this._incubateInterval);
  return true;
}

/**
 * Incubate the egg. Starts a timer that runs for {@code incubateInterval} seconds, then
 * hatches the egg by posting the {@code DID_HATCH_EGG_NOTIFICATION} notification.
 * @param {number} incubateInterval The incubation time of the egg measured in seconds.
 * @private
 */
Nest.prototype._incubate = function(incubateInterval) {
  var hatchEgg = function() {
    this._eggCount = 0;
    NotificationDefaultCenter().postNotification(Nest.DID_HATCH_EGG_NOTIFICATION, this);
  };
  setTimeout(hatchEgg.bind(this), incubateInterval * 1000.0);
}
