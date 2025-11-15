
import React, { useState, useRef } from 'react';
import { CheckCircleIcon, DocumentArrowUpIcon } from './Icons';

interface FileUploadProps {
  id: string;
  label: string;
  onFileChange: (file: File | null) => void;
  acceptedTypes: string;
  icon: React.ReactNode;
}

const FileUpload: React.FC<FileUploadProps> = ({ id, label, onFileChange, acceptedTypes, icon }) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setFileName(file ? file.name : null);
    onFileChange(file);
  };

  const handleAreaClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="flex flex-col items-center justify-center text-center p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700/50 transition-colors duration-300 ease-in-out hover:border-indigo-400 dark:hover:border-indigo-500 hover:bg-indigo-50 dark:hover:bg-gray-700/80">
      <input
        id={id}
        ref={inputRef}
        type="file"
        className="hidden"
        accept={acceptedTypes}
        onChange={handleFileChange}
      />
      <button onClick={handleAreaClick} className="w-full h-full flex flex-col items-center justify-center cursor-pointer">
        <div className="mb-2">
            {fileName ? <CheckCircleIcon className="w-8 h-8 text-green-500" /> : icon}
        </div>
        <h3 className="font-semibold text-gray-700 dark:text-gray-200">{label}</h3>
        {fileName ? (
          <p className="text-xs text-green-600 dark:text-green-400 mt-1 truncate max-w-full px-2" title={fileName}>{fileName}</p>
        ) : (
          <div className="flex items-center text-sm text-indigo-600 dark:text-indigo-400 mt-1 font-medium">
            <DocumentArrowUpIcon className="w-4 h-4 mr-1"/>
            <span>Choose file</span>
          </div>
        )}
      </button>
    </div>
  );
};

export default FileUpload;
