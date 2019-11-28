
var ht = $('html');
if (ht.width()<1242) {
  orientation(ht);
}

function orientation(ht) {

  var supportOrientation = (typeof window.orientation == 'number' && typeof window.onorientationchange === 'object');
  function init(){
    var htmlNode = document.body.parentNode,orientation;
    var fontSize = ht.width()*625/1242;
     function updateOrientation(){
      if (supportOrientation) {
        orientation = window.orientation;
        switch(orientation) {
          case 90:
          case -90:
            fontSize = ht.width()*625/1242/1.77777;break;
        }
      } else {
        if(window.innerWidth>window.innerHeight && window.innerWidth==dheight && window.innerHeight == dwidth) {
          fontSize = ht.width()*625/1242/1.77777;
        }
      }
       alert(123)
      ht.css({'font-size':fontSize+'%'});
    }
    if (supportOrientation) {
      window.addEventListener('orientationchange',updateOrientation,false);
    } else{
      window.addEventListener('resize',updateOrientation,false);
    }
    updateOrientation();
  }
  window.addEventListener('DOMContentLoaded',init(),false);
}
$(function() {
  $(window).resize(function () {
    if (ht.width() < 1242)
      orientation(ht);

  });
})
