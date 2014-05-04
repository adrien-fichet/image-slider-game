var Shuffler = function() {
    var self = this;

    self.mix = function(nbOfTilesV, nbOfTilesH) {
        var result = new Array();
        var tmp = new Array();
        var size = nbOfTilesV * nbOfTilesH - 1;
        var blnkx, blnky;
        var c=0;
        var s1 = -1;
        var s2 = -1;

        for (var i=0; i <= size; i++) {
            tmp[i] = i;
        }

        tmp[size-1] = -1;
        tmp[size-2] = -1;

        for (var i=0; i < nbOfTilesH; i++) {
            for (var j=0; j < nbOfTilesV; j++) {
                k = Math.floor(Math.random() * tmp.length);
                result[c] = tmp[k];

                if (tmp[k] == size) {
                    blnkx = j;
                    blnky = i;
                }

                tmp[k] = tmp[tmp.length-1];
                tmp.length--;
                c++;
            }
        }

        for (var i=0; i <= size; i++) {
            if (result[i] == -1) {
                if (s1 < 0) {
                    s1 = i;
                    result[s1] = size - 1;
                } else {
                    s2 = i;
                    result[s2] = size - 2;
                    break;
                }
            }
        }

        for (var i=1; i <= size; i++) {
            for (var j=0; j < i; j++) {
                if (result[j] > result[i]) {
                    c++;
                }
            }
        }

        c += (nbOfTilesV - 1) - blnkx + (nbOfTilesH - 1) - blnky;

        if(c % 2 != 0) {
            result[s1] = size - 2;
            result[s2] = size - 1;
        }

        return result;
    };
};
