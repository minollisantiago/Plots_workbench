import { create, StateCreator } from 'zustand';
import { TimeSeriesData } from '@/components/plots/models';
import { persist, createJSONStorage, PersistOptions, PersistStorage } from 'zustand/middleware';

interface TimeSeriesRespose {
  series: TimeSeriesData[];
};

interface DataStore {
  data: TimeSeriesData[] | null;
  error: string | null;
  loading: boolean;
  fetchData: () => Promise<void>;
};

// Define the type for the persist middleware
type DataStorePersist = (
  config: StateCreator<DataStore>,
  options: PersistOptions<DataStore, Partial<DataStore> & PersistStorage<DataStore>>
) => StateCreator<DataStore>

export const useDataStore = create<DataStore>()(
  (persist as DataStorePersist)(
    (set) => ({
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
    }),
    {
      name: 'data-store',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
