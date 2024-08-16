import React, {useContext} from "react";
import JobProcessingContext from "@/commons/components/contexts/JobProcessingContext";

export default function OtherSettings() {
    const { processingJobId, setProcessingJobId } = useContext(JobProcessingContext);

    function resetJobId() {
        setProcessingJobId(null);
    }

    return (
        <div className="w-full max-w-md mx-auto mt-6 bg-white shadow-md rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Other Settings</h3>
                <div className="mt-5 space-y-4">
                    <p className="text-sm text-gray-600">
                        Current Job ID: {processingJobId || 'None'}
                    </p>
                    <button
                        onClick={resetJobId}
                        className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500 transition duration-150 ease-in-out"
                    >
                        Reset Job ID
                    </button>
                </div>
            </div>
        </div>
    );
}