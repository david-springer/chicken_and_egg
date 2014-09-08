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
  /**
   * All the game pieces. These are each called to process a simulation tick.
   * @type {Array.GamePiece}
   * @private
   */
  this._gamePieces = new Array();
  /**
   * The list of UUIDs that need to be removed at the end of a simulation tick. These are
   * typically eggs that have hit the ground, or got fried, or left the game in some way.
   * This array is cleared out at the end of each simulation tick. Add a UUID with the
   * releaseGamePieceWithUuid() method.
   * @type {Array.GamePiece}
   * @private
   */
  this._deactiveGamePieces = new Array();
  /**
   * The timestamp for the previous simulation tick, measured in seconds.
   * @type {number}
   * @private
   */
  this._lastSimTime = 0.0;
  /**
   * Bit to indicate that the game is still running. When this bit is cleared, the game
   * heartbeat stops.
   * @type {boolean}
   * @private
   */
  this._isRunning = false;
  /**
   * Chickens that have hatched but are not active layers yet. Whenever a laying hen
   * dies (lays all her eggs), one of these pullets takes her place. When there are no
   * more pullets left, the game ends as soon as the current laying hen dies.
   * @type {Array.Chicken}
   * @private
   */
  this._pullets = new Array();
  /**
   * The game piece that is responding to mouse events.
   * @type {GamePiece}
   * @private
   */
  this._firstResponder = null;
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
  DOUG_FIR_FRICTION: 0.2,
  DOUG_FIR_RESTITUTION: 0.804
};

/**
 * Maximum number of pullets that can be alive at any one time.
 * @type {number}
 */
ChickenAndEgg.MAX_PULLET_COUNT = 6;

/**
 * Constants used to refer to the DOM.
 * @enum {string}
 * @private
 */
ChickenAndEgg._DOMConsts = {
  BODY: 'body'
};

/**
 * Limits for things like the sluice angle and other game objects.
 * @enum {Object}
 * @private
 */
ChickenAndEgg._Limits = {
  SLUICE_MAX_ANGLE: Math.PI / 6.0,
  SLUICE_MIN_ANGLE: -Math.PI / 6.0
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
  // Bind the mouse-down event to the CANVAS element. This ensures that the conditionally-
  // bound mouse-up event will fire properly.
  $(this._canvas).mousedown(this._mouseDown.bind(this));
  this.initWorld(this._canvas);
  var heartbeat = function() {
    if (!this._isRunning) {
      alert('Game over!');
      return;  // Stop the game.
    }
    this.simulationTick();
    this.clearCanvas(this._canvas);
    this.drawWorld(this._canvas);
    window.wrappedRequestAnimationFrame(heartbeat.bind(this));
  };
  this._lastSimTime = Date.now() / 1000.0;
  this._isRunning = true;
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
  this._world.SetContactListener(new ContactListener(this));
  this._farmer = new Farmer();
  this._gamePieces.push(this._farmer);
  this._ground = new Ground();
  this._gamePieces.push(this._ground);  
  var roost = new Roost();
  this._gamePieces.push(roost);
  this._sluice = new Sluice();
  this._gamePieces.push(this._sluice);
  this._coopDoor = new CoopDoor();
  this._gamePieces.push(this._coopDoor);
  this._hen = new Hen();
  this._hen.feedBag = new FeedBag();
  this._hen.waterBottle = new WaterBottle();
  this._gamePieces.push(this._hen.feedBag);
  this._gamePieces.push(this._hen.waterBottle);
  this._gamePieces.push(this._hen);
  this._fryPan = new FryPan();
  this._gamePieces.push(this._fryPan);
  this._eggCarton = new EggCarton();
  this._gamePieces.push(this._eggCarton);
  this._nest = new Nest();
  this._gamePieces.push(this._nest);
  this._hoseBib = new HoseBib();
  this._gamePieces.push(this._hoseBib);
  this._hoseBib.setEnabled(false);

  this._activateGamePieces(this._gamePieces);

  // Set up all the game piece notifications.
  var defaultCenter = NotificationDefaultCenter();

  // The game ends when the farmer dies.
  var farmerDied = function(farmer) {
    this._isRunning = false;
  }
  defaultCenter.addNotificationObserver(
      Farmer.DID_DIE_NOTIFICATION, farmerDied.bind(this));

  // Listen for the eggs to be laid. Create a new egg when this happens, and give it a
  // nudge so it rolls down the chute onto the sluice.
  var didLayEgg = function(hen) {
    var skew_rand = Math.pow(Math.random(), 0.5);
    var dims = {
      ovality: (skew_rand * (0.25 - 0.0)) + 0.0,
      axis_ratio: (skew_rand * (1.35 - 1.0)) + 1.0
    };
    var egg = new Egg(Roost.ROOST_ORIGIN.x + 0.45, Roost.ROOST_ORIGIN.y + 0.07, dims);
    this._gamePieces.push(egg);
    egg.addToSimulation(this);
    var eggBody = egg.body();
    eggBody.ApplyForce(new Box2D.Common.Math.b2Vec2(1, 0), eggBody.GetPosition());
    return false;
  };
  defaultCenter.addNotificationObserver(
      Hen.DID_LAY_EGG_NOTIFICATION, didLayEgg.bind(this));

  // Feed the farmer whenever an egg is fried.
  var feedFarmer = function(fryPan) {
    this._farmer.eatEggs(1);
  }
  defaultCenter.addNotificationObserver(
      FryPan.DID_FRY_EGG_NOTIFICATION, feedFarmer.bind(this));
  
  // Refill the feed bag when the egg carton is filled.
  var refillFeed = function(eggCarton) {
    this._hen.feedBag.refill();
    eggCarton.reset();
  }
  defaultCenter.addNotificationObserver(
      EggCarton.DID_FILL_CARTON_NOTIFICATION, refillFeed.bind(this));

  defaultCenter.addNotificationObserver(
      Nest.DID_HATCH_EGG_NOTIFICATION, this._eggHatched.bind(this));
  defaultCenter.addNotificationObserver(
      Hen.DID_DIE_NOTIFICATION, this._henDied.bind(this));

  var refillLevel = function(waterBottle) {
    this._hoseBib.setEnabled(true);
  }
  defaultCenter.addNotificationObserver(
      WaterBottle.REFILL_LEVEL_NOTIFICATION, refillLevel.bind(this));

  var refillWaterBottle = function() {
    this._hen.waterBottle.refill();
  }
  defaultCenter.addNotificationObserver(
      HoseBib.ON_CLICK_NOTIFICATION, refillWaterBottle.bind(this));
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
  for (var i = 0; i < this._gamePieces.length; ++i) {
    this._gamePieces[i].draw(ctx, this);
  }
  ctx.restore();
}

/**
 * Run a simulation tick, then schedule the next one.
 */
ChickenAndEgg.prototype.simulationTick = function() {
  var simTime = Date.now() / 1000.0;
  var simDelta = simTime - this._lastSimTime;
  for (var i = 0; i < this._gamePieces.length; ++i) {
    this._gamePieces[i].processGameTick(simTime, simDelta);
  }
  this._lastSimTime = simTime;
  this._world.Step(ChickenAndEgg.Box2DConsts.FRAME_RATE,
                   ChickenAndEgg.Box2DConsts.VELOCITY_ITERATION_COUNT,
                   ChickenAndEgg.Box2DConsts.POSITION_ITERATION_COUNT);
  this._world.ClearForces();
  this._updateGameStats(this._gamePieces);
  this._deallocateInactiveGamePieces();
}

/**
 * Mark a game piece for deactivation (removal from the simulation).
 * @param {string} uuid The game piece's UUID.
 */
ChickenAndEgg.prototype.releaseGamePieceWithUuid = function(uuid) {
  this._deactiveGamePieces.push(uuid);
}

/**
 * Handle the collision of two game pieces. Delegate method of ContactListener.
 * @param {Box2D.Dynamics.b2contact} contact The object that describes the contact.
 * @param {string} uuidA One of the two bodies that collided.
 * @param {string} uuidB The other of the two bodies that collided.
 */
ChickenAndEgg.prototype.gamePiecesWillCollide = function(contact, uuidA, uuidB) {
  // Anything that collides with the ground gets removed from the game.
  var groundUuid = this._ground.uuid();
  if (uuidA === groundUuid || uuidB === groundUuid) {
    if (uuidA === groundUuid) {
      this.releaseGamePieceWithUuid(uuidB);
    } else {
      this.releaseGamePieceWithUuid(uuidA);
    }
    return;
  }
  // Process a collision with the fry pan.
  var fryPanUuid = this._fryPan.uuid();
  if (uuidA === fryPanUuid || uuidB === fryPanUuid) {
    var eggUuid = uuidA === fryPanUuid ? uuidB : uuidA;
    var eggIdx = this._indexOfGamePieceWithUuid(this._gamePieces, eggUuid);
    if (eggIdx >= 0) {
      this._fryPan.addEgg(this._gamePieces[eggIdx]);
    }
    this.releaseGamePieceWithUuid(eggUuid);
    return;
  }
  // Process a collision with the egg carton.
  var eggCartonUuid = this._eggCarton.uuid();
  if (uuidA === eggCartonUuid || uuidB === eggCartonUuid) {
    var eggUuid = uuidA === eggCartonUuid ? uuidB : uuidA;
    this._eggCarton.addEgg();
    this.releaseGamePieceWithUuid(eggUuid);
    return;
  }
  // Process a collision with the nest.
  var nestUuid = this._nest.uuid();
  if (uuidA === nestUuid || uuidB === nestUuid) {
    var eggUuid = uuidA === nestUuid ? uuidB : uuidA;
    this._nest.addEgg();
    this.releaseGamePieceWithUuid(eggUuid);
    return;
  }
}

/**
 * Activate the given list of game pieces by adding them to the simulation and to the
 * game status board.
 * @param {Array.GamePieces} gamePieces The list of game pieces to activate.
 * @private
 */
ChickenAndEgg.prototype._activateGamePieces = function(gamePieces) {
  var tbodyElt = $('#game_stats_table').find('tbody');
  for (var i = 0; i < gamePieces.length; ++i) {
    var gamePiece = gamePieces[i];
    gamePiece.addToSimulation(this);
    if (gamePiece.hasStats()) {
      tbodyElt.append('<tr><td>' + gamePiece.displayName() + '</td>' +
          '<td id=' + gamePiece.uuid() +'>' +
          gamePiece.statsDisplayString() + '</td></tr>');
    }
  }
}

/**
 * Deactivate and deallocate all the game pieces that have been marked for removal.
 * @private
 */
ChickenAndEgg.prototype._deallocateInactiveGamePieces = function() {
  // Remove all the game pieces that are scheduled to be deactivated.
  for (var i = 0; i < this._deactiveGamePieces.length; ++i) {
    var releasedGamePieceIdx = this._indexOfGamePieceWithUuid(
        this._gamePieces, this._deactiveGamePieces[i]);
    if (releasedGamePieceIdx != -1) {
      var gamePiece = this._gamePieces.splice(releasedGamePieceIdx, 1)[0];
      // If the game piece displays stats, remove it form the stats panel.
      gamePiece.removeFromSimulation(this);
      if (gamePiece.hasStats) {
        var statsElt = $('#' + gamePiece.uuid());
        if (statsElt) {
          var tr = statsElt.parent();
          tr.remove();
        }
      }
    }
  }
}

/**
 * Find the game piece with the given UUID.
 * @param {Array.GamePiece} gamePieces The array of game pieces to search.
 * @param {string} uuid The UUID to look for.
 * @return {number} the index of the game piece with the matching UUID. Returns -1 if no
 *     such game piece exists.
 * @private
 */
ChickenAndEgg.prototype._indexOfGamePieceWithUuid = function(gamePieces, uuid) {
  for (var i = 0; i < gamePieces.length; ++i) {
    if (uuid === gamePieces[i].uuid()) {
      return i;
    }
  }
  return -1;
}

/**
 * Update the game stats.
 * @param {Array.GamePiece} gamePieces The array of game pieces to use when updating
 *     the game stats.
 * @private
 */
ChickenAndEgg.prototype._updateGameStats = function(gamePieces) {
  for (var i = 0; i < gamePieces.length; ++i) {
    var gamePiece = gamePieces[i];
    if (gamePiece.hasStats()) {
      $('#' + gamePiece.uuid()).text(gamePiece.statsDisplayString());
    }
  }
}

/**
 * Convert a coordinate in the CANVAS element's coordinate system into a 2D coordinate in
 * the Box2D simulation's coordinate system.
 * @param {number} x The x-coordinate
 * @param {number} y The y-coordinate
 * @param {Canvas} canvas The canvas that defines the coordinate system.
 * @return {Box2D.Vec2} The converted coordinate.
 * @private
 */
ChickenAndEgg.prototype._convertToWorldCoordinates = function(x, y, canvas) {
  var offset = $(canvas).offset();
  if (offset) {
    x = x - offset.left;
    y = y - offset.top;
  }
  return new Box2D.Common.Math.b2Vec2(
    x / this._scale,
    (y - canvas.height) / -this._scale);
}

/**
 * Add a pullet to the list of reserve pullets every time an egg hatches.
 * @param {Nest} nest The Nest that sent the notification.
 * @private
 */
ChickenAndEgg.prototype._eggHatched = function(nest) {
  if (this._pullets.length >= ChickenAndEgg.MAX_PULLET_COUNT) {
    return;
  }
  var pullet = new Pullet(this._pullets.length + 1);
  pullet.feedBag = this._hen.feedBag;
  pullet.waterBottle = this._hen.waterBottle;
  this._pullets.push(pullet);
  this._gamePieces.push(pullet);
  this._activateGamePieces([pullet]);
}

/**
 * When the laying hen dies, replace it from the list of reserve pullets. When all the
 * pullets are gone, the game is over when the current laying hen dies.
 * @param {Chicken} sender The Hen that sent the notification.
 * @private
 */
ChickenAndEgg.prototype._henDied = function(sender) {
  if (this._pullets.length == 0) {
    return;
  }
  var pullet = this._pullets.pop();
  this.releaseGamePieceWithUuid(pullet.uuid());
  var hen = new Hen();
  hen.feedBag = this._hen.feedBag;
  hen.waterBottle = this._hen.waterBottle;
  this.releaseGamePieceWithUuid(this._hen.uuid());
  this._hen = hen;
  this._gamePieces.push(this._hen);
  this._activateGamePieces([this._hen]);
}

/**
 * Query all the game pieces, and handle possible mouse hits. Processing stops when a
 * game piece handles the mouse-down.
 * @param {Array.GamePieces} gamePieces The list of game pieces to test.
 * @param {Box2D.Vec2} worldMouse The world coordinates of the mouse-down event.
 * @return {boolean} Whether the mouse-down was handled by a game piece or not.
 * @private
 */
ChickenAndEgg.prototype._handleMouseDown = function(gamePieces, worldMouse) {
  for (var i = 0; i < gamePieces.length; ++i) {
    var gamePiece = gamePieces[i];
    if (gamePiece.isPointInside(worldMouse)) {
      // Handle this like a button click.
      this._firstResponder = gamePiece;
      $(ChickenAndEgg._DOMConsts.BODY)
          .mousemove(this._buttonMouseDrag.bind(this))
          .mouseup(this._buttonMouseUp.bind(this));
      return true;
    }
  }
  return false;
}

/**
 * Handle the mouse-down event. Convert the event into Box2D coordinates and issue a
 * hit-detection. If the sluice handle is hit, start the handle-drag sequence.
 * @param {Event} event The mouse-down event. page{X|Y} is normalized by jQuery.
 * @private
 */
ChickenAndEgg.prototype._mouseDown = function(event) {
  var worldMouse = this._convertToWorldCoordinates(
      event.pageX, event.pageY, this._canvas);
  // First, query any game pieces that know how to handle hit-detection.
  if (this._handleMouseDown(this._gamePieces, worldMouse)) {
    return;  // The mouse down was handled.
  }

  /**
   * Callback for the QueryPoint() method. If the sluice handle was hit, bind the mouse-
   * drag and mouse-up event handlers and start dragging the sluice.
   * @param {Box2D.Dynamics.b2Fixture} fixture The fixture to test.
   * @return {boolean} Whether to continue with the query. Returns false if the sluice
   *     handle was hit.
   */
  var hitSluiceHandle = function(fixture) {
    var leverIndex = this._sluice.leverIndexOfFixture(fixture);
    if (leverIndex >= 0) {
      this._leverIndex = leverIndex;
      $(ChickenAndEgg._DOMConsts.BODY)
          .mousemove(this._sluiceMouseDrag.bind(this))
          .mouseup(this._sluiceMouseUp.bind(this));
      return false;  // Stop searching.
    }
    return true;
  };
  this._world.QueryPoint(hitSluiceHandle.bind(this), worldMouse);
}

/**
 * Handle the mouse-drag event on a sluice object. Slide the sluice piece along its track
 * by the mouse delta.
 * @param {Event} event The mouse-down event. page{X|Y} is normalized by jQuery.
 * @private
 */
ChickenAndEgg.prototype._sluiceMouseDrag = function(event) {
  var worldMouse = this._convertToWorldCoordinates(
      event.pageX, event.pageY, this._canvas);
  var origin = this._sluice.leverWorldCoordinatesAtIndex(this._leverIndex);
  var deltaX = worldMouse.x - origin.x;
  this._sluice.moveLeverAtIndexBy(this._leverIndex,
      new Box2D.Common.Math.b2Vec2(deltaX, 0));
  for (var i = 0; i < this._gamePieces.length; ++i) {
    var gamePiece = this._gamePieces[i];
    if (gamePiece.hasOwnProperty('isEgg')) {
      gamePiece.body().SetAwake(true);
    }
  }
}

/**
 * Handle the mouse-up event on a sluice object. End the sluice drag sequence.
 * @param {Event} event The mouse-down event. page{X|Y} is normalized by jQuery.
 * @private
 */
ChickenAndEgg.prototype._sluiceMouseUp = function(event) {
  this._firstResponder = null;
  $(ChickenAndEgg._DOMConsts.BODY).unbind('mousemove').unbind('mouseup');
}

/**
 * Handle the mouse-drag event on a button object. Does nothing.
 * @param {Event} event The mouse-down event. page{X|Y} is normalized by jQuery.
 * @private
 */
ChickenAndEgg.prototype._buttonMouseDrag = function(event) {
}

/**
 * Handle the mouse-up event on a button object. End the button click sequence, fire
 * the button's onClick handler if the mouse-up happened in the button's bounds.
 * @param {Event} event The mouse-down event. page{X|Y} is normalized by jQuery.
 * @private
 */
ChickenAndEgg.prototype._buttonMouseUp = function(event) {
  var worldMouse = this._convertToWorldCoordinates(
      event.pageX, event.pageY, this._canvas);
  if (this._firstResponder.isPointInside(worldMouse)) {
    this._firstResponder.doActionWithPoint(worldMouse);
  }
  $(ChickenAndEgg._DOMConsts.BODY).unbind('mousemove').unbind('mouseup');
}
