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
  GRAVITY: {x: 0, y: -9.81},
  FRAME_RATE: 1/60.0,
  VELOCITY_ITERATION_COUNT: 10,
  POSITION_ITERATION_COUNT: 10,
  DOUG_FIR_DENSITY: 5.3,  // Density of Douglas Fir in g/cm^3
  DOUG_FIR_FRICTION: 0.3,
  DOUG_FIR_RESTITUTION: 0.804
};

/**
 * Constants used to refer to the DOM.
 * @enum {string}
 */
ChickenAndEgg.DOMConsts = {
  BODY: 'body,html'
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
  // Bind the mouse-down event to the BODY element. This ensures that the conditionally-
  // bound mouse-up event will fire properly.
  $(ChickenAndEgg.DOMConsts.BODY).mousedown(this._mouseDown.bind(this));
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
  this._scale = canvas.width / 4;  // 4m wide simulation.
  this._worldSize = new Box2D.Common.Math.b2Vec2(canvas.width / this._scale,
                                                 canvas.height / this._scale);
  var roost = new Roost();
  roost.addToSimulation(this);
  var ground = new Ground();
  ground.addToSimulation(this);
  var sluice = new Sluice();
  sluice.addToSimulation(this);
  var coopDoor = new CoopDoor();
  coopDoor.addToSimulation(this);

  for (var e = 0; e < 20; e++) {
    var egg = new Egg(0.1 * e, this._worldSize.y - 0.02);
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
  // Set up the root transform of the CANVAS such that origin is in the lower-left corner,
  // y is positive upwards and the scale is in meters.
  ctx.save();
  ctx.translate(0, canvas.height);
  ctx.scale(this._scale, -this._scale);
  // Hack to deal with weird fact that CANVAS scales the line width.
  ctx.lineWidth = ctx.lineWidth / this._scale;
  for (var b = this._world.GetBodyList(); b; b = b.m_next) {
    if (b.IsActive() &&
        typeof b.GetUserData() !== 'undefined' &&
        b.GetUserData() != null) {
        b.GetUserData().draw(ctx, b);
    }
  }
  ctx.restore();
}

/**
 * Run a simulation tick, then schedule the next one.
 */
ChickenAndEgg.prototype.simulationTick = function() {
  this._world.Step(ChickenAndEgg.Box2DConsts.FRAME_RATE,
                   ChickenAndEgg.Box2DConsts.VELOCITY_ITERATION_COUNT,
                   ChickenAndEgg.Box2DConsts.POSITION_ITERATION_COUNT);
  this._world.ClearForces();
}

/**
 * Handle the mouse-down event. Convert the event into Box2D coordinates and issue a
 * hit-detection. If the sluice handle is hit, start the handle-drag sequence.
 * @param {Event} event The mouse-down event. page{X|Y} is normalized by jQuery.
 * @private
 */
ChickenAndEgg.prototype._mouseDown = function(event) {
  console.log('mousedown (' + event.pageX + ', ' + event.pageY + ')');
  $(ChickenAndEgg.DOMConsts.BODY)
      .mousemove(this._mouseDrag.bind(this))
      .mouseup(this._mouseUp.bind(this));
}

/**
 * Handle the mouse-drag event. Compute the angle formed by the mouse point and the
 * origin of the sluice, and rotate the sluice by that angle.
 * @param {Event} event The mouse-down event. page{X|Y} is normalized by jQuery.
 * @private
 */
ChickenAndEgg.prototype._mouseDrag = function(event) {
  console.log('mousemove (' + event.pageX + ', ' + event.pageY + ')');
}

/**
 * Handle the mouse-up event. End the sluice drag sequence.
 * @param {Event} event The mouse-down event. page{X|Y} is normalized by jQuery.
 * @private
 */
ChickenAndEgg.prototype._mouseUp = function(event) {
  console.log('mouseup (' + event.pageX + ', ' + event.pageY + ')');
  $(ChickenAndEgg.DOMConsts.BODY).unbind('mousemove');
}
