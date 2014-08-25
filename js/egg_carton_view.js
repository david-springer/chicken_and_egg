/* Copyright 2014 (c) SoFIE Studios.  All rights reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview  The EggCartonView object. Draws the egg carton showing the number of
 * eggs in the carton.
 * Requires: Box2d, BodyView.
 */

/**
 * Constructor for the EggCartonView class.
 * @inherit BodyView
 * @constructor
 */
EggCartonView = function() {
  BodyView.call(this);
  /**
   * The images used for the whole chicken view.
   * @type {ImageView}
   * @private
   */
  this._eggCartonImage = new ImageView();
  this._eggsImages = new Array();
  /**
   * The number of eggs to draw.
   * @type {number}
   * @public
   */
  this.eggCount = 0;
}
EggCartonView.prototype = new BodyView();
EggCartonView.prototype.constructor = EggCartonView;

EggCartonView.prototype.init = function() {
  this._eggCartonImage.loadImage("./img/eggcarton.png");
  var origin = this._eggCartonImage.getWorldOrigin();
  var width  = this._eggCartonImage.getWorldSize().x;
  for (var i = 1; i <= 12; ++i) {
    var eggsFileName = i + "eggs.png";
    var eggsImage = new ImageView();
    eggsImage.setOrigin(origin);
    eggsImage.setWidth(width);
    eggsImage.loadImage("./img/" + eggsFileName);
    this._eggsImages[i-1] = eggsImage;
  }
}

EggCartonView.prototype.setOrigin = function(origin) {
  this._eggCartonImage.setOrigin(origin);
  for (var i = 0; i < this._eggsImages.length; ++i) {
    this._eggsImages[i].setOrigin(origin);
  }
}

EggCartonView.prototype.setWidth = function(width) {
  this._eggCartonImage.setWidth(width);
  for (var i = 0; i < this._eggsImages.length; ++i) {
    this._eggsImages[i].setWidth(width);
  }
}

EggCartonView.prototype.canDraw = function() {
  return this._eggCartonImage.canDraw();
}

EggCartonView.prototype.draw = function(ctx, body) {
  this._eggCartonImage.draw(ctx, body);
  if (this.eggCount > 0) {
    this._eggsImages[this.eggCount-1].draw(ctx, body);
  }
}

