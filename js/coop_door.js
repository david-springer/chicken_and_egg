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
 */
CoopDoor = function() {
  /**
   * The static wall. Not valid until addToSimulation() is called.
   * @type {Box2D.Body}
   * @private
   */
  this._coopWall = null;
  /**
   * The dynamic door. Not valid until addToSimulation() is called.
   * @type {Box2D.body}
   * @public
   */
  this.coopDoor = null;
  /**
   * The revolute joint representing the hinge. Not valid until addToSimulation() is
   * called.
   * @type {Box2D.RevoluteJoint}
   * @public
   */
  this.coopDoorHinge = null;
}
CoopDoor.prototype.constructor = CoopDoor;

/**
 * Method to add the coop door pieces to the Box2D world.
 * @param {Object} simulation The simulation. This object is expected to implement these
 *     methods:
 *       world() The Box2D world
 *       worldSize() The size of the game board in Box2D world coordinates
 *       scale() The scale factor from CANVAS to Box2D world
 */
CoopDoor.prototype.addToSimulation = function(simulation) {
  // Create the static coop wall.
  var fixture = new Box2D.Dynamics.b2FixtureDef();
  fixture.shape = new Box2D.Collision.Shapes.b2PolygonShape();

  var bodyDef = new Box2D.Dynamics.b2BodyDef();
  bodyDef.type = Box2D.Dynamics.b2Body.b2_staticBody;

  var vertices = new Array()
  vertices.push(new Box2D.Common.Math.b2Vec2(0.60 + 0.80, 2.40));
  vertices.push(new Box2D.Common.Math.b2Vec2(0.60 + 0.80, 2.0));
  vertices.push(new Box2D.Common.Math.b2Vec2(0.60 + 0.80 + 0.03, 2.0));
  vertices.push(new Box2D.Common.Math.b2Vec2(0.60 + 0.80 + 0.03, 2.40));
  fixture.density = ChickenAndEgg.Box2DConsts.DOUG_FIR_DENSITY;
  fixture.friction = ChickenAndEgg.Box2DConsts.DOUG_FIR_FRICTION;
  fixture.restitution = ChickenAndEgg.Box2DConsts.DOUG_FIR_RESTITUTION;
  fixture.shape.SetAsArray(vertices);
  this._coopWall = simulation.world().CreateBody(bodyDef);
  this._coopWall.CreateFixture(fixture);
  this._coopWall.SetUserData(new PolyView(simulation.scale()));

  // Create the dynamic part of the door.
  vertices = new Array()
  vertices.push(new Box2D.Common.Math.b2Vec2(0.60 + 0.80, 2.0));
  vertices.push(new Box2D.Common.Math.b2Vec2(0.60 + 0.80, 1.7));
  vertices.push(new Box2D.Common.Math.b2Vec2(0.60 + 0.80 + 0.03, 1.7));
  vertices.push(new Box2D.Common.Math.b2Vec2(0.60 + 0.80 + 0.03, 2.0));
  fixture.density = 2.0;
  fixture.friction = ChickenAndEgg.Box2DConsts.DOUG_FIR_FRICTION;
  fixture.restitution = ChickenAndEgg.Box2DConsts.DOUG_FIR_RESTITUTION;
  fixture.shape.SetAsArray(vertices);
  bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
  this.coopDoor = simulation.world().CreateBody(bodyDef);
  this.coopDoor.CreateFixture(fixture);
  this.coopDoor.SetUserData(new PolyView(simulation.scale()));

  // Create the joint that represents the hinge.
  var jointDef = new Box2D.Dynamics.Joints.b2RevoluteJointDef();
  jointDef.Initialize(this._coopWall, this.coopDoor, new Box2D.Common.Math.b2Vec2(
      0.60 + 0.80 + 0.015, 2.0));
  jointDef.collideConnected = false;
  jointDef.lowerAngle = -Math.PI / 12;
  jointDef.upperAngle = Math.PI / 4;
  jointDef.enableLimit = true;
  this.coopDoorHinge = simulation.world().CreateJoint(jointDef);
}
