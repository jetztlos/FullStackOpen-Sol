module.exports = function(api) {
  api.cache(true);
  return {
    presets: [
      'babel-preset-expo', 
      '@babel/preset-typescript'
    ],
    plugins: [
      [
        '@babel/plugin-transform-class-properties',
        { loose: true } // Set this to `true` if you want loose mode
      ],
      [
        '@babel/plugin-transform-private-methods',
        { loose: true } // Consistent loose mode
      ],
      [
        '@babel/plugin-transform-private-property-in-object',
        { loose: true } // Same loose mode
      ]
    ]
  };
};
