var options = {
  strings: ["Vivacity 2k18", "A surreal Symphony","LNMIIT Welcomes you!"],
  typeSpeed: 20
}

var typed = new Typed(".element", options);



declare var Snap:any;
declare var TweenMax:any;
declare var TimelineMax:any;
declare var Power2:any;

TweenMax.lagSmoothing(0);
console.clear();

interface point
{
	x: number;
	y: number;
}

class Flame
{
	private group: any;
	private startPoint: Point;
	private endPoint: Point;
	private startThickness: number;
	private endThickness: number;
	private guidePosition: number;
	private frequency: number;
	private amplitude: number;
	private height: number;
	private endHeight: number;
	private y: number;
	private particle: boolean;
	
	private body: any;
	
	id: string;
	
	constructor(svg: any, start:Point, end:Point, width:number, particle:boolean) 
	{
		this.id = String(Math.round(Math.random() * 999999999999999));
		this.group = svg.group();
		this.group.addClass('flame');
		this.startPoint = start;
		this.endPoint = end;
		this.startThickness = width + Math.round(Math.random() * 50);
		this.endThickness = 10 + Math.round(Math.random() * 10);
		this.guidePosition = Math.random() * 100;
		this.frequency = 0.01 + Math.random() * 0.008;
		this.amplitude = 40 + Math.random() * 40;
		this.height = 500;
		this.endHeight = 100 + Math.round(Math.random() * 400);
		this.y = Math.random() * 100;
		this.particle = particle;
		
		let colors:string[] = ['#F9ECA9', '#EFC900', '#D79700', '#D0BB48'];
			
		this.body = this.group.path().attr(
        {
            fill: this.particle ? '#F9ECA9' : colors[Math.floor(Math.random() * colors.length)],
			opacity: this.particle ? 1 : 0.8,
            stroke: 'none'
        });
		
		this.updateGuide();
    }
	
	remove()
	{
		this.group.remove();
	}

	updateGuide()
	{
		this.guide = [];
		let height: number = this.startPoint.y - this.endPoint.y;
		let widthChange: number = this.startPoint.x - this.endPoint.x;
		let y = this.startPoint.y;
		
		while (y-- >= this.endPoint.y) 
        {        
			var x = this.startPoint.x + (widthChange - (widthChange / height) * y);
            var wave = Math.sin(y * this.frequency + this.guidePosition)
            this.guide.push({y: y, x: x + (wave * this.amplitude / 2 + this.amplitude / 2)})
        }
	}

	start(onComplete:Function)
	{
		if(this.particle) TweenMax.to(this, (0.2 + Math.random()), {y: this.guide.length, height: this.endHeight, position: '+=6', ease:Linear.ease, onComplete: onComplete, onCompleteParams: [this]})
		else TweenMax.to(this, 0.5 + (Math.random()), {y: this.guide.length, height: this.endHeight, position: '+=6', ease:Power2.easeIn, onComplete: onComplete, onCompleteParams: [this]})
	}

	getPointAlongGuide(y:number, offsetXPercentage: number):Point
	{
		if(this.guide.length)
		{
			if(y >= this.guide.length) y = this.guide.length - 1;
			if(y < 0) y = 0;
				
			var thicknessDifference = this.endThickness - this.startThickness;
			var percentageAlongGuide = (y / this.guide.length) * 100;
			var thickness = this.startThickness + ((thicknessDifference / 100) * percentageAlongGuide);
			var xOffset = ((thickness / 2) / 100) * offsetXPercentage;
			return {x: this.guide[y].x + xOffset, y: this.guide[y].y}
		}
		return {x: 0, y: 0};
	}
	
	private drawPath(pathPoints)
	{
    	var points = [];
			
		for(var i = 0; i < pathPoints.length; i++)
		{
			var subPoints = [];
			for(var j = 0; j < pathPoints[i].points.length / 2; j++)
			{
				var p = pathPoints[i].points.slice(j*2, j*2 + 2);
				var point = this.getPointAlongGuide(Math.round(p[1]), p[0])
				subPoints.push(point.x);
				subPoints.push(point.y);
			}
			points.push(pathPoints[i].type + subPoints.join(' ')); 
		}
		
		return points.join(' ') + 'Z';
	}
	
	draw()
	{ 
		
		if(this.height > 0)
		{
			var y = Math.round(this.y)
			var height = Math.round(this.height)
			var heightChunks = height / 6;
			
// 			let xInc = 5;
// 			let yInc = 0.1;

// 			let x = xInc;
// 			let y = yInc;

// 			let flamePoints = [];

// 			for(let i = 0; i < 20; i++)
// 			{
// 				flamePoints.push(x);
// 				flamePoints.push(y);

// 				x += xInc;
// 				y += yInc;
// 			} 

// 			for(let i = 0; i < 20; i++)
// 			{
// 				flamePoints.push(x);
// 				flamePoints.push(y);

// 				x -= xInc;
// 				y += yInc;
// 			} 

// 			for(let i = 0; i < 20; i++)
// 			{
// 				flamePoints.push(x);
// 				flamePoints.push(y);

// 				x -= xInc;
// 				y -= yInc;
// 			} 

// 			for(let i = 0; i < 20; i++)
// 			{
// 				flamePoints.push(x);
// 				flamePoints.push(y);

// 				x += xInc;
// 				y -= yInc;
// 			} 
			
// 			//console.log(flamePoints)
			
			// I want to change this bit, this array could be generated in a loop.
			
			var body = this.particle ? [{type: 'M', points: [0, y]},
										{type: 'L', points: [10, y - heightChunks * 0.2,
									 20, y - heightChunks * 0.4,
									 30, y - heightChunks * 0.6,]}] : [
				{type: 'M', points: [0, y]},
				{type: 'L', points: [10, y - heightChunks * 0.2,
									 20, y - heightChunks * 0.4,
									 30, y - heightChunks * 0.6,
									 40, y - heightChunks * 0.8,
									 50, y - heightChunks * 1,
									 60, y - heightChunks * 1.2,
									 70, y - heightChunks * 1.4,
									 80, y - heightChunks * 1.6,
									 90, y - heightChunks * 1.8,
									 90, y - heightChunks * 2,
									 90, y - heightChunks * 2.2,
									 80, y - heightChunks * 2.4,
									 70, y - heightChunks * 2.6,
									 60, y - heightChunks * 2.8,
									 50, y - heightChunks * 3,
									 40, y - heightChunks * 3.1,
									 30, y - heightChunks * 3.2,
									 20, y - heightChunks * 3.3,
									 10, y - heightChunks * 3.4,
									 0, y - heightChunks * 3.5,
									 -10, y - heightChunks * 3.4,
									 -20, y - heightChunks * 3.3,
									 -30, y - heightChunks * 3.2,
									 -40, y - heightChunks * 3.1,
									 -50, y - heightChunks * 3,
									 -60, y - heightChunks * 2.8,
									 -70, y - heightChunks * 2.6,
									 -80, y - heightChunks * 2.4,
									 -90, y - heightChunks * 2.2,
									 -90, y - heightChunks * 2,
									 -90, y - heightChunks * 1.8,
									 -80, y - heightChunks * 1.6,
									 -70, y - heightChunks * 1.4,
									 -60, y - heightChunks * 1.2,
									 -50, y - heightChunks * 1,
									 -40, y - heightChunks * 0.8,
									 -30, y - heightChunks * 0.6,
									 -20, y - heightChunks * 0.4,
									 -10, y - heightChunks * 0.2,
									 0, y - heightChunks * 0,
									]},
				


			]
			
			this.body.attr({d: this.drawPath(body)})
			
		}
		
	}
}

class StageManager
{
	svg: any;
	size: {width: number, height: number};
	fire: any;

	constructor(svg: any) 
	{
        this.svg = svg;
		this.fire = {};
		this.size = {width: 0, height: 0};
    }

	init()
	{
		window.addEventListener('resize', () => this.onResize(), true);
		this.onResize();
		this.tick();
	}
	
	onResize()
	{
		this.size.width = 400;
		this.size.height = 800;
		
		this.svg
			.attr('width', this.size.width)
			.attr('height', this.size.height)
	}

	addFlame()
	{
		let particle = Math.random() > .8;
		let start:Point = {x: this.size.width / 2, y: this.size.height - (40) };
		let end:Point = {x: (this.size.width / 4) +  Math.random() * (this.size.width / 2), y: particle ? -20 : this.size.height / 3};
		let width:number = this.size.width / 4;
		let flame = new Flame(this.svg, start, end, width, particle);
		flame.start((flame:Flame) => this.removeFlame(flame));
		this.fire[flame.id] = flame;
	}
	
	removeFlame(flame: Flame)
	{
		delete this.fire[flame.id];
		flame.remove();
		flame = null; 
	}

	tick()
	{
		for(let i in this.fire)
		{
			this.fire[i].draw();
		}
		
		requestAnimationFrame(() => this.tick());
	}
}

let stageManager = new StageManager(Snap('svg'));
stageManager.init();

makeFlame();

function makeFlame()
{
	stageManager.addFlame();
	setTimeout(makeFlame, Math.random() * 60);
}

