class Player {
	constructor() {
		this.sprite = game.phaser.add.sprite(120, 120, "grape");
		game.phaser.physics.enable([this.sprite], Phaser.Physics.ARCADE);

		this.sprite.anchor.set(0.5);
		this.sprite.animations.add("idle", [0, 1, 2], 5, true);
		this.sprite.animations.add("run", [3, 4, 5, 6], 10, true);
		this.sprite.animations.add("jump", [7], 0, true);
		this.sprite.animations.add("fall", [8], 0, true);
		this.sprite.animations.add("slow", [9], 0, true);
		this.sprite.animations.add("wallslide", [10], 0, true);
		this.sprite.animations.add("exit", [11, 12], 8, true);

		this.lastJumpAt = -1000;
		this.lastOnFloorAt = -1000;

		this.sprite.body.tilePadding.set(24, 24);
		this.sprite.body.setSize(22, 32, 6, 0);
		this.sprite.body.gravity.y = C.GRAVITY;
		this.sprite.body.drag.x = C.PLAYER_DRAG;

		this.slowEmitter = game.phaser.add.emitter(this.sprite.x, this.sprite.y, 100);
		this.slowEmitter.makeParticles("white-particle");
		this.slowEmitter.setYSpeed(-80, -120);
		this.slowEmitter.on = false;
		this.slowEmitter.setScale(0, 1, 0, 1, -300);
		this.slowEmitter.start(false, 500, 10, 0, false);
		this.slowEmitter.particleBringToTop = true;

		this.onWallLastFrame = false;
		this.lastWallSlideAt = 0;
		this.lastWallSide = 0;

		this.wallslideEmitter = game.phaser.add.emitter(this.sprite.x, this.sprite.y, 100);
		this.wallslideEmitter.makeParticles("white-particle");
		this.wallslideEmitter.setYSpeed(-80, -120);
		this.wallslideEmitter.on = false;
		this.wallslideEmitter.setScale(0, 1, 0, 1, -300);
		this.wallslideEmitter.start(false, 500, 10, 0, false);

		this.dead = false;
		this.exiting = false;

		this.lastWalkBlipAt = 0;
		this.blips = 0;
	}

	update() {
		const t = game.phaser.time.now;

		if (!this.dead && !this.exiting) {
			let speedMultiplier = 1;
			let moving = false;
			let slowingDown = false;
			const absXVel = Math.abs(this.sprite.body.velocity.x)
			const onWall = this.sprite.body.onWall();
			const onFloor = this.sprite.body.onFloor() || this.sprite.body.touching.down;

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

			if (game.input.left()) {
				moving = true;
				if (this.sprite.body.velocity.x > -C.PLAYER_RUN_CUTOFF) {
					this.sprite.body.velocity.x -= C.PLAYER_SPEED*speedMultiplier;
					if (this.sprite.body.velocity.x > 0) slowingDown = true;
				}
			}
			else if (game.input.right()) {
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

				const thresh = C.PLAYER_WALK_BLIP_SPEED * (((1 - (absXVel / C.PLAYER_MAX_SPEED)) * 0.7) + 0.3);
				if (onFloor && t - this.lastWalkBlipAt > thresh) {
					this.lastWalkBlipAt = t;
					this.blips++;
					game.audio.playSfx(this.blips % 2 == 0 ? SFX_TYPES.WALK : SFX_TYPES.WALK2);
				}
			}

			this.sprite.body.velocity.x = Math.max(-C.PLAYER_MAX_SPEED
				, this.sprite.body.velocity.x);
			this.sprite.body.velocity.x = Math.min(C.PLAYER_MAX_SPEED
				, this.sprite.body.velocity.x);


			const canJumpFromWall = this.lastWallSlideAt + C.PLAYER_JUMP_FORGIVENESS_THRESHOLD > t;

			if (game.input.jump.isDown) {
				if ((onFloor || 
					(
						(!onWall &&
							this.lastOnFloorAt + C.PLAYER_JUMP_FORGIVENESS_THRESHOLD > t &&
							this.lastWallSlideAt + C.PLAYER_JUMP_FORGIVENESS_THRESHOLD < t
						) ||
						(
							canJumpFromWall
							 /*&& 
							(
								(this.sprite.body.velocity.x < 0 && this.lastWallSide == 1) ||
								(this.sprite.body.velocity.x > 0 && this.lastWallSide == -1))*/
						)
					)
					&& t > this.lastJumpAt + C.PLAYER_JUMP_INTERVAL) && !game.input.jumpLastFrame) {
					this.lastJumpAt = t;
					this.sprite.body.velocity.y = C.PLAYER_JUMP_FORCE;

					game.audio.playSfx(SFX_TYPES.JUMP);

					if (!onFloor && canJumpFromWall && this.lastWallSide != 0) {
						this.sprite.body.velocity.x = C.PLAYER_WALLSLIDE_JUMP_FORCE * this.lastWallSide * -1;
						console.log(this.sprite.body.velocity.x);
					}
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

				if (this.lastWallSlideAt + C.PLAYER_WALLSLIDE_INTERVAL < game.phaser.time.now) {
					this.sprite.body.velocity.y *= 0.1;
				}
				if (!onFloor) {
					this.sprite.animations.play("wallslide");
				}
				this.wallslideEmitter.on = true;
				this.lastWallSlideAt = game.phaser.time.now;
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
			if (t - this.lastWalkBlipAt > C.PLAYER_EXIT_BLIP_SPEED) {
				this.lastWalkBlipAt = t;
				this.blips++;
				game.audio.playSfx(this.blips % 2 == 0 ? SFX_TYPES.DOOR : SFX_TYPES.DOOR2);
			}
		}
	}

	die() {
		if (this.dead) return;
		this.sprite.destroy();
		this.dead = true;
		this.deathEmitter = game.phaser.add.emitter(this.sprite.x, this.sprite.y, 100);
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
		if (this.exiting) return;

		this.exiting = true;
		this.sprite.animations.play("exit");
		this.sprite.body.velocity.x = 0;
		this.sprite.body.velocity.y = 0;
		const t = game.phaser.add.tween(game.phaser.world).to({ alpha: 0 }, 400, Phaser.Easing.Linear.None, true, 350, 0);
		t.onComplete.add(() => {
			game.warpToLevel(targetLevel);
		});
	}
}
