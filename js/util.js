function min(v1, v2)
{
    v1 = parseInt(v1);
    v2 = parseInt(v2);
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
    v1 = parseInt(v1);
    v2 = parseInt(v2);
    if (isNaN(v1)) {
        return v2;
    }
    if (isNaN(v2)) {
        return v1;
    }
    return Math.max(v1, v2);
}