/* Copyright 2014 (c) SoFIE Studios.  All rights reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview Unit tests for the Nest object.
 */
module("Nest Object", {
  teardown: function() {
    equal(NotificationDefaultCenter().hasObserversForNotification(
        Nest.DID_HATCH_EGG_NOTIFICATION), false);
  }
});

test("Default Constructor", function() {
  var testNest = new Nest();
  equal(testNest.hasEgg(), false);
  equal(testNest.incubationTime(), 0.0);
});

test("Add Egg", function() {
  var testNest = new Nest();
  ok(testNest.addEgg());
  equal(testNest.incubationTime(), 0.0);
  ok(testNest.hasEgg());
});

test("Add Egg When Full", function() {
  var testNest = new Nest();
  ok(testNest.addEgg());
  equal(testNest.addEgg(), false);
  equal(testNest.incubationTime(), 0.0);
  ok(testNest.hasEgg());
});

test("Hatch Egg", function() {
  var testNest = new Nest();
  testNest._hatchEgg();
  equal(testNest.hasEgg(), false);
  ok(testNest.addEgg());
  ok(testNest.hasEgg());
  testNest.processGameTick(Date.now() / 1000.0, Nest.INCUBATION_INTERVAL / 2.0);
  ok(testNest.incubationTime() != 0.0);
  testNest._hatchEgg();
  equal(testNest.hasEgg(), false);
  equal(testNest.incubationTime(), 0.0);
});

test("Process Game Tick", function() {
  var testNest = new Nest();
  equal(testNest.incubationTime(), 0.0);
  var gameTimeDelta = Nest.INCUBATION_INTERVAL / 4.0;
  testNest.processGameTick(Date.now() / 1000.0, gameTimeDelta);
  equal(testNest.incubationTime(), 0.0);
  ok(testNest.addEgg());
  testNest.processGameTick(Date.now() / 1000.0, gameTimeDelta);
  equal(testNest.incubationTime(), gameTimeDelta);
  testNest.processGameTick(Date.now() / 1000.0, gameTimeDelta);
  equal(testNest.incubationTime(), gameTimeDelta * 2);
});

test("Send Hatch Notification", function() {
  // Set up an event listener for the eggDidHatch event.
  var eggHatched = false;
  var eggDidHatch = function(nest) {
    eggHatched = true;
  };
  var defaultCenter = NotificationDefaultCenter();
  defaultCenter.addNotificationObserver(Nest.DID_HATCH_EGG_NOTIFICATION, eggDidHatch);
  var testNest = new Nest();
  ok(testNest.addEgg());
  // Should hatch the egg immediately.
  testNest.processGameTick(Date.now() / 1000.0, Nest.INCUBATION_INTERVAL);
  ok(eggHatched);
  equal(testNest.hasEgg(), false);
  defaultCenter.removeNotificationObserver(
      Nest.DID_HATCH_EGG_NOTIFICATION, eggDidHatch);
});