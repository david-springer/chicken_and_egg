/* Copyright 2014 (c) SoFIE Studios.  All rights reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview  The GamePiece class. The GamePiece class is mostly an abstract super-
 * class for all the in-game objects. A GamePiece provides a UUID for each instance.
 */

/**
 * Constructor for the GamePiece.
 * @constructor
 */
GamePiece = function() {
  /**
   * The UUID for this instance. Generated lazily.
   * @type {number}
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
 * Abstract method to process a "tick" in the game simulation. Subclasses should override
 * this to update any internal time-based state. Default implementation does nothing.
 * @param {number} gameTimeNow The wall-clock time when this function was called,
 *     measured in seconds since the "epoch" (Jan 1, 1970).
 * @param {number} gameTimeDelta The time since the last call to this method, measured in
 *     seconds.
 */
GamePiece.prototype.processGameTick = function(gameTimeNow, gameTimeDelta) {}
