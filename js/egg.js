/* Copyright 2014 (c) SoFIE Studios.  All rights reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview  The Egg class. The Egg object implements all the behaviour of an egg.
 */

/**
 * Constructor for the Egg.
 * @constructor
 */
Egg = function() {
  GamePiece.call(this);
}
Egg.prototype = new GamePiece();
Egg.prototype.constructor = Egg;
