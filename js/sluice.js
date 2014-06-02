/* Copyright 2014 (c) SoFIE Studios.  All rights reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview  The Sluice class. The Sluice object implements the sluice which is a
 * static element in the physics engine, but can be moved via the mouse. The sluice is
 * hinged at one end and has three gaps: the fry-pan gap, the egg-carton gap and the nest
 * gap.
 */

/**
 * Constructor for the Sluice.
 * @constructor
 * @extends {GamePiece}
 */
Sluice = function() {
  GamePiece.call(this);
}
Sluice.prototype = new GamePiece();
Sluice.prototype.constructor = Sluice;

/**
 * Return the body def for the sluice.
 * @override
 */
Sluice.prototype.getBodyDef = function() {
  var sluiceBodyDef = new Box2D.Dynamics.b2BodyDef();
  sluiceBodyDef.type = Box2D.Dynamics.b2Body.b2_kinematicBody;
  return sluiceBodyDef;
}

/**
 * Build up the sluice as four separate fixtures to account for the gaps.
 * @override
 */
Sluice.prototype.addFixturesToBody = function(simulation, body) {
  var sluiceFixture = new Box2D.Dynamics.b2FixtureDef();
  sluiceFixture.density = ChickenAndEgg.Box2DConsts.DOUG_FIR_DENSITY;
  sluiceFixture.friction = ChickenAndEgg.Box2DConsts.DOUG_FIR_FRICTION;
  sluiceFixture.restitution = ChickenAndEgg.Box2DConsts.DOUG_FIR_RESTITUTION;
  sluiceFixture.shape = new Box2D.Collision.Shapes.b2PolygonShape();

  var sluiceVerts = new Array();
  sluiceVerts.push(new Box2D.Common.Math.b2Vec2(0.60 + 0.80, 1.60));
  sluiceVerts.push(new Box2D.Common.Math.b2Vec2(0.60 + 0.80 + 0.20, 1.60));
  sluiceVerts.push(new Box2D.Common.Math.b2Vec2(0.60 + 0.80 + 0.20, 1.60 + 0.03));
  sluiceVerts.push(new Box2D.Common.Math.b2Vec2(0.60 + 0.80, 1.60 + 0.03));
  sluiceFixture.shape.SetAsArray(sluiceVerts);
  body.CreateFixture(sluiceFixture);

  sluiceVerts = new Array();
  sluiceVerts.push(new Box2D.Common.Math.b2Vec2(0.60 + 1.15, 1.60));
  sluiceVerts.push(new Box2D.Common.Math.b2Vec2(0.60 + 1.15 + 0.60, 1.60));
  sluiceVerts.push(new Box2D.Common.Math.b2Vec2(0.60 + 1.15 + 0.60, 1.60 + 0.03));
  sluiceVerts.push(new Box2D.Common.Math.b2Vec2(0.60 + 1.15, 1.60 + 0.03));
  sluiceFixture.shape.SetAsArray(sluiceVerts);
  body.CreateFixture(sluiceFixture);

  sluiceVerts = new Array();
  sluiceVerts.push(new Box2D.Common.Math.b2Vec2(0.60 + 1.90, 1.60));
  sluiceVerts.push(new Box2D.Common.Math.b2Vec2(0.60 + 1.90 + 0.60, 1.60));
  sluiceVerts.push(new Box2D.Common.Math.b2Vec2(0.60 + 1.90 + 0.60, 1.60 + 0.03));
  sluiceVerts.push(new Box2D.Common.Math.b2Vec2(0.60 + 1.90, 1.60 + 0.03));
  sluiceFixture.shape.SetAsArray(sluiceVerts);
  body.CreateFixture(sluiceFixture);

  sluiceVerts = new Array();
  sluiceVerts.push(new Box2D.Common.Math.b2Vec2(0.60 + 2.65, 1.60));
  sluiceVerts.push(new Box2D.Common.Math.b2Vec2(0.60 + 2.65 + 0.50, 1.60));
  sluiceVerts.push(new Box2D.Common.Math.b2Vec2(0.60 + 2.65 + 0.50, 1.60 + 0.03));
  sluiceVerts.push(new Box2D.Common.Math.b2Vec2(0.60 + 2.65, 1.60 + 0.03));
  sluiceFixture.shape.SetAsArray(sluiceVerts);
  body.CreateFixture(sluiceFixture);
}

Sluice.prototype.getView = function(simulation) {
  return new PolyView(simulation.scale());
}
