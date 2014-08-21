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
  
  /**
   * The water level, expressed as a percentage. The height of the water level overlay
   * is determined by this value.
   * @type {number}
   * @public
   */
  this.waterLevel = 0.0;

  /**
   * The water level overlay image.
   * @type {Image}
   * @private
   */
  this._waterLevelOverlay = null;

  /**
   * Whether the water level overlay image has been loaded.
   * @type {boolean}
   * @private
   */
  this._isOverlayLoaded = false;
}
WaterBottleView.prototype = new ImageView();
WaterBottleView.prototype.constructor = WaterBottleView;

/**
 * Whether the image is ready to draw.
 * @override
 */
WaterBottleView.canDraw = function() {
  return this._image != null && this._isImageLoaded &&
      this._waterLevelOverlay != null && this._isOverlayLoaded;
}

/**
 * Load all the images needed for the water bottle.
 */
WaterBottleView.prototype.loadAllImages = function() {
  this._isOverlayLoaded = false;
  this._waterLevelOverlay = null;
  this._waterLevelOverlay = new Image();
  var onImageLoad = function() {
    this._isOverlayLoaded = true;
  }
  this._waterLevelOverlay.onload = onImageLoad.bind(this);
  this._waterLevelOverlay.src = "./img/water_level.png";
  this.loadImage("./img/water_bottle.png");
}

/**
 * The draw function.
 * @override
 */
WaterBottleView.prototype.draw = function(ctx, body) {
  if (!this.canDraw()) {
    return;
  }
  ctx.drawImage(this._image,
                this._imageOrigin.x, this._imageOrigin.y,
                this._imageSize.x, this._imageSize.y);
  ctx.drawImage(this._waterLevelOverlay,
                this._imageOrigin.x, this._imageOrigin.y,
                this._imageSize.x, this._imageSize.y);
}
