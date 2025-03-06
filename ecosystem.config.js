module.exports = {
  apps: [
    {
      name: 'uniscore-client',
      script: 'node_modules/next/dist/bin/next',
      instances: 'max',
      args: 'start -H 0.0.0.0 -p 4000',
    },
  ],
};
