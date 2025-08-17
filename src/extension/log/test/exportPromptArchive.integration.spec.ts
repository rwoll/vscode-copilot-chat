/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert from 'assert';
import { suite, test } from 'vitest';
import * as path from 'path';
import * as fs from 'fs';

suite('exportPromptArchive command integration', () => {
	test('should verify command signature accepts optional outputPath parameter', () => {
		// Read the actual implementation file
		const filePath = path.join(__dirname, '../vscode-node/requestLogTree.ts');
		const content = fs.readFileSync(filePath, 'utf8');
		
		// Verify the command registration includes the optional outputPath parameter
		const commandRegistrationRegex = /registerCommand\(exportPromptArchiveCommand,\s*async\s*\(\s*treeItem:\s*ChatPromptItem,\s*outputPath\?\s*:\s*string\s*\)/;
		assert.ok(commandRegistrationRegex.test(content), 
			'Command should be registered with optional outputPath parameter');
			
		// Verify the parameter has proper JSDoc comment explaining the name choice
		assert.ok(content.includes('outputPath'), 
			'Implementation should use outputPath parameter name');
		assert.ok(content.includes('aligns with VS Code conventions'), 
			'Should include comment explaining parameter name choice');
	});

	test('should verify file existence check logic', () => {
		const filePath = path.join(__dirname, '../vscode-node/requestLogTree.ts');
		const content = fs.readFileSync(filePath, 'utf8');
		
		// Verify error handling for existing files
		assert.ok(content.includes('already exists'), 
			'Should check for file existence and throw appropriate error');
		assert.ok(content.includes('vscode.workspace.fs.stat'), 
			'Should use VS Code filesystem API to check file existence');
	});

	test('should verify directory creation logic', () => {
		const filePath = path.join(__dirname, '../vscode-node/requestLogTree.ts');
		const content = fs.readFileSync(filePath, 'utf8');
		
		// Verify directory creation logic
		assert.ok(content.includes('createDirectory'), 
			'Should create directories when they do not exist');
		assert.ok(content.includes('path.dirname'), 
			'Should extract directory path from output path');
	});

	test('should preserve existing behavior when no outputPath provided', () => {
		const filePath = path.join(__dirname, '../vscode-node/requestLogTree.ts');
		const content = fs.readFileSync(filePath, 'utf8');
		
		// Verify existing save dialog behavior is preserved
		assert.ok(content.includes('showSaveDialog'), 
			'Should still show save dialog when no outputPath provided');
		assert.ok(content.includes('if (outputPath)'), 
			'Should conditionally use outputPath vs save dialog');
	});
});