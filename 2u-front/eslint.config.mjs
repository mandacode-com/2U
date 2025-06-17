import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  ...compat.config({
    rules: {
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "off",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@next/next/no-img-element": "off",
      "@next/next/no-html-link-for-pages": "off",
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.json",
        },
      },
    }
  }),
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
  },
];

export default eslintConfig;
