var Menu = function() {
    var self = this;
    self.div = document.querySelector('#menu')
    self.height = parseInt(window.getComputedStyle(self.div).height);
    self.decNbOfTilesVButton = null;
    self.nbOfTilesVText = null;
    self.incNbOfTilesVButton = null;
    self.decNbOfTilesHButton = null;
    self.nbOfTilesHText = null;
    self.incNbOfTilesHButton = null;
    self.restartButton = null;

    self.setUp = function() {
        self.addNbOfTilesVButtons();
        self.addNbOfTilesHButtons();
        self.addRestartButton();
    };

    self.addNbOfTilesVButtons = function() {
        self.decNbOfTilesVButton = document.createElement('button');
        self.decNbOfTilesVButton.innerHTML = '-';
        self.div.appendChild(self.decNbOfTilesVButton);

        self.nbOfTilesVText = document.createElement('span');
        self.div.appendChild(self.nbOfTilesVText);

        self.incNbOfTilesVButton = document.createElement('button');
        self.incNbOfTilesVButton.innerHTML = '+';
        self.div.appendChild(self.incNbOfTilesVButton);
    };

    self.setNbOfTilesVText = function(text) {
        self.nbOfTilesVText.innerHTML = text;
    };

    self.addNbOfTilesHButtons = function() {
        self.decNbOfTilesHButton = document.createElement('button');
        self.decNbOfTilesHButton.innerHTML = '-';
        self.div.appendChild(self.decNbOfTilesHButton);

        self.nbOfTilesHText = document.createElement('span');
        self.div.appendChild(self.nbOfTilesHText);

        self.incNbOfTilesHButton = document.createElement('button');
        self.incNbOfTilesHButton.innerHTML = '+';
        self.div.appendChild(self.incNbOfTilesHButton);
    };

    self.setNbOfTilesHText = function(text) {
        self.nbOfTilesHText.innerHTML = text;
    };

    self.addRestartButton = function() {
        self.restartButton = document.createElement('button');
        self.restartButton.innerHTML = 'R';
        self.div.appendChild(self.restartButton);
    };

};
