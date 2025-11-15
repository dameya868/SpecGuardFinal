
import React from 'react';
import type { Report } from '../types';
import { InformationCircleIcon, ExclamationCircleIcon, TagIcon } from './Icons';

interface ReportDisplayProps {
  report: Report | null;
  isLoading: boolean;
}

const ReportSkeleton: React.FC = () => (
    <div className="animate-pulse space-y-8">
        <div>
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded-md w-1/2 mb-4"></div>
            <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-5/6"></div>
            </div>
        </div>
        <div className="space-y-6">
            <div className="h-7 bg-gray-300 dark:bg-gray-700 rounded-md w-1/3 mb-4"></div>
            {[...Array(2)].map((_, i) => (
                <div key={i} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg space-y-3">
                    <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-600 rounded w-2/3"></div>
                </div>
            ))}
        </div>
    </div>
);

const ReportDisplay: React.FC<ReportDisplayProps> = ({ report, isLoading }) => {
  if (isLoading) {
    return <ReportSkeleton />;
  }

  if (!report) {
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Part Description Section */}
      <section>
        <div className="flex items-center mb-4">
            <InformationCircleIcon className="w-8 h-8 text-blue-500 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{report.partDescription.title}</h2>
        </div>
        <div className="bg-gray-100 dark:bg-gray-900/50 p-4 rounded-lg space-y-2 border border-gray-200 dark:border-gray-700">
            {report.partDescription.details.map((detail, index) => (
                <p key={index} className="text-gray-700 dark:text-gray-300">{detail}</p>
            ))}
        </div>
      </section>

      {/* Faults Section */}
      <section>
         <div className="flex items-center mb-4">
            <ExclamationCircleIcon className="w-8 h-8 text-red-500 mr-3" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Potential Faults Detected</h2>
        </div>
        <div className="space-y-4">
          {report.faults.map((fault, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden">
              <div className="p-5">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{fault.faultDescription}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-base mb-4">{fault.analysis}</p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-700/50 px-5 py-3 border-t border-gray-200 dark:border-gray-700">
                 <div className="flex items-center text-sm text-gray-700 dark:text-gray-300 font-medium">
                    <TagIcon className="w-5 h-5 mr-2 text-purple-500" />
                    <span className="font-semibold mr-2">Violated Rule:</span>
                    <span>{fault.violatedRule}</span>
                 </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ReportDisplay;
