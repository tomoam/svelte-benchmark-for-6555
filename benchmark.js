const fs = require('fs');
const { execSync } = require('child_process');

const implname = process.argv.length > 2 ? process.argv[2] : "";

const template = `

const app = new App({
	target: document.body
});

export default app;`;

const components = [
	"HelloWorld",
	"RoundedRectangle",
	"HelloWorld_RoundedRectangle",
	"TodoMVC",
	"Icons",
	"TodoMVC_Icons"
];

let results = new Map();

components.forEach((component) => {
	fs.writeFileSync('./src/main.js', `import App from './${component}.svelte';${template}`);

	execSync(`npm run build`);
	const file = `${implname}_bundle_${component}_minified.js`;

	fs.rmSync(`./${file}`, {force: true});
	fs.rmSync(`./${file}.gz`, {force: true});
	fs.rmSync(`./${file}.br`, {force: true});

	execSync(`cp ./public/build/bundle.js ./${file}`);
	execSync(`gzip -k ./${file}`);
	execSync(`brotli ./${file}`);

	const minified = fs.statSync(`./${file}`);
	results.set(`${component} minified`, minified.size)

	const gzip = fs.statSync(`./${file}.gz`);
	results.set(`${component} minified gzip`, gzip.size)

	const brotli = fs.statSync(`./${file}.br`);
	results.set(`${component} minified brotli`, brotli.size)
});

fs.writeFileSync('./src/main.js', `import App from './App.svelte';${template}`);

console.table(results);
