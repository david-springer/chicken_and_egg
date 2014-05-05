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
 *   When she lays an egg, she posts the DID_LAY_EGG_NOTIFICATION.
 *   The chicken dies (gets made into soup) when she's laid {@code MAX_EGG_COUNT} eggs.
 * The chicken pecks feed from its attached feed bag, and drinks from its attached
 * water bottle. This way, eating and drinking are autonomous functions performed by the
 * chicken.
 */

/**
 * Constructor for the Chicken.
 * @constructor
 * @extends {GamePiece}
 */
Chicken = function() {
  GamePiece.call(this);
  /**
   * Total amount of feed consumed since the last egg laid, measured in grams.
   * @type {Number}
   * @private
   * @readonly
   */
  this._feed = 0.0;
  /**
   * Total amount of water drunk since the last egg laid, measured in millilitres.
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
  this._eggCount = Chicken.Constants.MAX_EGG_COUNT;
  /**
   * Current consumption action. The chicken toggles between these.
   * @type {enum}
   * @private
   */
  this._action = Chicken.Actions.PECK;
  /**
   * The amount of scratch pecked in the last peck action. This volume is depleted over
   * time as the scratch is chewed, at a rate of CHEW_RATE.
   * @type {number}
   * @private
   */
  this._peckVolume = 0.0;
  /**
   * The amount of water lapped in the last drink action. This volume is depleted over
   * time as the water is swallowed, at a rate of DRINK_RATE.
   * @type {number}
   * @private
   */
  this._drinkVolume = 0.0;

  /**
   * The feed bag. This must be set before the chicken can eat.
   * @type {FeedBag}
   */
  this.feedBag = null;
  /**
   * The water bottle. This must be set before the chicken can drink.
   * @type {WaterBottle}
   */
  this.watterBottle = null;
}
Chicken.prototype = new GamePiece();
Chicken.prototype.constructor = Chicken;

/**
 * Various constants, measured in grams (solids) or milliliters (liquid).
 * @enum {number}
 */
Chicken.Constants = {
  MAX_FEED: 60.0,  // Maximum amount of feed.
  MAX_WATER: 120.0,  // Maximum amount of water.
  MIN_PECK_VOLUME: 6.0,
  MAX_PECK_VOLUME: 12.0,
  CHEW_RATE: 1.5,  // grams per second
  MIN_DRINK_VOLUME: 10.0,
  MAX_DRINK_VOLUME: 30.0,
  DRINK_RATE: 25.0,  // ml per second
  MAX_EGG_COUNT: 36  // All chickens start with this many eggs.
};

/**
 * Consumption actions.
 * @enum {number}
 */
Chicken.Actions = {
  DRINK: 1,
  PECK: 2
};

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
 * Peck feed or water and possibly lay an egg.
 * @param {Function} opt_randomFunction A random number generator that returns a pseudo-
 *     random number in the range 0..1. The default is Math.random(), but it can be
 *     replaced with a function that returns a constant value for testing.
 * @param {enum} opt_action The optional action (peck or drink). Default is to perform
 *     the opposite of the last action (that is, the actions toggle for every call).
 * @override
 */
Chicken.prototype.processGameTick = function(gameTimeNow, gameTimeDelta,
    opt_randomFunction, opt_action) {
  var random = opt_randomFunction || Math.random;
  var action = opt_action || this._nextAction();
  if (!this.isStillAlive()) {
    return;
  }
  switch (action) {
  case Chicken.Actions.DRINK:
    if (this._drinkVolume > 0) {
      var drinkDelta = Chicken.Constants.DRINK_RATE * gameTimeDelta;
      if (drinkDelta > this._drinkVolume) {
        drinkDelta = this._drinkVolume;  // Drink all the rest.
      }
      this._drinkVolume -= drinkDelta;
      this._drinkWater(drinkDelta, this.waterBottle);
    } else {
      // Take the initial drink of water. Drinking time is incremented at the next game
      // tick.
      this._drinkVolume = Chicken.Constants.MIN_DRINK_VOLUME +
          (Chicken.Constants.MAX_DRINK_VOLUME - Chicken.Constants.MIN_DRINK_VOLUME) *
          random();
    }
    break;
  case Chicken.Actions.PECK:
    if (this._peckVolume > 0) {
      var peckDelta = Chicken.Constants.CHEW_RATE * gameTimeDelta;
      if (peckDelta > this._peckVolume) {
        peckDelta = this._peckVolume;  // Drink all the rest.
      }
      this._peckVolume -= peckDelta;
      this._peckFeed(peckDelta, this.feedBag);
    } else {
      // Take the initial peck of scratch. Chewing time is incremented at the next game
      // tick.
      this._peckVolume = Chicken.Constants.MIN_PECK_VOLUME +
          (Chicken.Constants.MAX_PECK_VOLUME - Chicken.Constants.MIN_PECK_VOLUME) *
          random();
    }
    break;
  }
}

/**
 * Toggle to the next consumption action (pecking or drinking). Returns the current
 * action if the action is not yet finished; that is, if the chicken is in the middle
 * of drinking some water, then this returns DRINK. Toggles to the next action when the
 * current one if complete.
 * @return The next action (one of DRINK or PECK).
 * @private
 */
Chicken.prototype._nextAction = function() {
  if (this._drinkVolume == 0 && this._peckVolume == 0) {
    this._action = Chicken.Actions.PECK ? Chicken.Actions.DRINK : Chicken.Actions.PECK;
  }
  return this._action;
}

/**
 * Eat ("peck") some feed. Adds to the internal total until the maximum feed has been
 * eaten, after that no more feed can be eaten. Possibly lays an egg.
 * @param {number} peckVolume The volume of feed in this peck, measured in grams.
 * @param {FeedBag} feedBag The source feed bag for the scratch. Must respond to the
 *     peck() method.
 * @private
 */
Chicken.prototype._peckFeed = function(peckVolume, feedBag) {
  if (!this.isStillAlive() || !feedBag) {
    return;
  }
  this._feed += feedBag.peck(peckVolume);
  if (this._feed >= Chicken.Constants.MAX_FEED) {
    if (this._shouldLayEgg()) {
      this._layEgg();
    } else {
      this._feed = Chicken.Constants.MAX_FEED;
    }
  }
}

/**
 * Drink some water. Adds to the internal total until the maximum water has been drunk,
 * after that no more water can be drunk. Possibly lays an egg.
 * @param {number} waterVolume The volume of water, measured in millilitres.
 * @param {WaterBottle} waterBottle The source water bottle. Must respond to the drink()
 *     method.
 * @private
 */
Chicken.prototype._drinkWater = function(waterVolume, waterBottle) {
  if (!this.isStillAlive() || !waterBottle) {
    return;
  }
  
  this._water += waterBottle.drink(waterVolume);
  if (this._water >= Chicken.Constants.MAX_WATER) {
    if (this._shouldLayEgg()) {
      this._layEgg();
    } else {
      this._water = Chicken.Constants.MAX_WATER;
    }
  }
}

/**
 * See if the chicken is ready to lay an egg or not.
 * @return {boolean} whether the egg is ready to lay or not.
 * @private
 */
Chicken.prototype._shouldLayEgg = function () {
  return this._water >= Chicken.Constants.MAX_WATER &&
      this._feed >= Chicken.Constants.MAX_FEED;
}

/**
 * Lay an egg. Sends the DID_LAY_EGG_NOTIFICATION and resets the feed & water levels
 * to 0. If this is the final egg, also sends the DID_DIE_NOTIFICATION. The chicken can
 * no longer eat or drink after this point.
 * @private
 */
Chicken.prototype._layEgg = function() {
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
