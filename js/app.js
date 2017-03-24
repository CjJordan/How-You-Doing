$(document).foundation()

 $(window)
        .load(function() {
            SetOffCanvasHeight();
        })
        .resize(function() {
            SetOffCanvasHeight();
        });

        function SetOffCanvasHeight() {
            var height = $(window).height();
            var contentHeight = $(".off-canvas-content").height();
            if (contentHeight > height) { height = contentHeight; }

            $(".off-canvas-wrapper").height(height);
            $("#offCanvasBottom1").height(height);
            $(".off-canvas").height(height);
}

// jQuery for page scrolling feature - requires jQuery Easing plugin
   $('.page-scroll a').bind('click', function(event) {
       var $anchor = $(this);
       $('html, body').stop().animate({
           scrollTop: ($($anchor.attr('href')).offset().top - 50)
       }, 1250, 'easeInOutExpo');
       event.preventDefault();
   });

   //    $('button').bind('click', function(event) {
   //     var $anchor = $(this);
   //     $('html, body').stop().animate({
   //         scrollTop: ($($anchor.attr('href')).offset().top - 50)
   //     }, 1250, 'easeInOutExpo');
   //     event.preventDefault();
   // });