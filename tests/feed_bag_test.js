/* Copyright 2014 (c) SoFIE Studios.  All rights reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview Unit tests for the FeedBag object.
 */
module("FeedBag Object");

test("Default Constructor", function() {
  var testBag = new FeedBag();
  equal(testBag.feed(), FeedBag.MAX_FEED);
});

test("Peck From Full", function() {
  var testBag = new FeedBag();
  var amountPecked = testBag.peck(60.0);
  equal(amountPecked, 60.0);
  equal(testBag.feed(), FeedBag.MAX_FEED - 60.0);
});

test("Peck Not Enough", function() {
  var testBag = new FeedBag();
  testBag.setFeed(25.0);
  var amountPecked = testBag.peck(60.0);
  equal(amountPecked, 25.0);
  equal(testBag.feed(), 0);
});

test("Peck Negative", function() {
  var testBag = new FeedBag();
  var amountPecked = testBag.peck(-10.0);
  equal(amountPecked, 0);
  equal(testBag.feed(), FeedBag.MAX_FEED);
});

test("Is Empty", function() {
  var testBag = new FeedBag();
  var amountPecked = testBag.peck(FeedBag.MAX_FEED + 60.0);
  equal(amountPecked, FeedBag.MAX_FEED);
  ok(testBag.isEmpty());
});

test("Refill", function() {
  var testBag = new FeedBag();
  testBag.setFeed(25.0);
  equal(testBag.isEmpty(), false);
  ok(testBag.feed() < FeedBag.MAX_FEED);
  testBag.refill();
  equal(testBag.feed(), FeedBag.MAX_FEED);
});

test("Has Stats", function() {
  var testBag = new FeedBag();
  ok(testBag.hasStats());
});

test("Display Name", function() {
  var testBag = new FeedBag();
  ok(testBag.displayName() !== "<unnamed>");
});

test("Stats Display String", function() {
  var testBag = new FeedBag();
  equal(testBag.statsDisplayString(), "100%");
  testBag.setFeed(FeedBag.MAX_FEED / 2);
  equal(testBag.statsDisplayString(), "50%");
  testBag.setFeed(FeedBag.MAX_FEED / 3);
  equal(testBag.statsDisplayString(), "33.33%");
  testBag.setFeed(FeedBag.MAX_FEED / 4);
  equal(testBag.statsDisplayString(), "25%");
  testBag.setFeed(0);
  equal(testBag.statsDisplayString(), "0%");
});
