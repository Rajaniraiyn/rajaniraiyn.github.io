const d=function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))n(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const a of t.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&n(a)}).observe(document,{childList:!0,subtree:!0});function p(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerpolicy&&(t.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?t.credentials="include":e.crossorigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function n(e){if(e.ep)return;e.ep=!0;const t=p(e);fetch(e.href,t)}};d();const l=window.matchMedia("(prefers-color-scheme: dark)")?"dark":"light";localStorage.getItem("theme")===null&&localStorage.setItem("theme",l);const c=localStorage.getItem("theme")||l;customElements.define("theme-toggle",class extends HTMLElement{connectedCallback(){const r=this.attachShadow({mode:"open"});r.innerHTML=`<style>
.toggleWrapper {
    overflow: hidden;
    transform: scale(0.65)
}

.toggleWrapper input {
    position: absolute;
    left: -99em
}

.toggle,.toggle__handler {
    display: inline-block;
    position: relative
}

.toggle {
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    width: 90px;
    height: 50px;
    background-color: #83d8ff;
    border-radius: 84px;
    transition: background-color 200ms cubic-bezier(.445,.05,.55,.95)
}

.toggle__handler {
    z-index: 1;
    top: 3px;
    left: 3px;
    width: 44px;
    height: 44px;
    background-color: #ffcf96;
    border-radius: 50px;
    box-shadow: 0 2px 6px rgba(0,0,0,.3);
    transition: all 400ms cubic-bezier(.68,-.55,.265,1.55);
    transform: rotate(-45deg)
}

.toggle__handler .crater {
    position: absolute;
    background-color: #e8cda5;
    opacity: 0;
    transition: opacity 200ms ease-in-out;
    border-radius: 100%
}

.toggle__handler .crater--1 {
    top: 18px;
    left: 10px;
    width: 4px;
    height: 4px
}

.toggle__handler .crater--2 {
    top: 28px;
    left: 22px;
    width: 6px;
    height: 6px
}

.toggle__handler .crater--3 {
    top: 10px;
    left: 25px;
    width: 8px;
    height: 8px
}

.star {
    position: absolute;
    background-color: #fff;
    transition: all 300ms cubic-bezier(.445,.05,.55,.95);
    border-radius: 50%
}

.star--1,.star--2,.star--3 {
    top: 10px;
    left: 35px;
    z-index: 0;
    width: 30px;
    height: 3px
}

.star--2,.star--3 {
    top: 18px;
    left: 28px;
    z-index: 1
}

.star--3 {
    top: 27px;
    left: 40px;
    z-index: 0
}

.star--4,.star--5,.star--6 {
    opacity: 0;
    transition: all 300ms 0 cubic-bezier(.445,.05,.55,.95);
    top: 16px;
    left: 11px;
    z-index: 0;
    width: 2px;
    height: 2px;
    transform: translate3d(3px,0,0)
}

.star--5,.star--6 {
    top: 32px;
    left: 17px;
    width: 3px;
    height: 3px
}

.star--6 {
    top: 36px;
    left: 28px;
    width: 2px;
    height: 2px
}

input:checked+.toggle {
    background-color: #749dd6
}

input:checked+.toggle:before {
    color: #749ed7
}

input:checked+.toggle:after {
    color: #fff
}

input:checked+.toggle .toggle__handler {
    background-color: #ffe5b5;
    transform: translate3d(40px,0,0) rotate(0)
}

input:checked+.toggle .toggle__handler .crater {
    opacity: 1
}

input:checked+.toggle .star--1 {
    width: 2px;
    height: 2px
}

input:checked+.toggle .star--2 {
    width: 4px;
    height: 4px;
    transform: translate3d(-5px,0,0)
}

input:checked+.toggle .star--3 {
    width: 2px;
    height: 2px;
    transform: translate3d(-7px,0,0)
}

input:checked+.toggle .star--4,input:checked+.toggle .star--5,input:checked+.toggle .star--6 {
    opacity: 1;
    transform: translate3d(0,0,0)
}

input:checked+.toggle .star--4 {
    transition: all 300ms 200ms cubic-bezier(.445,.05,.55,.95)
}

input:checked+.toggle .star--5 {
    transition: all 300ms 300ms cubic-bezier(.445,.05,.55,.95)
}

input:checked+.toggle .star--6 {
    transition: all 300ms 400ms cubic-bezier(.445,.05,.55,.95)
}
</style>
<div class="toggleWrapper" >
  <input type="checkbox" class="dn" id="dn" oninput="toggleTheme()" ${c==="dark"?"checked":null} />
  <label for="dn" class="toggle">
    <span class="toggle__handler">
      <span class="crater crater--1"></span>
      <span class="crater crater--2"></span>
      <span class="crater crater--3"></span>
    </span>
    <span class="star star--1"></span>
    <span class="star star--2"></span>
    <span class="star star--3"></span>
    <span class="star star--4"></span>
    <span class="star star--5"></span>
    <span class="star star--6"></span>
  </label>
</div>`}});function s(r){localStorage.setItem("theme",r),document.documentElement.setAttribute("data-theme",r)}function g(){localStorage.getItem("theme")==="dark"?s("light"):s("dark")}window.toggleTheme=g;s(c);const i=document.getElementById("scroll-to-top");window.onscroll=h;function h(){document.body.scrollTop>20||document.documentElement.scrollTop>20?i.classList.add("active"):i.classList.remove("active")}const u=document.getElementById("obj-rocket");window.onload=()=>{setTimeout(()=>{u.style.transform="translate(0,0)"},1e3)};
