/* SVN Version 26
 *Photostack script by idfive - 2010
 *http://www.idfive.com
*/


(function($) {
	$.fn.photostack = function (settings) {
		var config = {
			'speed': 200,
			'captionOffset':75,
			'padding':45,
			'photostackClass': 'photostack',
			'float':'none',
			'overlay':'true',
			'overlay_msg':'Click to view',
			'caption_clr':'transparent',
			'caption_txt':'#000000'
			};
			
		if (settings) {
			$.extend(config, settings);
		}
		
		this.each(function() {
			var stackHeight = ($(this).find('img').height() + config.captionOffset);
			var stackWidth = ($(this).find('img').width());
			$(this).addClass(config.photostackClass).css({'height':stackHeight+config.padding, 'width':stackWidth+config.padding, 'float':config.float, 'cursor':'pointer'});
			$(this).find('img').wrap('<div class="photo"></div>');
			if(config.overlay = 'true'){
			$(this).append('<span class="playbtn visible" style="display:block; zoom:1; position:absolute; left:-30px; background-color:#FFFFFF; opacity:0.5; filter:alpha(opacity=50); text-align:center; font-weight:bold; font-size:16px; padding:15px 0px; z-index:1000000000; top:30%;">'+config.overlay_msg+'</span>')
			$(".playbtn").css({'width':stackWidth+config.padding+40});
			}
			var photos = $(this).find('div.photo');
			var nphotos = photos.length;
			var captions = new Array();
			var top=nphotos-1;
			$(this).append('<div class="caption"></div>');
			var caption=$(this).find('.caption');
			caption.css({'top': stackHeight+"px", 'background-color' : config.overlay_clr, 'color' : config.overlay_txt, '-moz-border-radius' : '10px'});
			photos.each(function(i) {
				$(this).css({'z-index':i+15000, 'top': rInt(-10,10), 'left':rInt(-10,10)});
				//animate the top image to give some indication of available action
				if(i == top){
					$(this).find('img').rotate({'angle':rInt(-8,8), 'preservePosition': false, bind:
						   [
								{"mouseover":function(){$(this).rotateAnimation(2);}},
								{"mouseout":function(){$(this).rotateAnimation(-2);}},
								{"click":function(){$(this).unbind('mouseover').unbind('mouseout').rotateAnimation(rInt(-10,10));}}
						   ]
					});
				}
				//nothing else needs the event bindings, but we'll make a subtle, random rotation on click to add realism
				else {
					$(this).find('img').rotate({'angle':rInt(-8,8), 'preservePosition': false, bind:
						   [
								{"click":function(){$(this).rotateAnimation(rInt(-10,10));}}
						   ]
					});
				}
				var c = $(this).next('p');
				$(c).remove();
				if (c.length>0) {
					c.find('a').addClass('noflip');
					captions.push($(c).html());
				} else {
					captions.push('');
				}
							});
			
			$(document).ready(function(){
					caption.html(captions[top]);
			});
			$(this).click(function(event) {
				if ($(event.target).hasClass('noflip')){
					window.location = event.target.attr('href');
				}
				else{
				if ($(".playbtn").hasClass("visible")){
					$(".playbtn").hide().removeClass("visible").addClass("hidden");
				}
				$(photos[top]).animate({
					'top':-100,
					'left':150
				}, config.speed, function() {
					$(this).animate({
						'top':rInt(-10,10),
						'left':rInt(-10,10)
					},config.speed);
					var z=$(this).css('z-index');
					$(this).css('z-index', z-nphotos);
					if (top<0) {
						top=nphotos-1;
					}
				});
				top--;
				caption.stop().animate({'opacity':0}, 100, function() {
					if(top<0){
					caption.html(captions[nphotos-1]);
					} else {
					caption.html(captions[top]);
					}
					$(this).animate({'opacity':1}, 200);
				});
				}
			});
		});
		return this;
	};
	function rInt(low, high) {
		high++;
		return Math.floor(Math.random()*(high-low))+low;
	};
}) (jQuery);

// VERSION: 1.6 LAST UPDATE: 21.08.2010
/*
 * THIS IS FREE SCRIPT BUT LEAVE THIS COMMENT IF
 * YOU WANT USE THIS CODE ON YOUR SITE
 * 
 * Made by Wilq32, wilq32@gmail.com, Wroclaw, Poland, 01.2009
 * http://wilq32.blogspot.com
 * 
 */

(function($) {
var supportedCSS,styles=document.getElementsByTagName("head")[0].style,toCheck="transformProperty WebkitTransform OTransform".split(" "); //MozTransform <- firefox works slower with css!!!
for (var a=0;a<toCheck.length;a++) if (styles[toCheck[a]] !== undefined) supportedCSS = toCheck[a];
var IE = "v"=="\v";

jQuery.fn.extend({
ImageRotate:function(parameters)
{
	// If this element is already a Wilq32.PhotoEffect object, skip creation
	if (this.Wilq32&&this.Wilq32.PhotoEffect) return;
	// parameters might be applied to many objects - so because we use them later - a fresh instance is needed 
	var paramClone = $.extend(true, {}, parameters); 
	return (new Wilq32.PhotoEffect(this.get(0),paramClone))._temp;
},
rotate:function(parameters)
{
	if (this.length===0||typeof parameters=="undefined") return;
	if (typeof parameters=="number") parameters={angle:parameters};
	var returned=[];
	for (var i=0,i0=this.length;i<i0;i++)
	{
	    var element=this.get(i);	
		if (typeof element.Wilq32 == "undefined") 
			returned.push($($(element).ImageRotate(parameters)));
		else 
		{
			element.Wilq32.PhotoEffect._rotate(parameters.angle);
		}
	}
	return returned;
},

rotateAnimation:function(parameters)
{
	if (this.length===0||typeof parameters=="undefined") return;
	if (typeof parameters=="number") parameters={animateAngle:parameters};
	var returned=[];
	for (var i=0,i0=this.length;i<i0;i++)
	{	
	    var element=this.get(i);
		if (typeof element.Wilq32 == "undefined") 
			returned.push($($(element).ImageRotate(parameters)));
		else 
		{
			element.Wilq32.PhotoEffect.rotateAnimation(parameters);
		}
	}
	return returned;
}

});

// Library agnostic interface

Wilq32=window.Wilq32||{};
Wilq32.PhotoEffect=(function(){
	function setupParameters(img,parameters){
		this._img = img;
		this._parameters = parameters || {};
		this._parameters.angle = this._angle = parameters.angle || 0;
		this._parameters.animateAngle = typeof parameters.animateAngle=="number" ? parameters.animateAngle : this._angle;
		
	}
	if (supportedCSS) {
		return function(img,parameters){
			setupParameters.call(this,img,parameters);
			img.Wilq32 = {
				PhotoEffect: this
			};
			// TODO: needed to have a _temp variable accessible outside - used for object retrieval, 
			//        needs refactor + change name (temp is not self descriptive)
			// also need better passing values between functions - to FIX (remove _temp and _img at all)
			this._temp = this._img;
			this._BindEvents(img,this._parameters.bind);
			this._rotate(this._parameters.angle);
			if (this._parameters.angle!=this._parameters.animateAngle) this.rotateAnimation(this._parameters);
		}
	} else {
		return function(img,parameters) {
			setupParameters.call(this,img,parameters);			
			// Make sure that class and id are also copied - just in case you would like to refeer to an newly created object
			this._parameters.className=img.className;
			this._parameters.id=img.getAttribute('id');

			this._temp=document.createElement('span');
			this._temp.style.display="inline-block";
			this._temp.Wilq32 = 
				{
					PhotoEffect: this
				};
			img.parentNode.insertBefore(this._temp,img);
			
			if (img.complete) {
				this._Loader();
			} else {
				var self=this;
				// TODO: Remove jQuery dependency
				jQuery(this._img).bind("load", function()
				{
					self._Loader();
				});
			}
		}
	}
})();

Wilq32.PhotoEffect.prototype={

	rotateAnimation : function(parameters){
		this._parameters.animateAngle = parameters.animateAngle;
		this._parameters.callback = parameters.callback || this._parameters.callback || function(){};
		this._animateStart();
	},

	_BindEvents:function(element,events){
		if (events) 
		{
			for (var a in events) if (events.hasOwnProperty(a)) 
				for (var b in events[a]) if (events[a].hasOwnProperty(b)) 
				// TODO: Remove jQuery dependency
					jQuery(element).bind(b,events[a][b]);
		}
	},

	_Loader:(function()
	{
		if (IE)
		return function()
		{
			var width=this._img.width;
			var height=this._img.height;
			this._img.parentNode.removeChild(this._img);
				
			this._vimage = this.createVMLNode('image');
			this._vimage.src=this._img.src;
			this._vimage.style.height=height+"px";
			this._vimage.style.width=width+"px";
			this._vimage.style.position="absolute"; // FIXES IE PROBLEM - its only rendered if its on absolute position!
			this._vimage.style.top = "0px";
			this._vimage.style.left = "0px";
			
			//added by idfive to create frame around image to mimic CSS functionality
			this._rect = this.createVMLNode('rect');	
			this._rect.style.height=height+20+"px";
			this._rect.style.width=width+20+"px";
			this._rect.style.position="absolute";
			this._rect.style.top = "-10px";
			this._rect.style.left = "-10px";

			/* Group minifying a small 1px precision problem when rotating object */
			this._container =  this.createVMLNode('group');
			this._container.style.width=width;
			this._container.style.height=height;
			this._container.style.position="absolute";
			this._container.setAttribute('coordsize',width-1+','+(height-1)); // This -1, -1 trying to fix that ugly problem
			this._container.appendChild(this._rect); //added by idfive
			this._container.appendChild(this._vimage);
			this._temp.appendChild(this._container);
			this._temp.style.position="relative"; // FIXES IE PROBLEM
			this._temp.style.width=width+"px";
			this._temp.style.height=height+"px";
			
			this._temp.setAttribute('id',this._parameters.id);
			this._temp.className=this._parameters.className;			
			
			this._BindEvents(this._temp,this._parameters.bind);
			_finally.call(this);
			
		}
		else
		return function ()
		{
			this._temp.setAttribute('id',this._parameters.id);
			this._temp.className=this._parameters.className;
			
			this._width=this._img.width;
			this._height=this._img.height;
			this._widthHalf=this._width/2; // used for optimisation
			this._heightHalf=this._height/2;// used for optimisation
			
			var _widthMax=Math.sqrt((this._height)*(this._height) + (this._width) * (this._width));

			this._widthAdd = _widthMax - this._width;
			this._heightAdd = _widthMax - this._height;	// widthMax because maxWidth=maxHeight
			this._widthAddHalf=this._widthAdd/2; // used for optimisation
			this._heightAddHalf=this._heightAdd/2;// used for optimisation
			
			this._img.parentNode.removeChild(this._img);	


			this._canvas=document.createElement('canvas');
			this._canvas.setAttribute('width',this._width);
			this._canvas.style.position="relative";
			this._canvas.style.left = -this._widthAddHalf + "px";
			this._canvas.style.top = -this._heightAddHalf + "px";
			this._canvas.Wilq32 = this._temp.Wilq32;
			
			this._temp.appendChild(this._canvas);
			this._temp.style.width=this._width+"px";
			this._temp.style.height=this._height+"px";
			
			this._BindEvents(this._canvas,this._parameters.bind);
			this._cnv=this._canvas.getContext('2d');
			_finally.call(this);
		}
		function _finally(){
			this._rotate(this._parameters.angle);
			if (this._parameters.angle!=this._parameters.animateAngle) this.rotateAnimation(this._parameters);		
		}

	})(),

	_animateStart:function()
	{	
		if (this._timer) {
			clearTimeout(this._timer);
		}
		this._animate();
	},
	_animate:function()
	{
		var checkEnd = !!(Math.round(this._angle * 100 - this._parameters.animateAngle * 100)) == 0 && !!this._timer;

		if (this._parameters.callback && checkEnd){
			this._parameters.callback();
		}

		// TODO: Bug for animatedGif for static rotation ? (to test)
		if (checkEnd && !this._parameters.animatedGif) 
			{
				clearTimeout(this._timer);
			}
			else 
			{
				if (this._canvas||this._vimage||this._img) {
					// TODO: implement easing and speed of animation
					this._angle-=(this._angle-this._parameters.animateAngle)*0.1;
					if (typeof this._parameters.minAngle!="undefined") this._angle=Math.max(this._angle,this._parameters.minAngle);
					if (typeof this._parameters.maxAngle!="undefined") this._angle=Math.min(this._angle,this._parameters.maxAngle);
					this._rotate((~~(this._angle*10))/10);
				}
				var self = this;
				this._timer = setTimeout(function()
				{
					self._animate.call(self);
				}, 10);
			}
	},

	_rotate : (function()
	{
		var rad = Math.PI/180;
		if (IE)
		return function(angle)
		{
			this._container.style.rotation=angle+"deg";
		}
		else if (supportedCSS)
		return function(angle){
			this._img.style[supportedCSS]="rotate("+angle+"deg)";
		}
		else 
		return function(angle)
		{

			if (!this._img.width||typeof angle!="number") return;
			angle=(angle%360)* rad;
			// clear canvas	
			this._canvas.width = this._width+this._widthAdd;
			this._canvas.height = this._height+this._heightAdd;
			
			//TODO: Implement scaling for fixed image size
			//this._cnv.scale(0.8,0.8); // SCALE - if needed ;)
			
			// REMEMBER: all drawings are read from backwards.. so first function is translate, then rotate, then translate, translate..
			this._cnv.translate(this._widthAddHalf,this._heightAddHalf);	// at least center image on screen
			this._cnv.translate(this._widthHalf,this._heightHalf);			// we move image back to its orginal 
			this._cnv.rotate(angle);										// rotate image
			this._cnv.translate(-this._widthHalf,-this._heightHalf); // move image to its center, so we can rotate around its center
			
			//added by idfive
			this._cnv.fillStyle = "#CCC";
			this._cnv.fillRect(-12,-12,this._width+24, this._height+24); //make another rectangle rather than trying to draw a box around our white one
			this._cnv.fillStyle = "rgb(255,255,255)";
			this._cnv.fillRect(-10,-10,this._width+20, this._height+20); // the 10 pixel bevel to make images appear like photographs
			
			this._cnv.drawImage(this._img, 0, 0);							// First - we draw image
		}

	})()
}

if (IE)
{
Wilq32.PhotoEffect.prototype.createVMLNode=(function(){
document.createStyleSheet().addRule(".rvml", "behavior:url(#default#VML)");
		try {
			!document.namespaces.rvml && document.namespaces.add("rvml", "urn:schemas-microsoft-com:vml");
			return function (tagName) {
				return document.createElement('<rvml:' + tagName + ' class="rvml">');
			};
		} catch (e) {
			return function (tagName) {
				return document.createElement('<' + tagName + ' xmlns="urn:schemas-microsoft.com:vml" class="rvml">');
			};
		}		
})();
}

})(jQuery);
