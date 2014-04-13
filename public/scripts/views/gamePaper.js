define([
	"jquery",
	"paper"
], function($, Paper) {
	var positionOnCircle = function(angle, r) {
		return [
			r * Math.sin(angle * Math.PI * 2),
			r * Math.cos(angle * Math.PI * 2)
		];
	};

	// tokens is array of possible tokens, with value of this token,
	// default is 0 and is placed in the r / 2
	function ReactiveBlob(canvas, tokens, color) {
		this.paper = new Paper.PaperScope();
		this.paper.setup(canvas[0]);

		this.canvas = canvas;
		this.tokens = tokens;

		this.width = this.canvas.width();
		this.height = this.canvas.height();
		this.r = Math.max(10, Math.min(this.width / 2, this.height / 2) - 10);
		this.centerPoint = new this.paper.Point(this.width / 2, this.height / 2);

		this.positions = this.tokens.map(function(token, index) {
			return this.centerPoint.add(positionOnCircle(index / this.tokens.length, this.r / 2));
		}.bind(this));
		this.defaultPositions = this.positions.slice(0);
		this.velocities = this.tokens.map(function() {
			return { "x": 0, "y": 0 };
		});

		this.path = new this.paper.Path();
		this.positions.forEach(function(position) {
			this.path.add(position);
		}.bind(this));

		this.path.strokeColor = color;
		this.path.closed = true;
		this.path.smooth();

		// this.paper.view.draw();
		this.paper.view.onFrame = function() {
			this.drawFrame();
		}.bind(this);

		this.stiffness = 80;
		this.friction = 2;
		this.threshold = 0.02;
		this.dt = 1 / 60;
	}

	ReactiveBlob.prototype.drawFrame = function() {
		for (var i = 0; i < this.path.segments.length; ++i) {
			var distX = this.positions[i].x - this.path.segments[i].point.x;
			var distY = this.positions[i].y - this.path.segments[i].point.y;

			var accelerationX = this.stiffness * distX - this.friction * this.velocities[i].x;
			this.velocities[i].x += accelerationX * this.dt;

			var accelerationY = this.stiffness * distY - this.friction * this.velocities[i].y;
			this.velocities[i].y += accelerationY * this.dt;

			this.path.segments[i].point.x += this.velocities[i].x * this.dt;
			this.path.segments[i].point.y += this.velocities[i].y * this.dt;
		}
	};

	ReactiveBlob.prototype.updateValue = function(tokenIndex, value) {
		this.tokens[tokenIndex] += value;
		this.positions[tokenIndex] = this.centerPoint.add(positionOnCircle(
			tokenIndex / this.tokens.length,
			this.r / 2 + this.tokens[tokenIndex]
		));

		console.log(tokenIndex, value, this.tokens);
	};

	return ReactiveBlob;
});
