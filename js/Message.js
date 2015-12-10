/* By sz1358 Shi Zeng */
//Constructor build message board
function Message()
{
    this.gameOver = document.createElement('div');
    this.gameOver.id= "gameOver";
    this.gameOver.innerHTML = "<br\><br\>Game Over";
    this.gameOver.innerHTML += "<p>Press <span>Space</span> to Restart</p>";
    $('#messageBoard').append(this.gameOver);
    var offset = $('#grid-container').offset();
    $('#gameOver').css(
        {
            'height': $('#grid-container').outerHeight()+'px',
            'width': $('#grid-container').outerWidth()+'px',
            '-webkit-transform':'translate('+offset.left+'px,'+offset.top+'px)',
            '-moz-transform':'translate('+offset.left+'px,'+offset.top+'px)',
            'transform':'translate('+offset.left+'px,'+offset.top+'px)'
        });

    this.deathFlash = document.createElement('div');
    this.deathFlash.id="deathFlash";
    this.deathFlash.innerHTML = '&nbsp;';//Do not make a new line
    $('#messageBoard').append(this.deathFlash);
    this.drawScore();
}

Message.prototype.die = function ()
{
    //Red flash when eat own body and die
    this.deathFlash.style.display = 'inline';
    this.deathFlash.style.opacity = .8;
    this.deathFlash.style.zIndex = 999999;
    var self=this;
    setTimeout(function()
    {
        //Hide the red flash
        self.flash=true;
        self.deathFlash.style.display = 'none';
        self.deathFlash.style.zIndex = 0;
    },30);
    //GameOver message appears
    $('#gameOver').css(
        {
            'opacity':0,
            'display':'block'
        }
    ).animate(
        {'opacity':1},600
    );
};

//Restart the game
Message.prototype.rebirth = function()
{
    $('#gameOver').css(
        {
            'display':'none'

        }
    );
};

//Draw the score display section in setup
Message.prototype.drawScore = function()
{
    var scoreContainer = document.createElement('div');
    scoreContainer.setAttribute("class",'score-container');
    scoreContainer.textContent=0;
    $('body').append(scoreContainer);
    var gridContainer = $('#grid-container');
    $('.score-container').css(
        {
            'left':gridContainer.offset().left+$('#grid-container').outerWidth()+50+'px',
            'top':gridContainer.offset().top+'px'
        }
    );
};
