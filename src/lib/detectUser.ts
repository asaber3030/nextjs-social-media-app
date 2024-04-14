export function detectBrowser() {
  var userAgent = navigator.userAgent;
  if (userAgent.indexOf("Edg") > -1) {
      return "Microsoft Edge";
  } else if (userAgent.indexOf("Chrome") > -1) {
      return "Chrome";
  } else if (userAgent.indexOf("Firefox") > -1) {
      return "Firefox";
  } else if (userAgent.indexOf("Safari") > -1) {
      return "Safari";
  } else if (userAgent.indexOf("Opera") > -1) {
      return "Opera";
  } else if (userAgent.indexOf("Trident") > -1 || userAgent.indexOf("MSIE") > -1) {
      return "Internet Explorer";
  }
  return "Unknown";
}

export function detectOS() {
  const userAgent = window.navigator.userAgent,
      platform = window.navigator?.platform || window.navigator.platform,
      macosPlatforms = ['macOS', 'Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
      windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
      iosPlatforms = ['iPhone', 'iPad', 'iPod'];
  let os = null;

  if (macosPlatforms.indexOf(platform) !== -1) {
    os = 'Mac OS';
  } else if (iosPlatforms.indexOf(platform) !== -1) {
    os = 'iOS';
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    os = 'Windows';
  } else if (/Android/.test(userAgent)) {
    os = 'Android';
  } else if (/Linux/.test(platform)) {
    os = 'Linux';
  }

  return os;
}