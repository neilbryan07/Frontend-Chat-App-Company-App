import { Close, CloudUploadOutlined, LinkOutlined } from '@mui/icons-material';
import { IconButton, Tooltip } from '@mui/material';
import React, { useRef, useState } from 'react';
import { BsImageFill } from 'react-icons/bs';
import { PiFilePdf } from 'react-icons/pi';

export function FilesDetails({ otherFiles, editView, setOtherFiles, setRemovedFileIds }) {

    const handleRemoveFile = (index) => {
        setOtherFiles((prevFiles) => {
            const removedFile = prevFiles[index];
            if (removedFile && removedFile.id) {
                setRemovedFileIds((prevIds) => [...prevIds, removedFile.id]);
            }
            return prevFiles.filter((_, i) => i !== index);
        });
    };

    return (
        <div className='flex flex-col-reverse items-start '>

            <div className={`${otherFiles.length > 1 ? 'grid grid-cols-2' : ''}  rounded w-full gap-1`}>
                {otherFiles.map((file, index) => (
                    <div key={index} className="flex items-center bg-gray-100 rounded-lg p-2 shadow-md mt-1 w-full max-w-sm relative">
                        <div className="w-8 h-8 flex items-center justify-center bg-gray-300 rounded-md">
                            {file.file_type === "application/pdf" ? <PiFilePdf /> : <BsImageFill />}
                        </div>
                        <a
                            href={file.file_path}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-2 text-sm font-medium text-gray-900 truncate max-w-[200px]"
                            title={file.file_name}
                        >
                            {file.file_name.length > 25 ? file.file_name.substring(0, 25) + "..." : file.file_name}
                        </a>

                        {editView ? (
                            <button className="ml-auto p-2" onClick={() => handleRemoveFile(index)} title="Remove File">
                                <Close />
                            </button>
                        ) : (
                            <a
                                href={file.file_path}
                                download={file.file_name || 'downloaded_file'}
                                className="ml-auto text-gray-500 hover:text-gray-700"
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Copy Link"
                            >
                                <LinkOutlined />
                            </a>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
