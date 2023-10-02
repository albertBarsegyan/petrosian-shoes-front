import React, { useState } from 'react';
import axios from 'axios';

const FilesUpload = (props) => {
  const [files, setFile] = useState('');
  const onChange = e => {
    setFile(e.target.files);
  };

  const onSubmit = async e => {
    e.preventDefault();
    let status = 0;
    const arr = [];
    for (let i = 0; i < files.length; ++i) {
      const formData = new FormData();
      const newName = props.id + '___' + props.type + '_' + i + '.' + files[i].name.split('.').pop();

      formData.append('file', files[i], newName);

      try {
        const res = await axios.post('/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        status = res.status;
        if (status === 200) {
          arr.push(props.type + '_' + i + '.' + files[i].name.split('.').pop());
        }
      } catch (err) {
        if (err.response.status === 500) {
          alert('There was a problem with the server');
        } else {
          // console.log(err.response.data.msg);
        }
      }
    }

    if (status === 200) {
      alert('Files were uploaded');
    }
    props.setImgs(arr);
  };

  return (
    <form onSubmit={onSubmit} className='uploadForm'>
      <div className='custom-file mb-4'>
        <input
          type='file'
          className='custom-file-input'
          onChange={onChange}
          multiple
        />
      </div>

      {files &&
        <input
          type='submit'
          value='Upload'
          className='btn-primary btn-block mt-4'
        />
      }
    </form>
  );
};

export default FilesUpload;
