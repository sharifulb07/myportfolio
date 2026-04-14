import tseslint from "typescript-eslint";

export default [
  {
    settings: {
      "import/resolver": {
        typescript: {
          project: "./tsconfig.json"
        }
      }
    }
  }
];
