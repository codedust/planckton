$(function(){

  // Make each row that has the data-href attribute set clickable
  $('.table tr[data-href]').each(function(){
    $(this).css('cursor', 'pointer');

    var click_location = $(this).attr('data-href');
    $(this).children('td').not('.no-td-click').click( function(){
      document.location = click_location;
    });
  });

  var updateDatetime = function() {
    var now = new Date();
    var curDate = now.toLocaleDateString();
    var curTime = now.toLocaleTimeString(undefined, {hour: '2-digit', minute:'2-digit'});
    $('.current-datetime .datetime-startdate').text(curDate);
    $('.current-datetime .datetime-starttime').text(curTime);
    $('.current-datetime .datetime-endtime').text(curTime);
  };

  if ($('.current-datetime').length) {
    window.setInterval(updateDatetime, 1000);
    updateDatetime();
  }
});
