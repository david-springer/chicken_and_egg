/* Copyright 2014 (c) SoFIE Studios.  All rights reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview  The EggCrate class. The EggCrate object implements all the
 * behaviour of an egg crate:
 *   The egg crate has a maximum capacity of one dozen eggs.
 *   An egg crate starts out empty.
 *   When the egg crate is filled, it posts the {@code DID_FILL_CRATE_NOTIFICATION}.
 */

/**
 * Constructor for the EggCrate.
 * @constructor
 */
EggCrate = function() {
  /**
   * Number of eggs in the crate.
   * @type {Number}
   * @private
   * @readonly
   */
  this._eggCount = 0;
}
EggCrate.prototype.constructor = EggCrate;

/**
 * The maximum number of eggs that can go in a crate.
 */
EggCrate.MAX_EGG_COUNT = 12;

/**
 * Notification sent when a egg is laid.
 * @type {string}
 */
EggCrate.DID_FILL_CRATE_NOTIFICATION = 'didFillCrateNotification';

/**
 * The number of eggs in the crate. In range [0..{@code MAX_EGG_COUNT}].
 * @return {Number} number of eggs.
 */
EggCrate.prototype.eggCount = function() {
  return this._eggCount;
}

/**
 * Exposed for testing. Do not use.
 */
EggCrate.prototype.setEggCount = function(eggCount) {
  this._eggCount = eggCount;
}

/**
 * Add an egg to the crate. If the crate is full, does nothing and returns {@code false}.
 * @return {boolean} whether the egg was successfully added.
 */
EggCrate.prototype.addEgg = function() {
  if (this._eggCount == EggCrate.MAX_EGG_COUNT) {
    return false;
  }
  this._eggCount++;
  if (this._eggCount == EggCrate.MAX_EGG_COUNT) {
    NotificationDefaultCenter().postNotification(
        EggCrate.DID_FILL_CRATE_NOTIFICATION, this);
  }
  return true;
}

/**
 * Reset the crate by emptying out all the eggs. Resets the egg count back to 0.
 */
EggCrate.prototype.reset = function() {
  this._eggCount = 0;
}
