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

  var getDateAsDDMMYY = function(date) {
    return date.getDate()+'-'+date.getMonth()+'-'+date.getFullYear();
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

    $(".datetime-startdate").text(timerStartDate.toLocaleDateString());
    $(".datetime-startdate-value").val(getDateAsDDMMYY(timerStartDate));
    $(".datetime-enddate-value").val(getDateAsDDMMYY(timerEndDate));

    $('.datetime-starttime').text(startTime);
    $('.datetime-starttime-value').val(getTimeAsHHMMSS(timerStartDate));

    $('.datetime-endtime').text(endTime);
    $('.datetime-endtime-value').val(getTimeAsHHMMSS(timerEndDate));

    $('.datetime-timediff').text(diffTime);

    // TODO upstream bug?
    //$(".timeframe-startdate-datepicker").datepicker('setUTCDate', timerStartDate);

    $('.timeframe-starttime-timepicker .timepicker-hh').val(timerStartDate.getHours());
    $('.timeframe-starttime-timepicker .timepicker-mm').val(timerStartDate.getMinutes());
    $('.timeframe-starttime-timepicker .timepicker-ss').val(timerStartDate.getSeconds());

    $('.timeframe-endtime-timepicker .timepicker-hh').val(timerEndDate.getHours());
    $('.timeframe-endtime-timepicker .timepicker-mm').val(timerEndDate.getMinutes());
    $('.timeframe-endtime-timepicker .timepicker-ss').val(timerEndDate.getSeconds());
  };

  // initialize the timer
  var initTimeframeTimer = function() {
    timerState = TIMER_NOT_RUNNING;

    // Using two intervals to improve performance
    updateDatetimeInterval = window.setInterval(updateDatetime, 250);
    updateTimeframeFormInterval = window.setInterval(updateTimeframeForm, 1000);
    updateDatetime();
    updateTimeframeForm();

    $('.button-timeraction').hide();
    $('.button-starttimer').show();
  };

  if ($('.timeframe-form').length) {
    initTimeframeTimer();
  }

  // clear the timer
  var clearTimeFrameTimer = function() {
    window.clearInterval(updateDatetimeInterval);
    window.clearInterval(updateTimeframeFormInterval);
    $('.timeframe-form').removeClass('timeframe-running');
    $('.button-timeraction').hide();
    $('.button-savetimeframe').show();
    $('.timeframe-reset-wrapper').show();
  };

  // start the timer
  $('.button-starttimer').click(function(){
    timerState = TIMER_RUNNING;
    $('.timeframe-form').addClass('timeframe-running');
    $('.button-timeraction').hide();
    $('.button-stoptimer').show();
  });

  // stop the timer
  $('.button-stoptimer').click(function(){
    clearTimeFrameTimer();
  });

  // toggle date and time selection view
  $('.timeframe-form .datetime-link').click(function(){
    $('.timeframe-form-popup').toggle(100);
  });

  // reset the timer
  $('.timeframe-reset-wrapper').click(function(){
    $('.timeframe-reset-wrapper').hide();
    $('.timeframe-form-popup').hide(100);
    initTimeframeTimer();
  });

  // initialize the datepicker
  $('.timeframe-startdate-datepicker').datepicker({
    todayBtn: "linked",
    todayHighlight: true
  });

  // date change event
  $(".timeframe-startdate-datepicker").on("changeDate", function(event) {
    clearTimeFrameTimer();
    var startDate = new Date($(".timeframe-startdate-datepicker").datepicker('getUTCDate'));
    setDateByYMD(timerStartDate, startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    updateTimeframeForm();
  });

  // time change event
  $('.timeframe-starttime-timepicker input').change(function(){
    clearTimeFrameTimer();
    var h = $('.timeframe-starttime-timepicker .timepicker-hh').val() || 0;
    var m = $('.timeframe-starttime-timepicker .timepicker-mm').val() || 0;
    var s = $('.timeframe-starttime-timepicker .timepicker-ss').val() || 0;
    timerStartDate.setHours(h);
    timerStartDate.setMinutes(m);
    timerStartDate.setSeconds(s);
    updateTimeframeForm();
  });

  // time change event
  $('.timeframe-endtime-timepicker input').change(function(){
    clearTimeFrameTimer();
    var h = $('.timeframe-endtime-timepicker .timepicker-hh').val() || 0;
    var m = $('.timeframe-endtime-timepicker .timepicker-mm').val() || 0;
    var s = $('.timeframe-endtime-timepicker .timepicker-ss').val() || 0;
    timerEndDate.setHours(h);
    timerEndDate.setMinutes(m);
    timerEndDate.setSeconds(s);
    updateTimeframeForm();
  });

});
