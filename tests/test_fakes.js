/* Copyright 2014 (c) SoFIE Studios.  All rights reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview Various fake objects for testing.
 */

FakeFeedBag = function() {}
FakeFeedBag.prototype.constructor = FakeFeedBag;
FakeFeedBag.prototype.peck = function(peckVolume) {
  return peckVolume;
}
FakeFeedBag.prototype.uuid = function() {
  return "fake-feed-bag-uuid";
}

FakeWaterBottle = function() {}
FakeWaterBottle.prototype.constructor = FakeWaterBottle;
FakeWaterBottle.prototype.drink = function(waterVolume) {
  return waterVolume;
}
FakeWaterBottle.prototype.uuid = function() {
  return "fake-water-bottle-uuid";
}
