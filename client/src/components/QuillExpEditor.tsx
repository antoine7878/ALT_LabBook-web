import React, { useState } from 'react'

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const modules = {
	toolbar: [
		[{ 'header': [1, 2, false] }],
		['bold', 'italic', 'underline', 'strike', 'blockquote'],
		[{ 'script': 'sub' }, { 'script': 'super' }],
		[{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
		['link', 'image'],
	],
}

const QuillExpEditor: React.FC<{}> = () => {

	const [value, setValue] = useState('');

	return (
		<ReactQuill
			theme="snow"
			value={value}
			onChange={setValue}
			modules={modules}
		/>
	)
}

export default QuillExpEditor