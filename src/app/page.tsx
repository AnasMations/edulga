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

export default function Home() {
  const [graphData, setGraphData] = useState({
    title: "The Brain",
    topics: [
      {
        title: "Mathematics",
        topics: [
          { title: "Algebra" },
          { title: "Calculus" },
          { title: "Geometry" },
          { title: "Statistics" },
          { title: "Number Theory" },
          { title: "Topology" },
          { title: "Combinatorics" },
          { title: "Discrete Mathematics" },
          { title: "Mathematical Logic" },
          { title: "Applied Mathematics" },
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
          { title: "Web Development" },
          { title: "Cybersecurity" },
          { title: "Database Systems" },
          { title: "Human-Computer Interaction" },
          { title: "Computer Networks" },
        ],
      },
      {
        title: "Physics",
        topics: [
          { title: "Classical Mechanics" },
          { title: "Quantum Mechanics" },
          { title: "Thermodynamics" },
          { title: "Electromagnetism" },
          { title: "Relativity" },
          { title: "Astrophysics" },
          { title: "Nuclear Physics" },
          { title: "Particle Physics" },
          { title: "Condensed Matter Physics" },
          { title: "Optics" },
        ],
      },
      {
        title: "Biology",
        topics: [
          { title: "Cell Biology" },
          { title: "Genetics" },
          { title: "Evolutionary Biology" },
          { title: "Ecology" },
          { title: "Microbiology" },
          { title: "Molecular Biology" },
          { title: "Physiology" },
          { title: "Botany" },
          { title: "Zoology" },
          { title: "Biotechnology" },
        ],
      },
      {
        title: "Chemistry",
        topics: [
          { title: "Organic Chemistry" },
          { title: "Inorganic Chemistry" },
          { title: "Physical Chemistry" },
          { title: "Analytical Chemistry" },
          { title: "Biochemistry" },
          { title: "Theoretical Chemistry" },
          { title: "Materials Science" },
          { title: "Environmental Chemistry" },
          { title: "Industrial Chemistry" },
          { title: "Chemical Engineering" },
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
          { title: "Operations" },
          { title: "Supply Chain Management" },
          { title: "Business Strategy" },
          { title: "E-commerce" },
          { title: "Corporate Governance" },
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
          { title: "Behavioral Psychology" },
          { title: "Personality Psychology" },
          { title: "Industrial-Organizational Psychology" },
          { title: "Forensic Psychology" },
          { title: "Health Psychology" },
        ],
      },
      {
        title: "Literature",
        topics: [
          { title: "Poetry" },
          { title: "Fiction" },
          { title: "Non-fiction" },
          { title: "Drama" },
          { title: "Literary Theory" },
          { title: "Comparative Literature" },
          { title: "Narrative" },
          { title: "Postmodernism" },
          { title: "Symbolism" },
          { title: "Literary Criticism" },
        ],
      },
      {
        title: "Economics",
        topics: [
          { title: "Microeconomics" },
          { title: "Macroeconomics" },
          { title: "Behavioral Economics" },
          { title: "Development Economics" },
          { title: "International Economics" },
          { title: "Labor Economics" },
          { title: "Public Economics" },
          { title: "Environmental Economics" },
          { title: "Game Theory" },
          { title: "Econometrics" },
        ],
      },
      {
        title: "Ethics",
        topics: [
          { title: "Normative Ethics" },
          { title: "Meta-Ethics" },
          { title: "Applied Ethics" },
          { title: "Bioethics" },
          { title: "Environmental Ethics" },
          { title: "Business Ethics" },
          { title: "Virtue Ethics" },
          { title: "Deontological Ethics" },
          { title: "Consequentialism" },
          { title: "Social Ethics" },
        ],
      },
      {
        title: "Politics",
        topics: [
          { title: "Political Theory" },
          { title: "Comparative Politics" },
          { title: "International Relations" },
          { title: "Public Policy" },
          { title: "Political Economy" },
          { title: "Political Institutions" },
          { title: "Political Behavior" },
          { title: "Global Governance" },
          { title: "Political Ideologies" },
          { title: "Conflict Studies" },
        ],
      },
      {
        title: "Art",
        topics: [
          { title: "Visual Arts" },
          { title: "Performing Arts" },
          { title: "Literary Arts" },
          { title: "Art History" },
          { title: "Art Theory" },
          { title: "Contemporary Art" },
          { title: "Art Criticism" },
          { title: "Sculpture" },
          { title: "Photography" },
          { title: "Installation Art" },
        ],
      },
    ],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const handleFileUpload = async (event: any) => {
    const file = event.target.files[0];
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

      const data = await response.json();
      console.log("API Response:", data);
      setGraphData(data);
    } catch (err) {
      setError("Failed to process PDF. Please try again.");
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="">
      <Header />
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
                {!graphData && (
                  <div className="flex flex-col items-center justify-center h-full text-white gap-4">
                    <p className="text-lg mb-2">
                      Upload a PDF to generate the knowledge graph
                    </p>
                    <label className="cursor-pointer">
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <div className="rounded bg-white text-black py-2 px-4 hover:bg-opacity-70">
                        <b>Choose PDF File</b>
                      </div>
                    </label>
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                    {isLoading && (
                      <p className="text-white mt-2">Processing PDF...</p>
                    )}
                  </div>
                )}
              </div>
            </div>
            {/* AI Avatar */}
            <div className="bg-white w-[500px] h-[500px] rounded-2xl shadow-lg overflow-hidden">
              <SimliOpenAI
                simli_faceid="101bef0d-b62d-4fbe-a6b4-89bc3fc66ec6"
                openai_voice="shimmer"
                initialPrompt="You are a professional but exciting Cyborg a mentor and you guide students who are lost in their path to the right direction. You start by asking the students about what they want to study? and what are their interests? and about their study style? Then you give professional advice and guidance to the students."
                onStart={() => console.log("SimliOpenAI started")}
                onClose={() => console.log("SimliOpenAI closed")}
              />
            </div>
          </div>
          {/* Bottom */}
          <div className="flex gap-8 items-center justify-center w-full">
            {/* Roadmap */}
            <div className="bg-white w-[1332px] h-[300px] rounded-2xl shadow-lg">
              <div className="bg-gray-300 w-full h-[64px] rounded-t-2xl flex items-center justify-start p-4">
                <b>Learning Roadmap</b>
              </div>
              <Roadmap data={null} />
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
