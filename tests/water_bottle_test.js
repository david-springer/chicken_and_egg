/* Copyright 2014 (c) SoFIE Studios.  All rights reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview Unit tests for the WaterBottle object.
 */
module("WaterBottle Object");

test("Default Constructor", function() {
  var testBottle = new WaterBottle();
  equal(testBottle.waterLevel(), WaterBottle.MAX_WATER_LEVEL);
});

test("Drink From Full", function() {
  var testBottle = new WaterBottle();
  var amountDrunk = testBottle.drink(60.0);
  equal(amountDrunk, 60.0);
  equal(testBottle.waterLevel(), WaterBottle.MAX_WATER_LEVEL - 60.0);
});

test("Drink Not Enough", function() {
  var testBottle = new WaterBottle();
  testBottle.setWaterLevel(25.0);
  var amountDrunk = testBottle.drink(60.0);
  equal(amountDrunk, 25.0);
  equal(testBottle.waterLevel(), 0);
});

test("Drink Negative", function() {
  var testBottle = new WaterBottle();
  var amountDrunk = testBottle.drink(-10.0);
  equal(amountDrunk, 0);
  equal(testBottle.waterLevel(), WaterBottle.MAX_WATER_LEVEL);
});

test("Is Empty", function() {
  var testBottle = new WaterBottle();
  var amountDrunk = testBottle.drink(WaterBottle.MAX_WATER_LEVEL + 60.0);
  equal(amountDrunk, WaterBottle.MAX_WATER_LEVEL);
  ok(testBottle.isEmpty());
});

test("Refill", function() {
  var testBottle = new WaterBottle();
  testBottle.setWaterLevel(25.0);
  equal(testBottle.isEmpty(), false);
  ok(testBottle.waterLevel() < WaterBottle.MAX_WATER_LEVEL);
  ok(testBottle.refill());
  equal(testBottle.waterLevel(), WaterBottle.MAX_WATER_LEVEL);
});

test("Refill Above Max Refill", function() {
  var testBottle = new WaterBottle();
  testBottle.setWaterLevel(WaterBottle.MAX_REFILL_LEVEL + 10.0);
  var waterLevel = testBottle.waterLevel();
  equal(testBottle.isEmpty(), false);
  ok(testBottle.waterLevel() < WaterBottle.MAX_WATER_LEVEL);
  equal(testBottle.refill(), false);
  equal(testBottle.waterLevel(), waterLevel);
});

test("Has Stats", function() {
  var testBottle = new WaterBottle();
  ok(testBottle.hasStats());
});

test("Display Name", function() {
  var testBottle = new WaterBottle();
  ok(testBottle.displayName() !== "<unnamed>");
});

test("Stats Display String", function() {
  var testBottle = new WaterBottle();
  equal(testBottle.statsDisplayString(), "100%");
  testBottle.setWaterLevel(WaterBottle.MAX_WATER_LEVEL / 2);
  equal(testBottle.statsDisplayString(), "50%");
  testBottle.setWaterLevel(WaterBottle.MAX_WATER_LEVEL / 3);
  equal(testBottle.statsDisplayString(), "33.33%");
  testBottle.setWaterLevel(WaterBottle.MAX_WATER_LEVEL / 4);
  equal(testBottle.statsDisplayString(), "25%");
  testBottle.setWaterLevel(0);
  equal(testBottle.statsDisplayString(), "0%");
});
