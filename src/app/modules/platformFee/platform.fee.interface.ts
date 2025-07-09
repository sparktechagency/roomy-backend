
export interface PlatformSettings {
  fees: {
    guest: {
      type: 'flat' | 'percentage';
      value: number;
    };
    host: {
      type: 'flat' | 'percentage';
      value: number;
    };
  };

  updatedAt?: Date;
}
