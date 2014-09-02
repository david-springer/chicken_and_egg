/* Copyright 2014 (c) SoFIE Studios.  All rights reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview  The Hen class. The Hen object implements all the behaviour of
 * the Hen game entity. The Hen rules:
 *   A hen lays an egg when she has eaten 60g of feed, and drank 120 ml of water.
 *   When she lays an egg, she posts the DID_LAY_EGG_NOTIFICATION.
 *   The hen dies (gets made into soup) when she's laid {@code MAX_EGG_COUNT} eggs.
 */

/**
 * Constructor for the Hen.
 * @constructor
 * @extends {Chicken}
 */
Hen = function() {
  Chicken.call(this);
  /**
   * Number of eggs remaining. When this number becomes 0, the hen dies.
   * @type {Number}
   * @private
   * @readonly
   */
  this.constants.MAX_EGG_COUNT = 20;  // All hens start with this many eggs.
  this._eggCount = this.constants.MAX_EGG_COUNT;
}
Hen.prototype = new Chicken();
Hen.prototype.constructor = Hen;

/**
 * Notification sent when a egg is laid.
 * @type {string}
 */
Hen.DID_LAY_EGG_NOTIFICATION = 'didLayEggNotification';

/**
 * Notification sent when the chicken dies, because she laid all of her eggs.
 * @type {string}
 */
Hen.DID_DIE_NOTIFICATION = 'didDieNotification';

/**
 * The origin in world coordinates of the chicken.
 * @type {Box2D.Common.Math.b2Vec2}
 */
Hen.IMAGE_ORIGIN = new Box2D.Common.Math.b2Vec2(0.70, 2.03);
Hen.IMAGE_WIDTH = 0.5;

Hen.prototype.eggCount = function() {
  return this._eggCount;
}

/**
 * Exposed for testing. Do not use.
 */
Hen.prototype.setEggCount = function(eggCount) {
  this._eggCount = eggCount;
}

/**
 * Indicates that the hen is still alive.
 * @return {boolean} Whether the chicken is still alive.
 * @override
 */
Hen.prototype.isStillAlive = function() {
  return this._eggCount > 0;
}

/**
 * Eat ("peck") some feed. Adds to the internal total until the maximum feed has been
 * eaten, after that no more feed can be eaten. Possibly lays an egg.
 * @param {number} peckVolume The volume of feed in this peck, measured in grams.
 * @param {FeedBag} feedBag The source feed bag for the scratch. Must respond to the
 *     peck() method.
 * @override
 */
Hen.prototype.peckFeed = function(peckVolume, feedBag) {
  if (!this.isStillAlive() || !feedBag) {
    return;
  }
  this._feed += feedBag.peck(peckVolume);
  if (this._feed >= this.constants.MAX_FEED) {
    if (this._shouldLayEgg()) {
      this._layEgg();
    } else {
      this._feed = this.constants.MAX_FEED;
    }
  }
}

/**
 * Drink some water. Adds to the internal total until the maximum water has been drunk,
 * after that no more water can be drunk. Possibly lays an egg.
 * @param {number} waterVolume The volume of water, measured in millilitres.
 * @param {WaterBottle} waterBottle The source water bottle. Must respond to the drink()
 *     method.
 * @override
 */
Hen.prototype.drinkWater = function(waterVolume, waterBottle) {
  if (!this.isStillAlive() || !waterBottle) {
    return;
  }
  
  this._water += waterBottle.drink(waterVolume);
  if (this._water >= this.constants.MAX_WATER) {
    if (this._shouldLayEgg()) {
      this._layEgg();
    } else {
      this._water = this.constants.MAX_WATER;
    }
  }
}

/**
 * See if the chicken is ready to lay an egg or not.
 * @return {boolean} whether the egg is ready to lay or not.
 * @protected
 */
Hen.prototype._shouldLayEgg = function () {
  return this._water >= this.constants.MAX_WATER &&
      this._feed >= this.constants.MAX_FEED;
}

/**
 * Lay an egg. Sends the DID_LAY_EGG_NOTIFICATION and resets the feed & water levels
 * to 0. If this is the final egg, also sends the DID_DIE_NOTIFICATION. The chicken can
 * no longer eat or drink after this point.
 * @private
 */
Hen.prototype._layEgg = function() {
  if (!this.isStillAlive()) {
    return;
  }
  this._feed = 0.0;
  this._water = 0.0;
  NotificationDefaultCenter().postNotification(Hen.DID_LAY_EGG_NOTIFICATION, this);
  this._eggCount--;
  this._setViewEggCount(this._eggCount);
  if (this._eggCount == 0) {
    NotificationDefaultCenter().postNotification(Hen.DID_DIE_NOTIFICATION, this);
  }
}

/**
 * Set the egg count for the view.
 * @private
 */
Hen.prototype._setViewEggCount = function(eggCount) {
  if (this.view) {
    this.view.eggCount = eggCount;
  }
}

/**
 * The chicken is drawable when the image gets loaded.
 * @override
 */
Hen.prototype.canDraw = function() {
  return this.view != null && this.view.canDraw();
}

/**
 * Create an ImageView for the chicken.
 * @override
 */
Hen.prototype.loadView = function(simulation) {
  var chickenView = new ChickenView();
  chickenView.setOrigin(Hen.IMAGE_ORIGIN);
  chickenView.setWidth(Hen.IMAGE_WIDTH);
  chickenView.init();
  this.view = chickenView;
  this._setViewEggCount(this._eggCount);
}
