# Tailwind Class Scanner

Tailwind Class Scanner is a Node.js utility that scans a specified directory for Tailwind CSS classes used in HTML, Vue, JSX, JS, and TS files.

This utility is intended for those who are planning to add Tailwind to an existing project and want to scan it for similarly named classes to prevent unwanted effects. When previous classes have a different meaning, this can be problematic.

## Features
- Scans specified directories for Tailwind CSS classes.
- Supports ignoring specific classes and paths.
- Outputs the location of each found class with line numbers.

## Usage
Run the utility using npx, specifying the directory to scan as the first argument. You can also provide optional arguments to ignore specific classes and paths.
```sh
npx tailwind-class-scanner@latest path/to/directory --ignored-classes justify-center,ml-auto,mb-4 --ignored-paths src/components/ignored1,src/components/ignored2
```

Or just clone the repository and run the utility using Node.js:
```sh
git clone https://github.com/rizhenkov/tailwind-class-scanner.git && cd tailwind-class-scanner
node ./index.js path/to/directory
```

## Output
The utility outputs the location of each found class with line numbers. For example:
```
class: text-center
  used in: file:///Users/ar/my-vue-project/src/App.vue:10
class: bg-blue-500
  used in: file:///Users/ar/my-vue-project/src/components/Header.vue:15
```
If it runs from an IDE, it will open the file in the IDE.

## Contributing
Contributions are welcome! Please feel free to submit a pull request or open an issue if you find a bug or have a feature request.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.