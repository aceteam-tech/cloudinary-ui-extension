import { observable, computed } from 'mobx'
import {v4} from 'uuid'

class Image {
    @observable id
    @observable breakpoint
    @observable url

    constructor({breakpoint = 0, url = ''}, onSave) {
        this.breakpoint = breakpoint
        this.url = url
        this.onSave = onSave
        this.id = v4()
    }

    onBreakpointChange = (breakpoint) => {
        this.breakpoint = Number.parseInt(breakpoint)
        this.onSave()
    }

    onUpload = ({url}) => {
        this.url = url
        this.onSave()
    }
}

class AppStore {
    @observable loading = false

    @observable images = []

    constructor(field) {
        this._field = field
        this.images = field.getValue().map(image => new Image(image, this.onSave))
    }

    @computed get defaultImage() {
        return this.images.find(image => image.breakpoint === '')
    }

    @computed get breakpointImages() {
        return this.images.filter(image => image.breakpoint !== '')
    }

    onSave = () => {
        this._field.setValue(JSON.parse(JSON.stringify(this.images)))
    }

    addBreakpoint = () => {
        this.images.push(new Image({}, this.onSave))
    }

    removeBreakpoint = (id) => {
        this.images = this.images.filter(image => image.id !== id)
        this.onSave()
    }
}
export default AppStore
