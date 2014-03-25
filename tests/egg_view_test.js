/* Copyright 2014 (c) SoFIE Studios.  All rights reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview Unit tests for the EggView object.
 * Requires State object.
 */
module("EggView Object");

test("Default Constructor", function() {
  var testEgg = new EggView();
  equal(testEgg.scale(), 30.0);
});

test("EggView(scale)", function() {
  var testEgg = new EggView(150.452);
  equal(testEgg.scale(), 150.452);
});
