/* Copyright 2014 (c) SoFIE Studios.  All rights reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview Unit tests for the Chicken object.
 */
module("Chicken Object");

test("Default Constructor", function() {
  var testChicken = new Chicken();
  equal(testChicken.feed(), 0.0);
  equal(testchicken.water(), 0.0);
});

test("Peck", function() {
  var testChicken = new Chicken();
  equal(testChicken.feed(), 0.0);
  testChicken.peckFeed(Chicken.MAX_FEED / 2);
  equal(testChicken.feed(), Chicken.MAX_FEED / 2);
  equal(testchicken.water(), 0.0);
});

test("Drink", function() {
  var testChicken = new Chicken();
  equal(testChicken.water(), 0.0);
  testChicken.drinkWater(Chicken.MAX_WATER / 2);
  equal(testChicken.water(), Chicken.MAX_WATER / 2);
  equal(testchicken.feed(), 0.0);
});

test("Lay Egg", function() {
  var testChicken = new Chicken();
  equal(testChicken.feed(), 0.0);
  // Set up an event listener for the didLayEgg event.
  var didLayEggCount = 0;
  var layListener = $({});
  layListener.on(Chicken.DID_LAY_EGG_NOTIFICATION, function() {
    didLayEggCount++;
  });
  testChicken.peckFeed(Chicken.MAX_FEED);
  testChicken.drinkWater(Chicken.MAX_WATER);
  // Max feed & water should produce an egg and reset the chicken.
  equal(testChicken.feed(), 0.0);
  equal(testChicken.water(), 0.0);
  equal(didLayEggCount, 1);
});
