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
}
ChickenAndEgg.prototype.constructor = ChickenAndEgg;

/**
 * Various constants used to set up and run the Box2D simulation.
 * @enum {Object}
 */
ChickenAndEgg.Box2DConsts = {
  GRAVITY: {x: 0, y: 9.81},
  GROUND_DENSITY: 1.0,
  GROUND_FRICTION: 0.5,
  GROUND_RESTITUTION: 0.2,
  FRAME_RATE: 1/60.0,
  VELOCITY_ITERATION_COUNT: 10,
  POSITION_ITERATION_COUNT: 10
};

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

  // Set up the ground plane.
  var groundFixture = new Box2D.Dynamics.b2FixtureDef();
  groundFixture.density = ChickenAndEgg.Box2DConsts.GROUND_DENSITY;
  groundFixture.friction = ChickenAndEgg.Box2DConsts.GROUND_FRICTION;
  groundFixture.restitution = ChickenAndEgg.Box2DConsts.GROUND_RESTITUTION;
  groundFixture.shape = new Box2D.Collision.Shapes.b2PolygonShape();
  groundFixture.shape.SetAsBox(canvas.width / 2 / this._scale, 0.05);
  var groundBody = new Box2D.Dynamics.b2BodyDef();
  groundBody.type = Box2D.Dynamics.b2Body.b2_staticBody;
  groundBody.position.Set(canvas.width / 2 / this._scale,
                          canvas.height / this._scale);
  var ground = this._world.CreateBody(groundBody)
  ground.CreateFixture(groundFixture);
  ground.SetUserData(new PolyView(this._scale));

  // Set up the incline plane.
  var wedgeVertices = new Array();
  wedgeVertices.push(new Box2D.Common.Math.b2Vec2(0, 0));
  wedgeVertices.push(new Box2D.Common.Math.b2Vec2(3, 1));
  wedgeVertices.push(new Box2D.Common.Math.b2Vec2(0, 1));
  var fixtureDef = new Box2D.Dynamics.b2FixtureDef();
  fixtureDef.density = 1.0;
  fixtureDef.friction = 0.2;
  fixtureDef.restitution = 0.7;
  fixtureDef.shape = new Box2D.Collision.Shapes.b2PolygonShape();
  fixtureDef.shape.SetAsArray(wedgeVertices);
  var bodyDef = new Box2D.Dynamics.b2BodyDef();
  bodyDef.type = Box2D.Dynamics.b2Body.b2_staticBody;
  bodyDef.position.Set(0, (canvas.height / this._scale) - 1);
  var wedge = this._world.CreateBody(bodyDef);
  wedge.CreateFixture(fixtureDef);
  wedge.SetUserData(new PolyView(this._scale));

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
    var eggView = new EggView(this._scale);
    fixtureDef = new Box2D.Dynamics.b2FixtureDef();
    fixtureDef.density = 1.031;
    fixtureDef.friction = 0.3;
    fixtureDef.restitution = 0.3;
    fixtureDef.shape = new Box2D.Collision.Shapes.b2PolygonShape();
    fixtureDef.shape.SetAsArray(eggView.eggVertices(0.17));
    bodyDef = new Box2D.Dynamics.b2BodyDef();
    bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
    bodyDef.position.Set(0.1 * e, 0.2);
    eggBody = this._world.CreateBody(bodyDef)
    eggBody.CreateFixture(fixtureDef);
    eggBody.SetUserData(eggView);
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