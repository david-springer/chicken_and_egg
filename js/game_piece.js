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
 *     GamePiece.prototype.getView = function(simulation) {}
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
   * The UUID for this instance. Generated lazily.
   * @type {string}
   * @private
   */
  this._uuid = null;
}
GamePiece.prototype.constructor = GamePiece;

/**
 * Return the UUID for this instance.
 * @return {String} UUID
 */
GamePiece.prototype.getUuid = function() {
  if (!this._uuid) {
    this._uuid = uuid();
  }
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
GamePiece.prototype.getBodyDef = function() {}

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
 * Abstract method to create and return the view used to draw this game piece.
 * @param {Object} simulation The simulation. This object is expected to implement these
 *     methods:
 *       world() The Box2D world
 *       worldSize() The size of the game board in Box2D world coordinates
 *       scale() The scale factor from CANVAS to Box2D world
 * @return {BodyView} The BodyView subclass used to draw this GamePiece.
 */
GamePiece.prototype.getView = function(simulation) {}

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
 *       worldSize() The size of the game board in Box2D world coordinates
 *       scale() The scale factor from CANVAS to Box2D world
 */
GamePiece.prototype.addToSimulation = function(simulation) {
  var bodyDef = this.getBodyDef();
  this._body = simulation.world().CreateBody(bodyDef);
  this.addFixturesToBody(simulation, this._body);
  this._body.SetUserData(this.getView(simulation));
}
