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
 * The sluice handle context. This value is used to determine if a fixture is the sluice
 * handle.
 * @type {string}
 * @private
 */
Sluice._SLUICE_HANDLE_CONTEXT = "sluiceHandleContext";

/**
 * The origin in world coordinates of the sluice.
 * @type {Box2D.Common.Math.b2Vec2}
 */
Sluice.SLUICE_ORIGIN = new Box2D.Common.Math.b2Vec2(0.60 + 0.90, 1.55 + 0.015);

/**
 * Test whether a fixture is the sluice handle.
 * @param {Box2D.Dynamics.b2Fixture} fixture The fixture to test.
 * @return {boolean} Whether the fixture is the sluice handle or not.
 */
Sluice.prototype.isSluiceHandle = function(fixture) {
  var fixtureUserData = fixture.GetUserData();
  return fixtureUserData && fixtureUserData === Sluice._SLUICE_HANDLE_CONTEXT;
}

/**
 * Return the body def for the sluice.
 * @override
 */
Sluice.prototype.getBodyDef = function() {
  var sluiceBodyDef = new Box2D.Dynamics.b2BodyDef();
  sluiceBodyDef.type = Box2D.Dynamics.b2Body.b2_kinematicBody;
  sluiceBodyDef.position.Set(Sluice.SLUICE_ORIGIN.x, Sluice.SLUICE_ORIGIN.y);
  return sluiceBodyDef;
}

/**
 * Build up the sluice as four separate fixtures to account for the gaps.
 * @override
 */
Sluice.prototype.addFixturesToBody = function(simulation, body) {
  var sluiceFixtureDef = new Box2D.Dynamics.b2FixtureDef();
  sluiceFixtureDef.density = ChickenAndEgg.Box2DConsts.DOUG_FIR_DENSITY;
  sluiceFixtureDef.friction = ChickenAndEgg.Box2DConsts.DOUG_FIR_FRICTION;
  sluiceFixtureDef.restitution = ChickenAndEgg.Box2DConsts.DOUG_FIR_RESTITUTION;
  sluiceFixtureDef.shape = new Box2D.Collision.Shapes.b2PolygonShape();

  var sluiceVerts = new Array();
  sluiceVerts.push(new Box2D.Common.Math.b2Vec2(0, -0.015));
  sluiceVerts.push(new Box2D.Common.Math.b2Vec2(0.35, -0.015));
  sluiceVerts.push(new Box2D.Common.Math.b2Vec2(0.35, 0.015));
  sluiceVerts.push(new Box2D.Common.Math.b2Vec2(0, 0.015));
  sluiceFixtureDef.shape.SetAsArray(sluiceVerts);
  body.CreateFixture(sluiceFixtureDef);
  sluiceVerts = new Array();
  sluiceVerts.push(new Box2D.Common.Math.b2Vec2(0.29, 0.015));
  sluiceVerts.push(new Box2D.Common.Math.b2Vec2(0.35, 0.015));
  sluiceVerts.push(new Box2D.Common.Math.b2Vec2(0.35, 0.045));
  sluiceFixtureDef.shape.SetAsArray(sluiceVerts);
  body.CreateFixture(sluiceFixtureDef);

  sluiceVerts = new Array();
  sluiceVerts.push(new Box2D.Common.Math.b2Vec2(0.50, -0.015));
  sluiceVerts.push(new Box2D.Common.Math.b2Vec2(0.50 + 0.60, -0.015));
  sluiceVerts.push(new Box2D.Common.Math.b2Vec2(0.50 + 0.60, 0.015));
  sluiceVerts.push(new Box2D.Common.Math.b2Vec2(0.50, 0.015));
  sluiceFixtureDef.shape.SetAsArray(sluiceVerts);
  body.CreateFixture(sluiceFixtureDef);
  sluiceVerts = new Array();
  sluiceVerts.push(new Box2D.Common.Math.b2Vec2(0.50 + 0.54, 0.015));
  sluiceVerts.push(new Box2D.Common.Math.b2Vec2(0.50 + 0.60, 0.015));
  sluiceVerts.push(new Box2D.Common.Math.b2Vec2(0.50 + 0.60, 0.045));
  sluiceFixtureDef.shape.SetAsArray(sluiceVerts);
  body.CreateFixture(sluiceFixtureDef);

  sluiceVerts = new Array();
  sluiceVerts.push(new Box2D.Common.Math.b2Vec2(1.25, -0.015));
  sluiceVerts.push(new Box2D.Common.Math.b2Vec2(1.25 + 0.60, -0.015));
  sluiceVerts.push(new Box2D.Common.Math.b2Vec2(1.25 + 0.60, 0.015));
  sluiceVerts.push(new Box2D.Common.Math.b2Vec2(1.25, 0.015));
  sluiceFixtureDef.shape.SetAsArray(sluiceVerts);
  body.CreateFixture(sluiceFixtureDef);
  sluiceVerts = new Array();
  sluiceVerts.push(new Box2D.Common.Math.b2Vec2(1.25 + 0.54, 0.015));
  sluiceVerts.push(new Box2D.Common.Math.b2Vec2(1.25 + 0.60, 0.015));
  sluiceVerts.push(new Box2D.Common.Math.b2Vec2(1.25 + 0.60, 0.045));
  sluiceFixtureDef.shape.SetAsArray(sluiceVerts);
  body.CreateFixture(sluiceFixtureDef);

  sluiceVerts = new Array();
  sluiceVerts.push(new Box2D.Common.Math.b2Vec2(2.0, -0.015));
  sluiceVerts.push(new Box2D.Common.Math.b2Vec2(2.0 + 0.30, -0.015));
  sluiceVerts.push(new Box2D.Common.Math.b2Vec2(2.0 + 0.30, 0.015));
  sluiceVerts.push(new Box2D.Common.Math.b2Vec2(2.0, 0.015));
  sluiceFixtureDef.shape.SetAsArray(sluiceVerts);
  body.CreateFixture(sluiceFixtureDef);

  // Add the handle at the end of the sluice. This is implemented as a separate fixture
  // to support AABB hit detection.
  sluiceVerts = new Array();
  sluiceVerts.push(new Box2D.Common.Math.b2Vec2(2.30, -0.03));
  sluiceVerts.push(new Box2D.Common.Math.b2Vec2(2.30 + 0.06, -0.03));
  sluiceVerts.push(new Box2D.Common.Math.b2Vec2(2.30 + 0.06, 0.03));
  sluiceVerts.push(new Box2D.Common.Math.b2Vec2(2.30, 0.03));
  sluiceFixtureDef.shape.SetAsArray(sluiceVerts);
  var sluiceFixture = body.CreateFixture(sluiceFixtureDef);
  sluiceFixture.SetUserData(Sluice._SLUICE_HANDLE_CONTEXT);
}

Sluice.prototype.loadView = function(simulation) {
  this.view = new PolyView();
}
