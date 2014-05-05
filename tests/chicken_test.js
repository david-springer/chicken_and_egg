/* Copyright 2014 (c) SoFIE Studios.  All rights reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file.
 */

/**
 * Fakes for this test.
 */
FakeFeedBag = function() {}
FakeFeedBag.prototype.constructor = FakeFeedBag;
FakeFeedBag.prototype.peck = function(peckVolume) {
  return peckVolume;
}

FakeWaterBottle = function() {}
FakeWaterBottle.prototype.constructor = FakeWaterBottle;
FakeWaterBottle.prototype.drink = function(waterVolume) {
  return waterVolume;
}

/**
 * @fileoverview Unit tests for the Chicken object.
 */
module("Chicken Object", {
  teardown: function() {
    equal(NotificationDefaultCenter().hasObserversForNotification(
        Chicken.DID_LAY_EGG_NOTIFICATION), false);
    equal(NotificationDefaultCenter().hasObserversForNotification(
        Chicken.DID_DIE_NOTIFICATION), false);
  }
});

test("Default Constructor", function() {
  var testChicken = new Chicken();
  equal(testChicken.feed(), 0.0);
  equal(testChicken.water(), 0.0);
});

test("Peck", function() {
  var testChicken = new Chicken();
  var fakeFeedBag = new FakeFeedBag();
  equal(testChicken.feed(), 0.0);
  testChicken._peckFeed(Chicken.Constants.MAX_FEED / 2, fakeFeedBag);
  equal(testChicken.feed(), Chicken.Constants.MAX_FEED / 2);
  equal(testChicken.water(), 0.0);
});

test("Overeat", function() {
  var testChicken = new Chicken();
  var fakeFeedBag = new FakeFeedBag();
  equal(testChicken.feed(), 0.0);
  testChicken._peckFeed(Chicken.Constants.MAX_FEED * 2, fakeFeedBag);
  equal(testChicken.feed(), Chicken.Constants.MAX_FEED);
  equal(testChicken.water(), 0.0);
});

test("Drink", function() {
  var testChicken = new Chicken();
  var fakeWaterBottle = new FakeWaterBottle();
  equal(testChicken.water(), 0.0);
  testChicken._drinkWater(Chicken.Constants.MAX_WATER / 2, fakeWaterBottle);
  equal(testChicken.water(), Chicken.Constants.MAX_WATER / 2);
  equal(testChicken.feed(), 0.0);
});

test("Drink Too Much", function() {
  var testChicken = new Chicken();
  var fakeWaterBottle = new FakeWaterBottle();
  equal(testChicken.water(), 0.0);
  testChicken._drinkWater(Chicken.Constants.MAX_WATER * 2, fakeWaterBottle);
  equal(testChicken.water(), Chicken.Constants.MAX_WATER);
  equal(testChicken.feed(), 0.0);
});

test("Next Action", function() {
  var testChicken = new Chicken();
  var firstAction = testChicken._action;
  testChicken._nextAction();
  ok(firstAction != testChicken._action);
});

test("Should Lay Egg", function() {
  var testChicken = new Chicken();
  var fakeFeedBag = new FakeFeedBag();
  var fakeWaterBottle = new FakeWaterBottle();
  equal(testChicken._shouldLayEgg(), false);
  testChicken._peckFeed(Chicken.Constants.MAX_FEED / 2, fakeFeedBag);
  testChicken._drinkWater(Chicken.Constants.MAX_WATER / 2, fakeWaterBottle);
  equal(testChicken._shouldLayEgg(), false);
  testChicken.setFeed(Chicken.Constants.MAX_FEED);
  testChicken.setWater(Chicken.Constants.MAX_WATER);
  equal(testChicken._shouldLayEgg(), true);
});

test("Lay Egg", function() {
  var testChicken = new Chicken();
  var fakeFeedBag = new FakeFeedBag();
  var fakeWaterBottle = new FakeWaterBottle();
  equal(testChicken.feed(), 0.0);
  // Set up an event listener for the didLayEgg event.
  var didLayEggCount = 0;
  var didLayEgg = function(chicken) {
    didLayEggCount++;
    return false;
  };
  var defaultCenter = NotificationDefaultCenter();
  defaultCenter.addNotificationObserver(Chicken.DID_LAY_EGG_NOTIFICATION, didLayEgg);
  testChicken._peckFeed(Chicken.Constants.MAX_FEED, fakeFeedBag);
  testChicken._drinkWater(Chicken.Constants.MAX_WATER, fakeWaterBottle);
  // Max feed & water should produce an egg and reset the chicken.
  equal(testChicken.feed(), 0.0);
  equal(testChicken.water(), 0.0);
  equal(didLayEggCount, 1);
  defaultCenter.removeNotificationObserver(Chicken.DID_LAY_EGG_NOTIFICATION, didLayEgg);
});

test("Lay 2 Eggs", function() {
  var testChicken = new Chicken();
  var fakeFeedBag = new FakeFeedBag();
  var fakeWaterBottle = new FakeWaterBottle();
  equal(testChicken.feed(), 0.0);
  // Set up an event listener for the didLayEgg event.
  var didLayEggCount = 0;
  var didLayEgg = function(chicken) {
    didLayEggCount++;
    return false;
  };
  var defaultCenter = NotificationDefaultCenter();
  defaultCenter.addNotificationObserver(Chicken.DID_LAY_EGG_NOTIFICATION, didLayEgg);
  testChicken._peckFeed(Chicken.Constants.MAX_FEED, fakeFeedBag);
  testChicken._drinkWater(Chicken.Constants.MAX_WATER, fakeWaterBottle);
  // Max feed & water should produce an egg and reset the chicken.
  equal(testChicken.feed(), 0.0);
  equal(testChicken.water(), 0.0);
  equal(didLayEggCount, 1);

  // Verify that a second egg is laid after eating & drinking enough.
  testChicken._peckFeed(Chicken.Constants.MAX_FEED, fakeFeedBag);
  testChicken._drinkWater(Chicken.Constants.MAX_WATER, fakeWaterBottle);
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
  var fakeFeedBag = new FakeFeedBag();
  var fakeWaterBottle = new FakeWaterBottle();
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
  for (var i = 0; i < Chicken.Constants.MAX_EGG_COUNT; ++i) {
    testChicken._layEgg();
  }
  equal(testChicken.isStillAlive(), false);
  equal(didLayEggCount, Chicken.Constants.MAX_EGG_COUNT);
  equal(didDieCount, 1);
  // Try to lay one more egg, this should do nothing.
  testChicken._layEgg();
  equal(didLayEggCount, Chicken.Constants.MAX_EGG_COUNT);
  equal(didDieCount, 1);
  defaultCenter.removeNotificationObserver(Chicken.DID_LAY_EGG_NOTIFICATION, didLayEgg);
  defaultCenter.removeNotificationObserver(Chicken.DID_DIE_NOTIFICATION, didDie);
});

test("Process Game Tick No Egg Lay", function() {
  var fakeRandomValue = 0.25;
  var fakeRandom = function() {
    return fakeRandomValue;
  }
  var testPeck = (Chicken.Constants.MAX_PECK_VOLUME - Chicken.Constants.MIN_PECK_VOLUME) * fakeRandomValue;
  var testDrink = (Chicken.Constants.MAX_WATER_VOLUME - Chicken.Constants.MIN_WATER_VOLUME) * fakeRandomValue;
  var testChicken = new Chicken();
  testChicken.feedBag = new FakeFeedBag();
  testChicken.waterBottle = new FakeWaterBottle();
  equal(testChicken.feed(), 0.0);
  equal(testChicken.water(), 0.0);
  var gameTimeDelta = 0.5;
  var dateNow = Date.now() / 1000.0;
  testChicken.processGameTick(dateNow, gameTimeDelta, fakeRandom, Chicken.Actions.PECK);
  equal(testChicken.feed(), testPeck);
  equal(testChicken.water(), 0.0);
  // Give the chicken enough time to chew all the scratch.
  testChicken.processGameTick(
      dateNow + (testPeck / Chicken.Constants.CHEW_RATE) + 1,
      gameTimeDelta,
      fakeRandom, Chicken.Actions.DRINK);
  equal(testChicken.feed(), testPeck);
  equal(testChicken.water(), testDrink);
  // Give the chicken enough time to drink all the water.
  testChicken.processGameTick(
      dateNow + (testDrink / Chicken.Constants.DRINK_RATE) + 1,
      gameTimeDelta,
      fakeRandom, Chicken.Actions.PECK);
  equal(testChicken.feed(), testPeck * 2.0);
  equal(testChicken.water(), testDrink);
  testChicken.processGameTick(
      dateNow + (testDrink / Chicken.Constants.CHEW_RATE) + 1,
      gameTimeDelta,
      fakeRandom, Chicken.Actions.DRINK);
  equal(testChicken.feed(), testPeck * 2.0);
  equal(testChicken.water(), testDrink * 2.0);
});

test("Process Game Tick Peck Too Soon", function() {
  var fakeRandomValue = 025;
  var fakeRandom = function() {
    return fakeRandomValue;
  }
  var testPeck = (Chicken.Constants.MAX_PECK_VOLUME - Chicken.Constants.MIN_PECK_VOLUME) * fakeRandomValue;
  var testDrink = (Chicken.Constants.MAX_WATER_VOLUME - Chicken.Constants.MIN_WATER_VOLUME) * fakeRandomValue;
  var testChicken = new Chicken();
  equal(testChicken.feed(), 0.0);
  equal(testChicken.water(), 0.0);
  var gameTimeDelta = 0.5;
  var dateNow = Date.now() / 1000.0;
  testChicken.processGameTick(dateNow, gameTimeDelta, fakeRandom, Chicken.Actions.PECK);
  equal(testChicken.feed(), testPeck);
  equal(testChicken.water(), 0.0);
  testChicken.processGameTick(dateNow, gameTimeDelta, fakeRandom, Chicken.Actions.PECK);
  equal(testChicken.feed(), testPeck);
  equal(testChicken.water(), 0.0);
});

test("Process Game Tick Drink Too Soon", function() {
  var fakeRandomValue = 0.25;
  var fakeRandom = function() {
    return fakeRandomValue;
  }
  var testPeck = (Chicken.Constants.MAX_PECK_VOLUME - Chicken.Constants.MIN_PECK_VOLUME) * fakeRandomValue;
  var testDrink = (Chicken.Constants.MAX_WATER_VOLUME - Chicken.Constants.MIN_WATER_VOLUME) * fakeRandomValue;
  var testChicken = new Chicken();
  equal(testChicken.feed(), 0.0);
  equal(testChicken.water(), 0.0);
  var gameTimeDelta = 0.5;
  var dateNow = Date.now() / 1000.0;
  testChicken.processGameTick(dateNow, gameTimeDelta, fakeRandom, Chicken.Actions.DRINK);
  equal(testChicken.feed(), 0.0);
  equal(testChicken.water(), testDrink);
  testChicken.processGameTick(dateNow, gameTimeDelta, fakeRandom, Chicken.Actions.DRINK);
  equal(testChicken.feed(), 0.0);
  equal(testChicken.water(), testDrink);
});

test("Process Game Tick No Feed, No Water", function() {
  var fakeRandomValue = 0.5;
  var fakeRandom = function() {
    return fakeRandomValue;
  }
  var testPeck = (Chicken.Constants.MAX_PECK_VOLUME - Chicken.Constants.MIN_PECK_VOLUME) * fakeRandomValue;
  var testDrink = (Chicken.Constants.MAX_WATER_VOLUME - Chicken.Constants.MIN_WATER_VOLUME) * fakeRandomValue;
  var testChicken = new Chicken();
  equal(testChicken.feed(), 0.0);
  equal(testChicken.water(), 0.0);
  var gameTimeDelta = 0.5;
  testChicken.processGameTick(Date.now() / 1000.0, gameTimeDelta, fakeRandom);
  equal(testChicken.feed(), 0.0);
  equal(testChicken.water(), 0.0);
  testChicken.feedBag = new FakeFeedBag();
  testChicken.processGameTick(Date.now() / 1000.0, gameTimeDelta, fakeRandom, Chicken.Actions.PECK);
  equal(testChicken.feed(), testPeck);
  equal(testChicken.water(), 0.0);
  testChicken.feedBag = null;
  testChicken.setFeed(0);  // Reset the chicken.
  testChicken.setWater(0);
  testChicken.waterBottle = new FakeWaterBottle();
  testChicken.processGameTick(Date.now() / 1000.0, gameTimeDelta, fakeRandom, Chicken.Actions.DRINK);
  equal(testChicken.feed(), 0.0);
  equal(testChicken.water(), testDrink);
});

test("Process Game Tick Lay Egg", function() {
  var fakeRandomValue = 0.5;
  var fakeRandom = function() {
    return fakeRandomValue;
  }
  var testPeck = (Chicken.Constants.MAX_PECK_VOLUME - Chicken.Constants.MIN_PECK_VOLUME) * fakeRandomValue;
  var testDrink = (Chicken.Constants.MAX_WATER_VOLUME - Chicken.Constants.MIN_WATER_VOLUME) * fakeRandomValue;
  var testChicken = new Chicken();
  equal(testChicken.feed(), 0.0);
  equal(testChicken.water(), 0.0);
  var gameTimeDelta = 0.5;
  testChicken.processGameTick(Date.now() / 1000.0, gameTimeDelta, fakeRandom);
});
