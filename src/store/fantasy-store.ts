import { create } from 'zustand';
import { F1Driver, F1Constructor } from '@shared/types';
import { FANTASY_BUDGET, REQUIRED_DRIVERS, REQUIRED_CONSTRUCTORS } from '@/lib/f1-data';
interface FantasyState {
  drivers: F1Driver[];
  constructors: F1Constructor[];
  selectedDrivers: Map<string, F1Driver>;
  selectedConstructor: F1Constructor | null;
  remainingBudget: number;
  setInitialData: (drivers: F1Driver[], constructors: F1Constructor[]) => void;
  toggleDriver: (driver: F1Driver) => void;
  selectConstructor: (constructor: F1Constructor) => void;
  clearTeam: () => void;
  recalculateBudget: () => void;
  setTeam: (team: { drivers: F1Driver[], constructor: F1Constructor | null }) => void;
}
export const useFantasyStore = create<FantasyState>((set, get) => ({
  drivers: [],
  constructors: [],
  selectedDrivers: new Map(),
  selectedConstructor: null,
  remainingBudget: FANTASY_BUDGET,
  setInitialData: (drivers, constructors) => {
    set({ drivers, constructors });
  },
  setTeam: ({ drivers, constructor: constructorToSet }) => {
    const selectedDriversMap = new Map<string, F1Driver>();
    drivers.forEach(d => selectedDriversMap.set(d.id, d));
    set({
      selectedDrivers: selectedDriversMap,
      selectedConstructor: constructorToSet,
    });
    get().recalculateBudget();
  },
  toggleDriver: (driver) => {
    set((state) => {
      const newSelectedDrivers = new Map(state.selectedDrivers);
      if (newSelectedDrivers.has(driver.id)) {
        newSelectedDrivers.delete(driver.id);
      } else {
        if (newSelectedDrivers.size < REQUIRED_DRIVERS) {
          newSelectedDrivers.set(driver.id, driver);
        }
      }
      return { selectedDrivers: newSelectedDrivers };
    });
    get().recalculateBudget();
  },
  selectConstructor: (constructor) => {
    set((state) => {
      if (state.selectedConstructor?.id === constructor.id) {
        return { selectedConstructor: null };
      }
      return { selectedConstructor: constructor };
    });
    get().recalculateBudget();
  },
  clearTeam: () => {
    set({
      selectedDrivers: new Map(),
      selectedConstructor: null,
      remainingBudget: FANTASY_BUDGET,
    });
  },
  recalculateBudget: () => {
    set((state) => {
      const driverCost = Array.from(state.selectedDrivers.values()).reduce((acc, d) => acc + d.price, 0);
      const constructorCost = state.selectedConstructor?.price || 0;
      const totalCost = driverCost + constructorCost;
      return { remainingBudget: FANTASY_BUDGET - totalCost };
    });
  },
}));