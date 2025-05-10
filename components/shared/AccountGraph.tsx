"use client";
import { useGetGraphData } from "@/app/hooks/useGetGraphData";
import { accountStore } from "@/app/store/account";
import { LoaderCircle } from "lucide-react";
import React, { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface GraphDataType {
  date: string;
  balance: number;
}

const Example = ({ filter }: { filter: "1M" | "3M" | "24H" | "7D" }) => {
  const account = accountStore((state) => state.account);
  const { data, isPending } = useGetGraphData(account.id);

  const filteredData: GraphDataType[] = useMemo(() => {
    if (!data) return [];
    switch (filter) {
      case "1M":
        return data.slice(-720);
      case "3M":
        return data.slice(-2160);
      case "7D":
        return data.slice(-168);
      case "24H":
        return data.slice(-24);
      default:
        return data;
    }
  }, [data, filter]);

  if (isPending) {
    return (
      <div className=" flex justify-center items-center h-[310px] gap-2">
        <LoaderCircle className="animate-spin" />
        Loading Graph...
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={310}>
      <AreaChart
        data={filteredData}
        margin={{
          top: 10,
          right: 10,
          left: 0,
          bottom: 10,
        }}
      >
        <XAxis
          dataKey="date"
          tick={{
            fill: "#001E45", // Primary color
            fontSize: 12, // Adjust font size for better visibility
            dy: 10, // Adjust vertical position
            dx: 0, // Horizontal position
          }}
          tickLine={{ stroke: "#001E45" }} // Primary color
          allowDuplicatedCategory
        />
        <YAxis
          tick={{
            fill: "#001E45", // Primary color
            fontSize: 12, // Adjust font size
            dy: 0, // Vertical position
            dx: -10, // Horizontal position
          }}
          tickLine={{ stroke: "#001E45" }} // Primary color
        />
        <Tooltip
          cursor={{ fill: "rgba(0, 30, 69, 0.1)" }} // Slight tint of the primary color
          contentStyle={{
            backgroundColor: "white", // Match the background
            border: `1px solid #001E45`, // Primary color
            borderRadius: "10px",
            padding: "20px 45px",
          }}
          labelStyle={{ color: "#001E45", fontSize: 14 }}
          itemStyle={{
            color: "#001E45",
            fontSize: 14,
            fontWeight: 600,
          }}
        />
        <Area
          type="linear"
          dataKey="balance"
          stroke="#001E45" // Primary color
          fill="rgba(0, 30, 69, 0.1)" // Transparent tint of primary color
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default Example;
