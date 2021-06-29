/* Magic Mirror
 * Node Helper: MMM-August-Lock
 *
 * By Reagan Elm
 * MIT Licensed.
 */

const NodeHelper = require('node_helper');
const AugustConnect = require('august-connect');

const REQUIRED_ROOT_FIELDS = ['augustID', 'IDType', 'password'];

module.exports = NodeHelper.create({
  start: function () {
    const self = this;

    self.started = false;
    self.config = [];
  },

  socketNotificationReceived: function (notification, payload) {
    const self = this;

    switch (notification) {
      case 'START':
        self.handleStartNotification(payload);
    }
  },

  handleStartNotification: function (payload) {
    const self = this;

    if (self.started) {
      return;
    }

    self.config = payload;

    if (self.isInvalidConfig()) {
      return;
    }

    self.scheduleUpdates();

    self.started = true;
  },

  updateStats: function () {
    const self = this;

    const { apiKey, augustID, IDType, installID, password } = self.config;
    const config = { apiKey, augustID, IDType, installID, password };

    AugustConnect.locks({ config })
      .then((resp) =>
        Object.entries(resp)
          .filter(([lockId]) => lockId !== 'token')
          .map(([lockId, lockMeta]) => ({
            id: lockId,
            name: lockMeta.LockName,
            houseName: lockMeta.HouseName,
          }))
      )
      .then((locks) =>
        Promise.all(
          locks.map((lock) =>
            AugustConnect.status({
              config,
              lockID: lock.id,
            }).then(({ doorStatus, status }) => ({
              ...lock,
              doorStatus,
              status,
            }))
          )
        )
      )
      .then((stats) => self.sendSocketNotification('STATS', stats))
      .catch((err) =>
        console.error('Error occurred while fetching stats', err)
      );
  },

  isInvalidConfig: function () {
    const self = this;

    const missingRootField = REQUIRED_ROOT_FIELDS.find(
      (field) => !self.config[field]
    );

    if (missingRootField) {
      self.sendSocketNotification(
        'ERROR',
        `<i>Confg.${missingRootField}</i> is required for module: ${self.name}.`
      );
      return true;
    }

    return false;
  },

  scheduleUpdates() {
    const self = this;

    self.updateStats();
    setInterval(() => self.updateStats(), self.config.updateInterval);
  },
});
