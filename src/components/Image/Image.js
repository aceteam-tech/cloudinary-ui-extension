import { Button, TabPanel } from '@contentful/forma-36-react-components'
import React from 'react'
import PropTypes from 'prop-types'
import {observer} from 'mobx-react'

@observer
class Image extends React.Component {
    input

    handleFile = (e) => {
        const files = e.target.files
        console.log({ 'files': files })
        for (let i = 0; i < files.length; i++) {
            this.uploadFile(files[i])
        }
    }

    uploadFile = (file) => {
        const cloudName = this.props.cloud_name
        const unsignedUploadPreset = this.props.preset

        const formData = new FormData()
        formData.append('upload_preset', unsignedUploadPreset)
        formData.append('tags', 'browser_upload')
        formData.append('file', file)

        fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
            method: 'POST',
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                console.log({ 'data': data })
                this.props.onUpload({
                    publicId: data.public_id,
                    url: data.url
                })
            })
    }


    render() {
        return (
            <>
                {
                    this.props.url ?
                        <img id="preview-img"
                             src={this.props.url}
                             onClick={() => this.input.click()}
                             style={{
                                 height: 300,
                                 'maxWidth': '100%',
                                 'objectFit': 'contain',
                                 cursor: 'pointer'
                             }}/> :
                        <>
                            {
                                <>
                                    {
                                        !this.props.loading ?
                                            <Button buttonType='primary'
                                                    isFullWidth
                                                    onClick={() => this.input.click()}>Upload</Button> :
                                            <Button buttonType='primary' disabled>
                                            <span style={{ marginLeft: 10 }}>
                                                Uploading...
                                            </span>
                                            </Button>
                                    }
                                </>
                            }
                        </>
                }
                <input id="fileElem" type="file"
                       onChange={this.handleFile}
                       ref={input => this.input = input}
                       style={{ display: 'none' }}
                       accept="video/*, image/*, application/pdf"/>
            </>
        )
    }
}

Image.propTypes = {
    url: PropTypes.string,
    loading: PropTypes.bool,
    onUpload: PropTypes.func.isRequired
}

export default Image