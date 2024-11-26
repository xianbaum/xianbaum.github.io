---
layout: post
title: Accessible sidebar drawer with great UX
permalink: /blog/accessible-sidebar-drawer-with-great-ux
date: 2024-11-26 01:41:39 -0700
---

If you are on mobile, or if you shrink the window, you'll see a hamburger menu with a toggleable sidebar. This is functional with javascript disabled, although some javascript was added to enhance the experience. So, how do you implement it?

Start by adding two radio buttons. One for the "on" button, one for "off" button. The label button is a UX trick to dismiss the modal by clicking outside of the menu. Make sure to add the aria-hidden attribute to these so screen readers don't pick it up. The state of the drawer is kept in these radio buttons.

```html
<input type="radio"
  class="menu-toggle open"
  name="menu-toggle"
  title="Open"
  aria-hidden="true"
  tabindex="-1"
  id="ta_menuOpen">
<input type="radio"
  class="menu-toggle close"
  name="menu-toggle"
  title="Close"
  aria-hidden="true"
  id="ta_menuClose"
  tabindex="-1">
<label class="menu-toggle overlay hidden"
  for="ta_menuClose"
  tabindex="-1"></label>
```

This CSS makes the radio buttons act like a menu toggle in the top right corner. When the menu is open, the z-index of the close button is put to the top. At the same time, the overlay is brought up behind the menu which also acts like a close button. The menu is optimized for right-handed users, which is the majority of the population. Sorry, left-handers!

```scss
.menu-toggle, .menu-toggle.overlay, .theme-toggle {
  position: fixed;
  opacity: 0;
  display: block;
}

.menu-toggle.overlay {
  top: 0;
  right: 100%;
  width: 100%;
  height: 100%;
}

.menu-toggle.open, .menu-toggle.close {
  width: 40px;
  height: 40px;
  cursor: pointer;
  top: -1px;
  right: -1px;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  -webkit-tap-highlight-color: transparent; 
}

.menu-toggle.open {
  z-index: 500;
}

.menu-toggle.open:checked ~ .menu-toggle.close {
  z-index: 500;
}

.menu-toggle.out {
  width: 100%;
  height: 100%;
}

.menu-toggle.open:checked ~ .menu-toggle.overlay {
  right: 0;
  position: fixed;
  z-index: 100;
}
```

The nav bar is kept to the right of the screen at all times. When the menu bar is toggled, a css selector applies a transform to bring out the navigation drawer with a neat animation using a css transition. Here, I set the animation time to 0.25s which feels appropriate. To the best of my knowledge, the menu must be a sibling of the radio button, but that may not be necessaary with newer combinators I haven't learned how to fully utilize yet. Something extra I do for my site is I offset the content with as well. This is why I have the radio buttons on the same level as the content. One other thing to note is this sidebar drawer is turned into a topnav with a media query, when the window is greater than 800px.

```html
<div class="nav-bar-container" id="ta_navbarContainer">
  <nav class="nav-bar">
    <!--Nav bar contents-->
  </nav>
</div>
```

```scss
.nav-bar .menu {
  right: 0;
  transform: translateX($nav-bar-width-plus-border);
  transition: transform 0.25s;
  position: fixed;
  width: $nav-bar-width;
  top: 0;
  height: 100vh;
  padding-top: $nav-bar-height;
  box-shadow:-4px -4px 18px -9px rgba(0,0,0,0.77);
}

.menu-toggle.open:checked ~ .nav-bar-container .nav-bar {
  transform: translate(0, -$nav-bar-height-plus-border);
}
```

Voila! You should have a functioning drawer!

## Enhancing with vanilla javascript

While we can definitely call it done here, there's another user experience trick we can add: gestures. On most of the apps on my phone, the drawer can be opened by swiping the edge of the screen, closed by swiping the drawer closed. This is pretty easy to implement in pure vanilla Javascript. First I'll paste the code, and then I'll go over it.

```javascript
function initDraggableDrawer() {
  const beginEvents = ["mousedown", "touchstart"];
  const releaseEvents = ["mouseup", "mouseleave", "touchend", "touchcancel"];
  const moveEvents = ["mousemove", "touchmove"];

  function addEventListeners(target, events, method, options) {
    for(let i of events) {
      target.addEventListener(i, method, options);
    }
  }

  function removeEventListeners(target, events, method) {
    for(let i of events) {
      target.removeEventListener(i, method);
    }
  }

  function getEventX(e) {
    if(e.targetTouches) {
      if(e.targetTouches[0]) {
        return e.targetTouches[0].clientX;
      } else {
        return lastX;
      }
    } else {
      return e.clientX;
    }
  }

  function getStyleTransformX(element) {
    let style = window.getComputedStyle(menu);
    return new DOMMatrixReadOnly(style.transform).m41;
  }

  function updateTransform(target, value) {
    if(value > 0) {
      value = 0;
    }
    let style = window.getComputedStyle(menu);
    let matrix = new DOMMatrix(style.transform);
    matrix.m41 = value;
    target.style.transform = matrix.toString();
  }

  function checkForDrawerOpenGesture(e) {
    if(document.body.clientWidth - getEventX(e) < 30) {
      prepareDrag(e);
    }
  }

  function addGestureEventListeners() {
    addEventListeners(menu, beginEvents, prepareDrag, {passive: true});
    addEventListeners(document, beginEvents, checkForDrawerOpenGesture, {passive: true});
  }

  function prepareDrag(e) {
    removeEventListeners(menu, beginEvents, prepareDrag);
    removeEventListeners(document, beginEvents, checkForDrawerOpenGesture);
    addEventListeners(document, moveEvents, drag, {passive: false});
    addEventListeners(document, releaseEvents, release, {once: true, passive: false});
    lastX = initialX = getEventX(e);
    transformStart = getStyleTransformX(menu);
    timeStart = new Date().getTime();
    dragged = false;
    updateTransform(menu, transformStart);
    menu.style.transition = "none";
  }

  function drag(e) {
    lastX = getEventX(e);
    let delta = initialX - lastX;
    let transformCurrent = transformStart - delta;
    if(dragged || Math.abs(delta) > 15) {
      dragged = true;
      if(e.cancelable) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    }
    updateTransform(menu, transformCurrent);
  }

  function release(e) {
    removeEventListeners(document, moveEvents, drag)
    addGestureEventListeners();
    menu.style.transform = menu.style.transition = null;
    if(dragged && e.cancelable) {
      e.preventDefault();
      e.stopImmediatePropagation()
    }
    /* Check that the user didn't potentially tap/click*/
    if(!dragged) return;
    var timeEnd = new Date().getTime(),
        diff = initialX - getEventX(e);
    // the logic in here is manually tuned for user experience
    if( /* Check if it is over half*/
      ((transformStart + diff) > -(menu.clientWidth/2)) ||
        /* Check if the user pulled fast and it's over 1/8 */
      (timeEnd - timeStart < 100 /*ms*/ && diff > (menu.clientWidth/8))
    ) {
      document.querySelector(".menu-toggle.open").checked = true;
    } else {
      document.querySelector(".menu-toggle.close").checked = true;
    }
    initialX = null;
  }

  let menu = document.getElementById("ta_hamburgerMenu"),
          initialX, lastX, transformStart, timeStart,
          dragged = false;
  addGestureEventListeners();
}
```

If you look at the bottom of the function, it gets the ta_hamburgerMenu element and calls addGestureEventListeners. The first event listener in addGestureEventListeners adds the event mouseDown and touchStart to the navigation drawer. If it is open, a drag gesture is initiated as long as the mouse is held down. The second event listener calls checkForDrawerOpenGesture, which initiates a drag gesture if the right 30 pixels of the screen were pressed.

Now let's look at the prepareDrag function. It starts by removing event listeners that were used to. When a drag gesture is finished, those event listeners are added back. This is to prevent this function from being called multiple times without using an extra state boolean. Then, it adds event listeners for dragging and for releasing the drag. Then it keeps track of the initial X position, the start time, and we set the boolean dragged to false, so micro drags caused by taps/clicks are not tracked. Finally, we stop the manual css transform by setting transition to "none" and manually setting the transform. A nice side-effect of this is if you were to release and restart a drag gesture, you can catch the transform mid-transition. That's why we are getting and setting the css transform manually in the getStyleTransformX and updateTransform functions.  The updateTransform function just does a check to make sure the drawer isn't dragged beyond its size and then updates the transform css property. The state of the transform is kept in css at all times.

The drag method, which is triggered on touch move or mouse move, does some calculations based on the mouse/touch positions to delta and the beginning of the transformation to determine the current transform position. The only other thing this does, is if the movement is less than 15 pixels, then we don't consider this a drag gesture at all, tracked by the "dragged" boolean. This is so users don't click a link, make a micro movement and have their click event cancelled. Finally, the transform is set.

The release method first resets the state by removing the movement event listeners (the release event listener is marked as "once"), adds back the event listeners for preparing a drag event and resets the inline styles for transition and transform. If a drag gesture was detected (at least 15px of movement), it then does a check to see if it should open or close. As noted, the logic was manually tuned: First, if the menu was pulled half-way open, it opens. Likewise, if it is pulled halfway closed, it closes.  The second part of the if statement checks for if the edge of the screen was rapidly swiped open.

## Bonus: Hamburger icon with animation

As a bonus, this is my hamburger icon. The three span elements are for a cute css animation. The hamburger icon turns into an X when the menu is toggled.

```html
<div class="hamburger semisticky" id="ta_hamburger">
    <span></span>
    <span></span>
    <span></span>
</div>
```

```scss
.hamburger {
    display: block;
    position: absolute;
    right: 18px;
    top: 18px;
    z-index: 400;
    transition: transform 0.25s;
}

.hamburger span {
    display: block;
    width: 20px;
    height: 1px;
    border-radius: 3px;
    margin-bottom: 5px;
}

.menu-toggle.open:checked ~ .hamburger span {
    transition: 0.5s;
}

.menu-toggle.open:checked ~ .hamburger span:nth-last-child(1) {
    transform: rotate(135deg) translate(-4.5px, 4.5px);
}

.menu-toggle.open:checked ~ .hamburger span:nth-last-child(3) {
    opacity: 0;
    transform: rotate(135deg) translate(-10px, 3px);
}

.menu-toggle.open:checked ~ .hamburger span:nth-last-child(2) {
    transform: rotate(-135deg)
}
```

