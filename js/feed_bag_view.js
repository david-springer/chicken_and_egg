/* Copyright 2014 (c) SoFIE Studios.  All rights reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview  The FeedBagView object. Draws the feed bag as an image, scaled in
 * height by the feed level fraction, and an underlay of the full feed-bag.
 * Requires: Box2d, BodyView.
 */

/**
 * Constructor for the FeedBagView class.
 * @inherit ImageView
 * @constructor
 */
FeedBagView = function() {
  ImageView.call(this);
  
  /**
   * The feed level, expressed as a value between 0 and 1. The height of the water level
   * overlay is determined by this value.
   * @type {number}
   * @public
   */
  this.feedLevelFraction = 1.0;
}
FeedBagView.prototype = new ImageView();
FeedBagView.prototype.constructor = FeedBagView;

/**
 * Whether the image is ready to draw.
 * @override
 */
FeedBagView.canDraw = function() {
  return this._image != null && this._isImageLoaded;
}

/**
 * The draw function.
 * @override
 */
FeedBagView.prototype.draw = function(ctx, body) {
  if (!this.canDraw()) {
    return;
  }
  ctx.save();
  ctx.globalAlpha = 0.33;
  ctx.drawImage(this._image,
                this._imageOrigin.x, this._imageOrigin.y,
                this._imageSize.x, this._imageSize.y);
  ctx.restore();
  // Note: the clipping box for drawImage is specified in the image's original coordinate
  // system, not in world coordinates.
  var destHeight = this._imageSize.y * this.feedLevelFraction;
  ctx.drawImage(this._image,
                0.0, 0.0,
                this._image.width, this._image.height,
                this._imageOrigin.x, this._imageOrigin.y,
                this._imageSize.x, destHeight);
}
