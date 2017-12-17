;(function() {
	window._1gam.entities = window._1gam.entities || {};

	const C = window._1gam.constants;

	window._1gam.entities.Turret = class {
		constructor(definition) {
			this.def = definition;

			this.baseSprite = _1gam.p.add.sprite(definition.x + 16, definition.y + 16, "turret");
			this.baseSprite.anchor.set(0.5);
			this.bullets = [];

			this.lastShotAt = _1gam.p.time.now;

			switch(definition.properties.orientation) {
				case "left":
					this.fireX = -1;
					this.fireY = 0;
					break;
			}
		}

		shoot() {
			this.bullets.push(new Bullet(this.baseSprite.x, this.baseSprite.y, this.fireX, this.fireY, this.def.properties.shotSpeed));
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
			this.baseSprite.destroy();
			for(let b of this.bullets) {
				b.destroy();
			}
		}
	}

	class Bullet {
		constructor(x, y, dx, dy, speed) {
			this.sprite = _1gam.p.add.sprite(x, y, "turret-bullet");
			this.sprite.anchor.set(0.5);

			this.dx = dx;
			this.dy = dy;
			this.speed = speed;

			_1gam.p.physics.enable([this.sprite], Phaser.Physics.ARCADE);
			this.sprite.body.setSize(6, 6, 1, 1)
			this.sprite.body.immovable = true;
			this.timeSpawned = _1gam.p.time.now;

			this.dead = false;

			this.sprite.body.velocity.x = this.dx*this.speed;
			this.sprite.body.velocity.y = this.dy*this.speed;
		}

		update() {
			_1gam.p.physics.arcade.overlap(_1gam.game.player.sprite, this.sprite, this.oCollision, null, this);

			if (_1gam.p.time.now - this.timeSpawned > 250) {
				console.log(_1gam.game.currentLevel.map);
				_1gam.p.physics.arcade.overlap(_1gam.game.currentLevel.map, this.sprite, () => {
					this.dead = true;
				}, null, this);
			}
		}

		onCollision(col) {
			if (col.key == C.PLAYER_SPRITE_KEY) {
				_1gam.game.die();
			}
		}

		destroy() {
			this.sprite.destroy();
		}
	}
})();
