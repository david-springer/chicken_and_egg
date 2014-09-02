/* Copyright 2014 (c) SoFIE Studios.  All rights reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview  The Pullet class. The Pullet object implements all the behaviour of
 * the Pullet game entity. The Pullet only eats and drinks, which causes the feed and
 * water to run out faster for each pullet you keep.
 */

/**
 * Constructor for the Pullet.
 * @constructor
 * @extends {Chicken}
 */
Pullet = function() {
  Chicken.call(this);
  // Pullets eat 1/2 as much as a full-sized chicken, and consume at 1/2 the rate.
  this.constants = {
      MAX_FEED: 30.0,  // Maximum amount of feed.
      MAX_WATER: 60.0,  // Maximum amount of water.
      MIN_PECK_VOLUME: 10.0,
      MAX_PECK_VOLUME: 15.0,
      CHEW_RATE: 7.0,  // grams per second
      MIN_DRINK_VOLUME: 15.0,
      MAX_DRINK_VOLUME: 30.0,
      DRINK_RATE: 12.0  // ml per second
  };
}
Pullet.prototype = new Chicken();
Pullet.prototype.constructor = Chicken;

/**
 * Eat ("peck") some feed. Adds to the internal total until the maximum feed has been
 * eaten, after that no more feed can be eaten.
 * @param {number} peckVolume The volume of feed in this peck, measured in grams.
 * @param {FeedBag} feedBag The source feed bag for the scratch. Must respond to the
 *     peck() method.
 * @override
 */
Pullet.prototype.peckFeed = function(peckVolume, feedBag) {
  if (!this.isStillAlive() || !feedBag) {
    return;
  }
  this._feed += feedBag.peck(peckVolume);
  if (this._feed >= this.constants.MAX_FEED) {
    this._feed = 0.0;
  }
}

/**
 * Drink some water. Adds to the internal total until the maximum water has been drunk,
 * after that no more water can be drunk.
 * @param {number} waterVolume The volume of water, measured in millilitres.
 * @param {WaterBottle} waterBottle The source water bottle. Must respond to the drink()
 *     method.
 * @override
 */
Pullet.prototype.drinkWater = function(waterVolume, waterBottle) {
  if (!this.isStillAlive() || !waterBottle) {
    return;
  }
  
  this._water += waterBottle.drink(waterVolume);
  if (this._water >= this.constants.MAX_WATER) {
    this._water = 0.0;
  }
}
