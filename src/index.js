import React from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import { init } from 'contentful-ui-extensions-sdk'
import '@contentful/forma-36-react-components/dist/styles.css'
import './index.css'
import {
    Note,
    Tabs,
    Tab,
    TabPanel,
    Button,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextInput
} from "@contentful/forma-36-react-components"
import Image from './components/Image/Image'
import AppStore from './stores/App.store'
import { observer } from 'mobx-react'

class Breakpoint {
    value = 0
    imageId = ''
}

@observer
class App extends React.Component {
    static propTypes = {
        sdk: PropTypes.object.isRequired
    }

    detachExternalChangeHandler = null

    constructor(props) {
        super(props)
        this.state = {
            activeTab: 'first',
            loader: false
        }
        console.log({ 'props.sdk': props.sdk })
        this.appStore = new AppStore(props.sdk.field)
    }

    componentDidMount() {
        console.log({ 'this.props': this.props })

        // Handler for external field value changes (e.g. when multiple authors are working on the same entry).
        this.detachExternalChangeHandler = this.props.sdk.field.onValueChanged(this.onExternalChange)
        this.props.sdk.window.startAutoResizer()
    }

    componentWillUnmount() {
        if (this.detachExternalChangeHandler) {
            this.detachExternalChangeHandler()
        }
    }

    onExternalChange = value => {
        this.setState({ value })
    }

    switchTab = (id) => {
        this.setState({
            activeTab: id
        })
    }

    render() {
        const { cloud_name, preset } = this.props.sdk.parameters.instance
        return (
            <>
                <Note noteType="primary">
                    If you want to display different images based on user's screen size, add them into the
                    "Breakpoint images" section.
                </Note>
                <Tabs>
                    <Tab id="first" selected={this.state.activeTab === 'first'} onSelect={this.switchTab}>Default
                        image</Tab>
                    <Tab id="second" selected={this.state.activeTab === 'second'} onSelect={this.switchTab}>Breakpoint
                        images</Tab>
                </Tabs>

                {
                    this.state.activeTab === 'first' && (
                        <TabPanel id="first">
                            <Image url={this.appStore.defaultImage.url}
                                   cloud_name={cloud_name}
                                   preset={preset}
                                   onUpload={this.appStore.defaultImage.onUpload}
                                   loading={this.state.loader}/>
                        </TabPanel>
                    )
                }
                {
                    this.state.activeTab === 'second' && (
                        <TabPanel id="second">
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Minimal width</TableCell>
                                        <TableCell>Image</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        this.appStore.breakpointImages.map(({ id, breakpoint, url, onBreakpointChange, onUpload }, i) => (
                                            <TableRow key={id}>
                                                <TableCell style={{ display: 'flex', alignItems: 'center' }}>
                                                    <TextInput value={breakpoint.toString()}
                                                               type='number'
                                                               onChange={(e) => onBreakpointChange(e.target.value)}/>
                                                    <span style={{ marginLeft: 10 }}>px</span>
                                                </TableCell>
                                                <TableCell>
                                                    <Image url={url}
                                                           onUpload={onUpload}
                                                           cloud_name={cloud_name}
                                                           preset={preset}
                                                           loading={this.state.loader}/>
                                                    <Button buttonType='negative'
                                                            isFullWidth
                                                            onClick={() => this.appStore.removeBreakpoint(id)}>
                                                        Remove
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    }
                                </TableBody>
                            </Table>
                            <Button buttonType='primary'
                                    isFullWidth
                                    onClick={this.appStore.addBreakpoint}>
                                Add breakpoint
                            </Button>
                        </TabPanel>
                    )
                }
            </>
        )
    }
}

init(sdk => {
    ReactDOM.render(<App sdk={sdk}/>, document.getElementById('root'))
})

/**
 * By default, iframe of the this.props.sdk is fully reloaded on every save of a source file.
 * If you want to use HMR (hot module reload) instead of full reload, uncomment the following lines
 */
// if (module.hot) {
//   module.hot.accept();
// }
