/* Copyright 2014 (c) SoFIE Studios.  All rights reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview  Implement the contact listener. The contact listener detects when
 * things hit various game pieces and processes them accordingly. For example, if an egg
 * hits the ground, it is removed from the game. If an egg hits the fry pan, the frying
 * sequence starts; if an egg hits the carton, it is added to the carton; if an egg hits
 * the nest, the hatching sequence starts.
 * Requires Box2Dweb.min.js: http://box2dweb.googlecode.com/svn/trunk/Box2d.min.js
 */

/**
 * Constructor for the ContactListener.
 * @param {Object} delegate The delegate.
 * @constructor
 * @extends {Box2D.Dynamics.b2ContactListener}
 */
var ContactListener = function(delegate) {
  Box2D.Dynamics.b2ContactListener.call(this);
  this._delegate = delegate;
}
ContactListener.prototype = new Box2D.Dynamics.b2ContactListener();
ContactListener.prototype.constructor = ContactListener;

/**
 * Get the delegate
 * @return {Object} the delegate.
 */
ContactListener.prototype.delegate = function() {
  return this._delegate;
}

/**
 * Set the delegate
 * @param {Object} delegate The new delegate.
 */
ContactListener.prototype.setDelegate = function(delegate) {
  this._delegate = delegate;
}

/**
 * Handle the initial contact of two objects. Schedules game pieces for removal.
 * @override
 */
ContactListener.prototype.BeginContact = function(contact) {
  var bodyA = contact.GetFixtureA().GetBody();
  var bodyB = contact.GetFixtureB().GetBody();
  if (this._delegate && this._delegate.gamePiecesWillCollide) {
    this._delegate.gamePiecesWillCollide(
        contact, bodyA.GetUserData(), bodyB.GetUserData());
  }
}

