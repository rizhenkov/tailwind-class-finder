#! /usr/bin/env node
import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

// Convert import.meta.url to a file path
const __filename = fileURLToPath(import.meta.url);

// Get the directory name
const __dirname = path.dirname(__filename);

function parseArguments() {
	const args = process.argv.slice(2); // Skip the first two default arguments

	if (args.length === 0) {
		throw new Error('Please provide the directory to scan as the first argument.');
	}

	const srcDir = args[0];
	const ignoredClassesArgIndex = args.indexOf('--ignored-classes');
	let ignoredClasses = [];

	if (ignoredClassesArgIndex !== -1 && args[ignoredClassesArgIndex + 1]) {
		ignoredClasses = args[ignoredClassesArgIndex + 1].split(','); // Split by comma to get individual classes
	}

	const ignoredPathsArgIndex = args.indexOf('--ignored-paths');
	let ignoredPaths = [];

	if (ignoredPathsArgIndex !== -1 && args[ignoredPathsArgIndex + 1]) {
		ignoredPaths = args[ignoredPathsArgIndex + 1].split(',').map((p) => path.resolve(p)); // Split by comma and resolve paths
	}

	return { srcDir, ignoredClasses, ignoredPaths };
}

const tailwindClasses = new Set(
	JSON.parse(fs.readFileSync(path.join(__dirname, './../tw-classes-crawled-full-array.json'), 'utf-8')),
);

const foundClasses = {};

const { srcDir, ignoredClasses, ignoredPaths } = parseArguments();

function scanDir(dir) {
	fs.readdirSync(dir).forEach((file) => {
		const fullPath = path.join(dir, file);

		// Проверка на игнорируемые пути
		if (ignoredPaths.some((ignoredPath) => fullPath.startsWith(ignoredPath))) {
			return; // Пропускаем этот путь
		}

		if (fs.statSync(fullPath).isDirectory()) {
			scanDir(fullPath);
		} else if (
			fullPath.endsWith('.html') ||
			fullPath.endsWith('.vue') ||
			fullPath.endsWith('.jsx') ||
			fullPath.endsWith('.js') ||
			fullPath.endsWith('.ts')
		) {
			const content = fs.readFileSync(fullPath, 'utf-8');
			const lines = content.split('\n'); // Разделяем содержимое на строки
			const matches = content.match(/class="([^"]*)"/g);
			if (matches) {
				matches.forEach((match) => {
					const classes = match
						.replace(/class="/, '')
						.replace(/"/, '')
						.split(' ');
					classes.forEach((cls) => {
						if (tailwindClasses.has(cls) && !ignoredClasses.includes(cls)) {
							if (!foundClasses[cls]) {
								foundClasses[cls] = [];
							}
							// Находим номер строки, где находится класс
							lines.forEach((line, index) => {
								if (line.includes(match)) {
									const lineNumber = index + 1; // Номера строк начинаются с 1
									const fileLink = `file://${fullPath}:${lineNumber}`; // Форматируем ссылку
									foundClasses[cls].push(fileLink);
								}
							});
						}
					});
				});
			}
		}
	});
}

scanDir(path.resolve(srcDir));

// Results output
for (const [cls, locations] of Object.entries(foundClasses)) {
	console.log(`class: ${cls}`);
	locations.forEach((location) => console.log(`  used in: ${location}`));
}
