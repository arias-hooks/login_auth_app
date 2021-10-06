'use strict';

const moment = require('moment');
const uuid = require('node-uuid');

const uuidHelper = {};

uuidHelper.generateUUID = () => {
  const current = moment().format("YYYY-MM-DD");

  return `${uuid.v4()}-${current}`;
};

module.exports = uuidHelper;
