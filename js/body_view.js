/* Copyright 2014 (c) SoFIE Studios.  All rights reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview  The BodyView class. The BodyView holds some general drawing state,
 * such as the scale factor from the Box2D coordinate system to pixels. It also has a
 * draw() method that subclasses must override to draw the body. The draw() function is
 * passed a context and a Box2D body, which is used to query things like position, angle
 * and so on.
 */

/**
 * Constructor for the BodyView.
 * @parameter {Number} opt_scale The scale factor from Box2D units to pixels. Default
 *     value is 30 (a magic number widely recommended by the Internet).
 * @constructor
 */
BodyView = function(opt_scale) {
  /**
   * Scale factor from Box2D units to pixels.
   * @type {Number}
   * @private
   */
  this._scale = parseFloat(opt_scale) || 30.0;
}
BodyView.prototype.constructor = BodyView;

/**
 * Accessors and mutators.
 */
BodyView.prototype.scale = function() {
  return this._scale;
}

/**
 * Draw the body. Abstract method. Default does nothing.
 * @param {Object} ctx The 2D drawing contest, normally the one attached to a <CANVAS>
 *     element.
 * @param {Object} body The Box2D body used to query position, angle, etc. |body| must
 *     respond to:
 *       b2Vec2 GetPosition()
 *       float GetAngle()
 *       b2Vec2 GetWorldCenter()
 */
BodyView.prototype.draw = function(ctx, body) {}
