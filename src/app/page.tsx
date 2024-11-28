"use client";
import { useState } from "react";
import IconEdulga from "@/assets/IconEdulga";
import Header from "@/components/Header";
import KnowledgeGraph from "@/components/KnowledgeGraph";
import Image from "next/image";
import graphTemp from "@/assets/graph.png";
import AiAvatar from "@/components/AiAvatar";
import SimliOpenAI from "@/components/SimliOpenAI";
import NestedKnowledgeGraph from "@/components/KnowledgeGraph";
import Roadmap from "@/components/Roadmap";

// Define types for our data structures
interface Topic {
  title: string;
  topics?: Topic[];
}

interface APITopic {
  topic: string;
  definition: {
    topics?: Array<APITopic>;
  };
}

interface GraphData {
  subject: string;
  topics: Topic[];
}

export default function Home() {
  const initialBrainGraphData = {
    subject: "The Brain",
    topics: [
      {
        title: "Mathematics",
        topics: [
          { title: "Algebra" },
          { title: "Calculus" },
          { title: "Geometry" },
          { title: "Number Theory" },
          { title: "Discrete Mathematics" },
        ],
      },
      {
        title: "Computer Science",
        topics: [
          { title: "Algorithms" },
          { title: "Data Structures" },
          { title: "Artificial Intelligence" },
          { title: "Machine Learning" },
          { title: "Software Engineering" },
        ],
      },
      {
        title: "Physics",
        topics: [
          { title: "Classical Mechanics" },
          { title: "Quantum Mechanics" },
          { title: "Nuclear Physics" },
          { title: "Particle Physics" },
          { title: "Optics" },
        ],
      },
      {
        title: "Biology",
        topics: [
          { title: "Cell Biology" },
          { title: "Genetics" },
          { title: "Microbiology" },
          { title: "Zoology" },
        ],
      },
      {
        title: "Chemistry",
        topics: [
          { title: "Organic Chemistry" },
          { title: "Inorganic Chemistry" },
          { title: "Theoretical Chemistry" },
          { title: "Environmental Chemistry" },
          { title: "Industrial Chemistry" },
        ],
      },
      {
        title: "Business",
        topics: [
          { title: "Marketing" },
          { title: "Finance" },
          { title: "Management" },
          { title: "Entrepreneurship" },
          { title: "Human Resources" },
          { title: "Supply Chain Management" },
        ],
      },
      {
        title: "Psychology",
        topics: [
          { title: "Cognitive Psychology" },
          { title: "Developmental Psychology" },
          { title: "Social Psychology" },
          { title: "Clinical Psychology" },
          { title: "Neuroscience" },
        ],
      },
      {
        title: "Literature",
        topics: [
          { title: "Poetry" },
          { title: "Fiction" },
          { title: "Non-fiction" },
          { title: "Drama" },
          { title: "Narrative" },
        ],
      },
      {
        title: "Economics",
        topics: [{ title: "Microeconomics" }, { title: "Macroeconomics" }],
      },
      {
        title: "Art",
        topics: [{ title: "Visual Arts" }, { title: "Photography" }],
      },
    ],
  };
  const [brainGraphData, setBrainGraphData] = useState(initialBrainGraphData);
  const [graphData, setGraphData] = useState(initialBrainGraphData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [simliPrompt, setSimliPrompt] = useState(
    "You are an excited Cyborg a mentor and you guide students about the subjects and topics they are interested in."
  );
  const [roadmapData, setRoadmapData] = useState<any>(null);
  const [startSimli, setStartSimli] = useState(false);

  const updateSimliPrompt = (apiResponse: any) => {
    const newTopicsInfo = apiResponse.topics
      .map((topic: any) => `${topic.topic}: ${topic.definition?.description || ""}`)
      .join(". ");

    const updatedPrompt = `${simliPrompt} Based on the uploaded content, here's what we're discussing: Subject - ${apiResponse.subject}. Topics covered: ${newTopicsInfo}. Please incorporate this information in your guidance.`;

    return updatedPrompt;
  };

  const createRoadmapData = (apiResponse: any) => {
    return {
      subject: apiResponse.subject,
      topics: apiResponse.topics.map((topic: any) => ({
        title: topic.topic,
        description: topic.definition?.description || "",
        subtopics: topic.definition?.topics || [],
      })),
    };
  };

  const convertAPITopicsToGraphFormat = (apiTopics: APITopic[]) => {
    return apiTopics.map((topic) => ({
      title: topic.topic,
      topics: [], // If you need to handle nested topics, you can process topic.definition.topics here
    }));
  };

  const mergeWithExistingTopic = (existingTopics: any, apiResponse: any) => {
    const updatedTopics = [...existingTopics];

    // Find if the subject exists in current topics
    const existingTopicIndex = updatedTopics.findIndex(
      (topic) => topic.title.toLowerCase() === apiResponse.subject.toLowerCase()
    );

    if (existingTopicIndex !== -1) {
      // Convert API topics to the correct format
      const newTopics = convertAPITopicsToGraphFormat(apiResponse.topics);

      // Get existing topics
      const existingSubTopics = updatedTopics[existingTopicIndex].topics || [];

      // Merge topics, avoiding duplicates
      const mergedTopics = [...existingSubTopics];
      newTopics.forEach((newTopic) => {
        if (
          !mergedTopics.some(
            (existing) =>
              existing.title.toLowerCase() === newTopic.title.toLowerCase()
          )
        ) {
          mergedTopics.push(newTopic);
        }
      });

      // Update the existing topic with merged topics
      updatedTopics[existingTopicIndex] = {
        ...updatedTopics[existingTopicIndex],
        topics: mergedTopics,
      };
    } else {
      // If subject doesn't exist, create a new topic for it
      const newTopic = {
        title: apiResponse.subject,
        topics: convertAPITopicsToGraphFormat(apiResponse.topics),
      };
      updatedTopics.push(newTopic);
    }

    return updatedTopics;
  };

  const handleFileUpload = async (event: any) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    setIsLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/generate-knowledge-graph", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const apiResponse = await response.json();
      console.log("API Response:", apiResponse);

      // Update brain graph data
      const updatedBrainGraphData = {
        ...brainGraphData,
        topics: mergeWithExistingTopic(brainGraphData.topics, apiResponse),
      };
      setBrainGraphData(updatedBrainGraphData);
      setGraphData(updatedBrainGraphData);

      // Update Simli prompt
      const updatedPrompt = updateSimliPrompt(apiResponse);
      setSimliPrompt(updatedPrompt);
      setStartSimli(true);

      // Update Roadmap data
      const newRoadmapData = createRoadmapData(apiResponse);
      setRoadmapData(newRoadmapData);
    } catch (err) {
      setError("Failed to process PDF. Please try again.");
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="">
      <div className="flex items-center justify-between p-4 w-full">
          <IconEdulga className="h-[88px]" />
        <div className="flex flex-col items-center justify-center text-black gap-4">
          <label className="cursor-pointer">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
            <div className="rounded bg-white text-black py-2 px-4 hover:bg-opacity-70 shadow-lg">
              <b>Upload PDF File</b>
            </div>
          </label>
          {error && <p className="text-red-500 mt-2">{error}</p>}
          {isLoading && <p className="text-black mt-2">Processing PDF...</p>}
        </div>
      </div>
      {/* <div className="h-[108px]" /> */}
      <div className="p-8 pt-0 w-full">
        <div className="flex flex-col w-full justify-center items-center gap-8">
          {/* Top */}
          <div className="flex gap-8">
            {/* Knowledge Graph */}
            <div className="bg-white w-[800px] h-[500px] rounded-2xl shadow-lg p-0">
              <div className="bg-[#0B0532] w-full h-full rounded-2xl overflow-hidden">
                {graphData && (
                  <NestedKnowledgeGraph
                    data={graphData}
                    className="w-full h-full"
                  />
                )}
              </div>
            </div>
            {/* AI Avatar */}
            <div className="bg-white w-[500px] h-[500px] rounded-2xl shadow-lg overflow-hidden">
              {startSimli && (
                <SimliOpenAI
                  simli_faceid="101bef0d-b62d-4fbe-a6b4-89bc3fc66ec6"
                  openai_voice="shimmer"
                  initialPrompt={simliPrompt}
                  onStart={() => console.log("SimliOpenAI started")}
                  onClose={() => console.log("SimliOpenAI closed")}
                />
              )}
            </div>
          </div>
          {/* Bottom */}
          <div className="flex gap-8 items-center justify-center w-full">
            {/* Roadmap */}
            <div className="bg-white w-[1332px] h-[300px] rounded-2xl shadow-lg">
              <div className="bg-gray-300 w-[180px] h-[40px] rounded-tl-2xl rounded-br-2xl flex items-center justify-start p-4">
                <b>Learning Roadmap</b>
              </div>
              <Roadmap data={roadmapData} />
            </div>
            {/* Communities */}
            {/* <div className="bg-white w-[500px] rounded-2xl shadow-lg">
              <div className="bg-gray-300 w-full h-[64px] rounded-t-2xl flex items-center justify-start p-4">
                <b>Community</b>
              </div>
              <div className="p-4 flex gap-4 flex-wrap">
                <div className="bg-[#FFCB86] py-2 px-4 w-fit rounded flex flex-col cursor-pointer hover:bg-opacity-70">
                  <b>Intro to NLP</b>
                  <p className="text-xs">40 members</p>
                </div>
                <div className="bg-[#FFCB86] py-2 px-4 w-fit rounded flex flex-col cursor-pointer hover:bg-opacity-70">
                  <b>AI enthusiasts</b>
                  <p className="text-xs">+99 members</p>
                </div>
                <div className="bg-[#FF4086] py-2 px-4 w-fit rounded flex flex-col cursor-pointer hover:bg-opacity-70 text-white">
                  <b>Getting into the world of NLP</b>
                  <p className="text-xs">
                    Event - 20th Oct 2025 - 19:30 to 21:30
                  </p>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
