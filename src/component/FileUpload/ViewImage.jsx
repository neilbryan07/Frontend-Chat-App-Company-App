import React from 'react';

export function ViewImage(modalImage, setModalImage) {
    return <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-4 rounded-lg shadow-lg max-w-xl">
            <img src={modalImage} alt="Preview" className="w-full h-auto rounded" />
            <a
                href={modalImage} // URL of the image
                download="downloaded-image.jpg" // Default filename for download
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 block text-center"
            >
                Download Fike
            </a>
            <button
                onClick={() => setModalImage(null)}
                className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700 w-full"
            >
                Close
            </button>
        </div>
    </div>;
}
