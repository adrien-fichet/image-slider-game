function setViewport(img, x, y, width, height) {
    img.style.top = '-' + x + 'px';
    img.style.left = '-' + y + 'px';
    img.parentNode.style.width = width + 'px';
    img.parentNode.style.height = height + 'px';
}

for (var i=0; i < 9; i++) {
    var img = document.createElement('img');
    img.setAttribute('src', 'im/logo.png');
    img.setAttribute('alt', '');
    img.setAttribute('class', 'clip');

    var div = document.createElement('div');
    div.setAttribute('class', 'viewport');
    div.appendChild(img);
    document.querySelector('#grid').appendChild(div);

}

var clipImages = document.querySelectorAll('.clip');

for (var i=0; i < clipImages.length; i++) {
    setViewport(clipImages[i], Math.floor(i / 3) * 100, (i % 3) * 100, 100, 100);
}

