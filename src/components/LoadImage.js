import React from 'react';
const LoadImage = props => <div className='input'>

<input type='file' id ='input__file' onChange={event => {
    event.preventDefault();
    let files = event.target.files;
        let fr = new FileReader();
        fr.onloadend = () => {
            props.addNewImg( fr.result);
        }
       fr.readAsDataURL(files[0]);
}}/> 
</div>;
export default LoadImage;
