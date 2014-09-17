function min(v1, v2)
{
    v1 = parseFloat(v1);
    v2 = parseFloat(v2);
    if (isNaN(v1)) {
        return v2;
    }
    if (isNaN(v2)) {
        return v1;
    }
    return Math.min(v1, v2);
}

function max(v1, v2)
{
    v1 = parseFloat(v1);
    v2 = parseFloat(v2);
    if (isNaN(v1)) {
        return v2;
    }
    if (isNaN(v2)) {
        return v1;
    }
    return Math.max(v1, v2);
}

function formatPoints(points)
{
    return (points < 0 ? '' : '+') + points.toFixed(1);
}

function mixColors(c1, c2, balance)
{
    return rgbToHex(
        parseInt((balance*c1[0] + (1-balance)*c2[0])),
        parseInt((balance*c1[1] + (1-balance)*c2[1])),
        parseInt((balance*c1[2] + (1-balance)*c2[2]))
    );
}

function rgbToHex(r, g, b)
{
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}