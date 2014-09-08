/* Copyright 2014 (c) SoFIE Studios.  All rights reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview  The Chicken class. The Chicken object implements all the behaviour of
 * the Chicken game entity. The Chicken rules:
 *   The chicken pecks a certain amount of feed via the peckFeed() method.
 *   The chicken drinks water via the drinkWater() method.
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
  /**
   * The consumption constants. Subclasses can modify or add as necessary. The Chicken
   * class assumes the existence of these constants.
   * @enum {number}
   * @public
   */
  this.constants = {
      MAX_FEED: 60.0,  // Maximum amount of feed.
      MAX_WATER: 120.0,  // Maximum amount of water.
      MIN_PECK_VOLUME: 20.0,
      MAX_PECK_VOLUME: 30.0,
      CHEW_RATE: 15.0,  // grams per second
      MIN_DRINK_VOLUME: 30.0,
      MAX_DRINK_VOLUME: 60.0,
      DRINK_RATE: 25.0  // ml per second
  };
}
Chicken.prototype = new GamePiece();
Chicken.prototype.constructor = Chicken;

/**
 * Consumption actions.
 * @enum {number}
 */
Chicken.Actions = {
  DRINK: 1,
  PECK: 2
};

/**
 * Accessors and mutators.
 */
Chicken.prototype.feed = function() {
  return this._feed;
}

Chicken.prototype.water = function() {
  return this._water;
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

/**
 * Indicates that the chicken is still alive. Subclasses can override this with more
 * complicated logic.
 * @return {boolean} Whether the chicken is still alive.
 */
Chicken.prototype.isStillAlive = function() {
  return true;
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
      var drinkDelta = this.constants.DRINK_RATE * gameTimeDelta;
      if (drinkDelta > this._drinkVolume) {
        drinkDelta = this._drinkVolume;  // Drink all the rest.
      }
      this._drinkVolume -= drinkDelta;
      this.drinkWater(drinkDelta, this.waterBottle);
    } else {
      // Take the initial drink of water. Drinking time is incremented at the next game
      // tick.
      this._drinkVolume = this.constants.MIN_DRINK_VOLUME +
          (this.constants.MAX_DRINK_VOLUME - this.constants.MIN_DRINK_VOLUME) *
          random();
    }
    break;
  case Chicken.Actions.PECK:
    if (this._peckVolume > 0) {
      var peckDelta = this.constants.CHEW_RATE * gameTimeDelta;
      if (peckDelta > this._peckVolume) {
        peckDelta = this._peckVolume;  // Drink all the rest.
      }
      this._peckVolume -= peckDelta;
      this.peckFeed(peckDelta, this.feedBag);
    } else {
      // Take the initial peck of scratch. Chewing time is incremented at the next game
      // tick.
      this._peckVolume = this.constants.MIN_PECK_VOLUME +
          (this.constants.MAX_PECK_VOLUME - this.constants.MIN_PECK_VOLUME) *
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
    this._action = (this._action == Chicken.Actions.PECK) ?
        Chicken.Actions.DRINK : Chicken.Actions.PECK;
  }
  return this._action;
}

/**
 * Eat ("peck") some feed. Default implementation does nothing.
 * @param {number} peckVolume The volume of feed in this peck, measured in grams.
 * @param {FeedBag} feedBag The source feed bag for the scratch. Must respond to the
 *     peck() method.
 * @private
 */
Chicken.prototype.peckFeed = function(peckVolume, feedBag) {
}

/**
 * Drink some water. Default implementation does nothing.
 * @param {number} waterVolume The volume of water, measured in millilitres.
 * @param {WaterBottle} waterBottle The source water bottle. Must respond to the drink()
 *     method.
 */
Chicken.prototype.drinkWater = function(waterVolume, waterBottle) {
}
