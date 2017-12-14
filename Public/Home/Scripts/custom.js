(function($){

	$.fn.et_simple_slider = function( options ) {
		var settings = $.extend( {
			slide         			: '.et-slide',				 	// slide class
			arrows					: '.et-slider-arrows',			// arrows container class
			prev_arrow				: '.et-arrow-prev',				// left arrow class
			next_arrow				: '.et-arrow-next',				// right arrow class
			controls 				: '.et-controllers a',			// control selector
			control_active_class	: 'et-active-control',			// active control class name
			previous_text			: 'Previous',					// previous arrow text
			next_text				: 'Next',						// next arrow text
			fade_speed				: 500,							// fade effect speed
			use_arrows				: true,							// use arrows?
			use_controls			: true,							// use controls?
			manual_arrows			: '',							// html code for custom arrows
			append_controls_to		: '',							// controls are appended to the slider element by default, here you can specify the element it should append to
			controls_class			: 'et-controllers',				// controls container class name
			slideshow				: false,						// automattic animation?
			slideshow_speed			: 7000							// automattic animation speed
		}, options );

		return this.each( function() {
			var $et_slider 			= $(this),
				$et_slide			= $et_slider.find( settings.slide ),
				et_slides_number	= $et_slide.length,
				et_fade_speed		= settings.fade_speed,
				et_active_slide		= 0,
				$et_slider_arrows,
				$et_slider_prev,
				$et_slider_next,
				$et_slider_controls,
				et_slider_timer,
				controls_html = '';

			if ( settings.use_arrows && et_slides_number > 1 ) {
				if ( settings.manual_arrows == '' )
					$et_slider.append( '<div class="et-slider-arrows"><a class="et-arrow-prev" href="#">' + settings.previous_text + '</a><a class="et-arrow-next" href="#">' + settings.next_text + '</a></div>' );
				else
					$et_slider.append( settings.manual_arrows );

				$et_slider_arrows 	= $( settings.arrows );
				$et_slider_prev 	= $et_slider_arrows.find( settings.prev_arrow );
				$et_slider_next 	= $et_slider_arrows.find( settings.next_arrow );

				$et_slider_next.click( function(){
					et_slider_move_to( 'next' );

					return false;
				} );

				$et_slider_prev.click( function(){
					et_slider_move_to( 'previous' );

					return false;
				} );
			}

			if ( settings.use_controls && et_slides_number > 1 ) {
				for ( var i = 1; i <= et_slides_number; i++ ) {
					controls_html += '<a href="#"' + ( i == 1 ? ' class="' + settings.control_active_class + '"' : '' ) + '>' + i + '</a>';
				}

				controls_html =
					'<div class="' + settings.controls_class + '">' +
						controls_html +
					'</div>';

				if ( settings.append_controls_to == '' )
					$et_slider.append( controls_html );
				else
					$( settings.append_controls_to ).append( controls_html );

				$et_slider_controls	= $et_slider.find( settings.controls ),

				$et_slider_controls.click( function(){
					et_slider_move_to( $(this).index() );

					return false;
				} );
			}

			et_slider_auto_rotate();

			function et_slider_auto_rotate(){
				if ( settings.slideshow && et_slides_number > 1 ) {
					et_slider_timer = setTimeout( function() {
						et_slider_move_to( 'next' );
					}, settings.slideshow_speed );
				}
			}

			function et_slider_move_to( direction ) {
				var $active_slide = $et_slide.eq( et_active_slide ),
					$next_slide;

				if ( direction == 'next' || direction == 'previous' ){

					if ( direction == 'next' )
						et_active_slide = ( et_active_slide + 1 ) < et_slides_number ? et_active_slide + 1 : 0;
					else
						et_active_slide = ( et_active_slide - 1 ) >= 0 ? et_active_slide - 1 : et_slides_number - 1;

				} else {

					if ( et_active_slide == direction ) return;

					et_active_slide = direction;

				}

				$next_slide	= $et_slide.eq( et_active_slide );

				$et_slider_controls.removeClass( settings.control_active_class ).eq( et_active_slide ).addClass( settings.control_active_class );

				$active_slide.animate( { opacity : 0 }, et_fade_speed, function(){
					$(this).css('display', 'none');

					$next_slide.css( { 'display' : 'block', opacity : 0 } ).animate( { opacity : 1 }, et_fade_speed );
				} );

				if ( typeof et_slider_timer != 'undefined' ) {
					clearInterval( et_slider_timer );
					et_slider_auto_rotate();
				}
			}
		} );
	}

	$(document).ready( function(){
		var $featured_slider 	= $( '#et-slider-wrapper' ),
			$et_testimonials 	= $( '#testimonials' ),
			$et_top_menu 		= $( '#top-menu > ul' ),
			$comment_form		= $( '#commentform' );

		$('#left-area').fitVids();

		$et_top_menu.find('a').append( '<span class="menu-highlight"></span>' );

		$et_top_menu.superfish({
			delay		: 500, 										// one second delay on mouseout
			animation	: { opacity : 'show', height : 'show' },	// fade-in and slide-down animation
			speed		: 'fast', 									// faster animation speed
			autoArrows	: true, 									// disable generation of arrow mark-up
			dropShadows	: false										// disable drop shadows
		});

		if ( $featured_slider.length ){
			$featured_slider.append( '<div id="et-slider-controls"><div class="container"></div></div>' );

			et_slider_settings = {
				append_controls_to : '#et-slider-controls .container'
			}

			if ( $featured_slider.hasClass('et_slider_auto') ) {
				var et_slider_autospeed_class_value = /et_slider_speed_(\d+)/g;

				et_slider_settings.slideshow = true;

				et_slider_autospeed = et_slider_autospeed_class_value.exec( $featured_slider.attr('class') );

				et_slider_settings.slideshow_speed = et_slider_autospeed[1];
			}

			$featured_slider.et_simple_slider( et_slider_settings );
		}

		if ( $et_testimonials.length ){
			$et_testimonials.et_simple_slider( { use_arrows : false, slide : '.testimonial' } );
		}

		(function et_search_bar(){
			var $searchform = $('#et-search-form'),
				$searchinput = $searchform.find("#search_input"),
				searchvalue = $searchinput.val();

			$searchinput.focus(function(){
				if (jQuery(this).val() === searchvalue) jQuery(this).val("");
			}).blur(function(){
				if (jQuery(this).val() === "") jQuery(this).val(searchvalue);
			});
		})();

		if ( $('ul.et_disable_top_tier').length ) $("ul.et_disable_top_tier > li > ul").prev('a').attr('href','#');

		et_duplicate_menu( $('ul.nav'), $('#top-area .top-content .mobile_nav'), 'mobile_menu', 'et_mobile_menu' );

		function et_duplicate_menu( menu, append_to, menu_id, menu_class ){
			var $cloned_nav;

			menu.clone().attr('id',menu_id).removeClass().attr('class',menu_class).appendTo( append_to );
			$cloned_nav = append_to.find('> ul');
			$cloned_nav.find('.menu_slide').remove();
			$cloned_nav.find('li:first').addClass('et_first_mobile_item');

			append_to.click( function(){
				if ( $(this).hasClass('closed') ){
					$(this).removeClass( 'closed' ).addClass( 'opened' );
					$cloned_nav.slideDown( 500 );
				} else {
					$(this).removeClass( 'opened' ).addClass( 'closed' );
					$cloned_nav.slideUp( 500 );
				}
				return false;
			} );

			append_to.find('a').click( function(event){
				event.stopPropagation();
			} );
		}

		$comment_form.find('input:text, textarea').each(function(index,domEle){
			var $et_current_input = jQuery(domEle),
				$et_comment_label = $et_current_input.siblings('label'),
				et_comment_label_value = $et_current_input.siblings('label').text();
			if ( $et_comment_label.length ) {
				$et_comment_label.hide();
				if ( $et_current_input.siblings('span.required') ) {
					et_comment_label_value += $et_current_input.siblings('span.required').text();
					$et_current_input.siblings('span.required').hide();
				}
				$et_current_input.val(et_comment_label_value);
			}
		}).bind('focus',function(){
			var et_label_text = jQuery(this).siblings('label').text();
			if ( jQuery(this).siblings('span.required').length ) et_label_text += jQuery(this).siblings('span.required').text();
			if (jQuery(this).val() === et_label_text) jQuery(this).val("");
		}).bind('blur',function(){
			var et_label_text = jQuery(this).siblings('label').text();
			if ( jQuery(this).siblings('span.required').length ) et_label_text += jQuery(this).siblings('span.required').text();
			if (jQuery(this).val() === "") jQuery(this).val( et_label_text );
		});

		// remove placeholder text before form submission
		$comment_form.submit(function(){
			$comment_form.find('input:text, textarea').each(function(index,domEle){
				var $et_current_input = jQuery(domEle),
					$et_comment_label = $et_current_input.siblings('label'),
					et_comment_label_value = $et_current_input.siblings('label').text();

				if ( $et_comment_label.length && $et_comment_label.is(':hidden') ) {
					if ( $et_comment_label.text() == $et_current_input.val() )
						$et_current_input.val( '' );
				}
			});
		});
	});
})(jQuery)