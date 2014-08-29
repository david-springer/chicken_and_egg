/* Copyright 2014 (c) SoFIE Studios.  All rights reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview  The FriedEggView object. Draws a fried egg, sets the alpha based on
 * the fried fraction: 0 means minimum alpha, 1 means full opacity.
 * Requires: Box2d, BodyView.
 */

/**
 * Constructor for the FriedEggView class.
 * @inherit ImageView
 * @constructor
 */
FriedEggView = function() {
  BodyView.call(this);
  /**
   * The fried amount, expressed as a value between 0 and 1. The opacity of the egg is
   * determined by this value.
   * @type {number}
   * @public
   */
  this.friedFraction = 1.0;
}
FriedEggView.prototype = new BodyView();
FriedEggView.prototype.constructor = FriedEggView;

/**
 * The minimum opacity. Maximum opacity is 1.
 * @type {number}
 * @private
 */
FriedEggView._MINIMUM_OPACITY = 0.25;

FriedEggView.prototype.draw = function(ctx, body) {
  if (!this.canDraw()) {
    return;
  }
  ctx.save();
  ctx.globalAlpha = (1 - this.friedFraction) * FriedEggView._MINIMUM_OPACITY +
      this.friedFraction * 1.0;
  ctx.drawImage(this._image,
                this._imageOrigin.x, this._imageOrigin.y,
                this._imageSize.x, this._imageSize.y);
  ctx.restore();
}

