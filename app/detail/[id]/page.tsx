"use client"
import { DetailPokemon, EvolutionPokemon, getDetailEvolutionPokemon, getDetailPokemon } from "@/app/(utils)/poke-api";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { Box, Button, CircularProgress, Flex, Grid, Icon, Image, Progress, Tab, TabList, TabPanel, TabPanels, Tabs, Text } from "@chakra-ui/react";
import { atom, useAtom } from "jotai";
import { loadable } from "jotai/utils"
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

const pokemonIdAtom = atom(1)
const getPokemonAtom = atom(async (get) => {
    const id = get(pokemonIdAtom);
    const resDetail: DetailPokemon = await getDetailPokemon({ id: id })
    const resEvolution: EvolutionPokemon = await getDetailEvolutionPokemon({ id: id })
    console.log(resEvolution)
    return { 'detail': resDetail, 'evolution': resEvolution }
})
const detailLoadable = loadable(getPokemonAtom)

export default function Page() {
    const [value] = useAtom(detailLoadable)
    const [id, setId] = useAtom(pokemonIdAtom)
    const params = useParams()
    const router = useRouter()
    useEffect(() => {
        setId(parseInt(params.id.toString()))
    }, [])
    if (value.state === 'loading') return <Box display="flex" justifyContent="center" p="2"><CircularProgress isIndeterminate color='green.300' /></Box>
    if (value.state === 'hasError') return <Text>{value.state}</Text>
    return (<>
        <Button position="absolute" variant="outline" colorScheme="green" m="1" onClick={() => router.back()}><Icon as={ArrowBackIcon} /></Button>
        <Grid templateColumns={{ base: "1fr", xl: 'repeat(2, 1fr)' }} templateRows={{ base: "2fr 8fr", xl: '1fr' }} h="100vh">
            <Box alignSelf={{ base: "start", xl: "center" }} display="flex" flexDir="column">
                <Flex alignItems="center" justifyContent="space-around" w="full">
                    <Box display="flex" alignItems="center" alignContent="start" flexDir="column">
                        <Text fontWeight="bold" fontSize="2xl">{value.data.detail.name.toUpperCase()}</Text>
                        <Flex gap={4}>
                            {
                                value.data.detail.types.map((v, i) =>
                                    <Box key={i} bg="gray.100" px="4" py="2" rounded="2xl">{v.type.name}</Box>
                                )
                            }
                        </Flex>
                    </Box>
                    <Text w="min" bg="gray.200" px="4" py="2" rounded="2xl" fontWeight="bold" fontSize="2xl">#{(value.data.detail.id).toString()}</Text>
                </Flex>
                <Image alignSelf="center"
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${value.data.detail.id}.svg`}
                    alt={value.data.detail.id.toString()}
                    objectFit="contain"
                    width={{ base: "44", lg: "72" }}
                    height={{ base: "44", lg: "72" }}
                />
            </Box>
            <Tabs rounded="2xl" bg="gray.50" h="full" align="center">
                <TabList>
                    <Tab>About</Tab>
                    <Tab>Base Stats</Tab>
                    <Tab>Evolution</Tab>
                    <Tab>Moves</Tab>
                </TabList>
                <TabPanels textAlign="start">
                    <TabPanel>
                        <Grid templateColumns={'3fr 7fr'} my={2}>
                            <Text color="gray.600">Species</Text>
                            <Text fontWeight="semibold">{value.data.detail.species.name.toLocaleUpperCase()}</Text>
                        </Grid>
                        <Grid templateColumns={'3fr 7fr'} my={2}>
                            <Text color="gray.600">Height</Text>
                            <Text fontWeight="semibold">{`${(value.data.detail.height * 0.1 * 3.2808).toFixed(2)}" (${(value.data.detail.height * 0.1).toFixed(2)}) cm`}</Text>
                        </Grid>
                        <Grid templateColumns={'3fr 7fr'} my={2}>
                            <Text color="gray.600">Weight</Text>
                            <Text fontWeight="semibold">{`${(value.data.detail.weight * 0.1 * 2.2046).toFixed(2)} lbs (${(value.data.detail.weight * 0.1).toFixed(2)}) kg`} </Text >
                        </Grid>
                        <Grid templateColumns={'3fr 7fr'} my={2}>
                            <Text color="gray.600">Abilities</Text>
                            <Text fontWeight="semibold">{value.data.detail.abilities.map(v => " " + v.ability.name.toLocaleUpperCase()).toString()}</Text>
                        </Grid>
                    </TabPanel>
                    <TabPanel>
                        {
                            value.data.detail.stats.map((v, i) =>
                                <Grid templateColumns={'3.2fr 0.8fr 6fr'} key={i} alignItems="center" my="2">
                                    <Text>{v.stat.name}</Text>
                                    <Text>{v.base_stat}</Text>
                                    <Progress bg="gray.300" w="full" size='xs' value={v.base_stat} colorScheme={v.base_stat < 50 ? 'red' : 'green'} />
                                </Grid>
                            )
                        }
                    </TabPanel>
                    <TabPanel>
                        <Text fontWeight="bold" fontSize="2xl">{value.data.evolution.chain.species.name.toUpperCase()}</Text>
                        {
                            value.data.evolution.chain.evolves_to.map((v, i) =>
                                <Box key={i} display="flex" flexDir="column" justifyContent="center" alignItems="center" bg="gray.200" rounded="2xl" p={2}>
                                    <Text alignSelf="start" fontWeight="semibold" fontSize="lg">{v.species.name.toUpperCase()}</Text>
                                    {
                                        v.evolution_details.map((v2, i) => {
                                            return (
                                                <Box key={i} display="flex" gap={2}>
                                                    <Text bg="gray.100" px="4" py="2" rounded="2xl" >Level: {v2.min_level}</Text>
                                                    <Text bg="gray.100" px="4" py="2" rounded="2xl" >Trigger: {v2.trigger.name}</Text>
                                                </Box>
                                            )
                                        })
                                    }
                                    <Image
                                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${v.species.id}.svg`}
                                        alt={v.species.id.toString()}
                                        objectFit="contain"
                                        py={2}
                                        loading="lazy"
                                        width={{ base: "44", lg: "72" }}
                                        height={{ base: "44", lg: "72" }}
                                    />

                                </Box>
                            )
                        }
                    </TabPanel>
                    <TabPanel>
                        <Flex display="flex" gap={4} flexDir="column">
                            {
                                value.data.detail.moves.map((v, i) => {
                                    return (
                                        <Box key={i} >
                                            <Text bg="gray.200" px="4" py="2" rounded="2xl">{v.move.name}</Text>
                                        </Box>
                                    )
                                })
                            }
                        </Flex>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </Grid>
    </>
    )
}