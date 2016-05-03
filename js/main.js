var checking = true;
var a = document.getElementsByTagName('section');
var direction = -1;
var lastScrollPosition = 0;
var headerHeight = 0;
var cachedMenuObjHeight = 0;
var menuObj = document.getElementsByClassName('menu-bar')[0];
document.body.scrollTop = document.documentElement.scrollTop = 0;
// setInterval(function () {
//   getCurrentSection();
// }, 50);

var last_known_scroll_position = 0;
var ticking = false;

var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
var android = navigator.userAgent.toLowerCase().indexOf("android") > -1;
var mobile = android || iOS;

function doSomething(scroll_pos) {
  getCurrentSection(); // do something with the scroll position
}
window.addEventListener('scroll', function (e) {
  last_known_scroll_position = window.scrollY;
  if (!ticking) {
    window.requestAnimationFrame(function () {
      if (!iOS) {
        getCurrentSection();
      }
      ticking = false;
    });
  }
  ticking = true;
});
var currentSection = 0;
var timer = null;
window.addEventListener('scroll', function() {
    if(timer !== null) {
        clearTimeout(timer);        
    }
    timer = setTimeout(function() {
      var stringImage = '../img/output_XBGKZ8.gif';
      var newImage =  stringImage.replace(/\?.*$/,"")+"?x="+Math.random();
      document.getElementsByClassName('name')[0].style.cssText = "background-image:url("+newImage+")";
    }, 150);
}, false);

function init() {
  cachedMenuObjHeight = menuObj.getBoundingClientRect().bottom - menuObj.getBoundingClientRect().top;
  headerHeight = document.getElementsByClassName('fixed')[0].getBoundingClientRect().bottom - document.getElementsByClassName('fixed')[0].getBoundingClientRect().top;
  getCurrentSection();
  // document.addEventListener("scroll", function () {
  //   if (checking) {
  //     getCurrentSection();
  //   } else {
  //     return;
  //   }
  // });
  var navItems = document.getElementsByClassName('nav');
  document.getElementsByClassName('menu')[0].addEventListener("click", function () {
    toggleActiveClass(document.getElementsByClassName('menu-wrapper')[0]);
    for (var i = 0; i < navItems.length; i++) {
      toggleActiveClass(navItems[i]);
    }
  });
  for (var i = 0; i < navItems.length; i++) {
    addScrollAnimation(navItems[i], 'section-' + (i + 1), document.getElementById('section-' + (i + 1)).getBoundingClientRect().top - document.getElementsByClassName('menu-bar')[0].getBoundingClientRect().bottom + 1);
  }
  var typingObjects = document.getElementsByClassName('type-me');
  for (var i = 0; i < typingObjects.length; i++) {
    var text = typingObjects[i].innerHTML;
    typeWriter(text, 0, typingObjects[i]);
  }
  if (iOS) {
    var section = document.getElementsByClassName('title-text');
    for (var i = 0; i < section.length; i++) {
      console.log(section[i]);
      section[i].style.cssText = "margin:0;padding:0;text-align:right;background-image:none;width:90vw";
    }
    document.getElementsByClassName('menu-bar')[0].style.cssText = "width:60px";
  }
  if(!mobile){
    setTimeout(function(){
      document.getElementsByClassName('instruction-text')[0].style.cssText = "opacity:1";
    },400);
    setTimeout(function(){
      document.getElementsByClassName('instruction-text')[0].style.cssText = "opacity:0";
    },4400);
  }
  setTimeout(function(){
    document.getElementsByClassName('loading-cover')[0].style.cssText = "opacity:0";
  },1100);

  var cardObjects = document.getElementsByClassName('card');
  for (var i = 0; i < cardObjects.length; i++) {
    attachFullscreenEvent(cardObjects[i]);
  }
  // if(!mobile){
  //   setTimeout(function(){
  //     document.getElementsByClassName('instruction-text')[0].style.cssText = "top:-20px;opacity:0";
  //   },10000);
  // }
  // document.getElementById('flashContent').addEventListener('click',function(){
  //   alert('stuff');
  // });
}

function attachFullscreenEvent(el){
  el.addEventListener('click',function(){
    //el.parentElement.innerHTML ="<div class=\"card\">POOOOOOOP</div>"+el.parentElement.innerHTML;
    // toggleClassCustom(el,'active');
    // scrollTo(document.body, 0, 0);
    // scrollTo(document.body, el.getBoundingClientRect().top, 300);
    // toggleClassCustom(document.body,'lock-scroll');
    // toggleClassCustom(document.getElementsByTagName('html')[0],'lock-scroll');
  });
}

// window.addEventListener("resize", function () {
//   scrollTo(document.body, 0, 0);
//   getCurrentSection();
// });

function addScrollAnimation(el, targetId, offset) {
  el.addEventListener("click", function () {
    //scrollTo(document.body, offset, 600);
    // var stringImage = '../img/output_XBGKZ8.gif';
    // var newImage =  stringImage.replace(/\?.*$/,"")+"?x="+Math.random();
    // document.getElementsByClassName('name')[0].style.cssText = "background-image:url("+newImage+")";
    bringIntoView(document.querySelector('#' + targetId), 2400);
    toggleActiveClass(document.getElementsByClassName('menu-wrapper')[0]);
    if (mobile) {
      var navItems = document.getElementsByClassName('nav');
      for (var i = 0; i < navItems.length; i++) {
        toggleActiveClass(navItems[i]);
      }
    }
    //document.getElementById(targetId).scrollIntoView();
  }, false);
}

function toggleActiveClass(el) {
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
  if (a[0].getBoundingClientRect().top < menuObj.getBoundingClientRect().bottom - menuObj.getBoundingClientRect().top) {
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
    if (currObjCachedRectBottom < (Math.abs(document.getElementsByClassName('fixed')[0].getBoundingClientRect().bottom - document.getElementsByClassName('fixed')[0].getBoundingClientRect().top) + menuObjBottom)) {
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

function toggleClassCustom(el, classToToggle){
  if (el.classList.contains(classToToggle)) {
    el.classList.remove(classToToggle);
  } else {
    el.classList.add(classToToggle);
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
function typeWriter(text, n, obj) {
  if (n < (text.length)) {
    obj.innerHTML = text.substring(0, n + 1);
    n++;
    setTimeout(function () {
      typeWriter(text, n, obj);
    }, 10);
  }
}

/*
  idea from: http://stackoverflow.com/questions/12102118/scrollintoview-animation
*/
window.bringIntoView_started = 0;
window.bringIntoView_ends = 0;
window.bringIntoView_y = 0;
window.bringIntoView_tick = function () {
  var distanceLeft, dt, duration, t, travel;
  t = Date.now();
  if (t < window.bringIntoView_ends) {
    dt = t - window.bringIntoView_started;
    duration = window.bringIntoView_ends - window.bringIntoView_started;
    distanceLeft = window.bringIntoView_y - document.body.scrollTop;
    travel = distanceLeft * (dt / duration);
    document.body.scrollTop += travel;
    window.requestAnimationFrame(window.bringIntoView_tick);
  } else {
    document.body.scrollTop = window.bringIntoView_y;
  }
};
window.bringIntoView = function (e, duration) {
  window.bringIntoView_started = Date.now();
  window.bringIntoView_ends = window.bringIntoView_started + duration;
  window.bringIntoView_y = Math.min(document.body.scrollTop + e.getBoundingClientRect().top, document.body.scrollHeight - window.innerHeight);
  window.requestAnimationFrame(window.bringIntoView_tick);
};