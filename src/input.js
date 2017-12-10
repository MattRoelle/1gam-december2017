;(function() {
	window._1gam.input = window._1gam.input || {};

	const input = window._1gam.input;

	input.init = _init;

	function _init() {
		input.movement = _1gam.p.input.keyboard.createCursorKeys();
		input.jump = _1gam.p.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	}
})();
