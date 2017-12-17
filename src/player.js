;(function() {
	window._1gam.player = window._1gam.player || {};

	const C = _1gam.constants;

	_1gam.player.Player = class Player {
		constructor() {
			this.sprite = _1gam.p.add.sprite(120, 120, "grape");
			_1gam.p.physics.enable([this.sprite], Phaser.Physics.ARCADE);

			this.sprite.anchor.set(0.5);
			this.sprite.animations.add("idle", [0, 1, 2], 5, true);
			this.sprite.animations.add("run", [3, 4, 5, 6], 10, true);
			this.sprite.animations.add("jump", [7], 0, true);
			this.sprite.animations.add("fall", [8], 0, true);
			this.sprite.animations.add("slow", [9], 0, true);
			this.sprite.animations.add("wallslide", [10], 0, true);
			this.sprite.animations.add("exit", [11, 12], 8, true);
			_1gam.p.camera.follow(this.sprite);

			this.exiting = false;
			this.timeStartedExit = 0;

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
			this.slowEmitter.particleBringToTop = true;

			this.onWallLastFrame = false;
			this.lastWallSlideAt = 0;
			this.lastWallSide = 0;

			this.wallslideEmitter = _1gam.p.add.emitter(this.sprite.x, this.sprite.y, 100);
			this.wallslideEmitter.makeParticles("white-particle");
			this.wallslideEmitter.setYSpeed(-80, -120);
			this.wallslideEmitter.on = false;
			this.wallslideEmitter.setScale(0, 1, 0, 1, -300);
			this.wallslideEmitter.start(false, 500, 10, 0, false);

			this.dead = false;
		}

		update() {
			this.sprite.bringToTop();
			if (!this.dead && !this.exiting) {
				let speedMultiplier = 1;
				let moving = false;
				let slowingDown = false;
				const absXVel = Math.abs(this.sprite.body.velocity.x)
				const onWall = this.sprite.body.onWall();
				const onFloor = this.sprite.body.onFloor() || this.sprite.body.touching.down;
				const t = _1gam.p.time.now;

				if (onWall && this.sprite.body.velocity.y > 150) {
					this.sprite.body.gravity.y = C.GRAVITY*C.PLAYER_WALLSLIDE_GRAVITY_SCALE;
				} else {
					this.sprite.body.gravity.y = C.GRAVITY;
				}

				if (onFloor || onWall) {
					this.sprite.body.drag.x = C.PLAYER_DRAG;
				} else {
					this.sprite.body.drag.x = C.PLAYER_AIR_DRAG;
				}

				if (onFloor || onWall) this.lastOnFloorAt = t;
				if (absXVel < C.PLAYER_SPEED_START_THRESHOLD) {
					speedMultiplier = C.PLAYER_SPEED_START_MULTIPLIER;
				}

				if (_1gam.input.movement.left.isDown) {
					moving = true;
					if (this.sprite.body.velocity.x > -C.PLAYER_RUN_CUTOFF) {
						this.sprite.body.velocity.x -= C.PLAYER_SPEED*speedMultiplier;
						if (this.sprite.body.velocity.x > 0) slowingDown = true;
					}
				}
				else if (_1gam.input.movement.right.isDown) {
					moving = true;
					if (this.sprite.body.velocity.x < C.PLAYER_RUN_CUTOFF) {
						this.sprite.body.velocity.x += C.PLAYER_SPEED*speedMultiplier;
						if (this.sprite.body.velocity.x < 0) slowingDown = true;
					}
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

				if (_1gam.input.jump.isDown) { if ((onFloor || 
						(
							(!onWall &&
								this.lastOnFloorAt + C.PLAYER_JUMP_FORGIVENESS_THRESHOLD > t &&
								this.lastWallSlideAt + C.PLAYER_JUMP_FORGIVENESS_THRESHOLD < t
							) ||
							(

								this.lastWallSlideAt + C.PLAYER_JUMP_FORGIVENESS_THRESHOLD > t && 
								(
									(this.sprite.body.velocity.x < 0 && this.lastWallSide == 1) ||
									(this.sprite.body.velocity.x > 0 && this.lastWallSide == -1))
								)
							)
						&& t > this.lastJumpAt + C.PLAYER_JUMP_INTERVAL)) {
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

				if (this.sprite.scale.x < 0) {
					this.wallslideEmitter.x = this.sprite.x - 16;
				} else {
					this.wallslideEmitter.x = this.sprite.x + 16;
				}

				this.wallslideEmitter.y = this.sprite.y;
				if (onWall) {

					if (this.sprite.body.blocked.left) this.lastWallSide = -1;
					else if (this.sprite.body.blocked.right) this.lastWallSide = 1;

					if (this.lastWallSlideAt + C.PLAYER_WALLSLIDE_INTERVAL < _1gam.p.time.now) {
						this.sprite.body.velocity.y *= 0.2;
					}
					this.sprite.animations.play("wallslide");
					this.wallslideEmitter.on = true;
					this.lastWallSlideAt = _1gam.p.time.now;
				} else {
					this.wallslideEmitter.on = false;
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
			
				this.onWallLastFrame = onWall;
			} else if (this.exiting) {
				const dt = _1gam.p.time.now - this.timeStartedExit;
				const scale = Math.max(0, 1 - (dt/1000));
				this.sprite.scale.setTo(scale, scale);
				this.sprite.position.y -= 2.5;

				if (dt > 1000) {
					_1gam.game.warpToLevel(this.targetLevel);
				}
			}
		}

		die() {
			if (this.dead) return;
			this.sprite.destroy();
			this.dead = true;
			this.deathEmitter = _1gam.p.add.emitter(this.sprite.x, this.sprite.y, 100);
			this.deathEmitter.setXSpeed(-600, 600);
			this.deathEmitter.setYSpeed(-600, 600);
			this.deathEmitter.makeParticles("grape-particle");
			this.deathEmitter.gravity = 300;
			this.deathEmitter.explode(2000, 100);
		}

		destroy() {
			!!this.deathEmitter && this.deathEmitter.destroy();
			!!this.slowEmitter && this.slowEmitter.destroy();
			!!this.wallslideEmitter && this.wallslideEmitter.destroy();
			!!this.sprite && this.sprite.destroy();
		}

		exit(targetLevel) {
			this.exiting = true;
			this.sprite.animations.play("exit");
			this.timeStartedExit = _1gam.p.time.now;
			this.targetLevel = targetLevel;
		}
	}
})();
