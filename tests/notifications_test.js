/* Copyright 2014 (c) SoFIE Studios.  All rights reserved.
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file.
 */

/**
 * @fileoverview Unit tests for the Notifications object.
 */
module("Notifications Object", {
  teardown: function() {
    NotificationDefaultCenter().removeAllNotifications();
  }
});

test("Singleton", function() {
  var factoryCenter = NotificationDefaultCenter();
  var defaultCenter = NotificationDefaultCenter();
  ok(defaultCenter === factoryCenter);
  var newCenter = new NotificationDefaultCenter();
  ok(newCenter === defaultCenter);
  ok(newCenter === factoryCenter);
})

test("Add Observer", function() {
  var testObserver = function() {};
  var defaultCenter = NotificationDefaultCenter();
  equal(defaultCenter.hasObserversForNotification("TEST_NOTIFICATION"), false);
  defaultCenter.addNotificationObserver("TEST_NOTIFICATION", testObserver);
  equal(defaultCenter.hasObserversForNotification("TEST_NOTIFICATION"), true);
});

test("Remove Observer", function() {
  var testObserver = function() {};
  var defaultCenter = NotificationDefaultCenter();
  defaultCenter.addNotificationObserver("TEST_NOTIFICATION", testObserver);
  equal(defaultCenter.hasObserversForNotification("TEST_NOTIFICATION"), true);
  defaultCenter.removeNotificationObserver("TEST_NOTIFICATION", testObserver);
  equal(defaultCenter.hasObserversForNotification("TEST_NOTIFICATION"), false);
});

test("Unique Observer", function() {
  var testObserver = function() {};
  var defaultCenter = NotificationDefaultCenter();
  defaultCenter.addNotificationObserver("TEST_NOTIFICATION", testObserver);
  defaultCenter.addNotificationObserver("TEST_NOTIFICATION", testObserver);
  equal(defaultCenter.hasObserversForNotification("TEST_NOTIFICATION"), true);
  defaultCenter.removeNotificationObserver("TEST_NOTIFICATION", testObserver);
  equal(defaultCenter.hasObserversForNotification("TEST_NOTIFICATION"), false);
});

test("Multi Observers", function() {
  var testObserver = function() { var a = 1; };
  var otherTestObserver = function() { var b = 2; };
  var defaultCenter = NotificationDefaultCenter();
  defaultCenter.addNotificationObserver("TEST_NOTIFICATION", testObserver);
  defaultCenter.addNotificationObserver("TEST_NOTIFICATION", otherTestObserver);
  equal(defaultCenter.hasObserversForNotification("TEST_NOTIFICATION"), true);
  defaultCenter.removeNotificationObserver("TEST_NOTIFICATION", testObserver);
  equal(defaultCenter.hasObserversForNotification("TEST_NOTIFICATION"), true);
  defaultCenter.removeNotificationObserver("TEST_NOTIFICATION", otherTestObserver);
  equal(defaultCenter.hasObserversForNotification("TEST_NOTIFICATION"), false);
});

test("Post Notification", function() {
  var postCount = 0;
  var testObserver = function() { postCount++; };
  var defaultCenter = NotificationDefaultCenter();
  // Post with no observers should do nothing.
  defaultCenter.postNotification("TEST_NOTIFICATION");
  equal(postCount, 0);
  defaultCenter.addNotificationObserver("TEST_NOTIFICATION", testObserver);
  defaultCenter.postNotification("TEST_NOTIFICATION");
  equal(postCount, 1);
  defaultCenter.postNotification("TEST_NOTIFICATION");
  equal(postCount, 2);
  defaultCenter.removeNotificationObserver("TEST_NOTIFICATION", testObserver);
  defaultCenter.postNotification("TEST_NOTIFICATION");
  equal(postCount, 2);
});

test("Post With Sender", function() {
  var postCount = 0;
  var notifier = {};
  var testObserver = function(sender) {
    postCount++;
    ok(notifier === sender);
  };
  var defaultCenter = NotificationDefaultCenter();
  defaultCenter.addNotificationObserver("TEST_NOTIFICATION", testObserver);
  defaultCenter.postNotification("TEST_NOTIFICATION", notifier);
  equal(postCount, 1);
});

test("Multi Post Notification", function() {
  var postCount = 0;
  var otherPostCount = 0;
  var testObserver = function() { postCount++; };
  var otherTestObserver = function() { otherPostCount++; };
  var defaultCenter = NotificationDefaultCenter();
  // Post with no observers should do nothing.
  defaultCenter.postNotification("TEST_NOTIFICATION");
  equal(postCount, 0);
  equal(otherPostCount, 0);
  defaultCenter.addNotificationObserver("TEST_NOTIFICATION", testObserver);
  defaultCenter.postNotification("TEST_NOTIFICATION");
  equal(postCount, 1);
  equal(otherPostCount, 0);
  defaultCenter.postNotification("TEST_NOTIFICATION");
  equal(postCount, 2);
  equal(otherPostCount, 0);
  defaultCenter.addNotificationObserver("TEST_NOTIFICATION", otherTestObserver);
  defaultCenter.postNotification("TEST_NOTIFICATION");
  equal(postCount, 3);
  equal(otherPostCount, 1);
  defaultCenter.removeNotificationObserver("TEST_NOTIFICATION", testObserver);
  defaultCenter.postNotification("TEST_NOTIFICATION");
  equal(postCount, 3);
  equal(otherPostCount, 2);
  defaultCenter.removeNotificationObserver("TEST_NOTIFICATION", otherTestObserver);
  defaultCenter.postNotification("TEST_NOTIFICATION");
  equal(postCount, 3);
  equal(otherPostCount, 2);
});
