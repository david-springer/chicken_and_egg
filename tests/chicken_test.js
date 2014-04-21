/* Copyright 2014 (c) SoFIE Studios.  All rights reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview Unit tests for the Chicken object.
 */
module("Chicken Object", {
  teardown: function() {
    NotificationDefaultCenter().removeAllNotifications();
  }
});

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
  var didLayEgg = function(chicken) {
    didLayEggCount++;
    return false;
  };
  var defaultCenter = NotificationDefaultCenter();
  defaultCenter.addNotificationObserver(Chicken.DID_LAY_EGG_NOTIFICATION, didLayEgg);
  testChicken.peckFeed(Chicken.MAX_FEED);
  testChicken.drinkWater(Chicken.MAX_WATER);
  // Max feed & water should produce an egg and reset the chicken.
  equal(testChicken.feed(), 0.0);
  equal(testChicken.water(), 0.0);
  equal(didLayEggCount, 1);
  defaultCenter.removeNotificationObserver(Chicken.DID_LAY_EGG_NOTIFICATION, didLayEgg);
});

test("Lay 2 Eggs", function() {
  var testChicken = new Chicken();
  equal(testChicken.feed(), 0.0);
  // Set up an event listener for the didLayEgg event.
  var didLayEggCount = 0;
  var didLayEgg = function(chicken) {
    didLayEggCount++;
    return false;
  };
  var defaultCenter = NotificationDefaultCenter();
  defaultCenter.addNotificationObserver(Chicken.DID_LAY_EGG_NOTIFICATION, didLayEgg);
  testChicken.peckFeed(Chicken.MAX_FEED);
  testChicken.drinkWater(Chicken.MAX_WATER);
  // Max feed & water should produce an egg and reset the chicken.
  equal(testChicken.feed(), 0.0);
  equal(testChicken.water(), 0.0);
  equal(didLayEggCount, 1);

  // Verify that a second egg is laid after eating & drinking enough.
  testChicken.peckFeed(Chicken.MAX_FEED);
  testChicken.drinkWater(Chicken.MAX_WATER);
  // Max feed & water should produce an egg and reset the chicken.
  equal(testChicken.feed(), 0.0);
  equal(testChicken.water(), 0.0);
  equal(didLayEggCount, 2);
  defaultCenter.removeNotificationObserver(Chicken.DID_LAY_EGG_NOTIFICATION, didLayEgg);
});

test("Still Alive", function() {
  var testChicken = new Chicken();
  ok(testChicken.isStillAlive());
  testChicken.setEggCount(0);
  equal(testChicken.isStillAlive(), false);
});

test("Lay All Eggs", function() {
  var testChicken = new Chicken();
  ok(testChicken.isStillAlive());
  var didLayEggCount = 0;
  var didLayEgg = function(chicken) {
    didLayEggCount++;
    return false;
  };
  var didDieCount = 0;
  var didDie = function(chicken) {
    didDieCount++;
  }
  var defaultCenter = NotificationDefaultCenter();
  defaultCenter.addNotificationObserver(Chicken.DID_LAY_EGG_NOTIFICATION, didLayEgg);
  defaultCenter.addNotificationObserver(Chicken.DID_DIE_NOTIFICATION, didDie);
  for (var i = 0; i < Chicken.MAX_EGG_COUNT; ++i) {
    testChicken.layEgg();
  }
  equal(testChicken.isStillAlive(), false);
  equal(didLayEggCount, Chicken.MAX_EGG_COUNT);
  equal(didDieCount, 1);
  // Try to lay one more egg, this should do nothing.
  testChicken.layEgg();
  equal(didLayEggCount, Chicken.MAX_EGG_COUNT);
  equal(didDieCount, 1);
  defaultCenter.removeNotificationObserver(Chicken.DID_LAY_EGG_NOTIFICATION, didLayEgg);
  defaultCenter.removeNotificationObserver(Chicken.DID_DIE_NOTIFICATION, didDie);
});
