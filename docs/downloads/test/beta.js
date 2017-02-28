var m, tl;

function activateClickouts() {
	mkr.on('#clickTag', 'click', clickout);
}

function clickout() {
	console.log('clickTag');
	Enabler.exit('clickTag', clickTag);
}

window.onload = function() {
	if (!Enabler.isInitialized()) {
		Enabler.addEventListener( studio.events.StudioEvent.INIT, setup);
	}
	else {
		setup();
	}
};

function setup() {
	mkr.addRule('svg', 'position:absolute;');
	//m = mkr.makeDC(300, 600, {preload:true, css:{backgroundColor:'#fff'/*cursor:'pointer'*/}});
	m = new mkr({preload:true, css:{width:300, height:600, background:'#ff0000'}});

	m.create('img', {attr:{class:'bg', src:'bg.jpg'}, css:{}});
	m.create('img', {attr:{class:'beta', src:'beta.png'}, css:{}}, '.mkr-container');

	var svg, defs, grad, mask, image;
	svg = m.create('svg', {attr:{class:'svg', width:m.width, height:m.height}, css:{}});
		//console.log('svg loaded!');
		defs = m.create('defs', {attr:{}}, svg);
			grad = m.create('linearGradient', {attr:{id:'gradient', x1:'0', x2:'0', y1:'0', y2:'1'}}, defs);
				m.create('stop', {attr:{offset:'0', 'stop-color':'#000'}}, grad);
				m.create('stop', {attr:{offset:'0.05', 'stop-color':'#fff'}}, grad);
				m.create('stop', {attr:{offset:'1', 'stop-color':'#fff'}}, grad);

			mask = m.create('mask', {attr:{id:'gradient-mask'}}, defs);
				m.create('rect', {attr:{x:0, y:m.height, width:m.width, height:m.height*1.5, fill:'url(#gradient)'}}, mask);

		image = m.create('image', {attr:{'xlink:href':'bg2.jpg', width:m.width, height:m.height, x:0, y:0, mask:'url(#gradient-mask)'}}, svg);

	m.create('img', {attr:{class:'beta beta0', src:'beta-box.png'}, css:{alpha:0}});
	m.create('img', {attr:{class:'beta beta1', src:'beta-cloud.png'}, css:{alpha:0}});
	m.create('img', {attr:{class:'beta beta2', src:'beta-king.png'}, css:{alpha:0}});
	m.create('img', {attr:{class:'beta beta3', src:'beta-mail.png'}, css:{alpha:0}});
	m.create('img', {attr:{class:'beta beta4', src:'beta-pencil.png'}, css:{alpha:0}});
	m.create('img', {attr:{class:'memory', src:'icon-memory.png'}, css:{alpha:0}});
	m.create('img', {attr:{class:'sign', src:'icon-sign.png'}, css:{alpha:0}});

	var spd = .5, pause=1, repeats=2, repeatCount=0;
	tl = new TimelineMax({paused:true, repeat:repeats, yoyo:false, repeatDelay:1, onRepeat:function() {
		repeatCount++;
	}});
	
	var modY = function(val) {
		if(repeatCount == 2) {
			return 215;
		}
		return val;
	};
	var modO = function(val) {
		if(repeatCount == 2) {
			return 1;
		}
		return val;
	};
	tl.to('.beta0', spd, {alpha:1, repeat:1, yoyo:true, repeatDelay:pause});
	tl.to('.beta1', spd, {alpha:1, repeat:1, yoyo:true, repeatDelay:pause});
	tl.to('.beta2', spd, {alpha:1, repeat:1, yoyo:true, repeatDelay:pause});
	tl.to('.beta3', spd, {alpha:1, repeat:1, yoyo:true, repeatDelay:pause});
	tl.to('.beta4', spd, {alpha:1, repeat:1, yoyo:true, repeatDelay:pause});
	tl.to('.memory, .sign', spd, {alpha:1});
	tl.to('#gradient-mask rect', tl.duration(), {attr:{y:-.25*m.height}, ease:Power0.easeNone}, 0);
	tl.to('#gradient-mask rect', spd, {attr:{y:m.height}, modifiers:{y:modY}, ease:Power0.easeNone}, '+=3');
	tl.to('.memory, .sign', spd, {opacity:0, modifiers:{opacity:modO}}, '-='+spd);

	m.create('div', {attr:{id:'clickTag'}, css:{width:m.width, height:m.height, backgroundColor:'#fff', alpha:0, cursor:'pointer', zIndex:300}});

	m.load(loadComplete);
}

function loadComplete() {
	activateClickouts();
	TweenLite.delayedCall(1, frame1);
}

function frame1() {
	tl.play();
}