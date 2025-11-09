'use client';

import { FileUploadButton } from './FileUploadButton';

interface ExtractionInputProps {
    value: string;
    onChange: (value: string) => void;
    onFileSelect: (file: File | null) => void;
    selectedFile: File | null;
    placeholder?: string;
    disabled?: boolean;
    canSubmit?: boolean;
}

export function ExtractionInput({
    value,
    onChange,
    onFileSelect,
    selectedFile,
    placeholder = 'Nom, URL GitHub/LinkedIn, ou collez votre texte... (GitHub: torvalds/ ou github.com/torvalds)',
    disabled = false,
    canSubmit = false,
}: ExtractionInputProps) {
    return (
        <div className="relative w-full max-w-3xl mx-auto">
            <div className="flex items-center gap-2 bg-white border border-gray-300 rounded-3xl shadow-sm hover:shadow-md transition-shadow px-4 py-3">
                <FileUploadButton
                    onFileSelect={onFileSelect}
                    selectedFile={selectedFile}
                />

                <div className="flex-1 flex items-center">
                    <input
                        type="text"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={placeholder}
                        disabled={disabled}
                        className="w-full bg-transparent outline-none text-gray-800 placeholder-gray-400 disabled:opacity-50"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <MicrophoneButton disabled={disabled} />
                    <SubmitButton disabled={disabled || !canSubmit} />
                </div>
            </div>
        </div>
    );
}

function MicrophoneButton({ disabled }: { disabled: boolean }) {
    return (
        <button
            type="button"
            disabled={disabled}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Voice input"
        >
            <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-gray-600"
            >
                <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                <line x1="12" y1="19" x2="12" y2="23" />
                <line x1="8" y1="23" x2="16" y2="23" />
            </svg>
        </button>
    );
}

function SubmitButton({ disabled }: { disabled: boolean }) {
    return (
        <button
            type="submit"
            disabled={disabled}
            className="p-2 rounded-lg bg-gray-800 text-white hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Submit"
        >
            <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
            >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
        </button>
    );
}
