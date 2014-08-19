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
  equal(testEgg.dimensions.ovality, Egg.DefaultDimensions.ovality);
  equal(testEgg.dimensions.axis_ratio, Egg.DefaultDimensions.axis_ratio);
  equal(testEgg.dimensions.width, Egg.DefaultDimensions.width);
});

test("Dimension Constructor", function() {
  var testEgg = new Egg(0, 0, {ovality: 0.2});
  equal(testEgg.dimensions.ovality, 0.2);
  equal(testEgg.dimensions.axis_ratio, Egg.DefaultDimensions.axis_ratio);
  equal(testEgg.dimensions.width, Egg.DefaultDimensions.width);
  testEgg = new Egg(0, 0, {axis_ratio: 0.5, ovality: 0.1});
  equal(testEgg.dimensions.ovality, 0.1);
  equal(testEgg.dimensions.axis_ratio, 0.5);
  equal(testEgg.dimensions.width, Egg.DefaultDimensions.width);
  testEgg = new Egg(0, 0, {axis_ratio: 0.5, ovality: 0.1, width: 10.0});
  equal(testEgg.dimensions.ovality, 0.1);
  equal(testEgg.dimensions.axis_ratio, 0.5);
  equal(testEgg.dimensions.width, 10.0);
  testEgg = new Egg(0, 0, {BOGUS: 0.5});
  equal(testEgg.dimensions.ovality, Egg.DefaultDimensions.ovality);
  equal(testEgg.dimensions.axis_ratio, Egg.DefaultDimensions.axis_ratio);
  equal(testEgg.dimensions.width, Egg.DefaultDimensions.width);
});

