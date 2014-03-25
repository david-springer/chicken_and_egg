/* Copyright 2014 (c) SoFIE Studios.  All rights reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview Unit tests for the PolyView object.
 * Requires BodyView object.
 */
module("PolyView Object");

test("Default Constructor", function() {
  var testBox = new PolyView();
  equal(testBox.scale(), 30.0);
});

test("PolyView(scale)", function() {
  var testBox = new PolyView(150);
  equal(testBox.scale(), 150.0);
});
