import React from 'react';
import {FileUploadSlides} from '../../components/Admin/FileUpload';

export const SetSlides = () => {
    return (
        <div className='setSlides'>
            <div className="input-field">
                <label htmlFor='hover'>1 slide</label>
                <FileUploadSlides type='slide1' />
            </div>
            <div className="input-field">
                <label htmlFor='hover'>2 slide</label>
                <FileUploadSlides type='slide2' />
            </div>
            <div className="input-field">
                <label htmlFor='hover'>3 slide</label>
                <FileUploadSlides type='slide3' />
            </div>
        </div>
    )
}

