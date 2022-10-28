const TemperatureColors = [
  [rgbToHexColor(155, 188, 255), 40000],
  [rgbToHexColor(155, 188, 255), 39500],
  [rgbToHexColor(155, 188, 255), 39000],
  [rgbToHexColor(155, 188, 255), 38500],
  [rgbToHexColor(156, 188, 255), 38000],
  [rgbToHexColor(156, 188, 255), 37500],
  [rgbToHexColor(156, 189, 255), 37000],
  [rgbToHexColor(156, 189, 255), 36500],
  [rgbToHexColor(156, 189, 255), 36000],
  [rgbToHexColor(157, 189, 255), 35500],
  [rgbToHexColor(157, 189, 255), 35000],
  [rgbToHexColor(157, 189, 255), 34500],
  [rgbToHexColor(157, 189, 255), 34000],
  [rgbToHexColor(157, 189, 255), 33500],
  [rgbToHexColor(158, 190, 255), 33000],
  [rgbToHexColor(158, 190, 255), 32500],
  [rgbToHexColor(158, 190, 255), 32000],
  [rgbToHexColor(158, 190, 255), 31500],
  [rgbToHexColor(159, 190, 255), 31000],
  [rgbToHexColor(159, 190, 255), 30500],
  [rgbToHexColor(159, 191, 255), 30000],
  [rgbToHexColor(159, 191, 255), 29500],
  [rgbToHexColor(160, 191, 255), 29000],
  [rgbToHexColor(160, 191, 255), 28500],
  [rgbToHexColor(160, 191, 255), 28000],
  [rgbToHexColor(161, 192, 255), 27500],
  [rgbToHexColor(161, 192, 255), 27000],
  [rgbToHexColor(161, 192, 255), 26500],
  [rgbToHexColor(162, 192, 255), 26000],
  [rgbToHexColor(162, 193, 255), 25500],
  [rgbToHexColor(163, 193, 255), 25000],
  [rgbToHexColor(163, 193, 255), 24500],
  [rgbToHexColor(163, 194, 255), 24000],
  [rgbToHexColor(164, 194, 255), 23500],
  [rgbToHexColor(164, 194, 255), 23000],
  [rgbToHexColor(165, 195, 255), 22500],
  [rgbToHexColor(166, 195, 255), 22000],
  [rgbToHexColor(166, 195, 255), 21500],
  [rgbToHexColor(167, 196, 255), 21000],
  [rgbToHexColor(168, 196, 255), 20500],
  [rgbToHexColor(168, 197, 255), 20000],
  [rgbToHexColor(169, 197, 255), 19500],
  [rgbToHexColor(170, 198, 255), 19000],
  [rgbToHexColor(171, 198, 255), 18500],
  [rgbToHexColor(172, 199, 255), 18000],
  [rgbToHexColor(173, 200, 255), 17500],
  [rgbToHexColor(174, 200, 255), 17000],
  [rgbToHexColor(175, 201, 255), 16500],
  [rgbToHexColor(176, 202, 255), 16000],
  [rgbToHexColor(177, 203, 255), 15500],
  [rgbToHexColor(179, 204, 255), 15000],
  [rgbToHexColor(180, 205, 255), 14500],
  [rgbToHexColor(182, 206, 255), 14000],
  [rgbToHexColor(184, 207, 255), 13500],
  [rgbToHexColor(186, 208, 255), 13000],
  [rgbToHexColor(188, 210, 255), 12500],
  [rgbToHexColor(191, 211, 255), 12000],
  [rgbToHexColor(193, 213, 255), 11500],
  [rgbToHexColor(196, 215, 255), 11000],
  [rgbToHexColor(200, 217, 255), 10500],
  [rgbToHexColor(204, 219, 255), 10000],
  [rgbToHexColor(208, 222, 255), 9500],
  [rgbToHexColor(214, 225, 255), 9000],
  [rgbToHexColor(220, 229, 255), 8500],
  [rgbToHexColor(227, 233, 255), 8000],
  [rgbToHexColor(235, 238, 255), 7500],
  [rgbToHexColor(245, 243, 255), 7000],
  [rgbToHexColor(255, 249, 253), 6500],
  [rgbToHexColor(255, 243, 239), 6000],
  [rgbToHexColor(255, 236, 224), 5500],
  [rgbToHexColor(255, 228, 206), 5000],
  [rgbToHexColor(255, 219, 186), 4500],
  [rgbToHexColor(255, 209, 163), 4000],
  [rgbToHexColor(255, 196, 137), 3500],
  [rgbToHexColor(255, 180, 107), 3000],
  [rgbToHexColor(255, 161, 72), 2500],
  [rgbToHexColor(255, 137, 18), 2000],
  [rgbToHexColor(255, 109, 0), 1500],
  [rgbToHexColor(255, 51, 0), 1000],
] as const;

export function getStarColor(temperature: number) {
  // let temperature = star.temperature || star.extends.temperature
  // temperature *= 5778 // SUN TEMPERATURE IN KELVINS
  const closestTemp = closest(
    temperature,
    TemperatureColors.map((e) => e[1])
  );
  const index = TemperatureColors.findIndex((c) => c[1] == closestTemp);
  return TemperatureColors[index][0];
}

function closest(num: number, arr: number[]) {
  var curr = arr[0];
  var diff = Math.abs(num - curr);
  for (var val = 0; val < arr.length; val++) {
    var newdiff = Math.abs(num - arr[val]);
    if (newdiff < diff) {
      diff = newdiff;
      curr = arr[val];
    }
  }
  return curr;
}

function componentToHex(c: number) {
  const hex = c.toString(16);
  return hex.length == 1 ? '0' + hex : hex;
}
function rgbToHexColor(r: number, g: number, b: number) {
  return '#' + componentToHex(r) + componentToHex(g) + componentToHex(b);
}
