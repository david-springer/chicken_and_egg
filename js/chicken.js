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
}
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
 * Notification sent when a egg is laid.
 * @type {string}
 */
Chicken.DID_LAY_EGG_NOTIFICATION = 'didLayEggNotification';

/**
 * Accessors and mutators.
 */
Chicken.prototype.feed = function() {
  return this._feed;
}

/**
 * Exposed for testing.
 */
Chicken.prototype.setFeed = function(feed) {
  this._feed = feed;
}

Chicken.prototype.water = function() {
  return this._water;
}

/**
 * Exposed for testing.
 */
Chicken.prototype.setWater = function(water) {
  this._water = water;
}

/**
 * Eat ("peck") some feed. Adds to the internal total until the maximum feed has been
 * eaten, after that no more feed can be eaten. Possibly lays an egg.
 * @param {Number} peckVolume The volume of feed in this peck, measured in grams.
 */
Chicken.prototype.peckFeed = function(peckVolume) {
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
 * to 0.
 */
Chicken.prototype.layEgg = function() {
  this._feed = 0.0;
  this._water = 0.0;
  $.Notifcations(Chicken.DID_LAY_EGG_NOTIFICATION).publish(this);
}
