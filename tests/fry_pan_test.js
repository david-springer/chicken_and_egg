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
  var fryingTimes = testPan.fryingTimes();
  equal(fryingTimes.length, 0);
});

test("Add Egg", function() {
  var testPan = new FryPan();
  ok(testPan.addEgg(new Egg()));
  equal(testPan.eggCount(), 1);
});

test("Add Egg When Full", function() {
  var testPan = new FryPan();
  for (var i = 0; i < FryPan.MAX_EGG_COUNT; ++i) {
    ok(testPan.addEgg(new Egg()));
  }
  equal(testPan.addEgg(new Egg()), false);
  equal(testPan.eggCount(), FryPan.MAX_EGG_COUNT);
});

test("Add duplicate Egg", function() {
  var testPan = new FryPan();
  var dupEgg = new Egg();
  ok(testPan.addEgg(dupEgg));
  equal(testPan.eggCount(), 1);
  equal(testPan.addEgg(dupEgg), false);
  equal(testPan.eggCount(), 1);
});

test("Has Stats", function() {
  var testPan = new FryPan();
  ok(testPan.hasStats());
});

test("Display Name", function() {
  var testPan = new FryPan();
  ok(testPan.displayName() !== "<unnamed>");
});

test("Stats Display String 1 Egg", function() {
  var testPan = new FryPan();
  equal(testPan.statsDisplayString(), "--.--%, --.--%");
  ok(testPan.addEgg(new Egg()));
  equal(testPan.statsDisplayString(), "0.000%, --.--%");
  testPan.processGameTick(Date.now() / 1000.0, FryPan.FRY_INTERVAL / 2.0);
  equal(testPan.statsDisplayString(), "50.00%, --.--%");
  testPan.processGameTick(Date.now() / 1000.0, FryPan.FRY_INTERVAL / 2.0);
  equal(testPan.statsDisplayString(), "--.--%, --.--%");
});

test("Stats Display String 2 Eggs", function() {
  var testPan = new FryPan();
  equal(testPan.statsDisplayString(), "--.--%, --.--%");
  ok(testPan.addEgg(new Egg()));
  equal(testPan.statsDisplayString(), "0.000%, --.--%");
  ok(testPan.addEgg(new Egg()));
  equal(testPan.statsDisplayString(), "0.000%, 0.000%");
  testPan.processGameTick(Date.now() / 1000.0, FryPan.FRY_INTERVAL / 2.0);
  equal(testPan.statsDisplayString(), "50.00%, 50.00%");
  testPan.processGameTick(Date.now() / 1000.0, FryPan.FRY_INTERVAL / 2.0);
  equal(testPan.statsDisplayString(), "--.--%, --.--%");
});

test("Stats Display String Interleave Eggs", function() {
  var testPan = new FryPan();
  equal(testPan.statsDisplayString(), "--.--%, --.--%");
  ok(testPan.addEgg(new Egg()));
  var statsString = testPan.statsDisplayString();
  ok(statsString.match("0.000%"));
  ok(statsString.match("--.--%"));
  testPan.processGameTick(Date.now() / 1000.0, FryPan.FRY_INTERVAL / 2.0);
  statsString = testPan.statsDisplayString();
  ok(statsString.match("50.00%"));
  ok(statsString.match("--.--%"));
  ok(testPan.addEgg(new Egg()));
  statsString = testPan.statsDisplayString();
  ok(statsString.match("50.00%"));
  ok(statsString.match("0.000%"));
  testPan.processGameTick(Date.now() / 1000.0, FryPan.FRY_INTERVAL / 2.0);
  statsString = testPan.statsDisplayString();
  ok(statsString.match("--.--%"));
  ok(statsString.match("50.00%"));
  testPan.processGameTick(Date.now() / 1000.0, FryPan.FRY_INTERVAL / 2.0);
  statsString = testPan.statsDisplayString();
  ok(statsString.match("--.--%"));
  ok(statsString.match("--.--%"));
});

test("Fry Egg", function() {
  var testPan = new FryPan();
  testPan._fryEggsWithUuids([]);
  equal(testPan.eggCount(), 0);
  var egg1 = new Egg();
  ok(testPan.addEgg(egg1));
  equal(testPan.eggCount(), 1);
  testPan.processGameTick(Date.now() / 1000.0, FryPan.FRY_INTERVAL / 2.0);
  var fryingTimes = testPan.fryingTimes();
  equal(fryingTimes.length, 1);
  ok(fryingTimes[0] != 0.0);
  testPan._fryEggsWithUuids([egg1.uuid()]);
  equal(testPan.eggCount(), 0);
  var fryingTimes = testPan.fryingTimes();
  equal(fryingTimes.length, 0);
});

test("Fry 2 Eggs", function() {
  var testPan = new FryPan();
  testPan._fryEggsWithUuids([]);
  equal(testPan.eggCount(), 0);
  var egg1 = new Egg();
  var egg2 = new Egg();
  ok(testPan.addEgg(egg1));
  ok(testPan.addEgg(egg2));
  equal(testPan.eggCount(), 2);
  testPan.processGameTick(Date.now() / 1000.0, FryPan.FRY_INTERVAL / 2);
  var fryingTimes = testPan.fryingTimes();
  equal(fryingTimes.length, 2);
  ok(fryingTimes[0] != 0.0);
  ok(fryingTimes[1] != 0.0);
  testPan._fryEggsWithUuids([egg1.uuid(), egg2.uuid()]);
  equal(testPan.eggCount(), 0);
  var fryingTimes = testPan.fryingTimes();
  equal(fryingTimes.length, 0);
});

test("Process Game Tick", function() {
  var testPan = new FryPan();
  var gameTimeDelta = FryPan.FRY_INTERVAL / 4.0;
  testPan.processGameTick(Date.now() / 1000.0, gameTimeDelta);
  var fryingTimes = testPan.fryingTimes();
  equal(fryingTimes.length, 0);
  ok(testPan.addEgg(new Egg()));
  equal(testPan.eggCount(), 1);
  var fryingTimes = testPan.fryingTimes();
  equal(fryingTimes.length, 1);
  equal(fryingTimes[0], 0.0);
  testPan.processGameTick(Date.now() / 1000.0, gameTimeDelta);
  equal(testPan.fryingTimes()[0], gameTimeDelta);
  testPan.processGameTick(Date.now() / 1000.0, gameTimeDelta);
  equal(testPan.fryingTimes()[0], gameTimeDelta * 2);
});

test("Send Fried Egg Notification", function() {
  // Set up an event listener for the DID_FRY_EGG_NOTIFICATION event.
  var eggFried = false;
  var eggDidFry = function(pan) {
    eggFried = true;
  };
  var defaultCenter = NotificationDefaultCenter();
  defaultCenter.addNotificationObserver(FryPan.DID_FRY_EGG_NOTIFICATION, eggDidFry);
  var testPan = new FryPan();
  ok(testPan.addEgg(new Egg()));
  // Should fry the egg immediately.
  testPan.processGameTick(Date.now() / 1000.0, FryPan.FRY_INTERVAL);
  ok(eggFried);
  equal(testPan.eggCount(), 0);
  defaultCenter.removeNotificationObserver(
      FryPan.DID_FRY_EGG_NOTIFICATION, eggDidFry);
});

test("Over-cook Egg", function() {
  // Set up an event listener for the DID_FRY_EGG_NOTIFICATION event.
  var friedEggCount = 0;
  var eggDidFry = function(pan) {
    friedEggCount++;
  };
  var defaultCenter = NotificationDefaultCenter();
  defaultCenter.addNotificationObserver(FryPan.DID_FRY_EGG_NOTIFICATION, eggDidFry);
  var testPan = new FryPan();
  ok(testPan.addEgg(new Egg()));
  // Should fry the egg immediately.
  testPan.processGameTick(Date.now() / 1000.0, FryPan.FRY_INTERVAL * 1.5);
  equal(friedEggCount, 1);
  equal(testPan.eggCount(), 0);
  defaultCenter.removeNotificationObserver(
      FryPan.DID_FRY_EGG_NOTIFICATION, eggDidFry);
});

test("Send 2 Fried Egg Notifications", function() {
  // Set up an event listener for the DID_FRY_EGG_NOTIFICATION event.
  var friedEggCount = 0;
  var eggDidFry = function(pan) {
    friedEggCount++;
  };
  var defaultCenter = NotificationDefaultCenter();
  defaultCenter.addNotificationObserver(FryPan.DID_FRY_EGG_NOTIFICATION, eggDidFry);
  var testPan = new FryPan();
  ok(testPan.addEgg(new Egg()));
  // Fry the first egg half way, then add the second egg.
  testPan.processGameTick(Date.now() / 1000.0, FryPan.FRY_INTERVAL / 2);
  equal(friedEggCount, 0);  // No eggs fried yet.
  ok(testPan.addEgg(new Egg()));
  equal(testPan.eggCount(), 2);
  // Fry the first egg all the way, fry the second egg half way.
  testPan.processGameTick(Date.now() / 1000.0, FryPan.FRY_INTERVAL / 2);
  equal(friedEggCount, 1);
  equal(testPan.eggCount(), 1);
  // Fry the second egg all the way.
  testPan.processGameTick(Date.now() / 1000.0, FryPan.FRY_INTERVAL / 2);
  equal(friedEggCount, 2);
  equal(testPan.eggCount(), 0);
  defaultCenter.removeNotificationObserver(
      FryPan.DID_FRY_EGG_NOTIFICATION, eggDidFry);
});
