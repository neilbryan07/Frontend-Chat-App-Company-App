import React, { useState, useRef, useEffect, useCallback, lazy, Suspense } from 'react';

import Tooltip from '@mui/material/Tooltip';
import { Close, Download, DownloadRounded } from '@mui/icons-material';
import { GrFormNext, GrFormPrevious } from 'react-icons/gr';


export default function ViewModelImage({ modalImage, setModalImage, imageFiles }) {
    const currentIndex = imageFiles.findIndex(file => file.download_url === modalImage);


    const [zoom, setZoom] = useState(1);

    const handleZoomChange = (e) => {
        setZoom(parseFloat(e.target.value));
    };

    const resetZoom = () => {
        setZoom(1);
    };

    const handleNext = () => {
        if (currentIndex < imageFiles.length - 1) {
            setModalImage(imageFiles[currentIndex + 1].download_url);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setModalImage(imageFiles[currentIndex - 1].download_url);
        }
    };



    return <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-start z-50 p-2 w-full h-full">
        <div className="px-4 pb-6 rounded-lg shadow-lg w-full relative flex flex-col items-center">
            {/* Top Controls (Download & Close) */}
            <div className="flex flex-row w-full p-2 gap-2 justify-end">
                <Tooltip title="Download Image">
                    <a
                        href={modalImage}
                        download="downloaded-image.jpg"
                        className="p-2 text-white rounded-lg hover:bg-gray-600 transition w-fit"
                    >
                        <DownloadRounded />
                    </a>
                </Tooltip>

                <Tooltip title="Close">
                    <button
                        onClick={() => setModalImage(null)}
                        className="p-2 text-white rounded-lg hover:bg-gray-600 transition w-fit"
                    >
                        <Close />
                    </button>
                </Tooltip>
            </div>

            {/* Image Container */}
            <div className="flex  w-full mt-4 px-4 justify-center justify-items-center">
                {currentIndex === 0 ? null : <button
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    className={`p-2 px-4 text-white rounded-lg text-2xl transition`}
                >
                    <GrFormPrevious />
                </button>}

                <div
                    className="overflow-hidden flex justify-center w-full cursor-grab active:cursor-grabbing"
                    onDoubleClick={resetZoom}
                >
                    <img
                        src={modalImage}
                        alt="Preview"
                        className="w-auto h-auto max-h-[75vh] rounded transition-transform duration-200"
                        style={{ transform: `scale(${zoom})` }}
                    />
                </div>

                {currentIndex === imageFiles.length - 1 ? null : <button
                    onClick={handleNext}
                    disabled={currentIndex === imageFiles.length - 1}
                    className={`p-2 px-4 text-white rounded-lg text-2xl transition`}
                >
                    <GrFormNext />
                </button>}
            </div>

            {/* Zoom Slider */}
            <div className="flex flex-col items-center mt-4 w-full px-4">
                <label className="text-gray-700 font-medium">Zoom</label>
                <input
                    type="range"
                    min="1"
                    max="3"
                    step="0.1"
                    value={zoom}
                    onChange={handleZoomChange}
                    className="w-full mt-2 appearance-none h-2 bg-gray-300 rounded-lg outline-none"
                />
                <p className="text-gray-600 text-sm mt-1">Zoom: {zoom.toFixed(1)}x</p>
            </div>

            {/* Navigation Controls */}

        </div>
    </div>;
}