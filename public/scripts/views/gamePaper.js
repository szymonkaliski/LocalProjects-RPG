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
	function ReactiveBlob(canvas, tokens, color, minValue, maxValue) {
		this.paper = new Paper.PaperScope();
		this.paper.setup(canvas[0]);

		this.canvas = canvas;
		this.tokens = tokens;

		this.width = this.canvas.width();
		this.height = this.canvas.height();
		this.r = Math.max(10, Math.min(this.width / 2, this.height / 2) - 30);
		this.centerPoint = new this.paper.Point(this.width / 2, this.height / 2);

		this.minValue = minValue < 0 ? minValue : 0;
		this.maxValue = maxValue > 0 ? maxValue : 0;

		// positions and velocities for each token
		this.positions = this.tokens.map(function(token, index) {
			return this.centerPoint.add(positionOnCircle(index / this.tokens.length, this.r / 2 + this.scale(0)));
		}.bind(this));
		this.velocities = this.tokens.map(function() {
			return { "x": 0, "y": 0 };
		});

		// default lines
		this.lines = this.tokens.map(function(token, index) {
			var endPoint = this.centerPoint.add(
				positionOnCircle(index / this.tokens.length, this.r)
			);

			var textPoint = this.centerPoint.add(
				positionOnCircle(index / this.tokens.length, this.r + 20)
			);

			var line = new this.paper.Path();
			line.strokeColor = "rgba(0.1, 0.1, 0.1, 0.1)";

			line.moveTo(this.centerPoint);
			line.lineTo(endPoint);

			var text = new this.paper.PointText(textPoint);
			text.justification = "center";
			text.fillColor = "rgba(0.1, 0.1, 0.1, 0.4)";
			text.content = token.get("name") + ": 0";

			return {
				"line": line,
				"text": text
			};
		}.bind(this));

		// default blob path
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

		// spring consts
		this.stiffness = 60;
		this.friction = 3;
		this.threshold = 0.04;
		this.dt = 1 / 60;
	}

	ReactiveBlob.prototype.scale = function(value) {
		return (value - this.minValue) / (this.maxValue - this.minValue) * this.r / 3;
	};

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
		var currentValue = (this.tokens[tokenIndex].get("value") || 0) + value;
		this.tokens[tokenIndex].set("value", currentValue);

		this.positions[tokenIndex] = this.centerPoint.add(positionOnCircle(
			tokenIndex / this.tokens.length,
			this.r / 2 + this.scale(this.tokens[tokenIndex].get("value"))
		));

		this.lines[tokenIndex].text.content = this.tokens[tokenIndex].get("name") + ": " + currentValue;
	};

	ReactiveBlob.prototype.reset = function() {
		this.positions = this.tokens.map(function(token, index) {
			return this.centerPoint.add(positionOnCircle(index / this.tokens.length, this.r / 2 + this.scale(0)));
		}.bind(this));

		this.velocities = this.tokens.map(function() {
			return { "x": 0, "y": 0 };
		});

		this.lines.forEach(function(line, index) {
			line.text.content = this.tokens[index].get("name") + ": 0";
		}.bind(this));
	};

	return ReactiveBlob;
});
