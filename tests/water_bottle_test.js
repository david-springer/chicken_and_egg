/* Copyright 2014 (c) SoFIE Studios.  All rights reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview Unit tests for the WaterBottle object.
 */
module("WaterBottle Object", {
  teardown: function() {
    equal(NotificationDefaultCenter().hasObserversForNotification(
        WaterBottle.REFILL_LEVEL_NOTIFICATION), false);
  }
});

var fakeWaterBottleView = { waterLevelFraction: 1.0 };

test("Default Constructor", function() {
  var testBottle = new WaterBottle();
  equal(testBottle.waterLevel(), WaterBottle.MAX_WATER_LEVEL);
});

test("Drink From Full", function() {
  var testBottle = new WaterBottle();
  testBottle.view = fakeWaterBottleView;
  var amountDrunk = testBottle.drink(60.0);
  equal(amountDrunk, 60.0);
  equal(testBottle.waterLevel(), WaterBottle.MAX_WATER_LEVEL - 60.0);
});

test("Drink Not Enough", function() {
  var testBottle = new WaterBottle();
  testBottle.view = fakeWaterBottleView;
  testBottle.setWaterLevel(25.0);
  var amountDrunk = testBottle.drink(60.0);
  equal(amountDrunk, 25.0);
  equal(testBottle.waterLevel(), 0);
});

test("Drink Negative", function() {
  var testBottle = new WaterBottle();
  testBottle.view = fakeWaterBottleView;
  var amountDrunk = testBottle.drink(-10.0);
  equal(amountDrunk, 0);
  equal(testBottle.waterLevel(), WaterBottle.MAX_WATER_LEVEL);
});

test("Is Empty", function() {
  var testBottle = new WaterBottle();
  testBottle.view = fakeWaterBottleView;
  var amountDrunk = testBottle.drink(WaterBottle.MAX_WATER_LEVEL + 60.0);
  equal(amountDrunk, WaterBottle.MAX_WATER_LEVEL);
  ok(testBottle.isEmpty());
});

test("Refill", function() {
  var testBottle = new WaterBottle();
  testBottle.view = fakeWaterBottleView;
  testBottle.setWaterLevel(25.0);
  equal(testBottle.isEmpty(), false);
  ok(testBottle.waterLevel() < WaterBottle.MAX_WATER_LEVEL);
  ok(testBottle.refill());
  equal(testBottle.waterLevel(), WaterBottle.MAX_WATER_LEVEL);
});

test("Refill Above Max Refill", function() {
  var testBottle = new WaterBottle();
  testBottle.view = fakeWaterBottleView;
  testBottle.setWaterLevel(WaterBottle.MAX_REFILL_LEVEL + 10.0);
  var waterLevel = testBottle.waterLevel();
  equal(testBottle.isEmpty(), false);
  ok(testBottle.waterLevel() < WaterBottle.MAX_WATER_LEVEL);
  equal(testBottle.refill(), false);
  equal(testBottle.waterLevel(), waterLevel);
});

test("Has Stats", function() {
  var testBottle = new WaterBottle();
  equal(false, testBottle.hasStats());
});

/*
 * Application tests.
 */

test("Refill Notification", function() {
  var testBottle = new WaterBottle();
  testBottle.view = fakeWaterBottleView;
  testBottle.setWaterLevel(WaterBottle.MAX_REFILL_LEVEL + 10.0);
  var waterLevel = testBottle.waterLevel();
  ok(testBottle.waterLevel() > WaterBottle.MAX_REFILL_LEVEL);
  // Set up an event listener for the refillLevel event.
  var canRefill = false;
  var didReachRefillLevel = function(waterBottle) {
    canRefill = true;
  };
  var defaultCenter = NotificationDefaultCenter();
  defaultCenter.addNotificationObserver(
      WaterBottle.REFILL_LEVEL_NOTIFICATION, didReachRefillLevel);
  testBottle.drink(20.0);
  ok(canRefill);
  defaultCenter.removeNotificationObserver(
      WaterBottle.REFILL_LEVEL_NOTIFICATION, didReachRefillLevel);
});

