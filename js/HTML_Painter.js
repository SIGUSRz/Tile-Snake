/* By sz1358 Shi Zeng */
function HTML_Painter()
{
    this.toMove=false;
    this.score = 0;
}

//Receive parameters from GConsole in metadata and start paint
HTML_Painter.prototype.actuate = function (grid, snakeBody,metadata)
{
    var self = this;
    //Clear all the existing tile
    //All the tile have to be recreated in html
    $('#tile-container').empty();
    self.addTile(metadata.food);
    for(var i=0;i<snakeBody.length;i++)
    {
        self.processTile(snakeBody[i],metadata.direction);
    }
    this.updateScore(metadata.score);
    this.toMove=false;
};

//Move the painted tiles to the right css position on html
HTML_Painter.prototype.processTile = function (tile,direction)
{
    if(tile===null)
    {
        return;
    }
    var self = this;
    var position  = tile.previousPosition || { x: tile.x, y: tile.y };
    
    self.addTile(tile);

    var nextID = "#cell_"+tile.x+"-"+tile.y;
    var offset = $(nextID).offset();
    if(this.toMove)//Check if it is required to move
    {
        //Check if it's head and it's turning
        //When turning rotate the head
        if(tile.value===0)
        {
            //NOTE!!! Move the tile from old position to next position
            if(direction%2!==0)
            {
                $('.tile-0').css(
                    {
                        '-webkit-transform':'translate('+offset.left+'px,'+offset.top+'px) rotate(90deg)',
                        '-moz-transform':'translate('+offset.left+'px,'+offset.top+'px) rotate(90deg)',
                        'transform':'translate('+offset.left+'px,'+offset.top+'px) rotate(90deg)'
                    });
            }
            else
            {
                $('.tile-0').css(
                    {
                        '-webkit-transform':'translate('+offset.left+'px,'+offset.top+'px)',
                        '-moz-transform':'translate('+offset.left+'px,'+offset.top+'px)',
                        'transform':'translate('+offset.left+'px,'+offset.top+'px)'
                    });
            }
            $('.tile-0').addClass('tile_'+tile.x+'-'+tile.y);
            $('.tile-0').removeClass('tile_'+position.x+'-'+position.y);
            $('.tile-0').removeClass('tile-new');
        }
        else if(tile.value===1)
        {
            $('.tile-1').css(
                {
                    '-webkit-transform':'translate('+offset.left+'px,'+offset.top+'px)',
                    '-moz-transform':'translate('+offset.left+'px,'+offset.top+'px)',
                    'transform':'translate('+offset.left+'px,'+offset.top+'px)'
                });
            //Update the new position
            $('.tile-1').addClass('tile_'+tile.x+'-'+tile.y);
            $('.tile-1').removeClass('tile_'+position.x+'-'+position.y);
            $('.tile-1').removeClass('tile-new');
        }
        else
        {
            //NOTE!!! Move the tile from old position to next position
            $('.tile_'+position.x+'-'+position.y).css(
                {
                    '-webkit-transform':'translate('+offset.left+'px,'+offset.top+'px)',
                    '-moz-transform':'translate('+offset.left+'px,'+offset.top+'px)',
                    'transform':'translate('+offset.left+'px,'+offset.top+'px)'
                });
            $('.tile_'+position.x+'-'+position.y).addClass('tile_'+tile.x+'-'+tile.y);
            $('.tile_'+tile.x+'-'+tile.y).removeClass('tile_'+position.x+'-'+position.y);
            $('.tile_'+tile.x+'-'+tile.y).removeClass('tile-new');
        }

        //The move of the snake body is completed.
    }
};

//Create a new tile element in html
HTML_Painter.prototype.addTile = function(tile)
{
    if(tile===null)
    {
        return;
    }
    var wrapper   = document.createElement("div");
    var inner     = document.createElement("div");

    var position  = tile.previousPosition || { x: tile.x, y: tile.y };
    var positionInfo = this.getPosition(position);

    // We can't use classlist because it somehow glitches when replacing classes
    var classes = ["tile","tile_"+position.x+"-"+position.y];
    //Set the value of the tile
    if (tile.value > 2048)
    {
        classes.push("tile-super");
    }
    else
    {
        classes.push("tile-"+tile.value);
    }
    inner.classList.add("tile-inner");
    if(tile.value===0)
    {
        inner.textContent = "· ·"
    }
    else if(tile.value===1)
    {
        inner.textContent = " . ";
    }
    else
    {
        inner.textContent = tile.value
    }

    //If having previous position it is a snake body
    if(tile.previousPosition)
    {
        this.toMove = !this.positionsEqual(tile,tile.previousPosition);
        positionInfo = this.getTranslatePosition({ x: tile.x, y: tile.y });
    }
    //If having merging info it is a new tile created
    //by food eating and body merging
    else if (tile.mergedFrom)
    {
        classes.push("tile-merged");
        tile.foodMark=null;
        this.toMove=false;
        positionInfo = this.getTranslatePosition({ x: tile.x, y: tile.y });
    }
    //the tile is a food
    else if(tile.foodMark===1)
    {
        this.toMove=false;
        positionInfo = this.getTranslatePosition({ x: tile.x, y: tile.y });
    }
    //The tile hasn't appeared in html yet
    //This branch gives new tile css animation
    else
    {
        //If it's a new food make it become a food
        if(tile.foodMark===0)
        {
            classes.push("food");
            tile.foodMark = 1;
        }
        //css animation class
        classes.push("tile-new");
        positionInfo = this.getTranslatePosition({ x: tile.x, y: tile.y });
        this.toMove=false;
    }
    this.applyClasses(wrapper,classes,positionInfo);

    // Add the inner part of the tile to the wrapper
    wrapper.appendChild(inner);
    $('#tile-container').append(wrapper);
};

//Use cell coordinate to locate a tile
HTML_Painter.prototype.getTranslatePosition = function (position)
{
    var IDcode = "#cell_"+position.x+"-"+position.y;
    var offset = $(IDcode).offset();
    //The returning string is used in applyClasses function
    return "translate("+offset.left+"px,"+offset.top+"px)";
};

HTML_Painter.prototype.getPosition = function (position)
{
    var IDcode = "#cell_"+position.x+"-"+position.y;
    var offset = $(IDcode).offset();
    return {x:offset.left,y:offset.top};
};
HTML_Painter.prototype.applyClasses = function (element, classes,positionInfo)
{
    element.setAttribute("class", classes.join(" "));
    //Put the tile in corresponding position in grid
    //NOTE!!! that the position is still the old position
    element.style.webkitTransform = positionInfo;
    element.style.mozTransform = positionInfo;
    element.style.transform = positionInfo;
};
HTML_Painter.prototype.positionsEqual = function (first, second)
{
    return first.x === second.x && first.y === second.y;
};

//Update score and apply css animation
HTML_Painter.prototype.updateScore = function (score)
{
    var container=$('.score-container');
    if(score===0)
    {
        container.text(""+0);
        this.score=0;
        $('.score-addition').remove();
    }
    var difference = score - this.score;
    $('.score-addition').remove();
    if (difference > 0)
    {
        this.score = score;
        container.text(""+this.score);
        var addition = document.createElement("div");
        addition.setAttribute("class",'score-addition');
        addition.textContent = "+" + difference;
        container.append(addition);
    }
};