"use client";
import IconEdulga from "@/assets/IconEdulga";
import Header from "@/components/Header";
import KnowledgeGraph from "@/components/KnowledgeGraph";
import Image from "next/image";
import graphTemp from "@/assets/graph.png";
import AiAvatar from "@/components/AiAvatar";
import SimliOpenAI from "@/components/SimliOpenAI";
import NestedKnowledgeGraph from "@/components/KnowledgeGraph";

export default function Home() {
  const graphData = {
    subject: "Computer Science",
    topics: [
      {
        topic: "Core Areas",
        definition: {
          topics: [
            {
              title: "Theoretical Foundations",
              definition: {
                topics: [
                  {
                    title: "Algorithms and Data Structures",
                    definition: {
                      title:
                        "Methods for solving problems efficiently and organizing data",
                    },
                  },
                  {
                    title: "Theory of Computation",
                    definition: {
                      title:
                        "Understanding what problems can be solved using computers",
                    },
                  },
                  {
                    title: "Mathematical Foundations",
                    definition: {
                      title:
                        "Includes discrete mathematics, logic, and probability",
                    },
                  },
                ],
              },
            },
            {
              title: "Programming and Software Development",
              definition: {
                topics: [
                  {
                    title: "Programming Languages",
                    definition: {
                      title:
                        "Understanding and using languages like Python, Java, C++",
                    },
                  },
                  {
                    title: "Software Engineering",
                    definition: {
                      title:
                        "Techniques for designing, building, and maintaining software systems",
                    },
                  },
                  {
                    title: "Operating Systems",
                    definition: {
                      title:
                        "Study of system software managing hardware and software resources",
                    },
                  },
                ],
              },
            },
            {
              title: "Hardware and Architecture",
              definition: {
                topics: [
                  {
                    title: "Computer Architecture",
                    definition: {
                      title: "Design and organization of computer hardware",
                    },
                  },
                  {
                    title: "Embedded Systems",
                    definition: {
                      title:
                        "Programming and designing systems integrating with hardware",
                    },
                  },
                ],
              },
            },
            {
              title: "Artificial Intelligence and Machine Learning",
              definition: {
                topics: [
                  {
                    title: "AI",
                    definition: {
                      title: "Creating systems simulating human intelligence",
                    },
                  },
                  {
                    title: "ML",
                    definition: {
                      title:
                        "Designing algorithms for computers to learn patterns",
                    },
                  },
                ],
              },
            },
            {
              title: "Networking and Cybersecurity",
              definition: {
                topics: [
                  {
                    title: "Computer Networks",
                    definition: {
                      title:
                        "Understanding how computers communicate over networks",
                    },
                  },
                  {
                    title: "Cybersecurity",
                    definition: {
                      title:
                        "Protecting systems and data from unauthorized access",
                    },
                  },
                ],
              },
            },
            {
              title: "Data Science and Databases",
              definition: {
                topics: [
                  {
                    title: "Data Analysis",
                    definition: {
                      title: "Extracting insights from large datasets",
                    },
                  },
                  {
                    title: "Database Management",
                    definition: {
                      title:
                        "Designing and querying systems to store and manage data",
                    },
                  },
                ],
              },
            },
            {
              title: "Graphics and Visualization",
              definition: {
                topics: [
                  {
                    title: "Computer Graphics",
                    definition: {
                      title: "Techniques for creating visual content",
                    },
                  },
                  {
                    title: "Visualization",
                    definition: {
                      title: "Representing data in visual formats",
                    },
                  },
                ],
              },
            },
            {
              title: "Human-Computer Interaction (HCI)",
              definition: {
                title: "Designing intuitive and effective interfaces for users",
              },
            },
            {
              title: "Emerging Technologies",
              definition: {
                topics: [
                  {
                    title: "Cloud Computing",
                    definition: {
                      title: "Providing computing services over the internet",
                    },
                  },
                  {
                    title: "Quantum Computing",
                    definition: {
                      title:
                        "Leveraging quantum mechanics to process information",
                    },
                  },
                  {
                    title: "Blockchain",
                    definition: {
                      title: "A decentralized ledger for secure transactions",
                    },
                  },
                ],
              },
            },
          ],
        },
      },
      {
        topic: "Skills Developed",
        definition: {
          topics: [
            {
              title: "Logical Thinking and Problem-Solving",
              definition: {
                title: "Thinking critically and solving complex problems",
              },
            },
            {
              title: "Proficiency in Coding and Software Development",
              definition: {
                title: "Skill in writing code and developing software",
              },
            },
            {
              title: "Analytical Skills for Data Interpretation",
              definition: {
                title: "Interpreting and analyzing data effectively",
              },
            },
            {
              title: "Creativity in Designing Innovative Solutions",
              definition: {
                title: "Creating novel and efficient solutions",
              },
            },
            {
              title: "Knowledge of Ethical and Legal Considerations",
              definition: {
                title:
                  "Understanding ethical and legal implications in technology",
              },
            },
          ],
        },
      },
      {
        topic: "Applications",
        definition: {
          title:
            "Computer science is integral to industries like healthcare, finance, entertainment, and more. It powers innovations in areas such as AI, robotics, virtual reality, and smart devices.",
        },
      },
    ],
  };

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
                <NestedKnowledgeGraph
                  data={graphData}
                  className="w-full h-full"
                />
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
              {/* <AiAvatar /> */}
              <SimliOpenAI
                simli_faceid="c0a99dcb-e5ac-44c4-b1be-2981ddaf5f51"
                openai_voice="echo"
                initialPrompt="You are a Issac Newton a mentor and you guide students who are lost in their path to the right direction. You start by asking the students about what they want to study? and what are their interests? and about their study style? Then you give professional advice and guidance to the students."
                onStart={() => console.log("SimliOpenAI started")}
                onClose={() => console.log("SimliOpenAI closed")}
              />
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
