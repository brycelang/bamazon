const signale = require('signale');

// Overrides any existing `package.json` config
signale.config({
  displayFilename: false,
  displayTimestamp: true,
  displayDate: false
}); 

signale.success('packages loaded');