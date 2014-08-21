/* Copyright 2014 (c) SoFIE Studios.  All rights reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview  The WaterBottleView object. Draws an the water bottle as an image
 * with an overlay of the water level.
 * Requires: Box2d, BodyView.
 */

/**
 * Constructor for the ImageView class.
 * @inherit BodyView
 * @constructor
 */
WaterBottleView = function() {
  ImageView.call(this);
}
WaterBottleView.prototype = new ImageView();
WaterBottleView.prototype.constructor = WaterBottleView;
