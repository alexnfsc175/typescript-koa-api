import * as moment from 'moment-timezone';

export default class Util {
  private static _default: Util;

  static getInstance(): Util {
    if (!Util._default) {
      Util._default = new Util();
    }
    return Util._default;
  }

  /**
   * Merge various array.
   *
   * @param {Array} arr Array to clean invalid values.
   * @param {String} path Property inside array to merge.
   */
  flatten(arr, path = null) {
    return arr.reduce((flat, toFlatten) => {
      return flat.concat(
        Array.isArray(toFlatten)
          ? this.flatten(toFlatten, path)
          : path
          ? toFlatten[path]
          : toFlatten
      );
    }, []);
  }

  /**
   * Divide um array em size pedaços. O último pedaço pode conter menos elementos que o parâmetro size.
   *
   * @param {Number} size
   * @param {Array} array
   *
   */

  toChunk(size, array) {
    return [].concat.apply(
      [],
      array.map(function(elem, i) {
        return i % size ? [] : [array.slice(i, i + size)];
      })
    );
  }

  removeWeekday(date) {
    let d = date.clone();
    let now = moment();
    const DAYS_MILLISECONDS = 86400 * 1000;

    let ms_remove = 0;

    while (d.isSameOrBefore(now)) {
      d.add(8, "hours");

      // Se for sabado ou domingo add 1 dia
      while (d.isoWeekday() == 6 || d.isoWeekday() == 7) {
        d.add(1, "days");
        ms_remove += DAYS_MILLISECONDS;
      }
    }
    return ms_remove;
  }

  formatSeconds(seconds: number) {
    const DAYS_SECONDS = 86400;
    const HOURS_SECONDS = 3600;
    const MINUTES_SECONDS = 60;
    const HOURS_DAY = 24;

    let days = 0;
    let hours = 0;
    let minutes = 0;
    let isNegative = false;
    if (seconds < 0) {
      isNegative = true;
      seconds = DAYS_SECONDS + (seconds % DAYS_SECONDS);
    }

    if (seconds >= DAYS_SECONDS) {
      days = seconds / DAYS_SECONDS;
      seconds = seconds - days * DAYS_SECONDS;
    }
    if (days > 0) {
      hours += days * HOURS_DAY;
    }

    if (seconds >= HOURS_SECONDS) {
      hours = seconds / HOURS_SECONDS;
      seconds = seconds - hours * HOURS_SECONDS;
    }
    if (seconds >= MINUTES_SECONDS) {
      minutes = seconds / MINUTES_SECONDS;
      seconds = seconds - minutes * MINUTES_SECONDS;
    }

    return {
      time: `${hours}:${minutes}:${seconds}`,
      isNegative: isNegative
    };
    // return `${days} dia(s) ${hours} hora(s) ${minutes} minuto(s) e ${seconds} segundo(s)`;
  }

  async getExpressRotes (options) {
    let app = options.express || {};
    let except = options.except || {};

    let routes = [],
      routesUniques = [];

    function print(path, layer) {
      if (layer.route) {
        layer.route.stack.forEach(
          print.bind(null, path.concat(split(layer.route.path)))
        );
      } else if (layer.name === "router" && layer.handle.stack) {
        layer.handle.stack.forEach(
          print.bind(null, path.concat(split(layer.regexp)))
        );
      } else if (layer.method) {
        // console.log('%s /%s',
        //     layer.method.toUpperCase(),
        //     path.concat(split(layer.regexp)).filter(Boolean).join('/'))

        routes.push({
          method: layer.method.toUpperCase(),
          path: path
            .concat(split(layer.regexp))
            .filter(Boolean)
            .join("/")
        });
      }
    }

    function split(thing) {
      if (typeof thing === "string") {
        return thing.split("/");
      } else if (thing.fast_slash) {
        return "";
      } else {
        var match = thing
          .toString()
          .replace("\\/?", "")
          .replace("(?=\\/|$)", "$")
          .match(
            /^\/\^((?:\\[.*+?^${}()|[\]\\\/]|[^.*+?^${}()|[\]\\\/])*)\$\//
          );
        return match
          ? match[1].replace(/\\(.)/g, "$1").split("/")
          : "<complex:" + thing.toString() + ">";
      }
    }

    await app._router.stack.forEach(print.bind(null, []));

    let excepts = [...except];

    for (let r of routes) {
      for (let ex of except) {
        let reg = RegExp(ex, "ig");
        if (reg.test(r.path)) excepts.push(r.path);
      }

      if (excepts.indexOf(r.path) == -1) {
        if (r.path.match(/\//g) && r.path.match(/\//g).length == 1) {
          routesUniques.indexOf(r.path) < 0 ? routesUniques.push(r.path) : null;
        }

        let match = r.path.match(/^(?:.*?\/){2}/gi, "");

        if (match) {
          let m = match[0].slice(0, -1);
          routesUniques.indexOf(m) < 0 ? routesUniques.push(m) : null;
        }
      }
    }
    return {
      routes,
      routesUniques
    };
  };
}
