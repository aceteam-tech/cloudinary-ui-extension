import { Button, TabPanel } from '@contentful/forma-36-react-components'
import React from 'react'
import PropTypes from 'prop-types'

const Upload = ({loading, handleFile}) => (
    <>
        {
            !loading ?
                <input id="fileElem" type="file"
                       onChange={handleFile}
                       accept="video/*, image/*, application/pdf"/> :
                <Button buttonType='primary' disabled>
                    <span style={{ marginLeft: 10 }}>
                        Uploading...
                    </span>
                </Button>
        }
    </>
)

Upload.propTypes = {
    loading: PropTypes.bool,
    handleFile: PropTypes.func.isRequired
}

export default Upload