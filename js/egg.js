/* Copyright 2014 (c) SoFIE Studios.  All rights reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview  The Egg class. The Egg object implements all the behaviour of an egg.
 */

/**
 * Constructor for the Egg.
 * @param {number} xPos The initial x-coordinate of the Egg.
 * @param {number} yPos The initial y-coordinate of the Egg.
 * @constructor
 */
Egg = function(xPos, yPos) {
  GamePiece.call(this);
  /**
   * The initial x-coordinate of the Egg, measured in world-space units.
   * @type {number}
   * @private
   */
  this._xPos = xPos || 0.0;
  /**
   * The initial y-coordinate of the Egg, measured in world-space units.
   * @type {number}
   * @private
   */
  this._yPos = yPos || 0.0;
}
Egg.prototype = new GamePiece();
Egg.prototype.constructor = Egg;

/**
 * Various constants used to set up and run the Box2D simulation.
 * @enum {Object}
 */
Egg.Box2DConsts = {
  EGG_DENSITY: 1.031,
  EGG_FRICTION: 0.3,
  EGG_RESTITUTION: 0.3
}

/**
 * Create the vertices of a polygon that describes an egg.
 * A common hen's egg is 5.7cm tall and 4.45cm in diameter at its widest point, on
 * average (ref: http://www.animalplanet.com/animal-facts/egg-info.htm).
 * @param {Number} opt_ovality The "ovalness" of the egg. This parameter is pretty
 *     narrow in range. 0.17 to 0.2 are good values.
 * @return {Array} the egg vertices.
 * @private
 */
Egg.prototype._eggVertices = function(opt_ovality) {
  var ovality = opt_ovality || 0.2;
  var eggVertices = new Array();

  var step = Math.PI / 12;
  var ctr = new Box2D.Common.Math.b2Vec2(0, 0);
  var radius = new Box2D.Common.Math.b2Vec2(.0445, .057);
  for (var theta = 0; theta < 2 * Math.PI; theta += step) {
    var sinTheta = Math.sin(theta);
    // Scale the x-value by a function of y. I picked e^(0.2y) as the scaling
    // function. This scale is applied before scaling by the radius, so that y
    // is in range [-1..1]. Larger values of |y| produce really crazy results.
    var x = Math.exp(ovality * sinTheta) * radius.x * Math.cos(theta);
    var y = radius.y * sinTheta;
    eggVertices.push(new Box2D.Common.Math.b2Vec2(ctr.x + x, ctr.y + y));
  }
  return eggVertices;
}

Egg.prototype.getBodyDef = function() {
  bodyDef = new Box2D.Dynamics.b2BodyDef();
  bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
  bodyDef.position.Set(this._xPos, this._yPos);
  return bodyDef;
}

/**
 * Add geometry for an egg.
 * @override
 */
Egg.prototype.addFixturesToBody = function(simulation, body) {
  var eggFixture = new Box2D.Dynamics.b2FixtureDef();
  eggFixture.density = Egg.Box2DConsts.EGG_DENSITY;
  eggFixture.friction = Egg.Box2DConsts.EGG_FRICTION;
  eggFixture.restitution = Egg.Box2DConsts.EGG_RESTITUTION;
  eggFixture.shape = new Box2D.Collision.Shapes.b2PolygonShape();
  eggFixture.shape.SetAsArray(this._eggVertices(0.17));
  body.CreateFixture(eggFixture);
}

/**
 * Return a new EggView.
 * @override
 */
Egg.prototype.getView = function(simulation) {
  return new EggView(simulation.scale());
}
