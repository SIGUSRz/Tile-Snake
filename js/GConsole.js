/**
 * Created by Zeng on 2015/11/20.
 */
//The logic manager system in game
function GConsole(size,Painter,IO_Manager,Message)
{
    this.inputManager = new IO_Manager();
    //this.scoreManager = new ScoreManager;
    this.painter     = new Painter();
    this.size=size;
    //Call looper to deal with
    this.inputManager.on("move", this.looper.bind(this));
    this.setup();
    this.message = new Message();
}

//Set up information
GConsole.prototype.setup = function()
{
    //First time in game: Set up container and message element
    if(this.over===undefined)
    {
        this.board = document.createElement('div');
        this.board.id="container";
        $('body').append(this.board);
        this.messageBoard = document.createElement('div');
        this.messageBoard.id="messageBoard";
        $('body').append(this.messageBoard);
    }
    //Restarting game
    else
    {
        this.clearTiles();
        $('#tile-container').empty();
    }
    this.grid        = new Grid(this.size);//Store the grid
    this.score       = 0;
    this.over        = false;//Check if game is end
    this.snake = [];//Store the body tiles of snake
    this.food = null;//Manage the food tile
    this.currentDirection = null;//Receive direction from input
    this.timer = null;//Manage the refresh SetInterval function
    this.initialSnake();
    this.paint();

};
//Keep running as the main function
//Called when key released and get direction from IO_Manager
GConsole.prototype.looper = function(direction)
{
    // 0: up, 1: right, 2: down, 3: left
    if(this.currentDirection===direction || (this.currentDirection+2)%4===direction)
    {
        return;//Do nothing if input is the same or opposite direction
    }
    if(this.over)
    {
        //Restarting game
        if(direction===-1)
        {
            this.over=true;
            this.setup();
            this.message.rebirth();
        }
        return;
    }
    //When space is pressed
    if(direction===-1)
    {
        //Switching head and tail
        if(this.currentDirection!==null)
        {
            //Reversing the body
            for(var i=0;i<this.snake.length/2;i++)
            {
                var temp = this.snake[i];
                this.snake[i]=this.snake[this.snake.length-1-i];
                this.snake[this.snake.length-1-i]=temp;
            }
            //Switching the head and tail tile
            this.snake[0].value=0;
            this.snake[this.snake.length-1].value=1;
            //Calculating the new direction
            //Have to check if the new head is at the edge of the grid
            var x = Math.abs(this.snake[0].x-this.snake[1].x)>1 ?
                (this.snake[0].x-this.snake[1].x)/(1-this.size) :
                (this.snake[0].x-this.snake[1].x);
            var y =  Math.abs(this.snake[0].y-this.snake[1].y)>1 ?
                (this.snake[0].y-this.snake[1].y)/(1-this.size) :
                (this.snake[0].y-this.snake[1].y);
            var reverseMap =
            {
                "0-1":0,
                "10":1,
                "01":2,
                "-10":3
            };
            this.currentDirection = reverseMap[""+x+y];
        }
        else
        {
            //When snake isn't moving and space is pressed
            //Do nothing
            return;
        }
    }
    else
    {
        //simply change the direction
        this.currentDirection=direction;
    }
    var self = this;

    if(self.timer!==null)
    {
        clearInterval(self.timer);
    }
    //Start to looping on and keep moving the snake
    self.move(self.currentDirection);
    self.timer = setInterval(function()
    {
        self.move(self.currentDirection);
    },250);
};

//Pass attributes to HTML_Painter to draw on HTML
GConsole.prototype.paint = function()
{
    this.painter.actuate(this.grid, this.snake, {
        score:      this.score,
        over:       this.over,
        food:       this.food,
        direction:  this.currentDirection
    });
};

//Build head and tail tile at the beginning
GConsole.prototype.initialSnake = function()
{
    var head = new Tile(this.grid.getCentre()[0],0);
    var tail = new Tile(this.grid.getCentre()[1],1);
    this.snake.push(head);
    this.snake.push(tail);
    this.grid.insertTile(head);
    this.grid.insertTile(tail);
};

// Adds a tile in a random position
GConsole.prototype.addFood = function()
{
    if (this.grid.getEmptyCells())
    {
        var rand=Math.random();
        var value = 0;
        if(rand<0.2)
        {
            value=8;
        }
        else if(rand<0.6)
        {
            value=4;
        }
        else
        {
            value=2;
        }

        var tile = new Tile(this.grid.randomEmptyCell(), value);
        tile.foodMark = 0;
        this.food = tile;
        this.grid.insertTile(tile);
    }
};

//Remove tiles from grid and remove merger info
GConsole.prototype.clearTiles = function ()
{
    for(var i=this.snake.length-1;i>=0;i--)
    {
        if (this.snake[i])
        {
            this.snake[i].mergedFrom = null;
            this.grid.removeTile(this.snake[i]);
        }
    }
};

//Update tile information in grid
GConsole.prototype.updateGrid=function()
{
    for(var i=this.snake.length-1;i>=0;i--)
    {
        this.grid.insertTile(this.snake[i]);
    }
};

//Calculate new position of tiles
GConsole.prototype.move = function (direction)
{
    // 0: up, 1: right, 2: down, 3: left
    var self = this;
    if (self.over)
        return; // Don't do anything if the game's over
    var vector = self.getVector(direction);
    this.clearTiles();

    // Save the current tile positions and remove merger information
    var newHead = this.moveHead(vector);
    if(newHead === null || newHead === undefined)
    {
        clearInterval(this.timer);
        this.over=true;
        this.message.die();
        return;
    }
    //The snake head encounters the food
    if(self.food!==null && self.positionsEqual(self.snake[0],self.food))
    {
        self.score+=self.food.value;
        var head,merged;
        //The body shrinks, the food merges into second tile
        if(this.snake[1].value === this.food.value)
        {
            var remainPointer=1;
            var sum=this.food.value;
            //Check how many tiles in body has been merged
            while(remainPointer<this.snake.length-1)
            {
                sum+=this.snake[remainPointer].value;
                if(sum!==this.snake[remainPointer+1].value)
                {
                    break;
                }
                remainPointer++;
            }
            //Pop and store head tile
            head = this.snake.shift();//index decrease 1
            //Only refresh remaining tiles
            for(var i=this.snake.length-1;i>=remainPointer;i--)
            {
                this.snake[i].updatePosition({x:this.snake[i-remainPointer].x,
                    y:this.snake[i-remainPointer].y});
            }
            //Remove all the merging tiles from snake body
            while(remainPointer>0)
            {
                this.snake.shift();
                remainPointer--;
            }
            //Create new merged tile, always at second position of snake
            merged = new Tile({x:this.food.x,y:this.food.y},sum);
            merged.mergedFrom = [direction,{x:this.food.x,y:this.food.y}];
            self.grid.removeTile(this.food);
            this.food=null;
            this.snake.unshift(merged);
            this.snake.unshift(head);
            this.snake[0].updatePosition(newHead);
        }
        //The body prolongs
        else
        {
            head = self.snake.shift();//index decrease 1
            head.updatePosition(newHead);
            for(var i=0;i<self.snake.length;i++)
            {
                self.snake[i].updatePosition({x:self.snake[i].x,y:self.snake[i].y});
            }
            //No merging happens simply add a new tile
            merged =new Tile({x:self.food.x,y:self.food.y},self.food.value);
            merged.foodMark = 2;
            self.grid.removeTile(self.food);
            self.snake.unshift(merged);
            self.snake.unshift(head);
            self.snake[1].previousPosition = {x:self.snake[2].x,y:self.snake[2].y};
            self.food=null;
        }
    }
    //The snake is not eating food but moving
    else
    {
        var nextCell;
        for(var i=this.snake.length-1;i>0;i--)
        {
            nextCell = {x:this.snake[i-1].x,y:this.snake[i-1].y};
            this.snake[i].updatePosition(nextCell);
        }
        this.snake[0].updatePosition(newHead);
    }
    self.updateGrid();
    if(this.food===null)
    {
        this.addFood();
    }
    if(!this.over)
    {
        this.paint();//Paint new position in HTML_Painter
    }
    else
    {
        clearInterval(this.timer);
        this.message.die();//Out put end game message
    }
};

//Calculating the next position of head
//If it eats own body it dies and terminate the game
GConsole.prototype.moveHead = function(vector)
{
    if(!vector)
    {
        return;
    }
    var next = {x:(this.snake[0].x+vector.x+this.size)%this.size,
        y:(this.snake[0].y+vector.y+this.size)%this.size};
    for(var i=1;i<this.snake.length;i++)
    {
        if(this.positionsEqual(this.snake[0],this.snake[i]))
        {
            this.over = true;
            return null;
        }
    }
    return next;
};

//Converting currentDirection into vector
GConsole.prototype.getVector = function (direction)
{
    // Vectors representing tile movement
    // 0: up, 1: right, 2: down, 3: left
    var map =
    {
        0: { x: 0,  y: -1 },
        1: { x: 1,  y: 0 },
        2: { x: 0,  y: 1 },
        3: { x: -1, y: 0 }
    };
    return map[direction];
};

//Check if one tile hits another tile
GConsole.prototype.positionsEqual = function (first, second)
{
    return first.x === second.x && first.y === second.y;
};