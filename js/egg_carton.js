/* Copyright 2014 (c) SoFIE Studios.  All rights reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview  The EggCarton class. The EggCarton object implements all the
 * behaviour of an egg crate:
 *   The egg crate has a maximum capacity of one dozen eggs.
 *   An egg crate starts out empty.
 *   When the egg crate is filled, it posts the {@code DID_FILL_CRATE_NOTIFICATION}.
 */

/**
 * Constructor for the EggCarton.
 * @constructor
 */
EggCarton = function() {
  GamePiece.call(this);
  /**
   * Number of eggs in the crate.
   * @type {Number}
   * @private
   * @readonly
   */
  this._eggCount = 0;
}
EggCarton.prototype = new GamePiece();
EggCarton.prototype.constructor = EggCarton;

/**
 * The origin in world coordinates of the egg carton.
 * @type {Box2D.Common.Math.b2Vec2}
 */
EggCarton.EGG_CARTON_ORIGIN = new Box2D.Common.Math.b2Vec2(1.70, 0.70);
EggCarton.IMAGE_ORIGIN = new Box2D.Common.Math.b2Vec2(1.40, 0.45);
EggCarton.IMAGE_WIDTH = 0.65;

/**
 * The maximum number of eggs that can go in a crate.
 */
EggCarton.MAX_EGG_COUNT = 12;

/**
 * Notification sent when a egg is laid.
 * @type {string}
 */
EggCarton.DID_FILL_CARTON_NOTIFICATION = 'didFillCartonNotification';

/**
 * The number of eggs in the crate. In range [0..{@code MAX_EGG_COUNT}].
 * @return {number} number of eggs.
 */
EggCarton.prototype.eggCount = function() {
  return this._eggCount;
}

/**
 * Exposed for testing. Do not use.
 * @param {number} eggCount The new egg count.
 */
EggCarton.prototype.setEggCount = function(eggCount) {
  this._eggCount = eggCount;
}

/**
 * Set the egg count in the associated view.
 * @private
 */
EggCarton.prototype._setViewEggCount = function() {
  if (this.view) {
    this.view.eggCount = this._eggCount;
  }
}

/**
 * Add an egg to the crate. If the crate is full, does nothing and returns {@code false}.
 * @return {boolean} whether the egg was successfully added.
 */
EggCarton.prototype.addEgg = function() {
  if (this._eggCount == EggCarton.MAX_EGG_COUNT) {
    return false;
  }
  this._eggCount++;
  this._setViewEggCount(this._eggCount);
  if (this._eggCount == EggCarton.MAX_EGG_COUNT) {
    NotificationDefaultCenter().postNotification(
        EggCarton.DID_FILL_CARTON_NOTIFICATION, this);
  }
  return true;
}

/**
 * Reset the crate by emptying out all the eggs. Resets the egg count back to 0.
 */
EggCarton.prototype.reset = function() {
  this._eggCount = 0;
  this._setViewEggCount(this._eggCount);
}

/**
 * Allocate the Box2D body definition for this egg carton.
 * @override
 */
EggCarton.prototype.getBodyDef = function() {
  bodyDef = new Box2D.Dynamics.b2BodyDef();
  bodyDef.type = Box2D.Dynamics.b2Body.b2_staticBody;
  bodyDef.position.Set(EggCarton.EGG_CARTON_ORIGIN.x, EggCarton.EGG_CARTON_ORIGIN.y);
  return bodyDef;
}

/**
 * Add geometry for an egg carton.
 * @override
 */
EggCarton.prototype.addFixturesToBody = function(simulation, body) {
  var fixtureDef = new Box2D.Dynamics.b2FixtureDef();
  fixtureDef.density = 0.7;  // Density of cardboard in g/cm^3
  fixtureDef.friction = 0.1;
  fixtureDef.restitution = 0.1;
  fixtureDef.shape = new Box2D.Collision.Shapes.b2PolygonShape();
  var cartonVerts = new Array();
  cartonVerts.push(new Box2D.Common.Math.b2Vec2(-0.15, -0.01));
  cartonVerts.push(new Box2D.Common.Math.b2Vec2(0.15, -0.01));
  cartonVerts.push(new Box2D.Common.Math.b2Vec2(0.15, 0));
  cartonVerts.push(new Box2D.Common.Math.b2Vec2(-0.15, 0));
  fixtureDef.shape.SetAsArray(cartonVerts);
  body.CreateFixture(fixtureDef);
  cartonVerts = new Array();
  cartonVerts.push(new Box2D.Common.Math.b2Vec2(-0.16, -0.01));
  cartonVerts.push(new Box2D.Common.Math.b2Vec2(-0.15, -0.01));
  cartonVerts.push(new Box2D.Common.Math.b2Vec2(-0.15, 0.10));
  cartonVerts.push(new Box2D.Common.Math.b2Vec2(-0.16, 0.10));
  fixtureDef.shape.SetAsArray(cartonVerts);
  body.CreateFixture(fixtureDef);
  cartonVerts = new Array();
  cartonVerts.push(new Box2D.Common.Math.b2Vec2(0.15, -0.01));
  cartonVerts.push(new Box2D.Common.Math.b2Vec2(0.16, -0.01));
  cartonVerts.push(new Box2D.Common.Math.b2Vec2(0.16, 0.10));
  cartonVerts.push(new Box2D.Common.Math.b2Vec2(0.15, 0.10));
  fixtureDef.shape.SetAsArray(cartonVerts);
  body.CreateFixture(fixtureDef);
}

/**
 * Return a new PolyView.
 * @override
 */
EggCarton.prototype.loadView = function(simulation) {
  var cartonView = new EggCartonView();
  cartonView.setOrigin(EggCarton.IMAGE_ORIGIN);
  cartonView.setWidth(EggCarton.IMAGE_WIDTH);
  cartonView.init();
  this.view = cartonView;
  this._setViewEggCount(this._eggCount);
}
