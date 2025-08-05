
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { formatSize } from '~/lib/utils';

interface FileUploaderProps {
    onFileSelect: (file: File | null) => void;
}

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {

    const onDrop = useCallback((acceptedFiles: File[]) => {

        const file = acceptedFiles[0] || null;
        onFileSelect?.(file);
    }, [onFileSelect])

    const maxFileSize = 20 * 1024 * 1024;

    const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
        onDrop,
        multiple: false,
        accept: {
            'application/pdf': [".pdf"],

        },
        maxSize: maxFileSize
    })
    const file = acceptedFiles[0] || null;
    return (
        <div className='w-full  gradient-border'>
            <div {...getRootProps()}>
                <input {...getInputProps()} />
                <div className='space-y-4 cursor-pointer'>
                    <div className='flex mx-auto w-16 h-16 items-center justify-center'>
                        <img src="/icons/info.svg" alt="upload" className='size-20' />
                    </div>
                    {
                        file ? (
                            <div className='uploader-selected-file' onClick={(e) => e.stopPropagation()}>
                                <img src="/images/pdf.png" alt="" className='size-10' />
                                <div className='flex items-center space-x-3'>

                                    <div>

                                        <p className='text-center text-sm max-w-xs text-gray-700 truncate '>{file.name}</p>
                                        <p className='text-'>{formatSize(file.size)}</p>

                                    </div>
                                </div>
                                <button className='p-2 cursor-pointer' onClick={(e) => {
                                    onFileSelect?.(null)
                                }}>
                                    <img src="/icons/cross.svg" alt="delete-button" className='h-4 w-4' />
                                </button>
                            </div>

                        ) :
                            (
                                <div>
                                    <p className='text-lg text-gray-500'>
                                        <span className='font-semibold'>
                                            Click to upload
                                        </span> or drag and drop
                                        <span className='text-gray-500'>
                                            PDF (max 10MB {formatSize(maxFileSize)})
                                        </span>
                                    </p>
                                </div>
                            )
                    }
                </div>
            </div>
        </div >
    )
}

export default FileUploader
