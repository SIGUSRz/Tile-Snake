/**
 * Created by Zeng on 2015/11/15.
 */
function Grid(size)
{
    this.size = size;
    this.len=45+5;
    this.cells = [];
    if(document.getElementById("grid-container")!==null)
    {
        this.cells=this.rebuild();
    }
    else
    {
        this.cells=this.build();
    }
}

//Draw grid element in html and build grid array
Grid.prototype.build = function ()
{
    var cells=[];
    var div=document.createElement('div');
    div.id='grid-container';
    $('#container').append(div);
    //Painting the grid
    $('#grid-container').width(this.len*this.size+'px');
    for (var y = 0; y < this.size; y++)
    {
        $('#grid-container').append('<div class="grid-row" id="grid-row'+y+'"></div>');
        $('#grid-row'+y).width(this.len*this.size+'px');
        var row = cells[y] = [];
        for (var x = 0; x < this.size; x++)
        {
            $('#grid-row'+y).append("<div class='grid-cell' id='cell_"+x+"-"+y+"'></div>");
            row.push(null);
        }
    }
    var div=document.createElement('div');
    div.id='tile-container';
    $('#container').append(div);
    $('#grid-container').css(
        {
            'left': (window.innerWidth-$('#grid-container').width())/2+'px',
            'top': (window.innerHeight-$('#grid-container').height())/2+'px'
        }
    );
    return cells;
};

//The grid element in html has been drawn
//Simply clear the grid array
Grid.prototype.rebuild = function()
{
    var cells = [];

    for (var x = 0; x < this.size; x++)
    {
        var row = cells[x] = [];
        for (var y = 0; y < this.size; y++)
        {
            row.push(null);
        }
    }
    return cells;
};

// Find a random empty cell from empty cell list
Grid.prototype.randomEmptyCell = function ()
{
    var cells = this.getEmptyCells();

    if (cells.length)
    {
        return cells[Math.floor(Math.random() * cells.length)];
    }
};

//Use to put head and tail tile in the center of the grid
Grid.prototype.getCentre = function()
{
    var born = [];
    born.push({x: parseInt(this.size/2), y:parseInt(this.size/2)});
    born.push({x: parseInt(this.size/2), y:parseInt(this.size/2+1)});
    return born;
};
// Find all empty cells and store in a list
Grid.prototype.getEmptyCells = function ()
{
    var voidCells = [];
    this.eachCell(function (x, y, tile)
    {
        if (!tile)
        {
            voidCells.push({ x: x, y: y });
        }
    });
    return voidCells;
};

// Call callback for every cell in the grid
Grid.prototype.eachCell = function (callback)
{
    for (var x = 0; x < this.size; x++)
    {
        for (var y = 0; y < this.size; y++)
        {
            callback(x, y, this.cells[x][y]);
        }
    }
};

// Check if current cell is occupied
Grid.prototype.isEmpty = function (cell)
{
    return !this.cellContent(cell);
};

//return the content of current cell
Grid.prototype.cellContent = function (cell)
{
    if (this.withinBounds(cell))
    {
        return this.cells[cell.x][cell.y];
    }
    else
    {
        return null;
    }
};

// Inserts a tile at current cell position
Grid.prototype.insertTile = function (tile)
{
    this.cells[tile.x][tile.y] = tile;
};

// Remove a tile from current cell position
Grid.prototype.removeTile = function (tile)
{
    this.cells[tile.x][tile.y] = null;
};

// Check if current coordinate is in the grid
Grid.prototype.withinBounds = function (position)
{
    return position.x >= 0 && position.x < this.size &&
        position.y >= 0 && position.y < this.size;
};