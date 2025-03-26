import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import eslintPluginImport from "eslint-plugin-import";
import eslintPluginA11y from "eslint-plugin-jsx-a11y";
import eslintPluginReact from "eslint-plugin-react";
import eslintPluginReactHooks from "eslint-plugin-react-hooks";
import eslintPluginPrettier from "eslint-plugin-prettier";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import eslintPluginNext from "@next/eslint-plugin-next";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const compat = new FlatCompat({
	baseDirectory: __dirname,
});

const config = [
	{
		ignores: [
			"**/components/ui/**",
			"node_modules/",
			"dist/",
			".next/",
			"**/*.config.js",
			"**/*.config.mjs",
			"coverage/",
			".yarn/",
		],
	},
	...compat.extends(
		"next/core-web-vitals",
		"plugin:@typescript-eslint/recommended",
		"next"
	),
	{
		files: ["**/*.{js,jsx,ts,tsx}"],
		plugins: {
			import: eslintPluginImport,
			"jsx-a11y": eslintPluginA11y,
			prettier: eslintPluginPrettier,
			react: eslintPluginReact,
			"react-hooks": eslintPluginReactHooks,
			"@typescript-eslint": typescriptEslint,
			next: eslintPluginNext,
		},
		languageOptions: {
			parser: typescriptParser,
			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
				ecmaVersion: "latest",
				sourceType: "module",
			},
		},
		rules: {
			// TypeScript-specific rules
			"@typescript-eslint/no-unused-vars": [
				"warn",
				{
					argsIgnorePattern: "^_",
					varsIgnorePattern: "^_",
					destructuredArrayIgnorePattern: "^_",
				},
			],
			"@typescript-eslint/no-explicit-any": "warn", // Keep as warn for flexibility
			"@typescript-eslint/consistent-type-imports": [
				"error",
				{ prefer: "type-imports" },
			],
			"@typescript-eslint/explicit-function-return-type": "off", // Added: Too strict for contribs

			// Import rules
			"import/order": [
				"error",
				{
					groups: [
						"builtin",
						"external",
						"internal",
						"parent",
						"sibling",
						"index",
						"object",
						"type",
					],
					pathGroups: [
						{
							pattern: "@/**",
							group: "internal",
						},
					],
					alphabetize: {
						order: "asc",
						caseInsensitive: true,
					},
					"newlines-between": "always",
				},
			],
			"import/no-unresolved": "error", // Added: Ensure imports are valid
			"import/no-extraneous-dependencies": [
				"error",
				{ devDependencies: true },
			], // Added: Allow dev deps

			// React rules
			"react/prop-types": "off", // TypeScript handles this
			"react/react-in-jsx-scope": "off", // Modern React doesn’t need this
			"react-hooks/rules-of-hooks": "error", // Added: Enforce hook rules
			"react-hooks/exhaustive-deps": "warn", // Added: Warn on missing deps
			"react/no-unescaped-entities": "error", // Added: Prevent XSS risks
			"react/self-closing-comp": "error", // Added: Enforce self-closing tags

			// Accessibility rules
			"jsx-a11y/no-autofocus": "warn",
			"jsx-a11y/alt-text": "error", // Added: Enforce image accessibility
			"jsx-a11y/anchor-is-valid": "error", // Added: Ensure valid links

			// Prettier integration
			"prettier/prettier": [
				"error",
				{
					singleQuote: true,
					trailingComma: "es5",
					printWidth: 100,
					tabWidth: 2,
					semi: true,
					arrowParens: "always",
					bracketSpacing: true, // Added: Spaces inside curly braces
					endOfLine: "lf", // Added: Enforce LF line endings (Unix-style)
					quoteProps: "as-needed", // Added: Only quote object props when necessary
					jsxSingleQuote: true, // Added: Use single quotes in JSX
					bracketSameLine: false, // Added: Put > of multiline JSX elements on a new line
				},
			],

			// Next.js-specific rules
			"next/no-html-link-for-pages": "error",
			"next/no-img-element": "error", // Added: Encourage next/image
			"next/no-sync-scripts": "error", // Added: Prevent blocking scripts

			// General JavaScript rules
			"no-console": ["warn", { allow: ["warn", "error"] }], // Added: Allow warn/error logs
			"no-debugger": "error", // Added: Prevent debugger in prod
			eqeqeq: "error", // Added: Enforce strict equality
			"no-unused-expressions": "error", // Added: Catch unused code
		},
		settings: {
			"import/resolver": {
				typescript: {
					alwaysTryTypes: true,
					project: "./tsconfig.json",
				},
			},
			react: {
				version: "detect",
			},
		},
	},
];

export default config;
