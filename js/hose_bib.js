/* Copyright 2014 (c) SoFIE Studios.  All rights reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview  The HoseBib class. The HoseBib object is a simple button that sends
 * a REFILL message when clicked. It can be enabled and disabled.
 */

/**
 * Constructor for the HoseBib.
 * @constructor
 * @extends {GamePiece}
 */
HoseBib = function() {
  GamePiece.call(this);
  /**
   * Whether the hose bib is enabled or not. When disabled, it does not respond to
   * mouse events.
   * @type {boolean}
   * @private
   */
  this._enabled = false;
}
HoseBib.prototype = new GamePiece();
HoseBib.prototype.constructor = HoseBib;

/**
 * Notification sent when the hose bib is clicked. Sent only if the hose bib is enabled.
 * @type {string}
 */
HoseBib.ON_CLICK_NOTIFICATION = 'hoseBibOnClickNotification';

/**
 * The origin in world coordinates of the hose bib.
 * @type {Box2D.Common.Math.b2Vec2}
 */
HoseBib.IMAGE_ORIGIN = new Box2D.Common.Math.b2Vec2(0.37, 2.35);
// The chicken image is 80 x 83 points. Size the final image so it is 15cm wide and
// preserves aspect ratio.
// TODO(daves): Figure out how to get the image dims from the Image object.
HoseBib.IMAGE_SIZE = new Box2D.Common.Math.b2Vec2(0.15, 0.15 * (83.0 / 80.0));

/**
 * Set the enabled bit. This changes the presentation layer, too.
 * @param {boolean} enabled The new enabled state.
 */
HoseBib.prototype.setEnabled = function(enabled) {
  this._enabled = enabled;
  if (this.view) {
    this.view.enabled = enabled;
  }
}

/**
 * Return the enabled bit.
 */
HoseBib.prototype.isEnabled = function() {
  return this._enabled;
}

/**
 * Handle hit detection.
 * @override
 */
HoseBib.prototype.isPointInside = function(worldMouse) {
  if (!this._enabled) {
    return false;
  }
  var x0 = HoseBib.IMAGE_ORIGIN.x;
  var x1 = HoseBib.IMAGE_ORIGIN.x + HoseBib.IMAGE_SIZE.x;
  var y0 = HoseBib.IMAGE_ORIGIN.y;
  var y1 = HoseBib.IMAGE_ORIGIN.y + HoseBib.IMAGE_SIZE.y;
  return worldMouse.x >= x0 && worldMouse.x <= x1 &&
      worldMouse.y >= y0 && worldMouse.y <= y1;
}

/**
 * Perform the click action.
 * @override
 */
HoseBib.prototype.doActionWithPoint = function(worldPoint) {
  this.setEnabled(false);
  NotificationDefaultCenter().postNotification(HoseBib.ON_CLICK_NOTIFICATION, this);
}

/**
 * The hose bib is drawable when the image gets loaded.
 * @override
 */
HoseBib.prototype.canDraw = function() {
  return this.view != null && this.view.canDraw();
}

/**
 * Create an ImageView for the hose bib.
 * @override
 */
HoseBib.prototype.loadView = function(simulation) {
  var hoseBibView = new HoseBibView();
  hoseBibView.setOrigin(HoseBib.IMAGE_ORIGIN);
  hoseBibView.setSize(HoseBib.IMAGE_SIZE);
  hoseBibView.loadImage("./img/hose_bib.png");
  this.view = hoseBibView;
  this.setEnabled(this._enabled);
}
