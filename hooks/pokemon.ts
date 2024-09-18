import useSWR from "swr";
import axios from "axios";
import { useState, useEffect } from "react";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

export interface PokemonApiResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: PokemonBasicInfo[];
}

export interface PokemonBasicInfo {
    name: string;
    url: string;
}

interface TypeCounts {
    [key: string]: number;
}

interface PokemonDetailedInfo {
    types: {
        type: {
            name: string;
        };
    }[];
}

interface TypeDistribution {
    single: number;
    dual: number;
}

export function useAllPokemon(params = {}) {
    const { data, error, isLoading } = useSWR(
        ["https://pokeapi.co/api/v2/pokemon", params],
        ([url]) => fetcher(`${url}?limit=151`),
    );

    return {
        pokemon: data as PokemonApiResponse,
        isLoading,
        isError: error,
    };
}

export function useCountPokemonTypes(allPokemon: PokemonApiResponse): {
    typeDistribution: TypeDistribution | null;
    typeCountsObj: TypeCounts | null;
    typeCounts: { name: string; count: number }[] | [];
    isLoading: boolean;
    isError: any;
} {
    // const { pokemon: allPokemon, isLoading: isLoadingAll, isError: isErrorAll } = useAllPokemon();
    // const allPokemon = pkem
    const [typeCountsObj, setTypeCountsObj] = useState<TypeCounts | null>(null);
    const [typeCounts, setTypeCounts] = useState<
        { name: string; count: number }[] | []
    >([]);
    const [typeDistribution, setTypeDistribution] =
        useState<TypeDistribution | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState<any>(false);

    useEffect(() => {
        if (allPokemon) {
            const fetchTypes = async () => {
                const counts: TypeCounts = {};
                let singleTypeCount = 0;
                let dualTypeCount = 0;
                try {
                    const detailPromises = allPokemon.results.map((pokemon) =>
                        axios.get<PokemonDetailedInfo>(pokemon.url),
                    );
                    const detailResponses = await Promise.all(detailPromises);

                    detailResponses.forEach((response) => {
                        const types = response.data.types;
                        types.forEach(
                            (typeInfo: { type: { name: string } }) => {
                                const typeName = typeInfo.type.name;
                                counts[typeName] = (counts[typeName] || 0) + 1;
                            },
                        );

                        if (types.length === 1) {
                            singleTypeCount++;
                        } else if (types.length === 2) {
                            dualTypeCount++;
                        }
                    });

                    const sortedCounts = Object.entries(counts)
                        .map(([type, count]) => ({ name: type, count }))
                        .sort((a, b) => b.count - a.count);

                    setTypeCountsObj(counts);
                    setTypeCounts(sortedCounts);
                    setTypeDistribution({
                        single: singleTypeCount,
                        dual: dualTypeCount,
                    });
                    setIsLoading(false);
                } catch (error) {
                    setIsError(error);
                    setIsLoading(false);
                }
            };

            fetchTypes();
        }
    }, [allPokemon]);

    return {
        typeDistribution,
        typeCountsObj,
        typeCounts,
        isLoading: isLoading,
        isError: isError,
    };
}
