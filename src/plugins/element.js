import {
    Select,
    Option,
    Carousel,
    CarouselItem
} from 'element-ui'

const components = [
    Select,
    Option,
    Carousel,
    CarouselItem
]

export default {
    install(Vue) {
        components.forEach(component => Vue.component(component.name, component))
    }
}
