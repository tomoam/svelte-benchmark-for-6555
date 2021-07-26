
# Svelte benchmark for #6555 

refs: https://github.com/sveltejs/svelte/issues/6555, https://github.com/sveltejs/svelte/pull/6556


I've thought of several implementations to fix #6555, but each has its trade-offs.

- [impl1](https://github.com/sveltejs/svelte/compare/master...tomoam:6555-impl1)
  - same as [this PR](https://github.com/sveltejs/svelte/pull/6556/commits/7f0c0b703f43f93140df19493844b6ad13e51cce)
  - This allows to exclude `svg_element` function if a component does'nt have svg-elements, but not exclude `element` function if a component only includes svg-elements.
- [impl2](https://github.com/sveltejs/svelte/compare/master...tomoam:6555-impl2)
  - This allows to exclude `svg_element` function if a component does'nt have svg-elements, and exclude `element` function if a component only includes svg-elements.
  - Each elements pass `element` function or `svg_element` function to `claim_element` function in `claim` function.
    - compiled
    ```js
        l: function claim(nodes) {
            ...
            main = claim_element(nodes, "MAIN", {}, element);
            ...
        },
	```
	- minified(formatted)
	```js
        l(t) {
            ...
            e = $(t, "MAIN", {}, s);
			...
        },
	```
  - **Trade-off**  
    The size increases by 2 bytes for each claim_element, so if there are few elements, the size will be small, but if there are many elements, the size will be large.
- [impl3](https://github.com/sveltejs/svelte/compare/master...tomoam:6555-impl3)
  - This allows to exclude `svg_element` function if a component does'nt have svg-elements, and exclude `element` function if a component only includes svg-elements.
  - renamed `claim_element` to `claim_element_base`, and created wrapper functions.
    ```diff
    -   export function claim_element(nodes: ChildNodeArray, name: string, attributes: {[key: string]: boolean}, svg) {
    +   export function claim_element_base(nodes: ChildNodeArray, name: string, attributes: { [key: string]: boolean }, create_element: (name: string) => Element | SVGElement) {
	        ...
        }

    +   export function claim_element(nodes: ChildNodeArray, name: string, attributes: { [key: string]: boolean }) {
    +       return claim_element_base(nodes, name, attributes, element);
    +   }

    +   export function claim_svg_element(nodes: ChildNodeArray, name: string, attributes: { [key: string]: boolean }) {
    +       return claim_element_base(nodes, name, attributes, svg_element);
    +    }
    ```
  - **Trade-off**  
    If a component includes both svg-elements and not-svg-elements, and the number of elements is small, the footprint can be large.


To clarify the trade-offs of these implementations, I compiled the following components in each implementation and compared the bundle sizes.

- Small-size components
  - a component not including svg-elements.
  - a component including only svg-elements.
  - a component including both.
- Regular-size components
  - a component not including svg-elements.
  - a component including only svg-elements.
  - a component including both.


## Results

### Small-size components

**Component**

- [HelloWorld](./src/HelloWorld.svelte) : as a component not including svg-elements.
- [RoundedRectangle](./src/RoundedRectangle.svelte) : as a component including only svg-elements.
- [HelloWorld and RoundedRectangle](./src/HelloWorld_RoundedRectangle.svelte) : as a comonent including both.

| | v3.40.0 | impl1 | impl2 | impl3 |
|---|---:|---:|---:|---:|
| HelloWorld minified | 5358 | :1st_place_medal: 5258 | :2nd_place_medal: 5260 | :3rd_place_medal: 5289 |
| HelloWorld minified gzip | 2308 | 2268 | 2267 | 2272 |
| HelloWorld minified brotli | 2087 | 2055 | 2054 | 2052 |
| RoundedRectangle minified | 5333 | :3rd_place_medal: 5331 | :1st_place_medal: 5282 | :2nd_place_medal: 5311 |
| RoundedRectangle minified gzip | 2304 | 2300 | 2290 | 2293 |
| RoundedRectangle minified brotli | 2085 | 2080 | 2078 | 2079 |
| HelloWorld and RoundedRectangle minified | :3rd_place_medal: 6487 | :1st_place_medal: 6482 | :2nd_place_medal: 6484 | **6548** |
| HelloWorld and RoundedRectangle minified gzip | 2693 | 2688 | 2687 | 2706 |
| HelloWorld and RoundedRectangle minified brotli | 2414 | 2411 | 2409 | 2424 |

Note: The sizes for gzip and brotli are for reference only.

## Normal-size components

**Component**
- TodoMVC : as a component not including svg-elements (based on [sveltejs/svelte-todomvc](https://github.com/sveltejs/svelte-todomvc/blob/master/src/TodoMVC.svelte))
- Icons : as a component including only svg-elements (based on [sveltejs/site-kit](https://github.com/sveltejs/site-kit/blob/master/components/Icons.svelte))
- [TodoMVC and Icons](./src/TodoMVC_Icons.svelte) : as a component including both

| | v3.40.0 | impl1 | impl2 | impl3 |
|---|---:|---:|---:|---:|
| TodoMVC minified | 12854 | :1st_place_medal: 12774 | :3rd_place_medal: 12820 | :2nd_place_medal: 12805 |
| TodoMVC minified gzip | 5198 | 5160 | 5159 | 5164 |
| TodoMVC minified brotli | 4602 | 4543 | 4578 | 4577 |
| Icons minified | :3rd_place_medal: 14023 | 14025 | :2nd_place_medal: 13976 | :1st_place_medal: 13877 |
| Icons minified gzip | 4556 | 4559 | 4554 | 4557 |
| Icons minified brotli | 3922 | 3928 | 3934 | 3919 |
| TodoMVC and Icons minified | :3rd_place_medal: 22560 | :2nd_place_medal: 22559 | 22605 | :1st_place_medal: 22500 |
| TodoMVC and Icons minified gzip | 7757 | 7753 | 7756 | 7760 |
| TodoMVC and Icons minified brotli | 6710 | 6700 | 6718 | 6706 |

Note: The sizes for gzip and brotli are for reference only.


---

# svelte app

This is a project template for [Svelte](https://svelte.dev) apps. It lives at https://github.com/sveltejs/template.

To create a new project based on this template using [degit](https://github.com/Rich-Harris/degit):

```bash
npx degit sveltejs/template svelte-app
cd svelte-app
```

*Note that you will need to have [Node.js](https://nodejs.org) installed.*


## Get started

Install the dependencies...

```bash
cd svelte-app
npm install
```

...then start [Rollup](https://rollupjs.org):

```bash
npm run dev
```

Navigate to [localhost:5000](http://localhost:5000). You should see your app running. Edit a component file in `src`, save it, and reload the page to see your changes.

By default, the server will only respond to requests from localhost. To allow connections from other computers, edit the `sirv` commands in package.json to include the option `--host 0.0.0.0`.

If you're using [Visual Studio Code](https://code.visualstudio.com/) we recommend installing the official extension [Svelte for VS Code](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode). If you are using other editors you may need to install a plugin in order to get syntax highlighting and intellisense.

## Building and running in production mode

To create an optimised version of the app:

```bash
npm run build
```

You can run the newly built app with `npm run start`. This uses [sirv](https://github.com/lukeed/sirv), which is included in your package.json's `dependencies` so that the app will work when you deploy to platforms like [Heroku](https://heroku.com).


## Single-page app mode

By default, sirv will only respond to requests that match files in `public`. This is to maximise compatibility with static fileservers, allowing you to deploy your app anywhere.

If you're building a single-page app (SPA) with multiple routes, sirv needs to be able to respond to requests for *any* path. You can make it so by editing the `"start"` command in package.json:

```js
"start": "sirv public --single"
```

## Using TypeScript

This template comes with a script to set up a TypeScript development environment, you can run it immediately after cloning the template with:

```bash
node scripts/setupTypeScript.js
```

Or remove the script via:

```bash
rm scripts/setupTypeScript.js
```

## Deploying to the web

### With [Vercel](https://vercel.com)

Install `vercel` if you haven't already:

```bash
npm install -g vercel
```

Then, from within your project folder:

```bash
cd public
vercel deploy --name my-project
```

### With [surge](https://surge.sh/)

Install `surge` if you haven't already:

```bash
npm install -g surge
```

Then, from within your project folder:

```bash
npm run build
surge public my-project.surge.sh
```
