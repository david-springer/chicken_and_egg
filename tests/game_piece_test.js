/* Copyright 2014 (c) SoFIE Studios.  All rights reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview Unit tests for the GamePiece object.
 */
module("GamePiece Object");

test("Get UUID", function() {
  var testPiece = new GamePiece();
  var uuid = testPiece.uuid();
  ok(uuid != null);
  equal(testPiece.uuid(), uuid);
});

test("Unique UUID", function() {
  var testPiece1 = new GamePiece();
  var testPiece2 = new GamePiece();
  var uuid1 = testPiece1.uuid();
  ok(uuid1 != null);
  var uuid2 = testPiece2.uuid();
  ok(uuid2 != null);
  ok(uuid1 !== uuid2);
});

test("Body Accessor", function() {
  var FakeGamePiece = function() {
    GamePiece.call(this);
  }
  FakeGamePiece.prototype = new GamePiece();
  FakeGamePiece.prototype.constructor = FakeGamePiece;
  FakeGamePiece.prototype.getBodyDef = function() {
    return { bodyType: "fake" };
  }

  var fakeBody = function(bodyDef) {
    return {
        SetUserData: function(data) {},
        GetUserData: function() { return "testBodyData"; }
    };
  };
  var fakeWorld = function() {
    return { CreateBody: fakeBody };
  };
  var fakeSimulation = {
    world: fakeWorld
  };
  var testPiece = new FakeGamePiece();
  ok(testPiece.body() == null);
  testPiece.addToSimulation(fakeSimulation);
  ok(testPiece.body() != null);
  equal(testPiece.body().GetUserData(), "testBodyData");
});

test("Body Accessor Null BodyDef", function() {
  var fakeBody = function(bodyDef) {
    return {
        SetUserData: function(data) {},
        GetUserData: function() { return "testBodyData"; }
    };
  };
  var fakeWorld = function() {
    return { CreateBody: fakeBody };
  };
  var fakeSimulation = {
    world: fakeWorld
  };
  var testPiece = new GamePiece();
  ok(testPiece.body() == null);
  testPiece.addToSimulation(fakeSimulation);
  ok(testPiece.body() == null);
});