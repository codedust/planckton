$(function(){

  // Make each row that has the data-href attribute set clickable
  $('.table tr[data-href]').each(function(){
    $(this).css('cursor', 'pointer').hover(
      function(){
        $(this).addClass('active');
      },
      function(){
        $(this).removeClass('active');
      }).click( function(){
        document.location = $(this).attr('data-href');
      }
    );
  });
});
