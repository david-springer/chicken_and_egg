/* Copyright 2014 (c) SoFIE Studios.  All rights reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview  The Ground class. The Ground object implements all static pieces in
 * the game.
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
  GROUND_FRICTION: 0.5,
  GROUND_RESTITUTION: 0.7
}

/**
 * Return the body def for the ground. The ground is a static body.
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
GamePiece.prototype.addFixturesToBody = function(simulation, body) {
  // Set up the flat ground plane.
  var worldSize = simulation.worldSize();
  var groundVertices = new Array()
  groundVertices.push(new Box2D.Common.Math.b2Vec2(0, worldSize.y + 0.05));
  groundVertices.push(new Box2D.Common.Math.b2Vec2(0, worldSize.y - 0.05));
  groundVertices.push(new Box2D.Common.Math.b2Vec2(worldSize.x, worldSize.y - 0.05));
  groundVertices.push(new Box2D.Common.Math.b2Vec2(worldSize.x, worldSize.y + 0.05));
  var groundFixture = new Box2D.Dynamics.b2FixtureDef();
  groundFixture.density = Ground.Box2DConsts.GROUND_DENSITY;
  groundFixture.friction = Ground.Box2DConsts.GROUND_FRICTION;
  groundFixture.restitution = Ground.Box2DConsts.GROUND_RESTITUTION;
  groundFixture.shape = new Box2D.Collision.Shapes.b2PolygonShape();
  groundFixture.shape.SetAsArray(groundVertices);

  // Set up the incline plane.
  var wedgeVertices = new Array();
  wedgeVertices.push(new Box2D.Common.Math.b2Vec2(0, worldSize.y - 1.5));
  wedgeVertices.push(new Box2D.Common.Math.b2Vec2(2, worldSize.y - 0.05));
  wedgeVertices.push(new Box2D.Common.Math.b2Vec2(0, worldSize.y - 0.05));
  var wedgeFixture = new Box2D.Dynamics.b2FixtureDef();
  wedgeFixture.density = Ground.Box2DConsts.GROUND_DENSITY;
  wedgeFixture.friction = Ground.Box2DConsts.GROUND_FRICTION;
  wedgeFixture.restitution = Ground.Box2DConsts.GROUND_RESTITUTION;
  wedgeFixture.shape = new Box2D.Collision.Shapes.b2PolygonShape();
  wedgeFixture.shape.SetAsArray(wedgeVertices);

  body.CreateFixture(groundFixture);
  body.CreateFixture(wedgeFixture);
}

GamePiece.prototype.getView = function(simulation) {
  return new PolyView(simulation.scale());
}
