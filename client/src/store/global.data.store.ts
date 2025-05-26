import { create } from 'zustand';
import { TimeSeriesData } from '@/components/plots/models';

interface TimeSeriesRespose {
  series: TimeSeriesData[];
};

interface DataStore {
  data: TimeSeriesData[] | null;
  error: string | null;
  loading: boolean;
  fetchData: () => Promise<void>;
};

export const useDataStore = create<DataStore>((set) => ({
  data: null,
  error: null,
  loading: false,

  fetchData: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("http://127.0.0.1:8000/bdtest");
      if (!response.ok) throw new Error(`Http error! status: ${response.status}`);
      const responseData: TimeSeriesRespose = await response.json();
      set({ data: responseData.series });
    } catch (err: any) {
      set({ error: err.message || 'Cannot reach server', data: null });
      console.error(err);
    } finally {
      set({ loading: false });
    }
  },
}));
