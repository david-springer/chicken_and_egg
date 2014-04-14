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
  equal(testChicken.water(), 0.0);
});

test("Peck", function() {
  var testChicken = new Chicken();
  equal(testChicken.feed(), 0.0);
  testChicken.peckFeed(Chicken.MAX_FEED / 2);
  equal(testChicken.feed(), Chicken.MAX_FEED / 2);
  equal(testChicken.water(), 0.0);
});

test("Overeat", function() {
  var testChicken = new Chicken();
  equal(testChicken.feed(), 0.0);
  testChicken.peckFeed(Chicken.MAX_FEED * 2);
  equal(testChicken.feed(), Chicken.MAX_FEED);
  equal(testChicken.water(), 0.0);
});

test("Drink", function() {
  var testChicken = new Chicken();
  equal(testChicken.water(), 0.0);
  testChicken.drinkWater(Chicken.MAX_WATER / 2);
  equal(testChicken.water(), Chicken.MAX_WATER / 2);
  equal(testChicken.feed(), 0.0);
});

test("Drink Too Much", function() {
  var testChicken = new Chicken();
  equal(testChicken.water(), 0.0);
  testChicken.drinkWater(Chicken.MAX_WATER * 2);
  equal(testChicken.water(), Chicken.MAX_WATER);
  equal(testChicken.feed(), 0.0);
});

test("Should Lay Egg", function() {
  var testChicken = new Chicken();
  equal(testChicken.shouldLayEgg(), false);
  testChicken.peckFeed(Chicken.MAX_FEED / 2);
  testChicken.drinkWater(Chicken.MAX_WATER / 2);
  equal(testChicken.shouldLayEgg(), false);
  testChicken.setFeed(Chicken.MAX_FEED);
  testChicken.setWater(Chicken.MAX_WATER);
  equal(testChicken.shouldLayEgg(), true);
});

test("Lay Egg", function() {
  var testChicken = new Chicken();
  equal(testChicken.feed(), 0.0);
  // Set up an event listener for the didLayEgg event.
  var didLayEggCount = 0;
  $.Topic(Chicken.DID_LAY_EGG_NOTIFICATION).subscribe(function() {
    didLayEggCount++;
    return false;
  });
  testChicken.peckFeed(Chicken.MAX_FEED);
  testChicken.drinkWater(Chicken.MAX_WATER);
  // Max feed & water should produce an egg and reset the chicken.
  equal(testChicken.feed(), 0.0);
  equal(testChicken.water(), 0.0);
  equal(didLayEggCount, 1);
  $.Topic(Chicken.DID_LAY_EGG_NOTIFICATION).unsubscribe();
});
