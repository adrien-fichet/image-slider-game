var ClipImage = function(imgSrc, width, pos) {
    var self = this;
    self.imgSrc = imgSrc;
    self.width = width;
    self.pos = pos;
    self.img = null;
    self.viewport = null;

    self.createViewport = function() {
        self.createImage();
        self.viewport = document.createElement('div');
        self.viewport.setAttribute('class', 'viewport');
        self.viewport.setAttribute('onclick', 'moveImage(' + self.pos + ')');
        self.viewport.appendChild(self.img);
    };

    self.createImage = function() {
        self.img = document.createElement('img');
        self.img.setAttribute('src', self.imgSrc);
        self.img.setAttribute('alt', '');
        self.img.setAttribute('class', 'clip');
        self.img.setAttribute('width', self.width + 'px');
        self.img.setAttribute('height', self.width + 'px');
    };

    self.setViewport = function(x, y, width, height) {
        self.img.style.top = '-' + x + 'px';
        self.img.style.left = '-' + y + 'px';
        self.img.parentNode.style.width = width + 'px';
        self.img.parentNode.style.height = height + 'px';
    };

};



