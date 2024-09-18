import React, { useEffect, useState } from "react";
import { Input } from "@/components/shadcn/input";
import { Card, CardContent } from "@/components/shadcn/card";
import { useAllPokemon, PokemonBasicInfo } from "@/hooks/pokemon";

const PokemonSearchInput = ({
    onSearch,
}: {
    onSearch: React.Dispatch<React.SetStateAction<PokemonBasicInfo[]>>;
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const { pokemon: allPokemon, isLoading, isError } = useAllPokemon();

    useEffect(() => {
        if (allPokemon && !isLoading && !isError) {
            const filteredPokemon = allPokemon.results.filter((pokemon) =>
                pokemon.name.toLowerCase().includes(searchTerm.toLowerCase()),
            );
            onSearch(filteredPokemon);
        }
    }, [searchTerm, allPokemon, isLoading, isError, onSearch]);

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading Pokémon data</div>;

    return (
        <div className="w-full max-w-sm">
            <Input
                type="text"
                placeholder="Search Pokémon"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
            />
        </div>
    );
};

const PokemonSearchResults = ({ results }: { results: PokemonBasicInfo[] }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            {results.length == 0 && (
                <>
                    <h1>No results found...</h1>
                </>
            )}
            {results.length > 0 &&
                results.map((pokemon) => (
                    <Card key={pokemon.name} className="w-full">
                        <CardContent className="p-4">
                            <h3 className="font-bold text-lg capitalize">
                                {pokemon.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                                ID: {pokemon.url.split("/").slice(-2, -1)[0]}
                            </p>
                        </CardContent>
                    </Card>
                ))}
        </div>
    );
};

export const PokemonSearch = () => {
    const [searchResults, setSearchResults] = useState<PokemonBasicInfo[]>([]);
    return (
        <div className="w-full flex justify-center mt-10">
            <div>
                <h1 className="flex justify-center mt-3 mb-3 text-4xl font-bold tracking-tight sm:text-5xl leading-relaxed">
                    Let's find you a pokemon!
                </h1>

                <PokemonSearchInput onSearch={setSearchResults} />
                <PokemonSearchResults results={searchResults} />
            </div>
        </div>
    );
};
