/* Copyright 2014 (c) SoFIE Studios.  All rights reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview  The fake ImageView object. Use to stub out the ImageView object in
 * tests.
 * Requires: Box2d, BodyView.
 */

/**
 * Constructor for the ImageView class.
 * @inherit BodyView
 * @constructor
 */
ImageView = function() {
  BodyView.call(this);
  /**
   * The lower-left origin and size of the image in world coordinates.
   * @type {Box2D.b2Vec2}
   * @private
   */
  this._imageOrigin = new Box2D.Common.Math.b2Vec2(0.0, 0.0);
  this._imageSize = new Box2D.Common.Math.b2Vec2(0.5, 0.5);
}
ImageView.prototype = new BodyView();
ImageView.prototype.constructor = ImageView;

/**
 * Set the image to draw. This starts loading the image from the supplied URL. Once the
 * image is loaded it can be drawn.
 */
ImageView.prototype.loadImage = function(imageUrl) {
}

/**
 * Set the origin (lower-left corner) of the image in world coordinates.
 */
ImageView.prototype.setOrigin = function(origin) {
  this._imageOrigin = origin;
}

/**
 * Set the size of the image in world coordinates.
 */
ImageView.prototype.setWidth = function(width) {
  this._imageSize.x = width;
}

/**
 * Get the size of the image in world coordinates.
 */
ImageView.prototype.getWorldSize = function() {
  return this._imageSize;
}

/**
 * Return whether the image can be drawn.
 */
ImageView.prototype.canDraw = function() {
  return false;
}

/**
 * The draw function.
 * @override
 */
ImageView.prototype.draw = function(ctx, body) {
}
