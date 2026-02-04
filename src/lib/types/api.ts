export enum QuoteStatus {
  PendingNew = 'PENDING_NEW',
  PendingProgress = 'PENDING_PROGRESS',
  Sent = 'SENT',
  Confirmed = 'CONFIRMED',
  Cancelled = 'CANCELLED'
}

export enum OptionTargetType {
  QuoteItem = 'QUOTE_ITEM',
  Quote = 'QUOTE'
}

export type Option = {
  id: number;
  name: string;
  price?: number;
  targetType?: OptionTargetType;
};

export type Formula = {
  id: number;
  name: string;
  includesMoto?: boolean;
  includesAccommodation?: boolean;
  includesMeals?: boolean;
};

export type Tour = {
  id: number;
  name: string;
  country: string;
  durationDays?: number;
  description?: string;
};

export type TourFormula = {
  id: number;
  tour: Tour;
  formula: Formula;
  isActive?: boolean;
};

export type Accommodation = {
  id: number;
  name: string;
  city?: string;
  country?: string;
  type?: string;
};

export type MotoCategory = {
  id: number;
  name: string;
};

export type MotoLocation = {
  id: number;
  motoCategory: MotoCategory;
  brand: string;
  model: string;
  count: number;
};

export type Customer = {
  id: number;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
};

export type QuoteItemOptionResponseDto = {
  id: number;
  quoteItemId: number;
  optionId: number;
  quantity?: number;
  lockedPrice?: number;
};

export type QuoteItemResponseDto = {
  id: number;
  quoteId: number;
  participantName?: string;
  motoLocationId?: number | null;
  accommodationId?: number;
  lockedUnitPrice?: number;
  options?: QuoteItemOptionResponseDto[];
};

export type QuoteResponseDto = {
  id: number;
  quoteNumber?: string;
  createdAt?: string;
  departureDate?: string;
  returnDate?: string;
  customerId?: number;
  tourPackageId?: number;
  participantCount?: number;
  lockedTotalPrice?: number;
  status?: QuoteStatus;
  items?: QuoteItemResponseDto[];
};
