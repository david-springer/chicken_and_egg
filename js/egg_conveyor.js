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
  CONVEYOR_DENSITY: 8.05,  // Density of steel in g/cm^3
  CONVEYOR_FRICTION: 0.2,
  CONVEYOR_RESTITUTION: 0.5,
  GROUND_DENSITY: 1.0,
  GROUND_FRICTION: 0.8,
  GROUND_RESTITUTION: 0.1
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
  // Set up the perch.

  // Set up the chute.

  // Set up the sluice.

  // Set up the flat ground plane.
  var groundLocation = simulation.worldSize().Copy();
  groundLocation.y = 0;
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

