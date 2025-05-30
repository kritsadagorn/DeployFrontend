import React, { useEffect, useState } from "react";
import { prePos } from "../data/pre-pos";
import { useNavigate } from "react-router-dom";
import { ArrowDown } from "lucide-react";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css"; // Optional: Default Tippy styling

const DataTable = ({ data, onLanguageSelected, itemsPerPage, currentPage}) => {
  const navigate = useNavigate(); // useNavigate hook

  const groupskill = {
    PROGRAMMING_LANG:
      "border-blue-200 bg-blue-100 text-blue-800 duration-300 hover:bg-blue-300 text-blue-900",
    FRAMEWORK:
      "border-purple-200 bg-purple-100 text-purple-800 duration-300 hover:bg-purple-300 text-purple-900",
    LIBRARY:
      "border-green-500 bg-green-100 text-green-800 duration-300 hover:bg-green-300 text-purple-900",
    OTHER:
      "border-neutral-500 bg-neutral-100 text-neutral-800 duration-300 hover:bg-neutral-300 text-neutral-900",
  };

  return data.map((row, index) => {
    const rowNumber = currentPage * itemsPerPage + index + 1;

    let trendClass = "";
    switch (row.trending) {
      case "PEAK":
        trendClass = "border-green-200 bg-green-100 text-green-800";
        break;
      case "AVERAGE":
        trendClass = "border-yellow-200 bg-yellow-100 text-yellow-800";
        break;
      case "WEAK":
        trendClass = "border-red-200 bg-red-100 text-red-800 font-light";
        break;
      default:
        trendClass = "border-neutral-200 bg-neutral-100 text-neutral-800";
    }

    return (
      <tr
        key={row.id}
        className="dark:bg-neutral-800 dark:text-white dark:hover:bg-neutral-600 hover:bg-neutral-300 text-neutral-800 transition-all duration-200"
      >
        <td className="text-center">{rowNumber}</td>
        <td
          className="border border-neutral-300 px-4 py-2 font-light cursor-pointer hover:underline"
          onClick={() => navigate(`/position-info/${row.id}`)}
        >
          {row.position}
        </td>
        <td className="border border-neutral-300 py-2 font-light">
          <div className="pl-2 space-y-2 text-sm">
            {Array.from({ length: Math.ceil(row.skills.length / 5) }).map(
              (_, rowIndex) => (
                <div key={rowIndex} className="flex space-x-2 flex-wrap">
                  {row.skills
                    .slice(rowIndex * 5, rowIndex * 5 + 5)
                    .map(({ score, skills }, idx) => (
                      <Tippy
                        content={skills.group ?? "No description available"}
                        theme="custom"
                        animation="shift-away"
                        duration={[200, 150]}
                        delay={[100, 50]}
                        arrow={true}
                      >
                        <button
                          key={idx}
                          onClick={() =>
                            onLanguageSelected({
                              id: skills.id,
                              name: skills.name,
                            })
                          }
                          className={`${
                            groupskill[skills.group] ?? groupskill.OTHER
                          } border rounded-full text-sm py-1 px-3`}
                        >
                          {skills.name} ({score ?? 0}%)
                        </button>
                      </Tippy>
                    ))}
                </div>
              )
            )}
          </div>
        </td>
        <td className="border border-neutral-300 px-4 py-2 text-center font-light text-sm">
          <span className={`${trendClass} rounded-2xl px-4 py-1 border`}>
            {row.trending}
          </span>
        </td>
        {/* <td className="border border-neutral-300 px-4 py-2 text-center font-light">
          <button
            className="bg-neutral-100 text-neutral-800 px-4 py-2 rounded-md hover:bg-neutral-300 hover:text-neutral-900 border border-neutral-400 transition-all duration-200"
            onClick={() => navigate(`/position-info/${row.id}`)}
          >
            Explore
          </button>
        </td> */}
      </tr>
    );
  });
};

const MainTable = ({
  currentPage,
  handlePageChange,
  data,
  trendingSort,
  onTrendingSortToggle,
  onLanguageSelected,
}) => {
  const itemsPerPage = 11;
  const totalItems = prePos.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = prePos.slice(startIndex, endIndex);

  const [name, setName] = useState("");

  return (
    <div className="w-full p-4 pr-8 overflow-x-auto">
      <div className="flex justify-center">
        <div className="overflow-x-auto w-full">
          <table className="table-auto w-full bg-neutral-100 border border-neutral-300 border-collapse overflow-hidden">
            <thead className=" bg-neutral-200">
              <tr>
                <th
                  className="dark:bg-neutral-800 dark:text-white text-neutral-800 font-bold tracking-[5px] bg-neutral-100 py-2 px-6 text-left "
                  colSpan="5"
                >
                  Computer Engineering
                </th>
              </tr>
              <tr className="dark:bg-neutral-900 dark:text-white text-neutral-800">
                <th className="border border-neutral-300 px-[0.2px] py-2 font-bold text-center">
                  No.
                </th>
                <th className="border border-neutral-300 px-4 py-2 text-left font-bold">
                  Position
                </th>
                <th className="border border-neutral-300 px-4 py-2 text-left font-bold">
                  Mostly Skills Requirement{" "}
                  {name && (
                    <>
                      <span className="ml-4 inline-flex items-center gap-2 bg-green-100 text-green-800 border border-green-300 rounded-full px-3 py-1 text-sm font-medium shadow-sm">
                        🎯 Focus: <span className="font-semibold">{name}</span>
                        <button
                          onClick={() => {
                            setName("");
                            onLanguageSelected("");
                          }}
                          className="ml-2 bg-red-500 text-white px-2 py-0.5 rounded-full hover:bg-red-600 transition-all duration-200 text-xs shadow"
                          title="Clear Focus"
                        >
                          ✕
                        </button>
                      </span>
                    </>
                  )}
                </th>
                <th className="border border-neutral-300 px-4 py-2 text-center font-bold relative">
                  <span>Trending</span>

                  {/* Trending sort */}
                  <button
                    onClick={() => onTrendingSortToggle()}
                    className={`absolute right-3 top-3 duration-300 ${
                      trendingSort === "desc" ? "rotate-180" : "rotate-0"
                    }`}
                  >
                    <ArrowDown size={18} />
                  </button>
                </th>
                {/* <th className="border border-neutral-300 px-4 py-2 text-center font-light">
                  Action
                </th> */}
              </tr>
            </thead>
            <tbody>
              <DataTable
                data={data}
                onLanguageSelected={({ id, name }) => {
                  onLanguageSelected(id);
                  setName(name);
                }}
                currentPage={currentPage}
                itemsPerPage={13}
              />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MainTable;
