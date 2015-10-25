var planckton = function() {
  var self = {};

  /* getCookie returns the value of the cookie with the given key */
  self.getCookie = function(key) {
    var cookies = document.cookie.split(';');
    for(var i = 0; i < cookies.length; i++) {
      while (cookies[i].charAt(0) == ' ') {
        cookies[i] = cookies[i].substring(1, cookies[i].length);
      }
      if (cookies[i].indexOf(key + "=") === 0) {
        return cookies[i].substring(key.length + 1, cookies[i].length);
      }
    }
    return "";
  };

  return self;
}();

$(function(){
  // make jquery send the csrf token with each ajax request
  $.ajaxSetup({
    beforeSend: function(xhr, settings) {
      xhr.setRequestHeader("X-CSRFToken", planckton.getCookie('csrftoken'));
    }
  });


  // add onclick handlers to all rows having the data-href attribute set
  $('.table tr[data-href]').each(function(){
    $(this).css('cursor', 'pointer');

    var click_location = $(this).attr('data-href');
    $(this).children('td').not('.no-td-click').click( function(){
      document.location = click_location;
    });
  });


  // === timeframe form ===
  var timerStartDate;
  var timerEndDate;
  var timerState;
  var endTimeChanged;
  var updateDatetimeInterval, updateTimeframeFormInterval;
  var TIMER_NOT_RUNNING = 0, TIMER_RUNNING = 1, TIMER_UNSAVED = 2;

  var updateDatetime = function() {
    if (timerState == TIMER_NOT_RUNNING) {
      timerStartDate = new Date();
    }
    timerEndDate = new Date();
  };

  var getTimeAsHHMMSS = function(date) {
    return date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
  };

  var getDateAsYYYYMMDD = function(date) {
    return date.getFullYear()+'-'+date.getMonth()+'-'+date.getDate();
  };

  // savely set the year, month and date of a given date
  var setDateByYMD = function(date, Y, M, D) {
    date.setDate(1); // avoids auto-updates of the month when the old date was
                     // the 31st and the new month has only 30 days
    date.setFullYear(Y);
    date.setMonth(M);
    date.setDate(D);
  };

  // update UI
  var updateTimeframeForm = function() {
    setDateByYMD(timerEndDate, timerStartDate.getFullYear(), timerStartDate.getMonth(), timerStartDate.getDate());

    // check whether the start time and the end time aren't the same day
    var diffMillisecs = timerEndDate.getTime()-timerStartDate.getTime();
    if (diffMillisecs < 0) {
      timerEndDate.setDate(timerStartDate.getDate()+1);
    }

    var startTime = timerStartDate.toLocaleTimeString(undefined, {hour: '2-digit', minute:'2-digit'});
    var endTime   = timerEndDate.toLocaleTimeString(undefined, {hour: '2-digit', minute:'2-digit'});
    var diffTime  = (new Date(diffMillisecs)).toLocaleTimeString(undefined, {timeZone: "UTC", hour: '2-digit', minute:'2-digit', second:'2-digit'});

    $('.timeframe-form .datetime-startdate').text(timerStartDate.toLocaleDateString());
    $('.timeframe-form .datetime-starttime').text(startTime);
    $('.timeframe-form .datetime-endtime').text(endTime);

    $('.timeframe-form .datetime-start-value').val(getDateAsYYYYMMDD(timerStartDate)+' '+getTimeAsHHMMSS(timerStartDate));
    $('.timeframe-form .datetime-end-value').val(getDateAsYYYYMMDD(timerEndDate)+' '+getTimeAsHHMMSS(timerEndDate));

    $('.timeframe-form .datetime-timediff').text(diffTime);

    // TODO upstream bug?
    //$('.timeframe-form-popup .timeframe-startdate-datepicker').datepicker('setUTCDate', timerStartDate);

    $('.timeframe-form-popup .timeframe-starttime-timepicker .timepicker-hh').val(timerStartDate.getHours());
    $('.timeframe-form-popup .timeframe-starttime-timepicker .timepicker-mm').val(timerStartDate.getMinutes());
    $('.timeframe-form-popup .timeframe-starttime-timepicker .timepicker-ss').val(timerStartDate.getSeconds());

    $('.timeframe-form-popup .timeframe-endtime-timepicker .timepicker-hh').val(timerEndDate.getHours());
    $('.timeframe-form-popup .timeframe-endtime-timepicker .timepicker-mm').val(timerEndDate.getMinutes());
    $('.timeframe-form-popup .timeframe-endtime-timepicker .timepicker-ss').val(timerEndDate.getSeconds());

    var wage = (timerEndDate.getTime()-timerStartDate.getTime())/1000/60/60*$('.timeframe-form input[name=hourly_wage]').val();
    $('.timeframe-form .timeframe-wage').text(wage.toFixed(2));
  };

  // set the animation state of the timer
  var setTimerState = function(state) {
    timerState = state;

    $('.timeframe-form .button-timeraction').hide();
    $('.timeframe-form').removeClass('timeframe-running');
    $('.timeframe-form').removeClass('timeframe-unsaved');

    switch (state) {
      case TIMER_NOT_RUNNING:
        window.clearInterval(updateDatetimeInterval);
        window.clearInterval(updateTimeframeFormInterval);
        $('.timeframe-form-popup').hide(100);
        $('.timeframe-form-popup .timeframe-reset-wrapper').hide();
        $('.timeframe-form .button-starttimer').show();
        break;

      case TIMER_RUNNING:
        $('.timeframe-form').addClass('timeframe-running');
        $('.timeframe-form-popup .timeframe-reset-wrapper').show();
        $('.timeframe-form .button-stoptimer').show();
        break;

      case TIMER_UNSAVED:
        window.clearInterval(updateDatetimeInterval);
        window.clearInterval(updateTimeframeFormInterval);
        $('.timeframe-form').addClass('timeframe-unsaved');
        $('.timeframe-form-popup .timeframe-reset-wrapper').show();
        $('.timeframe-form .button-savetimeframe').show();
        break;
    }
  };

  // initialize the timer
  var initTimeframeTimer = function() {
    setTimerState(TIMER_NOT_RUNNING);
    endTimeChanged = false;

    // using two intervals to improve performance
    updateDatetimeInterval = window.setInterval(updateDatetime, 250);
    updateTimeframeFormInterval = window.setInterval(updateTimeframeForm, 1000);
    updateDatetime();
    updateTimeframeForm();
  };

  if ($('.timeframe-form').length) {
    initTimeframeTimer();

    $.post('/api/', {
      'action': 'get_timer_status',
      'project': 14
    });
  }

  // start the timer
  $('.timeframe-form .button-starttimer').click(function(){
    setTimerState(TIMER_RUNNING);
  });

  // stop the timer
  $('.timeframe-form .button-stoptimer').click(function(){
    setTimerState(TIMER_UNSAVED);
  });

  // toggle date and time selection view
  $('.timeframe-form .datetime-link').click(function(){
    $('.timeframe-form-popup').toggle(100);
  });

  // reset the timer
  $('.timeframe-form-popup .timeframe-reset-wrapper button').click(function(){
    setTimerState(TIMER_NOT_RUNNING);
    initTimeframeTimer();
  });

  // initialize the datepicker
  $('.timeframe-form-popup .timeframe-startdate-datepicker').datepicker({
    todayBtn: "linked",
    todayHighlight: true
  });

  // date change event
  $('.timeframe-form-popup .timeframe-startdate-datepicker').on("changeDate", function(event) {
    setTimerState(TIMER_UNSAVED);
    var startDate = new Date($('.timeframe-form-popup .timeframe-startdate-datepicker').datepicker('getUTCDate'));
    setDateByYMD(timerStartDate, startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    updateTimeframeForm();
  });

  // start time change event
  $('.timeframe-form-popup .timeframe-starttime-timepicker input').change(function(){
    setTimerState(TIMER_UNSAVED);
    var h = $('.timeframe-form-popup .timeframe-starttime-timepicker .timepicker-hh').val() || 0;
    var m = $('.timeframe-form-popup .timeframe-starttime-timepicker .timepicker-mm').val() || 0;
    var s = $('.timeframe-form-popup .timeframe-starttime-timepicker .timepicker-ss').val() || 0;
    timerStartDate.setHours(h);
    timerStartDate.setMinutes(m);
    timerStartDate.setSeconds(s);

    if (!endTimeChanged) {
      if ($(this).hasClass('timepicker-hh')) timerEndDate.setHours(h);
      if ($(this).hasClass('timepicker-mm')) timerEndDate.setMinutes(m);
      if ($(this).hasClass('timepicker-ss')) timerEndDate.setSeconds(s);
    }

    updateTimeframeForm();
  });

  // end time change event
  $('.timeframe-form-popup .timeframe-endtime-timepicker input').change(function(){
    endTimeChanged = true;
    setTimerState(TIMER_UNSAVED);
    var h = $('.timeframe-form-popup .timeframe-endtime-timepicker .timepicker-hh').val() || 0;
    var m = $('.timeframe-form-popup .timeframe-endtime-timepicker .timepicker-mm').val() || 0;
    var s = $('.timeframe-form-popup .timeframe-endtime-timepicker .timepicker-ss').val() || 0;
    timerEndDate.setHours(h);
    timerEndDate.setMinutes(m);
    timerEndDate.setSeconds(s);
    updateTimeframeForm();
  });

  // wage change event
  $('.timeframe-form input[name=hourly_wage]').change(function(){
    updateTimeframeForm();
  });


  // === saved timeframes ===
  var timeframe_table_wage_sum = 0;
  $('.timeframe-table tbody tr').each(function(){
    var startDate = new Date($(this).find('input[name=datetime_start]').val());
    var endDate   = new Date($(this).find('input[name=datetime_end]').val());
    var diffMillisecs = endDate.getTime()-startDate.getTime();
    var diffTime  = (new Date(diffMillisecs)).toLocaleTimeString(undefined, {timeZone: "UTC", hour: '2-digit', minute:'2-digit', second:'2-digit'});
    $(this).find('.datetime-timediff').text(diffTime);

    var wage = diffMillisecs/1000/60/60*$(this).find('input[name=hourly_wage]').val();
    timeframe_table_wage_sum += wage;
    $(this).find('.timeframe-wage').text(wage.toFixed(2));
  });

  $('.timeframe-table .timeframe-wage-sum').text(timeframe_table_wage_sum.toFixed(2));

});
