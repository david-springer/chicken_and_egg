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
        EggCarton.DID_FILL_CARTON_NOTIFICATION), false);
  }
});

test("Default Constructor", function() {
  var testCarton = new EggCarton();
  equal(testCarton.eggCount(), 0);
});

