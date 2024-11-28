import React, { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";

const Roadmap = ({ data } : any) => {
  const [roadmapData, setRoadmapData] = useState<string[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (data) {
      handleGenerateRoadmap();
    }
  }, [data]); // React to data changes

  const handleGenerateRoadmap = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generate-roadmap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      
      console.log("Raw API Response:", responseData);
      
      if (responseData?.roadmap) {
        setRoadmapData(responseData.roadmap);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      setError(`Failed to generate roadmap: ${err instanceof Error ? err.message : 'Unknown error'}`);
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const getColorByIndex = (index: number): string => {
    const colors = [
      "bg-[#FF4086]",
      "bg-[#FF5E86]",
      "bg-[#FF7C86]",
      "bg-[#FF9A86]",
      "bg-[#FFB886]",
      "bg-[#FFCB86]"
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="w-full p-4">
      {error && (
        <div className="text-red-500 mb-4 p-4 bg-red-50 rounded-lg">
          {error}
        </div>
      )}

      <div className="relative">
        {roadmapData && roadmapData.length > 0 ? (
          <div className="flex flex-nowrap items-center gap-4 overflow-x-auto pb-6 pt-2 px-2">
            {roadmapData.map((item, index) => (
              <div key={index} className="flex items-center flex-shrink-0">
                <div
                  className={`
                    ${getColorByIndex(index)}
                    p-4 rounded-lg w-48
                    flex flex-col justify-between
                    transition-all hover:scale-105 
                    shadow-md min-h-32
                  `}
                >
                  <div className="font-semibold text-gray-800">
                    <b>{item}</b>
                  </div>
                </div>

                {index < roadmapData.length - 1 && (
                  <div className="flex items-center px-2">
                    <ArrowRight className="text-gray-400 w-6 h-6" />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          !isLoading && !error && (
            <div className="text-center text-gray-500 py-12">
              No roadmap data available
            </div>
          )
        )}

        {isLoading && (
          <div className="text-center text-gray-500 py-12">
            <div className="animate-pulse">
              Generating your learning roadmap...
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Roadmap;