/* Copyright 2014 (c) SoFIE Studios.  All rights reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file.
 */

/**
 * Compute a test peck value based on the chicken's feeding parameters.
 * @param {number} factor The linear factor to use when choosing a feed amount.
 * @return The test peck value. Guaranteed to lie within the chicken's feeding parameters.
 */
var testPeckValue = function(factor) {
  return Chicken.Constants.MIN_PECK_VOLUME +
    (Chicken.Constants.MAX_PECK_VOLUME - Chicken.Constants.MIN_PECK_VOLUME) *
    factor;
}

/**
 * Compute a test drink value based on the chicken's feeding parameters.
 * @param {number} factor The linear factor to use when choosing a drink amount.
 * @return The test drink value. Guaranteed to lie within the chicken's feeding
 *     parameters.
 */
var testDrinkValue = function(factor) {
  return Chicken.Constants.MIN_DRINK_VOLUME +
    (Chicken.Constants.MAX_DRINK_VOLUME - Chicken.Constants.MIN_DRINK_VOLUME) *
    factor;
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

/*
 * Unit tests.
 */

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
  testChicken._nextAction();
  ok(firstAction == testChicken._action);
});

test("Next Action Not Finished", function() {
  var testChicken = new Chicken();
  var firstAction = testChicken._action;
  testChicken._peckVolume = 2.0;
  testChicken._nextAction();
  equal(firstAction, testChicken._action);
  testChicken._peckVolume = 0.0;
  testChicken._drinkVolume = 2.0;
  testChicken._nextAction();
  equal(firstAction, testChicken._action);
});

test("Still Alive", function() {
  var testChicken = new Chicken();
  ok(testChicken.isStillAlive());
  testChicken.setEggCount(0);
  equal(testChicken.isStillAlive(), false);
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

test("Has Stats", function() {
  var testChicken = new Chicken();
  ok(testChicken.hasStats());
});

test("Display Name", function() {
  var testChicken = new Chicken();
  ok(testChicken.displayName() !== "<unnamed>");
});

test("Stats Display String", function() {
  var testChicken = new Chicken();
  equal(testChicken.statsDisplayString(), Chicken.Constants.MAX_EGG_COUNT.toString());
  testChicken.setEggCount(12);
  equal(testChicken.statsDisplayString(), "12");
  testChicken.setEggCount(0);
  equal(testChicken.statsDisplayString(), "0");
});

/*
 * Application tests.
 */

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
  var testPeck = testPeckValue(fakeRandomValue);
  var testDrink = testDrinkValue(fakeRandomValue);
  var testChicken = new Chicken();
  testChicken.feedBag = new FakeFeedBag();
  testChicken.waterBottle = new FakeWaterBottle();
  equal(testChicken.feed(), 0.0);
  equal(testChicken.water(), 0.0);
  var gameTimeDelta = 0.5;
  var dateNow = Date.now() / 1000.0;
  testChicken.processGameTick(dateNow, gameTimeDelta, fakeRandom, Chicken.Actions.PECK);
  equal(testChicken.feed(), 0.0);
  equal(testChicken.water(), 0.0);
  ok(testChicken._peckVolume > 0.0);
  equal(testChicken._drinkVolume, 0.0);
  // Give the chicken enough time to chew all the scratch.
  gameTimeDelta = (testPeck / Chicken.Constants.CHEW_RATE) + 1;
  dateNow += gameTimeDelta;
  testChicken.processGameTick(dateNow, gameTimeDelta, fakeRandom, Chicken.Actions.PECK);
  equal(testChicken.feed(), testPeck);
  equal(testChicken.water(), 0.0);
  equal(testChicken._peckVolume, 0.0);
  equal(testChicken._drinkVolume, 0.0);
  testChicken.processGameTick(dateNow, gameTimeDelta, fakeRandom, Chicken.Actions.DRINK);
  equal(testChicken.feed(), testPeck);
  equal(testChicken.water(), 0.0);
  equal(testChicken._peckVolume, 0.0);
  ok(testChicken._drinkVolume > 0.0);
  // Give the chicken enough time to drink all the water.
  gameTimeDelta = (testDrink / Chicken.Constants.DRINK_RATE) + 1;
  dateNow += gameTimeDelta;
  testChicken.processGameTick(dateNow, gameTimeDelta, fakeRandom, Chicken.Actions.DRINK);
  equal(testChicken.feed(), testPeck);
  equal(testChicken.water(), testDrink);
  equal(testChicken._peckVolume, 0.0);
  equal(testChicken._drinkVolume, 0.0);
  testChicken.processGameTick(dateNow, gameTimeDelta, fakeRandom, Chicken.Actions.PECK);
  equal(testChicken.feed(), testPeck);
  equal(testChicken.water(), testDrink);
  ok(testChicken._peckVolume > 0.0);
  equal(testChicken._drinkVolume, 0.0);
  gameTimeDelta = (testPeck / Chicken.Constants.CHEW_RATE) + 1;
  dateNow += gameTimeDelta;
  testChicken.processGameTick(dateNow, gameTimeDelta, fakeRandom, Chicken.Actions.PECK);
  equal(testChicken.feed(), testPeck * 2.0);
  equal(testChicken.water(), testDrink);
  testChicken.processGameTick(dateNow, gameTimeDelta, fakeRandom, Chicken.Actions.DRINK);
  equal(testChicken._peckVolume, 0.0);
  ok(testChicken._drinkVolume > 0.0);
  gameTimeDelta = (testDrink / Chicken.Constants.DRINK_RATE) + 1;
  dateNow += gameTimeDelta;
  testChicken.processGameTick(dateNow, gameTimeDelta, fakeRandom, Chicken.Actions.DRINK);
  equal(testChicken.feed(), testPeck * 2.0);
  equal(testChicken.water(), testDrink * 2.0);
});

test("Process Game Tick Peck Too Soon", function() {
  var fakeRandomValue = 0.25;
  var fakeRandom = function() {
    return fakeRandomValue;
  }
  var testPeck = testPeckValue(fakeRandomValue);
  var testDrink = testDrinkValue(fakeRandomValue);
  var testChicken = new Chicken();
  testChicken.feedBag = new FakeFeedBag();
  testChicken.waterBottle = new FakeWaterBottle();
  equal(testChicken.feed(), 0.0);
  equal(testChicken.water(), 0.0);
  // Pick a time step that's 1/2 of the time needed to chew the scratch.
  var gameTimeDelta = (testPeck / Chicken.Constants.CHEW_RATE) / 2;
  var dateNow = Date.now() / 1000.0;
  testChicken.processGameTick(dateNow, gameTimeDelta, fakeRandom, Chicken.Actions.PECK);
  equal(testChicken.feed(), 0.0);
  equal(testChicken.water(), 0.0);
  testChicken.processGameTick(dateNow + gameTimeDelta, gameTimeDelta, fakeRandom,
      Chicken.Actions.PECK);
  equal(testChicken.feed(), testPeck / 2.0);
  equal(testChicken.water(), 0.0);
  testChicken.processGameTick(dateNow + gameTimeDelta, gameTimeDelta, fakeRandom,
      Chicken.Actions.DRINK);
  equal(testChicken.feed(), testPeck / 2.0);
  equal(testChicken.water(), 0.0);
});

test("Process Game Tick Drink Too Soon", function() {
  var fakeRandomValue = 0.25;
  var fakeRandom = function() {
    return fakeRandomValue;
  }
  var testPeck = testPeckValue(fakeRandomValue);
  var testDrink = testDrinkValue(fakeRandomValue);
  var testChicken = new Chicken();
  testChicken.feedBag = new FakeFeedBag();
  testChicken.waterBottle = new FakeWaterBottle();
  equal(testChicken.feed(), 0.0);
  equal(testChicken.water(), 0.0);
  // Pick a time step that's 1/2 of the time needed to drink the water.
  var gameTimeDelta = (testDrink / Chicken.Constants.DRINK_RATE) / 2;
  var dateNow = Date.now() / 1000.0;
  testChicken.processGameTick(dateNow, gameTimeDelta, fakeRandom, Chicken.Actions.DRINK);
  equal(testChicken.feed(), 0.0);
  equal(testChicken.water(), 0.0);
  testChicken.processGameTick(dateNow + gameTimeDelta, gameTimeDelta, fakeRandom,
      Chicken.Actions.DRINK);
  equal(testChicken.feed(), 0.0);
  equal(testChicken.water(), testDrink / 2.0);
  testChicken.processGameTick(dateNow + gameTimeDelta, gameTimeDelta, fakeRandom,
      Chicken.Actions.PECK);
  equal(testChicken.feed(), 0.0);
  equal(testChicken.water(), testDrink / 2.0);
});

test("Process Game Tick No Feed, No Water", function() {
  var fakeRandomValue = 0.5;
  var fakeRandom = function() {
    return fakeRandomValue;
  }
  var testPeck = testPeckValue(fakeRandomValue);
  var testDrink = testDrinkValue(fakeRandomValue);
  var testChicken = new Chicken();
  equal(testChicken.feed(), 0.0);
  equal(testChicken.water(), 0.0);
  var dateNow = Date.now() / 1000.0;
  var gameTimeDelta = 0.5;
  testChicken.processGameTick(dateNow, gameTimeDelta, fakeRandom, Chicken.Actions.PECK);
  equal(testChicken.feed(), 0.0);
  equal(testChicken.water(), 0.0);
  // Give the chicken enough time to chew all the scratch.
  gameTimeDelta = (testPeck / Chicken.Constants.CHEW_RATE) + 1;
  dateNow += gameTimeDelta;
  testChicken.processGameTick(dateNow + gameTimeDelta, gameTimeDelta, fakeRandom,
      Chicken.Actions.PECK);
  equal(testChicken.feed(), 0.0);
  equal(testChicken.water(), 0.0);
  testChicken.processGameTick(dateNow + gameTimeDelta, gameTimeDelta, fakeRandom,
       Chicken.Actions.DRINK);
  equal(testChicken.feed(), 0.0);
  equal(testChicken.water(), 0.0);
  // Give the chicken enough time to drink all the water.
  gameTimeDelta = (testDrink / Chicken.Constants.DRINK_RATE) + 1;
  dateNow += gameTimeDelta;
  testChicken.processGameTick(dateNow + gameTimeDelta, gameTimeDelta, fakeRandom,
      Chicken.Actions.DRINK);
  equal(testChicken.feed(), 0.0);
  equal(testChicken.water(), 0.0);
});

test("Whole Chicken", function() {
  // Test the entire chicken cycle: eat, drink, lay an egg.
  var fakeRandomValue = 1.0;
  var fakeRandom = function() {
    return fakeRandomValue;
  }
  var testPeck = testPeckValue(fakeRandomValue);
  var testDrink = testDrinkValue(fakeRandomValue);
  var testChicken = new Chicken();
  testChicken.feedBag = new FakeFeedBag();
  testChicken.waterBottle = new FakeWaterBottle();
  equal(testChicken.feed(), 0.0);
  equal(testChicken.water(), 0.0);
  // Set up an event listener for the didLayEgg event.
  var didLayEggCount = 0;
  var didLayEgg = function(chicken) {
    didLayEggCount++;
    return false;
  };
  var defaultCenter = NotificationDefaultCenter();
  defaultCenter.addNotificationObserver(Chicken.DID_LAY_EGG_NOTIFICATION, didLayEgg);
  // Eat enough scratch and drink enough water to lay an egg by choosing a time delta
  // that will process all the comestibles in one iteration.
  var peckTimeDelta = (testPeck / Chicken.Constants.CHEW_RATE) + 1;
  var drinkTimeDelta = (testDrink / Chicken.Constants.DRINK_RATE) + 1;
  var gameTimeDelta = peckTimeDelta > drinkTimeDelta ? peckTimeDelta : drinkTimeDelta;
  var dateNow = Date.now() / 1000.0;
  // Set a maximum number of iterations so the test isn't flakey.
  var maxIters = Math.floor(Chicken.Constants.MAX_FEED / testPeck + 0.5) + 1 +
      Math.floor(Chicken.Constants.MAX_WATER / testDrink + 0.5) + 1;
  while (didLayEggCount == 0 && maxIters >= 0) {
    // Peck some scratch or drink some water.
    testChicken.processGameTick(dateNow, gameTimeDelta, fakeRandom);
    // Chew and eat the scratch or drink the water in one iteration.
    testChicken.processGameTick(dateNow + gameTimeDelta, gameTimeDelta, fakeRandom);
    dateNow += gameTimeDelta;
    maxIters--;
  }
  ok(maxIters > 0);
  equal(testChicken.feed(), 0.0);
  equal(testChicken.water(), 0.0);
  equal(didLayEggCount, 1);

  defaultCenter.removeNotificationObserver(Chicken.DID_LAY_EGG_NOTIFICATION, didLayEgg);
});
