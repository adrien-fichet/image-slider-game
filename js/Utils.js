var Utils = function() {
    var self = this;

    self.dimensions = function(element){
        return {width: parseInt(window.getComputedStyle(element).width),
                height: parseInt(window.getComputedStyle(element).height)
        };
    };

    self.shuffle = function(a){
        for (var j, x, i = a.length; i; j = parseInt(Math.random() * i), x = a[--i], a[i] = a[j], a[j] = x);
    };
};

