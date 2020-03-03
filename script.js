
// holds which blocks have currently been clicked on
let flashing = []
// used to synchronzie block color change
let flip_color = false
let lastClicked = 0

// called when a block is clicked on
// if the block was already clicked on, remove it from flashing
// otherwise, add it to the set of flashing blocks
function setFlash(e, elem) {
    e.preventDefault();
    let parent = elem.parentNode;
    let index = flashing.indexOf(parent.id);
    if(index < 0 && flashing.length <= 0 && lastClicked != parent.id)
    {
        flashing.push(parent.id);
        lastClicked = parent.id;
    }
    else if (lastClicked != parent.id) {
        stopFlash();
        flashing.push(parent.id);
        lastClicked = parent.id;
    }
    else
    {
    need to block all this out and then just do stop flash
        //flashing.splice(index, 1);
        if(parent.style.backgroundColor == "red")
        {
            if(parent.className === "square even")
            {
                parent.style.backgroundColor = "grey";
            }
            else
            {
                parent.style.backgroundColor = "white";
            }
        }
    }
    // diagonalFlash(elem.id);
    //verticalFlash(elem.id);
    //horizontalFlash(elem.id);
    knightLMove(parent.id);
}

function stopFlash()
{
    let i = 0;
    let flashingLength = flashing.length;
    let index = -1;
    while(i < flashing.length)
    {
        index = flashing.pop();
        elem = document.getElementById(flashing[index]);
        // if blocks color is not red and it should be flashing, set it
        if(elem.style.backgroundColor == "red")
        {
            if(elem.className == "square even")
            {
                elem.style.backgroundColor = "DimGrey";
            }
            else
            {
                elem.style.backgroundColor = "GainsBoror";
            }
        }
        i++;
    }
}
// function to manage making blocks switch colors
function flash()
{
    // switch between true and false
    flip_color = !flip_color

    let i = 0
    // go through each flashing block number
    for(i = 0; i < flashing.length; i++)
    {
        elem = document.getElementById(flashing[i]);
        // if blocks color is not red and it should be flashing, set it
        if(elem.style.backgroundColor !== "red" && flip_color)
        {
            elem.style.backgroundColor = "red";
        }
        // if the block should not be red currently
        else
        {
            if(elem.className == "square even")
            {
                elem.style.backgroundColor = "DimGrey";
            }
            else
            {
                elem.style.backgroundColor = "GainsBoror";
            }
        }
    }
}

// function to handle getting diagonals
function diagonalFlash(pos)
{
    pos = parseInt(pos);
    let p = pos;
    let squares_flashing = [];
    let previous_pos = pos % 8;
    // for up, left
    p = p - 9;
    while(p >= 0 && previous_pos != 0)
    {
        squares_flashing.push(p);
        // get position within row
        previous_pos = p % 8;
        // update value
        p = p - 9;
    }
    // reset values
    // for up, right
    p = pos;
    previous_pos = pos % 8;
    p = p - 7;
    while(p >= 0 && previous_pos != 7)
    {
        squares_flashing.push(p);
        // get position within row
        previous_pos = p % 8;
        p = p - 7;
    }
    // reset values
    // for down, left
    p = pos;
    previous_pos = pos % 8;
    p = p + 7;
    while(p < 64 && previous_pos != 0)
    {
        squares_flashing.push(p);
        // get position within row
        previous_pos = p % 8;
        // update value
        p = p + 7;
    }
    // reset values
    // for down, right
    p = pos;
    previous_pos = pos % 8;
    p = p + 9;
    while(p < 64 && previous_pos != 7)
    {
        squares_flashing.push(p);
        // get position within row
        previous_pos = p % 8;
        // update value
        p = p + 9;
    }
    squares_flashing.push(pos);
    flashing = squares_flashing;
    console.log(squares_flashing);
    // have issue where you can change what is flashing without resetting squares that were flashing
    // will want to unset all squares when calling setFlash
}

// function to get verticals
function verticalFlash(pos)
{
    pos = parseInt(pos);
    let p = pos;
    let squares_flashing = [];
    // for up
    p = p - 8;
    while(p >= 0)
    {
        squares_flashing.push(p);
        // update value
        p = p - 8;
    }
    // for down
    p = pos;
    p = p + 8;
    while(p < 64)
    {
        squares_flashing.push(p);
        // update value
        p = p + 8;
    }
    squares_flashing.push(pos);
    flashing = squares_flashing;
    console.log(squares_flashing);
}

// function to get horizontals
function horizontalFlash(pos)
{
    pos = parseInt(pos);
    let p = pos;
    let squares_flashing = [];
    let previous_pos = pos % 8;
    // for left
    p = p - 1;
    while(previous_pos != 0)
    {
        squares_flashing.push(p);
        // get position within row
        previous_pos = p % 8;
        // update value
        p = p - 1;
    }
    // reset values
    // for right
    p = pos;
    previous_pos = pos % 8;
    p = p + 1;
    while(previous_pos != 7)
    {
        squares_flashing.push(p);
        // get position within row
        previous_pos = p % 8;
        p = p + 1;
    }
    squares_flashing.push(pos);
    flashing = squares_flashing;
    console.log(squares_flashing);
}

function knightLMove(pos)
{
    pos = parseInt(pos);
    let p = pos;
    let squares_flashing = [];
    let row_pos = pos % 8;
    // for two up, one left
    // if alread at left most column, skip
    if(row_pos > 0)
    {
        p = p - 17;
        if(p >= 0)
        {
            squares_flashing.push(p);
        }
    }
    // one up, two left
    p = pos;
    if(row_pos > 1)
    {
        p = p - 10;
        if(p >= 0)
        {
            squares_flashing.push(p);
        }
    }
    // two up, one right
    p = pos;
    if(row_pos < 7)
    {
        p = p - 15;
        if(p >= 0)
        {
            squares_flashing.push(p);
        }
    }
    // one up, two right
    p = pos;
    if(row_pos < 6)
    {
        p = p - 6;
        if(p >= 0)
        {
            squares_flashing.push(p);
        }
    }
    // two down, one right
    p = pos;
    if(row_pos < 7)
    {
        p = p + 17;
        if(p < 64)
        {
            squares_flashing.push(p);
        }
    }
    // one down, two right
    p = pos;
    if(row_pos < 6)
    {
        p = p + 10;
        if(p < 64)
        {
            squares_flashing.push(p);
        }
    }
    // one down, two left
    p = pos;
    if(row_pos > 1)
    {
        p = p + 6;
        if(p < 64)
        {
            squares_flashing.push(p);
        }
    }
    // two, one left
    p = pos;
    if(row_pos > 0)
    {
        p = p + 15;
        if(p < 64)
        {
            squares_flashing.push(p);
        }
    }
    squares_flashing.push(pos);
    flashing = squares_flashing;
    console.log(squares_flashing);
}


// get all the blocks
//elems = document.querySelectorAll(".square");
elems = document.getElementsByTagName('img');
let i = 0;
for(i = 0; i < elems.length; i++)
{
    // add a click listener to each block
    elems[i].addEventListener('click', function(e){ setFlash(e, this); }, false);
}

setInterval(flash, 1000);
