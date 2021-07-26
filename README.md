
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

## Requirement

- install brotli, gzip.

- clone [tomoam/svelte](https://github.com/tomoam/svelte) (because of including above implementations branch).
  ```bash
  git clone https://github.com/tomoam/svelte.git
  ```

  and checkout branch of above implementations, and build then link.

  - impl1
  ```bash
  git checkout 6555-impl1
  npm run build
  npm link
  ```

## Get started

```bash
git clone https://github.com/tomoam/svelte-benchmark-for-6555.git
cd svelte-benchmark-for-6555
npm install
npm link svelte
npm run benchmark -- --impl1
```

