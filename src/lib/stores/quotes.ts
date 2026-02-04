import { writable } from 'svelte/store';
import { PUBLIC_API_BASE_URL } from '$env/static/public';
import type {
  Accommodation,
  Customer,
  MotoLocation,
  Option,
  QuoteResponseDto,
  TourFormula
} from '$lib/types/api';

export type DevisStatus = 'pending_new' | 'pending_progress' | 'sent' | 'confirmed' | 'cancelled';

export type Devis = {
  apiId: number;
  customerId?: number;
  tourPackageId?: number;
  id: string;
  client: string;
  email: string;
  phone: string;
  circuit: string;
  date: string;
  departureDate?: string;
  returnDate?: string;
  participantCount?: number;
  participants: string[];
  participantsDetails: ParticipantDetail[];
  amount: string;
  amountRaw?: number;
  status: DevisStatus;
  notes: string;
  formule: string;
};

export type ParticipantDetail = {
  name: string;
  moto?: string;
  accommodation?: string;
  options: string[];
  unitPrice: string;
};

type QuotesState = {
  items: Devis[];
  tourFormulas: TourFormula[];
  customers: Customer[];
  motoLocations: MotoLocation[];
  accommodations: Accommodation[];
  options: Option[];
  loading: boolean;
  error: string | null;
};

const API_BASE = PUBLIC_API_BASE_URL || 'http://localhost:3001/api';

const getCustomerLabel = (customer?: Customer) => {
  if (!customer) return 'Client inconnu';
  return `${customer.firstName} ${customer.lastName}`.trim();
};

const formatDate = (value?: string) => {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('fr-FR').format(date);
};

const formatDateRange = (start?: string, end?: string) => {
  if (!start && !end) return '—';
  if (start && end) return `${formatDate(start)} → ${formatDate(end)}`;
  return formatDate(start || end);
};

const formatCurrency = (value?: number) => {
  if (value === undefined || value === null) return '—';
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0
  }).format(value);
};

const mapStatus = (status?: QuoteResponseDto['status']): DevisStatus => {
  switch (status) {
    case 'CONFIRMED':
      return 'confirmed';
    case 'CANCELLED':
      return 'cancelled';
    case 'SENT':
      return 'sent';
    case 'PENDING_PROGRESS':
      return 'pending_progress';
    case 'PENDING_NEW':
    default:
      return 'pending_new';
  }
};

const mapQuoteToDevis = (
  quote: QuoteResponseDto,
  tourFormulaById: Map<number, TourFormula>,
  customersById: Map<number, Customer>,
  motoById: Map<number, MotoLocation>,
  accommodationById: Map<number, Accommodation>,
  optionById: Map<number, Option>
): Devis => {
  const customer = quote.customerId ? customersById.get(quote.customerId) : undefined;
  const tourFormula = quote.tourPackageId ? tourFormulaById.get(quote.tourPackageId) : undefined;
  const items = quote.items ?? [];
  const participantsDetails: ParticipantDetail[] = items.map((item, index) => {
    const name = item.participantName?.trim() || `Participant ${index + 1}`;
    const moto = item.motoLocationId ? motoById.get(item.motoLocationId) : undefined;
    const accommodation = item.accommodationId ? accommodationById.get(item.accommodationId) : undefined;
    const options = (item.options ?? [])
      .map((opt) => optionById.get(opt.optionId)?.name ?? `Option #${opt.optionId}`)
      .filter(Boolean);

    return {
      name,
      moto: moto ? `${moto.brand} ${moto.model} (${moto.motoCategory?.name ?? 'Catégorie'})` : undefined,
      accommodation: accommodation ? accommodation.name : undefined,
      options,
      unitPrice: formatCurrency(item.lockedUnitPrice)
    };
  });

  return {
    apiId: quote.id,
    customerId: quote.customerId,
    tourPackageId: quote.tourPackageId,
    id: quote.quoteNumber ? quote.quoteNumber : `Q-${String(quote.id).padStart(3, '0')}`,
    client: getCustomerLabel(customer),
    email: customer?.email ?? '—',
    phone: customer?.phone ?? '—',
    circuit: tourFormula?.tour?.name ?? '—',
    date: formatDateRange(quote.departureDate, quote.returnDate),
    departureDate: quote.departureDate,
    returnDate: quote.returnDate,
    participantCount: quote.participantCount,
    participants: participantsDetails.map((participant) => participant.name),
    participantsDetails,
    amount: formatCurrency(quote.lockedTotalPrice),
    amountRaw: quote.lockedTotalPrice,
    status: mapStatus(quote.status),
    notes: '',
    formule: tourFormula?.formula?.name ?? '—'
  };
};

const initialState: QuotesState = {
  items: [],
  tourFormulas: [],
  customers: [],
  motoLocations: [],
  accommodations: [],
  options: [],
  loading: false,
  error: null
};

export const quotesStore = writable<QuotesState>(initialState);

export const loadQuotes = async () => {
  quotesStore.update((state) => ({ ...state, loading: true, error: null }));

  try {
    const [quotesRes, tourFormulaRes, customersRes, motoRes, accommodationRes, optionsRes] = await Promise.all([
      fetch(`${API_BASE}/quotes`),
      fetch(`${API_BASE}/tour-formulas`),
      fetch(`${API_BASE}/customers`),
      fetch(`${API_BASE}/moto-locations`),
      fetch(`${API_BASE}/accommodations`),
      fetch(`${API_BASE}/options`)
    ]);

    if (!quotesRes.ok) throw new Error('Erreur chargement devis');
    if (!tourFormulaRes.ok) throw new Error('Erreur chargement formules');
    if (!customersRes.ok) throw new Error('Erreur chargement clients');
    if (!motoRes.ok) throw new Error('Erreur chargement motos');
    if (!accommodationRes.ok) throw new Error('Erreur chargement hébergements');
    if (!optionsRes.ok) throw new Error('Erreur chargement options');

    const quotes = (await quotesRes.json()) as QuoteResponseDto[];
    const tourFormulas = (await tourFormulaRes.json()) as TourFormula[];
    const customers = (await customersRes.json()) as Customer[];
    const motoLocations = (await motoRes.json()) as MotoLocation[];
    const accommodations = (await accommodationRes.json()) as Accommodation[];
    const options = (await optionsRes.json()) as Option[];

    const tourFormulaById = new Map<number, TourFormula>();
    for (const tf of tourFormulas) {
      tourFormulaById.set(tf.id, tf);
    }

    const customersById = new Map<number, Customer>();
    for (const customer of customers) {
      customersById.set(customer.id, customer);
    }

    const motoById = new Map<number, MotoLocation>();
    for (const moto of motoLocations) {
      motoById.set(moto.id, moto);
    }
    const accommodationById = new Map<number, Accommodation>();
    for (const accommodation of accommodations) {
      accommodationById.set(accommodation.id, accommodation);
    }
    const optionById = new Map<number, Option>();
    for (const option of options) {
      optionById.set(option.id, option);
    }

    const items = quotes.map((q) =>
      mapQuoteToDevis(q, tourFormulaById, customersById, motoById, accommodationById, optionById)
    );

    quotesStore.set({
      items,
      tourFormulas,
      customers,
      motoLocations,
      accommodations,
      options,
      loading: false,
      error: null
    });
  } catch (error) {
    quotesStore.set({
      items: [],
      tourFormulas: [],
      customers: [],
      motoLocations: [],
      accommodations: [],
      options: [],
      loading: false,
      error: error instanceof Error ? error.message : 'Erreur chargement devis'
    });
  }
};

export const deleteQuote = async (apiId: number) => {
  if (!Number.isFinite(apiId)) return;

  await fetch(`${API_BASE}/quotes/${apiId}`, { method: 'DELETE' });

  quotesStore.update((state) => ({
    ...state,
    items: state.items.filter((q) => q.apiId !== apiId)
  }));
};

export const updateQuote = async (
  apiId: number,
  payload: {
    customerId?: number;
    tourPackageId?: number;
    departureDate?: string;
    returnDate?: string;
    status?: QuoteResponseDto['status'];
  }
) => {
  if (!Number.isFinite(apiId)) return;

  const res = await fetch(`${API_BASE}/quotes/${apiId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) throw new Error('Erreur mise à jour devis');

  const updated = (await res.json()) as QuoteResponseDto;

  quotesStore.update((state) => {
    const tourFormulaById = new Map<number, TourFormula>();
    for (const tf of state.tourFormulas) {
      tourFormulaById.set(tf.id, tf);
    }
    const customersById = new Map<number, Customer>();
    for (const customer of state.customers) {
      customersById.set(customer.id, customer);
    }
    const motoById = new Map<number, MotoLocation>();
    for (const moto of state.motoLocations) {
      motoById.set(moto.id, moto);
    }
    const accommodationById = new Map<number, Accommodation>();
    for (const accommodation of state.accommodations) {
      accommodationById.set(accommodation.id, accommodation);
    }
    const optionById = new Map<number, Option>();
    for (const option of state.options) {
      optionById.set(option.id, option);
    }

    return {
      ...state,
      items: state.items.map((item) =>
        item.apiId === apiId
          ? mapQuoteToDevis(updated, tourFormulaById, customersById, motoById, accommodationById, optionById)
          : item
      )
    };
  });
};

export const updateCustomer = async (
  customerId: number,
  payload: Partial<Pick<Customer, 'firstName' | 'lastName' | 'email' | 'phone'>>
) => {
  if (!Number.isFinite(customerId)) return;

  const res = await fetch(`${API_BASE}/customers/${customerId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!res.ok) throw new Error('Erreur mise à jour client');

  const updated = (await res.json()) as Customer;

  quotesStore.update((state) => {
    const customers = state.customers.map((customer) =>
      customer.id === customerId ? updated : customer
    );
    const clientLabel = getCustomerLabel(updated);
    const items = state.items.map((item) =>
      item.customerId === customerId
        ? {
            ...item,
            client: clientLabel,
            email: updated.email ?? '—',
            phone: updated.phone ?? '—'
          }
        : item
    );

    return { ...state, customers, items };
  });
};
