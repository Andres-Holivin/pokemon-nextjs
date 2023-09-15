"use client"
import { Box, Button, CircularProgress, Grid, GridItem, Image, Link, Text } from "@chakra-ui/react";
import { atom, useAtom } from "jotai";
import { loadable } from "jotai/utils"
import { ListPokemon, getPokemon } from "../(utils)/poke-api";
import { useRouter } from 'next/navigation'

let listPokemon: ListPokemon | null = null;
const take = 12
const pageAtom = atom(1)
const getPokemonAtom = atom(async (get) => {
    const page = get(pageAtom)
    const response = await getPokemon({ page: page, take: take })
    if (listPokemon == null) listPokemon = response
    else {
        listPokemon.results = [...listPokemon.results, ...response.results]
    }
    return response
})
const loadableAtom = loadable(getPokemonAtom)

export default function Page() {
    const [page, setPage] = useAtom(pageAtom)
    const [value] = useAtom(loadableAtom)
    const router = useRouter()
    return (
        <Box p="2">
            <Grid templateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={6}>
                {
                    listPokemon?.results.map((v, i) => {
                        return (
                            <GridItem style={{cursor:"pointer"}} onClick={() => router.push(`/detail/${v.id}`)} key={i} shadow="xl" bg="gray.100" rounded="md" alignItems="center" overflow="clip" justifyContent="center" gap={2}>
                                <Box p={2} display={"flex"} justifyContent="center" alignItems="center">
                                    <Box >
                                        <Text fontWeight="bold" fontSize="xl">{v.name.toUpperCase()}</Text>
                                        <Text w="min" bg="gray.200" px="4" py="2" rounded="2xl" fontWeight="semibold" fontSize="lg">#{(parseInt(v.id)).toString()}</Text>
                                    </Box>
                                    <Image
                                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${v.id}.svg`}
                                        alt={v.id}
                                        loading="lazy"
                                        objectFit="contain"
                                        width={{ base:"24", xl: "36" }}
                                        height={{ base:"24", xl: "36" }}
                                    />
                                </Box>
                            </GridItem>
                        )
                    })
                }
            </Grid>
            <Box display="flex" justifyContent="center" p="2">
                {value.state === 'loading'
                    ? <CircularProgress isIndeterminate color='green.300' />
                    : value.state === 'hasError'
                        ? <Text>{value.state}</Text>
                        : page * take < (listPokemon?.count ?? 0) ? <Button variant="outline" colorScheme="green" onClick={() => setPage(page + 1)}>Load More</Button> : <></>
                }
            </Box>

        </Box>
    )
}
