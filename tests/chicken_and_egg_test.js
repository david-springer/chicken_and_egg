/* Copyright 2014 (c) SoFIE Studios.  All rights reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview Unit tests for the ChickenAndEgg object.
 */
module("ChickenAndEgg Object");

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
