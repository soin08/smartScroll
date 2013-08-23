// VERSION: 1.0 LAST UPDATE: 23.08.2012
/* 
 * Licensed under the MIT license: http://www.opensource.org/licenses/mit-license.php
 * 
 */
(function($) {    
    $.fn.smartScroll = function(options) {
        // Extend the default options with those provided.        
        var opts = $.extend({}, $.fn.smartScroll.defaults, options);
                   
        var scrollUp = true,
            th = this,
            oldScrollPos = 0,
            top = this.offset().top - parseFloat(this.css('margin-top').replace('/auto/',0)), //full div top offset including its margin 
            cssOldPos = this.css('position'),
            cssOldTop = this.css('top');
           
        function manageFixedPos() { //add or remove fixed position of the block
            if(opts.addFixedPosition) {           
                var y = $(window).scrollTop();
                if(y >= top) {                   
                    this.css({position:'fixed', top:0});           
                }
                else {
                    this.css({position:cssOldPos, top:cssOldTop});         
                }
            }  
        }
        
        manageFixedPos.call(th); //add or remove fixed position right away (window might be initially scrolled down);
                          
        th.hide(); //hide the div initially
            
        if($(document).scrollTop() > opts.minScrollDownDist) {            
            th.fadeIn(opts.fadeInSpeed);
        }
        this.click(function() {            
            if(scrollUp) {
                oldScrollPos = $(document).scrollTop(); //save current scroll position 
                if(oldScrollPos > 0) { //in case minScrollDownDist == 0, we don't need to do anything
                    scrollUp = !scrollUp;    
                    opts.onDirectionChangeDown.call(th);                      
                   //animating to the top; using promise to avoid double callback call on animation end
                    $("html, body").animate({scrollTop: 0}, opts.scrollSpeed).promise().done(function() {
                        opts.onScrollingDone.call(th);                       
                    });                  
                                 
                }                                       
            }
            else {
                scrollUp = !scrollUp;  
                opts.onDirectionChangeUp.call(th);
                //scrolling to the previous position, using promise again               
                $("html, body").animate({scrollTop: oldScrollPos}, opts.scrollSpeed).promise().done(function() {
                     opts.onScrollingDone.call(th); 
                })         
            }             
        })
        
        $(window).scroll(function() {
            manageFixedPos.call(th); //add or remove fixed position
            if(!th.is(':visible') && $(document).scrollTop() > opts.minScrollDownDist) {               
                th.fadeIn(opts.fadeInSpeed);
            }
            else if(($(document).scrollTop() > oldScrollPos) || ($(document).scrollTop() + $(window).height() >= $(document).height())) {
                //if we scrolled up and than were manually scrolling down and went lower than oldSrollPos, change direction
                if(!scrollUp) {
                    scrollUp = true;
                    opts.onDirectionChangeUp.call(th);                        
                }                    
            }
            else if(($(document).scrollTop() == 0) && scrollUp) { 
                //if we use <= minScrollDownDist instead of 0, this will get trigger if we automaticallly scrolling down and thus produce an unpleasent blink  
                //if we were scrolling top manually and reached minScrollDownDist, hide the div
                th.fadeOut(opts.fadeOutSpeed);
            }     
        }); 
        return this;
    }
    $.fn.smartScroll.defaults = { //dafaults
         minScrollDownDist:150,
         fadeInSpeed:200,
         fadeOutSpeed:200,
         scrollSpeed:500,          
         onDirectionChangeUp:function() {},
         onDirectionChangeDown:function() {},
         onScrollingDone:function() {},
         addFixedPosition : true    
    }; 
}(jQuery));