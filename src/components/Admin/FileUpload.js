import React, { useState } from 'react'
import Progress from './Progress'
import axios from 'axios'
import { Modal, Upload } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

function getBase64 (file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => {
      reject(error)
    }
  })
}

export const UploadPic = ({ item }) => {
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [previewTitle, setPreviewTitle] = useState('')
  const [fileList, setFileList] = useState([])
  const [isUploaded, setIsUploaded] = useState(false)

  const handleCancel = () => setPreviewVisible(false)

  const handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }

    setPreviewImage(file.url || file.preview)
    setPreviewVisible(true)
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1))
  }

  const handleUpload = async (file) => {
    try {
      const formData = new FormData()
      const newName = `${item.shortId}___${item.type}.${file.name.split('.').pop()}`
      formData.append('file', file, newName)
      const res = await axios.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      if (res.status === 200) {
        setIsUploaded(true)
        item.type === 'avatar' ? item.setAvatarImg(`avatar.${file.name.split('.').pop()}`) :
          item.type === 'hover' ? item.setHoverImg(`hover.${file.name.split('.').pop()}`) : console.log('see file upload js')
      }
    } catch (e) {
      console.log(e)
    }
  }

  const handleChange = ({ fileList }) => setFileList(fileList)

  const uploadButton = !isUploaded ? (
    <div>
      <PlusOutlined/>
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  ) : null

  return (
    <>
      <Upload
        accept="image/*"
        action={handleUpload}
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
      >
        {fileList.length >= 8 ? null : uploadButton}
      </Upload>
      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img alt="example" style={{ width: '100%' }} src={previewImage}/>
      </Modal>
    </>
  )
}

export const FileUpload = ({ type, id, setImgs }) => {
  const [file, setFile] = useState('')
  const [uploadPercentage, setUploadPercentage] = useState(0)
  const onChange = e => {
    setFile(e.target.files[0])
  }

  const onSubmit = async e => {
    e.preventDefault()
    const formData = new FormData()
    const newName = id + '___' + type + '.' + file.name.split('.').pop()
    formData.append('file', file, newName)

    if (type === 'avatar') {
      setImgs[0](newName.split('___')[1])
    } else if (type === 'hover') {
      setImgs[1](newName.split('___')[1])
    }

    try {
      const res = await axios.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: progressEvent => {
          setUploadPercentage(parseInt(Math.round((progressEvent.loaded * 100) / progressEvent.total), 0))
        }
      })

      if (res.status === 200) {
        alert('File Uploaded')
      }
    } catch (err) {
      if (err.response.status === 500) {
        alert('There was a problem with the server')
      } else {
        console.log(err.response.data.msg)
      }
      setUploadPercentage(0)
    }
  }

  return (
    <form onSubmit={onSubmit} className="uploadForm">
      <div className="custom-file mb-4">
        <input
          type="file"
          className="custom-file-input"
          onChange={onChange}
        />
      </div>

      <Progress percentage={uploadPercentage}/>
      {file &&
        <input
          type="submit"
          value="Upload"
          className="btn-primary btn-block mt-4"
        />
      }
    </form>
  )
}

export const FileUploadSlides = ({ type }) => {
  const [file, setFile] = useState('')
  const [uploadPercentage, setUploadPercentage] = useState(0)
  const onChange = e => {
    setFile(e.target.files[0])
  }

  const onSubmit = async e => {
    e.preventDefault()
    const formData = new FormData()
    const newName = type + '.webp'
    formData.append('file', file, newName)

    try {
      const res = await axios.post('/uploadSlide', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: progressEvent => {
          setUploadPercentage(parseInt(Math.round((progressEvent.loaded * 100) / progressEvent.total), 0))
        }
      })

      if (res.status === 200) {
        alert('File Uploaded')
      }
    } catch (err) {
      if (err.response.status === 500) {
        alert(err.message)
      } else {
        console.log(err.response.data.msg)
      }
      setUploadPercentage(0)
    }
  }

  return (
    <form onSubmit={onSubmit} className="uploadForm">
      <div className="custom-file mb-4">
        <input
          type="file"
          className="custom-file-input"
          onChange={onChange}
        />
      </div>

      <Progress percentage={uploadPercentage}/>
      {file &&
        <input
          type="submit"
          value="Upload"
          className="btn-primary btn-block mt-4"
        />
      }
    </form>
  )
}


