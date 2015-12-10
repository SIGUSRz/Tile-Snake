/* By sz1358 Shi Zeng */
function IO_Manager()
{
    this.events = {};
    //For Touch Screen Device
    if (window.navigator.msPointerEnabled)
    {
        //Internet Explorer 10 style
        this.eventTouchstart    = "MSPointerDown";
        this.eventTouchmove     = "MSPointerMove";
        this.eventTouchend      = "MSPointerUp";
    }
    else
    {
        this.eventTouchstart    = "touchstart";
        this.eventTouchmove     = "touchmove";
        this.eventTouchend      = "touchend";
    }
    this.listen();
}

IO_Manager.prototype.on = function (event, callback)
{
    if (!this.events[event])
    {
        this.events[event] = [];
    }
    this.events[event].push(callback);
};

//Pass event code to GConsole
IO_Manager.prototype.emit = function (event, data)
{
    var callbacks = this.events[event];
    if (callbacks)
    {
        callbacks.forEach(function (callback)
        {
            callback(data);
        });
    }
};

IO_Manager.prototype.listen = function ()
{
    var self = this;

    var map =
    {
        32: -1, //Turning
        38: 0, // Up
        39: 1, // Right
        40: 2, // Down
        37: 3, // Left
        75: 0, // Vim up
        76: 1, // Vim right
        74: 2, // Vim down
        72: 3, // Vim left
        87: 0, // W
        68: 1, // D
        83: 2, // S
        65: 3  // A
    };
    // 0: up, 1: right, 2: down, 3: left
    // 0: left, 1:up, 2: right, 3: down
    // Respond to direction keys

    var scrollTimer, lastScrollFireTime = 0;

    $(window).on('keyup', function(event)
    {

        var minScrollTime = 100;
        var now = new Date().getTime();

        function processScroll(map,event)
        {
            var mapped = map[event.which];
            if (mapped !== undefined)
            {
                event.preventDefault();
                self.emit("move", mapped);
            }
        }

        if (!scrollTimer)
        {
            if (now - lastScrollFireTime > minScrollTime)
            {
                //processScroll(map,event);   // fire immediately on first scroll
                scrollTimer = setTimeout(function()
                {
                    scrollTimer = null;
                    lastScrollFireTime = new Date().getTime();
                    processScroll(map,event);
                }, minScrollTime);
                lastScrollFireTime = now;
            }

        }
    });



    //// Respond to button presses
    //this.bindButtonPress(".retry-button", this.restart);
    //this.bindButtonPress(".restart-button", this.restart);
    //this.bindButtonPress(".keep-playing-button", this.keepPlaying);

    // Respond to swipe events
    //var touchStartClientX, touchStartClientY;
    //var gameContainer = $('#container');
    //
    //gameContainer.addEventListener(this.eventTouchstart, function (event)
    //{
    //    if ((!window.navigator.msPointerEnabled && event.touches.length > 1) ||
    //        event.targetTouches.length > 1)
    //    {
    //      return; // Ignore if touching with more than 1 finger
    //    }
    //    if (window.navigator.msPointerEnabled)
    //    {
    //        touchStartClientX = event.pageX;
    //        touchStartClientY = event.pageY;
    //    }
    //    else
    //    {
    //        touchStartClientX = event.touches[0].clientX;
    //        touchStartClientY = event.touches[0].clientY;
    //    }
    //    event.preventDefault();
    //});
    //
    //gameContainer.addEventListener(this.eventTouchmove, function (event)
    //{
    //    event.preventDefault();
    //});
    //
    //gameContainer.addEventListener(this.eventTouchend, function (event)
    //{
    //    if ((!window.navigator.msPointerEnabled && event.touches.length > 0) ||
    //        event.targetTouches.length > 0)
    //    {
    //        return; // Ignore if still touching with one or more fingers
    //    }
    //
    //    var touchEndClientX, touchEndClientY;
    //
    //    if (window.navigator.msPointerEnabled)
    //    {
    //        touchEndClientX = event.pageX;
    //        touchEndClientY = event.pageY;
    //    }
    //    else
    //    {
    //        touchEndClientX = event.changedTouches[0].clientX;
    //        touchEndClientY = event.changedTouches[0].clientY;
    //    }
    //
    //    var dx = touchEndClientX - touchStartClientX;
    //    var absDx = Math.abs(dx);
    //
    //    var dy = touchEndClientY - touchStartClientY;
    //    var absDy = Math.abs(dy);
    //
    //    if (Math.max(absDx, absDy) > 10)
    //    {
    //        // (right : left) : (down : up)
    //        self.emit("move", absDx > absDy ? (dx > 0 ? 1 : 3) : (dy > 0 ? 2 : 0));
    //    }
    //});
};

IO_Manager.prototype.restart = function (event)
{
    event.preventDefault();
    this.emit("restart");
};

IO_Manager.prototype.keepPlaying = function (event)
{
    event.preventDefault();
    this.emit("keepPlaying");
};

//IO_Manager.prototype.bindButtonPress = function (selector, fn)
//{
//    var button = document.querySelector(selector);
//    button.addEventListener("click", fn.bind(this));
//    button.addEventListener(this.eventTouchend, fn.bind(this));
//};
