class Crusher {
	constructor(definition) {
		this.def = definition;

		this.sGroup = game.phaser.add.group();

		this.arm = game.phaser.add.tileSprite(0, 0, 56, 20, "crusher-arm");
		this.arm.height = -this.arm.height;
		this.base = game.phaser.add.sprite(0, 0, "crusher-base");
		this.head = game.phaser.add.sprite(0, 0, "crusher-head");

		this.trigger = game.phaser.add.sprite(0, 0, null);

		this.sGrougame.phaser.add(this.arm);
		this.arm.x += 4;
		this.sGrougame.phaser.add(this.base);
		this.sGrougame.phaser.add(this.head);
		this.sGrougame.phaser.add(this.trigger);

		this.sGrougame.phaser.x = definition.x;
		this.sGrougame.phaser.y = definition.y;

		this.height = definition.height - 54;

		this.timeStarted = game.phaser.time.now;
		this.lastCrushAt = this.timeStarted;

		game.phaser.physics.enable([this.head, this.base, this.arm, this.trigger], Phaser.Physics.ARCADE);
		this.arm.body.immovable = true;
		this.head.body.immovable = true;
		this.base.body.immovable = true;

		this.arm.body.setSize(56, 20, 0, 0);

		switch(definition.properties.direction) {
			case "down":
				this.sGrougame.phaser.scale.setTo(1, -1);
				this.sGrougame.phaser.y += 24;
				this.head.y -= 32;
				this.arm.y += 10;
				this.head.body.setSize(64, 24, 0, -24);
				this.trigger.x = this.head.x;
				this.trigger.y = this.head.y;
				this.trigger.body.setSize(64, 4, 0, -24);
				break;
			case "up":
				this.sGrougame.phaser.y -= 24;
				this.sGrougame.phaser.y += definition.height;
				this.head.y -= 32;
				this.arm.y += 10;
				this.head.body.setSize(64, 24, 0, 0);
				break;
		}

		this.ogHeadY = this.head.y;
		this.ogArmHeight = this.arm.height;
	}

	update() {

		const t = game.phaser.time.now;
		const dt = t - this.lastCrushAt;
		if (dt > this.def.properties.interval) {
			this.lastCrushAt = t;
		}

		if (dt < this.def.properties.speed) { 
			const halfSpeed = this.def.properties.speed/2;
			let crushPos = dt/halfSpeed;
			if (dt > halfSpeed) {
				crushPos = 2 - crushPos;
			}

			this.head.y = this.ogHeadY + this.height*crushPos*-1;
			this.arm.height = this.ogArmHeight + this.height*crushPos*-1

			this.trigger.x = this.head.x;
			this.trigger.y = this.head.y + 20;

			if (crushPos > 0.9) {
				game.phaser.physics.arcade.overlap(game.player.sprite, this.trigger, this.onCollision, null, this);
			}

			if (this.def.properties.direction == "up") {
				this.arm.body.setSize(56, -this.arm.height, 0, this.arm.height);
			} else {
				this.arm.body.setSize(56, -this.arm.height, 0, 0);
			}
		} else {
			this.head.y = this.ogHeadY;
			this.arm.height = this.ogArmHeight;
		}

		game.phaser.physics.arcade.collide(game.player.sprite, this.head);
		game.phaser.physics.arcade.collide(game.player.sprite, this.base);
		game.phaser.physics.arcade.collide(game.player.sprite, this.arm);

		game.phaser.debug.geom(new Phaser.Rectangle(this.trigger.x, this.trigger.y, this.trigger.body.width, this.trigger.body.height), 'rgba(255,0,0,1)');
	}

	render() {

	}

	destroy() {

		this.head.destroy();
		this.arm.destroy();
		this.base.destroy();
	}

	onCollision(col) {
		if (col.key == C.PLAYER_SPRITE_KEY) {
			game.die();
		}
	}
}
