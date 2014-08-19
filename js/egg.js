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
 * @param {Object} opt_dimensions The base dimensions of the egg. Valid keys are:
 *     ovality: a number that sets the "ovalness" of the egg. This parameter is pretty
 *         narrow in range. 0.17 to 0.2 are good values.
 *     axis_ratio: a scalar number that sets the ratio of the x-aligned (width) axis to
 *         the y-aligned (height) axis.
 *     width: a scalar that set the x-aligned (width) of the egg. The y-aligned (height)
 *         axis is always WIDTH * AXIS_RATIO.
 * @constructor
 * @extends {GamePiece}
 */
Egg = function(xPos, yPos, opt_dimensions) {
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
  /**
   * Identify this game piece as an egg.
   * @type {boolean}
   * @public
   */
  this.isEgg = true;
  /**
   * The ovality of this egg.
   * @type {number}
   * @public
   */
  if (opt_dimensions) {
    this.dimensions = new Object();
    for (var dim in Egg.DefaultDimensions) {
      this.dimensions[dim] = opt_dimensions.hasOwnProperty(dim) ?
          opt_dimensions[dim] : Egg.DefaultDimensions[dim];
    }
  } else {
    this.dimensions = Egg.DefaultDimensions;
  }
}
Egg.prototype = new GamePiece();
Egg.prototype.constructor = Egg;

/**
 * The default ovality of an egg. The ovality is determined by both the ratio of the
 * y-axis radius (height) to the x-axis radius (width) and the ovality factor. The
 * defaults are the average dimensions of a common hen's egg: 5.7cm tall and 4.45cm in
 * diameter at its widest point (ref:
 * http://www.animalplanet.com/animal-facts/egg-info.htm).
 */
Egg.DefaultDimensions = {
  ovality: 0.17,
  axis_ratio: 0.057 / 0.0445,
  width: 0.0445
}

/**
 * Various constants used to set up and run the Box2D simulation.
 * @enum {Object}
 */
Egg.Box2DConsts = {
  EGG_DENSITY: 1.031,
  EGG_FRICTION: 0.2,
  EGG_RESTITUTION: 0.2
}

/**
 * Create the vertices of a polygon that describes an egg, centered at origin.
 * @param {number} ovality A scalar for the ovalness of the egg.
 * @param {Box2D.Common.Math.b2Vec2} radius The 2D radii of the base ellipse for the egg.
 * @return {Array} the egg vertices.
 * @private
 */
Egg.prototype._eggVertices = function(ovality, radius) {
  var eggVertices = new Array();
  var step = Math.PI / 12;
  for (var theta = 0; theta < 2 * Math.PI; theta += step) {
    var sinTheta = Math.sin(theta);
    // Scale the x-value by a function of y. I picked e^(0.2y) as the scaling
    // function. This scale is applied before scaling by the radius, so that y
    // is in range [-1..1]. Larger values of |y| produce really crazy results.
    // Note: the vertices *must* be specified in counter-clockwise order, or the Box2D
    // collision detector won't work.
    var x = Math.exp(ovality * sinTheta) * radius.x * Math.cos(theta);
    var y = radius.y * sinTheta;
    eggVertices.push(new Box2D.Common.Math.b2Vec2(x, y));
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
  eggFixture.shape.SetAsArray(
      this._eggVertices(this.dimensions.ovality,
      new Box2D.Common.Math.b2Vec2(
          this.dimensions.width, this.dimensions.width * this.dimensions.axis_ratio)));
  body.CreateFixture(eggFixture);
  body.SetBullet(true);
}

/**
 * Return a new EggView.
 * @override
 */
Egg.prototype.loadView = function(simulation) {
  this.view = new EggView();
}
