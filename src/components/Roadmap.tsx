import React, { useState } from "react";
import { ArrowRight } from "lucide-react";

// Define interfaces for the data structure
interface RoadmapItem {
  entity1: string;
  relationship: string;
  priority: 1 | 2 | 3 | 4 | 5 | 6;
}

interface RoadmapResponse {
  roadmap: {
    learning_roadmap: RoadmapItem[];
  };
}

const Roadmap = () => {
  const [query, setQuery] = useState("");
  const [roadmapData, setRoadmapData] = useState<RoadmapItem[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateRoadmap = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generate-roadmap", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: RoadmapResponse = await response.json();
      
      // Add console.log to debug the response
      console.log("Raw API Response:", data);
      
      // Check if the data has the expected structure
      if (data?.roadmap?.learning_roadmap) {
        setRoadmapData(data.roadmap.learning_roadmap);
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

  const getColorByPriority = (priority: RoadmapItem["priority"]): string => {
    const colors: Record<RoadmapItem["priority"], string> = {
      1: "bg-[#FF4086]",
      2: "bg-[#FF5E86]",
      3: "bg-[#FF7C86]",
      4: "bg-[#FF9A86]",
      5: "bg-[#FFB886]",
      6: "bg-[#FFCB86]",
    };
    return colors[priority] || "bg-[#FF4086]";
  };

  return (
    <div className="w-full p-4">
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter a subject (e.g., 'computer science')"
          className="flex-1 p-2 border rounded-lg"
        />
        <button
          onClick={handleGenerateRoadmap}
          disabled={isLoading}
          className="bg-[#FF4086] text-white px-4 py-2 rounded-lg hover:bg-[#FF5E86] disabled:bg-gray-400 transition-colors"
        >
          <b>{isLoading ? "Generating..." : "Generate Roadmap"}</b>
        </button>
      </div>

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
                    ${getColorByPriority(item.priority)}
                    p-4 rounded-lg w-48
                    flex flex-col justify-between
                    transition-all hover:scale-105 
                    shadow-md min-h-32
                  `}
                >
                  <div className="font-semibold text-gray-800">
                    <b>{item.entity1}</b>
                  </div>
                  <div className="text-sm text-gray-600 mt-2">
                    <b>{item.relationship}</b>
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
              Enter a subject and click generate to see the learning roadmap
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