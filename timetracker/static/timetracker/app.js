$(function(){

  // Make each row that has the data-href attribute set clickable
  $('.table tr[data-href]').each(function(){
    $(this).css('cursor', 'pointer');

    var click_location = $(this).attr('data-href');
    $(this).children('td').not('.no-td-click').click( function(){
      document.location = click_location;
    });
  });

  var timerStartDate;
  var timerStopDate;

  var updateDatetime = function() {
    if (timerState == TIMER_NOT_RUNNING) {
      timerStartDate = new Date();
    }
    timerStopDate = new Date();

  };

  var showDatetime = function() {
    var startDate = timerStartDate.toLocaleDateString();
    var startTime = timerStartDate.toLocaleTimeString(undefined, {hour: '2-digit', minute:'2-digit'});
    var stopTime  = timerStopDate.toLocaleTimeString(undefined, {hour: '2-digit', minute:'2-digit'});
    var diffTime  = (new Date(timerStopDate.getTime()-timerStartDate.getTime())).toLocaleTimeString(undefined, {timeZone: "UTC", hour: '2-digit', minute:'2-digit', second:'2-digit'});
    $('.current-datetime .datetime-startdate').text(startDate);
    $('.current-datetime .datetime-starttime').text(startTime);
    $('.current-datetime .datetime-endtime').text(stopTime);
    $('.datetime-timediff').text(diffTime);
  };

  var updateDatetimeInterval, showDatetimeInterval;
  var TIMER_NOT_RUNNING = 0; TIMER_RUNNING = 1;
  var timerState = TIMER_NOT_RUNNING;

  if ($('.current-datetime').length) {
    // Using two intervals to improve performance
    updateDatetimeInterval = window.setInterval(updateDatetime, 1000);
    showDatetimeInterval = window.setInterval(showDatetime, 1000);
    updateDatetime();
    showDatetime();
  }

  $('.button-starttimer').click(function(){
    timerState = TIMER_RUNNING;
    $('.timeframe-form').addClass('timeframe-running');
    $('.button-starttimer').hide();
    $('.button-stoptimer').show();
  });

  $('.button-stoptimer').click(function(){
    window.clearInterval(updateDatetimeInterval);
    window.clearInterval(showDatetimeInterval);
    $('.timeframe-form').removeClass('timeframe-running');
    $('.button-stoptimer').hide();
    $('.button-savetimeframe').show();
  });
});
