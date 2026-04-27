export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          sku: string | null;
          type: string | null;
          name: string;
          brand: string | null;
          sub_model: string | null;
          compatible_units: string[] | null;
          period_month: string | null;
          period_year: number | null;
          critical_stock: number | null;
          created_at: string;
          updated_at: string;
        };
      };
    };
  };
}
