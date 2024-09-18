import React, { useState, useEffect } from "react";
import { useCountPokemonTypes, PokemonApiResponse } from "@/hooks/pokemon";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell,
    PieChart,
    Pie,
} from "recharts";
import { Loader } from "@/components/misc/Loader";
import { Switch } from "@/components/shadcn/switch";
import { Label } from "@/components/shadcn/label";
import { Error } from "@/components/misc/Error";

const typeColors: { [key: string]: string } = {
    normal: "#A8A77A",
    fire: "#EE8130",
    water: "#6390F0",
    electric: "#F7D02C",
    grass: "#7AC74C",
    ice: "#96D9D6",
    fighting: "#C22E28",
    poison: "#A33EA1",
    ground: "#E2BF65",
    flying: "#A98FF3",
    psychic: "#F95587",
    bug: "#A6B91A",
    rock: "#B6A136",
    ghost: "#735797",
    dragon: "#6F35FC",
    dark: "#705746",
    steel: "#B7B7CE",
    fairy: "#D685AD",
};

export function PokemonBarChart({
    allPokemon,
}: {
    allPokemon: PokemonApiResponse;
}) {
    const { typeCounts, isLoading, isError } = useCountPokemonTypes(allPokemon);
    const [showPercentage, setShowPercentage] = useState(false);
    const [chartData, setChartData] = useState<
        { name: string; count: number }[]
    >(
        typeCounts.map((type) => ({
            ...type,
        })),
    );

    // I don't like this approach but, for some reasons the BarChart component isn't re-rendering when the data-key is updated
    useEffect(() => {
        if (showPercentage) {
            const total = typeCounts.reduce((sum, type) => sum + type.count, 0);

            setChartData(
                typeCounts.map((type) => ({
                    ...type,
                    count: Number(((type.count / total) * 100).toFixed(2)),
                })),
            );
        } else {
            setChartData(
                typeCounts.map((type) => ({
                    ...type,
                })),
            );
        }
    }, [showPercentage]);

    useEffect(() => {
        setChartData(
            typeCounts.map((type) => ({
                ...type,
            })),
        );
    }, [typeCounts]);

    if (isLoading) return <Loader text="Loading chart..." />;
    {
        isError && (
            <Error errorText="An error occurred while loading Type Chart"></Error>
        );
    }
    if (!typeCounts)
        return <h1>No data right now. Maybe check back later? 👀 </h1>;
    return (
        <>
            <div className="flex items-center justify-end px-5 space-x-2 mb-4">
                <Label htmlFor="show-percentage">Show Percentage</Label>
                <Switch
                    id="show-percentage"
                    checked={showPercentage}
                    onCheckedChange={setShowPercentage}
                />
            </div>
            <ResponsiveContainer width="100%" height={600}>
                <BarChart
                    data={chartData}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis
                        domain={[0, showPercentage ? 100 : "auto"]}
                        tickFormatter={
                            showPercentage
                                ? (value) => `${value}%`
                                : (value) => `${value}`
                        }
                    />
                    <Tooltip
                        formatter={(value) =>
                            showPercentage
                                ? `${Number(value).toFixed(2)}%`
                                : value
                        }
                    />
                    <Legend />
                    <Bar
                        dataKey="count"
                        name={showPercentage ? "Percentage" : "Count"}
                    >
                        {chartData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={typeColors[entry.name] ?? "#8884d8"}
                            />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </>
    );
}

const COLORS = ["#0088FE", "#00C49F"];

export const PokemonTypeDistributionChart = ({
    allPokemon,
}: {
    allPokemon: PokemonApiResponse;
}) => {
    const { typeDistribution, isLoading, isError } =
        useCountPokemonTypes(allPokemon);

    if (isLoading) return <Loader text="Loading chart..." />;
    {
        isError && (
            <Error errorText="An error occurred while loading Distribution Chart"></Error>
        );
    }
    if (!typeDistribution)
        return <h1>No data right now. Maybe check back later? 👀 </h1>; // TODO: Add a better state UI for this

    const data = [
        { name: "Single-type", value: typeDistribution?.single ?? 0 },
        { name: "Dual-type", value: typeDistribution?.dual ?? 0 },
    ];

    return (
        <ResponsiveContainer width="100%" height={400}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                    }
                >
                    {data.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                        />
                    ))}
                </Pie>
                <Tooltip />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
};
