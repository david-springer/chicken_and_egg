/* Copyright 2014 (c) SoFIE Studios.  All rights reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview Unit tests for the EggCrate object.
 */
module("EggCrate Object");

test("Default Constructor", function() {
  var testCrate = new EggCrate();
  equal(testCrate.eggCount(), 0);
});

test("Add Egg", function() {
  var testCrate = new EggCrate();
  equal(testCrate.eggCount(), 0);
  ok(testCrate.addEgg());
  equal(testCrate.eggCount(), 1);
  ok(testCrate.addEgg());
  equal(testCrate.eggCount(), 2);
});

test("Add Egg When Full", function() {
  var testCrate = new EggCrate();
  testCrate.setEggCount(EggCrate.MAX_EGG_COUNT);
  equal(testCrate.addEgg(), false);
  equal(testCrate.eggCount(), EggCrate.MAX_EGG_COUNT);
});

test("Send Crate Full Notification", function() {
  // Set up an event listener for the didLayEgg event.
  var crateFull = false;
  var crateDidFill = function(crate) {
    crateFull = true;
  };
  var defaultCenter = NotificationDefaultCenter();
  defaultCenter.addNotificationObserver(
      EggCrate.CRATE_DID_FILL_NOTIFICATION, crateDidFill);
  var testCrate = new EggCrate();
  testCrate.setEggCount(EggCrate.MAX_EGG_COUNT - 2);
  ok(testCrate.addEgg());
  equal(crateFull, false);
  ok(testCrate.addEgg());
  ok(crateFull);
  defaultCenter.removeNotificationObserver(
      EggCrate.CRATE_DID_FILL_NOTIFICATION, crateDidFill);
});

test("Reset Crate", function() {
  var testCrate = new EggCrate();
  testCrate.setEggCount(4);
  ok(testCrate.eggCount() > 0);
  testCrate.reset();
  equal(testCrate.eggCount(), 0);
});
