// @license magnet:?xt=urn:btih:d3d9a9a6595521f9666a5e94cc830dab83b65699&dn=expat.txt Expat / MIT license
// Nav bar stuff
(function() {
	if (document.readyState!='loading') {
		init();
	} else {
		document.addEventListener('DOMContentLoaded', init);
	}

	function init() {
		initDraggableDrawer();
		initSemiStickyHeader();
		initStrayKitty();
	}

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

		function checkForDrawerOpenGesture(e) {
			if(document.body.clientWidth - getEventX(e) < 30) {
				prepareDrag(e);
			}
		}

		function addGestureEventListeners() {
			addEventListeners(menu, beginEvents, prepareDrag, {passive: true});
			addEventListeners(document, beginEvents, checkForDrawerOpenGesture, {passive: true});
		}

		function updateTransform(target, value) {
			if(value < 0) {
				value = 0;
			}
			let style = window.getComputedStyle(menu);
			let matrix = new DOMMatrix(style.transform);
			matrix.m41 = value;
			target.style.transform = matrix.toString();
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

	function initSemiStickyHeader() {
		const elements = document.getElementsByClassName("semisticky");
		let lastScrollY = window.scrollY;

		if(elements == null) return;
		document.addEventListener("scroll", (e) => {
			for(let i = 0; i < elements.length; i++) {
				if(window.scrollY > 156) {
					elements[i].classList.add("semisticky-scroll");
					if(lastScrollY > window.scrollY) {
						elements[i].classList.add("semisticky-scroll-up");
					} else {
						elements[i].classList.remove("semisticky-scroll-up");
					}
				} else {
					elements[i].classList.remove("semisticky-scroll");
					elements[i].classList.remove("semisticky-scroll-up");
				}
			}
			lastScrollY = window.scrollY;
		}, {passive: true});
	}

	function initStrayKitty() {
		if(window.StrayKittyManager == null) {
			setTimeout(initStrayKitty, 100);
			return;
		}
		let el = document.getElementById("straykitty");
		let manager = null;
		if(el) {
			el.onclick = function(e) {
				e.preventDefault();
				if(manager == null) {
					manager = new StrayKittyManager(60);
				}
				manager.start();
				manager.addKitty();
			}
		}
	}
})();
// @license-end
