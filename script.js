


function update(e, square) {
    e.preventDefault();
    elem = document.getElementById('one');
    square.style.background = "blue";

}



elem = document.getElementById('one')
elem.addEventListener("click", function(e){update(e, this);}, false);

function flash()
{
    elem = document.getElementById('one');
    if(elem.style.background === 'blue')
    {
        elem.style.background = 'black';
    }
    else
    {
        elem.style.background = 'blue';
    }
}

setInterval(flash, 1000);
