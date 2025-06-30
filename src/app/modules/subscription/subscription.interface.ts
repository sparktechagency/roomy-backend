export type ValidityType = 'monthly' | 'yearly';
export type RootType = 'carOwner' | 'business';

export interface ISubscription {
  title: string;
  price: number;
  priceId: string,
  root: RootType;
  validity: {
    type: ValidityType;
    value: number;
    isRecurring: boolean;
  };
  features: string[];
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
