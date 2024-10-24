import { create } from 'zustand'
import { UserDetailType } from '../types/authenticate'
import { useMemo } from 'react'
import { immer } from 'zustand/middleware/immer'
import { GetCurrentUserDetail, LogoutUser } from '../actions/authenticate'
import { toast } from 'sonner'
import { getAuthenticateSession } from '../authenticate'

type State = {
  userDetail: UserDetailType | null,
  loading: boolean,
}

type Computeds = {
  isLogin: () => boolean

}
type Actions = {
  SetLoading: (value?: boolean) => void
  UpdateUserDetail: (data: Partial<UserDetailType>) => void
  GetUserDetail: () => Promise<void>
  Logout: () => Promise<void>
}

export const useAuthenticateStore = create<State & Actions & Computeds>()(
  immer((set, get) => ({
    // State
    userDetail: null,
    loading: true,

    // Computed Properties
    isLogin: () => get().userDetail !== null,

    // Actions - Setters
    SetLoading: (value?: boolean) =>
      set((state) => {
        state.loading = value ?? !state.loading
      }),
    UpdateUserDetail: (data: Partial<UserDetailType>) =>
      set((state) => {
        if (state.userDetail) {
          Object.assign(state.userDetail, data)
        } else {
          state.userDetail = { ...data } as UserDetailType
        }
      }),

    GetUserDetail: async () => {

      set((state) => {
        state.loading = true
      })  // Set loading to true initially


      const result = await GetCurrentUserDetail()

      if (result.message)
        toast(result.message)
      if (result.success) {
        set((state) => {
          state.userDetail = result.data
        })
      }
      set((state) => {
        state.loading = false  // Set loading to false after fetching
      })
    },
    Logout: async () => {
      set((state) => {
        state.loading = true
      })  // Set loading to true initially

      const result = await LogoutUser()

      if (result.message)
        toast(result.message)
      if (result.success) {
        set((state) => {
          state.userDetail = null
        })
      }
      set((state) => {
        state.loading = false  // Set loading to false after fetching
      })
    },
  })),
)
