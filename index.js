window.contentfulExtension.init(extension => {
    extension.window.startAutoResizer()
    const cloudName = extension.parameters.instance.cloud_name
    const unsignedUploadPreset = extension.parameters.instance.preset
    const imageIdFieldName = extension.parameters.instance.imageIdField
    const selectBtn = document.getElementById('selectBtn')
    const fileElem = document.getElementById('fileElem')

    fileElem.addEventListener('change', () => {
        handleFiles(fileElem.files)
    })

    selectBtn.addEventListener("click", (event) => {
        fileElem.click()
        event.preventDefault()
    })

    function handleFiles(files) {
        for (let i = 0; i < files.length; i++) {
            uploadFile(files[i])
        }
    }

    function uploadFile(file) {
        let uploadStatus = document.getElementById('upload-status'),
            url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
            xhr = new XMLHttpRequest(),
            fd = new FormData()
        xhr.open('POST', url, true)
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest')

        uploadStatus.innerHTML = ''
        uploadStatus.style.color = 'inherit'

        xhr.upload.addEventListener("progress", function (e) {
            let progress = Math.round((e.loaded * 100.0) / e.total)
            console.log(`fileuploadprogress data.loaded: ${e.loaded}, data.total: ${e.total}, progress: ${progress}`)
            uploadStatus.innerHTML = `${progress}%`
        })

        xhr.onreadystatechange = function (e) {
            if (xhr.readyState == 4 && xhr.status == 200 && extension.entry.fields[imageIdFieldName]) {
                let response = JSON.parse(xhr.responseText)
                const imageIdField = extension.entry.fields[imageIdFieldName]
                imageIdField.setValue(response.public_id)
                uploadStatus.style.color = 'green'
                uploadStatus.innerHTML = 'Upload Successful'
                fileElem.value = ''
            } else {
                uploadStatus.style.color = 'red'

                if (!extension.entry.fields[imageIdFieldName]) {
                    uploadStatus.innerHTML = 'You must have a field "' + imageIdFieldName + '" in your content model to save the uploaded Cloudinary image ID'
                } else {
                    uploadStatus.innerHTML = 'Upload Failed'
                }
            }
        }

        fd.append('upload_preset', unsignedUploadPreset)
        fd.append('tags', 'browser_upload')
        fd.append('file', file)
        xhr.send(fd)
    }
})
