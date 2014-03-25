/* Copyright 2014 (c) SoFIE Studios.  All rights reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview  The PolyView object. Draws a box using the polygon from the first
 * fixture in the list attached to the associated body.
 * Requires: Box2d, BodyView.
 */

/**
 * Constructor for the PolyView class.
 * @inherit BodyView
 * @constructor
 */
PolyView = function(opt_scale) {
  BodyView.call(this, opt_scale);
}
PolyView.prototype = new BodyView();
PolyView.prototype.constructor = PolyView;

/**
 * The draw function.
 * @override
 */
PolyView.prototype.draw = function(ctx, body) {
  var transform = body.GetTransform();
  var scale = this.scale();
  for (var fixture = body.GetFixtureList(); fixture != null; fixture = fixture.m_next) {
    var poly = fixture.GetShape();
    var vertexCount = parseInt(poly.GetVertexCount());
    var vertices = poly.GetVertices();
    ctx.save();
    ctx.fillStyle = 'red';

    ctx.beginPath();
    var vertex0 = Box2D.Common.Math.b2Math.MulX(transform, vertices[0]);
    ctx.moveTo(vertex0.x * scale, vertex0.y * scale);
    for (var i = 1; i < vertexCount; i++) {
      var vertex = Box2D.Common.Math.b2Math.MulX(transform, vertices[i]);
      ctx.lineTo(vertex.x * scale, vertex.y * scale);
    }
    ctx.lineTo(vertex0.x * scale, vertex0.y * scale);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }
}
