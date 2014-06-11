/* Copyright 2014 (c) SoFIE Studios.  All rights reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview  The GamePiece class. The GamePiece class is mostly an abstract super-
 * class for all the in-game objects. A GamePiece provides a UUID for each instance.
 * At a minimum, subclasses should override these methods:
 *     GamePiece.prototype.getBodyDef = function() {}
 *     GamePiece.prototype.addFixturesToBody = function(simulation, body) {}
 *     GamePiece.prototype.loadView = function(simulation) {}
 */

/**
 * Constructor for the GamePiece.
 * @constructor
 */
GamePiece = function() {
  /**
   * The Box2D body that represents this game piece. Not valid until addToSimulation()
   * is called.
   * @type {Box2D.Dynamics.b2Body}
   * @private
   */
  this._body = null;

  /**
   * The view associated with this game piece. Set via the loadView() method.
   * @type {BodyView}
   * @public
   */
  this.view = null;

  /**
   * The UUID for this instance. Generated lazily.
   * @type {string}
   * @private
   */
  this._uuid = uuid();
}
GamePiece.prototype.constructor = GamePiece;

/**
 * Return the UUID for this instance.
 * @return {String} UUID
 */
GamePiece.prototype.uuid = function() {
  return this._uuid;
}

/**
 * Accessor for the Box2D body that represents this game piece. Not valid until after
 * addToSimulation() has returned.
 * @return {Box2D.Dynamics.b2Body} The Box2D body.
 */
GamePiece.prototype.body = function() {
  return this._body;
}

/**
 * Abstract method to process a "tick" in the game simulation. Subclasses should override
 * this to update any internal time-based state. Default implementation does nothing.
 * @param {number} gameTimeNow The wall-clock time when this function was called,
 *     measured in seconds since the "epoch" (Jan 1, 1970).
 * @param {number} gameTimeDelta The time since the last call to this method, measured in
 *     seconds.
 */
GamePiece.prototype.processGameTick = function(gameTimeNow, gameTimeDelta) {}

/**
 * Abstract method to create a Box2D body that represents this GamePiece. The returned
 * instance must have all the various dynamics attributes set. Subclasses should override
 * this method.
 * @return {Box2D.Dynamics.b2BodyDef} the Box2D body associated with this GamePiece.
 */
GamePiece.prototype.getBodyDef = function() { return null; }

/**
 * Abstract method to create and and add the Box2D fixtures used to represent the
 * geometry of this GamePiece.
 * @param {Object} simulation The simulation. This object is expected to implement these
 *     methods:
 *       world() The Box2D world
 *       worldSize() The size of the game board in Box2D world coordinates
 *       scale() The scale factor from CANVAS to Box2D world
 * @param {Box2D.Dynamics.b2Body} body The Box2D body. On return, this body will have
 *     all the GamePiece fixtures added to it.
 */
GamePiece.prototype.addFixturesToBody = function(simulation, body) {}

/**
 * Load the game piece's view and set the |view| object. On return, the |view| object
 * must point to a valid BodyView subclass. The default implementation sets the view
 * to a generic BodyView.
 * @param {Object} simulation The simulation. This object is expected to implement these
 *     methods:
 *       world() The Box2D world
 *       worldSize() The size of the game board in Box2D world coordinates
 *       scale() The scale factor from CANVAS to Box2D world
 * @return {BodyView} The BodyView subclass used to draw this GamePiece.
 */
GamePiece.prototype.loadView = function(simulation) {
  this.view = new BodyView();
}

/**
 * Draw the game piece geometry that is attached to it's Box2D body representation.
 * Game pieces that do not have a corresponding Box2D body representation can override
 * this method to do custom drawing.
 * @param {Context2D} ctx The 2D drawing context for the CANVAS.
 * @param {Object} simulation The simulation. This object is expected to implement these
 *     methods:
 *       world() The Box2D world
 *       worldSize() The size of the game board in Box2D world coordinates
 *       scale() The scale factor from CANVAS to Box2D world
 */
GamePiece.prototype.draw = function(ctx, simulation) {
  var b = this.body();
  if (b && b.IsActive()) {
    this.view.draw(ctx, b);
  }
}

/**
 * Return whether this game piece reports stats for the stats panel. Default
 * implementation returns false.
 * @return {boolean} whether this game piece reports stats.
 */
GamePiece.prototype.hasStats = function() {
  return false;
}

/**
 * Return the display name of this game piece. This is used for things like the stats
 * panel. Default implementation returns "<unnamed>".
 * @return {string} the display name of this game pieces.
 */
GamePiece.prototype.displayName = function() {
  return "<unnamed>";  // TODO(daves): localize this?
}

/**
 * Return the stats for this game piece, formatted for display. Default implementation
 * returns "0".
 * @return {string} the stats formatted for display.
 */
GamePiece.prototype.statsDisplayString = function() {
  return "0";
}

/**
 * Method to add this game piece to the Box2D world. Calls abstract methods to create
 * the Box2D body and fixture(s) that represent this GamePiece. Also calls the method to
 * add the BodyView subclass that draws this GamePiece and attaches that to the Box2D
 * definition. Subclasses should override methods to create the Box2D fixtures and the
 * body instead of this method. Note that a GamePiece is represented by one body, but
 * each body can have many fixtures.
 * @param {Object} simulation The simulation. This object is expected to implement these
 *     methods:
 *       world() The Box2D world
 */
GamePiece.prototype.addToSimulation = function(simulation) {
  var bodyDef = this.getBodyDef();
  if (bodyDef) {
    this._body = simulation.world().CreateBody(bodyDef);
    this.addFixturesToBody(simulation, this._body);
    this.loadView();
    this._body.SetUserData(this.uuid());
  } else {
    this._body = null;
  }
}

/**
 * Remove the game piece from the simulation. If the game piece is not a physically
 * active body, this method does nothing.
 * @param {Object} simulation The simulation. This object is expected to implement these
 *     methods:
 *       world() The Box2D world
 */
GamePiece.prototype.removeFromSimulation = function(simulation) {
  if (this.body()) {
    simulation.world().DestroyBody(this.body());
  }
}
