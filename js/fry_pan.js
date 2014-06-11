/* Copyright 2014 (c) SoFIE Studios.  All rights reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview  The FryPan class. The FryPan object implements all the behaviour of a
 * fry pan:
 *   The fry pan has a maximum capacity of {@code MAX_EGG_COUNT} eggs.
 *   A fry pan starts empty.
 *   As soon as an egg is added to the fry pan, it begins to cook. When the egg is fried,
 *     the {@code DID_FRY_EGG_NOTIFICATION} is posted.
 */

/**
 * Constructor for the FryPan.
 * @constructor
 * @extends {GamePiece}
 */
FryPan = function() {
  GamePiece.call(this);
  /**
   * The time in seconds that an egg takes to cook. If this value is 0, the egg
   * fries immediately. Can be set for testing.
   * @type {number}
   * @private
   */
  this._fryInterval = FryPan.FRY_INTERVAL;
  /**
   * Array of eggs being cooked. The elements in the array contain the egg UUIDs and the
   * amount of time each egg has been cooked so far.
   * @type {Array.<Object>}
   * @private
   */
  this._eggs = new Array();
}
FryPan.prototype = new GamePiece();
FryPan.prototype.constructor = Nest;

/**
 * Default frying time, measured in seconds.
 * @type {number}
 */
FryPan.FRY_INTERVAL = 60.0;

/**
 * Maximum number of eggs that can go in the pan.
 * @type {number}
 */
FryPan.MAX_EGG_COUNT = 2;

/**
 * Notification sent when the egg is cooked.
 * @type {String}
 */
FryPan.DID_FRY_EGG_NOTIFICATION = 'didFryEggNotification';

/**
 * Number of eggs in the pan.
 * @return {number} egg count.
 */
FryPan.prototype.eggCount = function() {
  return this._eggs.length;
}

/**
 * The time spent frying all eggs in the pan so far. Returns an array of length 0 if the
 * pan is empty.
 * @return The array of frying times.
 */
FryPan.prototype.fryingTimes = function() {
  var fryingTimes = new Array();
  for (var i = 0; i < this._eggs.length; ++i) {
    fryingTimes.push(this._eggs[i].fryingTime);
  }
  return fryingTimes;
}

/**
 * Add an egg. If there is already an egg in the fry pan, does nothing.
 * @param {Egg} egg The egg game piece to add. The egg must respond to the uuid()
 * method.
 * @return {boolean} if adding the egg was successful.
 */
FryPan.prototype.addEgg = function(egg) {
  if (this.eggCount() == FryPan.MAX_EGG_COUNT) {
    return false;
  }
  var eggUuid = egg.uuid();
  for (var i = 0; i < this._eggs.length; ++i) {
    if (this._eggs[i].uuid === eggUuid)
      // Egg already exists.
      return false;
  }
  this._eggs.push({uuid: eggUuid, fryingTime: 0.0});
  return true;
}

/**
 * Cook and possibly finish frying an egg.
 * @override
 */
FryPan.prototype.processGameTick = function(gameTimeNow, gameTimeDelta) {
  if (this.eggCount() == 0) {
    return;
  }
  // Create an "index set" of eggs to fry. Do this so the _eggs array isn't mutated in
  // the loop.
  var uuids = new Array();
  for (var i = 0; i < this._eggs.length; ++i) {
    var egg = this._eggs[i];
    egg.fryingTime += gameTimeDelta;
    if (egg.fryingTime >= this._fryInterval) {
      uuids.push(egg.uuid);
    }
  }
  this._fryEggsWithUuids(uuids);
}

/**
 * Fries the egg by posting the {@code DID_FRY_EGG_NOTIFICATION} notification. Removes
 * the egg that just got fried from the list of frying times.
 * @param {Array.<number>} fryIndexSet The set of indices of eggs to fry.
 * @private
 */
FryPan.prototype._fryEggsWithUuids = function(uuids) {
  if (uuids.length == 0) {
    return;  // No eggs to fry.
  }
  for (var i = 0; i < uuids.length; ++i) {
    for (var eggIdx = 0; eggIdx < this._eggs.length; ++eggIdx) {
      if (this._eggs[eggIdx].uuid === uuids[i]) {
        this._eggs.splice(eggIdx, 1);
        break;
      }
    }
    NotificationDefaultCenter().postNotification(FryPan.DID_FRY_EGG_NOTIFICATION, this);
  }
}

/**
 * Allocate the Box2D body definition for this fry pan.
 * @override
 */
FryPan.prototype.getBodyDef = function() {
  bodyDef = new Box2D.Dynamics.b2BodyDef();
  bodyDef.type = Box2D.Dynamics.b2Body.b2_staticBody;
  bodyDef.position.Set(Sluice.SLUICE_ORIGIN.x + 0.425, 1.0);
  return bodyDef;
}

/**
 * Add geometry for a fry pan.
 * @override
 */
FryPan.prototype.addFixturesToBody = function(simulation, body) {
  var fixtureDef = new Box2D.Dynamics.b2FixtureDef();
  fixtureDef.density = 7.3;  // Density of cast iron.
  fixtureDef.friction = 0.1;
  fixtureDef.restitution = 0.1;
  fixtureDef.shape = new Box2D.Collision.Shapes.b2PolygonShape();
  var fryPanVerts = new Array();
  fryPanVerts.push(new Box2D.Common.Math.b2Vec2(-0.16, -0.01));
  fryPanVerts.push(new Box2D.Common.Math.b2Vec2(0.16, -0.01));
  fryPanVerts.push(new Box2D.Common.Math.b2Vec2(0.16, 0));
  fryPanVerts.push(new Box2D.Common.Math.b2Vec2(-0.16, 0));
  fixtureDef.shape.SetAsArray(fryPanVerts);
  body.CreateFixture(fixtureDef);
  fryPanVerts = new Array();
  fryPanVerts.push(new Box2D.Common.Math.b2Vec2(-0.16, -0.01));
  fryPanVerts.push(new Box2D.Common.Math.b2Vec2(-0.16, 0));
  fryPanVerts.push(new Box2D.Common.Math.b2Vec2(-0.16 - 0.015, 0.065));
  fryPanVerts.push(new Box2D.Common.Math.b2Vec2(-0.16 - 0.025, 0.065));
  fixtureDef.shape.SetAsArray(fryPanVerts);
  body.CreateFixture(fixtureDef);
  fryPanVerts = new Array();
  fryPanVerts.push(new Box2D.Common.Math.b2Vec2(0.16, -0.01));
  fryPanVerts.push(new Box2D.Common.Math.b2Vec2(0.16, 0));
  fryPanVerts.push(new Box2D.Common.Math.b2Vec2(0.16 + 0.015, 0.065));
  fryPanVerts.push(new Box2D.Common.Math.b2Vec2(0.16 + 0.025, 0.065));
  fixtureDef.shape.SetAsArray(fryPanVerts);
  body.CreateFixture(fixtureDef);
  fryPanVerts = new Array();
  fryPanVerts.push(new Box2D.Common.Math.b2Vec2(-0.16 - 0.025, 0.065 - 0.01));
  fryPanVerts.push(new Box2D.Common.Math.b2Vec2(-0.16 - 0.025 - 0.13, 0.065));
  fryPanVerts.push(new Box2D.Common.Math.b2Vec2(-0.16 - 0.025 - 0.13, 0.075));
  fryPanVerts.push(new Box2D.Common.Math.b2Vec2(-0.16 - 0.025, 0.065));
  fixtureDef.shape.SetAsArray(fryPanVerts);
  body.CreateFixture(fixtureDef);
}

/**
 * Return a new PolyView.
 * @override
 */
FryPan.prototype.loadView = function(simulation) {
  this.view = new PolyView();
}

/**
 * The fry pan reports stats.
 * @override
 */
FryPan.prototype.hasStats = function() {
  return true;
}

/**
 * Return the display name.
 * @override
 */
FryPan.prototype.displayName = function() {
  return "Egg fry %:";  // TODO(daves): localize this?
}

/**
 * Return the stats for this game piece.
 * @override
 */
FryPan.prototype.statsDisplayString = function() {
  var statString = "";
  var connector = "";
  for (var i = 0; i < FryPan.MAX_EGG_COUNT; ++i) {
    if (i < this._eggs.length) {
      var fryPercent = (this._eggs[i].fryingTime / this._fryInterval * 100.0);
      statString += connector + fryPercent.toPrecision(4);
    } else {
      statString += connector + "--.--";
    }
    statString += "%";
    connector = ", ";
  }
  return statString;
}
