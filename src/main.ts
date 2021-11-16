import "./style.css";
import "./animations.css";
import "./objects.css";

/**
 *
 * For Scroll to Top Functionality
 *
 */
const SCT = document.getElementById("scroll-to-top") as HTMLElement;

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = scrollFunction;

/**
 *
 * make the scroll to top button appear when the user scrolls down
 *
 */
function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    SCT.classList.add("active");
  } else {
    SCT.classList.remove("active");
  }
}

// Animate the rocket after loading the page
const rocket = document.getElementById("obj-rocket") as HTMLElement;

window.onload = () => {
  setTimeout(() => {
    rocket.style.transform = "translate(0,0)";
  }, 1e3);
};
