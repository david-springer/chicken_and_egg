/* Copyright 2014 (c) SoFIE Studios.  All rights reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview Unit tests for the HoseBib object.
 */
module("HoseBib Object");

test("Point Inside", function() {
  var testHoseBib = new HoseBib();
  testHoseBib.setEnabled(true);
  testHoseBib.loadView();
  var imageWorldSize = testHoseBib.view.getWorldSize();
  var insidePoint = new Box2D.Common.Math.b2Vec2(
      HoseBib.IMAGE_ORIGIN.x + imageWorldSize.x / 2,
      HoseBib.IMAGE_ORIGIN.y + imageWorldSize.y / 2);
  ok(testHoseBib.isPointInside(insidePoint));
});

test("Point Inside Disabled", function() {
  var testHoseBib = new HoseBib();
  testHoseBib.setEnabled(false);
  testHoseBib.loadView();
  var imageWorldSize = testHoseBib.view.getWorldSize();
  var insidePoint = new Box2D.Common.Math.b2Vec2(
      HoseBib.IMAGE_ORIGIN.x + imageWorldSize.x / 2,
      HoseBib.IMAGE_ORIGIN.y + imageWorldSize.y / 2);
  equal(false, testHoseBib.isPointInside(insidePoint));
});

test("Points Outside", function() {
  var testHoseBib = new HoseBib();
  testHoseBib.setEnabled(true);
  testHoseBib.loadView();
  var imageWorldSize = testHoseBib.view.getWorldSize();
  var outsidePoint;
  outsidePoint = new Box2D.Common.Math.b2Vec2(
      HoseBib.IMAGE_ORIGIN.x - 1,
      HoseBib.IMAGE_ORIGIN.y + imageWorldSize.y / 2);
  equal(false, testHoseBib.isPointInside(outsidePoint));
  outsidePoint = new Box2D.Common.Math.b2Vec2(
      HoseBib.IMAGE_ORIGIN.x + imageWorldSize.x + 1,
      HoseBib.IMAGE_ORIGIN.y + imageWorldSize.y / 2);
  equal(false, testHoseBib.isPointInside(outsidePoint));
  outsidePoint = new Box2D.Common.Math.b2Vec2(
      HoseBib.IMAGE_ORIGIN.x + imageWorldSize.x / 2,
      HoseBib.IMAGE_ORIGIN.y - 1);
  equal(false, testHoseBib.isPointInside(outsidePoint));
  outsidePoint = new Box2D.Common.Math.b2Vec2(
      HoseBib.IMAGE_ORIGIN.x + imageWorldSize.x / 2,
      HoseBib.IMAGE_ORIGIN.y + imageWorldSize.y + 1);
  equal(false, testHoseBib.isPointInside(outsidePoint));
});
