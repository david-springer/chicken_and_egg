/* Copyright 2014 (c) SoFIE Studios.  All rights reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview  The Roost class. The Perch object implements the static element where
 * the hen roosts. The back-end of the roost is angled to allow the egg to roll out the
 * coop door and onto the sluice.
 */

/**
 * Constructor for the Roost.
 * @constructor
 * @extends {GamePiece}
 */
Roost = function() {
  GamePiece.call(this);
}
Roost.prototype = new GamePiece();
Roost.prototype.constructor = Roost;

/**
 * The origin in world coordinates of the roost assembly.
 * @type {Box2D.Common.Math.b2Vec2}
 */
Roost.ROOST_ORIGIN = new Box2D.Common.Math.b2Vec2(0.60, 2.0);

/**
 * Return the body def for the roost.
 * @override
 */
Roost.prototype.getBodyDef = function() {
  var roostBodyDef = new Box2D.Dynamics.b2BodyDef();
  roostBodyDef.type = Box2D.Dynamics.b2Body.b2_staticBody;
  roostBodyDef.position.Set(Roost.ROOST_ORIGIN.x, Roost.ROOST_ORIGIN.y);
  return roostBodyDef;
}

/**
 * Build up the ground fixtures. There are two: the flat ground plane, and a wedge.
 * @override
 */
Roost.prototype.addFixturesToBody = function(simulation, body) {
  // Set up the roost and the chute as two fixtures, one for the platform and one for
  // the ramp.
  var roostChuteFixture = new Box2D.Dynamics.b2FixtureDef();
  roostChuteFixture.density = ChickenAndEgg.Box2DConsts.DOUG_FIR_DENSITY;
  roostChuteFixture.friction = ChickenAndEgg.Box2DConsts.DOUG_FIR_FRICTION;
  roostChuteFixture.restitution = ChickenAndEgg.Box2DConsts.DOUG_FIR_RESTITUTION;
  roostChuteFixture.shape = new Box2D.Collision.Shapes.b2PolygonShape();

  // The platform.
  var roostChuteVerts = new Array();
  roostChuteVerts.push(new Box2D.Common.Math.b2Vec2(0, 0.03));
  roostChuteVerts.push(new Box2D.Common.Math.b2Vec2(0, 0));
  roostChuteVerts.push(new Box2D.Common.Math.b2Vec2(0.50, 0));
  roostChuteVerts.push(new Box2D.Common.Math.b2Vec2(0.50, 0.03));
  roostChuteFixture.shape.SetAsArray(roostChuteVerts);
  body.CreateFixture(roostChuteFixture);

  // The ramp.
  roostChuteVerts = new Array()
  roostChuteVerts.push(new Box2D.Common.Math.b2Vec2(0.50, 0.015));
  roostChuteVerts.push(new Box2D.Common.Math.b2Vec2(0.50, -0.015));
  roostChuteVerts.push(new Box2D.Common.Math.b2Vec2(0.50 + 0.40, -0.25 - 0.015));
  roostChuteVerts.push(new Box2D.Common.Math.b2Vec2(0.50 + 0.40, -0.25 + 0.015));
  roostChuteFixture.shape.SetAsArray(roostChuteVerts);
  body.CreateFixture(roostChuteFixture);
}

Roost.prototype.loadView = function(simulation) {
  this.view = new PolyView();
}

