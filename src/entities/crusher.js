
;(function() {
	window._1gam.entities = window._1gam.entities || {};

	const C = window._1gam.constants;

	window._1gam.entities.Crusher = class Crusher {
		constructor(definition) {
			this.def = definition;

			this.sGroup = _1gam.p.add.group();

			this.arm = _1gam.p.add.tileSprite(0, 0, 56, 20, "crusher-arm");
			this.arm.height = -this.arm.height;
			this.base = _1gam.p.add.sprite(0, 0, "crusher-base");
			this.head = _1gam.p.add.sprite(0, 0, "crusher-head");

			this.trigger = _1gam.p.add.sprite(0, 0, null);

			this.sGroup.add(this.arm);
			this.arm.x += 4;
			this.sGroup.add(this.base);
			this.sGroup.add(this.head);
			this.sGroup.add(this.trigger);

			this.sGroup.x = definition.x;
			this.sGroup.y = definition.y;

			this.height = definition.height - 54;

			this.timeStarted = _1gam.p.time.now;
			this.lastCrushAt = this.timeStarted;

			_1gam.p.physics.enable([this.head, this.base, this.arm, this.trigger], Phaser.Physics.ARCADE);
			this.arm.body.immovable = true;
			this.head.body.immovable = true;
			this.base.body.immovable = true;

			this.arm.body.setSize(56, 20, 0, 0);

			switch(definition.properties.direction) {
				case "down":
					this.sGroup.scale.setTo(1, -1);
					this.sGroup.y += 24;
					this.head.y -= 32;
					this.arm.y += 10;
					this.head.body.setSize(64, 24, 0, -24);
					this.trigger.x = this.head.x;
					this.trigger.y = this.head.y;
					this.trigger.body.setSize(64, 4, 0, -24);
					break;
				case "up":
					this.sGroup.y -= 24;
					this.sGroup.y += definition.height;
					this.head.y -= 32;
					this.arm.y += 10;
					this.head.body.setSize(64, 24, 0, 0);
					break;
			}

			this.ogHeadY = this.head.y;
			this.ogArmHeight = this.arm.height;
		}

		update() {

			const t = _1gam.p.time.now;
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
					_1gam.p.physics.arcade.overlap(_1gam.game.player.sprite, this.trigger, this.onCollision, null, this);
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

			_1gam.p.physics.arcade.collide(_1gam.game.player.sprite, this.head);
			_1gam.p.physics.arcade.collide(_1gam.game.player.sprite, this.base);
			_1gam.p.physics.arcade.collide(_1gam.game.player.sprite, this.arm);

			_1gam.p.debug.geom(new Phaser.Rectangle(this.trigger.x, this.trigger.y, this.trigger.body.width, this.trigger.body.height), 'rgba(255,0,0,1)');
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
				_1gam.game.die();
			}
		}
	}
})();
