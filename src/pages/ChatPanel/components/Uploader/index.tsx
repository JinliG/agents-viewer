import * as React from 'react';
import { Upload } from 'antd';
import { uploadFile } from '~/network/coze';
import { toast } from 'react-toastify';
import { FileInfo } from '~/types/coze';

const allowedFileTypes = [
	'.doc',
	'.docx',
	'.xls',
	'.xlsx',
	'.ppt',
	'.pptx',
	'.pdf',
	'.numbers',
	'.csv',
	'.jpg',
	'.jpg2',
	'.png',
	'.gif',
	'.webp',
	'.heic',
	'.heif',
	'.bmp',
	'.pcd',
	'.tiff',
];

interface UploaderProps {
	children: React.ReactNode;
	onUploadSuccess?: (info: FileInfo) => void;
}

const Uploader: React.FC<UploaderProps> = ({ children, onUploadSuccess }) => {
	const onBeforeUpload = (file: any) => {
		// 文件类型验证
		const isAllowedType = allowedFileTypes.includes(
			`.${file.type.split('/')[1].toLowerCase()}`
		);
		if (!isAllowedType) {
			toast(
				'文件类型不支持，请上传 DOC、DOCX、XLS、XLSX、PPT、PPTX、PDF、Numbers、CSV、JPG、JPG2、PNG、GIF、WEBP、HEIC、HEIF、BMP、PCD、TIFF 类型的文件'
			);
			return false;
		}

		// 文件大小验证
		const isLt512M = file.size / 1024 / 1024 < 512;
		if (!isLt512M) {
			alert('文件大小不能超过 512MB!');
			return false;
		}

		// 单次只能上传一个文件
		return true;
	};

	const handleChange = ({ file }: any) => {
		if (file.status === 'done') {
			console.log('File uploaded successfully:', file);
		} else if (file.status === 'error') {
			console.error('File upload failed:', file);
		}
	};

	const customRequest = (options: any) => {
		uploadFile(options.file)
			.then((response) => {
				if (response.data) {
					onUploadSuccess?.(response.data);
				}
			})
			.catch((error) => {
				console.error('File upload failed:', error);
			});
	};

	return (
		<Upload
			accept={allowedFileTypes.toString()}
			customRequest={customRequest}
			beforeUpload={onBeforeUpload}
			onChange={handleChange}
			showUploadList={false} // 隐藏上传列表
		>
			{children}
		</Upload>
	);
};

export default Uploader;
