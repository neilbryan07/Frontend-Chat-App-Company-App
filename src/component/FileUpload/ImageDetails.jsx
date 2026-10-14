import React from 'react';

export function ImageDetails(imageFiles, setModalImage) {
    return <div className="grid mt-2 p-2 bg-white rounded">
        <div className="flex gap-2 flex-wrap">
            {imageFiles.map((file, index) => (
                <img
                    key={index}
                    src={file.file_path}
                    alt={file.file_name}
                    className="w-30 h-20 object-cover rounded-lg cursor-pointer shadow-md"
                    onClick={() => setModalImage(file.file_path)} />
            ))}
        </div>
    </div>;
}
