/**
 * notificationFx.js v1.0.0
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2014, Codrops
 * http://www.codrops.com
 */
;(function(window){'use strict';var docElem=window.document.documentElement,support={animations:Modernizr.cssanimations},animEndEventNames={'WebkitAnimation':'webkitAnimationEnd','OAnimation':'oAnimationEnd','msAnimation':'MSAnimationEnd','animation':'animationend'},animEndEventName=animEndEventNames[Modernizr.prefixed('animation')];function extend(a,b){for(var key in b){if(b.hasOwnProperty(key)){a[key]=b[key];}}
return a;}
function NotificationFx(options){this.options=extend({},this.options);extend(this.options,options);this._init();}
NotificationFx.prototype.options={wrapper:document.body,message:'yo!',layout:'growl',effect:'slide',type:'error',ttl:6000,onClose:function(){return false;},onOpen:function(){return false;}}
NotificationFx.prototype._init = function() {
    this.ntf = document.createElement('div');
    this.ntf.className = 'ns-box ns-' + this.options.layout + ' ns-effect-' + this.options.effect + ' ns-type-' + this.options.type;

    // Crear el contenido de manera segura
    var boxInner = document.createElement('div');
    boxInner.className = 'ns-box-inner';
    boxInner.textContent = this.options.message; // Usamos textContent para evitar XSS

    var closeSpan = document.createElement('span');
    closeSpan.className = 'ns-close';

    // Agregar los elementos al contenedor
    this.ntf.appendChild(boxInner);
    this.ntf.appendChild(closeSpan);

    // Insertar el notificación en el wrapper
    this.options.wrapper.insertBefore(this.ntf, this.options.wrapper.firstChild);

    var self = this;
    this.dismissttl = setTimeout(function() {
        if (self.active) {
            self.dismiss();
        }
    }, this.options.ttl);

    this._initEvents();
};
NotificationFx.prototype._initEvents=function(){var self=this;this.ntf.querySelector('.ns-close').addEventListener('click',function(){self.dismiss();});}
NotificationFx.prototype.show=function(){this.active=true;classie.remove(this.ntf,'ns-hide');classie.add(this.ntf,'ns-show');this.options.onOpen();}
NotificationFx.prototype.dismiss=function(){var self=this;this.active=false;clearTimeout(this.dismissttl);classie.remove(this.ntf,'ns-show');setTimeout(function(){classie.add(self.ntf,'ns-hide');self.options.onClose();},25);var onEndAnimationFn=function(ev){if(support.animations){if(ev.target!==self.ntf)return false;this.removeEventListener(animEndEventName,onEndAnimationFn);}
self.options.wrapper.removeChild(this);};if(support.animations){this.ntf.addEventListener(animEndEventName,onEndAnimationFn);}
else{onEndAnimationFn();}}
window.NotificationFx=NotificationFx;})(window);