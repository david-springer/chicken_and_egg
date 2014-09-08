/* Copyright 2014 (c) SoFIE Studios.  All rights reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file.
 */

/**
 * Compute a test peck value based on the hen's feeding parameters.
 * @param {number} factor The linear factor to use when choosing a feed amount.
 * @return The test peck value. Guaranteed to lie within the chicken's feeding parameters.
 */
var testHenPeckValue = function(henConstants, factor) {
  return henConstants.MIN_PECK_VOLUME +
    (henConstants.MAX_PECK_VOLUME - henConstants.MIN_PECK_VOLUME) *
    factor;
}

/**
 * Compute a test drink value based on the chicken's feeding parameters.
 * @param {number} factor The linear factor to use when choosing a drink amount.
 * @return The test drink value. Guaranteed to lie within the chicken's feeding
 *     parameters.
 */
var testHenDrinkValue = function(henConstants, factor) {
  return henConstants.MIN_DRINK_VOLUME +
    (henConstants.MAX_DRINK_VOLUME - henConstants.MIN_DRINK_VOLUME) *
    factor;
}

/**
 * @fileoverview Unit tests for the Chicken object.
 */
module("Hen Object", {
  teardown: function() {
    equal(NotificationDefaultCenter().hasObserversForNotification(
        Hen.DID_LAY_EGG_NOTIFICATION), false);
    equal(NotificationDefaultCenter().hasObserversForNotification(
        Hen.DID_DIE_NOTIFICATION), false);
  }
});

/*
 * Unit tests.
 */

test("Default Constructor", function() {
  var testHen = new Hen();
  equal(testHen.feed(), 0.0);
  equal(testHen.water(), 0.0);
});

test("Peck", function() {
  var testHen = new Hen();
  var fakeFeedBag = new FakeFeedBag();
  equal(testHen.feed(), 0.0);
  testHen.peckFeed(testHen.constants.MAX_FEED / 2, fakeFeedBag);
  equal(testHen.feed(), testHen.constants.MAX_FEED / 2);
  equal(testHen.water(), 0.0);
});

test("Overeat", function() {
  var testHen = new Hen();
  var fakeFeedBag = new FakeFeedBag();
  equal(testHen.feed(), 0.0);
  testHen.peckFeed(testHen.constants.MAX_FEED * 2, fakeFeedBag);
  // When a Hen overeats, its internal feed level is reset to MAX_FEED. This is different
  // than a Pullet.
  equal(testHen.feed(), testHen.constants.MAX_FEED);
  equal(testHen.water(), 0.0);
});

test("Drink", function() {
  var testHen = new Hen();
  var fakeWaterBottle = new FakeWaterBottle();
  equal(testHen.water(), 0.0);
  testHen.drinkWater(testHen.constants.MAX_WATER / 2, fakeWaterBottle);
  equal(testHen.water(), testHen.constants.MAX_WATER / 2);
  equal(testHen.feed(), 0.0);
});

test("Drink Too Much", function() {
  var testHen = new Hen();
  var fakeWaterBottle = new FakeWaterBottle();
  equal(testHen.water(), 0.0);
  testHen.drinkWater(testHen.constants.MAX_WATER * 2, fakeWaterBottle);
  // When a Hen drinks too much, its internal feed level is reset to 0. This is
  // different than a Pullet.
  equal(testHen.water(), testHen.constants.MAX_WATER);
  equal(testHen.feed(), 0.0);
});

test("Still Alive", function() {
  var testHen = new Hen();
  ok(testHen.isStillAlive());
  testHen.setEggCount(0);
  equal(testHen.isStillAlive(), false);
});

test("Should Lay Egg", function() {
  var testHen = new Hen();
  var fakeFeedBag = new FakeFeedBag();
  var fakeWaterBottle = new FakeWaterBottle();
  equal(testHen._shouldLayEgg(), false);
  testHen.peckFeed(testHen.constants.MAX_FEED / 2, fakeFeedBag);
  testHen.drinkWater(testHen.constants.MAX_WATER / 2, fakeWaterBottle);
  equal(testHen._shouldLayEgg(), false);
  testHen.setFeed(testHen.constants.MAX_FEED);
  testHen.setWater(testHen.constants.MAX_WATER);
  equal(testHen._shouldLayEgg(), true);
});

test("Has Stats", function() {
  var testHen = new Hen();
  equal(false, testHen.hasStats());
});

/*
 * Application tests.
 */

test("Lay Egg", function() {
  var testHen = new Hen();
  var fakeFeedBag = new FakeFeedBag();
  var fakeWaterBottle = new FakeWaterBottle();
  equal(testHen.feed(), 0.0);
  // Set up an event listener for the didLayEgg event.
  var didLayEggCount = 0;
  var didLayEgg = function(chicken) {
    didLayEggCount++;
    return false;
  };
  var defaultCenter = NotificationDefaultCenter();
  defaultCenter.addNotificationObserver(Hen.DID_LAY_EGG_NOTIFICATION, didLayEgg);
  testHen.peckFeed(testHen.constants.MAX_FEED, fakeFeedBag);
  testHen.drinkWater(testHen.constants.MAX_WATER, fakeWaterBottle);
  // Max feed & water should produce an egg and reset the chicken.
  equal(testHen.feed(), 0.0);
  equal(testHen.water(), 0.0);
  equal(didLayEggCount, 1);
  defaultCenter.removeNotificationObserver(Hen.DID_LAY_EGG_NOTIFICATION, didLayEgg);
});

test("Lay 2 Eggs", function() {
  var testHen = new Hen();
  var fakeFeedBag = new FakeFeedBag();
  var fakeWaterBottle = new FakeWaterBottle();
  equal(testHen.feed(), 0.0);
  // Set up an event listener for the didLayEgg event.
  var didLayEggCount = 0;
  var didLayEgg = function(chicken) {
    didLayEggCount++;
    return false;
  };
  var defaultCenter = NotificationDefaultCenter();
  defaultCenter.addNotificationObserver(Hen.DID_LAY_EGG_NOTIFICATION, didLayEgg);
  testHen.peckFeed(testHen.constants.MAX_FEED, fakeFeedBag);
  testHen.drinkWater(testHen.constants.MAX_WATER, fakeWaterBottle);
  // Max feed & water should produce an egg and reset the chicken.
  equal(testHen.feed(), 0.0);
  equal(testHen.water(), 0.0);
  equal(didLayEggCount, 1);

  // Verify that a second egg is laid after eating & drinking enough.
  testHen.peckFeed(testHen.constants.MAX_FEED, fakeFeedBag);
  testHen.drinkWater(testHen.constants.MAX_WATER, fakeWaterBottle);
  // Max feed & water should produce an egg and reset the chicken.
  equal(testHen.feed(), 0.0);
  equal(testHen.water(), 0.0);
  equal(didLayEggCount, 2);
  defaultCenter.removeNotificationObserver(Hen.DID_LAY_EGG_NOTIFICATION, didLayEgg);
});

test("Lay All Eggs", function() {
  var testHen = new Hen();
  var fakeFeedBag = new FakeFeedBag();
  var fakeWaterBottle = new FakeWaterBottle();
  ok(testHen.isStillAlive());
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
  defaultCenter.addNotificationObserver(Hen.DID_LAY_EGG_NOTIFICATION, didLayEgg);
  defaultCenter.addNotificationObserver(Hen.DID_DIE_NOTIFICATION, didDie);
  for (var i = 0; i < testHen.constants.MAX_EGG_COUNT; ++i) {
    testHen._layEgg();
  }
  equal(testHen.isStillAlive(), false);
  equal(didLayEggCount, testHen.constants.MAX_EGG_COUNT);
  equal(didDieCount, 1);
  // Try to lay one more egg, this should do nothing.
  testHen._layEgg();
  equal(didLayEggCount, testHen.constants.MAX_EGG_COUNT);
  equal(didDieCount, 1);
  defaultCenter.removeNotificationObserver(Hen.DID_LAY_EGG_NOTIFICATION, didLayEgg);
  defaultCenter.removeNotificationObserver(Hen.DID_DIE_NOTIFICATION, didDie);
});

test("Process Game Tick", function() {
  var fakeRandomValue = 0.25;
  var fakeRandom = function() {
    return fakeRandomValue;
  }
  var testHen = new Hen();
  var testPeck = testHenPeckValue(testHen.constants, fakeRandomValue);
  var testDrink = testHenDrinkValue(testHen.constants, fakeRandomValue);
  testHen.feedBag = new FakeFeedBag();
  testHen.waterBottle = new FakeWaterBottle();
  equal(testHen.feed(), 0.0);
  equal(testHen.water(), 0.0);
  var gameTimeDelta = 0.5;
  var dateNow = Date.now() / 1000.0;
  testHen.processGameTick(dateNow, gameTimeDelta, fakeRandom, Chicken.Actions.PECK);
  equal(testHen.feed(), 0.0);
  equal(testHen.water(), 0.0);
  ok(testHen._peckVolume > 0.0);
  equal(testHen._drinkVolume, 0.0);
  // Give the chicken enough time to chew all the scratch.
  gameTimeDelta = (testPeck / testHen.constants.CHEW_RATE) + 1;
  dateNow += gameTimeDelta;
  testHen.processGameTick(dateNow, gameTimeDelta, fakeRandom, Chicken.Actions.PECK);
  equal(testHen.feed(), testPeck);
  equal(testHen.water(), 0.0);
  equal(testHen._peckVolume, 0.0);
  equal(testHen._drinkVolume, 0.0);
  testHen.processGameTick(dateNow, gameTimeDelta, fakeRandom, Chicken.Actions.DRINK);
  equal(testHen.feed(), testPeck);
  equal(testHen.water(), 0.0);
  equal(testHen._peckVolume, 0.0);
  ok(testHen._drinkVolume > 0.0);
  // Give the chicken enough time to drink all the water.
  gameTimeDelta = (testDrink / testHen.constants.DRINK_RATE) + 1;
  dateNow += gameTimeDelta;
  testHen.processGameTick(dateNow, gameTimeDelta, fakeRandom, Chicken.Actions.DRINK);
  equal(testHen.feed(), testPeck);
  equal(testHen.water(), testDrink);
  equal(testHen._peckVolume, 0.0);
  equal(testHen._drinkVolume, 0.0);
  testHen.processGameTick(dateNow, gameTimeDelta, fakeRandom, Chicken.Actions.PECK);
  equal(testHen.feed(), testPeck);
  equal(testHen.water(), testDrink);
  ok(testHen._peckVolume > 0.0);
  equal(testHen._drinkVolume, 0.0);
  gameTimeDelta = (testPeck / testHen.constants.CHEW_RATE) + 1;
  dateNow += gameTimeDelta;
  testHen.processGameTick(dateNow, gameTimeDelta, fakeRandom, Chicken.Actions.PECK);
  equal(testHen.feed(), testPeck * 2.0);
  equal(testHen.water(), testDrink);
  testHen.processGameTick(dateNow, gameTimeDelta, fakeRandom, Chicken.Actions.DRINK);
  equal(testHen._peckVolume, 0.0);
  ok(testHen._drinkVolume > 0.0);
  gameTimeDelta = (testDrink / testHen.constants.DRINK_RATE) + 1;
  dateNow += gameTimeDelta;
  testHen.processGameTick(dateNow, gameTimeDelta, fakeRandom, Chicken.Actions.DRINK);
  equal(testHen.feed(), testPeck * 2.0);
  equal(testHen.water(), testDrink * 2.0);
});

test("Process Game Tick Peck Too Soon", function() {
  var fakeRandomValue = 0.25;
  var fakeRandom = function() {
    return fakeRandomValue;
  }
  var testHen = new Hen();
  var testPeck = testHenPeckValue(testHen.constants, fakeRandomValue);
  var testDrink = testHenDrinkValue(testHen.constants, fakeRandomValue);
  testHen.feedBag = new FakeFeedBag();
  testHen.waterBottle = new FakeWaterBottle();
  equal(testHen.feed(), 0.0);
  equal(testHen.water(), 0.0);
  // Pick a time step that's 1/2 of the time needed to chew the scratch.
  var gameTimeDelta = (testPeck / testHen.constants.CHEW_RATE) / 2;
  var dateNow = Date.now() / 1000.0;
  testHen.processGameTick(dateNow, gameTimeDelta, fakeRandom, Chicken.Actions.PECK);
  equal(testHen.feed(), 0.0);
  equal(testHen.water(), 0.0);
  testHen.processGameTick(dateNow + gameTimeDelta, gameTimeDelta, fakeRandom,
      Chicken.Actions.PECK);
  equal(testHen.feed(), testPeck / 2.0);
  equal(testHen.water(), 0.0);
  testHen.processGameTick(dateNow + gameTimeDelta, gameTimeDelta, fakeRandom,
      Chicken.Actions.DRINK);
  equal(testHen.feed(), testPeck / 2.0);
  equal(testHen.water(), 0.0);
});

test("Process Game Tick Drink Too Soon", function() {
  var fakeRandomValue = 0.25;
  var fakeRandom = function() {
    return fakeRandomValue;
  }
  var testHen = new Hen();
  var testPeck = testHenPeckValue(testHen.constants, fakeRandomValue);
  var testDrink = testHenDrinkValue(testHen.constants, fakeRandomValue);
  testHen.feedBag = new FakeFeedBag();
  testHen.waterBottle = new FakeWaterBottle();
  equal(testHen.feed(), 0.0);
  equal(testHen.water(), 0.0);
  // Pick a time step that's 1/2 of the time needed to drink the water.
  var gameTimeDelta = (testDrink / testHen.constants.DRINK_RATE) / 2;
  var dateNow = Date.now() / 1000.0;
  testHen.processGameTick(dateNow, gameTimeDelta, fakeRandom, Chicken.Actions.DRINK);
  equal(testHen.feed(), 0.0);
  equal(testHen.water(), 0.0);
  testHen.processGameTick(dateNow + gameTimeDelta, gameTimeDelta, fakeRandom,
      Chicken.Actions.DRINK);
  equal(testHen.feed(), 0.0);
  equal(testHen.water(), testDrink / 2.0);
  testHen.processGameTick(dateNow + gameTimeDelta, gameTimeDelta, fakeRandom,
      Chicken.Actions.PECK);
  equal(testHen.feed(), 0.0);
  equal(testHen.water(), testDrink / 2.0);
});

test("Process Game Tick No Feed, No Water", function() {
  var fakeRandomValue = 0.5;
  var fakeRandom = function() {
    return fakeRandomValue;
  }
  var testHen = new Hen();
  var testPeck = testHenPeckValue(testHen.constants, fakeRandomValue);
  var testDrink = testHenDrinkValue(testHen.constants, fakeRandomValue);
  equal(testHen.feed(), 0.0);
  equal(testHen.water(), 0.0);
  var dateNow = Date.now() / 1000.0;
  var gameTimeDelta = 0.5;
  testHen.processGameTick(dateNow, gameTimeDelta, fakeRandom, Chicken.Actions.PECK);
  equal(testHen.feed(), 0.0);
  equal(testHen.water(), 0.0);
  // Give the chicken enough time to chew all the scratch.
  gameTimeDelta = (testPeck / testHen.constants.CHEW_RATE) + 1;
  dateNow += gameTimeDelta;
  testHen.processGameTick(dateNow + gameTimeDelta, gameTimeDelta, fakeRandom,
      Chicken.Actions.PECK);
  equal(testHen.feed(), 0.0);
  equal(testHen.water(), 0.0);
  testHen.processGameTick(dateNow + gameTimeDelta, gameTimeDelta, fakeRandom,
       Chicken.Actions.DRINK);
  equal(testHen.feed(), 0.0);
  equal(testHen.water(), 0.0);
  // Give the chicken enough time to drink all the water.
  gameTimeDelta = (testDrink / testHen.constants.DRINK_RATE) + 1;
  dateNow += gameTimeDelta;
  testHen.processGameTick(dateNow + gameTimeDelta, gameTimeDelta, fakeRandom,
      Chicken.Actions.DRINK);
  equal(testHen.feed(), 0.0);
  equal(testHen.water(), 0.0);
});

test("Whole Hen", function() {
  // Test the entire chicken cycle: eat, drink, lay an egg.
  var fakeRandomValue = 1.0;
  var fakeRandom = function() {
    return fakeRandomValue;
  }
  var testHen = new Hen();
  var testPeck = testHenPeckValue(testHen.constants, fakeRandomValue);
  var testDrink = testHenDrinkValue(testHen.constants, fakeRandomValue);
  testHen.feedBag = new FakeFeedBag();
  testHen.waterBottle = new FakeWaterBottle();
  equal(testHen.feed(), 0.0);
  equal(testHen.water(), 0.0);
  // Set up an event listener for the didLayEgg event.
  var didLayEggCount = 0;
  var didLayEgg = function(chicken) {
    didLayEggCount++;
    return false;
  };
  var defaultCenter = NotificationDefaultCenter();
  defaultCenter.addNotificationObserver(Hen.DID_LAY_EGG_NOTIFICATION, didLayEgg);
  // Eat enough scratch and drink enough water to lay an egg by choosing a time delta
  // that will process all the comestibles in one iteration.
  var peckTimeDelta = (testPeck / testHen.constants.CHEW_RATE) + 1;
  var drinkTimeDelta = (testDrink / testHen.constants.DRINK_RATE) + 1;
  var gameTimeDelta = peckTimeDelta > drinkTimeDelta ? peckTimeDelta : drinkTimeDelta;
  var dateNow = Date.now() / 1000.0;
  // Set a maximum number of iterations so the test isn't flakey.
  var maxIters = Math.floor(testHen.constants.MAX_FEED / testPeck + 0.5) + 1 +
      Math.floor(testHen.constants.MAX_WATER / testDrink + 0.5) + 1;
  while (didLayEggCount == 0 && maxIters >= 0) {
    // Peck some scratch or drink some water.
    testHen.processGameTick(dateNow, gameTimeDelta, fakeRandom);
    // Chew and eat the scratch or drink the water in one iteration.
    testHen.processGameTick(dateNow + gameTimeDelta, gameTimeDelta, fakeRandom);
    dateNow += gameTimeDelta;
    maxIters--;
  }
  ok(maxIters > 0);
  equal(testHen.feed(), 0.0);
  equal(testHen.water(), 0.0);
  equal(didLayEggCount, 1);

  defaultCenter.removeNotificationObserver(Hen.DID_LAY_EGG_NOTIFICATION, didLayEgg);
});
