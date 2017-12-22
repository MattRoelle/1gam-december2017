class Tracer {
	constructor(definition) {
		console.log("Tracer");
		this.def = definition;

		this.points = definition.polyline;

		for(let p of this.points) {
			p[0] += this.def.x;
			p[1] += this.def.y;
		}

		this.currentPointIdx = 0;
		this.next = this.points[(this.currentPointIdx + 1) % this.points.length];
		this.curr = this.points[this.currentPointIdx];

		this.sprite = game.phaser.add.sprite(0, 0, "sawblade");
		this.sprite.position.x = this.curr[0];
		this.sprite.position.y = this.curr[1];
		this.sprite.anchor.set(0.5);
		game.phaser.physics.enable([this.sprite], Phaser.Physics.ARCADE);
		this.sprite.body.setSize(32, 32, 0, 0);

		this.startTween();
	}

	createTween() {
		const _this = this;
		const t = game.phaser.add.tween(this.sprite.position)
			.to(
				{
					x: this.next[0],
					y: this.next[1],
				},
				game.utils.dist(this.curr[0], this.curr[1], this.next[0], this.next[1])*4,
				Phaser.Easing.Linear.None,
				true,
				0,
				0
			);

		t.onComplete.add(() => {
			_this.currentPointIdx = (_this.currentPointIdx + 1) % this.points.length;
			_this.startTween();
		});
	}

	startTween() {
		console.log("currentPointIdx", this.currentPointIdx, this.points.length);
		this.next = this.points[(this.currentPointIdx + 1) % this.points.length];
		this.curr = this.points[this.currentPointIdx];
		this.createTween();
	}

	update() {
		this.sprite.angle += 6;
		game.phaser.physics.arcade.overlap(game.player.sprite, this.sprite, this.onCollision, null, this);
	}

	onCollision(col) {
		if (col.key == C.PLAYER_SPRITE_KEY) {
			game.die();
		}
	}

	render() {

	}

	destroy() {
		this.sprite.destroy();
	}
}
