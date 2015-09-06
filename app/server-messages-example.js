/* global serverMessages: true*/
serverMessages = new ServerMessages();

if (Meteor.isClient) {
  Template.generate.events({
    'click .js-btn-client': function (event, template) {
      var subject = template.find('.js-title').value,
        message = template.find('.js-msg').value,
        type = template.find('.js-level').value.toLowerCase(),
        timeout = parseInt(template.find('.js-timeout').value, 10),
        userCloseable = template.find('.js-closeable').checked;

      Meteor.call('notify', 'serverMessage:' + type, subject, message, {
        userCloseable: userCloseable,
        timeout: timeout
      });
    }
  });

  Template.generate.helpers({
    types: function () {
      var returnValue = [];

      _.each(Notifications.TYPES, function (i, k) {
        returnValue.push({name:k, value: k});
      });

      return returnValue;
    },
    getSource: function () {
      return window.location.origin;
    }
  });

  serverMessages.listen('serverMessage:info', function (subject, message, options) {
    Notifications.info(subject, message, options);
  });

  serverMessages.listen('serverMessage:warn', function (subject, message, options) {
    Notifications.warn(subject, message, options);
  });

  serverMessages.listen('serverMessage:success', function (subject, message, options) {
    Notifications.success(subject, message, options);
  });

  serverMessages.listen('serverMessage:error', function (subject, message, options) {
    Notifications.error(subject, message, options);
  });

}



if (Meteor.isServer) {
  Meteor.methods({
    notify: function () {
      serverMessages.notify.apply(serverMessages, arguments);
    }
  });
}
