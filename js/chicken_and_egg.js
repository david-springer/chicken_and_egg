/* Copyright 2014 (c) SoFIE Studios.  All rights reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview  Implement the application for the Chicken and Egg Machine.
 * Requires Box2Dweb.min.js: http://box2dweb.googlecode.com/svn/trunk/Box2d.min.js
 */

/**
 * Constructor for the ChickenAndEgg class.  Use the run() method to populate
 * the object with controllers and wire up the events.
 * @param {Element} canvas The CANVAS element for drawing the simulation.
 * @constructor
 */
ChickenAndEgg = function(canvas) {
  /**
   * Nifty wrapper for requestAnimationFrame() courtesy Paul Irish:
   * http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
   * @type {Function}
   * @private
   */
  window.wrappedRequestAnimationFrame =
      window.requestAnimationFrame       ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame    ||
      window.oRequestAnimationFrame      ||
      window.msRequestAnimationFrame     ||
      function(/* function */ callback, /* DOMElement */ element) {
        window.setTimeout(callback, 1000 / 60);
      };

  /**
   * The DOM element that contains the application.
   * @type {Element}
   * @private
   */
  this._canvas = canvas;
  /**
   * The scale factor for canvas coordinates to the Box2D world. Not valid until
   * initWorld() is called.
   * @type {number}
   * @private
   */
  this._scale = 0.0;
  /**
   * The size in Box2D world coordinates of the canvas. Not valid until initWorld() is
   * called.
   * @type {Box2D.Common.Math.b2Vec2}
   * @private
   */
  this._worldSize = new Box2D.Common.Math.b2Vec2(0.0, 0.0);
  /**
   * The Box2D world associated with this simulation. Not valid until initWorld() is
   * called.
   * @type {Box2D.Dynamics.b2World}
   * @private
   */
  this._world = null;
}
ChickenAndEgg.prototype.constructor = ChickenAndEgg;

/**
 * Various constants used to set up and run the Box2D simulation.
 * @enum {Object}
 */
ChickenAndEgg.Box2DConsts = {
  GRAVITY: {x: 0, y: 9.81},
  FRAME_RATE: 1/60.0,
  VELOCITY_ITERATION_COUNT: 10,
  POSITION_ITERATION_COUNT: 10
};

/**
 * Scale factor to transform CANVAS coordinates into Box2D world coordinates. Returns
 * 0 until initWorld() is called.
 * @return The scale factor.
 */
ChickenAndEgg.prototype.scale = function() {
  return this._scale;
}

/**
 * Scale factor to transform CANVAS coordinates into Box2D world coordinates. Returns
 * 0 until initWorld() is called.
 * @return The Box2D world.
 */
ChickenAndEgg.prototype.world = function() {
  return this._world;
}

/**
 * The size of the game board in Box2D world coordinates. Returns (0, 0) until
 * initWorld() is called.
 * @return The game board size.
 */
ChickenAndEgg.prototype.worldSize = function() {
  return this._worldSize;
}

/**
 * The run() method initializes and runs the simulation. It never returns.
 */
ChickenAndEgg.prototype.run = function() {
  this.initWorld(this._canvas);
  var heartbeat = function() {
    this.simulationTick();
    this.clearCanvas(this._canvas);
    this.drawWorld(this._canvas);
    window.wrappedRequestAnimationFrame(heartbeat.bind(this));
  };
  heartbeat.bind(this)();
}

/**
 * Initialize all the objects in the world and connect them all together in the
 * simulation.
 * @param {Element} canvas The CANVAS element for drawing the simulation.
 */
ChickenAndEgg.prototype.initWorld = function(canvas) {
  this._world = new Box2D.Dynamics.b2World(
      new Box2D.Common.Math.b2Vec2(ChickenAndEgg.Box2DConsts.GRAVITY.x,
                                   ChickenAndEgg.Box2DConsts.GRAVITY.y),
      true);  // Allow objects to sleep when inactive.
  this._scale = canvas.height / 3;  // 3m tall simulation.

  this._worldSize = new Box2D.Common.Math.b2Vec2(canvas.width / this._scale,
                                                 canvas.height / this._scale);
  var eggConveyor = new EggConveyor();
  eggConveyor.addToSimulation(this);

  // Add a hinge joint.
  var hingeCenter = new Box2D.Common.Math.b2Vec2(
      (canvas.width / 2 / this._scale),
      (canvas.height / 2 / this._scale));
  fixtureDef = new Box2D.Dynamics.b2FixtureDef();
  fixtureDef.density = 8.05;  // Density of steel in g/cm^3
  fixtureDef.friction = 0.2;
  fixtureDef.restitution = 0.5;
  fixtureDef.shape = new Box2D.Collision.Shapes.b2PolygonShape();
  fixtureDef.shape.SetAsBox(0.005, 0.5);
  bodyDef = new Box2D.Dynamics.b2BodyDef();
  bodyDef.type = Box2D.Dynamics.b2Body.b2_staticBody;
  bodyDef.position.Set(hingeCenter.x, hingeCenter.y - 0.5);
  var link1 = this._world.CreateBody(bodyDef);
  link1.CreateFixture(fixtureDef);
  link1.SetUserData(new PolyView(this._scale));
  
  fixtureDef = new Box2D.Dynamics.b2FixtureDef();
  fixtureDef.density = 8.05;  // Density of steel in g/cm^3
  fixtureDef.friction = 0.2;
  fixtureDef.restitution = 0.5;
  fixtureDef.shape = new Box2D.Collision.Shapes.b2PolygonShape();
  fixtureDef.shape.SetAsBox(0.005, 0.5);
  bodyDef = new Box2D.Dynamics.b2BodyDef();
  bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
  bodyDef.position.Set(hingeCenter.x, hingeCenter.y + 0.5);
  this._hinge = this._world.CreateBody(bodyDef);
  this._hinge.CreateFixture(fixtureDef);
  this._hinge.SetUserData(new PolyView(this._scale));

  var jointDef = new Box2D.Dynamics.Joints.b2RevoluteJointDef();
  jointDef.Initialize(link1, this._hinge, new Box2D.Common.Math.b2Vec2(
      hingeCenter.x,
      hingeCenter.y));
  jointDef.collideConnected = false;
  jointDef.lowerAngle = -Math.PI / 2;
  jointDef.upperAngle = Math.PI / 2;
  jointDef.enableLimit = true;
  this._hingeJoint = this._world.CreateJoint(jointDef);

  var eggBody;
  for (var e = 0; e < 20; e++) {
    var egg = new Egg(0.1 * e, 0.2);
    egg.addToSimulation(this);
  }
}

/**
 * Clear the canvas.
 * @param {Element} canvas The CANVAS element for drawing the simulation.
 */
ChickenAndEgg.prototype.clearCanvas = function(canvas) {
  var ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * Draw all the elements in the world.
 * @param {Element} canvas The CANVAS element for drawing the simulation.
 */
ChickenAndEgg.prototype.drawWorld = function(canvas) {
  var ctx = canvas.getContext("2d");
  for (var b = this._world.GetBodyList(); b; b = b.m_next) {
    if (b.IsActive() &&
        typeof b.GetUserData() !== 'undefined' &&
        b.GetUserData() != null) {
        b.GetUserData().draw(ctx, b);
    }
  }
}

/**
 * Run a simulation tick, then schedule the next one.
 */
ChickenAndEgg.prototype.simulationTick = function() {
  // Apply the return-spring force to the hinge. Uses Hooke's law.
  var hingeAngle = this._hingeJoint.GetJointAngle();
  var hingeVel = this._hingeJoint.GetJointSpeed();
  if (Math.abs(hingeVel) > 0.001) {
    this._hinge.ApplyTorque(-hingeAngle * 0.02 - hingeVel * 0.05);
  }
  this._world.Step(ChickenAndEgg.Box2DConsts.FRAME_RATE,
                   ChickenAndEgg.Box2DConsts.VELOCITY_ITERATION_COUNT,
                   ChickenAndEgg.Box2DConsts.POSITION_ITERATION_COUNT);
  this._world.ClearForces();
}