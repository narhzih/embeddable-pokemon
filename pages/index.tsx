import { useAllPokemon } from "@/hooks/pokemon";
import { Loader } from "@/components/misc/Loader";
import {
    PokemonBarChart,
    PokemonTypeDistributionChart,
} from "@/components/ui/PokemonChart";

import { Card } from "@/components/shadcn/card";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/shadcn/tabs";
import { PokemonSearch } from "@/components/ui/PokemonSearch";

export default function Index() {
    const { pokemon, isLoading } = useAllPokemon();

    return (
        <>
            {isLoading && <Loader />}
            {!isLoading && (
                <>
                    <div className="w-full flex justify-center mt-20 px-5  md:px-10 lg:px-20">
                        <Tabs defaultValue="type-chart" className="w-full">
                            <TabsList className="mb-10 mx-auto grid w-[400px] lg:w-[600px] grid-cols-3">
                                <TabsTrigger value="type-chart">
                                    Type Chart
                                </TabsTrigger>
                                <TabsTrigger value="dist-chart">
                                    Distribution Chart
                                </TabsTrigger>
                                <TabsTrigger value="search">
                                    Pokemon Search
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent value="type-chart" className="">
                                <Card className="border-2 border-gray-50 my-10 p-2 md:p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out">
                                    <h1 className="flex justify-center mt-3 mb-3 text-4xl font-bold tracking-tight sm:text-5xl leading-relaxed">
                                        Pokemon Type Chart
                                    </h1>
                                    <PokemonBarChart allPokemon={pokemon} />
                                </Card>
                            </TabsContent>
                            <TabsContent value="dist-chart">
                                <Card className="border-2 border-gray-50 my-10 p-2 md:p-6 bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out">
                                    <h1 className="flex justify-center mt-3 mb-3 text-4xl font-bold tracking-tight sm:text-5xl leading-relaxed">
                                        Pokemon Distribution Chart
                                    </h1>
                                    <PokemonTypeDistributionChart
                                        allPokemon={pokemon}
                                    />
                                </Card>
                            </TabsContent>
                            <TabsContent value="search">
                                <PokemonSearch />
                            </TabsContent>
                        </Tabs>
                    </div>
                    <div className="p-20"></div>
                </>
            )}
        </>
    );
}
