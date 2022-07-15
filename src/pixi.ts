import * as PIXI from 'pixi.js'

export const pixiApp = new PIXI.Application({
	resizeTo: window,
	autoDensity: true,
	backgroundColor: 0xffffff,
})

PIXI.settings.RESOLUTION = window.devicePixelRatio || 1
