/*
 * A sawblade spinning on a chain
 */
class Spinner {
	constructor(definition) {
		this.def = definition;

		this.baseSprite = game.phaser.add.sprite(definition.x + 16, definition.y + 16, "spinner-base");
		this.armSprite = game.phaser.add.sprite(definition.x + 16, definition.y + 16, "spinner-arm");
		this.headSprite = game.phaser.add.sprite(definition.x + 16, definition.y + 84, "sawblade");

		this.baseSprite.anchor.set(0.5);
		this.armSprite.anchor.set(0.5, 0);
		this.headSprite.anchor.set(0.5);

		this.theta = 0;

		this.hasKilledPlayer = false;
	}

	update() {
		this.theta += this.def.properties.speed;
		this.armSprite.angle = this.theta;
		this.headSprite.x = this.baseSprite.x + Math.cos((this.theta*Math.PI/180) + Math.PI/2)*80;
		this.headSprite.y = this.baseSprite.y + Math.sin((this.theta*Math.PI/180) + Math.PI/2)*80;
		this.headSprite.angle += 10;

		if (!this.hasKilledPlayer && game.utils.dist(this.headSprite.x, this.headSprite.y, game.player.sprite.x, game.player.sprite.y) < 40) {
			this.hasKilledPlayer = true;
			game.die();
		}
	}

	render() {

	}

	destroy() {
		this.baseSprite.destroy();
		this.armSprite.destroy();
		this.headSprite.destroy();
	}
}
