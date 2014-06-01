/* Copyright 2014 (c) SoFIE Studios.  All rights reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview  The EggCarton class. The EggCarton object implements all the
 * behaviour of an egg crate:
 *   The egg crate has a maximum capacity of one dozen eggs.
 *   An egg crate starts out empty.
 *   When the egg crate is filled, it posts the {@code DID_FILL_CRATE_NOTIFICATION}.
 */

/**
 * Constructor for the EggCarton.
 * @constructor
 */
EggCarton = function() {
  GamePiece.call(this);
  /**
   * Number of eggs in the crate.
   * @type {Number}
   * @private
   * @readonly
   */
  this._eggCount = 0;
}
EggCarton.prototype = new GamePiece();
EggCarton.prototype.constructor = EggCarton;

/**
 * The maximum number of eggs that can go in a crate.
 */
EggCarton.MAX_EGG_COUNT = 12;

/**
 * Notification sent when a egg is laid.
 * @type {string}
 */
EggCarton.DID_FILL_CRATE_NOTIFICATION = 'didFillCrateNotification';

/**
 * The number of eggs in the crate. In range [0..{@code MAX_EGG_COUNT}].
 * @return {number} number of eggs.
 */
EggCarton.prototype.eggCount = function() {
  return this._eggCount;
}

/**
 * Exposed for testing. Do not use.
 * @param {number} eggCount The new egg count.
 */
EggCarton.prototype.setEggCount = function(eggCount) {
  this._eggCount = eggCount;
}

/**
 * Add an egg to the crate. If the crate is full, does nothing and returns {@code false}.
 * @return {boolean} whether the egg was successfully added.
 */
EggCarton.prototype.addEgg = function() {
  if (this._eggCount == EggCarton.MAX_EGG_COUNT) {
    return false;
  }
  this._eggCount++;
  if (this._eggCount == EggCarton.MAX_EGG_COUNT) {
    NotificationDefaultCenter().postNotification(
        EggCarton.DID_FILL_CRATE_NOTIFICATION, this);
  }
  return true;
}

/**
 * Reset the crate by emptying out all the eggs. Resets the egg count back to 0.
 */
EggCarton.prototype.reset = function() {
  this._eggCount = 0;
}
