'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { ArrowUpRight, ChevronDown, LoaderCircle, Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  fetchPokemonByName,
  fetchPokemonByType,
  fetchPokemonDetails,
  fetchPokemonPage,
  formatName,
  type PokemonDetails,
  type PokemonSummary,
  type PokemonType,
} from '@/lib/pokeapi'

const types = [
  'all', 'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy',
] as const

function TypeBadge({ type }: { type: string }) {
  return <span className={`type-badge type-${type}`}>{type}</span>
}

function PokemonImage({
  pokemon,
  className = '',
}: {
  pokemon: PokemonSummary
  className?: string
}) {
  return (
    <img
      src={pokemon.image}
      alt={`${formatName(pokemon.name)} specimen official artwork`}
      className={`pokemon-image ${className}`}
      loading="lazy"
    />
  )
}

function Header({ loaded, total }: { loaded: number; total: number }) {
  return (
    <header className="site-header">
      <a href="#top" className="brand" aria-label="Pokémon Field Lab home">
        <span className="pokeball-mark">
          <span />
        </span>
        <div className="brand-text">
          <span className="brand-title">POKÉDEX</span>
          <span className="brand-subtitle">FIELD LAB / ARCHIVE</span>
        </div>
      </a>

      <div className="header-meta">
        <div className="meta-item">
          <span className="meta-dot" />
          <span>STATION // 01</span>
        </div>
        <div className="meta-item">
          <span>INDEXED:</span>
          <strong className="header-count">
            {loaded.toString().padStart(3, '0')} / {total.toString().padStart(3, '0')}
          </strong>
        </div>
      </div>
    </header>
  )
}

function Hero({
  query,
  setQuery,
  loaded,
  total,
}: {
  query: string
  setQuery: (value: string) => void
  loaded: number
  total: number
}) {
  return (
    <section className="hero" id="top">
      <div className="hero-main">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="eyebrow-accent" />
            POKÉDEX / FIELD NOTES
          </p>

          <h1 className="hero-heading">Build your Pokédex.</h1>

          <p className="hero-description">
            Browse Pokémon by name or type, then open any specimen for its stats, abilities and moves.
          </p>
        </div>

        <div className="hero-aside">
          <div className="hero-data-block">
            <div className="data-header">
              <span className="data-badge">LIVE DATABASE</span>
            </div>
            <div className="data-metric">
              <strong>
                {loaded.toString().padStart(3, '0')}
                <span className="data-slash">/</span>
                {total ? total.toString().padStart(4, '0') : '1025'}
              </strong>
            </div>
            <div className="data-label">SPECIMENS LOADED</div>
            <div className="data-subtext">
              <span className="live-indicator" />
              LIVE DATA · POKÉAPI
            </div>
          </div>
        </div>
      </div>

      <div className="search-container">
        <label className="search-box" htmlFor="pokemon-search">
          <Search className="search-icon" aria-hidden="true" />
          <input
            id="pokemon-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search specimen by name (e.g. Charizard, Gengar, Lucario)..."
            aria-label="Search Pokémon database by name"
            autoComplete="off"
            spellCheck="false"
          />
          {query && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => setQuery('')}
              aria-label="Clear search query"
            >
              <X className="clear-icon" />
              <span>CLEAR</span>
            </button>
          )}
          <kbd className="search-kbd">⌘ K</kbd>
        </label>
      </div>
    </section>
  )
}

function TypeFilter({
  selected,
  setSelected,
}: {
  selected: PokemonType
  setSelected: (type: PokemonType) => void
}) {
  return (
    <div className="filter-wrapper">
      <div className="filter-row">
        <div className="filter-label">
          <span>SPECIMEN TYPE /</span>
        </div>

        <div
          className="type-filters"
          role="group"
          aria-label="Filter Pokémon database by type"
        >
          {types.map((type) => {
            const isSelected = selected === type
            return (
              <button
                key={type}
                className={`filter-pill ${isSelected ? 'is-selected' : ''}`}
                onClick={() => setSelected(type)}
                type="button"
              >
                <span className={`filter-dot type-${type}`} />
                <span className="pill-name">{type}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function PokemonCard({
  pokemon,
  onSelect,
}: {
  pokemon: PokemonSummary
  onSelect: (pokemon: PokemonSummary) => void
}) {
  const stat = pokemon.stats?.reduce(
    (best, current) => (current.value > best.value ? current : best),
    pokemon.stats[0]
  )

  const primaryType = pokemon.types[0] || 'normal'

  return (
    <button
      type="button"
      className="pokemon-card"
      onClick={() => onSelect(pokemon)}
      aria-label={`Open field notes for #${pokemon.id.toString().padStart(3, '0')} ${formatName(pokemon.name)}`}
    >
      <div className={`card-art art-${primaryType}`}>
        <div className="card-art-header">
          <span className="card-id">#{pokemon.id.toString().padStart(3, '0')}</span>
          <span className="card-arrow-wrap">
            <ArrowUpRight className="card-arrow" aria-hidden="true" />
          </span>
        </div>

        <div className="card-image-wrap">
          <PokemonImage pokemon={pokemon} />
        </div>
      </div>

      <div className="card-info">
        <div className="card-main">
          <h3 className="card-name">{formatName(pokemon.name)}</h3>
          <div className="type-list">
            {pokemon.types.map((type) => (
              <TypeBadge key={type} type={type} />
            ))}
          </div>
        </div>

        {stat && (
          <div className="card-stat">
            <span className="stat-name">
              {stat.name.replace('special-', 'SP.').toUpperCase()}
            </span>
            <strong className="stat-val">{stat.value}</strong>
          </div>
        )}
      </div>
    </button>
  )
}

function SkeletonGrid({ count = 8 }: { count?: number }) {
  return (
    <div className="pokemon-grid" aria-busy="true" aria-label="Loading specimens...">
      {Array.from({ length: count }).map((_, index) => (
        <div className="skeleton-card" key={index}>
          <div className="skeleton-art" />
          <div className="skeleton-body">
            <div className="skeleton-line title" />
            <div className="skeleton-line subtitle" />
          </div>
        </div>
      ))}
    </div>
  )
}

function Feedback({
  error,
  empty,
  retry,
}: {
  error?: string
  empty?: boolean
  retry?: () => void
}) {
  if (error) {
    return (
      <div className="feedback-box">
        <div className="feedback-kicker">COMMUNICATION INTERRUPTED</div>
        <h2 className="feedback-title">Field record retrieval stalled.</h2>
        <p className="feedback-text">{error}</p>
        {retry && (
          <Button variant="outline" onClick={retry} className="feedback-btn">
            Retry Connection
          </Button>
        )}
      </div>
    )
  }

  if (empty) {
    return (
      <div className="feedback-box">
        <div className="feedback-kicker">ZERO SPECIMENS MATCHED</div>
        <h2 className="feedback-title">No matching records found.</h2>
        <p className="feedback-text">
          No specimens in the current index match your query or filter parameters.
        </p>
      </div>
    )
  }

  return null
}

function DetailModal({
  pokemon,
  onClose,
}: {
  pokemon: PokemonSummary
  onClose: () => void
}) {
  const [details, setDetails] = useState<PokemonDetails | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    fetchPokemonDetails(pokemon.id)
      .then((value) => active && setDetails(value))
      .catch((reason) => {
        if (active) {
          setError(
            reason instanceof Error ? reason.message : 'Could not load specimen details.'
          )
        }
      })

    return () => {
      active = false
    }
  }, [pokemon.id])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose])

  const primaryType = pokemon.types[0] || 'normal'

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        className="detail-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="detail-title"
      >
        <button
          className="modal-close"
          onClick={onClose}
          aria-label="Close field record"
          type="button"
        >
          <X aria-hidden="true" />
        </button>

        {/* Left Side: Specimen Visualization Panel */}
        <div className={`modal-art art-${primaryType}`}>
          <div className="modal-art-tag">
            <span>FIELD SPECIMEN</span>
            <strong>#{pokemon.id.toString().padStart(3, '0')}</strong>
          </div>
          <div className="modal-image-wrap">
            <PokemonImage pokemon={pokemon} className="modal-pokemon-img" />
          </div>
          <div className="modal-art-footer">
            <span>OFFICIAL ARTWORK · POKÉAPI</span>
          </div>
        </div>

        {/* Right Side: Field Record Data */}
        <div className="modal-content">
          <div className="modal-header">
            <div className="modal-meta-row">
              <span className="record-badge">FIELD RECORD NO. #{pokemon.id.toString().padStart(3, '0')}</span>
              <span className="record-classification">GENUS // INDEX</span>
            </div>
            <h2 id="detail-title" className="modal-specimen-name">
              {formatName(pokemon.name)}
            </h2>
            <div className="type-list modal-types">
              {pokemon.types.map((type) => (
                <TypeBadge key={type} type={type} />
              ))}
            </div>
          </div>

          {error ? (
            <Feedback
              error={error}
              retry={() => {
                setError('')
                fetchPokemonDetails(pokemon.id)
                  .then(setDetails)
                  .catch((reason) =>
                    setError(
                      reason instanceof Error
                        ? reason.message
                        : 'Could not load details.'
                    )
                  )
              }}
            />
          ) : !details ? (
            <div className="modal-loading">
              <LoaderCircle className="spin" />
              <span>Fetching field telemetry & stats...</span>
            </div>
          ) : (
            <div className="modal-body">
              {/* Measurements & Traits */}
              <div className="specimen-section">
                <span className="section-label">PHYSICAL MEASUREMENTS</span>
                <div className="quick-facts">
                  <div className="fact-cell">
                    <span className="fact-label">HEIGHT</span>
                    <strong className="fact-value">
                      {details.height ? (details.height / 10).toFixed(1) : '—'} m
                    </strong>
                  </div>

                  <div className="fact-cell">
                    <span className="fact-label">WEIGHT</span>
                    <strong className="fact-value">
                      {details.weight ? (details.weight / 10).toFixed(1) : '—'} kg
                    </strong>
                  </div>

                  <div className="fact-cell span-full">
                    <span className="fact-label">PRIMARY ABILITIES</span>
                    <strong className="fact-value fact-abilities">
                      {details.abilities && details.abilities.length > 0
                        ? details.abilities.join(' · ')
                        : 'Standard'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Notable Moves */}
              {details.moves && details.moves.length > 0 && (
                <div className="specimen-section">
                  <span className="section-label">NOTABLE COMBAT MOVES</span>
                  <div className="moves-grid">
                    {details.moves.slice(0, 10).map((move) => (
                      <span key={move} className="move-chip">
                        {move}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Base Stats */}
              <div className="specimen-section">
                <div className="stats-header">
                  <span className="section-label">BASE STAT ATTRIBUTES</span>
                  <span className="stats-total-label">
                    TOTAL:{' '}
                    <strong>
                      {details.stats?.reduce((sum, s) => sum + s.value, 0) || 0}
                    </strong>
                  </span>
                </div>

                <div className="stats-list">
                  {details.stats?.map((stat) => {
                    const normalized = Math.min((stat.value / 180) * 100, 100)
                    const label = stat.name
                      .replace('special-attack', 'SP. ATK')
                      .replace('special-defense', 'SP. DEF')
                      .toUpperCase()

                    return (
                      <div className="stat-row" key={stat.name}>
                        <span className="stat-label">{label}</span>
                        <div className="stat-track">
                          <div
                            className="stat-fill"
                            style={{ width: `${normalized}%` }}
                          />
                        </div>
                        <strong className="stat-num">{stat.value}</strong>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

export default function Explorer() {
  const [pokemon, setPokemon] = useState<PokemonSummary[]>([])
  const [query, setQuery] = useState('')
  const [selectedType, setSelectedType] = useState<PokemonType>('all')

  const [offset, setOffset] = useState(0)
  const [total, setTotal] = useState(0)

  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState('')
  const [searchError, setSearchError] = useState('')

  const [selected, setSelected] = useState<PokemonSummary | null>(null)

  const load = useCallback(
    async (nextOffset: number, append: boolean) => {
      try {
        if (append) setLoadingMore(true)
        else setLoading(true)

        setError('')

        const page = await fetchPokemonPage(nextOffset)

        setPokemon((current) =>
          append ? [...current, ...page.items] : page.items
        )

        setTotal(page.count)
        setOffset(nextOffset + page.items.length)
      } catch (reason) {
        setError(
          reason instanceof Error
            ? reason.message
            : 'Unable to reach PokéAPI.'
        )
      } finally {
        setLoading(false)
        setLoadingMore(false)
      }
    },
    []
  )

  useEffect(() => {
    load(0, false)
  }, [load])

  // Search using PokéAPI
  useEffect(() => {
    const trimmedQuery = query.trim()

    if (!trimmedQuery) {
      setSearchError('')

      if (selectedType === 'all') {
        load(0, false)
      }

      return
    }

    const timer = window.setTimeout(async () => {
      try {
        setSearching(true)
        setSearchError('')

        const result = await fetchPokemonByName(trimmedQuery)

        setPokemon([result])
        setSelectedType('all')
      } catch {
        setPokemon([])
        setSearchError(
          `Specimen "${trimmedQuery}" was not found in the PokéAPI database.`
        )
      } finally {
        setSearching(false)
      }
    }, 380)

    return () => window.clearTimeout(timer)
  }, [query, load, selectedType])

  // Type filter using PokéAPI
  const handleTypeChange = async (type: PokemonType) => {
    setSelectedType(type)
    setQuery('')
    setSearchError('')
    setError('')

    if (type === 'all') {
      await load(0, false)
      return
    }

    try {
      setLoading(true)

      const results = await fetchPokemonByType(type)

      setPokemon(results)
      setTotal(results.length)
      setOffset(results.length)
    } catch (reason) {
      setPokemon([])
      setError(
        reason instanceof Error
          ? reason.message
          : 'Unable to load Pokémon type.'
      )
    } finally {
      setLoading(false)
    }
  }

  const displayedError = searchError || error

  return (
    <main className="lab-page">
      <Header loaded={pokemon.length} total={total || 1025} />

      <Hero
        query={query}
        setQuery={setQuery}
        loaded={pokemon.length}
        total={total || 1025}
      />

      <section className="collection-section" aria-label="Pokémon specimen collection">
        <TypeFilter
          selected={selectedType}
          setSelected={handleTypeChange}
        />

        <div className="collection-heading-bar">
          <div className="heading-group">
            <p className="eyebrow">
              <span className="eyebrow-accent" /> ARCHIVE SPECIMENS
            </p>
            <h2 className="collection-title">
              {query
                ? `Search: "${query}"`
                : selectedType !== 'all'
                ? `Type: ${selectedType.toUpperCase()}`
                : 'All Recorded Specimens'}
            </h2>
          </div>

          <span className="result-count">
            {pokemon.length} {pokemon.length === 1 ? 'SPECIMEN' : 'SPECIMENS'}
          </span>
        </div>

        {loading || searching ? (
          <SkeletonGrid />
        ) : displayedError && pokemon.length === 0 ? (
          <Feedback
            error={displayedError}
            retry={() => {
              if (searchError) {
                setQuery('')
                load(0, false)
              } else {
                load(0, false)
              }
            }}
          />
        ) : pokemon.length === 0 ? (
          <Feedback empty />
        ) : (
          <>
            <div className="pokemon-grid">
              {pokemon.map((item) => (
                <PokemonCard
                  key={item.id}
                  pokemon={item}
                  onSelect={setSelected}
                />
              ))}
            </div>

            {!query.trim() &&
              selectedType === 'all' &&
              pokemon.length < total && (
                <div className="load-more-section">
                  <Button
                    variant="outline"
                    onClick={() => load(offset, true)}
                    disabled={loadingMore}
                    className="load-more-btn"
                  >
                    {loadingMore && (
                      <LoaderCircle
                        className="spin"
                        data-icon="inline-start"
                      />
                    )}
                    <span>
                      {loadingMore
                        ? 'Fetching next records...'
                        : `Load More Specimens (${pokemon.length} of ${total})`}
                    </span>
                    <ChevronDown data-icon="inline-end" />
                  </Button>
                </div>
              )}
          </>
        )}
      </section>

      {selected && (
        <DetailModal
          pokemon={selected}
          onClose={() => setSelected(null)}
        />
      )}

      <footer className="site-footer">
        <div className="footer-content">
          <div className="footer-brand">
            <strong>POKÉMON EXPLORER</strong>
          </div>
          <div className="footer-meta">
            <span>Data sourced from PokéAPI</span>
          </div>
        </div>
      </footer>
    </main>
  )
}