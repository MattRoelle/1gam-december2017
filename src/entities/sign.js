class Sign {
	constructor(definition) {
		this.def = definition;
		this.sprite = game.phaser.add.sprite(definition.x, definition.y, "sign");
		this.sprite.z = 100;

		this.arrowSprite = game.phaser.add.sprite(definition.x + 11, definition.y - 25, "arrow");
		this.ogArrowY = this.arrowSprite.y;

		this.open = false;
		this.timeOpened = 0;
		this.currentText = 1;
		this.heldInteractionButtonLastUpdate = false;

		this.textGroup = game.phaser.add.group();
		this.textGroup.fixedToCamera = true;

		this.textSprite = game.phaser.add.sprite(100, 430, "text-bg");
		this.textSprite.fixedToCamera = true;
		this.textSprite.alpha = 0;
		this.text = game.phaser.add.text(120, 440, "", {
			font: "32px slkscr",
			fill: "#ffffff",
			align: "left",
			wordWrap: true,
			wordWrapWidth: 400
		});
		this.text.fixedToCamera = true;
		this.textSprite.alpha = 0;
	}

	update() {
		const dt = game.phaser.time.now - this.timeOpened;
		const charsVisible = Math.floor(dt/40);

		if (this.open) {
			this.text.text = this.def.properties[`text${this.currentText}`].substring(0, charsVisible);
			this.textSprite.alpha = 1;
			this.text.alpha = 1;
		}
		else {
			this.textSprite.alpha = 0;
			this.text.alpha = 0;
		}

		this.arrowSprite.y = this.ogArrowY - Math.sin(game.phaser.time.now/100)*10;

		if (game.utils.dist(this.sprite.x, this.sprite.y, game.player.sprite.x, game.player.sprite.y) < C.INTERACT_DISTANCE) {
			this.arrowSprite.alpha = 1;

			if (game.input.interact.isDown) {
				if (!this.heldInteractionButtonLastUpdate) {
					if (!this.open) {
						this.openText();
					} else {
						if (charsVisible < this.def.properties[`text${this.currentText}`].length) {
							this.timeOpened -= 5000;
						} else if (!!this.def.properties[`text${this.currentText + 1}`]) {
							this.timeOpened = game.phaser.time.now;
							this.currentText++;
						} else {
							this.currentText = 1;
							this.open = false;
						}
					}
				}
				this.heldInteractionButtonLastUpdate = true;
			} else {
				this.heldInteractionButtonLastUpdate = false;
			}
		} else {
			this.open = false;
			this.currentText = 1;
			this.arrowSprite.alpha = 0;
		}
	}

	openText() {
		this.open = true;
		this.timeOpened = game.phaser.time.now;
		this.text.text = "";
	}

	render() {
	}

	destroy() {
		this.sprite.destroy();
		this.arrowSprite.destroy();
	}
}
