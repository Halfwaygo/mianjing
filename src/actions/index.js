import rootActions from './root'
import dashboardActions from './dashboard'
import dimeventActions from './dimevent'
import setting from './setting'

export default {
    ...rootActions,
    ...dashboardActions,
    ...dimeventActions,
    ...setting
}
