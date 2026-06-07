import { useEffect, useState } from 'react'
import { ChefHat, Clock, Flame, RotateCcw, Plus, Check, ChevronLeft } from 'lucide-react'
import { WireframeLayout } from '../WireframeLayout'
import { WireframeCard } from '../components'
import {
  getRecipeConfig,
  getRecipeSuggestions,
  getRecipe,
  type DietOption,
  type MealSummary,
  type Recipe,
} from '../../services/api'

type Step = 'diet' | 'allergies' | 'meals' | 'recipe'

export function RecipePage() {
  const [step, setStep] = useState<Step>('diet')

  // Config sourced from the backend (data/recipe/meals.json)
  const [dietOptions, setDietOptions] = useState<DietOption[]>([])
  const [commonAllergies, setCommonAllergies] = useState<string[]>([])
  const [configError, setConfigError] = useState(false)

  // User selections
  const [diet, setDiet] = useState<string | null>(null)
  const [allergies, setAllergies] = useState<string[]>([])
  const [customAllergy, setCustomAllergy] = useState('')

  // Results
  const [meals, setMeals] = useState<MealSummary[]>([])
  const [mealsLoading, setMealsLoading] = useState(false)
  const [moreLoading, setMoreLoading] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [recipe, setRecipe] = useState<Recipe | null>(null)
  const [recipeLoading, setRecipeLoading] = useState(false)

  // Load diet/allergy config once
  useEffect(() => {
    let cancelled = false
    getRecipeConfig()
      .then((cfg) => {
        if (cancelled) return
        setDietOptions(cfg.diet_options)
        setCommonAllergies(cfg.common_allergies)
      })
      .catch(() => {
        if (!cancelled) setConfigError(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const toggleAllergy = (a: string) => {
    setAllergies((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]))
  }

  const addCustomAllergy = () => {
    const value = customAllergy.trim()
    if (value && !allergies.includes(value)) setAllergies((prev) => [...prev, value])
    setCustomAllergy('')
  }

  const fetchMeals = async () => {
    if (!diet) return
    setStep('meals')
    setMealsLoading(true)
    setHasMore(false)
    try {
      const res = await getRecipeSuggestions(diet, allergies, 0)
      setMeals(res.meals)
      setHasMore(res.has_more)
    } catch {
      setMeals([])
    } finally {
      setMealsLoading(false)
    }
  }

  const loadMoreMeals = async () => {
    if (!diet) return
    setMoreLoading(true)
    try {
      const res = await getRecipeSuggestions(diet, allergies, meals.length)
      // De-dupe defensively in case the catalogue overlaps
      setMeals((prev) => {
        const seen = new Set(prev.map((m) => m.id))
        return [...prev, ...res.meals.filter((m) => !seen.has(m.id))]
      })
      setHasMore(res.has_more)
    } catch {
      setHasMore(false)
    } finally {
      setMoreLoading(false)
    }
  }

  const openRecipe = async (mealId: string) => {
    setStep('recipe')
    setRecipeLoading(true)
    setRecipe(null)
    try {
      setRecipe(await getRecipe(mealId))
    } catch {
      setRecipe(null)
    } finally {
      setRecipeLoading(false)
    }
  }

  const reset = () => {
    setStep('diet')
    setDiet(null)
    setAllergies([])
    setCustomAllergy('')
    setMeals([])
    setHasMore(false)
    setRecipe(null)
  }

  return (
    <WireframeLayout title="Recipes" showBack>
      {/* Chatbot voice bubble */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'flex-start' }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--wf-rose-500, #e11d68)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <ChefHat size={20} color="#fff" />
        </div>
        <div style={{ background: 'var(--wf-gray-100)', borderRadius: '4px 16px 16px 16px', padding: '12px 14px', fontSize: 14, color: 'var(--wf-gray-700)', lineHeight: 1.5 }}>
          {step === 'diet' && "Hi! I'm your recipe helper. What kind of meals are you looking for?"}
          {step === 'allergies' && 'Got it! Do you have any allergies I should avoid? Pick from the list or type your own.'}
          {step === 'meals' && `Here are some ${diet?.toLowerCase()} meals${allergies.length ? ' that avoid your allergies' : ''}. Tap one to see the recipe — or tap "Show more meals" if none appeal.`}
          {step === 'recipe' && (recipe ? `Great choice! Here's how to make ${recipe.name}.` : 'Fetching your recipe…')}
        </div>
      </div>

      {configError && (
        <WireframeCard>
          <p style={{ fontSize: 14, color: 'var(--wf-gray-500)' }}>
            Couldn't load recipes right now. Please make sure the server is running and try again.
          </p>
        </WireframeCard>
      )}

      {/* STEP 1 — Diet preference */}
      {step === 'diet' && !configError && (
        <WireframeCard title="Choose a preference">
          {dietOptions.length === 0 ? (
            <p style={{ fontSize: 14, color: 'var(--wf-gray-500)' }}>Loading options…</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {dietOptions.map((opt) => (
                <button
                  key={opt.value}
                  className="wf-feature-card"
                  style={{ display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left', cursor: 'pointer', border: 'none', width: '100%' }}
                  onClick={() => {
                    setDiet(opt.value)
                    setStep('allergies')
                  }}
                >
                  <span style={{ fontSize: 28 }}>{opt.emoji}</span>
                  <div>
                    <div className="feature-title">{opt.value}</div>
                    <div className="feature-desc">{opt.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </WireframeCard>
      )}

      {/* STEP 2 — Allergies */}
      {step === 'allergies' && (
        <WireframeCard title="Any allergies?">
          <label className="wf-label">Common allergies</label>
          <div className="wf-bubbles" style={{ marginBottom: 16 }}>
            {commonAllergies.map((a) => (
              <button key={a} className={`wf-bubble ${allergies.includes(a) ? 'selected' : ''}`} onClick={() => toggleAllergy(a)}>
                {allergies.includes(a) && <Check size={14} style={{ marginRight: 4 }} />}
                {a}
              </button>
            ))}
          </div>

          <label className="wf-label">Add your own</label>
          <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
            <input
              className="wf-input"
              style={{ flex: 1 }}
              placeholder="e.g. Sesame"
              value={customAllergy}
              onChange={(e) => setCustomAllergy(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') addCustomAllergy()
              }}
            />
            <button className="wf-btn wf-btn-secondary" onClick={addCustomAllergy} disabled={!customAllergy.trim()}>
              <Plus size={18} />
            </button>
          </div>

          {allergies.length > 0 && (
            <div className="wf-bubbles" style={{ marginBottom: 16 }}>
              {allergies.map((a) => (
                <button key={a} className="wf-bubble selected" onClick={() => toggleAllergy(a)}>
                  {a} ✕
                </button>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', gap: 8 }}>
            <button className="wf-btn wf-btn-secondary" style={{ flex: 1 }} onClick={() => { setAllergies([]); fetchMeals() }}>
              No allergies
            </button>
            <button className="wf-btn wf-btn-primary" style={{ flex: 1 }} onClick={fetchMeals}>
              Show meals
            </button>
          </div>
          <button
            className="wf-btn wf-btn-outline wf-btn-full"
            style={{ marginTop: 8 }}
            onClick={() => setStep('diet')}
          >
            <ChevronLeft size={16} /> Change meal preference
          </button>
        </WireframeCard>
      )}

      {/* STEP 3 — Meal options */}
      {step === 'meals' && (
        <>
          {mealsLoading ? (
            <WireframeCard>
              <p style={{ fontSize: 14, color: 'var(--wf-gray-500)' }}>Finding meals for you…</p>
            </WireframeCard>
          ) : meals.length === 0 ? (
            <WireframeCard title="No matches">
              <p style={{ fontSize: 14, color: 'var(--wf-gray-500)', marginBottom: 16 }}>
                We couldn't find meals matching all your filters. Try removing an allergy.
              </p>
              <button className="wf-btn wf-btn-secondary wf-btn-full" onClick={() => setStep('allergies')}>
                Edit allergies
              </button>
            </WireframeCard>
          ) : (
            meals.map((meal) => (
              <WireframeCard key={meal.id} className="wf-feature-card" style={{ cursor: 'pointer' }}>
                <button
                  style={{ all: 'unset', cursor: 'pointer', display: 'block', width: '100%' }}
                  onClick={() => openRecipe(meal.id)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 34 }}>{meal.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 15, color: 'var(--wf-gray-700)' }}>{meal.name}</div>
                      <div style={{ fontSize: 13, color: 'var(--wf-gray-500)', marginTop: 2 }}>{meal.desc}</div>
                      <div style={{ display: 'flex', gap: 14, marginTop: 8, fontSize: 12, color: 'var(--wf-gray-500)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={13} /> {meal.time}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Flame size={13} /> {meal.calories} cal</span>
                      </div>
                    </div>
                  </div>
                </button>
              </WireframeCard>
            ))
          )}
          {!mealsLoading && meals.length > 0 && (
            hasMore ? (
              <button className="wf-btn wf-btn-primary wf-btn-full" style={{ marginTop: 8 }} disabled={moreLoading} onClick={loadMoreMeals}>
                {moreLoading ? 'Loading…' : 'Show more meals'}
              </button>
            ) : (
              <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--wf-gray-500)', marginTop: 12 }}>
                That's every {diet?.toLowerCase()} meal we have for these filters.
              </p>
            )
          )}
          {!mealsLoading && (
            <button className="wf-btn wf-btn-secondary wf-btn-full" style={{ marginTop: 8 }} onClick={() => setStep('allergies')}>
              Back to allergies
            </button>
          )}
        </>
      )}

      {/* STEP 4 — Recipe */}
      {step === 'recipe' && (
        <>
          {recipeLoading || !recipe ? (
            <WireframeCard>
              <p style={{ fontSize: 14, color: 'var(--wf-gray-500)' }}>Loading recipe…</p>
            </WireframeCard>
          ) : (
            <>
              <WireframeCard>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 40 }}>{recipe.emoji}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 17, color: 'var(--wf-gray-700)' }}>{recipe.name}</div>
                    <div style={{ display: 'flex', gap: 14, marginTop: 4, fontSize: 12, color: 'var(--wf-gray-500)' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={13} /> {recipe.time}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Flame size={13} /> {recipe.calories} cal</span>
                    </div>
                  </div>
                </div>
              </WireframeCard>

              <WireframeCard title="Ingredients">
                <ul style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {recipe.ingredients.map((ing) => (
                    <li key={ing} style={{ fontSize: 14, color: 'var(--wf-gray-700)', lineHeight: 1.4 }}>{ing}</li>
                  ))}
                </ul>
              </WireframeCard>

              <WireframeCard title="Method">
                <ol style={{ margin: 0, paddingLeft: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {recipe.steps.map((s, i) => (
                    <li key={i} style={{ fontSize: 14, color: 'var(--wf-gray-700)', lineHeight: 1.5 }}>{s}</li>
                  ))}
                </ol>
              </WireframeCard>
            </>
          )}

          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <button className="wf-btn wf-btn-secondary" style={{ flex: 1 }} onClick={() => setStep('meals')}>
              Other meals
            </button>
            <button className="wf-btn wf-btn-primary" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }} onClick={reset}>
              <RotateCcw size={16} /> Start over
            </button>
          </div>
        </>
      )}

      {/* Persistent summary of the user's choices */}
      {diet && (
        <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--wf-gray-100)' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--wf-gray-500)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 10 }}>
            Your choices
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: 'var(--wf-gray-500)', minWidth: 72 }}>Preference</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 10px', background: 'var(--wf-gray-100)', borderRadius: 999, fontSize: 13, color: 'var(--wf-gray-700)', fontWeight: 500 }}>
              {dietOptions.find((o) => o.value === diet)?.emoji} {diet}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
            <span style={{ fontSize: 12, color: 'var(--wf-gray-500)', minWidth: 72, paddingTop: 4 }}>Allergies</span>
            {allergies.length > 0 ? (
              <span style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {allergies.map((a) => (
                  <span key={a} style={{ padding: '4px 10px', background: '#fef2f2', color: '#991b1b', borderRadius: 999, fontSize: 13, fontWeight: 500 }}>
                    {a}
                  </span>
                ))}
              </span>
            ) : (
              <span style={{ fontSize: 13, color: 'var(--wf-gray-500)', paddingTop: 4 }}>None mentioned</span>
            )}
          </div>
        </div>
      )}
    </WireframeLayout>
  )
}
