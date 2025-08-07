module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        // target the current Node, but still emit CommonJS modules for Jest
        targets: { node: 'current' },
        modules: 'auto'
      }
    ],
    '@babel/preset-typescript'
  ]
};