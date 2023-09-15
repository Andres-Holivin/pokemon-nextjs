import axios from "axios";

type PageProps = {
    page: number
    take: number
}
export type Pokemon = {
    id: string,
    name: string,
    url: string
}
export type ListPokemon = {
    results: Pokemon[],
    count: number
}
export let url: string = 'https://pokeapi.co/api/v2';
export async function getPokemon(props: PageProps) {
    const urlString = `${url}/pokemon?limit=${props.take}&offset=${(props.page - 1) * props.take}`;
    await delay(1000);
    const { data, status } = await axios
        .get<ListPokemon>(urlString)
        .then(res => res)
        .catch(err => err)
    const temp = (data as ListPokemon).results.map(v => {
        let slice = v.url.split('/')
        v.id = slice[slice.length - 2]
    })
    return data
}
const delay = (ms: any) => new Promise(
    resolve => setTimeout(resolve, ms)
);
export type DetailPokemon = {
    weight: number,
    height: number
    species: {
        name: string
    },
    abilities: {
        ability: { name: string }
    }[]
    stats: {
        base_stat: number,
        stat: { name: string }
    }[],
    evolution: {
        weight: number,
        height: number
        species: string,
        abilities: string[]
    },
    types: { type: { name: string } }[]
    moves: { move: { name: string } }[]
    name: string,
    id: number
}
export async function getDetailPokemon({ id }: { id: number }) {
    const urlString = `${url}/pokemon/${id}`;
    const { data, status } = await axios
        .get<DetailPokemon>(urlString)
        .then(res => res)
        .catch(err => err)
    console.log(data)
    return data
}
export type EvolutionPokemon = {
    chain: {
        evolves_to: {
            species: {
                name: string,
                id: string,
                url: string,
            },
            evolution_details: {
                min_level: number,
                trigger: {
                    name: string
                }
            }[]
        }[]
        species: {
            name: string
        }
    }
}
export async function getDetailEvolutionPokemon({ id }: { id: number }) {
    const urlString = `${url}/evolution-chain/${id}`;
    await delay(1000);
    const { data, status } = await axios
        .get<EvolutionPokemon>(urlString)
        .then(res => res)
        .catch(err => err)
    const temp = (data as EvolutionPokemon).chain.evolves_to.map(v => {
        let slice = v.species.url.split('/')
        v.species.id = slice[slice.length - 2]
    })
    return data
}
