/* Copyright 2014 (c) SoFIE Studios.  All rights reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview  The WaterBottle class. The WaterBottle object implements all the
 * behaviour of a water bottle:
 *   The water bottle has a maximum capacity of 4 litres.
 *   A water bottle starts filled to max.
 *   You can refill a water bottle, but only when the level is less than 1 l.
 */

/**
 * Constructor for the WaterBottle.
 * @constructor
 * @extends {GamePiece}
 */
WaterBottle = function() {
  GamePiece.call(this);
  /**
   * Amount of water remaining, measured in millilitres.
   * @type {Number}
   * @private
   * @readonly
   */
  this._waterLevel = WaterBottle.MAX_WATER_LEVEL;
}
WaterBottle.prototype = new GamePiece();
WaterBottle.prototype.constructor = WaterBottle;

/**
 * The amount of water in a full water bottle, measured in millilitres.
 */
WaterBottle.MAX_WATER_LEVEL = 4000.0;

/**
 * The refill amount - refilling is allowed only when there is less that this amount of
 * water in the bottle.
 */
WaterBottle.MAX_REFILL_LEVEL = 1000.0;

/**
 * The origin and size in world coordinates of the water bottle.
 * @type {Box2D.Common.Math.b2Vec2}
 */
WaterBottle.IMAGE_ORIGIN = new Box2D.Common.Math.b2Vec2(0.40, 2.03);
// The water bottle image is 81 x 128 points. Size the final image so it is 20cm wide and
// preserves aspect ratio.
// TODO(daves): Figure out how to get the image dims from the Image object.
WaterBottle.IMAGE_SIZE = new Box2D.Common.Math.b2Vec2(0.20, 0.20 * (128.0 / 81.0));

/**
 * Indicates whether the feed bag is empty.
 * @return {boolean} Whether the feed bag is empty.
 */
WaterBottle.prototype.isEmpty = function() {
  return this._waterLevel == 0;
}

/**
 * The amount of water left. In range [0..{@code MAX_WATER_LEVEL}].
 * @return {Number} remaining water.
 */
WaterBottle.prototype.waterLevel = function() {
  return this._waterLevel;
}

/**
 * Exposed for testing. Do not use.
 */
WaterBottle.prototype.setWaterLevel = function(waterLevel) {
  this._waterLevel = waterLevel;
}

/**
 * Drink a quantity of water. Returns the actual amount of water drunk. May return
 * 0 if there is no more water left in the water bottle.
 * @param {Number} drinkAmount The amount of water to try to drink.
 * @return {Number} the amount of water actually drunk.
 */
WaterBottle.prototype.drink = function(drinkAmount) {
  if (drinkAmount > 0) {
    this._waterLevel -= drinkAmount;
    if (this._waterLevel < 0) {
      drinkAmount += this._waterLevel;
      this._waterLevel = 0;
    }
    return drinkAmount;
  }
  return 0;
}

/**
 * Refill the feed bag.
 * @return {boolean} Whether the refill was successful or not.
 */
WaterBottle.prototype.refill = function() {
  if (this._waterLevel < WaterBottle.MAX_REFILL_LEVEL) {
    this._waterLevel = WaterBottle.MAX_WATER_LEVEL;
    return true;
  }
  return false;
}

/**
 * The water bottle is drawable when the image gets loaded.
 * @override
 */
WaterBottle.prototype.canDraw = function() {
  return this.view != null && this.view.canDraw();
}

/**
 * Create an ImageView for the water bottle.
 * @override
 */
WaterBottle.prototype.loadView = function(simulation) {
  var bottleView = new ImageView();
  bottleView.setOrigin(WaterBottle.IMAGE_ORIGIN);
  bottleView.setSize(WaterBottle.IMAGE_SIZE);
  bottleView.loadImage("./img/water_bottle.png");
  this.view = bottleView;
}

/**
 * The water bottle reports stats.
 * @override
 */
WaterBottle.prototype.hasStats = function() {
  return true;
}

/**
 * Return the display name of this game piece.
 * @override
 */
WaterBottle.prototype.displayName = function() {
  return "Water Level";  // TODO(daves): localize this?
}

/**
 * Return the stats for this game piece.
 * @override
 */
WaterBottle.prototype.statsDisplayString = function() {
  return this._waterLevel.toFixed() + "ml";
}
