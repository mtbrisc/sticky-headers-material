var print = true;

function init() {
  var i = 0;
  for (var i = 0; i < charArr.length; i++) {
    var letter = '<div class=\"large-letter\">' + charArr[i][0] + '</div>';
    var icon = '<div class=\"icon\"><img class=\"covering\" src=\"img/covering.png\"/><img src=\"img/' + charArr[i][1] + '.png\"/></div>';
    var content = '<div class=\"content\">' + icon + charArr[i][2] + '</div>';
    var combo = '<div class=\"print-group\">' + letter + content + '</div>';
    if (!print) {
      combo = '<a data-nth=\"' + i + '\" target=\"_blank\" href=\"' + charArr[i][3] + '\" ><div class=\"print-group\">' + letter + content + '</div></a>';
    }
    document.body.innerHTML += combo;
  }

}

function markComplete(el) {
  el.style.opacity = '.4';
  return false;
}
//['A', 'video',"",""],
//['B', 'scripture', "",""],
//['C', 'quote', "",""],
//['D', 'activity', "",""],
//['E', 'coloring',"",""],
//

window.addEventListener("load", function () {

  // does the actual opening
  function openWindow(event) {
    event = event || window.event;

    // find the url and title to set
    var href = this.getAttribute("href");
    var newTitle = this.getAttribute("data-title");
    var nthObj = this.getAttribute("data-nth");
    // or if you work the title out some other way...
    // var newTitle = "Some constant string";

    // open the window
    if (href === '#') {

    } else {
      var newWin = window.open(href, "_blank");

      // add a load listener to the window so that the title gets changed on page load
      newWin.addEventListener("load", function () {
        newWin.document.title = newTitle;
      });
    }
    var currentGroup = document.getElementsByClassName("print-group")[nthObj];
    currentGroup.classList.add('visited');
    var previousSelections = document.getElementsByClassName("selections")[0];
    if (previousSelections.innerText.indexOf(currentGroup.getElementsByClassName('large-letter')[0].innerHTML) === -1) {
      previousSelections.innerHTML += currentGroup.getElementsByClassName('large-letter')[0].innerHTML + '<br/>';
    }

    if (document.getElementsByClassName("visited").length === document.getElementsByClassName("print-group").length) {
      displaySuccess();
    }
    // stop the default `a` link or you will get 2 new windows!
    event.returnValue = false;
  }

  // find all a tags opening in a new window
  var links = document.querySelectorAll("a[target=_blank]");
  // or this if you don't want to store custom titles with each link
  //var links = document.querySelectorAll("a[target=_blank]");

  // add a click event for each so we can do our own thing
  for (var i = 0; i < links.length; i++) {
    links[i].addEventListener("click", openWindow.bind(links[i]));
  }

});


function displaySuccess() {
  alert("The last activity! After this, you finished all the activities!");
}
//
var charArr = [
  ['A', 'song', "<h3>Listen, Listen</h3>", "https://www.lds.org/music/library/childrens-songbook/listen-listen-round?lang=eng"],
  ['B', 'quote', "&ldquo;The gift of the Holy Ghost, if you consent, will guide and protect you and even correct your actions.&rdquo;<br/><span class=\"reference\">-President Boyd K. Packer</span>", "#"],
  ['C', 'activity', "<h3>Listening to the Still Small Voice</h3> Find the hidden object by listening to the quiet sounds, one class member goes out", "https://www.youtube.com/watch?v=1jWOfi5wA9Y"],
  ['D', 'coloring', "Coloring Activity - Laying on of hands", "#"],
  ['E', 'scripture', "Yea, behold, I will tell you in your mind and in your heart, by the Holy Ghost, which shall come upon you and which shall dwell in your heart.<span class=\"reference\">Doctrine & Covenants 8:2</span>", "#"],
  ['F', 'scripture', "[...] O God, the Eternal Father, that they are willing to take upon them the name of thy Son, and always remember him, and keep his commandments which he hath given them, that they may always have his Spirit to be with them. Amen.<span class=\"reference\">Moroni 4:3</span>", "#"],
  ['G', 'scripture', "But the fruit of the Spirit is love, joy, peace, longsuffering, gentleness, goodness, faith, Meekness, temperance: against such there is no law.<span class=\"reference\">Galatians 5:22-23</span>", "#"],
  ['H', 'scripture', "And now behold, I ask of you, my brethren of the church, have ye spiritually been born of God? Have ye received his image in your countenances? Have ye experienced this mighty change in your hearts?<span class=\"reference\">Alma 5:14</span>", "#"],
  ['I', 'video', "Receiving Revelation: Power of the Holy Spirit", "https://www.youtube.com/watch?v=s8B3FzWDsZ0"],
  ['J', 'song', "Let the Holy Spirit Guide", "https://www.youtube.com/watch?v=43S7PHhzs98"],
  ['K', 'question', "What is the gift of the Holy Ghost?", "#"],
  ['L', 'coloring', "Coloring Activity - Confirmation", "#"],
  ['M', 'video', "Feeling the Holy Ghost: Power of the Holy Spirit", "https://www.youtube.com/watch?v=xc6TQ0Ej-BY"],
  ['N', 'video', "Voice of the Spirit", "https://www.youtube.com/watch?v=VPbDZnrxBLM"],
  ['O', 'song', "I'm Trying to Be Like Jesus", "https://www.youtube.com/watch?v=mfHyksB6w2w"],
  ['P', 'question', "Why is it important to have the Holy Ghost?", "#"],
  ['Q', 'quote', "The Holy Ghost is the third member of the Godhead; He is a personage of spirit and bears witness of all truth. In the scriptures the Holy Ghost is referred to as the Comforter, a teacher, and a revelator.<span class=\"reference\">-David A. Bednar</span>", "#"],
  ['R', 'scripture', "And when ye shall receive these things, I would exhort you that ye would ask God, the Eternal Father, in the name of Christ, if these things are not true; and if ye shall ask with a sincere heart, with real intent, having faith in Christ, he will manifest the truth of it unto you, by the power of the Holy Ghost.<span class=\"reference\">Moroni 10:4</span>", "#"],
  ['S', 'scripture', " And by the power of the Holy Ghost ye may know the truth of all things.<span class=\"reference\">Moroni 10:5</span>", "#"],
  ['T', 'quote', "The Holy Ghost provides personal revelation to help us make major life decisions about such things as education, missions, careers, marriage, children, where we will live with our families, and so on.<span class=\"reference\">-Elder Robert D. Hales</span>", "#"],
  ['U', 'activity', "<h3>Telephone Game</h3>Sometimes the messages of the world can be confused. But having the Holy Ghost to guide us - we can know truth and right", "#"],
  ['V', 'activity', "Chalkboard - Guess what each picture means", "#"],
  ['W', 'quote', "Holy Ghost Acronym - Chalkboard", "#"],
  ['X', 'activity', "Story about telling friend that God loved him, prompted to tell him.", "#"],
  ['Y', 'question', "How do you keep the Holy Ghost with you?", "#"],
  ['Z', 'question', "What happens after we are baptized?", "#"],
  ['1', 'question', "What kinds of things can the Holy Ghost tell you?", "#"],
  ['2', 'activity', "Story of listening to the Spirit on my mission", "#"],
  ['3', 'question', "What's the best gift you've ever gotten? Holy Ghost as a gift.", "#"],
  ['4', 'activity', "Walking across side of Room. Listening to the still small voice", "#"],
  ['5', 'quote', "Story of Harold B. Lee", "https://www.lds.org/friend/2002/01/from-the-life-of-president-harold-b-lee?lang=eng"],
  ['6', 'activity', "Dry Erase Board", "#"],
  ['7', 'quote', "We receive a marvelous gift when we are baptized and confirmed. This is the gift of the Holy Ghost. The gift of the Holy Ghost is like the Liahona.<span class=\"reference\">Sandra Tanner and Cristina Franco</span>", "#"],
  ['8', 'activity', "Bubbles.  Explain that each bubble is filled with air. You can't see the air but you know it's there because it gives the bubble its shape. ", "#"]
];