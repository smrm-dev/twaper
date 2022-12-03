require('./utils/global')

const { dynamicExtend } = require('./utils/utils')
const Pair = dynamicExtend(
    class { },
    require('./apps/pair')
)
const Twaper = dynamicExtend(
    class { },
    require('./apps/twaper')
)

const pair = new Pair()
const twaper = new Twaper()

global.utils = {
    twaper
}