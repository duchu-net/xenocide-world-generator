module.exports = {
  "env": {
      // "browser": true,
      // "amd": true,
      "node": true,
      "es6": true
  },
  "extends": "eslint:recommended",
  "parserOptions": {
    //   "ecmaFeatures": {
    //       "jsx": true
    //   },
      "sourceType": "module",
      "ecmaVersion": 2018
  },
  "rules": {
      "indent": [
          "error",
          2
      ],
      "linebreak-style": [
          "error",
          "windows"
      ],
      "quotes": [
          "error",
          "single"
      ],
      "semi": [
          "error",
          "never"
      ]
  }
};
