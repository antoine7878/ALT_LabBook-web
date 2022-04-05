import { InMemoryCache, makeVar } from '@apollo/client'

interface OpenedExp {
	opened: { id: number, name: string }[],
	currentId: number
}

export const openedCompoundViewer = makeVar<number | null>(1)

export const openedExp = makeVar<OpenedExp>({ opened: [{id:100, name:'ALT-001'}], currentId: 100 })

export const cache = new InMemoryCache({
	typePolicies: {
		Exp: {
			fields: {
				createdAt: {
					read(date) {
						const ret = (new Date())
						ret.setTime(date)
						return ret.toLocaleDateString(navigator.language)
					}
				}
			}
		},
		Query: {
			fields: {
				openedCompoundViewer: {
					read() {
						return openedCompoundViewer()
					}
				},
				openedExp: {
					read() {
						return openedExp()
					}
				}
			}
		}
	}
})
