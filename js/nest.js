/* Copyright 2014 (c) SoFIE Studios.  All rights reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview  The Nest class. The Nest object implements all the behaviour of a nest:
 *   The nest has a maximum capacity of 1 egg.
 *   A nest starts empty.
 *   You can only add an egg to an empty nest.
 *   As soon as an egg is added to the nest, it begins to hatch. When the egg hatches,
 *     the {@code DID_HATCH_EGG_NOTIFICATION} is posted.
 */

/**
 * Constructor for the Nest.
 * @constructor
 * @extends {GamePiece}
 */
Nest = function() {
  GamePiece.call(this);
  /**
   * Number of eggs in the nest.
   * @type {number}
   * @private
   */
  this._eggCount = 0;
  /**
   * The time in seconds that an egg takes to incubate. If this value is 0, the egg
   * incubates and hatches immediately. Can be set for testing.
   * @type {number}
   * @private
   */
  this._incubationInterval = Nest.INCUBATION_INTERVAL;
  /**
   * The amount of time spent incubating the egg, in seconds. This value is modified
   * during successive calls to processGameTick(). When it reaches
   * {@code INCUBATION_INTERVAL}, the egg hatches. Has a value of 0 when the nest is empty.
   * @type {number}
   * @private
   */
  this._incubationTime = 0.0;
}
Nest.prototype = new GamePiece();
Nest.prototype.constructor = Nest;

/**
 * Default incubation time, measured in seconds.
 * @type {number}
 */
Nest.INCUBATION_INTERVAL = 30.0;

/**
 * Notification sent when the egg hatches.
 * @type {String}
 */
Nest.DID_HATCH_EGG_NOTIFICATION = 'didHatchEggNotification';

/**
 * Whether there is an egg in the nest.
 * @return {boolean} egg exists.
 */
Nest.prototype.hasEgg = function() {
  return this._eggCount > 0;
}

/**
 * The time spent incubating so far. Returns 0 if the nest is empty.
 * @return The incubation time.
 */
Nest.prototype.incubationTime = function() {
  return this._incubationTime;
}

/**
 * Add an egg. If there is already an egg in the nest, does nothing.
 * @return {boolean} if adding the egg was successful.
 */
Nest.prototype.addEgg = function() {
  if (this.hasEgg()) {
    return false;
  }
  this._eggCount = 1;
  this._incubationTime = 0.0;
  return true;
}

/**
 * Incubate and possibly hatch the egg.
 * @override
 */
Nest.prototype.processGameTick = function(gameTimeNow, gameTimeDelta) {
  if (!this.hasEgg()) {
    return;
  }
  this._incubationTime += gameTimeDelta;
  if (this._incubationTime >= this._incubationInterval) {
    this._hatchEgg();
  }
}

/**
 * Hatches the egg by posting the {@code DID_HATCH_EGG_NOTIFICATION} notification. Resets
 * the nest to the empty state.
 * @private
 */
Nest.prototype._hatchEgg = function() {
  this._eggCount = 0;
  this._incubationTime = 0.0;
  NotificationDefaultCenter().postNotification(Nest.DID_HATCH_EGG_NOTIFICATION, this);
}