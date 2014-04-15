/* Copyright 2014 (c) SoFIE Studios.  All rights reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview  The FeedBag class. The FeedBag object implements all the behaviour of
 * the Feed Bag game entity. The Feed Bag rules:
 *   The feed bag starts with 2kg of feed.
 *   The bag loses feed with each peck from a chicken.
 *   A feed bag can be refilled when an egg crate is filled with a dozen eggs.
 */

/**
 * Constructor for the FeedBag.
 * @constructor
 */
FeedBag = function() {
  /**
   * Amount of feed remaining, measured in grams.
   * @type {Number}
   * @private
   * @readonly
   */
  this._feed = FeedBag.MAX_FEED;
}
FeedBag.prototype.constructor = FeedBag;

/**
 * The amount of feed in a full feed bag, measured in grams.
 */
FeedBag.MAX_FEED = 2000.0;

/**
 * Exposed for testing. Do not use.
 */
FeedBag.prototype.setFeed = function(feed) {
  this._feed = feed;
}

/**
 * Indicates whether the feed bag is empty.
 * @return {boolean} Whether the feed bag is empty.
 */
FeedBag.prototype.isEmpty = function() {
  return this._feed == 0;
}

/**
 * The amount of feed left. In range [0..{@code MAX_FEED}].
 * @return {Number} remaining feed.
 */
FeedBag.prototype.feed = function() {
  return this._feed;
}

/**
 * Eat a quantity of feed. Returns the actual amount of feed consumed. May return
 * 0 if there is no more feed left in the bag.
 * @param {Number} peckAmount The amount of feed to try to eat.
 * @return {Number} the amount of feed actually consumed.
 */
FeedBag.prototype.peck = function(peckAmount) {
  if (peckAmount > 0) {
    this._feed -= peckAmount;
    if (this._feed < 0) {
      peckAmount += this._feed;
      this._feed = 0;
    }
    return peckAmount;
  }
  return 0;
}

/**
 * Refill the feed bag.
 */
FeedBag.prototype.refill = function() {
  this._feed = FeedBag.MAX_FEED;
}

