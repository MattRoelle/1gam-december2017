;(function() {
	window._1gam.entities = window._1gam.entities || {};

	const C = window._1gam.constants;

	window._1gam.entities.Turret = class {
		constructor(definition) {
			this.def = definition;

			this.sprite = _1gam.p.add.sprite(definition.x + 16, definition.y + 16, "turret");
			this.sprite.anchor.set(0.5);
			this.bullets = [];

			this.lastShotAt = _1gam.p.time.now;

			switch(definition.properties.orientation) {
				case "left":
					this.fireX = -1;
					this.fireY = 0;
					this.emitter = _1gam.p.add.emitter(this.sprite.x - 8, this.sprite.y, 100);
					break;
			}

			this.emitter.makeParticles("white-particle");
			this.emitter.setXSpeed(0, 0);
			this.emitter.setYSpeed(120, -120);
		}

		shoot() {
			this.emitter.explode(500, 5);
			this.bullets.push(new Bullet(
				this.sprite.x,
				this.sprite.y,
				this.fireX,
				this.fireY,
				this.def.properties.shotSpeed,
				this.def.properties.range*C.TILE_SIZE
			));
		}

		update() {
			const t = _1gam.p.time.now;
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

	class Bullet {
		constructor(x, y, dx, dy, speed, range) {
			this.sprite = _1gam.p.add.sprite(x, y, "turret-bullet");
			this.sprite.anchor.set(0.5);

			this.ogx = x;
			this.ogy = y;
			this.range = range;
			this.dx = dx;
			this.dy = dy;
			this.speed = speed;

			_1gam.p.physics.enable([this.sprite], Phaser.Physics.ARCADE);
			this.sprite.body.setSize(6, 6, 1, 1)
			this.timeSpawned = _1gam.p.time.now;

			this.dead = false;

			this.sprite.body.velocity.x = this.dx*this.speed;
			this.sprite.body.velocity.y = this.dy*this.speed;
		}

		update() {
			_1gam.p.physics.arcade.overlap(_1gam.game.player.sprite, this.sprite, this.onCollision, null, this);

			if (_1gam.utils.dist(this.sprite.x, this.sprite.y, this.ogx, this.ogy) > this.range) {
				this.dead = true;
			}
		}

		onCollision(col) {
			console.log("collision");
			if (col.key == C.PLAYER_SPRITE_KEY) {
				_1gam.game.die();
				this.dead = true;
			}
		}

		destroy() {
			this.sprite.destroy();
		}
	}
})();
