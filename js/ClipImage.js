var ClipImage = function(imgSrc, width) {
    var self = this;
    self.imgSrc = imgSrc;
    self.width = width;

    self.createViewport = function() {
        var viewport = document.createElement('div');
        viewport.setAttribute('class', 'viewport');
        viewport.appendChild(self.createClip());
        return viewport;
    };

    self.createClip = function() {
        var img = document.createElement('img');
        img.setAttribute('src', self.imgSrc);
        img.setAttribute('alt', '');
        img.setAttribute('class', 'clip');
        img.setAttribute('width', self.width + 'px');
        img.setAttribute('height', self.width + 'px');
        return img;
    };

    self.setViewport = function(img, x, y, width, height) {
        img.style.top = '-' + x + 'px';
        img.style.left = '-' + y + 'px';
        img.parentNode.style.width = width + 'px';
        img.parentNode.style.height = height + 'px';
    };
};



