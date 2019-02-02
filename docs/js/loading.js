$(function() {
  var h = $(window).height();
  $('#wrap').css('display','none');
  $('#loader-bg ,#loader').css('display','block');
});
function hideLoading() {
  $('#loader-bg').delay(900).fadeOut(800);
  $('#loader').delay(600).fadeOut(300);
  $('#wrap').css('display','block');
}