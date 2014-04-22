var Menu = function() {
    var self = this;
    self.div = document.querySelector('#menu')
    self.height = parseInt(window.getComputedStyle(self.div).height);
    self.decreaseNumberOfSlicesVerticalButton = null;
    self.numberOfSlicesVerticalText = null;
    self.increaseNumberOfSlicesVerticalButton = null;
    self.decreaseNumberOfSlicesHorizontalButton = null;
    self.numberOfSlicesHorizontalText = null;
    self.increaseNumberOfSlicesHorizontalButton = null;

    self.setUp = function() {
        self.addNumberOfSlicesVerticalButtons();
        self.addNumberOfSlicesHorizontalButtons();
    };

    self.addNumberOfSlicesVerticalButtons = function() {
        self.decreaseNumberOfSlicesVerticalButton = document.createElement('button');
        self.decreaseNumberOfSlicesVerticalButton.innerHTML = '-';
        self.div.appendChild(self.decreaseNumberOfSlicesVerticalButton);

        self.numberOfSlicesVerticalText = document.createElement('span');
        self.div.appendChild(self.numberOfSlicesVerticalText);

        self.increaseNumberOfSlicesVerticalButton = document.createElement('button');
        self.increaseNumberOfSlicesVerticalButton.innerHTML = '+';
        self.div.appendChild(self.increaseNumberOfSlicesVerticalButton);
    };

    self.setNumberOfSlicesVerticalText = function(text) {
        self.numberOfSlicesVerticalText.innerHTML = text;
    };

    self.addNumberOfSlicesHorizontalButtons = function() {
        self.decreaseNumberOfSlicesHorizontalButton = document.createElement('button');
        self.decreaseNumberOfSlicesHorizontalButton.innerHTML = '-';
        self.div.appendChild(self.decreaseNumberOfSlicesHorizontalButton);

        self.numberOfSlicesHorizontalText = document.createElement('span');
        self.div.appendChild(self.numberOfSlicesHorizontalText);

        self.increaseNumberOfSlicesHorizontalButton = document.createElement('button');
        self.increaseNumberOfSlicesHorizontalButton.innerHTML = '+';
        self.div.appendChild(self.increaseNumberOfSlicesHorizontalButton);
    };

    self.setNumberOfSlicesHorizontalText = function(text) {
        self.numberOfSlicesHorizontalText.innerHTML = text;
    };

};
