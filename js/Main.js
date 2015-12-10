/* By sz1358 Shi Zeng */
var windowWidth = 768;
var windowHeight = 920;
var size=11;

var requestFrame = function (x) { window.setTimeout(x, 1000 / 60); };
// Firefox 23 / IE 10 / Chrome / Safari 7 (incl. iOS)
if (window.requestAnimationFrame)
    requestFrame = window.requestAnimationFrame;
// Firefox < 23
else if(window.mozRequestAnimationFrame)
    requestFrame = window.mozRequestAnimationFrame;
// Older versions of Safari / Chrome
else if (window.webkitRequestAnimationFrame)
    requestFrame = window.webkitRequestAnimationFrame;

var game=null;
// Wait till the browser is ready to render the game (avoids glitches)
window.requestAnimationFrame(function ()
{
    //Boot the game
    game = new GConsole(size,HTML_Painter,IO_Manager,Message);
});
