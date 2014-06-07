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
 * Build up the ground two fixtures which form an U-shape around the left, bottom and
 * right edges of the game board. When an egg collides with the ground, it breaks and
 * is removed from
 * the game.
 * @override
 */
Ground.prototype.addFixturesToBody = function(simulation, body) {
  var worldSize = simulation.worldSize().Copy();
  var groundFixture = new Box2D.Dynamics.b2FixtureDef();
  groundFixture.density = Ground.Box2DConsts.GROUND_DENSITY;
  groundFixture.friction = Ground.Box2DConsts.GROUND_FRICTION;
  groundFixture.restitution = Ground.Box2DConsts.GROUND_RESTITUTION;

  // Set up the flat ground plane.
  var groundVertices = new Array()
  groundVertices.push(new Box2D.Common.Math.b2Vec2(-0.1, 0.05));
  groundVertices.push(new Box2D.Common.Math.b2Vec2(-0.1, -0.05));
  groundVertices.push(new Box2D.Common.Math.b2Vec2(worldSize.x + 0.1, -0.05));
  groundVertices.push(new Box2D.Common.Math.b2Vec2(worldSize.x + 0.1, 0.05));
  groundFixture.shape = new Box2D.Collision.Shapes.b2PolygonShape();
  groundFixture.shape.SetAsArray(groundVertices);
  body.CreateFixture(groundFixture);

  // The left wall.
  groundVertices = new Array()
  groundVertices.push(new Box2D.Common.Math.b2Vec2(-0.1, 0.05));
  groundVertices.push(new Box2D.Common.Math.b2Vec2(0, 0.05));
  groundVertices.push(new Box2D.Common.Math.b2Vec2(0, worldSize.y));
  groundVertices.push(new Box2D.Common.Math.b2Vec2(-0.1, worldSize.y));
  groundFixture.shape = new Box2D.Collision.Shapes.b2PolygonShape();
  groundFixture.shape.SetAsArray(groundVertices);
  body.CreateFixture(groundFixture);

  // The right wall.
  groundVertices = new Array()
  groundVertices.push(new Box2D.Common.Math.b2Vec2(worldSize.x, 0.05));
  groundVertices.push(new Box2D.Common.Math.b2Vec2(worldSize.x + 0.1, 0.05));
  groundVertices.push(new Box2D.Common.Math.b2Vec2(worldSize.x + 0.1, worldSize.y));
  groundVertices.push(new Box2D.Common.Math.b2Vec2(worldSize.x, worldSize.y));
  groundFixture.shape = new Box2D.Collision.Shapes.b2PolygonShape();
  groundFixture.shape.SetAsArray(groundVertices);
  body.CreateFixture(groundFixture);
}

Ground.prototype.getView = function(simulation) {
  return new PolyView(simulation.scale());
}

