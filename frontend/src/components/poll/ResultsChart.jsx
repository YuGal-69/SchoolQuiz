import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ResultsChart({ results }) {
  const data = results.map((opt) => ({
    name: opt.text,
    votes: opt.votes,
  }));

  return (
    <div className="bg-[#FFFFFF] p-4 rounded-xl shadow-md h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="name" stroke="#373737" />
          <YAxis stroke="#373737" />
          <Tooltip />
          <Bar dataKey="votes" fill="#4F0DCE" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
