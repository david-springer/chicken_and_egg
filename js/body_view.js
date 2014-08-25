/* Copyright 2014 (c) SoFIE Studios.  All rights reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview  The BodyView class. The BodyView holds some general drawing state,
 * such as the scale factor from the Box2D coordinate system to pixels. It also has a
 * draw() method that subclasses must override to draw the body. The draw() function is
 * passed a context and a Box2D body, which is used to query things like position, angle
 * and so on.
 */

/**
 * Constructor for the BodyView.
 * @constructor
 */
BodyView = function() {}
BodyView.prototype.constructor = BodyView;

/**
 * Draw the body. Abstract method. Default does nothing.
 * @param {Object} ctx The 2D drawing contest, normally the one attached to a <CANVAS>
 *     element.
 * @param {Object} body The Box2D body associated with this view. Can be null.
 */
BodyView.prototype.draw = function(ctx, body) {}
