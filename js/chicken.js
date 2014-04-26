/* Copyright 2014 (c) SoFIE Studios.  All rights reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview  The Chicken class. The Chicken object implements all the behaviour of
 * the Chicken game entity. The Chicken rules:
 *   A chicken lays an egg when she has eaten 60g of feed, and drank 120 ml of water.
 *   The chicken pecks a certain amount of feed via the peckFeed() method.
 *   The chicken drinks water via the drinkWater() method.
 *   When she lays an egg, she posts the DID_LAY_EGG_NOTIFICATION using jQuery's
 *   .trigger() mechanism.
 *   The chicken dies (gets made into soup) then she's laid {@code MAX_EGG_COUNT} eggs.
 */

/**
 * Constructor for the Chicken.
 * @constructor
 */
Chicken = function() {
  GamePiece.call(this);
  /**
   * Amount of feed consumed, measured in grams.
   * @type {Number}
   * @private
   * @readonly
   */
  this._feed = 0.0;
  /**
   * Amount of water drunk, measured in millilitres.
   * @type {Number}
   * @private
   * @readonly
   */
  this._water = 0.0;
  /**
   * Number of eggs remaining. When this number becomes 0, the chicken dies.
   * @type {Number}
   * @private
   * @readonly
   */
  this._eggCount = Chicken.MAX_EGG_COUNT;
}
Chicken.prototype = new GamePiece();
Chicken.prototype.constructor = Chicken;

/**
 * Maximum amount the Chicken can eat, measure in grams.
 * @type {Number}
 */
Chicken.MAX_FEED = 60.0;

/**
 * Maximum amount the Chicken can drink, measure in millilitres.
 * @type {Number}
 */
Chicken.MAX_WATER = 120.0;

/**
 * Maximum number of egg a chicken has. All chickens start with this many eggs.
 * @type {Number}
 */
Chicken.MAX_EGG_COUNT = 36.0;

/**
 * Notification sent when a egg is laid.
 * @type {string}
 */
Chicken.DID_LAY_EGG_NOTIFICATION = 'didLayEggNotification';

/**
 * Notification sent when the chicken dies, because she laid all of her eggs.
 * @type {string}
 */
Chicken.DID_DIE_NOTIFICATION = 'didDieNotification';

/**
 * Accessors and mutators.
 */
Chicken.prototype.feed = function() {
  return this._feed;
}

Chicken.prototype.water = function() {
  return this._water;
}

Chicken.prototype.eggCount = function() {
  return this._eggCount;
}

/**
 * Exposed for testing. Do not use.
 */
Chicken.prototype.setWater = function(water) {
  this._water = water;
}
Chicken.prototype.setFeed = function(feed) {
  this._feed = feed;
}
Chicken.prototype.setEggCount = function(eggCount) {
  this._eggCount = eggCount;
}

/**
 * Indicates that the chicken is still alive.
 * @return {boolean} Whether the chicken is still alive.
 */
Chicken.prototype.isStillAlive = function() {
  return this._eggCount > 0;
}

/**
 * Eat ("peck") some feed. Adds to the internal total until the maximum feed has been
 * eaten, after that no more feed can be eaten. Possibly lays an egg.
 * @param {Number} peckVolume The volume of feed in this peck, measured in grams.
 */
Chicken.prototype.peckFeed = function(peckVolume) {
  if (!this.isStillAlive()) {
    return;
  }
  this._feed += peckVolume;
  if (this._feed >= Chicken.MAX_FEED) {
    if (this.shouldLayEgg()) {
      this.layEgg();
    } else {
      this._feed = Chicken.MAX_FEED;
    }
  }
}

/**
 * Drink some water. Adds to the internal total until the maximum water has been drunk,
 * after that no more water can be drunk. Possibly lays an egg.
 * @param {Number} waterVolume The volume of water, measured in millilitres.
 */
Chicken.prototype.drinkWater = function(waterVolume) {
  if (!this.isStillAlive()) {
    return;
  }
  this._water += waterVolume;
  if (this._water >= Chicken.MAX_WATER) {
    if (this.shouldLayEgg()) {
      this.layEgg();
    } else {
      this._water = Chicken.MAX_WATER;
    }
  }
}

/**
 * See if the chicken is ready to lay an egg or not.
 * @return {boolean} whether the egg is ready to lay or not.
 */
Chicken.prototype.shouldLayEgg = function () {
  return this._water >= Chicken.MAX_WATER && this._feed >= Chicken.MAX_FEED;
}

/**
 * Lay an egg. Sends the DID_LAY_EGG_NOTIFICATION and resets the feed & water levels
 * to 0. If this is the final egg, also sends the DID_DIE_NOTIFICATION. The chicken can
 * no longer eat or drink after this point.
 */
Chicken.prototype.layEgg = function() {
  if (!this.isStillAlive()) {
    return;
  }
  this._feed = 0.0;
  this._water = 0.0;
  NotificationDefaultCenter().postNotification(Chicken.DID_LAY_EGG_NOTIFICATION, this);
  this._eggCount--;
  if (this._eggCount == 0) {
    NotificationDefaultCenter().postNotification(Chicken.DID_DIE_NOTIFICATION, this);
  }
}
