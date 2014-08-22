/* Copyright 2014 (c) SoFIE Studios.  All rights reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview  The HoseBibView object. Draws the hose bib in either the enabled or
 * disabled (no highlights) state.
 * Requires: Box2d, BodyView.
 */

/**
 * Constructor for the HoseBibView class.
 * @inherit ImageView
 * @constructor
 */
HoseBibView = function() {
  ImageView.call(this);
  
  /**
   * Whether the hose bib is enabled or not. Determines the drawing style.
   * @type {boolean}
   * @public
   */
  this.enabled = true;
}
HoseBibView.prototype = new ImageView();
HoseBibView.prototype.constructor = HoseBibView;

/**
 * The draw function.
 * @override
 */
HoseBibView.prototype.draw = function(ctx, body) {
  if (!this.canDraw()) {
    return;
  }
  ctx.save();
  if (!this.enabled) {
    ctx.globalAlpha = 0.5;  // Dim the hose bib
  }
  ctx.drawImage(this._image,
                this._imageOrigin.x, this._imageOrigin.y,
                this._imageSize.x, this._imageSize.y);
  ctx.restore();
}
