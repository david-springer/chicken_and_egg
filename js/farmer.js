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

/**
 * Whether the farmer is still alive or not.
 * @return {boolean} still alive.
 */
Farmer.prototype.isAlive = function() {
  return this._health > 0;
}

/**
 * Eat some eggs. At most {@code MAX_EGG_EAT_COUNT} can be eaten at a time.
 * @param {number} eggCount The number of eggs to eat at this sitting.
 * @return {number} the number of eggs actually eaten.
 */
Farmer.prototype.eatEggs = function(eggCount) {
  if (eggCount < 0) {
    return 0;
  }
  var eggsConsumedCount = eggCount > Farmer.MAX_EGG_EAT_COUNT ?
                          Farmer.MAX_EGG_EAT_COUNT : eggCount;
  this._health += eggsConsumedCount * Farmer.EGG_STRENGTH;
  if (this._health > 1.0) {
    this._health = 1.0;
  }
  return eggsConsumedCount;
}

/**
 * Metabolize eggs for a given time interval. This reduces the health of the farmer
 * proportional to the metabolic rate. When the health falls to 0, the farmer dies
 * and posts the {@code DID_DIE_NOTIFICATION} notification.
 * @param {number} interval The interval to metabolize. Measured in seconds. Does
 *     nothing if negative.
 * @return {boolean} whether the metabolism was successful.
 */
Farmer.prototype.metabolizeForInterval = function(interval) {
  if (!this.isAlive() || interval < 0.0) {
    return false;
  }
  var healthReduced = interval * Farmer.METABOLIC_RATE;
  this._health -= healthReduced;
  if (this._health <= 0.0) {
    this._health = 0.0;
    NotificationDefaultCenter().postNotification(Farmer.DID_DIE_NOTIFICATION, this);
  }
  return true;
}