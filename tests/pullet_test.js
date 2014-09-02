/* Copyright 2014 (c) SoFIE Studios.  All rights reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file.
 */

/**
 * Compute a test peck value based on the pullet's feeding parameters.
 * @param {number} factor The linear factor to use when choosing a feed amount.
 * @return The test peck value. Guaranteed to lie within the chicken's feeding parameters.
 */
var testPulletPeckValue = function(pulletConstants, factor) {
  return pulletConstants.MIN_PECK_VOLUME +
    (pulletConstants.MAX_PECK_VOLUME - pulletConstants.MIN_PECK_VOLUME) *
    factor;
}

/**
 * Compute a test drink value based on the pullet's feeding parameters.
 * @param {number} factor The linear factor to use when choosing a drink amount.
 * @return The test drink value. Guaranteed to lie within the chicken's feeding
 *     parameters.
 */
var testPulletDrinkValue = function(pulletConstants, factor) {
  return pulletConstants.MIN_DRINK_VOLUME +
    (pulletConstants.MAX_DRINK_VOLUME - pulletConstants.MIN_DRINK_VOLUME) *
    factor;
}

/**
 * @fileoverview Unit tests for the Pullet object.
 */
module("Pullet Object");

/*
 * Unit tests.
 */

test("Default Constructor", function() {
  var testPullet = new Pullet();
  equal(testPullet.feed(), 0.0);
  equal(testPullet.water(), 0.0);
});

test("Peck", function() {
  var testPullet = new Pullet();
  var fakeFeedBag = new FakeFeedBag();
  equal(testPullet.feed(), 0.0);
  testPullet.peckFeed(testPullet.constants.MAX_FEED / 2, fakeFeedBag);
  equal(testPullet.feed(), testPullet.constants.MAX_FEED / 2);
  equal(testPullet.water(), 0.0);
});

test("Overeat", function() {
  var testPullet = new Pullet();
  var fakeFeedBag = new FakeFeedBag();
  equal(testPullet.feed(), 0.0);
  testPullet.peckFeed(testPullet.constants.MAX_FEED * 2, fakeFeedBag);
  // When a Pullet overeats, its internal feed level is reset to 0. This is different
  // than a Hen.
  equal(testPullet.feed(), 0.0);
  equal(testPullet.water(), 0.0);
});

test("Drink", function() {
  var testPullet = new Pullet();
  var fakeWaterBottle = new FakeWaterBottle();
  equal(testPullet.water(), 0.0);
  testPullet.drinkWater(testPullet.constants.MAX_WATER / 2, fakeWaterBottle);
  equal(testPullet.water(), testPullet.constants.MAX_WATER / 2);
  equal(testPullet.feed(), 0.0);
});

test("Drink Too Much", function() {
  var testPullet = new Pullet();
  var fakeWaterBottle = new FakeWaterBottle();
  equal(testPullet.water(), 0.0);
  testPullet.drinkWater(testPullet.constants.MAX_WATER * 2, fakeWaterBottle);
  // When a Pullet drinks too much, its internal feed level is reset to 0. This is
  // different than a Hen.
  equal(testPullet.water(), 0.0);
  equal(testPullet.feed(), 0.0);
});

test("Has Stats", function() {
  var testPullet = new Pullet();
  equal(false, testPullet.hasStats());
});

/*
 * Application tests.
 */

test("Process Game Tick", function() {
  var fakeRandomValue = 0.25;
  var fakeRandom = function() {
    return fakeRandomValue;
  }
  var testPullet = new Pullet();
  var testPeck = testPulletPeckValue(testPullet.constants, fakeRandomValue);
  var testDrink = testPulletDrinkValue(testPullet.constants, fakeRandomValue);
  testPullet.feedBag = new FakeFeedBag();
  testPullet.waterBottle = new FakeWaterBottle();
  equal(testPullet.feed(), 0.0);
  equal(testPullet.water(), 0.0);
  var gameTimeDelta = 0.5;
  var dateNow = Date.now() / 1000.0;
  testPullet.processGameTick(dateNow, gameTimeDelta, fakeRandom, Chicken.Actions.PECK);
  equal(testPullet.feed(), 0.0);
  equal(testPullet.water(), 0.0);
  ok(testPullet._peckVolume > 0.0);
  equal(testPullet._drinkVolume, 0.0);
  // Give the chicken enough time to chew all the scratch.
  gameTimeDelta = (testPeck / testPullet.constants.CHEW_RATE) + 1;
  dateNow += gameTimeDelta;
  testPullet.processGameTick(dateNow, gameTimeDelta, fakeRandom, Chicken.Actions.PECK);
  equal(testPullet.feed(), testPeck);
  equal(testPullet.water(), 0.0);
  equal(testPullet._peckVolume, 0.0);
  equal(testPullet._drinkVolume, 0.0);
  testPullet.processGameTick(dateNow, gameTimeDelta, fakeRandom, Chicken.Actions.DRINK);
  equal(testPullet.feed(), testPeck);
  equal(testPullet.water(), 0.0);
  equal(testPullet._peckVolume, 0.0);
  ok(testPullet._drinkVolume > 0.0);
  // Give the chicken enough time to drink all the water.
  gameTimeDelta = (testDrink / testPullet.constants.DRINK_RATE) + 1;
  dateNow += gameTimeDelta;
  testPullet.processGameTick(dateNow, gameTimeDelta, fakeRandom, Chicken.Actions.DRINK);
  equal(testPullet.feed(), testPeck);
  equal(testPullet.water(), testDrink);
  equal(testPullet._peckVolume, 0.0);
  equal(testPullet._drinkVolume, 0.0);
  testPullet.processGameTick(dateNow, gameTimeDelta, fakeRandom, Chicken.Actions.PECK);
  equal(testPullet.feed(), testPeck);
  equal(testPullet.water(), testDrink);
  ok(testPullet._peckVolume > 0.0);
  equal(testPullet._drinkVolume, 0.0);
  gameTimeDelta = (testPeck / testPullet.constants.CHEW_RATE) + 1;
  dateNow += gameTimeDelta;
  testPullet.processGameTick(dateNow, gameTimeDelta, fakeRandom, Chicken.Actions.PECK);
  equal(testPullet.feed(), testPeck * 2.0);
  equal(testPullet.water(), testDrink);
  testPullet.processGameTick(dateNow, gameTimeDelta, fakeRandom, Chicken.Actions.DRINK);
  equal(testPullet._peckVolume, 0.0);
  ok(testPullet._drinkVolume > 0.0);
  gameTimeDelta = (testDrink / testPullet.constants.DRINK_RATE) + 1;
  dateNow += gameTimeDelta;
  testPullet.processGameTick(dateNow, gameTimeDelta, fakeRandom, Chicken.Actions.DRINK);
  equal(testPullet.feed(), testPeck * 2.0);
  equal(testPullet.water(), testDrink * 2.0);
});

test("Process Game Tick Peck Too Soon", function() {
  var fakeRandomValue = 0.25;
  var fakeRandom = function() {
    return fakeRandomValue;
  }
  var testPullet = new Pullet();
  var testPeck = testPulletPeckValue(testPullet.constants, fakeRandomValue);
  var testDrink = testPulletDrinkValue(testPullet.constants, fakeRandomValue);
  testPullet.feedBag = new FakeFeedBag();
  testPullet.waterBottle = new FakeWaterBottle();
  equal(testPullet.feed(), 0.0);
  equal(testPullet.water(), 0.0);
  // Pick a time step that's 1/2 of the time needed to chew the scratch.
  var gameTimeDelta = (testPeck / testPullet.constants.CHEW_RATE) / 2;
  var dateNow = Date.now() / 1000.0;
  testPullet.processGameTick(dateNow, gameTimeDelta, fakeRandom, Chicken.Actions.PECK);
  equal(testPullet.feed(), 0.0);
  equal(testPullet.water(), 0.0);
  testPullet.processGameTick(dateNow + gameTimeDelta, gameTimeDelta, fakeRandom,
      Chicken.Actions.PECK);
  equal(testPullet.feed(), testPeck / 2.0);
  equal(testPullet.water(), 0.0);
  testPullet.processGameTick(dateNow + gameTimeDelta, gameTimeDelta, fakeRandom,
      Chicken.Actions.DRINK);
  equal(testPullet.feed(), testPeck / 2.0);
  equal(testPullet.water(), 0.0);
});

test("Process Game Tick Drink Too Soon", function() {
  var fakeRandomValue = 0.25;
  var fakeRandom = function() {
    return fakeRandomValue;
  }
  var testPullet = new Pullet();
  var testPeck = testPulletPeckValue(testPullet.constants, fakeRandomValue);
  var testDrink = testPulletDrinkValue(testPullet.constants, fakeRandomValue);
  testPullet.feedBag = new FakeFeedBag();
  testPullet.waterBottle = new FakeWaterBottle();
  equal(testPullet.feed(), 0.0);
  equal(testPullet.water(), 0.0);
  // Pick a time step that's 1/2 of the time needed to drink the water.
  var gameTimeDelta = (testDrink / testPullet.constants.DRINK_RATE) / 2;
  var dateNow = Date.now() / 1000.0;
  testPullet.processGameTick(dateNow, gameTimeDelta, fakeRandom, Chicken.Actions.DRINK);
  equal(testPullet.feed(), 0.0);
  equal(testPullet.water(), 0.0);
  testPullet.processGameTick(dateNow + gameTimeDelta, gameTimeDelta, fakeRandom,
      Chicken.Actions.DRINK);
  equal(testPullet.feed(), 0.0);
  equal(testPullet.water(), testDrink / 2.0);
  testPullet.processGameTick(dateNow + gameTimeDelta, gameTimeDelta, fakeRandom,
      Chicken.Actions.PECK);
  equal(testPullet.feed(), 0.0);
  equal(testPullet.water(), testDrink / 2.0);
});

test("Process Game Tick No Feed, No Water", function() {
  var fakeRandomValue = 0.5;
  var fakeRandom = function() {
    return fakeRandomValue;
  }
  var testPullet = new Pullet();
  var testPeck = testPulletPeckValue(testPullet.constants, fakeRandomValue);
  var testDrink = testPulletDrinkValue(testPullet.constants, fakeRandomValue);
  equal(testPullet.feed(), 0.0);
  equal(testPullet.water(), 0.0);
  var dateNow = Date.now() / 1000.0;
  var gameTimeDelta = 0.5;
  testPullet.processGameTick(dateNow, gameTimeDelta, fakeRandom, Chicken.Actions.PECK);
  equal(testPullet.feed(), 0.0);
  equal(testPullet.water(), 0.0);
  // Give the chicken enough time to chew all the scratch.
  gameTimeDelta = (testPeck / testPullet.constants.CHEW_RATE) + 1;
  dateNow += gameTimeDelta;
  testPullet.processGameTick(dateNow + gameTimeDelta, gameTimeDelta, fakeRandom,
      Chicken.Actions.PECK);
  equal(testPullet.feed(), 0.0);
  equal(testPullet.water(), 0.0);
  testPullet.processGameTick(dateNow + gameTimeDelta, gameTimeDelta, fakeRandom,
       Chicken.Actions.DRINK);
  equal(testPullet.feed(), 0.0);
  equal(testPullet.water(), 0.0);
  // Give the chicken enough time to drink all the water.
  gameTimeDelta = (testDrink / testPullet.constants.DRINK_RATE) + 1;
  dateNow += gameTimeDelta;
  testPullet.processGameTick(dateNow + gameTimeDelta, gameTimeDelta, fakeRandom,
      Chicken.Actions.DRINK);
  equal(testPullet.feed(), 0.0);
  equal(testPullet.water(), 0.0);
});
