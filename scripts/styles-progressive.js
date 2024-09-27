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
        var menu = document.getElementById("ta_hamburgerMenu"),
            initialEventX, lastX, transStart, timeStart, isDragging = false,
            dragged = false;
        menu.addEventListener("mousedown", start,
                              {passive: true});
        menu.addEventListener("touchstart", start,
                              {passive: true});
        document.addEventListener("mousedown", startDocument,
                                  {passive: true}, true);
        document.addEventListener("touchstart", startDocument,
                                  {passive: true}, true)
        function getX(e) {
            if(e.targetTouches) {
                if(e.targetTouches[0]) return e.targetTouches[0].clientX;
                else return lastX;
            } else return e.clientX;
        }
        function getY(e) {
            if(e.targetTouches) {
                if(e.targetTouches[0]) return e.targetTouches[0].clientY;
                else return lastY;
            } else return e.clientY;
        }
        function startDocument(e) {
            if(document.body.clientWidth - getX(e) < 30) {
                start(e);
            }
        }
        function start(e) {
            if(isDragging) return;
            isDragging = true;
            if(window.matchMedia &&
               !window.matchMedia("(max-width: 799px)").matches) return;
            document.addEventListener("mousemove", drag, {passive:false});
            document.addEventListener("touchmove", drag, {passive:false});
            document.addEventListener("mouseup", release, 
                                      {once: true, passive: false});
            document.addEventListener("mouseup", release,
                                      {once: true, passive: false});
            document.addEventListener("mouseleave", release,
                                      {once: true, passive: false});
            document.addEventListener("touchend", release,
                                      {once: true, passive: false});
            document.addEventListener("touchcancel", release,
                                      {once: true, passive: false});
            lastX = initialX = getX(e);
            var style = window.getComputedStyle(menu), parenIndex, pxIndex;
            transStart = style.transform;
            parenIndex = transStart.indexOf("matrix(");
            if(parenIndex > -1) {
                transStart =
                    -JSON.parse(
                    transStart.replace("matrix(","[")
                            .replace(")","]"))[4];
            } else transStart = 0;
            menu.style.transition = "none";
            timeStart = new Date().getTime();
            dragged = false;
        }
        function drag(e) {
            if(initialX == null) release();
            lastX = getX(e);
            var offset = initialX - lastX;
            var transCurrent = transStart+offset;
            var total = transCurrent - transStart;
            if(dragged || total < -15 || total > 15) {
                dragged = true;
                if(e.cancelable) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                }
            }
            if(transCurrent > 0) transCurrent = 0;
            if(menu.classList.contains("semisticky-scroll") &&
               !menu.classList.contains("semisticky-scroll-up")) {
                menu.style.transform = "translate("+-transCurrent+"px, -52px)";
            } else {
                menu.style.transform = "translateX("+-transCurrent+"px)";
            }
        }
        // the logic in here is manually tuned for user experienceyg
        function release(e) {
            if(dragged && e.cancelable) e.preventDefault();
            if(!e.cancelable) console.log(e);
            if(!isDragging) return;
            isDragging = false;
            menu.style.transform = null;
            menu.style.transition = null;
            document.removeEventListener("mousemove", drag);
            document.removeEventListener("touchmove", drag);
            document.removeEventListener("mouseup", release);
            document.removeEventListener("mouseleave", release);
            document.removeEventListener("touchend", release);
            document.removeEventListener("touchcancel", release);
            /* Check that the user didn't potentially click the open*/
            if(!dragged) return;
            var timeEnd = new Date().getTime(),
                diff = initialX - getX(e);
            if( /* Check if it is over half*/
                ((transStart + diff) > -120) ||
                    /* Check if the user pulled fast and it's over 1/8 */
                (timeEnd - timeStart < 100 /*ms*/ && diff > 30)
            ) {
                document.querySelector(".menu-toggle.open").click();
            } else document.querySelector(".menu-toggle.close").click();
            initialX = null;
        }
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
