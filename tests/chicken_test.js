/* Copyright 2014 (c) SoFIE Studios.  All rights reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file.
 */

/**
 * Compute a test peck value based on the chicken's feeding parameters.
 * @param {number} factor The linear factor to use when choosing a feed amount.
 * @return The test peck value. Guaranteed to lie within the chicken's feeding parameters.
 */
var testChickenPeckValue = function(chickenConstants, factor) {
  return chickenConstants.MIN_PECK_VOLUME +
    (chickenConstants.MAX_PECK_VOLUME - chickenConstants.MIN_PECK_VOLUME) *
    factor;
}

/**
 * Compute a test drink value based on the chicken's feeding parameters.
 * @param {number} factor The linear factor to use when choosing a drink amount.
 * @return The test drink value. Guaranteed to lie within the chicken's feeding
 *     parameters.
 */
var testChickenDrinkValue = function(chickenConstants, factor) {
  return chickenConstants.MIN_DRINK_VOLUME +
    (chickenConstants.MAX_DRINK_VOLUME - chickenConstants.MIN_DRINK_VOLUME) *
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

test("Has Stats", function() {
  var testChicken = new Chicken();
  equal(false, testChicken.hasStats());
});

/*
 * Application tests.
 */

test("Process Game Tick", function() {
  var fakeRandomValue = 0.25;
  var fakeRandom = function() {
    return fakeRandomValue;
  }
  var testChicken = new Chicken();
  var testPeck = testChickenPeckValue(testChicken.constants, fakeRandomValue);
  var testDrink = testChickenDrinkValue(testChicken.constants, fakeRandomValue);
  testChicken.feedBag = new FakeFeedBag();
  testChicken.waterBottle = new FakeWaterBottle();
  equal(testChicken._peckVolume, 0.0);
  equal(testChicken._drinkVolume, 0.0);
  var gameTimeDelta = 0.5;
  var dateNow = Date.now() / 1000.0;
  testChicken.processGameTick(dateNow, gameTimeDelta, fakeRandom, Chicken.Actions.PECK);
  ok(testChicken._peckVolume > 0.0);
  equal(testChicken._drinkVolume, 0.0);
  // Give the chicken enough time to chew all the scratch.
  gameTimeDelta = (testPeck / testChicken.constants.CHEW_RATE) + 1;
  dateNow += gameTimeDelta;
  testChicken.processGameTick(dateNow, gameTimeDelta, fakeRandom, Chicken.Actions.PECK);
  equal(testChicken._peckVolume, 0.0);
  equal(testChicken._drinkVolume, 0.0);
  testChicken.processGameTick(dateNow, gameTimeDelta, fakeRandom, Chicken.Actions.DRINK);
  equal(testChicken._peckVolume, 0.0);
  ok(testChicken._drinkVolume > 0.0);
  // Give the chicken enough time to drink all the water.
  gameTimeDelta = (testDrink / testChicken.constants.DRINK_RATE) + 1;
  dateNow += gameTimeDelta;
  testChicken.processGameTick(dateNow, gameTimeDelta, fakeRandom, Chicken.Actions.DRINK);
  equal(testChicken._peckVolume, 0.0);
  equal(testChicken._drinkVolume, 0.0);
  testChicken.processGameTick(dateNow, gameTimeDelta, fakeRandom, Chicken.Actions.PECK);
  ok(testChicken._peckVolume > 0.0);
  equal(testChicken._drinkVolume, 0.0);
  gameTimeDelta = (testPeck / testChicken.constants.CHEW_RATE) + 1;
  dateNow += gameTimeDelta;
  testChicken.processGameTick(dateNow, gameTimeDelta, fakeRandom, Chicken.Actions.PECK);
  testChicken.processGameTick(dateNow, gameTimeDelta, fakeRandom, Chicken.Actions.DRINK);
  equal(testChicken._peckVolume, 0.0);
  ok(testChicken._drinkVolume > 0.0);
  gameTimeDelta = (testDrink / testChicken.constants.DRINK_RATE) + 1;
  dateNow += gameTimeDelta;
  testChicken.processGameTick(dateNow, gameTimeDelta, fakeRandom, Chicken.Actions.DRINK);
});
