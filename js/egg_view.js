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

/**
 * Create the vertices of a polygon that describes an egg.
 * A common hen's egg is 5.7cm tall and 4.45cm in diameter at its widest point, on
 * average (ref: http://www.animalplanet.com/animal-facts/egg-info.htm).
 * @param {Number} opt_ovality The "ovalness" of the egg. This parameter is pretty
 *     narrow in range. 0.17 to 0.2 are good values.
 * @return {Array} the egg vertices.
 */
EggView.prototype.eggVertices = function(opt_ovality) {
  var ovality = opt_ovality || 0.2;
  var eggVertices = new Array();

  var step = Math.PI / 12;
  var ctr = new Box2D.Common.Math.b2Vec2(0, 0);
  var radius = new Box2D.Common.Math.b2Vec2(.0445, .057);
  for (var theta = 0; theta < 2 * Math.PI; theta += step) {
    var sinTheta = Math.sin(theta);
    // Scale the x-value by a function of y. I picked e^(0.2y) as the scaling
    // function. This scale is applied before scaling by the radius, so that y
    // is in range [-1..1]. Larger values of |y| produce really crazy results.
    var x = Math.exp(ovality * sinTheta) * radius.x * Math.cos(theta);
    var y = radius.y * sinTheta;
    eggVertices.push(new Box2D.Common.Math.b2Vec2(ctr.x + x, ctr.y + y));
  }
  return eggVertices;
}

