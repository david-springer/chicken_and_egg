/* Copyright 2014 (c) SoFIE Studios.  All rights reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview  The FryPanView object. Draws the fry pan showing the number of
 * eggs in the pan, and modifies the opacity of the eggs as they fry.
 * Requires: Box2d, BodyView.
 */

/**
 * Constructor for the FryPanView class.
 * @inherit BodyView
 * @constructor
 */
FryPanView = function() {
  BodyView.call(this);
  /**
   * The images used for the whole chicken view.
   * @type {ImageView}
   * @private
   */
  this._fryPanImage = new ImageView();
  this._eggsImages = new Array();
  /**
   * The number of eggs to draw.
   * @type {number}
   * @public
   */
  this.eggCount = 0;
}
FryPanView.prototype = new BodyView();
FryPanView.prototype.constructor = FryPanView;

FryPanView.prototype.init = function() {
  this._fryPanImage.loadImage("./img/frypan.png");
  var origin = this._fryPanImage.getWorldOrigin();
  var width  = this._fryPanImage.getWorldSize().x;
  for (var i = 1; i <= 2; ++i) {
    var eggsFileName = i + "fried_eggs.png";
    var eggsImage = new ImageView();
    eggsImage.setOrigin(origin);
    eggsImage.setWidth(width);
    eggsImage.loadImage("./img/" + eggsFileName);
    this._eggsImages[i-1] = eggsImage;
  }
}

FryPanView.prototype.setOrigin = function(origin) {
  this._fryPanImage.setOrigin(origin);
  for (var i = 0; i < this._eggsImages.length; ++i) {
    this._eggsImages[i].setOrigin(origin);
  }
}

FryPanView.prototype.setWidth = function(width) {
  this._fryPanImage.setWidth(width);
  for (var i = 0; i < this._eggsImages.length; ++i) {
    this._eggsImages[i].setWidth(width);
  }
}

FryPanView.prototype.canDraw = function() {
  return this._fryPanImage.canDraw();
}

FryPanView.prototype.draw = function(ctx, body) {
  this._fryPanImage.draw(ctx, body);
  if (this.eggCount > 0) {
    this._eggsImages[this.eggCount-1].draw(ctx, body);
  }
}

