"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, CalendarIcon, Moon, Sun, Link } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

type Difficulty = "easy" | "medium" | "hard";
type Problem = {
  number: string;
  difficulty: Difficulty;
  link: string;
};

type Entry = {
  date: Date;
  problems: {
    [key: string]: Problem[] | "Missed";
  };
};

type PersonProblems = {
  problems: Problem[];
};

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [date, setDate] = useState<Date>();
  const [problemInputs, setProblemInputs] = useState<{
    [key: string]: PersonProblems;
  }>({
    Saketh: { problems: [{ number: "", difficulty: "easy", link: "" }] },
    Aditya: { problems: [{ number: "", difficulty: "easy", link: "" }] },
    Kushagra: { problems: [{ number: "", difficulty: "easy", link: "" }] },
  });

  const addProblemForPerson = (person: string) => {
    setProblemInputs((prev) => ({
      ...prev,
      [person]: {
        problems: [
          ...prev[person].problems,
          { number: "", difficulty: "easy", link: "" },
        ],
      },
    }));
  };

  const removeProblemForPerson = (person: string, index: number) => {
    setProblemInputs((prev) => ({
      ...prev,
      [person]: {
        problems: prev[person].problems.filter((_, i) => i !== index),
      },
    }));
  };

  const updateProblem = (
    person: string,
    index: number,
    field: keyof Problem,
    value: string
  ) => {
    setProblemInputs((prev) => ({
      ...prev,
      [person]: {
        problems: prev[person].problems.map((problem, i) =>
          i === index ? { ...problem, [field]: value } : problem
        ),
      },
    }));
  };

  const handleAddEntry = () => {
    if (!date) return;

    const newEntry: Entry = {
      date,
      problems: Object.entries(problemInputs).reduce((acc, [person, data]) => {
        const validProblems = data.problems.filter(
          (p) => p.number !== "" && p.link !== ""
        );
        acc[person] = validProblems.length > 0 ? validProblems : "Missed";
        return acc;
      }, {} as Entry["problems"]),
    };

    setEntries((prev) => 
      [...prev, newEntry].sort((a, b) => b.date.getTime() - a.date.getTime())
    );

    // Reset inputs
    setProblemInputs({
      Saketh: { problems: [{ number: "", difficulty: "easy", link: "" }] },
      Aditya: { problems: [{ number: "", difficulty: "easy", link: "" }] },
      Kushagra: { problems: [{ number: "", difficulty: "easy", link: "" }] },
    });
    setDate(undefined);
  };

  const getDifficultyColor = (difficulty: Difficulty) => {
    const baseClasses = "px-2.5 py-1 rounded-full font-medium text-white text-xs tracking-wide";
    switch (difficulty) {
      case "easy":
        return cn(baseClasses, "bg-green-600 dark:bg-green-700");
      case "medium":
        return cn(baseClasses, "bg-yellow-500 dark:bg-yellow-600");
      case "hard":
        return cn(baseClasses, "bg-red-600 dark:bg-red-700");
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white p-4 md:p-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">LeetCode Streak Tracker</h1>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="ml-auto"
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6 bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 overflow-hidden">
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-6 font-medium text-sm tracking-wide text-gray-600 dark:text-slate-300 pb-3 border-b border-gray-200 dark:border-slate-700">
                <div className="pl-2">DATE</div>
                <div className="pl-2">SAKETH</div>
                <div className="pl-2">ADITYA</div>
                <div className="pl-2">KUSHAGRA</div>
              </div>

              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                {entries.map((entry, idx) => (
                  <div key={idx} className="grid grid-cols-4 gap-6 text-sm py-2">
                    <div className="text-gray-500 dark:text-slate-400 pl-2">
                      {format(entry.date, "MMM dd, yyyy")}
                    </div>
                    {["Saketh", "Aditya", "Kushagra"].map((person) => (
                      <div key={person} className="pl-2">
                        {entry.problems[person] === "Missed" ? (
                          <span className="text-red-500 dark:text-red-400 font-medium">
                            Missed
                          </span>
                        ) : (
                          <div className="flex flex-wrap gap-1.5">
                            {entry.problems[person].map((problem, pIdx) => (
                              <a
                                key={pIdx}
                                href={problem.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={cn(
                                  getDifficultyColor(problem.difficulty),
                                  "flex items-center gap-1 transition-opacity"
                                )}
                              >
                                {problem.number}
                                <Link className="h-3 w-3 opacity-80" />
                              </a>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700">
            <div className="space-y-6">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "MMMM d, yyyy") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              {["Saketh", "Aditya", "Kushagra"].map((person) => (
                <div key={person} className="space-y-3 pb-4 border-b last:border-0 dark:border-slate-700">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium tracking-tight">{person}</h3>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => addProblemForPerson(person)}
                      className="h-8"
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Problem
                    </Button>
                  </div>
                  {problemInputs[person].problems.map((problem, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="flex-1 space-y-2">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Problem #"
                            value={problem.number}
                            onChange={(e) =>
                              updateProblem(person, index, "number", e.target.value)
                            }
                            className="dark:bg-slate-900 dark:border-slate-700"
                          />
                          <Select
                            value={problem.difficulty}
                            onValueChange={(value: Difficulty) =>
                              updateProblem(person, index, "difficulty", value)
                            }
                          >
                            <SelectTrigger className="w-[110px] dark:bg-slate-900 dark:border-slate-700">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="easy">Easy</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="hard">Hard</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <Input
                          placeholder="Problem URL"
                          value={problem.link}
                          onChange={(e) =>
                            updateProblem(person, index, "link", e.target.value)
                          }
                          className="dark:bg-slate-900 dark:border-slate-700"
                        />
                      </div>
                      {problemInputs[person].problems.length > 1 && (
                        <Button
                          size="icon"
                          variant="outline"
                          className="mt-2"
                          onClick={() => removeProblemForPerson(person, index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              ))}

              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium"
                onClick={handleAddEntry}
                disabled={!date}
              >
                Add Entry
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}