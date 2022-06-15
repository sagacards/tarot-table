import create from 'zustand';

(window as any).global = window;

const useStore = create<Store>(set => ({
    // Global loader
    loading: false,
    setLoading: l => set(state => ({ loading: l })),
    loadingProgress: 0,
    setLoadingProgress: p => set(state => ({ loadingProgress: p })),
}));

export default useStore;

interface Store {
    loading: boolean;
    setLoading: (l: boolean) => void;
    loadingProgress: number;
    setLoadingProgress: (p: number) => void;
}
