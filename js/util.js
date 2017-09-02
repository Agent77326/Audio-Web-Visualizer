function rand(min, max) {
	return Math.round(Math.random() * max) + min;
}

function toHex(x){
	var hex = x.toString(16);
	return hex.length === 1 ? '0' + hex : hex;
}

function hslToRgb(h, s, l){
	h = h / 360;
	s = s / 100;
	l = l / 100;
    var r, g, b;

    if(s == 0){
        r = g = b = l; // achromatic
    }else{
        var hue2rgb = function hue2rgb(p, q, t){
            if(t < 0) t += 1;
            if(t > 1) t -= 1;
            if(t < 1/6) return p + (q - p) * 6 * t;
            if(t < 1/2) return q;
            if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        }

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        console.log(h + ", " + q + ", " + p);
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
        console.log(r + ", " + g + ", " + b);
    }
    console.log({"r": Math.round(r * 255), "g": Math.round(g * 255), "b": Math.round(b * 255)});
    return {"r": Math.round(r * 255), "g": Math.round(g * 255), "b": Math.round(b * 255)};
}

function hslToHex(h, s, l) {
	var rgb = hslToRgb(h, s, l);
	console.log("#" + toHex(rgb.r) + toHex(rgb.g) + toHex(rgb.b));
	return "#" + toHex(rgb.r) + toHex(rgb.g) + toHex(rgb.b);
}