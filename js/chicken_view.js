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

/**
 * The number of columns used to display the remaining egg count.
 */
ChickenView._COLUMN_COUNT = 8;

ChickenView.prototype.init = function() {
  this._chickenImage.loadImage("./img/chicken.png");
  this._eggImage.loadImage("./img/egg.png");
}

ChickenView.prototype.setOrigin = function(origin) {
  this._chickenImage.setOrigin(origin);
}

ChickenView.prototype.setWidth = function(width) {
  this._chickenImage.setWidth(width);
  this._eggImage.setWidth(width / ChickenView._COLUMN_COUNT);
}

ChickenView.prototype.canDraw = function() {
  return this._chickenImage.canDraw() && this._eggImage.canDraw();
}

ChickenView.prototype.draw = function(ctx, body) {
  this._chickenImage.draw(ctx, body);
  var eggSize = this._eggImage.getWorldSize();
  var eggOrigin = this._chickenImage.getWorldOrigin();
  eggOrigin.y -= eggSize.y * 1.5;
  var eggMinX = eggOrigin.x;
  var column = 0;
  for (var e = 0; e < this.eggCount; ++e) {
    this._eggImage.setOrigin(eggOrigin);
    this._eggImage.draw(ctx, body);
    eggOrigin.x += eggSize.x;
    column++;
    if (column == ChickenView._COLUMN_COUNT) {
      eggOrigin.x = eggMinX;
      eggOrigin.y -= eggSize.y;
      column = 0;
    }
  }
}
