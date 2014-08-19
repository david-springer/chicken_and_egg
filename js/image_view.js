/* Copyright 2014 (c) SoFIE Studios.  All rights reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview  The ImageView object. Draws an image at a point specified in world
 * coordinates. Images drawn using this class are inverted in Y from the <CANVAS>
 * elements. That is, Y increases going up instead of down.
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
   * A bit indicating that the image has loaded and can be drawn in a CANVAS context.
   * @type {boolean}
   * @private
   */
  this._isImageLoaded = false;

  /**
   * The image.
   * @type {Image}
   * @private
   */
  this._image = null;

  /**
   * The lower-left origin and size of the image in world coordinates.
   * @type {Box2D.b2Vec2}
   * @private
   */
  this._imageOrigin = new Box2D.Common.Math.b2Vec2(0.0, 0.0);
  this._imageSize = new Box2D.Common.Math.b2Vec2(0.1, 0.1);
}
ImageView.prototype = new BodyView();
ImageView.prototype.constructor = ImageView;

/**
 * Set the image to draw. This starts loading the image from the supplied URL. Once the
 * image is loaded it can be drawn.
 */
ImageView.prototype.loadImage = function(imageUrl) {
  // Unload the old image.
  this._isImageLoaded = false;
  this._image = null;
  this._image = new Image();
  var onImageLoad = function() {
    this._isImageLoaded = true;
  }
  this._image.onload = onImageLoad.bind(this);
  this._image.src = imageUrl;
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
ImageView.prototype.setSize = function(size) {
  this._imageSize = size;
}

/**
 * The draw function.
 * @override
 */
ImageView.prototype.draw = function(ctx, body) {
  if (this._image == null || !this._isImageLoaded) {
    return;
  }
  ctx.drawImage(this._image,
                this._imageOrigin.x, this._imageOrigin.y,
                this._imageSize.x, this._imageSize.y);
}
