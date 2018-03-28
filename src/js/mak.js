(() => {
    const colorValues = {
        sunrise: '#0984B2',
        noon: '#FFF210',
        sunset: '#FF0037',
        nadir: '#000000',
    }
    const getColorBetween = (c1, c2, distance) => {
        let c = "#";
        for(let i = 0; i<3; i++) {
            const sub1 = c1.substring(1+2*i, 3+2*i);
            const sub2 = c2.substring(1+2*i, 3+2*i);
            const v1 = parseInt(sub1, 16);
            const v2 = parseInt(sub2, 16);
            const v = Math.floor((v1 + v2) * (distance || 0.5));
            const sub = v.toString(16).toUpperCase();
            c += ('0'+sub).slice(-2);
        }
        return c;
    }

    const buildColors = (elements) => {
        const latitude = 38.6270;
        const longitude = -90.1994;
        const colors = [];
        for (let i = 0; i < elements.length; i++) {
            const elem = elements.item(i);
            const datetime = new Date(`${elem.getAttribute('data-date')} ${elem.getAttribute('data-time-of-day')} CDT`);
            const sunTimes = SunCalc.getTimes(datetime, latitude, longitude);
            const dateVal = datetime.valueOf();
            const timeAfterSunrise = dateVal - sunTimes.sunrise.valueOf();
            if (timeAfterSunrise < 0) {
                const percentTil = (dateVal - sunTimes.nadir) / (sunTimes.sunrise - sunTimes.nadir);
                colors[i] = getColorBetween(colorValues.nadir, colorValues.sunrise, percentTil);
                continue;
            }
            const timeAfterNoon = dateVal - sunTimes.solarNoon.valueOf();
            if (timeAfterNoon < 0) {
                const percentTil = (dateVal - sunTimes.sunrise) / (sunTimes.solarNoon - sunTimes.sunrise);
                colors[i] = getColorBetween(colorValues.sunrise, colorValues.noon, percentTil);
                continue;
            }
            const timeAfterSunset = dateVal - sunTimes.sunset.valueOf();
            const percentTil = (dateVal - sunTimes.sunset) / (sunTimes.sunrise - sunTimes.sunset);
            if (timeAfterSunset < 0) {
                colors[i] = getColorBetween(colorValues.noon, colorValues.sunset, percentTil);
                continue;
            }
            colors[i] = getColorBetween(colorValues.sunset, colorValues.nadir, percentTil);
        }
        console.log('MAK');
        console.log(colors);
        return colors;
    };

    const populateColors = () => {
        const elements = document.getElementsByClassName('color');
        const elemStorage = buildColors(elements);
        elemStorage.forEach((e, i) => {
            let prev = elemStorage[i - 1];
            if (prev) {
                prev = getColorBetween(prev, e);
            } else {
                prev = '#fff';
            }
            let next = elemStorage[i + 1];
            if (next) {
                next = getColorBetween(next, e);
            } else {
                next = '#fff';
            }
            elements.item(i).setAttribute('style', `background: linear-gradient(${prev}, ${e}, ${next})`);
        });
    };

    window.addEventListener('load', populateColors, false);
})();
