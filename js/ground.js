/* Copyright 2014 (c) SoFIE Studios.  All rights reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview  The Ground class. The Ground object implements the static element
 * representing the ground.
 */

/**
 * Constructor for the Ground.
 * @constructor
 * @extends {GamePiece}
 */
Ground = function() {
  GamePiece.call(this);
}
Ground.prototype = new GamePiece();
Ground.prototype.constructor = Ground;

/**
 * Various constants used to set up and run the Box2D simulation.
 * @enum {Object}
 */
Ground.Box2DConsts = {
  GROUND_DENSITY: 1.0,
  GROUND_FRICTION: 0.8,
  GROUND_RESTITUTION: 0.1
}

/**
 * Return the body def for the ground.
 * @override
 */
Ground.prototype.getBodyDef = function() {
  var groundBodyDef = new Box2D.Dynamics.b2BodyDef();
  groundBodyDef.type = Box2D.Dynamics.b2Body.b2_staticBody;
  return groundBodyDef;
}

/**
 * Build up the ground fixtures. There are two: the flat ground plane, and a wedge.
 * @override
 */
Ground.prototype.addFixturesToBody = function(simulation, body) {
  var groundLocation = simulation.worldSize().Copy();
  groundLocation.y = 0;
  // Set up the flat ground plane.
  var groundVertices = new Array()
  groundVertices.push(new Box2D.Common.Math.b2Vec2(0, groundLocation.y + 0.05));
  groundVertices.push(new Box2D.Common.Math.b2Vec2(0, groundLocation.y - 0.05));
  groundVertices.push(
      new Box2D.Common.Math.b2Vec2(groundLocation.x, groundLocation.y - 0.05));
  groundVertices.push(
      new Box2D.Common.Math.b2Vec2(groundLocation.x, groundLocation.y + 0.05));
  var groundFixture = new Box2D.Dynamics.b2FixtureDef();
  groundFixture.density = Ground.Box2DConsts.GROUND_DENSITY;
  groundFixture.friction = Ground.Box2DConsts.GROUND_FRICTION;
  groundFixture.restitution = Ground.Box2DConsts.GROUND_RESTITUTION;
  groundFixture.shape = new Box2D.Collision.Shapes.b2PolygonShape();
  groundFixture.shape.SetAsArray(groundVertices);
  body.CreateFixture(groundFixture);
}

Ground.prototype.getView = function(simulation) {
  return new PolyView(simulation.scale());
}

