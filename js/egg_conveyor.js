/* Copyright 2014 (c) SoFIE Studios.  All rights reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview  The EggConveyor class. The EggConveyor object implements the entire
 * egg conveyor system as three major components: the perch (static), the chute (static)
 * and the sluice (dynamic, can be moved via the mouse). The sluice is hinged at one end
 * and has three gaps: the fry-pan gap, the egg-carton gap and the nest gap. This object
 * also implements the ground plane (static).
 */

/**
 * Constructor for the EggConveyor.
 * @constructor
 * @extends {GamePiece}
 */
EggConveyor = function() {
  GamePiece.call(this);
}
EggConveyor.prototype = new GamePiece();
EggConveyor.prototype.constructor = EggConveyor;

/**
 * Various constants used to set up and run the Box2D simulation.
 * @enum {Object}
 */
EggConveyor.Box2DConsts = {
  CONVEYOR_DENSITY: 5.3,  // Density of Douglas Fir in g/cm^3
  CONVEYOR_FRICTION: 0.3,
  CONVEYOR_RESTITUTION: 0.804,
  GROUND_DENSITY: 1.0,
  GROUND_FRICTION: 0.8,
  GROUND_RESTITUTION: 0.1
}

/**
 * RUn a tick of the simulation. This method updates the various hinges active in the
 * egg conveyor system.
 */
EggConveyor.prototype.simulationTick = function() {
/*
  // Apply the return-spring force to the hinge. Uses Hooke's law.
  var hingeAngle = this._hingeJoint.GetJointAngle();
  var hingeVel = this._hingeJoint.GetJointSpeed();
  if (Math.abs(hingeVel) > 0.001) {
    this._hinge.ApplyTorque(-hingeAngle * 0.02 - hingeVel * 0.05);
  }
*/
}

/**
 * Return the body def for the egg conveyor. The egg conveyor is a static body, even
 * though parts of it (the sluice) can be moved via the mouse.
 * @override
 */
EggConveyor.prototype.getBodyDef = function() {
  var eggConveyorBodyDef = new Box2D.Dynamics.b2BodyDef();
  eggConveyorBodyDef.type = Box2D.Dynamics.b2Body.b2_staticBody;
  return eggConveyorBodyDef;
}

/**
 * Build up the ground fixtures. There are two: the flat ground plane, and a wedge.
 * @override
 */
EggConveyor.prototype.addFixturesToBody = function(simulation, body) {
  var groundLocation = simulation.worldSize().Copy();
  groundLocation.y = 0;

  // Set up the perch and the chute as one polygon.
  var perchChuteVerts = new Array();
  perchChuteVerts.push(new Box2D.Common.Math.b2Vec2(0.60, 1.80));
  perchChuteVerts.push(new Box2D.Common.Math.b2Vec2(0.60 + 0.50, 1.80));
  perchChuteVerts.push(new Box2D.Common.Math.b2Vec2(0.60 + 0.50 + 0.30, 1.80 - 0.20));
  perchChuteVerts.push(new Box2D.Common.Math.b2Vec2(0.60 + 0.50 + 0.30, 1.80 - 0.20 + 0.03));
  perchChuteVerts.push(new Box2D.Common.Math.b2Vec2(0.60 + 0.50, 1.80 + 0.03));
  perchChuteVerts.push(new Box2D.Common.Math.b2Vec2(0.60, 1.80 + 0.03));
  var perchChuteFixture = new Box2D.Dynamics.b2FixtureDef();
  perchChuteFixture.density = EggConveyor.Box2DConsts.CONVEYOR_DENSITY;
  perchChuteFixture.friction = EggConveyor.Box2DConsts.CONVEYOR_FRICTION;
  perchChuteFixture.restitution = EggConveyor.Box2DConsts.CONVEYOR_RESTITUTION;
  perchChuteFixture.shape = new Box2D.Collision.Shapes.b2PolygonShape();
  perchChuteFixture.shape.SetAsArray(perchChuteVerts);
  body.CreateFixture(perchChuteFixture);

  // Set up the sluice as four separate fixtures to account for the gaps.
  var sluiceVerts = new Array();
  sluiceVerts.push(new Box2D.Common.Math.b2Vec2(0.60 + 0.80, 1.60));
  sluiceVerts.push(new Box2D.Common.Math.b2Vec2(0.60 + 0.80 + 0.20, 1.60));
  sluiceVerts.push(new Box2D.Common.Math.b2Vec2(0.60 + 0.80 + 0.20, 1.60 + 0.03));
  sluiceVerts.push(new Box2D.Common.Math.b2Vec2(0.60 + 0.80, 1.60 + 0.03));
  var sluiceFixture = new Box2D.Dynamics.b2FixtureDef();
  sluiceFixture.density = EggConveyor.Box2DConsts.CONVEYOR_DENSITY;
  sluiceFixture.friction = EggConveyor.Box2DConsts.CONVEYOR_FRICTION;
  sluiceFixture.restitution = EggConveyor.Box2DConsts.CONVEYOR_RESTITUTION;
  sluiceFixture.shape = new Box2D.Collision.Shapes.b2PolygonShape();
  sluiceFixture.shape.SetAsArray(sluiceVerts);
  body.CreateFixture(sluiceFixture);

  sluiceVerts = new Array();
  sluiceVerts.push(new Box2D.Common.Math.b2Vec2(0.60 + 1.15, 1.60));
  sluiceVerts.push(new Box2D.Common.Math.b2Vec2(0.60 + 1.15 + 0.60, 1.60));
  sluiceVerts.push(new Box2D.Common.Math.b2Vec2(0.60 + 1.15 + 0.60, 1.60 + 0.03));
  sluiceVerts.push(new Box2D.Common.Math.b2Vec2(0.60 + 1.15, 1.60 + 0.03));
  sluiceFixture = new Box2D.Dynamics.b2FixtureDef();
  sluiceFixture.density = EggConveyor.Box2DConsts.CONVEYOR_DENSITY;
  sluiceFixture.friction = EggConveyor.Box2DConsts.CONVEYOR_FRICTION;
  sluiceFixture.restitution = EggConveyor.Box2DConsts.CONVEYOR_RESTITUTION;
  sluiceFixture.shape = new Box2D.Collision.Shapes.b2PolygonShape();
  sluiceFixture.shape.SetAsArray(sluiceVerts);
  body.CreateFixture(sluiceFixture);

  sluiceVerts = new Array();
  sluiceVerts.push(new Box2D.Common.Math.b2Vec2(0.60 + 1.90, 1.60));
  sluiceVerts.push(new Box2D.Common.Math.b2Vec2(0.60 + 1.90 + 0.60, 1.60));
  sluiceVerts.push(new Box2D.Common.Math.b2Vec2(0.60 + 1.90 + 0.60, 1.60 + 0.03));
  sluiceVerts.push(new Box2D.Common.Math.b2Vec2(0.60 + 1.90, 1.60 + 0.03));
  sluiceFixture = new Box2D.Dynamics.b2FixtureDef();
  sluiceFixture.density = EggConveyor.Box2DConsts.CONVEYOR_DENSITY;
  sluiceFixture.friction = EggConveyor.Box2DConsts.CONVEYOR_FRICTION;
  sluiceFixture.restitution = EggConveyor.Box2DConsts.CONVEYOR_RESTITUTION;
  sluiceFixture.shape = new Box2D.Collision.Shapes.b2PolygonShape();
  sluiceFixture.shape.SetAsArray(sluiceVerts);
  body.CreateFixture(sluiceFixture);

  sluiceVerts = new Array();
  sluiceVerts.push(new Box2D.Common.Math.b2Vec2(0.60 + 2.65, 1.60));
  sluiceVerts.push(new Box2D.Common.Math.b2Vec2(0.60 + 2.65 + 0.50, 1.60));
  sluiceVerts.push(new Box2D.Common.Math.b2Vec2(0.60 + 2.65 + 0.50, 1.60 + 0.03));
  sluiceVerts.push(new Box2D.Common.Math.b2Vec2(0.60 + 2.65, 1.60 + 0.03));
  sluiceFixture = new Box2D.Dynamics.b2FixtureDef();
  sluiceFixture.density = EggConveyor.Box2DConsts.CONVEYOR_DENSITY;
  sluiceFixture.friction = EggConveyor.Box2DConsts.CONVEYOR_FRICTION;
  sluiceFixture.restitution = EggConveyor.Box2DConsts.CONVEYOR_RESTITUTION;
  sluiceFixture.shape = new Box2D.Collision.Shapes.b2PolygonShape();
  sluiceFixture.shape.SetAsArray(sluiceVerts);
  body.CreateFixture(sluiceFixture);
/*
  // Add a hinge joint.
  var hingeCenter = new Box2D.Common.Math.b2Vec2(this._worldSize.x / 2, this._worldSize.y / 2);
  fixtureDef = new Box2D.Dynamics.b2FixtureDef();
  fixtureDef.density = 8.05;  // Density of steel in g/cm^3
  fixtureDef.friction = 0.2;
  fixtureDef.restitution = 0.5;
  fixtureDef.shape = new Box2D.Collision.Shapes.b2PolygonShape();
  fixtureDef.shape.SetAsBox(0.005, 0.5);
  bodyDef = new Box2D.Dynamics.b2BodyDef();
  bodyDef.type = Box2D.Dynamics.b2Body.b2_staticBody;
  bodyDef.position.Set(hingeCenter.x, hingeCenter.y + 0.5);
  var link1 = this._world.CreateBody(bodyDef);
  link1.CreateFixture(fixtureDef);
  link1.SetUserData(new PolyView());
  
  fixtureDef = new Box2D.Dynamics.b2FixtureDef();
  fixtureDef.density = 8.05;  // Density of steel in g/cm^3
  fixtureDef.friction = 0.2;
  fixtureDef.restitution = 0.5;
  fixtureDef.shape = new Box2D.Collision.Shapes.b2PolygonShape();
  fixtureDef.shape.SetAsBox(0.005, 0.5);
  bodyDef = new Box2D.Dynamics.b2BodyDef();
  bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
  bodyDef.position.Set(hingeCenter.x, hingeCenter.y - 0.5);
  this._hinge = this._world.CreateBody(bodyDef);
  this._hinge.CreateFixture(fixtureDef);
  this._hinge.SetUserData(new PolyView());

  var jointDef = new Box2D.Dynamics.Joints.b2RevoluteJointDef();
  jointDef.Initialize(link1, this._hinge, new Box2D.Common.Math.b2Vec2(
      hingeCenter.x,
      hingeCenter.y));
  jointDef.collideConnected = false;
  jointDef.lowerAngle = -Math.PI / 2;
  jointDef.upperAngle = Math.PI / 2;
  jointDef.enableLimit = true;
  this._hingeJoint = this._world.CreateJoint(jointDef);
*/
  // Set up the flat ground plane.
  var groundVertices = new Array()
  groundVertices.push(new Box2D.Common.Math.b2Vec2(0, groundLocation.y + 0.05));
  groundVertices.push(new Box2D.Common.Math.b2Vec2(0, groundLocation.y - 0.05));
  groundVertices.push(new Box2D.Common.Math.b2Vec2(groundLocation.x, groundLocation.y - 0.05));
  groundVertices.push(new Box2D.Common.Math.b2Vec2(groundLocation.x, groundLocation.y + 0.05));
  var groundFixture = new Box2D.Dynamics.b2FixtureDef();
  groundFixture.density = EggConveyor.Box2DConsts.GROUND_DENSITY;
  groundFixture.friction = EggConveyor.Box2DConsts.GROUND_FRICTION;
  groundFixture.restitution = EggConveyor.Box2DConsts.GROUND_RESTITUTION;
  groundFixture.shape = new Box2D.Collision.Shapes.b2PolygonShape();
  groundFixture.shape.SetAsArray(groundVertices);
  body.CreateFixture(groundFixture);
}

EggConveyor.prototype.getView = function(simulation) {
  return new PolyView(simulation.scale());
}

