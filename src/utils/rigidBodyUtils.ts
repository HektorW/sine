export function getRigidBodyLabel(entityId: string, componentId: string): string {
	return `${entityId}-${componentId}`
}

export function getEntityIdFromRigidBodyLabel(label: string) {
	return label.split('-')[0]
}
