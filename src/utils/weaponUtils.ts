import { WeaponProperties } from '../ecs/components/WeaponComponent'

export function createDamage(weapon: WeaponProperties) {
	return weapon.minDamage + Math.round(Math.random() * (weapon.maxDamage - weapon.minDamage))
}
