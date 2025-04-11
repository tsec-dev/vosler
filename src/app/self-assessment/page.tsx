import BaseLayout from "@/components/BaseLayout";
import { FaStar } from "react-icons/fa";
import { useState } from "react";

const traits = ["Communication", "Leadership", "EQ", "Adaptability", "Integrity", "Boldness"];

export default function SelfAssessmentPage() {
  const [selfAssessment, setSelfAssessment] = useState<Record<string, number>>({});
  const [journalEntry, setJournalEntry] = useState("");

  return (
    <BaseLayout>
      <h1 className="text-2xl font-bold mb-6">🪞 Weekly Self-Assessment</h1>

      {traits.map((trait) => (
        <div key={trait} className="mb-4">
          <label className="block text-sm font-medium mb-1">{trait}</label>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5].map((num) => (
              <FaStar
                key={num}
                className={`cursor-pointer ${
                  (selfAssessment[trait] || 0) >= num
                    ? "text-yellow-400"
                    : "text-gray-400"
                }`}
                onClick={() =>
                  setSelfAssessment((prev) => ({ ...prev, [trait]: num }))
                }
              />
            ))}
          </div>
        </div>
      ))}

      <label className="block text-sm font-medium mb-1 mt-4">🪞 Reflection Prompt</label>
      <textarea
        className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md px-3 py-2 text-sm mb-4"
        rows={3}
        placeholder="What’s one leadership moment you had this week?"
        value={journalEntry}
        onChange={(e) => setJournalEntry(e.target.value)}
      ></textarea>

      <button className="bg-green-600 hover:bg-green-500 text-white font-medium py-2 px-4 rounded-md text-sm transition">
        Submit Self-Assessment
      </button>
    </BaseLayout>
  );
}
