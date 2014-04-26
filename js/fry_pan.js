/* Copyright 2014 (c) SoFIE Studios.  All rights reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview  The FryPan class. The FryPan object implements all the behaviour of a
 * fry pan:
 *   The fry pan has a maximum capacity of {@code MAX_EGG_COUNT} eggs.
 *   A fry pan starts empty.
 *   As soon as an egg is added to the fry pan, it begins to cook. When the egg is fried,
 *     the {@code DID_FRY_EGG_NOTIFICATION} is posted.
 */

/**
 * Constructor for the FryPan.
 * @constructor
 */
FryPan = function() {
  GamePiece.call(this);
  /**
   * Number of eggs in the pan.
   * @type {number}
   * @private
   * @readonly
   */
  this._eggCount = 0;
  /**
   * The time in seconds that an egg takes to cook. If this value is 0, the egg
   * fries immediately. Can be set for testing.
   * @private
   * @readonly
   */
  this._fryInterval = FryPan.FRY_INTERVAL;
}
FryPan.prototype = new GamePiece();
FryPan.prototype.constructor = Nest;

/**
 * Default frying time, measured in seconds.
 * @type {number}
 */
FryPan.FRY_INTERVAL = 60.0;

/**
 * Maximum number of eggs that can go in the pan.
 * @type {number}
 */
FryPan.MAX_EGG_COUNT = 2;

/**
 * Notification sent when the egg is cooked.
 * @type {String}
 */
FryPan.DID_FRY_EGG_NOTIFICATION = 'eggDidFryNotification';

/**
 * Exposed for testing. Do Not use.
 * @param {number} fryInterval The time in seconds that an egg takes to cook.
 *     Setting this to 0 or a negative number means eggs fry instantly.
 */
FryPan.prototype.setFryInterval = function(fryInterval) {
  this._fryInterval = fryInterval;
}

/**
 * Exposed for testing. Do Not use.
 * @param {number} eggCount The new egg count.
 */
FryPan.prototype.setEggCount = function(eggCount) {
  this._eggCount = eggCount;
}

/**
 * Number of eggs in the pan.
 * @return {number} egg count.
 */
FryPan.prototype.eggCount = function() {
  return this._eggCount;
}

/**
 * Add an egg. If there is already an egg in the nest, does nothing.
 * @param {Function} opt_fryCallback An optional callback function to call when the
 *     egg has cooked. Used for testing. By default, the private _fryEgg() function is
 *     called.
 * @return {boolean} if adding the egg was successful.
 */
FryPan.prototype.addEgg = function(opt_fryCallback) {
  if (this.eggCount() == FryPan.MAX_EGG_COUNT) {
    return false;
  }
  var fryCB = opt_fryCallback || this._fryEgg;
  this._eggCount++;
  fryCB.bind(this)(this._fryInterval);
  return true;
}

/**
 * Incubate the egg. Starts a timer that runs for {@code fryInterval} seconds, then
 * fries the egg by posting the {@code DID_FRY_EGG_NOTIFICATION} notification.
 * @param {number} fryInterval The frying time of the egg measured in seconds.
 * @private
 */
FryPan.prototype._fryEgg = function(fryInterval) {
  var fryEgg = function() {
    if (this._eggCount == 0) {
      return;
    }
    this._eggCount--;
    NotificationDefaultCenter().postNotification(FryPan.DID_FRY_EGG_NOTIFICATION, this);
  };
  setTimeout(fryEgg.bind(this), fryInterval * 1000.0);
}
