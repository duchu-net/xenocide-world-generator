function toFixed(x) {
    if (Math.abs(x) < 1.0) {
        let e = parseInt(x.toString().split('e-')[1]);
        if (e) {
            x *= Math.pow(10, e - 1);
            // @ts-ignore
            x = '0.' + new Array(e).join('0') + x.toString().substring(2);
        }
    }
    else {
        let e = parseInt(x.toString().split('+')[1]);
        if (e > 20) {
            e -= 20;
            x /= Math.pow(10, e);
            // @ts-ignore
            x += new Array(e + 1).join('0');
        }
    }
    return String(x);
}
export const toFixedTrunc = (value, decimals) => {
    const str = toFixed(value).split('.');
    if (decimals <= 0)
        return str[0];
    let decimal = str[1] || '';
    if (decimal.length > decimals)
        return `${str[0]}.${decimal.substr(0, decimals)}`;
    while (decimal.length < decimals)
        decimal += '0';
    return `${str[0]}.${decimal}`;
};
export const truncDecimals = (value, decimals) => {
    return parseFloat(toFixedTrunc(value, decimals));
};
/**
 * Spherical coordinate system to polar angle
 * @param phi phi (ϕ) in methematics meaning, angle with respect to polar axis
 * @returns
 */
export const sphericalPhiToPolarAngle = (phi) => phi * (180 / Math.PI);
