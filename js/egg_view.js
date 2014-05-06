/* Copyright 2014 (c) SoFIE Studios.  All rights reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview  The EggView object. Draws an egg shape. Provides a method for computing
 * the vertices that describe a standard egg.
 * Requires: Box2d, BodyView.
 */

/**
 * Constructor for the EggView class.
 * @inherit BodyView
 * @constructor
 */
EggView = function(opt_scale) {
  BodyView.call(this, opt_scale);
}
EggView.prototype = new BodyView();
EggView.prototype.constructor = EggView;

/**
 * The draw function.
 * @override
 */
EggView.prototype.draw = function(ctx, body) {
  // Draw the polygon of the first fixture.
  // TODO(daves): Replace this with a sprite for the egg.
  var transform = body.GetTransform();
  var scale = this.scale();
  var egg = body.GetFixtureList().GetShape();
  var vertexCount = parseInt(egg.GetVertexCount());
  var vertices = egg.GetVertices();
  ctx.save();
  ctx.fillStyle = 'cyan';

  ctx.beginPath();
  var vertex0 = Box2D.Common.Math.b2Math.MulX(transform, vertices[0]);
  ctx.moveTo(vertex0.x * scale, vertex0.y * scale);
  var vertex;
  for (var i = 1; i < vertexCount; i++) {
    vertex = Box2D.Common.Math.b2Math.MulX(transform, vertices[i]);
    ctx.lineTo(vertex.x * scale, vertex.y * scale);
  }
  ctx.lineTo(vertex0.x * scale, vertex0.y * scale);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}
