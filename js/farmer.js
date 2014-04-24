/* Copyright 2014 (c) SoFIE Studios.  All rights reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview  The Farmer class. The Farmer object implements all the behaviour of the
 * farmer, who is the player of the game:
 *   The farmer starts with 100% health.
 *   Health declines with time.
 *   Eating an egg restores health - each egg provides 25% health.
 *   If health falls to 0%, the farmer dies and the FARMER_DID_DIE_NOTIFICATION is
 *     posted.
 */

/**
 * Constructor for the Farmer.
 * @constructor
 */
Farmer = function() {
  /**
   * Remaining health, as a percentage. Range is [0..1].
   * @type {number}
   * @private
   * @readonly
   */
  this._health = 1;
}
Farmer.prototype.constructor = Farmer;

/**
 * Amount of health added when an egg is eaten.
 * @type {number}
 */
Farmer.EGG_STRENGTH = 0.25;

/**
 * Maximum number of eggs a farmer can eat at a time.
 * @type {number}
 */
Farmer.MAX_EGG_EAT_COUNT = 2;

/**
 * Amount of health the farmer loses per second.
 * @type {number}
 */
Farmer.METABOLIC_RATE = 0.01667;  // About 1/60 of a second.

/**
 * Notification sent when the farmer dies.
 * @type {String}
 */
Farmer.DID_DIE_NOTIFICATION = 'farmerDidDieNotification';

/**
 * Exposed for testing. Do Not use.
 * @param {number} health The new health level. Must be in range [0..1].
 */
Farmer.prototype.setHealth = function(health) {
  this._health = health;
}

/**
 * The current health level. In range [0..1].
 * @return {number} health level.
 */
Farmer.prototype.health = function() {
  return this._health;
}

