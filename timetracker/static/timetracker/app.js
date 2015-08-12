$(function(){

  // Make each row that has the data-href attribute set clickable
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

  var updateDatetimeInterval, updateTimeframeFormInterval;
  var TIMER_NOT_RUNNING = 0; TIMER_RUNNING = 1;

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

    var wage = diffMillisecs/1000/60/60*$('.timeframe-form input[name=hourly_wage]').val();
    $('.timeframe-form .timeframe-wage').text(wage.toFixed(2));
  };

  // initialize the timer
  var initTimeframeTimer = function() {
    timerState = TIMER_NOT_RUNNING;

    // Using two intervals to improve performance
    updateDatetimeInterval = window.setInterval(updateDatetime, 250);
    updateTimeframeFormInterval = window.setInterval(updateTimeframeForm, 1000);
    updateDatetime();
    updateTimeframeForm();
  };

  if ($('.timeframe-form').length) {
    initTimeframeTimer();
  }

  // clear the timer
  var clearTimeFrameTimer = function() {
    window.clearInterval(updateDatetimeInterval);
    window.clearInterval(updateTimeframeFormInterval);
    $('.timeframe-form').removeClass('timeframe-running');
    $('.timeframe-form').addClass('timeframe-unsaved');
    $('.timeframe-form .button-timeraction').hide();
    $('.timeframe-form .button-savetimeframe').show();
    $('.timeframe-form-popup .timeframe-reset-wrapper').show();
  };

  // start the timer
  $('.timeframe-form .button-starttimer').click(function(){
    timerState = TIMER_RUNNING;
    $('.timeframe-form').addClass('timeframe-running');
    $('.timeframe-form .button-timeraction').hide();
    $('.timeframe-form .button-stoptimer').show();
    $('.timeframe-form-popup .timeframe-reset-wrapper').show();
  });

  // stop the timer
  $('.timeframe-form .button-stoptimer').click(function(){
    clearTimeFrameTimer();
  });

  // toggle date and time selection view
  $('.timeframe-form .datetime-link').click(function(){
    $('.timeframe-form-popup').toggle(100);
  });

  // reset the timer
  $('.timeframe-form-popup .timeframe-reset-wrapper').click(function(){
    clearTimeFrameTimer();
    $('.timeframe-form-popup').hide(100);
    $('.timeframe-form-popup .timeframe-reset-wrapper').hide();
    $('.timeframe-form').removeClass('timeframe-running');
    $('.timeframe-form').removeClass('timeframe-unsaved');
    $('.timeframe-form .button-timeraction').hide();
    $('.timeframe-form .button-starttimer').show();
    initTimeframeTimer();
  });

  // initialize the datepicker
  $('.timeframe-form-popup .timeframe-startdate-datepicker').datepicker({
    todayBtn: "linked",
    todayHighlight: true
  });

  // date change event
  $('.timeframe-form-popup .timeframe-startdate-datepicker').on("changeDate", function(event) {
    clearTimeFrameTimer();
    var startDate = new Date($('.timeframe-form-popup .timeframe-startdate-datepicker').datepicker('getUTCDate'));
    setDateByYMD(timerStartDate, startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    updateTimeframeForm();
  });

  // time change event
  $('.timeframe-form-popup .timeframe-starttime-timepicker input').change(function(){
    clearTimeFrameTimer();
    var h = $('.timeframe-form-popup .timeframe-starttime-timepicker .timepicker-hh').val() || 0;
    var m = $('.timeframe-form-popup .timeframe-starttime-timepicker .timepicker-mm').val() || 0;
    var s = $('.timeframe-form-popup .timeframe-starttime-timepicker .timepicker-ss').val() || 0;
    timerStartDate.setHours(h);
    timerStartDate.setMinutes(m);
    timerStartDate.setSeconds(s);
    updateTimeframeForm();
  });

  // time change event
  $('.timeframe-form-popup .timeframe-endtime-timepicker input').change(function(){
    clearTimeFrameTimer();
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
