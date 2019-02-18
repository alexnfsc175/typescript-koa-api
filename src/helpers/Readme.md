```javascript
function countSteps(val, step, overflow) {
  //if (val/step == 0) mod oveflow will return NaN, so ~~ converts it to 0
  return overflow
    ? ~~(Math.floor(val / step) % overflow)
    : Math.floor(val / step);
}

function parseMs(ms) {
  return {
    milliseconds: countSteps(ms, 1, 1000),
    seconds: countSteps(ms, 1000, 60),
    minutes: countSteps(ms, 60000, 60),
    hours: countSteps(ms, 3600000, 24),
    days: countSteps(ms, 86400000)
  };
}
parseMs(
  new Date("2019-02-15T23:36:15.212Z") - new Date("2019-02-17T23:36:15.212Z")
);

diff = {
  milliseconds: 0,
  seconds: 0,
  minutes: 0,
  hours: 0,
  days: -2
};
```

```html
<p id="demo"></p>

<script>
  // Set the date we're counting down to
  var countDownDate = new Date("2019-02-18T00:57:34.967Z").getTime();

  var x = setInterval(function() {
    var now = new Date().getTime();
    var ms = countDownDate - now;
    function countSteps(val, step, overflow) {
      return overflow
        ? ~~(Math.floor(val / step) % overflow)
        : Math.floor(val / step);
    }

    function parseMs(ms) {
      return {
        milliseconds: countSteps(ms, 1, 1000),
        seconds: countSteps(ms, 1000, 60),
        minutes: countSteps(ms, 60000, 60),
        hours: countSteps(ms, 3600000, 24),
        days: countSteps(ms, 86400000)
      };
    }

    var diff = parseMs(ms);

    document.getElementById("demo").innerHTML =
      diff.days +
      "d " +
      diff.hours +
      "h " +
      diff.minutes +
      "m " +
      diff.seconds +
      "s " +
      diff.milliseconds +
      " milli";
  }, 1000);
</script>
```
