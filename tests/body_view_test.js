/* Copyright 2014 (c) SoFIE Studios.  All rights reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview Unit tests for the BodyView object.
 * Requires State object.
 */
module("BodyView Object");

test("Default Constructor", function() {
  var testBody = new BodyView();
  equal(testBody.scale(), 30.0);
});

test("BodyView(scale)", function() {
  var testBody = new BodyView(10.456);
  equal(testBody.scale(), 10.456);
});
