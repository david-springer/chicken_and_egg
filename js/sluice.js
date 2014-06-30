/* Copyright 2014 (c) SoFIE Studios.  All rights reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview  The Sluice class. The Sluice object implements the sluice which is a
 * series of stacked an offset teeter-totters. Each teeter-totter has a hinge with a
 * return spring on it, the egg can roll from one lever in the sluice to another. Each
 * lever in the sluice also has an exit path, so that the egg can fall into another game
 * object, such as the fry pan or the nest.
 */

/**
 * Constructor for the Sluice.
 * @constructor
 * @extends {GamePiece}
 */
Sluice = function() {
  GamePiece.call(this);

  /**
   * A collection of parts that need to be referenced outside of the builder in
   * addToSimulation(). Each element of the array is a dictionary that has the form:
   *   hingeTrack: The inactive geometry for the hinge track. The hinge pin "slides" in
   *       this track.
   *   hingePin: The geometry for the hinge pin. This is not drawn, but is needed when
   *      applying the return spring effect.
   *   sluice: The entire sluice lever geometry. This is drawn and used in collisions.
   *   sluiceHinge: The revolute joint for the sluice hinge.
   * @type {Array.Object}
   * @private
   */
  this._parts = new Array();
}
Sluice.prototype = new GamePiece();
Sluice.prototype.constructor = Sluice;

/**
 * The number of sluice levers.
 * @type {number}
 * @private
 */
Sluice._SLUICE_LEVER_COUNT = 3;

/**
 * The sluice hinge pin contexts. This value is used to determine if a fixture is one
 * of the sluice hinge pins. The length of this array must be _SLUICE_LEVER_COUNT.
 * @type {string}
 * @private
 */
Sluice._SLUICE_HINGE_PIN_CONTEXT = [
  "sluiceHingePinContext1",
  "sluiceHingePinContext2",
  "sluiceHingePinContext3"
];

/**
 * The origin in world coordinates of the sluice.
 * @type {Box2D.Common.Math.b2Vec2}
 */
Sluice.SLUICE_ORIGIN = new Box2D.Common.Math.b2Vec2(1.705, 1.46 - 0.015);

/**
 * The origins in local coordinates of the sluice levers. The length of this array must
 * be _SLUICE_LEVER_COUNT.
 * @type {Array.Box2D.Common.Math.b2Vec2}
 * @private
 */
Sluice._LEVER_ORIGINS = [
  new Box2D.Common.Math.b2Vec2(0, 0),
  new Box2D.Common.Math.b2Vec2(-0.65, -0.30),
  new Box2D.Common.Math.b2Vec2(0.65, -0.30)
];

/**
 * Half-width of the hinge track. measured in metres.
 * @type {number}
 * @private
 */
Sluice._HINGE_TRACK_HALF_WIDTH = 0.16;

/**
 * Draw the sluice.
 * @override
 */
Sluice.prototype.draw = function(ctx, simulation) {
  var drawSluicePart = function(ctx, b) {
    if (b.IsActive()) {
      b.GetUserData().draw(ctx, b);
    }
  }
  for (var i = 0; i < Sluice._SLUICE_LEVER_COUNT; ++i) {
    drawSluicePart(ctx, this._parts[i].hingeTrack);
    drawSluicePart(ctx, this._parts[i].sluice);
  }
}

/**
 * Return the index of the lever that contains the given Box2D fixture. If the fixture
 * does not have an identifying context attached as its user data, then return -1.
 * @param {Box2D.Dynamics.b2Fixture} fixture The fixture to test.
 * @return The index of the fixture in the _parts array.
 */
Sluice.prototype.leverIndexOfFixture = function(fixture) {
  var fixtureUserData = fixture.GetUserData();
  return Sluice._SLUICE_HINGE_PIN_CONTEXT.indexOf(fixtureUserData);
}

/**
 * Move the sluice lever and its hinge by the given amount. The translation is assumed to
 * be in world coordinates. The delta is limited to the extents of the hinge track.
 * @param {number} i The lever index.
 * @param {Box2D.Common.Math.b2Vec2} delta The relative amount to move the sluice.
 */
Sluice.prototype.moveLeverAtIndexBy = function(i, delta) {
  if (i < 0 || i >= Sluice._LEVER_ORIGINS.length) {
    return;
  }
  // Move the individual parts.
  var deltaX = Math.min(Math.max(delta.x, -Sluice._HINGE_TRACK_HALF_WIDTH),
      Sluice._HINGE_TRACK_HALF_WIDTH);
  var sluiceParts = this._parts[i];
  var newOrigin = new Box2D.Common.Math.b2Vec2(
      Sluice.SLUICE_ORIGIN.x + Sluice._LEVER_ORIGINS[i].x + deltaX,
      Sluice.SLUICE_ORIGIN.y + Sluice._LEVER_ORIGINS[i].y);
  sluiceParts.sluice.SetPosition(newOrigin);
  sluiceParts.hingePin.SetPosition(newOrigin);
}

/**
 * Return the lever origin in world coordinates.
 * @param {number} i The lever index.
 * @return {Box2D.Common.Math.b2Vec2} The lever origin.
 */
Sluice.prototype.leverWorldCoordinatesAtIndex = function(i) {
  if (i < 0 || i >= Sluice._LEVER_ORIGINS.length) {
    return new Box2D.Common.Math.b2Vec2(0, 0);
  }
  return new Box2D.Common.Math.b2Vec2(Sluice.SLUICE_ORIGIN.x + Sluice._LEVER_ORIGINS[i].x,
      Sluice.SLUICE_ORIGIN.x + Sluice._LEVER_ORIGINS[i].y);
}

/**
 * Method to add the coop door pieces to the Box2D world. Customise this method to create
 * three Box2D bodies that represent the coop door: the coop wall (static), the coop door
 * (dynamic, the swinging part) and the coop hinge.
 * @override
 */
Sluice.prototype.addToSimulation = function(simulation) {
  /**
   * Create the hinge track geometry. The hinge track is a slide for the hinge pin that
   * lets you move the sluice lever side-to-side.
   * @param {Box2D.Common.Math.b2Vec2} pinOrigin The hinge origin, relative to the
   *    centre of the sluice body.
   * @param {Object} fixtureDef The Box2D FixtureDef to use for the hinge geometry.
   * @return {Object} The Box2D Body representing the hinge geometry.
   */
  var hingeTrackAt = function(pinOrigin, fixtureDef) {
    var bodyDef = new Box2D.Dynamics.b2BodyDef();
    bodyDef.position.Set(Sluice.SLUICE_ORIGIN.x + pinOrigin.x,
        Sluice.SLUICE_ORIGIN.y + pinOrigin.y);
    bodyDef.type = Box2D.Dynamics.b2Body.b2_staticBody;
    var vertices = new Array()
    vertices.push(new Box2D.Common.Math.b2Vec2(-Sluice._HINGE_TRACK_HALF_WIDTH, 0.015));
    vertices.push(new Box2D.Common.Math.b2Vec2(-Sluice._HINGE_TRACK_HALF_WIDTH, -0.015));
    vertices.push(new Box2D.Common.Math.b2Vec2(Sluice._HINGE_TRACK_HALF_WIDTH, -0.015));
    vertices.push(new Box2D.Common.Math.b2Vec2(Sluice._HINGE_TRACK_HALF_WIDTH, 0.015));
    fixtureDef.shape.SetAsArray(vertices);
    var saveMaskBits = fixtureDef.filter.maskBits;
    fixtureDef.filter.maskBits = 0;  // Turn off collision.
    var hingeTrack = simulation.world().CreateBody(bodyDef);
    hingeTrack.SetUserData(new PolyView());
    hingeTrack.CreateFixture(fixtureDef);
    fixtureDef.filter.maskBits = saveMaskBits;
    return hingeTrack;
  };

  /**
   * Create hinge geometry. This is not drawn - it's here to implement the rotational
   * hinge with a return spring.
   * @param {Box2D.Common.Math.b2Vec2} pinOrigin The hinge origin, relative to the
   *    centre of the sluice body.
   * @param {Object} fixtureDef The Box2D FixtureDef to use for the hinge geometry.
   * @return {Object} The Box2D Body representing the hinge geometry.
   */
  var hingePinAt = function(pinOrigin, fixtureDef) {
    var bodyDef = new Box2D.Dynamics.b2BodyDef();
    bodyDef.position.Set(Sluice.SLUICE_ORIGIN.x + pinOrigin.x,
        Sluice.SLUICE_ORIGIN.y + pinOrigin.y);
    bodyDef.type = Box2D.Dynamics.b2Body.b2_kinematicBody;
    var vertices = new Array()
    vertices.push(new Box2D.Common.Math.b2Vec2(-0.015, 0.015));
    vertices.push(new Box2D.Common.Math.b2Vec2(-0.015, -0.015));
    vertices.push(new Box2D.Common.Math.b2Vec2(0.015, -0.015));
    vertices.push(new Box2D.Common.Math.b2Vec2(0.015, 0.015));
    fixtureDef.shape.SetAsArray(vertices);
    var saveMaskBits = fixtureDef.filter.maskBits;
    fixtureDef.filter.maskBits = 0;  // Turn off collision.
    var hingePin = simulation.world().CreateBody(bodyDef);
    hingePin.CreateFixture(fixtureDef);
    fixtureDef.filter.maskBits = saveMaskBits;
    return hingePin;
  };

  /**
   * Create the geometry for a sluice lever.
   * @param {Box2D.Common.Math.b2Vec2} leverOrigin The lever origin, relative to the
   *    centre of the sluice body.
   * @param {Object} fixtureDef The Box2D FixtureDef to use for the lever geometry.
   * @param {String} context The context data to assign to this hinge pin. Used for
   *     mouse picking.
   * @return {Object} The Box2D Body representing the lever geometry.
   */
  var sluiceLeverAt = function(leverOrigin, fixtureDef, context) {
    var bodyDef = new Box2D.Dynamics.b2BodyDef();
    bodyDef.position.Set(Sluice.SLUICE_ORIGIN.x + leverOrigin.x,
        Sluice.SLUICE_ORIGIN.y + leverOrigin.y);
    bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
    var sluiceLever = simulation.world().CreateBody(bodyDef);
    sluiceLever.SetUserData(new PolyView());
    // The centre wedge.
    sluiceVerts = new Array();
    sluiceVerts.push(new Box2D.Common.Math.b2Vec2(0.09, -0.06));
    sluiceVerts.push(new Box2D.Common.Math.b2Vec2(0.0, 0));
    sluiceVerts.push(new Box2D.Common.Math.b2Vec2(-0.09, -0.06));
    fixtureDef.shape.SetAsArray(sluiceVerts);
    var wedgeFixture = sluiceLever.CreateFixture(fixtureDef);
    wedgeFixture.SetUserData(context);
    // The left arm of the bar.
    var sluiceVerts = new Array();
    sluiceVerts.push(new Box2D.Common.Math.b2Vec2(-0.50, -0.06));
    sluiceVerts.push(new Box2D.Common.Math.b2Vec2(-0.50, -0.09));
    sluiceVerts.push(new Box2D.Common.Math.b2Vec2(-0.32, -0.105));
    sluiceVerts.push(new Box2D.Common.Math.b2Vec2(-0.32, -0.075));
    fixtureDef.shape.SetAsArray(sluiceVerts);
    sluiceLever.CreateFixture(fixtureDef);
    sluiceVerts = new Array();
    sluiceVerts.push(new Box2D.Common.Math.b2Vec2(-0.32, -0.075));
    sluiceVerts.push(new Box2D.Common.Math.b2Vec2(-0.32, -0.105));
    sluiceVerts.push(new Box2D.Common.Math.b2Vec2(-0.26, -0.105));
    sluiceVerts.push(new Box2D.Common.Math.b2Vec2(-0.26, -0.075));
    fixtureDef.shape.SetAsArray(sluiceVerts);
    sluiceLever.CreateFixture(fixtureDef);
    sluiceVerts = new Array();
    sluiceVerts.push(new Box2D.Common.Math.b2Vec2(-0.26, -0.075));
    sluiceVerts.push(new Box2D.Common.Math.b2Vec2(-0.26, -0.105));
    sluiceVerts.push(new Box2D.Common.Math.b2Vec2(-0.09, -0.09));
    sluiceVerts.push(new Box2D.Common.Math.b2Vec2(-0.09, -0.06));
    fixtureDef.shape.SetAsArray(sluiceVerts);
    sluiceLever.CreateFixture(fixtureDef);
    sluiceVerts = new Array();
    sluiceVerts.push(new Box2D.Common.Math.b2Vec2(-0.09, -0.06));
    sluiceVerts.push(new Box2D.Common.Math.b2Vec2(-0.09, -0.09));
    sluiceVerts.push(new Box2D.Common.Math.b2Vec2(0.09, -0.09));
    sluiceVerts.push(new Box2D.Common.Math.b2Vec2(0.09, -0.06));
    fixtureDef.shape.SetAsArray(sluiceVerts);
    sluiceLever.CreateFixture(fixtureDef);
    sluiceVerts = new Array();
    sluiceVerts.push(new Box2D.Common.Math.b2Vec2(0.09, -0.06));
    sluiceVerts.push(new Box2D.Common.Math.b2Vec2(0.09, -0.09));
    sluiceVerts.push(new Box2D.Common.Math.b2Vec2(0.26, -0.105));
    sluiceVerts.push(new Box2D.Common.Math.b2Vec2(0.26, -0.075));
    fixtureDef.shape.SetAsArray(sluiceVerts);
    sluiceLever.CreateFixture(fixtureDef);
    sluiceVerts = new Array();
    sluiceVerts.push(new Box2D.Common.Math.b2Vec2(0.26, -0.075));
    sluiceVerts.push(new Box2D.Common.Math.b2Vec2(0.26, -0.105));
    sluiceVerts.push(new Box2D.Common.Math.b2Vec2(0.32, -0.105));
    sluiceVerts.push(new Box2D.Common.Math.b2Vec2(0.32, -0.075));
    fixtureDef.shape.SetAsArray(sluiceVerts);
    sluiceLever.CreateFixture(fixtureDef);
    sluiceVerts = new Array();
    sluiceVerts.push(new Box2D.Common.Math.b2Vec2(0.32, -0.075));
    sluiceVerts.push(new Box2D.Common.Math.b2Vec2(0.32, -0.105));
    sluiceVerts.push(new Box2D.Common.Math.b2Vec2(0.50, -0.09));
    sluiceVerts.push(new Box2D.Common.Math.b2Vec2(0.50, -0.06));
    fixtureDef.shape.SetAsArray(sluiceVerts);
    sluiceLever.CreateFixture(fixtureDef);
    return sluiceLever;
  };

  /**
   * Create the revolute joint that represents the hinge. The hinge joins the two given
   * bodies at their respective origins.
   * @param {Object} hingePin The Box2D Body that represents the hinge pin.
   * @param {Object} leverBody The Box2D Body that represents the lever.
   * @return {Object} The Box2D Joint representing the hinge.
   */
  var createHinge = function(hingePin, leverBody) {
    var jointDef = new Box2D.Dynamics.Joints.b2RevoluteJointDef();
    jointDef.bodyA = hingePin;
    jointDef.bodyB = leverBody;
    jointDef.localAnchorA.Set(0, 0);
    jointDef.localAnchorB.Set(0, 0);
    jointDef.collideConnected = false;
    jointDef.lowerAngle = -Math.PI / 4;
    jointDef.upperAngle = Math.PI / 4;
    jointDef.enableLimit = true;
    return simulation.world().CreateJoint(jointDef);
  };

  // Create the static coop wall.
  var sluiceFixtureDef = new Box2D.Dynamics.b2FixtureDef();
  sluiceFixtureDef.density = ChickenAndEgg.Box2DConsts.DOUG_FIR_DENSITY;
  sluiceFixtureDef.friction = ChickenAndEgg.Box2DConsts.DOUG_FIR_FRICTION;
  sluiceFixtureDef.restitution = ChickenAndEgg.Box2DConsts.DOUG_FIR_RESTITUTION;
  sluiceFixtureDef.shape = new Box2D.Collision.Shapes.b2PolygonShape();

  /**
   * Create the various sluice parts for lever i. Returns a dict populated with the
   * Box2D bodies and joints.
   * @param {number} i The lever index.
   * @param {Object} fixtureDef The Box2D FixtureDef to use for the lever geometry.
   * @return {Object} A dict populated with the sluice lever parts.
   */
  var createPartsAtIndex = function(i, sluiceFixtureDef) {
    var hingePin = hingePinAt(Sluice._LEVER_ORIGINS[i], sluiceFixtureDef)
    var sluice = sluiceLeverAt(Sluice._LEVER_ORIGINS[i], sluiceFixtureDef,
          Sluice._SLUICE_HINGE_PIN_CONTEXT[i]);
    return {
      hingeTrack: hingeTrackAt(Sluice._LEVER_ORIGINS[i], sluiceFixtureDef),
      hingePin: hingePin,
      sluice: sluice,
      sluiceHinge: createHinge(hingePin, sluice)
    };
  }
  for (var i = 0; i < Sluice._SLUICE_LEVER_COUNT; ++i) {
    this._parts[i] = createPartsAtIndex(i, sluiceFixtureDef);
  }
}

/**
 * Apply Hooke's law dampening to the sluice lever hinges.
 * @override
 */
Sluice.prototype.processGameTick = function(gameTimeNow, gameTimeDelta) {
  var applyHookesLawToHinge = function(hinge, leverBody) {
    var hingeAngle = hinge.GetJointAngle();
    var hingeVel = hinge.GetJointSpeed();
    if (Math.abs(hingeAngle) > 0.0001) {
      leverBody.ApplyTorque(-hingeAngle * 0.05 - hingeVel * 0.02);
    }
  };
  for (var i = 0; i < Sluice._SLUICE_LEVER_COUNT; ++i) {
    applyHookesLawToHinge(this._parts[i].sluiceHinge, this._parts[i].sluice);
  }
}
