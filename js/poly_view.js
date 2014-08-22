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
PolyView = function() {
  BodyView.call(this);
}
PolyView.prototype = new BodyView();
PolyView.prototype.constructor = PolyView;

/**
 * The draw function.
 * @override
 */
PolyView.prototype.draw = function(ctx, body) {
  var transform = body.GetTransform();
  for (var fixture = body.GetFixtureList(); fixture != null; fixture = fixture.m_next) {
    var poly = fixture.GetShape();
    var vertexCount = parseInt(poly.GetVertexCount());
    var vertices = poly.GetVertices();
    ctx.save();
    ctx.fillStyle = '#873B11';

    ctx.beginPath();
    var vertex0 = Box2D.Common.Math.b2Math.MulX(transform, vertices[0]);
    ctx.moveTo(vertex0.x, vertex0.y);
    for (var i = 1; i < vertexCount; i++) {
      var vertex = Box2D.Common.Math.b2Math.MulX(transform, vertices[i]);
      ctx.lineTo(vertex.x, vertex.y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.restore();
  }
}
