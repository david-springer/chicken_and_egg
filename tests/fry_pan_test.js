/* Copyright 2014 (c) SoFIE Studios.  All rights reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview Unit tests for the FryPan object.
 */
module("FryPan Object", {
  teardown: function() {
    equal(NotificationDefaultCenter().hasObserversForNotification(
        FryPan.DID_FRY_EGG_NOTIFICATION), false);
  }
});

test("Default Constructor", function() {
  var testPan = new FryPan();
  equal(testPan.eggCount(), 0);
});

test("Add Egg", function() {
  var testPan = new FryPan();
  ok(testPan.addEgg(function() {}));
  equal(testPan.eggCount(), 1);
});

test("Add Egg When Full", function() {
  var testPan = new FryPan();
  testPan.setEggCount(FryPan.MAX_EGG_COUNT - 1);
  var emptyFryFunc = function() {};
  ok(testPan.addEgg(emptyFryFunc));
  equal(testPan.addEgg(emptyFryFunc), false);
  equal(testPan.eggCount(), 2);
});

test("Fry Egg Callback", function() {
  var testPan = new FryPan();
  var didCallFryEgg = false;
  ok(testPan.addEgg(function() { didCallFryEgg = true; }));
  ok(didCallFryEgg);
});

test("Fried Egg Notification", function() {
  // Set up an event listener for the eggDidHatch event.
  var eggFried = false;
  var eggDidFry = function(pan) {
    eggFried = true;
  };
  var defaultCenter = NotificationDefaultCenter();
  defaultCenter.addNotificationObserver(FryPan.DID_FRY_EGG_NOTIFICATION, eggDidFry);
  var testPan = new FryPan();
  testPan.setFryInterval(0);
  ok(testPan.addEgg());  // Should fry the egg immediately.
  stop();
  // Perform all the fry notification tests and cleanup in a scheduled function that
  // gets run asynchronously. If the cleanup code is put outside this function, it gets
  // run *before* the test asserts.
  var testFryCleanup = function() {
    ok(eggFried);
    equal(testPan.eggCount(), 0);
    defaultCenter.removeNotificationObserver(
        FryPan.DID_FRY_EGG_NOTIFICATION, eggDidFry);
    start();
  };
  // Even though the fry time is 0, frying the egg is still asynchronous. Use a
  // timer function with an interval of 0, which will cause the timer that posts the
  // fried notification to fire.
  // TODO(daves): This seems like it should be a flakey test. It relies on the fact that
  // setTimeout() queues functions sequentially, so that the setTimeout which posts the
  // notification happens before the setTimeout in this test.
  setTimeout(testFryCleanup.bind(this), 0);
  // Note: code after this comment will run *before* the timer function scheduled in the
  // previous line is called.
});

test("2 Fried Eggs Notification", function() {
  // Set up an event listener for the eggDidHatch event.
  var friedEggCount = 0;
  var eggDidFry = function(pan) {
    friedEggCount++;
  };
  var defaultCenter = NotificationDefaultCenter();
  defaultCenter.addNotificationObserver(FryPan.DID_FRY_EGG_NOTIFICATION, eggDidFry);
  var testPan = new FryPan();
  testPan.setFryInterval(0);
  ok(testPan.addEgg());  // Should fry the egg immediately.
  ok(testPan.addEgg());  // Should fry the egg immediately.
  stop();
  var testFry2Cleanup = function() {
    equal(friedEggCount, 2);
    equal(testPan.eggCount(), 0);
    defaultCenter.removeNotificationObserver(
        FryPan.DID_FRY_EGG_NOTIFICATION, eggDidFry);
    start();
  };
  setTimeout(testFry2Cleanup.bind(this), 0);
  // Note: code after this comment will run *before* the timer function scheduled in the
  // previous line is called.
});
