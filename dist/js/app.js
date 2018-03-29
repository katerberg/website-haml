'use strict';

(function () {
    var colorValues = {
        sunrise: '#0984B2',
        noon: '#FFF210',
        sunset: '#FF0037',
        nadir: '#000000'
        // sunrise: '#baffc9',
        // noon: '#ffffba',
        // sunset: '#ffb3ba',
        // nadir: '#bae1ff',
    };
    var getColorBetween = function getColorBetween(c1, c2) {
        var distance = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0.5;

        var c = "#";
        for (var i = 0; i < 3; i++) {
            var sub1 = c1.substring(1 + 2 * i, 3 + 2 * i);
            var sub2 = c2.substring(1 + 2 * i, 3 + 2 * i);
            var v1 = parseInt(sub1, 16);
            var v2 = parseInt(sub2, 16);
            var v = Math.floor(v1 * (1 - distance) + v2 * distance);
            var sub = v.toString(16).toUpperCase();
            c += ('0' + sub).slice(-2);
        }
        return c;
    };

    var buildColors = function buildColors(elements) {
        var latitude = 38.6270;
        var longitude = -90.1994;
        var colors = [];
        for (var i = 0; i < elements.length; i++) {
            var elem = elements.item(i);
            var datetime = new Date(elem.getAttribute('data-date') + ' ' + elem.getAttribute('data-time-of-day') + ' CDT');
            var sunTimes = SunCalc.getTimes(datetime, latitude, longitude);
            var dateVal = datetime.valueOf();
            var timeAfterSunrise = dateVal - sunTimes.sunrise.valueOf();
            if (timeAfterSunrise < 0) {
                var _percentTil = (dateVal - sunTimes.nadir) / (sunTimes.sunrise - sunTimes.nadir);
                colors[i] = getColorBetween(colorValues.nadir, colorValues.sunrise, _percentTil);
                continue;
            }
            var timeAfterNoon = dateVal - sunTimes.solarNoon.valueOf();
            if (timeAfterNoon < 0) {
                var _percentTil2 = (dateVal - sunTimes.sunrise) / (sunTimes.solarNoon - sunTimes.sunrise);
                colors[i] = getColorBetween(colorValues.sunrise, colorValues.noon, _percentTil2);
                continue;
            }
            var timeAfterSunset = dateVal - sunTimes.sunset.valueOf();
            var percentTil = (dateVal - sunTimes.sunset) / (sunTimes.sunrise - sunTimes.sunset);
            if (timeAfterSunset < 0) {
                colors[i] = getColorBetween(colorValues.noon, colorValues.sunset, percentTil);
                continue;
            }
            colors[i] = getColorBetween(colorValues.sunset, colorValues.nadir, percentTil);
        }
        return colors;
    };

    var populateColors = function populateColors() {
        var elements = document.getElementsByClassName('color');
        var elemStorage = buildColors(elements);
        elemStorage.forEach(function (e, i) {
            var prev = elemStorage[i - 1];
            if (prev) {
                prev = getColorBetween(prev, e);
            } else {
                prev = '#fff';
            }
            var next = elemStorage[i + 1];
            if (next) {
                next = getColorBetween(next, e);
            } else {
                next = '#fff';
            }
            elements.item(i).setAttribute('style', 'background: linear-gradient(' + prev + ', ' + e + ', ' + next + ')');
        });
    };

    window.addEventListener('load', populateColors, false);
})();