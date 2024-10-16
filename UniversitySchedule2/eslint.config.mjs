import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";



export default (
  {
    "env": {
      "browser": true,
      "es2021": true
    },
    "extends": [
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:prettier/recommended"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
      "ecmaVersion": 12,
      "sourceType": "module"
    },
    "plugins": ["@typescript-eslint", "prettier"],
    "rules": {
      "prettier/prettier": "error",
      "no-console": ["error", { "allow": ["error", "warn"] }],
      "prefer-const": "warn"
    }
  }
);