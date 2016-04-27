var checking = true;
var a = document.getElementsByTagName('section');
var direction = -1;
var lastScrollPosition = 0;
var headerHeight = 0;
var cachedMenuObjHeight = 0;
var menuObj = document.getElementsByClassName('menu-bar')[0];

function init() {
  cachedMenuObjHeight = menuObj.getBoundingClientRect().bottom - menuObj.getBoundingClientRect().top;
  headerHeight = document.getElementsByClassName('fixed')[0].getBoundingClientRect().bottom -
    document.getElementsByClassName('fixed')[0].getBoundingClientRect().top;
  getCurrentSection();
  document.addEventListener("scroll", function () {
    if (checking) {
      getCurrentSection();
    } else {
      return;
    }
  });
  var navItems = document.getElementsByClassName('nav');
  document.getElementsByClassName('menu')[0].addEventListener("click", function () {
    for (var i = 0; i < navItems.length; i++) {
      toggleActiveMenuItem(navItems[i]);
    }
  });
  for (var i = 0; i < navItems.length; i++) {
    addScrollAnimation(navItems[i], 'section-' + (i + 1), document.getElementById('section-' + (i + 1)).getBoundingClientRect().top - document.body.getBoundingClientRect().top - document.getElementsByClassName('menu-bar')[0].getBoundingClientRect().bottom + 1);
  }
  var text = document.getElementById('type-me').getAttribute("data-text");
  typeWriter(text, 0);
}

function addScrollAnimation(el, targetId, offset) {
  el.addEventListener("click", function () {
    scrollTo(document.body, offset, 600);
  }, false);
}

function toggleActiveMenuItem(el) {
  if (el.classList.contains('active')) {
    removeClassCustom(el, 'active');
  } else {
    addClassCustom(el, 'active');
  }

}

function isin(n, a) {
  for (var i = 0; i < a.length; i++) {
    if (a[i] == n) {
      return true;
    }
  }
  return false;
}

function getCurrentSection() {
  var currentSection = -1;
  var menuObjBottom = menuObj.getBoundingClientRect().bottom;
  if (a[0].getBoundingClientRect().top < cachedMenuObjHeight) {
    addClassCustom(menuObj, 'compact');
  } else {
    removeClassCustom(menuObj, 'compact');
  }
  var index;
  for (index = 0; index < a.length; index++) {
    var currObj = a[index];
    var currObjCachedRect = currObj.getBoundingClientRect();
    var currObjCachedRectBottom = currObjCachedRect.bottom;
    var currObjCachedRectTop = currObjCachedRect.top;
    //addClassCustom(currObj, 'active');
    if (currObjCachedRectBottom > menuObjBottom &&
      currObjCachedRectTop <= menuObjBottom) {
      currentSection = index;
    }
    if (currObjCachedRectBottom < (headerHeight + menuObjBottom)) {
      currentSection = -1;
    }
    if (currObjCachedRectTop > menuObjBottom) {
      removeClassCustom(currObj, 'above');
      addClassCustom(currObj, 'below');
    } else {
      removeClassCustom(currObj, 'below');
      addClassCustom(currObj, 'above');
    }
  }
  if (currentSection !== -1) {
    activateFixed(a[currentSection]);
  }
}

function activateFixed(obj) {
  removeClassCustom(obj, 'above');
  removeClassCustom(obj, 'below');
  addClassCustom(obj, 'active');
}

Array.min = function (array) {
  return Math.min.apply(Math, array);
};

function addClassCustom(el, classToAdd) {
  if (!el.classList.contains(classToAdd)) {
    el.classList.add(classToAdd);
  }
}

function removeClassCustom(el, classToAdd) {
  if (el.classList.contains(classToAdd)) {
    el.classList.remove(classToAdd);
  }
}
/* 
  idea from: http://stackoverflow.com/questions/8917921/cross-browser-javascript-not-jquery-scroll-to-top-animation
*/

function scrollTo(element, to, duration) {
  if (duration <= 0) return;
  var difference = to - element.scrollTop;
  var perTick = difference / duration * 10;

  setTimeout(function () {
    element.scrollTop = element.scrollTop + perTick;
    if (element.scrollTop == to) return;
    scrollTo(element, to, duration - 10);
  }, 10);
}

/*
  idea from: http://codepen.io/voronianski/pen/aicwk
*/
function typeWriter(text, n) {
  console.log(text);
  if (n < (text.length)) {
    document.getElementById('type-me').innerHTML = text.substring(0, n + 1);
    n++;
    setTimeout(function () {
      typeWriter(text, n)
    }, 70);
  }
}