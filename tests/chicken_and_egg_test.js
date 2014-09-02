/* Copyright 2014 (c) SoFIE Studios.  All rights reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview Unit tests for the ChickenAndEgg object.
 */
module("ChickenAndEgg Object");

test("Game Piece With UUID", function() {
  var fakeCanvas = {
    width: 900,
    height: 600
  };
  var testChickenAndEgg = new ChickenAndEgg(fakeCanvas);
  // Test with no game pieces.
  var testPiece = testChickenAndEgg._indexOfGamePieceWithUuid([], "fakeuuid");
  equal(testPiece, -1);
  // Test with some valid game pieces.
  var testPiece = new GamePiece();
  var testGamePieces = [new GamePiece(), new GamePiece(), testPiece];
  var testUuid = testPiece.uuid();
  var checkPiece = testChickenAndEgg._indexOfGamePieceWithUuid(testGamePieces, testUuid);
  equal(checkPiece, 2);
  equal(testGamePieces[checkPiece].uuid(), testPiece.uuid());
  // Test with non-extant UUID.
  checkPiece = testChickenAndEgg._indexOfGamePieceWithUuid(testGamePieces, "bogusuuid");
  equal(checkPiece, -1);
});

test("Chicken Died With Pullets", function() {
  var fakeCanvas = {
    width: 900,
    height: 600
  };
  var fakeWorld = {
    DestroyBody: function(body) {}
  }
  var testChickenAndEgg = new ChickenAndEgg(fakeCanvas);
  testChickenAndEgg._world = fakeWorld;
  var fakeFeedBag = new FakeFeedBag();
  var fakeWaterBottle = new FakeWaterBottle();
  var testChicken = new Chicken();
  testChicken.feedBag = fakeFeedBag;
  testChicken.waterBottle = fakeWaterBottle;
  testChickenAndEgg._hen = testChicken;
  testChickenAndEgg._gamePieces.push(testChickenAndEgg._hen);
  // Add a pullet.
  testChickenAndEgg._eggHatched({});  // Hatch from a fake nest.
  equal(testChickenAndEgg._pullets.length, 1);
  var testPullet = testChickenAndEgg._pullets[0];
  // Verify the game pieces.
  testChickenAndEgg._deallocateInactiveGamePieces();
  ok(testChickenAndEgg._indexOfGamePieceWithUuid(
      testChickenAndEgg._gamePieces, testChicken.uuid()) >= 0);
  equal(testChickenAndEgg._indexOfGamePieceWithUuid(
      testChickenAndEgg._gamePieces, testPullet.uuid()), -1);
  equal(testChickenAndEgg._hen.uuid(), testChicken.uuid());
  ok(testChickenAndEgg._hen.uuid() !== testPullet.uuid());
  equal(testPullet.feedBag, null);
  equal(testPullet.waterBottle, null);
  // Kill the original hen. This should cause a CHICKEN_DID_DIE notification, which
  // should in turn replace the hen with the pullet.
  testChickenAndEgg._henDied(testChicken);
  // Verify the game pieces.
  testChickenAndEgg._deallocateInactiveGamePieces();
  equal(testChickenAndEgg._indexOfGamePieceWithUuid(
      testChickenAndEgg._gamePieces, testChicken.uuid()), -1);
  ok(testChickenAndEgg._indexOfGamePieceWithUuid(
      testChickenAndEgg._gamePieces, testPullet.uuid()) >= 0);
  equal(testChickenAndEgg._pullets.length, 0);
  equal(testChickenAndEgg._hen.uuid(), testPullet.uuid());
  equal(testPullet.feedBag.uuid(), fakeFeedBag.uuid());
  equal(testPullet.waterBottle.uuid(), fakeWaterBottle.uuid());
  testChicken = testPullet;
  testChickenAndEgg._henDied(testChicken);
  equal(testChickenAndEgg._pullets.length, 0);
});

test("Convert To Sim Coords", function() {
  var fakeCanvas = {
    width: 900,
    height: 600,
    offset: function() { return {x: 0, y: 0}; },
    id: "test_canvas"
  };
  var testChickenAndEgg = new ChickenAndEgg(fakeCanvas);
  testChickenAndEgg._scale = fakeCanvas.width / 4.0;
  var box2DMaxX = 4.0;
  var box2DMaxY = fakeCanvas.height / testChickenAndEgg._scale;
  var box2DPoint;
  box2DPoint = testChickenAndEgg._convertToWorldCoordinates(0, 0, fakeCanvas);
  ok(Math.abs(box2DPoint.x) < 0.0001);
  ok(Math.abs(box2DPoint.y - box2DMaxY) < 0.0001);
  box2DPoint = testChickenAndEgg._convertToWorldCoordinates(
      0, fakeCanvas.height, fakeCanvas);
  ok(Math.abs(box2DPoint.x) < 0.0001);
  ok(Math.abs(box2DPoint.y) < 0.0001);
  box2DPoint = testChickenAndEgg._convertToWorldCoordinates(
      fakeCanvas.width, 0, fakeCanvas);
  ok(Math.abs(box2DPoint.x - box2DMaxX) < 0.0001);
  ok(Math.abs(box2DPoint.y - box2DMaxY) < 0.0001);
  box2DPoint = testChickenAndEgg._convertToWorldCoordinates(
      fakeCanvas.width, fakeCanvas.height, fakeCanvas);
  ok(Math.abs(box2DPoint.x - box2DMaxX) < 0.0001);
  ok(Math.abs(box2DPoint.y) < 0.0001);
  box2DPoint = testChickenAndEgg._convertToWorldCoordinates(
      fakeCanvas.width / 2, fakeCanvas.height / 2, fakeCanvas);
  ok(Math.abs(box2DPoint.x - box2DMaxX / 2) < 0.0001);
  ok(Math.abs(box2DPoint.y - box2DMaxY / 2) < 0.0001);
});
