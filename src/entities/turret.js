class Turret {
	constructor(definition) {
		this.def = definition;

		this.sprite = game.phaser.add.sprite(definition.x + 16, definition.y + 16, "turret");
		this.sprite.anchor.set(0.5);
		this.bullets = [];

		this.lastShotAt = game.phaser.time.now;

		switch(definition.properties.orientation) {
			case "left":
				this.fireX = -1;
				this.fireY = 0;
				this.emitter = game.phaser.add.emitter(this.sprite.x - 8, this.sprite.y, 100);
				break;
		}

		this.emitter.makeParticles("white-particle");
		this.emitter.setXSpeed(0, 0);
		this.emitter.setYSpeed(120, -120);
	}

	shoot() {
		this.emitter.explode(500, 5);
		this.bullets.push(new TurretBullet(
			this.sprite.x,
			this.sprite.y,
			this.fireX,
			this.fireY,
			this.def.properties.shotSpeed,
			this.def.properties.range*C.TILE_SIZE
		));
	}

	update() {
		const t = game.phaser.time.now;
		if (t - this.lastShotAt > this.def.properties.fireRate) {
			this.lastShotAt = t;
			this.shoot();
		}
		for(let b of this.bullets) {
			b.update();
			if (b.dead) b.destroy();
		}

		this.bullets = this.bullets.filter(b => !b.dead);
	}

	render() {

	}

	destroy() {
		this.sprite.destroy();
		for(let b of this.bullets) {
			b.destroy();
		}
	}
}

class TurretBullet {
	constructor(x, y, dx, dy, speed, range) {
		this.sprite = game.phaser.add.sprite(x, y, "turret-bullet");
		this.sprite.anchor.set(0.5);

		this.ogx = x;
		this.ogy = y;
		this.range = range;
		this.dx = dx;
		this.dy = dy;
		this.speed = speed;

		game.phaser.physics.enable([this.sprite], Phaser.Physics.ARCADE);
		this.sprite.body.setSize(6, 6, 1, 1)
		this.timeSpawned = game.phaser.time.now;

		this.dead = false;

		this.sprite.body.velocity.x = this.dx*this.speed;
		this.sprite.body.velocity.y = this.dy*this.speed;
	}

	update() {
		game.phaser.physics.arcade.overlap(game.player.sprite, this.sprite, this.onCollision, null, this);

		if (game.utils.dist(this.sprite.x, this.sprite.y, this.ogx, this.ogy) > this.range) {
			this.dead = true;
		}
	}

	onCollision(col) {
		console.log("collision");
		if (col.key == C.PLAYER_SPRITE_KEY) {
			game.die();
			this.dead = true;
		}
	}

	destroy() {
		this.sprite.destroy();
	}
}
