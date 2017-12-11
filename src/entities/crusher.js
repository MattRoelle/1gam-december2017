
;(function() {
	window._1gam.entities = window._1gam.entities || {};

	window._1gam.entities.Crusher = Crusher;
	const C = window._1gam.constants;

	function Crusher(definition) {
		this.def = definition;

		this.sGroup = _1gam.p.add.group();

		this.arm = _1gam.p.add.tileSprite(0, 0, 56, 20, "crusher-arm");
		this.arm.height = -this.arm.height;
		this.base = _1gam.p.add.sprite(0, 0, "crusher-base");
		this.head = _1gam.p.add.sprite(0, 0, "crusher-head");

		this.sGroup.add(this.arm);
		this.arm.x += 4;
		this.sGroup.add(this.base);
		this.sGroup.add(this.head);

		this.sGroup.x = definition.x;
		this.sGroup.y = definition.y;

		this.height = definition.height - 54;

		this.timeStarted = _1gam.p.time.now;
		this.lastCrushAt = this.timeStarted;

		_1gam.p.physics.enable([this.head, this.base, this.arm], Phaser.Physics.ARCADE);
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

	Crusher.prototype.update = function() {
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

			if (crushPos > 0.8) {
				_1gam.p.physics.arcade.overlap(_1gam.game.player.sprite, this.head, this.onCollision, null, this);
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
	};

	Crusher.prototype.crush = function() {

	}

	Crusher.prototype.render = function() {

	};

	Crusher.prototype.destroy = function() {
		this.head.destroy();
		this.arm.destroy();
		this.base.destroy();
	};

	Crusher.prototype.onCollision = function(col) {
		if (col.key == C.PLAYER_SPRITE_KEY) {
			_1gam.game.die();
		}
	}
})();
