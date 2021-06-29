/* Magic Mirror
 * Module: MMM-August-Lock
 *
 * By Reagan Elm
 * MIT Licensed.
 */

Module.register('MMM-August-Lock', {
  defaults: {
    augustID: '',
    IDType: '',
    password: '',

    apiKey: '79fd0eb6-381d-4adf-95a0-47721289d1d9',
    installID: 'magic-mirror',
    animationSpeed: 2 * 1000, // 2 seconds
    updateInterval: 60 * 1000, // 1 miniute
  },
  requiresVersion: '2.1.0',

  start() {
    const self = this;

    self.loaded = false;
    self.locks = [];

    self.sendSocketNotification('START', self.config);
    Log.info('Starting module: ' + self.name);
  },

  getDom() {
    const self = this;

    if (self.error) {
      return self.renderError();
    }

    if (!self.loaded) {
      return self.renderLoading();
    }

    return self.renderLocks();
  },

  renderError() {
    const self = this;

    const wrapper = document.createElement('div');
    wrapper.className = 'dimmed light small';
    wrapper.innerHTML = self.error;

    return wrapper;
  },

  renderLoading() {
    const self = this;

    const wrapper = document.createElement('div');
    wrapper.className = 'dimmed light small';
    wrapper.innerHTML = self.translate('LOADING');

    return wrapper;
  },

  renderLocks() {
    const self = this;

    const wrapper = document.createElement('table');
    wrapper.className = 'small';
    wrapper.innerHTML = '';

    self.locks.forEach((lock) => {
      wrapper.innerHTML += `
        <tr class="lock-row">
          ${self.renderName(lock)}
          ${self.renderStatus(lock)}
        </tr>
      `;
    });

    return wrapper;
  },

  renderName({ name }) {
    return `<td class="name">${name}</td>`;
  },

  renderStatus({ doorStatus, status }) {
    let statusIcon, doorIcon;
    switch (status) {
      case 'kAugLockState_Locked':
        statusIcon = '<i class="fa fa-lock"></i>';
        break;
      case 'kAugLockState_Unlocked':
        doorIcon =
          doorStatus === 'kAugDoorState_Closed'
            ? '<i class="fa fa-door-closed"></i>'
            : '<i class="fa fa-door-open"></i>';

        statusIcon = `<i class="fa fa-lock-open"></i>${doorIcon}`;
        break;
      default:
        statusIcon = `<i class="fa fa-question"></i> : ${status}`;
    }

    return `<td class="status title bright">${statusIcon}</td>`;
  },

  socketNotificationReceived(notification, payload) {
    const self = this;

    switch (notification) {
      case 'STATS':
        self.loaded = true;
        self.locks = payload;
        break;
      case 'ERROR':
        self.error = payload;
        break;
    }

    self.updateDom(self.config.animationSpeed);
  },

  getScripts() {
    return [];
  },

  getStyles() {
    return ['MMM-August-Lock.css', 'font-awesome.css'];
  },

  getTranslations() {
    return {};
  },
});
