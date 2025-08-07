// jest.config.js
module.exports = {
  // If you’re using CRA, you’ll need to override with react-app-rewired or CRACO
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  transformIgnorePatterns: ['/node_modules/(?!(ky|ky-universal)/)'],
};
