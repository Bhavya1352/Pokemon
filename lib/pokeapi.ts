export const POKEAPI_BASE = 'https://pokeapi.co/api/v2'

export const TYPE_NAMES = ['all', 'normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'] as const
export type PokemonType = (typeof TYPE_NAMES)[number]

export type PokemonSummary = {
  id: number
  name: string
  types: string[]
  image: string
  height?: number
  weight?: number
  stats?: PokemonStat[]
}
export type PokemonStat = { name: string; value: number }
export type PokemonDetails = PokemonSummary & { abilities: string[]; description?: string }

type ListResponse = { count: number; next: string | null; results: { name: string; url: string }[] }
type DetailResponse = { id: number; name: string; height: number; weight: number; abilities: { ability: { name: string } }[]; types: { slot: number; type: { name: string } }[]; stats: { base_stat: number; stat: { name: string } }[]; sprites: { other?: { ['official-artwork']?: { front_default: string | null } } } }

async function request<T>(url: string): Promise<T> {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`PokéAPI request failed (${response.status})`)
  return response.json() as Promise<T>
}

export function imageFor(id: number) { return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png` }
export function formatName(name: string) { return name.split('-').map((part) => part[0]?.toUpperCase() + part.slice(1)).join(' ') }

export async function fetchPokemonPage(offset: number, limit = 24) {
  const data = await request<ListResponse>(`${POKEAPI_BASE}/pokemon?limit=${limit}&offset=${offset}`)
  const details = await Promise.all(data.results.map((item) => request<DetailResponse>(item.url)))
  return { count: data.count, next: data.next, items: details.map(toSummary) }
}

export async function fetchPokemonDetails(id: number): Promise<PokemonDetails> {
  const data = await request<DetailResponse>(`${POKEAPI_BASE}/pokemon/${id}`)
  const summary = toSummary(data)
  return { ...summary, abilities: data.abilities.map(({ ability }) => formatName(ability.name)) }
}

function toSummary(data: DetailResponse): PokemonSummary {
  return { id: data.id, name: data.name, types: data.types.sort((a, b) => a.slot - b.slot).map(({ type }) => type.name), image: data.sprites.other?.['official-artwork']?.front_default || imageFor(data.id), height: data.height, weight: data.weight, stats: data.stats.map(({ base_stat, stat }) => ({ name: stat.name, value: base_stat })) }
}
