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
  equal(testBottle.waterLevel(), WaterBottle.MAX_WATER);
});

test("Drink From Full", function() {
  var testBottle = new WaterBottle();
  var amountDrunk = testBottle.drink(60.0);
  equal(amountDrunk, 60.0);
  equal(testBottle.waterLevel(), WaterBottle.MAX_WATER - 60.0);
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
  equal(testBottle.waterLevel(), WaterBottle.MAX_WATER);
});

test("Is Empty", function() {
  var testBottle = new WaterBottle();
  var amountDrunk = testBottle.drink(WaterBottle.MAX_WATER + 60.0);
  equal(amountDrunk, WaterBottle.MAX_WATER);
  ok(testBottle.isEmpty());
});

test("Refill", function() {
  var testBottle = new WaterBottle();
  testBottle.setWaterLevel(25.0);
  equal(testBottle.isEmpty(), false);
  ok(testBottle.waterLevel() < WaterBottle.MAX_WATER);
  ok(testBottle.refill());
  equal(testBottle.waterLevel(), WaterBottle.MAX_WATER);
});

test("Refill Above Max Refill", function() {
  var testBottle = new WaterBottle();
  testBottle.setWaterLevel(WaterBottle.MAX_REFILL_LEVEL + 10.0);
  var waterLevel = testBottle.waterLevel();
  equal(testBottle.isEmpty(), false);
  ok(testBottle.waterLevel() < WaterBottle.MAX_WATER);
  equal(testBottle.refill(), false);
  equal(testBottle.waterLevel(), waterLevel);
});
