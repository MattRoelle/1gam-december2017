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
		this.sprite.animations.add("slow", [9], 0, true);
		this.sprite.animations.add("wallslide", [10], 0, true);
		_1gam.p.camera.follow(this.sprite);

		this.lastJumpAt = -1000;
		this.lastOnFloorAt = -1000;

		this.sprite.body.tilePadding.set(24, 24);
		this.sprite.body.setSize(22, 32, 6, 0);
		this.sprite.body.gravity.y = C.GRAVITY;
		this.sprite.body.drag.x = C.PLAYER_DRAG;


		this.slowEmitter = _1gam.p.add.emitter(this.sprite.x, this.sprite.y, 100);
		this.slowEmitter.makeParticles("white-particle");
		this.slowEmitter.setYSpeed(-80, -120);
		this.slowEmitter.on = false;
		this.slowEmitter.setScale(0, 1, 0, 1, -300);
		this.slowEmitter.start(false, 500, 10, 0, false);

		this.dead = false;
	}

	Player.prototype.update = function() {
		if (!this.dead) {
			let speedMultiplier = 1;
			let moving = false;
			let slowingDown = false;
			const absXVel = Math.abs(this.sprite.body.velocity.x)
			const onWall = this.sprite.body.onWall() || this.sprite.body.touching.left || this.sprite.body.touching.right;
			const onFloor = this.sprite.body.onFloor() || this.sprite.body.touching.down;
			const t = _1gam.p.time.now;

			if (onWall && this.sprite.body.velocity.y > 0) {
				this.sprite.body.gravity.y = C.GRAVITY*C.PLAYER_WALLSLIDE_GRAVITY_SCALE;
			} else {
				this.sprite.body.gravity.y = C.GRAVITY;
			}


			if (onFloor || onWall) this.lastOnFloorAt = t;
			if (absXVel < C.PLAYER_SPEED_START_THRESHOLD) {
				speedMultiplier = C.PLAYER_SPEED_START_MULTIPLIER;
			}

			if (_1gam.input.movement.left.isDown) {
				this.sprite.body.velocity.x -= C.PLAYER_SPEED*speedMultiplier;
				moving = true;
				if (this.sprite.body.velocity.x > 0) slowingDown = true;
			}
			else if (_1gam.input.movement.right.isDown) {
				this.sprite.body.velocity.x += C.PLAYER_SPEED*speedMultiplier;
				moving = true;
				if (this.sprite.body.velocity.x < 0) slowingDown = true;
			}

			if (this.sprite.body.velocity.x > 20) this.sprite.scale.set(1, 1);
			else if (this.sprite.body.velocity.x < -20) this.sprite.scale.set(-1, 1);

			if (absXVel < C.PLAYER_IDLE_THRESHOLD) {
				this.sprite.animations.play("idle");
			} else if (!moving && !absXVel < C.PLAYER_SLOWDOWN_ANIM_THRESHOLD || slowingDown)  {
				this.sprite.animations.play("slow");
				slowingDown = true;
			} else {
				this.sprite.animations.play("run");
			}

			this.sprite.body.velocity.x = Math.max(-C.PLAYER_MAX_SPEED
				, this.sprite.body.velocity.x);
			this.sprite.body.velocity.x = Math.min(C.PLAYER_MAX_SPEED
				, this.sprite.body.velocity.x);

			if (_1gam.input.jump.isDown) {
				if ((onFloor || (!onWall && this.lastOnFloorAt + C.PLAYER_JUMP_FORGIVENESS_THRESHOLD) > t) && t > this.lastJumpAt + C.PLAYER_JUMP_INTERVAL) {
					this.lastJumpAt = t;
					this.sprite.body.velocity.y = C.PLAYER_JUMP_FORCE;
				}
				else if (!onFloor && t < this.lastJumpAt + C.PLAYER_JUMP_HOLD_THRESHOLD) {
					this.sprite.body.velocity.y += C.PLAYER_JUMP_HOLD_FORCE;
				}
			}

			if (!onFloor) {
				if (this.sprite.body.velocity.y < 50) this.sprite.animations.play("jump");
				else this.sprite.animations.play("fall");
			}

			if (onWall) {
				this.sprite.animations.play("wallslide");
			}

			if (slowingDown && onFloor && absXVel > 50) {
				this.slowEmitter.on = true;
				const vel = 30 + 100*(absXVel/400);
				this.slowEmitter.frequency = 10 + 20*(1 - (absXVel/400));
				this.slowEmitter.y = this.sprite.y + 20;
				if (this.sprite.body.velocity.x < 0) {
					this.slowEmitter.x = this.sprite.x - 5;
					this.slowEmitter.setXSpeed(vel, vel * 1.25);
				}
				else {
					this.slowEmitter.x = this.sprite.x + 5;
					this.slowEmitter.setXSpeed(-vel, -vel * 1.25);
				}
			} else {
				this.slowEmitter.on = false;
			}
			//this.sprite.body.velocity.y = Math.max(C.PLAYER_MAX_FALL_SPEED, this.sprite.body.velocity.y);
		}
	};

	Player.prototype.die = function() {
		this.sprite.destroy();
		this.dead = true;
		this.deathEmitter = _1gam.p.add.emitter(this.sprite.x, this.sprite.y, 100);
		this.deathEmitter.setXSpeed(-600, 600);
		this.deathEmitter.setYSpeed(-600, 600);
		this.deathEmitter.makeParticles("grape-particle");
		this.deathEmitter.gravity = 300;
		this.deathEmitter.explode(2000, 100);
	};

	Player.prototype.destroy = function() {
		this.deathEmitter.destroy();
	};
})();
