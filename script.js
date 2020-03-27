
// holds which blocks have currently been clicked on
let flashing = []
//let whitePieces = [58, 59, 60, 61, 62, 63]
//let blackPieces = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]

// used to synchronzie block color change
let flip_color = false;
let lastClicked = -1;
let firstClick = true;


// this function will be called any time a square is clicked on
function moveToEmptySquare(e, elem) {
    e.preventDefault();
    // done so that a click on a piece when none are set does not execute this
    if(firstClick)
    {
        firstClick = false;
        return;
    }
    // if there are elements in the flashing array
    // meaning the user is trying to move some piece
    if(flashing.length > 0)
    {
        // if the square clicked on is one that is flashing
        // if the square is not in the flashing squares array, simply ignore the click
        if(flashing.includes(parseInt(elem.id)))
        {
            stopFlash();
            // get the element of the last clicked square, including the piece
            let replacementElem = document.getElementById(String(lastClicked));
            // get the piece
            let pieceElem = replacementElem.innerHTML;
            // set the empty square that was clicked on to hold the piece
            elem.innerHTML = String(pieceElem);
            // remove the piece from where it used to be
            replacementElem.innerHTML = "";
            // add an event listener to the piece again
            elem.firstElementChild.addEventListener('click', function(e){ setFlash(e, this); }, false);
            // set the last clicked on square to -1
            lastClicked = -1;
        }
    }
}


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
        setSelectedSquareColor(parent.id);
        lastClicked = parent.id;
        choosePiece(parent, elem);
        firstClick = true;
    }
    // if there are squares flashing and the clicked on square is not the most recent
    else if (lastClicked != parent.id) {
        // if here, on a piece, so check if it was one of the current flashing pieces
        if(flashing.includes(parseInt(parent.id)))
        {
            stopFlash();
            // need to remove the current piece
            let replacementElem = document.getElementById(String(lastClicked));
            let pieceElem = replacementElem.innerHTML;
            parent.innerHTML = String(pieceElem);
            replacementElem.innerHTML = "";
            parent.firstElementChild.addEventListener('click', function(e){ setFlash(e, this); }, false);
            lastClicked = -1;
        }
        else
        {
            stopFlash();
            setSelectedSquareColor(parent.id);
            lastClicked = parent.id;
            choosePiece(parent, elem);
            firstClick = true;
        }
    }
    // if clicked on the square that is flashing and was the last clicked on
    else
    {
        stopFlash();
        lastClicked = -1;
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
    else if(elem.id.includes("King"))
    {
        kingFlash(parent.id, elem.id);
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

// used to set the clicked on squares color faster
function setSelectedSquareColor(index)
{
    elem = document.getElementById(index);
    elem.style.backgroundColor = "red";
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
        // set the square the was clicked on to a single color, not flashing
        if(flashing[i] == lastClicked)
        {
            elem.style.backgroundColor = "red";
            continue;
        }
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

// this function checks to see if there is a square is avaiable for a piece
// to land on
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
    let elementCheckResponse;
    let kingCheck;

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
                kingCheck = kingVulnerable(pos, color, p, false);
                if(!kingCheck)
                {
                    squares_flashing.push(p);
                }
                break;
            }
        }
        kingCheck = kingVulnerable(pos, color, p, false);
        if(!kingCheck)
        {
            squares_flashing.push(p);
        }
        else
        {
            break;
        }
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
                kingCheck = kingVulnerable(pos, color, p, false);
                if(!kingCheck)
                {
                    squares_flashing.push(p);
                }
                break;
            }
        }
        kingCheck = kingVulnerable(pos, color, p, false);
        if(!kingCheck)
        {
            squares_flashing.push(p);
        }
        else
        {
            break;
        }
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
                kingCheck = kingVulnerable(pos, color, p, false);
                if(!kingCheck)
                {
                    squares_flashing.push(p);
                }
                break;
            }
        }
        // if here, no piece found on the square so add it to the flashing set
        kingCheck = kingVulnerable(pos, color, p, false);
        if(!kingCheck)
        {
            squares_flashing.push(p);
        }
        else
        {
            break;
        }
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
                kingCheck = kingVulnerable(pos, color, p, false);
                if(!kingCheck)
                {
                    squares_flashing.push(p);
                }
                break;
            }
        }
        kingCheck = kingVulnerable(pos, color, p, false);
        if(!kingCheck)
        {
            squares_flashing.push(p);
        }
        else
        {
            break;
        }
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
    // the square the piece is currently on
    pos = parseInt(pos);
    let p = pos;
    let color = "";
    let squares_flashing = [];
    let elementCheckResponse;
    let kingCheck;

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
                kingCheck = kingVulnerable(pos, color, p, false);
                if(!kingCheck)
                {
                    squares_flashing.push(p);
                }
                break;
            }
        }
        // if here, no piece found on the square so add it to the flashing set
        kingCheck = kingVulnerable(pos, color, p, false);
        if(!kingCheck)
        {
            squares_flashing.push(p);
        }
        else
        {
            break;
        }
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
                kingCheck = kingVulnerable(pos, color, p, false);
                if(!kingCheck)
                {
                    squares_flashing.push(p);
                }
                break;
            }
        }
        // if here, no piece found on the square so add it to the flashing set
        kingCheck = kingVulnerable(pos, color, p, false);
        if(!kingCheck)
        {
            squares_flashing.push(p);
        }
        else
        {
            break;
        }
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
    let elementCheckResponse;
    let kingCheck;

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
                kingCheck = kingVulnerable(pos, color, p, false);
                if(!kingCheck)
                {
                    squares_flashing.push(p);
                }
                break;
            }
        }
        // if here, no piece found on the square so add it to the flashing set
        kingCheck = kingVulnerable(pos, color, p, false);
        if(!kingCheck)
        {
            squares_flashing.push(p);
        }
        else
        {
            break;
        }
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
                kingCheck = kingVulnerable(pos, color, p, false);
                if(!kingCheck)
                {
                    squares_flashing.push(p);
                }
                break;
            }
        }
        // if here, no piece found on the square so add it to the flashing set
        kingCheck = kingVulnerable(pos, color, p, false);
        if(!kingCheck)
        {
            squares_flashing.push(p);
        }
        else
        {
            break;
        }
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
    let kingCheck;

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
                    kingCheck = kingVulnerable(pos, color, p, false);
                    if(!kingCheck)
                    {
                        squares_flashing.push(p);
                    }
                }
            }
            else {
                kingCheck = kingVulnerable(pos, color, p, false);
                if(!kingCheck)
                {
                    squares_flashing.push(p);
                }
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
                    kingCheck = kingVulnerable(pos, color, p, false);
                    if(!kingCheck)
                    {
                        squares_flashing.push(p);
                    }
                }
            }
            else {
                kingCheck = kingVulnerable(pos, color, p, false);
                if(!kingCheck)
                {
                    squares_flashing.push(p);
                }
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
                    kingCheck = kingVulnerable(pos, color, p, false);
                    if(!kingCheck)
                    {
                        squares_flashing.push(p);
                    }
                }
            }
            else {
                kingCheck = kingVulnerable(pos, color, p, false);
                if(!kingCheck)
                {
                    squares_flashing.push(p);
                }
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
                    kingCheck = kingVulnerable(pos, color, p, false);
                    if(!kingCheck)
                    {
                        squares_flashing.push(p);
                    }
                }
            }
            else {
                kingCheck = kingVulnerable(pos, color, p, false);
                if(!kingCheck)
                {
                    squares_flashing.push(p);
                }
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
                    kingCheck = kingVulnerable(pos, color, p, false);
                    if(!kingCheck)
                    {
                        squares_flashing.push(p);
                    }
                }
            }
            else {
                kingCheck = kingVulnerable(pos, color, p, false);
                if(!kingCheck)
                {
                    squares_flashing.push(p);
                }
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
                    kingCheck = kingVulnerable(pos, color, p, false);
                    if(!kingCheck)
                    {
                        squares_flashing.push(p);
                    }
                }
            }
            else {
                kingCheck = kingVulnerable(pos, color, p, false);
                if(!kingCheck)
                {
                    squares_flashing.push(p);
                }
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
                    kingCheck = kingVulnerable(pos, color, p, false);
                    if(!kingCheck)
                    {
                        squares_flashing.push(p);
                    }
                }
            }
            else {
                kingCheck = kingVulnerable(pos, color, p, false);
                if(!kingCheck)
                {
                    squares_flashing.push(p);
                }
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
                    kingCheck = kingVulnerable(pos, color, p, false);
                    if(!kingCheck)
                    {
                        squares_flashing.push(p);
                    }
                }
            }
            else {
                kingCheck = kingVulnerable(pos, color, p, false);
                if(!kingCheck)
                {
                    squares_flashing.push(p);
                }
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
                kingCheck = kingVulnerable(pos, color, p, false);
                if(!kingCheck)
                {
                    squares_flashing.push(p);
                }
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
                        kingCheck = kingVulnerable(pos, color, square, false);
                        if(!kingCheck)
                        {
                            squares_flashing.push(square);
                        }
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
                        kingCheck = kingVulnerable(pos, color, square, false);
                        if(!kingCheck)
                        {
                            squares_flashing.push(square);
                        }
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
        var iteration = 1;
        p = p + 8;
        while(p <= (pos+16) && p <= 63)
        {
            elementCheckResponse = elementCheckPawn(p);
            // check in front
            if(elementCheckResponse == null)
            {
                // if here, no piece found on the square so add it to the flashing set
                kingCheck = kingVulnerable(pos, color, p, false);
                if(!kingCheck)
                {
                    squares_flashing.push(p);
                }
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
                        kingCheck = kingVulnerable(pos, color, square, false);
                        if(!kingCheck)
                        {
                            squares_flashing.push(square);
                        }
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
                        kingCheck = kingVulnerable(pos, color, square, false);
                        if(!kingCheck)
                        {
                            squares_flashing.push(square);
                        }
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

function kingFlash(pos, piece)
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
    let iteration = 0;
    while(iteration < 8)
    //if(p >= 0)
    {
        // check right
        if(iteration == 0 && row_pos != 7)
        {
            p = pos + 1;
        }
        // check down right
        else if(iteration == 1 && row_pos != 7 && pos < 56 )
        {
            p = pos + 9;
        }
        // for down 1
        else if(iteration == 2 && pos < 56 )
        {
            p = pos + 8;
        }
        // for down left
        else if(iteration == 3 && row_pos != 0 && pos < 56 )
        {
            p = pos + 7;
        }
        // for left
        else if(iteration == 4 && row_pos != 0)
        {
            p = pos - 1;
        }
        // for up left
        else if(iteration == 5 && row_pos != 0 && pos > 7)
        {
            p = pos - 9;
        }
        // for up
        else if(iteration == 6 && pos > 7 )
        {
            p = pos - 8;
        }
        // for up right
        else if(iteration == 7 && row_pos != 7 && pos < 56 )
        {
            p = pos - 7;
        }
        else
        {
            iteration++;
            continue;
        }
        elementCheckResponse = elementCheck(p, color);
        // if there is a piece on the square
        if(elementCheckResponse != null)
        {
            // if the piece is not friendly
            if(elementCheckResponse != "break")
            {
                    // could have issue here as this is the king...
                    console.log(p);
                    kingCheck = kingVulnerable(pos, color, p, true);
                    if(!kingCheck)
                    {
                        squares_flashing.push(p);
                    }
            }
        }
        else {
            // else, no piece on the square
            // could have issue here as this is the king
            kingCheck = kingVulnerable(pos, color, p, true);
            if(!kingCheck)
            {
                squares_flashing.push(p);
            }
        }
        iteration++;
    }
    squares_flashing.push(pos);
    flashing = flashing.concat(squares_flashing);
    // remove duplicates
    flashing = flashing.filter( function( item, index, inputArray ) {
           return inputArray.indexOf(item) == index;
    });
    console.log(squares_flashing);
}

// this function will check if a piece is moved to a certain spot,
// will it leave the king vulnerable
// returns true if the king is vulnerable, false otherwise
function kingVulnerable(pos, color, nextPos, kingPiece)
{
    //alert("king vulnerable called");
    let kingElem;
    let kignSquare;
    // just added this in
    if(!kingPiece)
    {
        if(color == "white")
        {
            kingElem = document.getElementById("whiteKing");
        }
        else
        {
            kingElem = document.getElementById("blackKing");
        }
        kingSquare = kingElem.parentNode;
        let vertCheck = verticalCheck(kingSquare.id, color, pos, nextPos);
        //alert("King in danger vertically: " + vertCheck);
        let horizCheck = horizontalCheck(kingSquare.id, color, pos, nextPos);
        //alert("King in danger horizontally: " + horizCheck);
        let diagCheck = diagonalCheck(kingSquare.id, color, pos, nextPos);
        //alert("King in danger diagonally: " + diagCheck);
        let knightValid = knightCheck(kingSquare.id, color, pos, nextPos);
        //alert("King in danger from knight: " + knightValid);
        if(vertCheck || horizCheck || diagCheck || knightValid)
        {
            return true;
        }
        return false;
    }
    else
    {
        let vertCheck = verticalCheck(nextPos, color, pos, nextPos);
        let horizCheck = horizontalCheck(nextPos, color, pos, nextPos);
        let diagCheck = diagonalCheck(nextPos, color, pos, nextPos);
        let knightValid = knightCheck(nextPos, color, pos, nextPos);
        if(vertCheck || horizCheck || diagCheck || knightValid)
        {
            return true;
        }
        return false;
    }
}


// function to see if any enemy piece is within reach of the king vertically
function verticalCheck(pos, color, oldPiecePos, newPiecePos)
{
    // the square the king is currently on
    pos = parseInt(pos);
    let p = pos;
    var elementCheckResponse;

    p = p - 8;
    while(p >= 0)
    {
        // if at old piece, assume the square will be empty
        if(p == parseInt(oldPiecePos))
        {
            p = p - 8;
            continue;
        }
        // if you get to where the new piece will be, it there is something
        // blocking the king
        if(p == parseInt(newPiecePos))
        {
            break;
        }
        // see what piece is on the current square to check
        elementCheckResponse = elementCheck(p, color);
        // if not null, a piece was found on the square
        if(elementCheckResponse != null)
        {
            // if the piece is not a fiendly piece
            if(elementCheckResponse != "break")
            {
                // need to see if the piece can access the king
                let enemyElem = document.getElementById(String(p));
                // get the piece
                let enemyPiece = enemyElem.firstElementChild;
                if(enemyPiece.className == "queen" || enemyPiece.className == "rook")
                {
                    return true;
                }
            }
            break;
        }
        // update value
        p = p - 8;
    }
    // for down
    p = pos;
    p = p + 8;
    while(p < 64)
    {
        // if at old piece, assume the square will be empty
        if(p == parseInt(oldPiecePos))
        {
            p = p + 8;
            continue;
        }
        // if you get to where the new piece will be, it there is something
        // blocking the king
        if(p == parseInt(newPiecePos))
        {
            break;
        }
        // see what piece is on the current square to check
        elementCheckResponse = elementCheck(p, color);
        // if not null, a piece was found on the square
        if(elementCheckResponse != null)
        {
            // if the piece is not friendly
            if(elementCheckResponse != "break")
            {
                // need to see if the piece can access the king
                let enemyElem = document.getElementById(String(p));
                // get the piece
                let enemyPiece = enemyElem.firstElementChild;
                if(enemyPiece.className == "queen" || enemyPiece.className == "rook")
                {
                    return true;
                }
            }
            break;
        }
        p = p + 8;
    }
    return false;
}

// function to see if any enemy piece is within reach of the king horizontally
// pos is the current square number the king is on
// color is the color of the king
// oldPiecePos is where the current piece to be moved is
// newPiecePos is where the current piece to be moved may be moved
function horizontalCheck(pos, color, oldPiecePos, newPiecePos)
{
    pos = parseInt(pos);
    let p = pos;
    let previous_pos = pos % 8;
    var elementCheckResponse;

    // for left
    p = p - 1;
    while(previous_pos != 0)
    {
        // if at old piece, assume the square will be empty
        if(p == parseInt(oldPiecePos))
        {
            previous_pos = p % 8;
            p = p - 1;
            continue;
        }
        // if you get to where the new piece will be, it there is something
        // blocking the king
        if(p == parseInt(newPiecePos))
        {
            break;
        }
        elementCheckResponse = elementCheck(p, color);
        if(elementCheckResponse != null)
        {
            // if the piece is not friendly
            if(elementCheckResponse != "break")
            {
                // need to see if the piece can access the king
                let enemyElem = document.getElementById(String(p));
                // get the piece
                let enemyPiece = enemyElem.firstElementChild;
                if(enemyPiece.className == "queen" || enemyPiece.className == "rook")
                {
                    return true;
                }
            }
            break;
        }
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
        // if at old piece, assume the square will be empty
        if(p == parseInt(oldPiecePos))
        {
            previous_pos = p % 8;
            p = p + 1;
            continue;
        }
        // if you get to where the new piece will be, it there is something
        // blocking the king
        if(p == parseInt(newPiecePos))
        {
            break;
        }
        elementCheckResponse = elementCheck(p, color);
        // if there is a piece on the square
        if(elementCheckResponse != null)
        {
            // if the piece is not friendly
            if(elementCheckResponse != "break")
            {
                // need to see if the piece can access the king
                let enemyElem = document.getElementById(String(p));
                // get the piece
                let enemyPiece = enemyElem.firstElementChild;
                if(enemyPiece.className == "queen" || enemyPiece.className == "rook")
                {
                    return true;
                }
            }
            break;
        }
        // get position within row
        previous_pos = p % 8;
        p = p + 1;
    }
    return false;
}

// function to see if any enemy piece is within reach of the king diagonally
// pos is the current square number the king is on
// color is the color of the king
// oldPiecePos is where the current piece to be moved is
// newPiecePos is where the current piece to be moved may be moved
function diagonalCheck(pos, color, oldPiecePos, newPiecePos)
{
    pos = parseInt(pos);
    let p = pos;
    let previous_pos = pos % 8;
    var elementCheckResponse;

    // for up, left
    p = p - 9;
    while(p >= 0 && previous_pos != 0)
    {
        // if at old piece, assume the square will be empty
        if(p == parseInt(oldPiecePos))
        {
            previous_pos = p % 8;
            p = p - 9;
            continue;
        }
        // if you get to where the new piece will be, it there is something
        // blocking the king
        if(p == parseInt(newPiecePos))
        {
            break;
        }
        elementCheckResponse = elementCheck(p, color);
        // if there is a piece on the square
        if(elementCheckResponse != null)
        {
            // if the piece is not friendly
            if(elementCheckResponse != "break")
            {
                // need to see if the piece can access the king
                let enemyElem = document.getElementById(String(p));
                // get the piece
                let enemyPiece = enemyElem.firstElementChild;
                if(enemyPiece.className == "queen" || enemyPiece.className == "bishop")
                {
                    return true;
                }
                // check if the piece is a pawn
                // could have issue if the pawn is coming down the opposite way if it were to turn around
                // could keep track of pawns going the opposite direction in an array?
                if(color == "white")
                {
                    if(p == (pos - 9))
                    {
                        if(enemyPiece.className == "pawn")
                        {
                            return true;
                        }
                    }
                }
            }
            break;
        }
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
        // if at old piece, assume the square will be empty
        if(p == parseInt(oldPiecePos))
        {
            previous_pos = p % 8;
            p = p - 7;
            continue;
        }
        // if you get to where the new piece will be, it there is something
        // blocking the king
        if(p == parseInt(newPiecePos))
        {
            break;
        }
        elementCheckResponse = elementCheck(p, color);
        // if the there is a piece on the square
        if(elementCheckResponse != null)
        {
            // if the piece is not friendly
            if(elementCheckResponse != "break")
            {
                // need to see if the piece can access the king
                let enemyElem = document.getElementById(String(p));
                // get the piece
                let enemyPiece = enemyElem.firstElementChild;
                if(enemyPiece.className == "queen" || enemyPiece.className == "bishop")
                {
                    return true;
                }
                // check if the piece is a pawn
                if(color == "white")
                {
                    if(p == (pos - 7))
                    {
                        if(enemyPiece.className == "pawn")
                        {
                            return true;
                        }
                    }
                }
            }
            break;
        }
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
        // if at old piece, assume the square will be empty
        if(p == parseInt(oldPiecePos))
        {
            previous_pos = p % 8;
            p = p + 7;
            continue;
        }
        // if you get to where the new piece will be, it there is something
        // blocking the king
        if(p == parseInt(newPiecePos))
        {
            break;
        }
        elementCheckResponse = elementCheck(p, color);
        // if there is a piece on the square
        if(elementCheckResponse != null)
        {
            // if the piece is not friendly
            if(elementCheckResponse != "break")
            {
                // need to see if the piece can access the king
                let enemyElem = document.getElementById(String(p));
                // get the piece
                let enemyPiece = enemyElem.firstElementChild;
                if(enemyPiece.className == "queen" || enemyPiece.className == "bishop")
                {
                    return true;
                }
                // check if the piece is a pawn
                if(color == "black")
                {
                    if(p == (pos + 7))
                    {
                        if(enemyPiece.className == "pawn")
                        {
                            return true;
                        }
                    }
                }
            }
            break;
        }
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
        // if at old piece, assume the square will be empty
        if(p == parseInt(oldPiecePos))
        {
            previous_pos = p % 8;
            p = p + 9;
            continue;
        }
        // if you get to where the new piece will be, it there is something
        // blocking the king
        if(p == parseInt(newPiecePos))
        {
            break;
        }
        elementCheckResponse = elementCheck(p, color);
        // if there is a piece on the square
        if(elementCheckResponse != null)
        {
            // if the piece is not friendly
            if(elementCheckResponse != "break")
            {
                // need to see if the piece can access the king
                let enemyElem = document.getElementById(String(p));
                // get the piece
                let enemyPiece = enemyElem.firstElementChild;
                if(enemyPiece.className == "queen" || enemyPiece.className == "bishop")
                {
                    return true;
                }
                // check if the piece is a pawn
                if(color == "black")
                {
                    if(p == (pos + 9))
                    {
                        if(enemyPiece.className == "pawn")
                        {
                            return true;
                        }
                    }
                }
            }
            break;
        }
        // get position within row
        previous_pos = p % 8;
        // update value
        p = p + 9;
    }
    return false;
}


// function to see if any enemy piece is within reach of the king within the knights move
// pos is the current square number the king is on
// color is the color of the king
// oldPiecePos is where the current piece to be moved is
// newPiecePos is where the current piece to be moved may be moved
function knightCheck(pos, color, oldPiecePos, newPiecePos)
{
    pos = parseInt(pos);
    let p = pos;
    let row_pos = pos % 8;
    let elementCheckResponse;

    // for two up, one left
    // if alread at left most column, skip
    if(row_pos > 0)
    {
        p = p - 17;
        if(p >= 0)
        {
            elementCheckResponse = elementCheck(p, color);
            // if there is a piece on the square
            if(elementCheckResponse != null)
            {
                // if the piece is not friendly
                if(elementCheckResponse != "break")
                {
                    // need to see if the piece can access the king
                    let enemyElem = document.getElementById(String(p));
                    // get the piece
                    let enemyPiece = enemyElem.firstElementChild;
                    if(enemyPiece.className == "knight")
                    {
                        return true;
                    }
                }
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
            // if there is a piece on the square
            if(elementCheckResponse != null)
            {
                // if the piece is not friendly
                if(elementCheckResponse != "break")
                {
                    // need to see if the piece can access the king
                    let enemyElem = document.getElementById(String(p));
                    // get the piece
                    let enemyPiece = enemyElem.firstElementChild;
                    if(enemyPiece.className == "knight")
                    {
                        return true;
                    }
                }
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
            // if there is a piece on the square
            if(elementCheckResponse != null)
            {
                // if the piece is not friendly
                if(elementCheckResponse != "break")
                {
                    // need to see if the piece can access the king
                    let enemyElem = document.getElementById(String(p));
                    // get the piece
                    let enemyPiece = enemyElem.firstElementChild;
                    if(enemyPiece.className == "knight")
                    {
                        return true;
                    }
                }
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
            // if there is a piece on the square
            if(elementCheckResponse != null)
            {
                // if the piece is not friendly
                if(elementCheckResponse != "break")
                {
                    // need to see if the piece can access the king
                    let enemyElem = document.getElementById(String(p));
                    // get the piece
                    let enemyPiece = enemyElem.firstElementChild;
                    if(enemyPiece.className == "knight")
                    {
                        return true;
                    }
                }
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
            // if there is a piece on the square
            if(elementCheckResponse != null)
            {
                // if the piece is not frienly
                if(elementCheckResponse != "break")
                {
                    // need to see if the piece can access the king
                    let enemyElem = document.getElementById(String(p));
                    // get the piece
                    let enemyPiece = enemyElem.firstElementChild;
                    if(enemyPiece.className == "knight")
                    {
                        return true;
                    }
                }
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
            // if there is a piece on the square
            if(elementCheckResponse != null)
            {
                // if the piece is not friendly
                if(elementCheckResponse != "break")
                {
                    // need to see if the piece can access the king
                    let enemyElem = document.getElementById(String(p));
                    // get the piece
                    let enemyPiece = enemyElem.firstElementChild;
                    if(enemyPiece.className == "knight")
                    {
                        return true;
                    }
                }
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
            // if there is a piece on the square
            if(elementCheckResponse != null)
            {
                // if the piece is not friendly
                if(elementCheckResponse != "break")
                {
                    // need to see if the piece can access the king
                    let enemyElem = document.getElementById(String(p));
                    // get the piece
                    let enemyPiece = enemyElem.firstElementChild;
                    if(enemyPiece.className == "knight")
                    {
                        return true;
                    }
                }
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
            // if there is a piece on the square
            if(elementCheckResponse != null)
            {
                // if the piece is not friendly
                if(elementCheckResponse != "break")
                {
                    // need to see if the piece can access the king
                    let enemyElem = document.getElementById(String(p));
                    // get the piece
                    let enemyPiece = enemyElem.firstElementChild;
                    if(enemyPiece.className == "knight")
                    {
                        return true;
                    }
                }
            }
        }
    }
    return false;
}

// get all the blocks
//elems = document.querySelectorAll(".square");
var elems = document.getElementsByTagName('img');
var i = 0;
for(i = 0; i < elems.length; i++)
{
    // add a click listener to each block
    elems[i].addEventListener('click', function(e){ setFlash(e, this); }, false);
}

var squareElems = document.querySelectorAll(".square");
i = 0;
for(i = 0; i < squareElems.length; i++)
{
    // add a click event listener to each on the board
    // note: could potentially have a issue here if there is a piece on a square
    // and the event for the piece occurs and the event for the square occurs
    squareElems[i].addEventListener('click', function(e){ moveToEmptySquare(e, this); }, false);
}

setInterval(flash, 1000);
