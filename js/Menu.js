var Menu = function() {
    var self = this;
    self.div = document.querySelector('#menu')
    self.height = parseInt(window.getComputedStyle(self.div).height);
    self.decNbOfTilesVButton = document.createElement('button');
    self.nbOfTilesVText = document.createElement('span');
    self.incNbOfTilesVButton = document.createElement('button');
    self.decNbOfTilesHButton = document.createElement('button');
    self.nbOfTilesHText = document.createElement('span');
    self.incNbOfTilesHButton = document.createElement('button');
    self.restartButton = document.createElement('button');
    self.photoButton = document.createElement('button');
    self.text = document.createElement('span');

    self.setUp = function() {
        self.addNbOfTilesVButtons();
        self.addNbOfTilesHButtons();
        self.addRestartButton();
        self.addPhotoButton();
        self.addText();
    };

    self.addNbOfTilesVButtons = function() {
        self.decNbOfTilesVButton.innerHTML = '-';
        self.div.appendChild(self.decNbOfTilesVButton);
        self.div.appendChild(self.nbOfTilesVText);
        self.incNbOfTilesVButton.innerHTML = '+';
        self.div.appendChild(self.incNbOfTilesVButton);
    };

    self.setNbOfTilesVText = function(text) {
        self.nbOfTilesVText.innerHTML = text;
    };

    self.addNbOfTilesHButtons = function() {
        self.decNbOfTilesHButton.innerHTML = '-';
        self.div.appendChild(self.decNbOfTilesHButton);
        self.div.appendChild(self.nbOfTilesHText);
        self.incNbOfTilesHButton.innerHTML = '+';
        self.div.appendChild(self.incNbOfTilesHButton);
    };

    self.setNbOfTilesHText = function(text) {
        self.nbOfTilesHText.innerHTML = text;
    };

    self.addRestartButton = function() {
        self.restartButton.innerHTML = 'R';
        self.div.appendChild(self.restartButton);
    };

    self.addPhotoButton = function() {
        if (navigator.webkitGetUserMedia != null) {
            self.photoButton.innerHTML = 'P';
            self.div.appendChild(self.photoButton);
        }
    };

    self.addText = function() {
        self.div.appendChild(self.text);
    };

    self.showText = function(text) {
        self.text.style.display = 'inline';
        self.text.innerHTML = text;
    };

    self.hideText = function() {
        self.text.style.display = 'none';
        self.text.innerHTML = '';
    };

    self.removePhotoButton = function() {
        self.div.removeChild(self.photoButton);
    };

};
