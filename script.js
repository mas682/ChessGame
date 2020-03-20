
// holds which blocks have currently been clicked on
let flashing = []
//let whitePieces = [58, 59, 60, 61, 62, 63]
//let blackPieces = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]

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
    // if the square is not currently flashing and there are no squares currently
    // flashing, and the last clicked is not this square
    if(index < 0 && flashing.length <= 0 && lastClicked != parent.id)
    {
        lastClicked = parent.id;
        choosePiece(parent, elem);
    }
    // if there are squares flashing and the clicked on square is not the most recent
    else if (lastClicked != parent.id) {
        stopFlash();
        lastClicked = parent.id;
        choosePiece(parent, elem);
//left off here; first get pieces to flash correctly, then handle flashing on occupied spots
//still need to add id and class to white pieces
    }
    // if clicked on the square that is flashing and was the last clicked on
    else
    {
        stopFlash();
        lastClicked = 0;
    }
}

function choosePiece(parent, elem)
{
    if(elem.id.includes("Knight"))
    {
        knightLMove(parent.id, elem.id);
    }
    else if(elem.id.includes("Rook")) {
        verticalFlash(parent.id, elem.id);
        horizontalFlash(parent.id, elem.id);
    }
    else if(elem.id.includes("Bishop"))
    {
        diagonalFlash(parent.id, elem.id);
    }
    else if(elem.id.includes("Queen"))
    {
        verticalFlash(parent.id, elem.id);
        horizontalFlash(parent.id, elem.id);
        diagonalFlash(parent.id, elem.id);
    }
    else if(elem.id.includes("Pawn"))
    {
        pawnFlash(parent.id, elem.id);
    }

}

function stopFlash()
{
    let i = 0;
    let flashingLength = flashing.length;
    let index = -1;
    while(i < flashingLength)
    {
        index = flashing.pop();
        elem = document.getElementById(index);
        // if blocks color is not red and it should be flashing, set it
        if(elem.style.backgroundColor == "red")
        {
            if(elem.className == "square even")
            {
                elem.style.backgroundColor = "DimGrey";
            }
            else
            {
                elem.style.backgroundColor = "GainsBoro";
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

    let i = 0;
    console.log(flashing);
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
                elem.style.backgroundColor = "GainsBoro";
            }
        }
    }
}


// this function is still being worked on
// go to lines 207
function elementCheck(elemID, color)
{
    let elem = document.getElementById(String(elemID)).firstElementChild;
    if(elem != null)
    {
        if(color == "black")
        {
            if(elem.id.startsWith("black"))
            {
                return "break";
            }
            else
            {
                //squares_flashing.push(elemID);
                return "Add Square";
            }
        }
        else
        {
            if(elem.id.startsWith("white"))
            {
                return "break";
            }
            else
            {
                return "Add Square";
            }
        }
    }
    else
    {
        return null;
    }
}


// function to handle getting diagonals
function diagonalFlash(pos, piece)
{
    pos = parseInt(pos);
    let p = pos;
    let color = "";
    let squares_flashing = [];
    let previous_pos = pos % 8;
    var elementCheckResponse;

    if(piece.startsWith("white"))
    {
        color = "white";
    }
    else
    {
        color = "black";
    }
    // for up, left
    p = p - 9;
    while(p >= 0 && previous_pos != 0)
    {
        elementCheckResponse = elementCheck(p, color);
        if(elementCheckResponse != null)
        {
            if(elementCheckResponse == "break")
            {
                break;
            }
            else {
                squares_flashing.push(p);
                break;
            }
        }
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
        elementCheckResponse = elementCheck(p, color);
        if(elementCheckResponse != null)
        {
            if(elementCheckResponse == "break")
            {
                break;
            }
            else {
                squares_flashing.push(p);
                break;
            }
        }
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
        elementCheckResponse = elementCheck(p, color);
        if(elementCheckResponse != null)
        {
            if(elementCheckResponse == "break")
            {
                break;
            }
            else {
                squares_flashing.push(p);
                break;
            }
        }
        // if here, no piece found on the square so add it to the flashing set
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
        elementCheckResponse = elementCheck(p, color);
        if(elementCheckResponse != null)
        {
            if(elementCheckResponse == "break")
            {
                break;
            }
            else {
                squares_flashing.push(p);
                break;
            }
        }
        squares_flashing.push(p);
        // get position within row
        previous_pos = p % 8;
        // update value
        p = p + 9;
    }
    squares_flashing.push(pos);
    flashing = flashing.concat(squares_flashing);
    // remove duplicates
    flashing = flashing.filter( function( item, index, inputArray ) {
           return inputArray.indexOf(item) == index;
    });
    console.log(squares_flashing);
}

// function to get verticals
function verticalFlash(pos, piece)
{
    pos = parseInt(pos);
    let p = pos;
    let color = "";
    let squares_flashing = [];
    var elementCheckResponse;

    if(piece.startsWith("white"))
    {
        color = "white";
    }
    else
    {
        color = "black";
    }
    // for up
    p = p - 8;
    while(p >= 0)
    {
        elementCheckResponse = elementCheck(p, color);
        if(elementCheckResponse != null)
        {
            if(elementCheckResponse == "break")
            {
                break;
            }
            else {
                squares_flashing.push(p);
                break;
            }
        }
        // if here, no piece found on the square so add it to the flashing set
        squares_flashing.push(p);
        // update value
        p = p - 8;
    }
    // for down
    p = pos;
    p = p + 8;
    while(p < 64)
    {
        elementCheckResponse = elementCheck(p, color);
        if(elementCheckResponse != null)
        {
            if(elementCheckResponse == "break")
            {
                break;
            }
            else {
                squares_flashing.push(p);
                break;
            }
        }
        // if here, no piece found on the square so add it to the flashing set
        squares_flashing.push(p);
        // update value
        p = p + 8;
    }
    squares_flashing.push(pos);
    flashing = flashing.concat(squares_flashing);
    // remove duplicates
    flashing = flashing.filter( function( item, index, inputArray ) {
           return inputArray.indexOf(item) == index;
    });
    console.log(squares_flashing);
}

// function to get horizontals
function horizontalFlash(pos, piece)
{
    pos = parseInt(pos);
    let p = pos;
    let color = "";
    let squares_flashing = [];
    let previous_pos = pos % 8;
    var elementCheckResponse;

    if(piece.startsWith("white"))
    {
        color = "white";
    }
    else
    {
        color = "black";
    }
    // for left
    p = p - 1;
    while(previous_pos != 0)
    {
        elementCheckResponse = elementCheck(p, color);
        if(elementCheckResponse != null)
        {
            if(elementCheckResponse == "break")
            {
                break;
            }
            else {
                squares_flashing.push(p);
                break;
            }
        }
        // if here, no piece found on the square so add it to the flashing set
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
        elementCheckResponse = elementCheck(p, color);
        if(elementCheckResponse != null)
        {
            if(elementCheckResponse == "break")
            {
                break;
            }
            else {
                squares_flashing.push(p);
                break;
            }
        }
        // if here, no piece found on the square so add it to the flashing set
        squares_flashing.push(p);
        // get position within row
        previous_pos = p % 8;
        p = p + 1;
    }
    squares_flashing.push(pos);
    flashing = flashing.concat(squares_flashing);
    // remove duplicates
    flashing = flashing.filter( function( item, index, inputArray ) {
           return inputArray.indexOf(item) == index;
    });
    console.log(squares_flashing);
}

function knightLMove(pos, piece)
{
    pos = parseInt(pos);
    let p = pos;
    let color = "";
    let squares_flashing = [];
    let row_pos = pos % 8;
    let elementCheckResponse;

    if(piece.startsWith("white"))
    {
        color = "white";
    }
    else
    {
        color = "black";
    }
    // for two up, one left
    // if alread at left most column, skip
    if(row_pos > 0)
    {
        p = p - 17;
        if(p >= 0)
        {
            elementCheckResponse = elementCheck(p, color);
            if(elementCheckResponse != null)
            {
                if(elementCheckResponse != "break")
                {
                    squares_flashing.push(p);
                }
            }
            else {
                squares_flashing.push(p);
            }
        }
    }
    // one up, two left
    p = pos;
    if(row_pos > 1)
    {
        p = p - 10;
        if(p >= 0)
        {
            elementCheckResponse = elementCheck(p, color);
            if(elementCheckResponse != null)
            {
                if(elementCheckResponse != "break")
                {
                    squares_flashing.push(p);
                }
            }
            else {
                squares_flashing.push(p);
            }
        }
    }
    // two up, one right
    p = pos;
    if(row_pos < 7)
    {
        p = p - 15;
        if(p >= 0)
        {
            elementCheckResponse = elementCheck(p, color);
            if(elementCheckResponse != null)
            {
                if(elementCheckResponse != "break")
                {
                    squares_flashing.push(p);
                }
            }
            else {
                squares_flashing.push(p);
            }
        }
    }
    // one up, two right
    p = pos;
    if(row_pos < 6)
    {
        p = p - 6;
        if(p >= 0)
        {
            elementCheckResponse = elementCheck(p, color);
            if(elementCheckResponse != null)
            {
                if(elementCheckResponse != "break")
                {
                    squares_flashing.push(p);
                }
            }
            else {
                squares_flashing.push(p);
            }
        }
    }
    // two down, one right
    p = pos;
    if(row_pos < 7)
    {
        p = p + 17;
        if(p < 64)
        {
            elementCheckResponse = elementCheck(p, color);
            if(elementCheckResponse != null)
            {
                if(elementCheckResponse != "break")
                {
                    squares_flashing.push(p);
                }
            }
            else {
                squares_flashing.push(p);
            }
        }
    }
    // one down, two right
    p = pos;
    if(row_pos < 6)
    {
        p = p + 10;
        if(p < 64)
        {
            elementCheckResponse = elementCheck(p, color);
            if(elementCheckResponse != null)
            {
                if(elementCheckResponse != "break")
                {
                    squares_flashing.push(p);
                }
            }
            else {
                squares_flashing.push(p);
            }
        }
    }
    // one down, two left
    p = pos;
    if(row_pos > 1)
    {
        p = p + 6;
        if(p < 64)
        {
            elementCheckResponse = elementCheck(p, color);
            if(elementCheckResponse != null)
            {
                if(elementCheckResponse != "break")
                {
                    squares_flashing.push(p);
                }
            }
            else {
                squares_flashing.push(p);
            }
        }
    }
    // two, one left
    p = pos;
    if(row_pos > 0)
    {
        p = p + 15;
        if(p < 64)
        {
            elementCheckResponse = elementCheck(p, color);
            if(elementCheckResponse != null)
            {
                if(elementCheckResponse != "break")
                {
                    squares_flashing.push(p);
                }
            }
            else {
                squares_flashing.push(p);
            }
        }
    }
    squares_flashing.push(pos);
    flashing = flashing.concat(squares_flashing);
    // remove duplicates
    flashing = flashing.filter( function( item, index, inputArray ) {
           return inputArray.indexOf(item) == index;
    });
    console.log(squares_flashing);
}


function elementCheckPawn(elemID)
{
    let elem = document.getElementById(String(elemID)).firstElementChild;
    if(elem != null)
    {
        return "break";
    }
    else
    {
        return null;
    }
}


function elementCheckPawnRightLeft(elemID, color)
{
    let elem = document.getElementById(String(elemID)).firstElementChild;
    if(elem != null)
    {
        if(color == "black")
        {
            if(elem.id.startsWith("black"))
            {
                return null;
            }
            else
            {
                return "Add Square";
            }
        }
        else
        {
            if(elem.id.startsWith("white"))
            {
                return null;
            }
            else
            {
                return "Add Square";
            }
        }
    }
    else
    {
        return null;
    }
}

// this needs more work
// if opposite color right in front, should not be flashing
// also check to see if opposite color at left or right position 1 square up/down
function pawnFlash(pos, piece)
{
    pos = parseInt(pos);
    let p = pos;
    let color = "";
    let squares_flashing = [];
    let elementCheckResponse;
    let elemCheck2;
    let row_pos = pos % 8;

    if(piece.startsWith("white"))
    {
        color = "white";
    }
    else
    {
        color = "black";
    }

    if(color == "white")
    {
        // for up
        var iteration = 1;
        p = p - 8;
        while(p >= (pos-16) && p >= 0)
        {
            elementCheckResponse = elementCheckPawn(p);
            // check in front
            if(elementCheckResponse == null)
            {
                // if here, no piece found on the square so add it to the flashing set
                squares_flashing.push(p);
            }
            if(iteration == 1)
            {
                let square;
                // if not at furthest right position
                if(row_pos != 7)
                {
                    square = pos - 7;
                    elemCheck2 = elementCheckPawnRightLeft(square, color);
                    // check in front
                    if(elemCheck2 != null)
                    {
                        // if here, no piece found on the square so add it to the flashing set
                        squares_flashing.push(square);
                    }
                }
                // if not at furthest left position
                if(row_pos != 0)
                {
                    square = pos - 9;
                    elemCheck2 = elementCheckPawnRightLeft(square, color);
                    // check in front
                    if(elemCheck2 != null)
                    {
                        // if here, no piece found on the square so add it to the flashing set
                        squares_flashing.push(square);
                    }
                }
            }
            if(!(pos >= 48 && pos <= 55) || elementCheckResponse != null)
            {
                break;
            }
            // update value
            p = p - 8;
            iteration ++;
        }
    }
    else
    {
        // for up
        var iteration = 1;
        p = p + 8;
        while(p <= (pos+16) && p <= 63)
        {
            elementCheckResponse = elementCheckPawn(p);
            // check in front
            if(elementCheckResponse == null)
            {
                // if here, no piece found on the square so add it to the flashing set
                squares_flashing.push(p);
            }
            if(iteration == 1)
            {
                let square;
                // if not at furthest right position
                if(row_pos != 7)
                {
                    square = pos + 9;
                    elemCheck2 = elementCheckPawnRightLeft(square, color);
                    // check in front
                    if(elemCheck2 != null)
                    {
                        // if here, no piece found on the square so add it to the flashing set
                        squares_flashing.push(square);
                    }
                }
                // if not at furthest left position
                if(row_pos != 0)
                {
                    square = pos + 7;
                    elemCheck2 = elementCheckPawnRightLeft(square, color);
                    // check in front
                    if(elemCheck2 != null)
                    {
                        // if here, no piece found on the square so add it to the flashing set
                        squares_flashing.push(square);
                    }
                }
            }
            if(!(pos >= 8 && pos <= 15) || elementCheckResponse != null)
            {
                break;
            }
            // update value
            p = p + 8;
            iteration ++;
        }
    }
    squares_flashing.push(pos);
    flashing = flashing.concat(squares_flashing);
    // remove duplicates
    flashing = flashing.filter( function( item, index, inputArray ) {
           return inputArray.indexOf(item) == index;
    });
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
