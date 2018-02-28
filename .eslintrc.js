module.exports = {
	env: {
		// browser: true,
		// commonjs: true,
		es6: true,
		node: true
	},
	parser:  "typescript-eslint-parser",
	parserOptions: {
		sourceType: "module"
	},
	rules: {
		// "array-element-newline": [ { multiline: true, minItems: 1 } ],
		// "array-bracket-newline": [
		// 	"warn",
		// 	"always",
		// ],
		"operator-linebreak": ["warn", "after"],
		semi: [
			"warn",
			"never",
			{
				beforeStatementContinuationChars: "never"
			}
		],

		"no-const-assign": "warn",
		"no-this-before-super": "warn",
		"no-undef": "warn",
		"no-unreachable": "warn",
		"no-unused-vars": "warn",
		"constructor-super": "warn",
		"valid-typeof": "warn",
		"no-console": "warn",
		"object-curly-spacing": ["warn", "always"],
		"array-bracket-spacing": ["warn", "always"],
		"space-in-parens": ["warn", "always"],
		"block-spacing": ["warn", "always"],
		"computed-property-spacing": ["warn", "always"],
		"key-spacing": [
			"warn",
			{
				afterColon: true,
				align: "colon"
			}
		],
		"space-in-parens": ["warn", "always"],
		"space-infix-ops": ["warn", { int32Hint: false }],
		keyword: {
			before: true,
			after: true
		}
	}
}
