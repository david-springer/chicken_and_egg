/* Copyright 2014 (c) SoFIE Studios.  All rights reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview  The CoopDoor class. The CoopDoor object implements the bodies that
 * represent a hinged door to the chicken coop. There are two bodies: the static wall
 * and the dynamic door. There is also a hinge definition, which is used by the
 * simulation to make the door swing.
 */

/**
 * Constructor for the CoopDoor.
 * @constructor
 * @extends {GamePiece}
 */
CoopDoor = function() {
  GamePiece.call(this);
  /**
   * The static wall. Not valid until addToSimulation() is called.
   * @type {Box2D.Body}
   * @private
   */
  this._coopWall = null;
  /**
   * The dynamic door. Not valid until addToSimulation() is called.
   * @type {Box2D.body}
   * @private
   */
  this._coopDoor = null;
  /**
   * The revolute joint representing the hinge. Not valid until addToSimulation() is
   * called.
   * @type {Box2D.RevoluteJoint}
   * @private
   */
  this._coopDoorHinge = null;
}
CoopDoor.prototype = new GamePiece();
CoopDoor.prototype.constructor = CoopDoor;

/**
 * The origin in world coordinates of the coop door assembly.
 * @type {Box2D.Common.Math.b2Vec2}
 */
CoopDoor.COOP_DOOR_ORIGIN = new Box2D.Common.Math.b2Vec2(0.70 + 0.80, 2.20);

/**
 * Draw the coop door.
 * @override
 */
CoopDoor.prototype.draw = function(ctx, simulation) {
  var drawCoopDoorPart = function(ctx, b) {
    if (b.IsActive()) {
      b.GetUserData().draw(ctx, b);
    }
  }
  drawCoopDoorPart(ctx, this._coopWall);
  drawCoopDoorPart(ctx, this._coopDoor);
}

/**
 * Method to add the coop door pieces to the Box2D world. Customise this method to create
 * three Box2D bodies that represent the coop door: the coop wall (static), the coop door
 * (dynamic, the swinging part) and the coop hinge.
 * @override
 */
CoopDoor.prototype.addToSimulation = function(simulation) {
  // Create the static coop wall.
  var fixture = new Box2D.Dynamics.b2FixtureDef();
  fixture.shape = new Box2D.Collision.Shapes.b2PolygonShape();

  var bodyDef = new Box2D.Dynamics.b2BodyDef();
  bodyDef.position.Set(CoopDoor.COOP_DOOR_ORIGIN.x, CoopDoor.COOP_DOOR_ORIGIN.y);
  bodyDef.type = Box2D.Dynamics.b2Body.b2_staticBody;

  var vertices = new Array()
  vertices.push(new Box2D.Common.Math.b2Vec2(-0.03, 0.40));
  vertices.push(new Box2D.Common.Math.b2Vec2(-0.03, 0));
  vertices.push(new Box2D.Common.Math.b2Vec2(0, 0));
  vertices.push(new Box2D.Common.Math.b2Vec2(0, 0.40));
  fixture.density = ChickenAndEgg.Box2DConsts.DOUG_FIR_DENSITY;
  fixture.friction = ChickenAndEgg.Box2DConsts.DOUG_FIR_FRICTION;
  fixture.restitution = ChickenAndEgg.Box2DConsts.DOUG_FIR_RESTITUTION;
  fixture.shape.SetAsArray(vertices);
  this._coopWall = simulation.world().CreateBody(bodyDef);
  this._coopWall.CreateFixture(fixture);
  this._coopWall.SetUserData(new PolyView());

  // Create the dynamic part of the door.
  vertices = new Array()
  vertices.push(new Box2D.Common.Math.b2Vec2(-0.03, 0));
  vertices.push(new Box2D.Common.Math.b2Vec2(-0.03, -0.3));
  vertices.push(new Box2D.Common.Math.b2Vec2(0, -0.3));
  vertices.push(new Box2D.Common.Math.b2Vec2(0, 0));
  fixture.density = 2.0;
  fixture.friction = ChickenAndEgg.Box2DConsts.DOUG_FIR_FRICTION;
  fixture.restitution = ChickenAndEgg.Box2DConsts.DOUG_FIR_RESTITUTION;
  fixture.shape.SetAsArray(vertices);
  bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
  this._coopDoor = simulation.world().CreateBody(bodyDef);
  this._coopDoor.CreateFixture(fixture);
  this._coopDoor.SetUserData(new PolyView());

  // Create the joint that represents the hinge.
  var jointDef = new Box2D.Dynamics.Joints.b2RevoluteJointDef();
  jointDef.Initialize(this._coopWall, this._coopDoor, new Box2D.Common.Math.b2Vec2(
      CoopDoor.COOP_DOOR_ORIGIN.x - 0.015, CoopDoor.COOP_DOOR_ORIGIN.y));
  jointDef.collideConnected = false;
  jointDef.lowerAngle = -Math.PI / 12;
  jointDef.upperAngle = Math.PI / 4;
  jointDef.enableLimit = true;
  this._coopDoorHinge = simulation.world().CreateJoint(jointDef);
}

/**
 * Apply Hooke's law dampening to the coop door hinge.
 * @override
 */
CoopDoor.prototype.processGameTick = function(gameTimeNow, gameTimeDelta) {
  var hingeAngle = this._coopDoorHinge.GetJointAngle();
  var hingeVel = this._coopDoorHinge.GetJointSpeed();
  if (Math.abs(hingeVel) > 0.001) {
    this._coopDoor.ApplyTorque(-hingeAngle * 0.008 - hingeVel * 0.0003);
  }
}
