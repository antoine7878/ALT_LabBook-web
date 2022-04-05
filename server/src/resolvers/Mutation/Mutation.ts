import * as GroupMutations from './GroupMutations'
import * as CompoundMutations from './CompoundMutations'
import * as ExpMutations from './ExpMutations'


export default {
		...GroupMutations,
		...CompoundMutations,
		...ExpMutations
}
