/* Copyright 2014 (c) SoFIE Studios.  All rights reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview Unit tests for the Egg object.
 */
module("Egg Object");

test("Default Constructor", function() {
  var testEgg = new Egg(0, 0);
  equal(testEgg.ovality, Egg.DEFAULT_OVALITY);
});

test("Ovality Constructor", function() {
  var testEgg = new Egg(0, 0, 0.2);
  equal(testEgg.ovality, 0.2);
});

