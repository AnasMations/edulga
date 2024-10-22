import IconEdulga from "@/assets/IconEdulga";
import Header from "@/components/Header";
import KnowledgeGraph from "@/components/KnowledgeGraph";
import Image from "next/image";
import graphTemp from "@/assets/graph.png";
import AiAvatar from "@/components/AiAvatar";

interface Node {
  nodeName: string;
  edges: string[];
  description: string;
  tokenID: string;
}

export default function Home() {
  const graphData: Node[] = [
    {
      nodeName: "Computer Science",
      edges: ["AI000", "DS000", "NW000", "SE000", "DB000", "OS000", "AL000"],
      description: "The study of computation, information, and automation",
      tokenID: "CS101",
    },
    {
      nodeName: "Artificial Intelligence",
      edges: ["CS101", "ML000"],
      description: "The simulation of human intelligence in machines",
      tokenID: "AI000",
    },
    {
      nodeName: "Data Structures",
      edges: ["CS101", "AL000"],
      description: "Ways of organizing and storing data",
      tokenID: "DS000",
    },
    {
      nodeName: "Computer Networks",
      edges: ["CS101", "CY000"],
      description: "Study of interconnected computing devices",
      tokenID: "NW000",
    },
    {
      nodeName: "Software Engineering",
      edges: ["CS101", "DB000"],
      description: "Application of engineering to software development",
      tokenID: "SE000",
    },
    {
      nodeName: "Database Systems",
      edges: ["CS101", "SE000"],
      description: "Organized collection of data and DBMS",
      tokenID: "DB000",
    },
    {
      nodeName: "Operating Systems",
      edges: ["CS101", "NW000"],
      description:
        "Software that manages computer hardware and software resources",
      tokenID: "OS000",
    },
    {
      nodeName: "Algorithms",
      edges: ["CS101", "DS000"],
      description: "Step-by-step procedures for solving problems",
      tokenID: "AL000",
    },
    {
      nodeName: "Machine Learning",
      edges: ["AI000", "DS000"],
      description: "Subset of AI focused on data and algorithms",
      tokenID: "ML000",
    },
    {
      nodeName: "Cybersecurity",
      edges: ["NW000", "OS000"],
      description: "Protection of computer systems and networks",
      tokenID: "CY000",
    },
  ];

  return (
    <div className="">
      <Header />
      <div className="h-[108px]" />
      <div className="p-8">
        <div className="flex w-full justify-center items-start gap-8">
          {/* Left Column */}
          <div className="flex flex-col gap-8">
            <div className="bg-white w-[800px] h-[500px] rounded-2xl shadow-lg p-4">
              <div className="bg-[#0B0532] w-full h-full rounded-2xl overflow-hidden">
                <KnowledgeGraph data={graphData} className="w-full h-full" />
              </div>
            </div>
            {/* Roadmap */}
            <div className="bg-white w-[800px] h-[500px] rounded-2xl shadow-lg">
              <div className="bg-gray-300 w-full h-[64px] rounded-t-2xl flex items-center justify-start p-4">
                <b>Learning</b>
              </div>
            </div>
          </div>
          {/* Right Column */}
          <div className="flex flex-col gap-8">
            {/* <AiAvatar/> */}
            <div className="bg-white w-[500px] h-[500px] rounded-2xl shadow-lg p-4 overflow-hidden">
              <AiAvatar />
            </div>
            {/* Communities */}
            <div className="bg-white w-[500px] rounded-2xl shadow-lg">
              <div className="bg-gray-300 w-full h-[64px] rounded-t-2xl flex items-center justify-start p-4">
                <b>Community</b>
              </div>
              <div className="p-4 flex gap-4 flex-wrap">
                <div className="bg-[#FFCB86] py-2 px-4 w-fit rounded flex flex-col cursor-pointer hover:bg-opacity-70">
                  <b>Intro to NLP</b>
                  <p className=" text-xs">40 members</p>
                </div>

                <div className="bg-[#FFCB86] py-2 px-4 w-fit rounded flex flex-col cursor-pointer hover:bg-opacity-70">
                  <b>AI enthusiasts</b>
                  <p className=" text-xs">+99 members</p>
                </div>

                <div className="bg-[#FF4086] py-2 px-4 w-fit rounded flex flex-col cursor-pointer hover:bg-opacity-70 text-white">
                  <b>Getting into the world of NLP</b>
                  <p className=" text-xs">
                    Event - 20th Oct 2025 - 19:30 to 21:30
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
