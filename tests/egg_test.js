/* Copyright 2014 (c) SoFIE Studios.  All rights reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview Unit tests for the Egg object.
 */
module("Egg Object", {
  teardown: function() {
    equal(NotificationDefaultCenter().hasObserversForNotification(
        EggCrate.DID_FILL_CRATE_NOTIFICATION), false);
  }
});

test("Default Constructor", function() {
  var testCrate = new EggCrate();
  equal(testCrate.eggCount(), 0);
});

