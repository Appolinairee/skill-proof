'use client';

import { useRef, ChangeEvent } from 'react';

interface FileUploadButtonProps {
    onFileSelect: (file: File | null) => void;
    selectedFile: File | null;
    accept?: string;
}

export function FileUploadButton({
    onFileSelect,
    selectedFile,
    accept = '.pdf,.doc,.docx,.txt'
}: FileUploadButtonProps) {
    const inputRef = useRef<HTMLInputElement>(null);

    const handleClick = () => {
        inputRef.current?.click();
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        onFileSelect(file);
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onFileSelect(null);
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    return (
        <div className="relative">
            <input
                ref={inputRef}
                type="file"
                accept={accept}
                onChange={handleChange}
                className="hidden"
                aria-label="Upload CV"
            />

            {selectedFile ? (
                <div className="flex items-center gap-2 p-2 rounded-lg bg-gray-50">
                    <FileIcon />
                    <span className="text-sm text-gray-700 max-w-[120px] truncate">
                        {selectedFile.name}
                    </span>
                    <button
                        type="button"
                        onClick={handleClear}
                        className="ml-1 text-gray-400 hover:text-gray-600 p-1"
                        aria-label="Remove file"
                    >
                        <XIcon />
                    </button>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={handleClick}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    aria-label="Upload file"
                >
                    <PaperclipIcon />
                    <span className="sr-only">Upload file</span>
                </button>
            )}
        </div>
    );
}

function PaperclipIcon() {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-gray-600"
        >
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
        </svg>
    );
}

function FileIcon() {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-gray-600"
        >
            <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
            <polyline points="13 2 13 9 20 9" />
        </svg>
    );
}

function XIcon() {
    return (
        <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
    );
}
