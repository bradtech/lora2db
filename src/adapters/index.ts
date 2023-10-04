import { AbstractAdapter } from './AbstractAdapter'
import { OrangeAdapter } from './OrangeAdapter'
import { TTNAdapter } from './TTNAdapter'

const classMap = {
   orange: OrangeAdapter,
   ttn: TTNAdapter,
}

export { AbstractAdapter, OrangeAdapter, TTNAdapter, classMap }
