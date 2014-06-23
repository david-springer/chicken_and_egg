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
Sluice.SLUICE_ORIGIN = new Box2D.Common.Math.b2Vec2(1.705, 1.40 - 0.015);

/**
 * The origins in local coordinates of the sluice levels.
 * @type {Array.Box2D.Common.Math.b2Vec2}
 * @private
 */
Sluice._LEVEL_ORIGINS = [
  new Box2D.Common.Math.b2Vec2(0, 0),
  new Box2D.Common.Math.b2Vec2(-0.65, -0.30),
  new Box2D.Common.Math.b2Vec2(0.65, -0.30)
];

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
  /*
  drawSluicePart(ctx, this._hingeTrack1);
  drawSluicePart(ctx, this._hingeTrack2);
  drawSluicePart(ctx, this._hingeTrack3);
  */
  drawSluicePart(ctx, this._level1);
  drawSluicePart(ctx, this._level2);
  drawSluicePart(ctx, this._level3);
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
  var sluiceFixtureDef = new Box2D.Dynamics.b2FixtureDef();
  sluiceFixtureDef.density = ChickenAndEgg.Box2DConsts.DOUG_FIR_DENSITY;
  sluiceFixtureDef.friction = ChickenAndEgg.Box2DConsts.DOUG_FIR_FRICTION;
  sluiceFixtureDef.restitution = ChickenAndEgg.Box2DConsts.DOUG_FIR_RESTITUTION;
  sluiceFixtureDef.shape = new Box2D.Collision.Shapes.b2PolygonShape();

  var sluiceBodyDef = new Box2D.Dynamics.b2BodyDef();
  sluiceBodyDef.position.Set(Sluice.SLUICE_ORIGIN.x, Sluice.SLUICE_ORIGIN.y);
  sluiceBodyDef.type = Box2D.Dynamics.b2Body.b2_staticBody;

  /**
   * Create the hinge track geometry. The hinge track is a slide for the hinge pin that
   * lets you move the sluice level side-to-side.
   * @param {number} pinOriginX The x-coordinate of the hinge origin, relative to the
   *    centre of the sluice body.
   * @param {number} pinOriginY The y-coordinate of the hinge origin, relative to the
   *    centre of the sluice body.
   * @param {Object} bodyDef The Box2D BodyDef of the hinge body.
   * @param {Object} fixtureDef The Box2D FixtureDef to use for the hinge geometry.
   * @return {Object} The Box2D Body representing the hinge geometry.
   */
  var hingeTrackAt = function(pinOriginX, pinOriginY, bodyDef, fixtureDef) {
    var vertices = new Array()
    vertices.push(new Box2D.Common.Math.b2Vec2(pinOriginX - 0.09, pinOriginY));
    vertices.push(new Box2D.Common.Math.b2Vec2(pinOriginX - 0.09, pinOriginY - 0.03));
    vertices.push(new Box2D.Common.Math.b2Vec2(pinOriginX + 0.09, pinOriginY - 0.03));
    vertices.push(new Box2D.Common.Math.b2Vec2(pinOriginX + 0.09, pinOriginY));
    fixtureDef.shape.SetAsArray(vertices);
    var hingeTrack = simulation.world().CreateBody(bodyDef);
    hingeTrack.SetUserData(new PolyView());
    hingeTrack.CreateFixture(fixtureDef);
    return hingeTrack;
  };

  /**
   * Create hinge geometry. This is not drawn - it's here to implement the rotational
   * hinge with a return spring.
   * @param {Box2D.Common.Math.b2Vec2} pinOrigin The hinge origin, relative to the
   *    centre of the sluice body.
   * @param {Object} bodyDef The Box2D BodyDef of the hinge body.
   * @param {Object} fixtureDef The Box2D FixtureDef to use for the hinge geometry.
   * @return {Object} The Box2D Body representing the hinge geometry.
   */
  var hingePinAt = function(pinOrigin, bodyDef, fixtureDef) {
    var vertices = new Array()
    vertices.push(new Box2D.Common.Math.b2Vec2(pinOrigin.x - 0.015, pinOrigin.y));
    vertices.push(new Box2D.Common.Math.b2Vec2(pinOrigin.x - 0.015, pinOrigin.y - 0.03));
    vertices.push(new Box2D.Common.Math.b2Vec2(pinOrigin.x + 0.015, pinOrigin.y - 0.03));
    vertices.push(new Box2D.Common.Math.b2Vec2(pinOrigin.x + 0.015, pinOrigin.y));
    fixtureDef.shape.SetAsArray(vertices);
    var hingePin = simulation.world().CreateBody(bodyDef);
    hingePin.CreateFixture(fixtureDef);
    return hingePin;
  };

  /**
   * Create the geometry for a sluice level.
   * @param {Box2D.Common.Math.b2Vec2} levelOrigin The level origin, relative to the
   *    centre of the sluice body.
   * @param {Object} bodyDef The Box2D BodyDef to use for the level's body.
   * @param {Object} fixtureDef The Box2D FixtureDef to use for the level geometry.
   * @return {Object} The Box2D Body representing the level geometry.
   */
  var sluiceLevelAt = function(levelOrigin, bodyDef, fixtureDef) {
    var sluiceLevel = simulation.world().CreateBody(bodyDef);
    sluiceLevel.SetUserData(new PolyView());
    // The left arm of the bar.
    var sluiceVerts = new Array();
    sluiceVerts.push(new Box2D.Common.Math.b2Vec2(levelOrigin.x - 0.50, levelOrigin.y));
    sluiceVerts.push(new Box2D.Common.Math.b2Vec2(levelOrigin.x - 0.50, levelOrigin.y - 0.03));
    sluiceVerts.push(new Box2D.Common.Math.b2Vec2(levelOrigin.x - 0.32, levelOrigin.y - 0.045));
    sluiceVerts.push(new Box2D.Common.Math.b2Vec2(levelOrigin.x - 0.32, levelOrigin.y - 0.015));
    fixtureDef.shape.SetAsArray(sluiceVerts);
    sluiceLevel.CreateFixture(fixtureDef);
    sluiceVerts = new Array();
    sluiceVerts.push(new Box2D.Common.Math.b2Vec2(levelOrigin.x - 0.32, levelOrigin.y - 0.015));
    sluiceVerts.push(new Box2D.Common.Math.b2Vec2(levelOrigin.x - 0.32, levelOrigin.y - 0.045));
    sluiceVerts.push(new Box2D.Common.Math.b2Vec2(levelOrigin.x - 0.26, levelOrigin.y - 0.045));
    sluiceVerts.push(new Box2D.Common.Math.b2Vec2(levelOrigin.x - 0.26, levelOrigin.y - 0.015));
    fixtureDef.shape.SetAsArray(sluiceVerts);
    sluiceLevel.CreateFixture(fixtureDef);
    sluiceVerts = new Array();
    sluiceVerts.push(new Box2D.Common.Math.b2Vec2(levelOrigin.x - 0.26, levelOrigin.y - 0.015));
    sluiceVerts.push(new Box2D.Common.Math.b2Vec2(levelOrigin.x - 0.26, levelOrigin.y - 0.045));
    sluiceVerts.push(new Box2D.Common.Math.b2Vec2(levelOrigin.x - 0.09, levelOrigin.y - 0.03));
    sluiceVerts.push(new Box2D.Common.Math.b2Vec2(levelOrigin.x - 0.09, levelOrigin.y));
    fixtureDef.shape.SetAsArray(sluiceVerts);
    sluiceLevel.CreateFixture(fixtureDef);
    sluiceVerts = new Array();
    sluiceVerts.push(new Box2D.Common.Math.b2Vec2(levelOrigin.x - 0.09, levelOrigin.y));
    sluiceVerts.push(new Box2D.Common.Math.b2Vec2(levelOrigin.x - 0.09, levelOrigin.y - 0.03));
    sluiceVerts.push(new Box2D.Common.Math.b2Vec2(levelOrigin.x + 0.09, levelOrigin.y - 0.03));
    sluiceVerts.push(new Box2D.Common.Math.b2Vec2(levelOrigin.x + 0.09, levelOrigin.y));
    fixtureDef.shape.SetAsArray(sluiceVerts);
    sluiceLevel.CreateFixture(fixtureDef);
    sluiceVerts = new Array();
    sluiceVerts.push(new Box2D.Common.Math.b2Vec2(levelOrigin.x + 0.09, levelOrigin.y));
    sluiceVerts.push(new Box2D.Common.Math.b2Vec2(levelOrigin.x + 0.09, levelOrigin.y - 0.03));
    sluiceVerts.push(new Box2D.Common.Math.b2Vec2(levelOrigin.x + 0.26, levelOrigin.y - 0.045));
    sluiceVerts.push(new Box2D.Common.Math.b2Vec2(levelOrigin.x + 0.26, levelOrigin.y - 0.015));
    fixtureDef.shape.SetAsArray(sluiceVerts);
    sluiceLevel.CreateFixture(fixtureDef);
    sluiceVerts = new Array();
    sluiceVerts.push(new Box2D.Common.Math.b2Vec2(levelOrigin.x + 0.26, levelOrigin.y - 0.015));
    sluiceVerts.push(new Box2D.Common.Math.b2Vec2(levelOrigin.x + 0.26, levelOrigin.y - 0.045));
    sluiceVerts.push(new Box2D.Common.Math.b2Vec2(levelOrigin.x + 0.32, levelOrigin.y - 0.045));
    sluiceVerts.push(new Box2D.Common.Math.b2Vec2(levelOrigin.x + 0.32, levelOrigin.y - 0.015));
    fixtureDef.shape.SetAsArray(sluiceVerts);
    sluiceLevel.CreateFixture(fixtureDef);
    sluiceVerts = new Array();
    sluiceVerts.push(new Box2D.Common.Math.b2Vec2(levelOrigin.x + 0.32, levelOrigin.y - 0.015));
    sluiceVerts.push(new Box2D.Common.Math.b2Vec2(levelOrigin.x + 0.32, levelOrigin.y - 0.045));
    sluiceVerts.push(new Box2D.Common.Math.b2Vec2(levelOrigin.x + 0.50, levelOrigin.y - 0.03));
    sluiceVerts.push(new Box2D.Common.Math.b2Vec2(levelOrigin.x + 0.50, levelOrigin.y));
    fixtureDef.shape.SetAsArray(sluiceVerts);
    sluiceLevel.CreateFixture(fixtureDef);
    // The centre wedge.
    sluiceVerts = new Array();
    sluiceVerts.push(new Box2D.Common.Math.b2Vec2(levelOrigin.x + 0.09, levelOrigin.y));
    sluiceVerts.push(new Box2D.Common.Math.b2Vec2(levelOrigin.x, levelOrigin.y + 0.06));
    sluiceVerts.push(new Box2D.Common.Math.b2Vec2(levelOrigin.x - 0.09, levelOrigin.y));
    fixtureDef.shape.SetAsArray(sluiceVerts);
    sluiceLevel.CreateFixture(fixtureDef);
    return sluiceLevel;
  };

  /**
   * Create the joint that represents the hinge.
   * @param {Box2D.Common.Math.b2Vec2} hingeOrigin The hinge origin, relative to the
   *    centre of the sluice body.
   * @param {Object} levelBody The Box2D Body that represents the level.
   * @param {Object} fixtureDef The Box2D Body that represents the hinge pin.
   * @return {Object} The Box2D Joint representing the hinge.
   */
  var hingeAt = function(hingeOrigin, levelBody, hingePin) {
    var jointDef = new Box2D.Dynamics.Joints.b2RevoluteJointDef();
    jointDef.bodyA = hingePin;
    jointDef.bodyB = levelBody;
    jointDef.localAnchorA.Set(hingeOrigin.x, hingeOrigin.y);
    jointDef.localAnchorB.Set(hingeOrigin.x, hingeOrigin.y);
    jointDef.collideConnected = false;
    jointDef.lowerAngle = -Math.PI / 4;
    jointDef.upperAngle = Math.PI / 4;
    jointDef.enableLimit = true;
    return simulation.world().CreateJoint(jointDef);
  };
/*
  this._hingeTrack1 = hingeTrackAt(Sluice._LEVEL_ORIGINS[0], sluiceBodyDef, sluiceFixtureDef);
  this._hingeTrack2 = hingeTrackAt(Sluice._LEVEL_ORIGINS[1], sluiceBodyDef, sluiceFixtureDef);
  this._hingeTrack3 = hingeTrackAt(Sluice._LEVEL_ORIGINS[2], sluiceBodyDef, sluiceFixtureDef);
*/
  var hingePin1 = hingePinAt(Sluice._LEVEL_ORIGINS[0], sluiceBodyDef, sluiceFixtureDef);
  var hingePin2 = hingePinAt(Sluice._LEVEL_ORIGINS[1], sluiceBodyDef, sluiceFixtureDef);
  var hingePin3 = hingePinAt(Sluice._LEVEL_ORIGINS[2], sluiceBodyDef, sluiceFixtureDef);
  // Create the dynamic part of level 1 of the sluice.
  sluiceBodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
  this._level1 = sluiceLevelAt(Sluice._LEVEL_ORIGINS[0], sluiceBodyDef, sluiceFixtureDef);
  this._level1Hinge = hingeAt(Sluice._LEVEL_ORIGINS[0], this._level1, hingePin1);

  this._level2 = sluiceLevelAt(Sluice._LEVEL_ORIGINS[1], sluiceBodyDef, sluiceFixtureDef);
  this._level2Hinge = hingeAt(Sluice._LEVEL_ORIGINS[1], this._level2, hingePin2);

  this._level3 = sluiceLevelAt(Sluice._LEVEL_ORIGINS[2], sluiceBodyDef, sluiceFixtureDef);
  this._level3Hinge = hingeAt(Sluice._LEVEL_ORIGINS[2], this._level3, hingePin3);
}
/**
 * Apply Hooke's law dampening to the sluice level hinges.
 * @override
 */
Sluice.prototype.processGameTick = function(gameTimeNow, gameTimeDelta) {
  var applyHookesLaw = function(hinge, levelBody) {
    var hingeAngle = hinge.GetJointAngle();
    var hingeVel = hinge.GetJointSpeed();
    if (Math.abs(hingeAngle) > 0.0001) {
      levelBody.ApplyTorque(-hingeAngle * 0.05 - hingeVel * 0.02);
    }
  }
  applyHookesLaw(this._level1Hinge, this._level1);
  applyHookesLaw(this._level2Hinge, this._level2);
  applyHookesLaw(this._level3Hinge, this._level3);
}
