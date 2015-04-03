angular
  .module('browserApp')
  .filter('uptime', function () {
    return function (uptime) {
      var d = moment.duration(uptime, 'milliseconds');
      uptime = '';
      if (d.days() === 1) {
        uptime = d.days()+' day ';
      } else if (d.days() > 1) {
        uptime = d.days()+' days ';
      }

      if (d.hours() > 9) {
        uptime += d.hours()+':';
      } else {
        uptime += '0' + d.hours()+':';
      }

      if (d.minutes() > 9) {
        uptime += d.minutes()+':';
      } else {
        uptime += '0' + d.minutes()+':';
      }

      if (d.seconds() > 9) {
        uptime += d.seconds();
      } else {
        uptime += '0' + d.seconds();
      }
      return uptime;
    };
  });
