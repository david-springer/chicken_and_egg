/* Copyright 2014 (c) SoFIE Studios.  All rights reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview Unit tests for the EggCarton object.
 */
module("EggCarton Object", {
  teardown: function() {
    equal(NotificationDefaultCenter().hasObserversForNotification(
        EggCarton.DID_FILL_CARTON_NOTIFICATION), false);
  }
});

test("Default Constructor", function() {
  var testCarton = new EggCarton();
  equal(testCarton.eggCount(), 0);
});

test("Add Egg", function() {
  var testCarton = new EggCarton();
  equal(testCarton.eggCount(), 0);
  ok(testCarton.addEgg());
  equal(testCarton.eggCount(), 1);
  ok(testCarton.addEgg());
  equal(testCarton.eggCount(), 2);
});

test("Add Egg When Full", function() {
  var testCarton = new EggCarton();
  testCarton.setEggCount(EggCarton.MAX_EGG_COUNT);
  equal(testCarton.addEgg(), false);
  equal(testCarton.eggCount(), EggCarton.MAX_EGG_COUNT);
});

test("Has Stats", function() {
  var testCarton = new EggCarton();
  equal(false, testCarton.hasStats());
});

test("Send Crate Full Notification", function() {
  // Set up an event listener for the crateDidFill notification.
  var crateFull = false;
  var crateDidFill = function(crate) {
    crateFull = true;
  };
  var defaultCenter = NotificationDefaultCenter();
  defaultCenter.addNotificationObserver(
      EggCarton.DID_FILL_CARTON_NOTIFICATION, crateDidFill);
  var testCarton = new EggCarton();
  testCarton.setEggCount(EggCarton.MAX_EGG_COUNT - 2);
  ok(testCarton.addEgg());
  equal(crateFull, false);
  ok(testCarton.addEgg());
  ok(crateFull);
  defaultCenter.removeNotificationObserver(
      EggCarton.DID_FILL_CARTON_NOTIFICATION, crateDidFill);
});

test("Reset Crate", function() {
  var testCarton = new EggCarton();
  testCarton.setEggCount(4);
  ok(testCarton.eggCount() > 0);
  testCarton.reset();
  equal(testCarton.eggCount(), 0);
});
