module.exports = {
  root: true,
  extends: [
    '@applet-request/eslint-config-ts',
  ],
  overrides: [
    // test文件不禁止log
    {
      files: ['*.test.ts'],
      rules: {
        'no-console': 'off',
      },
    },
  ],
};
