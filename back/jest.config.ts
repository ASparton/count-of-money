import { JestConfigWithTsJest, pathsToModuleNameMapper } from 'ts-jest';
import { compilerOptions } from './tsconfig.json';

const jestConfig: JestConfigWithTsJest = {
	preset: 'ts-jest/presets/js-with-ts-esm',
	testEnvironment: 'node',
	roots: ['<rootDir>'],
	modulePaths: [compilerOptions.baseUrl],
	moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
		prefix: '<rootDir>/',
	}),
	extensionsToTreatAsEsm: ['.ts'],
	transform: {
		'^.+\\.ts?$': [
			'ts-jest',
			{
				useESM: true,
			},
		],
	},
	// transformIgnorePatterns: [
	// 	'node_modules/@lucia-auth',
	// ],
};

export default jestConfig;
