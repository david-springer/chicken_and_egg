/* Copyright 2014 (c) SoFIE Studios.  All rights reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview  The Sluice class. The Sluice object implements the sluice which is a
 * series of stacked an offset teeter-totters. Each teeter-totter has a hinge with a
 * return spring on it, the egg can roll from one level in the sluice to another. Each
 * level in the sluice also has an exit path, so that the egg can fall into another game
 * object, such as the fry pan or the nest.
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
Sluice.SLUICE_ORIGIN = new Box2D.Common.Math.b2Vec2(1.98, 1.50 - 0.015);

/**
 * Draw the sluice.
 * @override
 */
Sluice.prototype.draw = function(ctx, simulation) {
  var drawSluicePart = function(ctx, b) {
    if (b.IsActive()) {
      b.GetUserData().draw(ctx, b);
    }
  }
  drawSluicePart(ctx, this._level1);
}

/**
 * Test whether a fixture is the sluice handle.
 * @param {Box2D.Dynamics.b2Fixture} fixture The fixture to test.
 * @return {boolean} Whether the fixture is the sluice handle or not.
 */
Sluice.prototype.isSluiceHandle = function(fixture) {
  // TODO(daves): turn this back on when appropriate.
  return false;
//  var fixtureUserData = fixture.GetUserData();
//  return fixtureUserData && fixtureUserData === Sluice._SLUICE_HANDLE_CONTEXT;
}


/**
 * Method to add the coop door pieces to the Box2D world. Customise this method to create
 * three Box2D bodies that represent the coop door: the coop wall (static), the coop door
 * (dynamic, the swinging part) and the coop hinge.
 * @override
 */
Sluice.prototype.addToSimulation = function(simulation) {
  // Create the static coop wall.
  var fixtureDef = new Box2D.Dynamics.b2FixtureDef();
  fixtureDef.density = ChickenAndEgg.Box2DConsts.DOUG_FIR_DENSITY;
  fixtureDef.friction = ChickenAndEgg.Box2DConsts.DOUG_FIR_FRICTION;
  fixtureDef.restitution = ChickenAndEgg.Box2DConsts.DOUG_FIR_RESTITUTION;
  fixtureDef.shape = new Box2D.Collision.Shapes.b2PolygonShape();

  var bodyDef = new Box2D.Dynamics.b2BodyDef();
  bodyDef.position.Set(Sluice.SLUICE_ORIGIN.x, Sluice.SLUICE_ORIGIN.y);
  bodyDef.type = Box2D.Dynamics.b2Body.b2_staticBody;

  // Create the hinge. This is not drawn - it's here to implement the rotational hinge
  // with a return spring.
  var vertices = new Array()
  vertices.push(new Box2D.Common.Math.b2Vec2(-0.30 - 0.015, 0));
  vertices.push(new Box2D.Common.Math.b2Vec2(-0.30 - 0.015, -0.03));
  vertices.push(new Box2D.Common.Math.b2Vec2(-0.30 + 0.015, -0.03));
  vertices.push(new Box2D.Common.Math.b2Vec2(-0.30 + 0.015, 0));
  fixtureDef.shape.SetAsArray(vertices);
  var hingePin1 = simulation.world().CreateBody(bodyDef);
  hingePin1.CreateFixture(fixtureDef);

  // Create the dynamic part of level 1 of the sluice.
  bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
  this._level1 = simulation.world().CreateBody(bodyDef);
  this._level1.SetUserData(new PolyView());
  // The left arm of the bar.
  var sluiceVerts = new Array();
  sluiceVerts.push(new Box2D.Common.Math.b2Vec2(-0.90 + 0.03, 0));
  sluiceVerts.push(new Box2D.Common.Math.b2Vec2(-0.90, -0.015));
  sluiceVerts.push(new Box2D.Common.Math.b2Vec2(-0.90, -0.03));
  sluiceVerts.push(new Box2D.Common.Math.b2Vec2(-0.10, -0.03));
  sluiceVerts.push(new Box2D.Common.Math.b2Vec2(-0.10, -0.015));
  sluiceVerts.push(new Box2D.Common.Math.b2Vec2(-0.10 - 0.03, 0));
  fixtureDef.shape.SetAsArray(sluiceVerts);
  this._level1.CreateFixture(fixtureDef);
  // The right arm of the bar.
  sluiceVerts = new Array();
  sluiceVerts.push(new Box2D.Common.Math.b2Vec2(0.05 + 0.03, 0));
  sluiceVerts.push(new Box2D.Common.Math.b2Vec2(0.05, -0.015));
  sluiceVerts.push(new Box2D.Common.Math.b2Vec2(0.05, -0.03));
  sluiceVerts.push(new Box2D.Common.Math.b2Vec2(0.30, -0.03));
  sluiceVerts.push(new Box2D.Common.Math.b2Vec2(0.30, 0));
  fixtureDef.shape.SetAsArray(sluiceVerts);
  this._level1.CreateFixture(fixtureDef);
  // The right stopping block.
  sluiceVerts = new Array();
  sluiceVerts.push(new Box2D.Common.Math.b2Vec2(0.30, 0.06));
  sluiceVerts.push(new Box2D.Common.Math.b2Vec2(0.30 - 0.06, 0));
  sluiceVerts.push(new Box2D.Common.Math.b2Vec2(0.30, 0));
  fixtureDef.shape.SetAsArray(sluiceVerts);
  this._level1.CreateFixture(fixtureDef);
  // The centre wedge.
  sluiceVerts = new Array();
  sluiceVerts.push(new Box2D.Common.Math.b2Vec2(-0.30 + 0.09, 0));
  sluiceVerts.push(new Box2D.Common.Math.b2Vec2(-0.30, 0.06));
  sluiceVerts.push(new Box2D.Common.Math.b2Vec2(-0.30 - 0.09, 0));
  fixtureDef.shape.SetAsArray(sluiceVerts);
  this._level1.CreateFixture(fixtureDef);

  // Create the joint that represents the hinge.
  var jointDef = new Box2D.Dynamics.Joints.b2RevoluteJointDef();
  var centerOfMass = this._level1.GetWorldCenter();
  jointDef.Initialize(hingePin1, this._level1, new Box2D.Common.Math.b2Vec2(
      centerOfMass.x, Sluice.SLUICE_ORIGIN.y + 0.06));
  jointDef.collideConnected = false;
  jointDef.lowerAngle = -Math.PI / 4;
  jointDef.upperAngle = Math.PI / 4;
  jointDef.enableLimit = true;
  this._level1Hinge = simulation.world().CreateJoint(jointDef);
}

/**
 * Build up the sluice as four separate fixtures to account for the gaps.
 * @override
 */
Sluice.prototype.addFixturesToBody = function(simulation, body) {
/*
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
  */
}

/**
 * Apply Hooke's law dampening to the sluice level hinges.
 * @override
 */
Sluice.prototype.processGameTick = function(gameTimeNow, gameTimeDelta) {
  var hingeAngle = this._level1Hinge.GetJointAngle();
  var hingeVel = this._level1Hinge.GetJointSpeed();
  if (Math.abs(hingeAngle) > 0.0001) {
    this._level1.ApplyTorque(-hingeAngle * 0.05 - hingeVel * 0.02);
  }
}
