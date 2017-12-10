;(function() {
	window._1gam.player = window._1gam.player || {};
	_1gam.player.Player = Player;

	const C = _1gam.constants;

	function Player() {
		this.sprite = _1gam.p.add.sprite(120, 120, "grape");
		_1gam.p.physics.enable([this.sprite], Phaser.Physics.ARCADE);

		this.sprite.anchor.set(0.5);
		this.sprite.animations.add("idle", [0, 1, 2], 5, true);
		this.sprite.animations.add("run", [3, 4, 5, 6], 10, true);
		this.sprite.animations.add("jump", [7], 0, true);
		this.sprite.animations.add("fall", [8], 0, true);
		_1gam.p.camera.follow(this.sprite);

		this.lastJumpAt = -1000;

		this.sprite.body.tilePadding.set(24, 24);
		this.sprite.body.setSize(22, 32, 6, 0);
		this.sprite.body.gravity.y = C.GRAVITY;

		this.dead = false;
	}

	Player.prototype.update = function() {
		if (!this.dead) {
			if (_1gam.input.movement.left.isDown) this.sprite.body.velocity.x -= C.PLAYER_SPEED;
			else if (_1gam.input.movement.right.isDown) this.sprite.body.velocity.x += C.PLAYER_SPEED;
			else this.sprite.body.velocity.x = 0;

			if (this.sprite.body.velocity.x > 20) this.sprite.scale.set(1, 1);
			else if (this.sprite.body.velocity.x < -20) this.sprite.scale.set(-1, 1);

			if (Math.abs(this.sprite.body.velocity.x) < 20) this.sprite.animations.play("idle");
			else this.sprite.animations.play("run");

			this.sprite.body.velocity.x = Math.max(-C.PLAYER_MAX_SPEED
				, this.sprite.body.velocity.x);
			this.sprite.body.velocity.x = Math.min(C.PLAYER_MAX_SPEED
				, this.sprite.body.velocity.x);

			if (_1gam.input.jump.isDown) {
				if (this.sprite.body.onFloor() && _1gam.p.time.now > this.lastJumpAt + C.PLAYER_JUMP_INTERVAL) {
					this.lastJumpAt = _1gam.p.time.now;
					this.sprite.body.velocity.y = C.PLAYER_JUMP_FORCE;
				}
				else if (!this.sprite.body.onFloor() && _1gam.p.time.now < this.lastJumpAt + C.PLAYER_JUMP_HOLD_THRESHOLD) {
					this.sprite.body.velocity.y += C.PLAYER_JUMP_HOLD_FORCE;
				}
			}

			if (!this.sprite.body.onFloor()) {
				if (this.sprite.body.velocity.y < 50) this.sprite.animations.play("jump");
				else this.sprite.animations.play("fall");
			}

			//this.sprite.body.velocity.y = Math.max(C.PLAYER_MAX_FALL_SPEED, this.sprite.body.velocity.y);
		}
	};

	Player.prototype.die = function() {
		this.sprite.destroy();
		this.dead = true;
		this.emitter = _1gam.p.add.emitter(this.sprite.x, this.sprite.y, 100);
		this.emitter.setXSpeed(-600, 600);
		this.emitter.setYSpeed(-600, 600);
		this.emitter.makeParticles("grape-particle");
		this.emitter.gravity = 300;
		this.emitter.explode(2000, 100);
	};

	Player.prototype.destroy = function() {
		this.emitter.destroy();
	};
})();
