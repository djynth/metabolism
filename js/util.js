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