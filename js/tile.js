/* By sz1358 Shi Zeng */
function Tile(position, value)
{
    this.x                = position.x;
    this.y                = position.y;
    //0: head, 1: tail
    this.value            = value;

    this.previousPosition = null;
    this.foodMark         = null;
    this.mergedFrom       = null; // Tracks tiles that merged together
}


Tile.prototype.updatePosition = function (position)
{
    this.previousPosition = { x: this.x, y: this.y };
    this.x = position.x;
    this.y = position.y;
};