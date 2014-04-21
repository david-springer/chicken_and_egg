/* Copyright 2014 (c) SoFIE Studios.  All rights reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview Unit tests for the Nest object.
 */
module("Nest Object", {
  teardown: function() {
    equal(NotificationDefaultCenter().hasObserversForNotification(Nest.EGG_DID_HATCH_NOTIFICATION), false);
  }
});

test("Default Constructor", function() {
  var testNest = new Nest();
  equal(testNest.hasEgg(), false);
});

test("Add Egg", function() {
  var testNest = new Nest();
  ok(testNest.addEgg(function() {}));
  ok(testNest.hasEgg());
});

test("Add Egg When Full", function() {
  var testNest = new Nest();
  var emptyIncubate = function() {};
  ok(testNest.addEgg(emptyIncubate));
  equal(testNest.addEgg(emptyIncubate), false);
  ok(testNest.hasEgg());
});

test("Incubate Callback", function() {
  var testNest = new Nest();
  var didCallIncubate = false;
  ok(testNest.addEgg(function() { didCallIncubate = true; }));
  ok(didCallIncubate);
});

test("Hatch Notification", function() {
  // Set up an event listener for the eggDidHatch event.
  var eggHatched = false;
  var eggDidHatch = function(nest) {
    eggHatched = true;
  };
  var defaultCenter = NotificationDefaultCenter();
  defaultCenter.addNotificationObserver(Nest.EGG_DID_HATCH_NOTIFICATION, eggDidHatch);
  var testNest = new Nest();
  testNest.setIncubateInterval(0);
  ok(testNest.addEgg());  // Should hatch the egg immediately.
  stop();
  // Perform all the hatch notification tests and cleanup in a scheduled function that
  // gets run asynchronously. If the cleanup code is put outside this function, it gets
  // run *before* the test asserts.
  var testHatchCleanup = function() {
    ok(eggHatched);
    defaultCenter.removeNotificationObserver(
        Nest.EGG_DID_HATCH_NOTIFICATION, eggDidHatch);
    start();
  };
  // Even though the incubate time is 0, hatching the egg is still asynchronous. Use a
  // timer function with an interval of 0, which will cause the timer that posts the
  // hatch notification to fire.
  // TODO(daves): This seems like it should be a flakey test. It relies on the fact that
  // setTimeout() queues functions sequentially, so that the setTimeout which posts the
  // notification happens before the setTimeout in this test.
  setTimeout(testHatchCleanup.bind(this), 0);
  // Note: code after this comment will run *before* the timer function scheduled in the
  // previous line is called.
});