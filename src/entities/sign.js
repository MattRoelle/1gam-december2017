;(function() {
	window._1gam.entities = window._1gam.entities || {};

	const C = window._1gam.constants;

	window._1gam.entities.Sign = class Sign {
		constructor(definition) {
			this.def = definition;
			this.sprite = _1gam.p.add.sprite(definition.x, definition.y, "sign");
			this.sprite.z = 100;

			this.arrowSprite = _1gam.p.add.sprite(definition.x + 11, definition.y - 25, "arrow");
			this.ogArrowY = this.arrowSprite.y;

			this.open = false;
			this.timeOpened = 0;
			this.currentText = 1;
			this.heldInteractionButtonLastUpdate = false;

			this.textGroup = _1gam.p.add.group();
			this.textGroup.fixedToCamera = true;

			this.textSprite = _1gam.p.add.sprite(100, 430, "text-bg");
			this.textSprite.fixedToCamera = true;
			this.textSprite.alpha = 0;
			this.text = _1gam.p.add.text(120, 440, "", {
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
			const dt = _1gam.p.time.now - this.timeOpened;
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

			this.arrowSprite.y = this.ogArrowY - Math.sin(_1gam.p.time.now/100)*10;

			if (_1gam.utils.dist(this.sprite.x, this.sprite.y, _1gam.game.player.sprite.x, _1gam.game.player.sprite.y) < C.INTERACT_DISTANCE) {
				this.arrowSprite.alpha = 1;

				if (_1gam.input.interact.isDown) {
					if (!this.heldInteractionButtonLastUpdate) {
						if (!this.open) {
							this.openText();
						} else {
							if (charsVisible < this.def.properties[`text${this.currentText}`].length) {
								this.timeOpened -= 5000;
							} else if (!!this.def.properties[`text${this.currentText + 1}`]) {
								this.timeOpened = _1gam.p.time.now;
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
			this.timeOpened = _1gam.p.time.now;
			this.text.text = "";
		}

		render() {
		}

		destroy() {
			this.sprite.destroy();
			this.arrowSprite.destroy();
		}
	}
})();
