import { create } from "zustand"


interface SitulationsStoreProps {
  situlations: string[]
  setSitulations: (e: string) => void
  clearSitulations: () => void
  deleteSitulations: (e: string) => void
}


export const useSitulations = create<SitulationsStoreProps>((set) => ({
  situlations: [],
  deleteSitulations(e) {
    set((state) => {
      return { situlations: state.situlations.filter(item => item !== e) }
    })
  },
  setSitulations(e) {
    set((state) => {
      const findMatch = state.situlations.find(item => item === e)
      if (!findMatch) {
        const newSitulation = [...state.situlations, e]
        return { situlations: newSitulation }
      }
      return {}
    })

  },
  clearSitulations() {
    set(() => {
      return { situlations: [] }
    })
  },
}))