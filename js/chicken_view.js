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
  ImageView.call(this);
}
ChickenView.prototype = new ImageView();
ChickenView.prototype.constructor = ChickenView;

