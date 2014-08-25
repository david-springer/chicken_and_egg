/* Copyright 2014 (c) SoFIE Studios.  All rights reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview  The ChickenView object. Draws the chicken in various states, and
 * displays the remaining egg count.
 * Requires: Box2d, BodyView.
 */

/**
 * Constructor for the ChickenView class.
 * @inherit BodyView
 * @constructor
 */
ChickenView = function() {
  BodyView.call(this);
  /**
   * The images used for the whole chicken view.
   * @type {ImageView}
   * @private
   */
  this._chickenImage = new ImageView();
  this._eggImage = new ImageView();
  /**
   * The number of eggs to draw.
   * @type {number}
   * @public
   */
  this.eggCount = 0;
}
ChickenView.prototype = new ImageView();
ChickenView.prototype.constructor = ChickenView;

ChickenView.prototype.init = function() {
  this._chickenImage.loadImage("./img/chicken.png");
  this._eggImage.loadImage("./img/egg.png");
  // TODO(daves): Load egg image.
}

ChickenView.prototype.setOrigin = function(origin) {
  this._chickenImage.setOrigin(origin);
  this._eggImage.setOrigin(origin);
}

ChickenView.prototype.setWidth = function(width) {
  this._chickenImage.setWidth(width);
  this._eggImage.setWidth(width / 8.0);
}

ChickenView.prototype.canDraw = function() {
  return this._chickenImage.canDraw() && this._eggImage.canDraw();
}

ChickenView.prototype.draw = function(ctx, body) {
  this._chickenImage.draw(ctx, body);
  // TODO(daves): Draw the remaining eggs.
  this._eggImage.draw(ctx, body);
}
