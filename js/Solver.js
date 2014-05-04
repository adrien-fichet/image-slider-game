var Solver = function(tiles, nbOfTilesV, nbOfTilesH) {
    var self = this;
    self.tiles = tiles;
    self.nbOfTilesV = nbOfTilesV;
    self.nbOfTilesH = nbOfTilesH;
    self.nbOfTiles = nbOfTilesV * nbOfTilesH - 1;
    self.blnkx = -1;
    self.blnky = -1;
    self.clips = [];
    self.sol = [];

    self.solve = function() {
        for (var i=0; i < self.tiles.length; i++) {
            self.clips.push(self.tiles[i].clipIndex);

            if (self.tiles[i].hidden) {
                self.blnkx = i % nbOfTilesV;
                self.blnky = Math.floor(i / nbOfTilesV);
            }
        }

        self.nPuzzleSolver();
        return self.sol;
    };

    self.nPuzzleSolver = function() {
        // Inspired by http://www.jaapsch.net/puzzles/javascript/fifteenj.htm
        var back = new Array();
        for (var i=0; i <= self.nbOfTiles; i++) back[i] = self.clips[i];
        back[self.nbOfTiles+1] = self.blnkx;
        back[self.nbOfTiles+2] = self.blnky;

        var rr=0;
        for (var r=0; r < self.nbOfTilesH-2; r++) {
            for (var c=0; c < self.nbOfTilesV; c++) self.movepiece(rr+c, r, c);
            rr += self.nbOfTilesV;
        }

        for (c=0; c < self.nbOfTilesV-2; c++) {
            self.movepiece(rr, self.nbOfTilesH-2, c);

            if (self.blnkx == c) self.push(3);
            if (self.clips[rr+self.nbOfTilesV] != rr + self.nbOfTilesV) {
                self.movepiece(rr+self.nbOfTilesV, self.nbOfTilesH-1, c+1);

                if (self.blnky != self.nbOfTilesH - 1) {
                    if (self.blnkx == c+1) self.push(3);
                    self.push(2);
                }

                while (self.blnkx > c+2) self.push(0);
                self.push(0,0,1,3,2,3,1,0,0,2,3);
            }
            rr++;
        }

        if (self.blnkx < self.nbOfTilesV-1) self.push(3);
        if (self.blnky < self.nbOfTilesH-1) self.push(2);
        rr = self.nbOfTiles - self.nbOfTilesV - 1;
        if (self.clips[rr] == rr+1) self.push(1,0,2,3);
        if (self.clips[rr] == rr+self.nbOfTilesV) self.push(0,1,3,2);

        for (var i=0; i <= self.nbOfTiles;i++) self.clips[i] = back[i];
        self.blnkx = back[self.nbOfTiles+1];
        self.blnky = back[self.nbOfTiles+2];
    };

    self.movepiece = function(p, y, x) {
        var c = -1;

        for (var i=0; i < self.nbOfTilesH; i++) {
            for (var j=0; j < self.nbOfTilesV; j++) {
                c++;
                if (self.clips[c] == p) break;
            }
            if (self.clips[c] == p) break;
        }

        if (j < x && self.blnky == y) self.push(2);

        while(j > x) {
            if (self.blnky == i && self.blnkx > j) {
                if (i == self.nbOfTilesH-1) self.push(1); else self.push(2);
            }

            while(self.blnkx>=j) self.push(0);
            while(self.blnkx<j-1) self.push(3);
            while(self.blnky<i) self.push(2);
            while(self.blnky>i) self.push(1);
            self.push(3);
            j--;
        }

        while(j<x){
            if (self.blnky == i && self.blnkx < j) {
                if (i == self.nbOfTilesH-1) self.push(1); else self.push(2);
            }

            while(self.blnkx<=j) self.push(3);
            while(self.blnkx>j+1) self.push(0);
            while(self.blnky<i) self.push(2);
            while(self.blnky>i) self.push(1);
            self.push(0);
            j++;
        }

        while (i > y) {
            if (y < i-1) {
                while (self.blnky < i-1) self.push(2);
                if (self.blnkx == j) self.push(j == self.nbOfTilesV-1 ? 0 : 3);
                while (self.blnky > i-1) self.push(1);
                while (self.blnkx < j) self.push(3);
                while (self.blnkx > j) self.push(0);
                self.push(2);
            } else {
                if (j != self.nbOfTilesV-1) {
                    if (self.blnky == i) self.push(2);
                    while (self.blnkx < j+1) self.push(3);
                    while (self.blnkx > j+1) self.push(0);
                    while (self.blnky > i-1) self.push(1);
                    while (self.blnky < i-1) self.push(2);
                    self.push(0, 2);
                } else {
                    if (self.blnky < i && self.blnkx == j) {
                        while(self.blnky<i) self.push(2);
                    }else{
                        while (self.blnky > i+1) self.push(1);
                        while (self.blnky < i+1) self.push(2);
                        while (self.blnkx < j) self.push(3);
                        while (self.blnkx > j) self.push(0);
                        self.push(1,1,0,2,3,2,0,1,1,3,2);
                    }
                }
            }
            i--;
        }

        while ( i < y) {
            if (self.blnkx == j && self.blnky < i) {
                if (j == self.nbOfTilesV-1) self.push(0); else self.push(3);
            }
            while (self.blnky > i+1) self.push(1);
            while (self.blnky < i+1) self.push(2);
            while (self.blnkx < j) self.push(3);
            while (self.blnkx > j) self.push(0);
            self.push(1);
            i++;
        }
    };

    self.push = function(){
        for (var i=0; i < self.push.arguments.length; i++) {
            var c = self.push.arguments[i];
            self.domove(c);
        }
    };

    self.domove = function(m) {
        var d = self.blnkx + self.blnky * self.nbOfTilesV;

        if (m == 0) {
            self.clips[d] = self.clips[d-1];
            self.clips[d-1] = self.nbOfTiles;
            self.blnkx--;
            self.sol.push(d-1);
        } else if (m == 1) {
            self.clips[d] = self.clips[d-self.nbOfTilesV];
            self.clips[d-self.nbOfTilesV] = self.nbOfTiles;
            self.blnky--;
            self.sol.push(d-self.nbOfTilesV);
        } else if (m == 2) {
            if (d+self.nbOfTilesV <= self.nbOfTilesV * self.nbOfTilesH) {
                self.clips[d] = self.clips[d+self.nbOfTilesV];
                self.clips[d+self.nbOfTilesV] = self.nbOfTiles;
                self.blnky++;
                self.sol.push(d+self.nbOfTilesV);
            }
        } else if (m==3) {
            self.clips[d] = self.clips[d+1];
            self.clips[d+1] = self.nbOfTiles;
            self.blnkx++;
            self.sol.push(d+1);
        }
    };
};
