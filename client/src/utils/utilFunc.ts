import { openedExp } from '../apollo/cache'

export const openExp = (id: number, name: string) => {
	const newItem = { id, name }
	if (openedExp().opened.some((item) => item.id === id)) {
		openedExp({
			...openedExp(),
			currentId: id
		})
	} else {
		openedExp({
			opened: [...(openedExp().opened), newItem],
			currentId: id
		})
	}
}