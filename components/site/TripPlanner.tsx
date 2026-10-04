

import { useState } from 'react';
import { useLocale } from '@/components/LocaleProvider';
import { copy } from '@/lib/i18n';

const rawInterests = [
  'Wildlife',
  'Nature',
  'Adventure',
  'Food',
  'Culture',
  'Photography',
  'Beach',
  'City',
  'Luxury',
  'Shopping',
  'Relaxation',
  'Romance',
];

const rawDestinations = [
  'Nairobi',
  'Maasai Mara',
  'Amboseli',
  'Naivasha',
  'Mombasa',
  'Diani',
  'Lamu',
  'Watamu',
  'Mount Kenya',
  'Tsavo',
];

const interestTranslations: Record<string, string> = {
  Wildlife: 'Faune',
  Nature: 'Nature',
  Adventure: 'Aventure',
  Food: 'Gastronomie',
  Culture: 'Culture',
  Photography: 'Photographie',
  Beach: 'Plage',
  City: 'Ville',
  Luxury: 'Luxe',
  Shopping: 'Shopping',
  Relaxation: 'Détente',
  Romance: 'Romance',
};

type Data = {
  arrival: string;
  departure: string;
  travelers: string;
  travelingWith: string;
  interests: string[];
  destinations: string[];
  notes: string;
  name: string;
  email: string;
  website: string;
};

export default function TripPlanner() {
  const { locale } = useLocale();
  const t = copy[locale].tripPlanner;
  const isFr = locale === 'fr';

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const [data, setData] = useState<Data>({
    arrival: '',
    departure: '',
    travelers: '',
    travelingWith: '',
    interests: [],
    destinations: [],
    notes: '',
    name: '',
    email: '',
    website: '',
  });

  const toggle = (
    key: 'interests' | 'destinations',
    value: string
  ) => {
    setData((current) => ({
      ...current,
      [key]: current[key].includes(value)
        ? current[key].filter((item) => item !== value)
        : [...current[key], value],
    }));

    setMessage('');
  };

  const next = () => {
    setMessage('');

    // STEP 1 — Travel details
    if (step === 1) {
      if (!data.arrival || !data.departure || !data.travelers) {
        return setMessage(t.validationDates);
      }

      if (data.departure < data.arrival) {
        return setMessage(
          isFr
            ? "La date de départ ne peut pas être avant la date d'arrivée."
            : 'Departure date cannot be before arrival date.'
        );
      }
    }

    // STEP 2 — Interests
    if (step === 2) {
      if (data.interests.length === 0) {
        return setMessage(t.validationInterests);
      }
    }

    // STEP 3 — Destinations
    if (step === 3) {
      if (data.destinations.length === 0) {
        return setMessage(
          isFr
            ? 'Veuillez sélectionner au moins une destination ou choisir « Recommandez-moi une destination ».'
            : 'Please select at least one destination, or choose "Recommend something for me".'
        );
      }
    }

    setStep((current) => Math.min(current + 1, 4));
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();

    setMessage('');

    // Final validation before sending
    if (!data.name.trim()) {
      return setMessage(t.validationContact);
    }

    if (!/^\S+@\S+\.\S+$/.test(data.email.trim())) {
      return setMessage(t.validationContact);
    }

    if (!data.arrival || !data.departure) {
      return setMessage(t.validationDates);
    }

    if (data.departure < data.arrival) {
      return setMessage(
        isFr
          ? "La date de départ ne peut pas être avant la date d'arrivée."
          : 'Departure date cannot be before arrival date.'
      );
    }

    if (!data.travelers) {
      return setMessage(t.validationDates);
    }

    if (!Array.isArray(data.interests) || data.interests.length === 0) {
      return setMessage(t.validationInterests);
    }

    if (
      !Array.isArray(data.destinations) ||
      data.destinations.length === 0
    ) {
      return setMessage(
        isFr
          ? 'Veuillez sélectionner au moins une destination ou choisir « Recommandez-moi une destination ».'
          : 'Please select at least one destination, or choose "Recommend something for me".'
      );
    }

    setSubmitting(true);

    try {
      // Create an explicit payload rather than sending the entire React state.
      const payload = {
        name: data.name.trim(),
        email: data.email.trim(),
        arrival: data.arrival,
        departure: data.departure,
        travelers: data.travelers,
        travelingWith: data.travelingWith.trim() || null,

        // Always send interests as an array.
        interests: Array.isArray(data.interests)
          ? data.interests.filter(Boolean)
          : [],

        // Always send destinations as an array.
        destinations: Array.isArray(data.destinations)
          ? data.destinations.filter(Boolean)
          : [],

        notes: data.notes.trim() || null,

        // Honeypot field.
        website: data.website,
      };

      console.log('[TripPlanner] submitting payload:', payload);

      const response = await fetch('/api/trip-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        const field = result?.field || result?._debug?.failField;

        console.error(
          '[TripPlanner] API validation error:',
          {
            status: response.status,
            field,
            result,
          }
        );

        throw new Error(
          field
            ? `${result?.error || t.errorMessage} (${field})`
            : result?.error || t.errorMessage
        );
      }

      console.log('[TripPlanner] request submitted successfully');

      setMessage(t.successMessage);

      // Reset the form after successful submission.
      setData({
        arrival: '',
        departure: '',
        travelers: '',
        travelingWith: '',
        interests: [],
        destinations: [],
        notes: '',
        name: '',
        email: '',
        website: '',
      });

      setStep(1);
    } catch (error) {
      console.error('[TripPlanner] submission failed:', error);

      setMessage(
        error instanceof Error
          ? error.message
          : t.errorMessage
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="border border-sandBeige bg-white p-5 shadow-sm md:p-8"
    >
      {/* Honeypot */}
      <input
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        name="website"
        value={data.website}
        onChange={(event) =>
          setData({
            ...data,
            website: event.target.value,
          })
        }
      />

      {/* Progress */}
      <div
        className="mb-8 flex gap-1"
        aria-label={`${t.stepLabel} ${step} ${t.ofLabel} 4`}
      >
        {[1, 2, 3, 4].map((number) => (
          <div
            key={number}
            className={`h-1 flex-1 transition-colors duration-300 ${number <= step
              ? 'bg-softGold'
              : 'bg-sandBeige'
              }`}
          />
        ))}
      </div>

      <p className="eyebrow">
        {t.stepLabel} {step} {t.ofLabel} 4
      </p>

      {/* STEP 1 */}
      {step === 1 && (
        <>
          <h2 className="mt-2 font-heading text-3xl text-forestGreen">
            {t.step1Title}
          </h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium">
              {t.arrivalLabel}

              <input
                required
                type="date"
                value={data.arrival}
                onChange={(event) => {
                  const arrival = event.target.value;

                  setData((current) => ({
                    ...current,
                    arrival,

                    // Automatically clear an invalid departure date.
                    departure:
                      current.departure &&
                        current.departure < arrival
                        ? ''
                        : current.departure,
                  }));

                  setMessage('');
                }}
                className="mt-1 w-full border border-sandBeige p-3 outline-none focus:border-forestGreen"
              />
            </label>

            <label className="text-sm font-medium">
              {t.departureLabel}

              <input
                required
                type="date"
                min={data.arrival || undefined}
                value={data.departure}
                onChange={(event) => {
                  setData({
                    ...data,
                    departure: event.target.value,
                  });

                  setMessage('');
                }}
                className="mt-1 w-full border border-sandBeige p-3 outline-none focus:border-forestGreen"
              />
            </label>

            <label className="text-sm font-medium">
              {t.travelersLabel}

              <select
                required
                value={data.travelers}
                onChange={(event) =>
                  setData({
                    ...data,
                    travelers: event.target.value,
                  })
                }
                className="mt-1 w-full border border-sandBeige bg-white p-3 outline-none focus:border-forestGreen"
              >
                <option value="">
                  {t.selectOption}
                </option>

                {['1', '2', '3-4', '5-8', '9+'].map(
                  (item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  )
                )}
              </select>
            </label>

            <label className="text-sm font-medium">
              {t.travelingWithLabel}

              <select
                value={data.travelingWith}
                onChange={(event) =>
                  setData({
                    ...data,
                    travelingWith: event.target.value,
                  })
                }
                className="mt-1 w-full border border-sandBeige bg-white p-3 outline-none focus:border-forestGreen"
              >
                <option value="">
                  {t.selectOption}
                </option>

                {t.travelingWithOptions.map(
                  (item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  )
                )}
              </select>
            </label>
          </div>
        </>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <>
          <h2 className="mt-2 font-heading text-3xl text-forestGreen">
            {t.step2Title}
          </h2>

          <p className="mt-2 text-sm text-charcoal/75">
            {t.step2Desc}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {rawInterests.map((item) => {
              const label = isFr
                ? interestTranslations[item] ?? item
                : item;

              const selected =
                data.interests.includes(item);

              return (
                <button
                  type="button"
                  key={item}
                  onClick={() =>
                    toggle('interests', item)
                  }
                  aria-pressed={selected}
                  className={`border p-3 text-left text-sm transition ${selected
                    ? 'border-forestGreen bg-forestGreen text-white'
                    : 'border-sandBeige hover:border-forestGreen'
                    }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <>
          <h2 className="mt-2 font-heading text-3xl text-forestGreen">
            {t.step3Title}
          </h2>

          <button
            type="button"
            onClick={() =>
              toggle(
                'destinations',
                'Recommend something for me'
              )
            }
            aria-pressed={data.destinations.includes(
              'Recommend something for me'
            )}
            className={`mt-5 w-full border p-4 text-left text-sm transition ${data.destinations.includes(
              'Recommend something for me'
            )
              ? 'border-forestGreen bg-forestGreen text-white'
              : 'border-softGold bg-warmIvory'
              }`}
          >
            {t.recommendDestination}
          </button>

          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {rawDestinations.map((item) => {
              const selected =
                data.destinations.includes(item);

              return (
                <button
                  type="button"
                  key={item}
                  onClick={() =>
                    toggle('destinations', item)
                  }
                  aria-pressed={selected}
                  className={`border p-3 text-left text-sm transition ${selected
                    ? 'border-forestGreen bg-forestGreen text-white'
                    : 'border-sandBeige hover:border-forestGreen'
                    }`}
                >
                  {item}
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* STEP 4 */}
      {step === 4 && (
        <>
          <h2 className="mt-2 font-heading text-3xl text-forestGreen">
            {t.step4Title}
          </h2>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium">
              {t.nameLabel}

              <input
                required
                value={data.name}
                onChange={(event) =>
                  setData({
                    ...data,
                    name: event.target.value,
                  })
                }
                className="mt-1 w-full border border-sandBeige p-3 outline-none focus:border-forestGreen"
              />
            </label>

            <label className="text-sm font-medium">
              {t.emailLabel}

              <input
                required
                type="email"
                value={data.email}
                onChange={(event) =>
                  setData({
                    ...data,
                    email: event.target.value,
                  })
                }
                className="mt-1 w-full border border-sandBeige p-3 outline-none focus:border-forestGreen"
              />
            </label>
          </div>

          <label className="mt-4 block text-sm font-medium">
            {t.notesLabel}

            <textarea
              value={data.notes}
              onChange={(event) =>
                setData({
                  ...data,
                  notes: event.target.value,
                })
              }
              className="mt-1 min-h-32 w-full border border-sandBeige p-3 outline-none focus:border-forestGreen"
            />
          </label>
        </>
      )}

      {/* Message */}
      {message && (
        <p
          role="status"
          aria-live="polite"
          className="mt-5 text-sm font-medium text-forestGreen"
        >
          {message}
        </p>
      )}

      {/* Navigation */}
      <div className="mt-8 flex justify-between">
        {step > 1 ? (
          <button
            type="button"
            onClick={() => {
              setMessage('');
              setStep((current) => current - 1);
            }}
            className="border border-forestGreen px-5 py-3 text-sm font-semibold text-forestGreen transition hover:bg-forestGreen/5"
          >
            {t.backBtn}
          </button>
        ) : (
          <span />
        )}

        {step < 4 ? (
          <button
            type="button"
            onClick={next}
            className="bg-forestGreen px-5 py-3 text-sm font-semibold text-white transition hover:bg-darkForest"
          >
            {t.continueBtn}
          </button>
        ) : (
          <button
            type="submit"
            disabled={submitting}
            className="bg-forestGreen px-5 py-3 text-sm font-semibold text-white transition hover:bg-darkForest disabled:opacity-60"
          >
            {submitting
              ? t.sendingBtn
              : t.submitBtn}
          </button>
        )}
      </div>

    </form>
  );
}