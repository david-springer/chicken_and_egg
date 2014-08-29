/* Copyright 2014 (c) SoFIE Studios.  All rights reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview Unit tests for the FeedBag object.
 */
module("FeedBag Object");

var fakeFeedBagView = { feedLevelFraction: 1.0 };

test("Default Constructor", function() {
  var testBag = new FeedBag();
  testBag.view = fakeFeedBagView;
  equal(testBag.feed(), FeedBag.MAX_FEED);
});

test("Peck From Full", function() {
  var testBag = new FeedBag();
  testBag.view = fakeFeedBagView;
  var amountPecked = testBag.peck(60.0);
  equal(amountPecked, 60.0);
  equal(testBag.feed(), FeedBag.MAX_FEED - 60.0);
});

test("Peck Not Enough", function() {
  var testBag = new FeedBag();
  testBag.view = fakeFeedBagView;
  testBag.setFeed(25.0);
  var amountPecked = testBag.peck(60.0);
  equal(amountPecked, 25.0);
  equal(testBag.feed(), 0);
});

test("Peck Negative", function() {
  var testBag = new FeedBag();
  testBag.view = fakeFeedBagView;
  var amountPecked = testBag.peck(-10.0);
  equal(amountPecked, 0);
  equal(testBag.feed(), FeedBag.MAX_FEED);
});

test("Is Empty", function() {
  var testBag = new FeedBag();
  testBag.view = fakeFeedBagView;
  var amountPecked = testBag.peck(FeedBag.MAX_FEED + 60.0);
  equal(amountPecked, FeedBag.MAX_FEED);
  ok(testBag.isEmpty());
});

test("Refill", function() {
  var testBag = new FeedBag();
  testBag.view = fakeFeedBagView;
  testBag.setFeed(25.0);
  equal(testBag.isEmpty(), false);
  ok(testBag.feed() < FeedBag.MAX_FEED);
  testBag.refill();
  equal(testBag.feed(), FeedBag.MAX_FEED);
});

test("Has Stats", function() {
  var testBag = new FeedBag();
  equal(false, testBag.hasStats());
});
