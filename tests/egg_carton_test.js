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
  var testCrate = new EggCarton();
  equal(testCrate.eggCount(), 0);
});

test("Add Egg", function() {
  var testCrate = new EggCarton();
  equal(testCrate.eggCount(), 0);
  ok(testCrate.addEgg());
  equal(testCrate.eggCount(), 1);
  ok(testCrate.addEgg());
  equal(testCrate.eggCount(), 2);
});

test("Add Egg When Full", function() {
  var testCrate = new EggCarton();
  testCrate.setEggCount(EggCarton.MAX_EGG_COUNT);
  equal(testCrate.addEgg(), false);
  equal(testCrate.eggCount(), EggCarton.MAX_EGG_COUNT);
});

test("Send Crate Full Notification", function() {
  // Set up an event listener for the crateDidFill notification.
  var crateFull = false;
  var crateDidFill = function(crate) {
    crateFull = true;
  };
  var defaultCenter = NotificationDefaultCenter();
  defaultCenter.addNotificationObserver(
      EggCarton.DID_FILL_CRATE_NOTIFICATION, crateDidFill);
  var testCrate = new EggCarton();
  testCrate.setEggCount(EggCarton.MAX_EGG_COUNT - 2);
  ok(testCrate.addEgg());
  equal(crateFull, false);
  ok(testCrate.addEgg());
  ok(crateFull);
  defaultCenter.removeNotificationObserver(
      EggCarton.DID_FILL_CRATE_NOTIFICATION, crateDidFill);
});

test("Reset Crate", function() {
  var testCrate = new EggCarton();
  testCrate.setEggCount(4);
  ok(testCrate.eggCount() > 0);
  testCrate.reset();
  equal(testCrate.eggCount(), 0);
});
