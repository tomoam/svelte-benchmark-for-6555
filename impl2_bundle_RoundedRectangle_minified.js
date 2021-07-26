var app=function(){"use strict";function t(){}function n(t){return t()}function e(){return Object.create(null)}function o(t){t.forEach(n)}function r(t){return"function"==typeof t}function i(t,n){return t!=t?n==n:t!==n||t&&"object"==typeof t||"function"==typeof t}let c,l=!1;function a(t,n,e,o){for(;t<n;){const r=t+(n-t>>1);e(r)<=o?t=r+1:n=r}return t}function u(t,n){if(l){for(!function(t){if(t.hydrate_init)return;t.hydrate_init=!0;let n=t.childNodes;if("HEAD"===t.nodeName){const t=[];for(let e=0;e<n.length;e++){const o=n[e];void 0!==o.claim_order&&t.push(o)}n=t}const e=new Int32Array(n.length+1),o=new Int32Array(n.length);e[0]=-1;let r=0;for(let t=0;t<n.length;t++){const i=n[t].claim_order,c=(r>0&&n[e[r]].claim_order<=i?r+1:a(1,r,(t=>n[e[t]].claim_order),i))-1;o[t]=e[c]+1;const l=c+1;e[l]=t,r=Math.max(l,r)}const i=[],c=[];let l=n.length-1;for(let t=e[r]+1;0!=t;t=o[t-1]){for(i.push(n[t-1]);l>=t;l--)c.push(n[l]);l--}for(;l>=0;l--)c.push(n[l]);i.reverse(),c.sort(((t,n)=>t.claim_order-n.claim_order));for(let n=0,e=0;n<c.length;n++){for(;e<i.length&&c[n].claim_order>=i[e].claim_order;)e++;const o=e<i.length?i[e]:null;t.insertBefore(c[n],o)}}(t),(void 0===t.actual_end_child||null!==t.actual_end_child&&t.actual_end_child.parentElement!==t)&&(t.actual_end_child=t.firstChild);null!==t.actual_end_child&&void 0===t.actual_end_child.claim_order;)t.actual_end_child=t.actual_end_child.nextSibling;n!==t.actual_end_child?void 0===n.claim_order&&n.parentNode===t||t.insertBefore(n,t.actual_end_child):t.actual_end_child=n.nextSibling}else n.parentNode!==t&&t.appendChild(n)}function d(t){t.parentNode.removeChild(t)}function s(t){return document.createElementNS("http://www.w3.org/2000/svg",t)}function f(t,n,e){null==e?t.removeAttribute(n):t.getAttribute(n)!==e&&t.setAttribute(n,e)}function h(t){return Array.from(t.childNodes)}function _(t,n,e,o){return function(t,n,e,o,r=!1){!function(t){void 0===t.claim_info&&(t.claim_info={last_index:0,total_claimed:0})}(t);const i=(()=>{for(let o=t.claim_info.last_index;o<t.length;o++){const i=t[o];if(n(i)){const n=e(i);return void 0===n?t.splice(o,1):t[o]=n,r||(t.claim_info.last_index=o),i}}for(let o=t.claim_info.last_index-1;o>=0;o--){const i=t[o];if(n(i)){const n=e(i);return void 0===n?t.splice(o,1):t[o]=n,r?void 0===n&&t.claim_info.last_index--:t.claim_info.last_index=o,i}}return o()})();return i.claim_order=t.claim_info.total_claimed,t.claim_info.total_claimed+=1,i}(t,(t=>t.nodeName===n),(t=>{const n=[];for(let o=0;o<t.attributes.length;o++){const r=t.attributes[o];e[r.name]||n.push(r.name)}n.forEach((n=>t.removeAttribute(n)))}),(()=>o(n)))}function m(t){c=t}const p=[],g=[],$=[],x=[],y=Promise.resolve();let b=!1;function v(t){$.push(t)}let w=!1;const E=new Set;function N(){if(!w){w=!0;do{for(let t=0;t<p.length;t+=1){const n=p[t];m(n),k(n.$$)}for(m(null),p.length=0;g.length;)g.pop()();for(let t=0;t<$.length;t+=1){const n=$[t];E.has(n)||(E.add(n),n())}$.length=0}while(p.length);for(;x.length;)x.pop()();b=!1,w=!1,E.clear()}}function k(t){if(null!==t.fragment){t.update(),o(t.before_update);const n=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,n),t.after_update.forEach(v)}}const A=new Set;function S(t,n){-1===t.$$.dirty[0]&&(p.push(t),b||(b=!0,y.then(N)),t.$$.dirty.fill(0)),t.$$.dirty[n/31|0]|=1<<n%31}function j(i,a,u,s,f,_,p,g=[-1]){const $=c;m(i);const x=i.$$={fragment:null,ctx:null,props:_,update:t,not_equal:f,bound:e(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map($?$.$$.context:a.context||[]),callbacks:e(),dirty:g,skip_bound:!1,root:a.target||$.$$.root};p&&p(x.root);let y=!1;if(x.ctx=u?u(i,a.props||{},((t,n,...e)=>{const o=e.length?e[0]:n;return x.ctx&&f(x.ctx[t],x.ctx[t]=o)&&(!x.skip_bound&&x.bound[t]&&x.bound[t](o),y&&S(i,t)),n})):[],x.update(),y=!0,o(x.before_update),x.fragment=!!s&&s(x.ctx),a.target){if(a.hydrate){l=!0;const t=h(a.target);x.fragment&&x.fragment.l(t),t.forEach(d)}else x.fragment&&x.fragment.c();a.intro&&((b=i.$$.fragment)&&b.i&&(A.delete(b),b.i(w))),function(t,e,i,c){const{fragment:l,on_mount:a,on_destroy:u,after_update:d}=t.$$;l&&l.m(e,i),c||v((()=>{const e=a.map(n).filter(r);u?u.push(...e):o(e),t.$$.on_mount=[]})),d.forEach(v)}(i,a.target,a.anchor,a.customElement),l=!1,N()}var b,w;m($)}function B(n){let e,o;return{c(){e=s("svg"),o=s("rect"),this.h()},l(t){e=_(t,"svg",{},s);var n=h(e);o=_(n,"rect",{x:!0,y:!0,width:!0,height:!0,rx:!0,ry:!0,fill:!0},s),h(o).forEach(d),n.forEach(d),this.h()},h(){f(o,"x","10"),f(o,"y","10"),f(o,"width","50"),f(o,"height","50"),f(o,"rx","10"),f(o,"ry","10"),f(o,"fill","red")},m(t,n){!function(t,n,e){l&&!e?u(t,n):n.parentNode===t&&n.nextSibling==e||t.insertBefore(n,e||null)}(t,e,n),u(e,o)},p:t,i:t,o:t,d(t){t&&d(e)}}}return new class extends class{$destroy(){!function(t,n){const e=t.$$;null!==e.fragment&&(o(e.on_destroy),e.fragment&&e.fragment.d(n),e.on_destroy=e.fragment=null,e.ctx=[])}(this,1),this.$destroy=t}$on(t,n){const e=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return e.push(n),()=>{const t=e.indexOf(n);-1!==t&&e.splice(t,1)}}$set(t){var n;this.$$set&&(n=t,0!==Object.keys(n).length)&&(this.$$.skip_bound=!0,this.$$set(t),this.$$.skip_bound=!1)}}{constructor(t){super(),j(this,t,null,B,i,{})}}({target:document.body})}();
//# sourceMappingURL=bundle.js.map
