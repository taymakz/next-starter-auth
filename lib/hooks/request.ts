// import { ApiResponseType } from "../types/response";
// import { cookies } from "next/headers";

// function getTokens(): {
//   access: string
//   refresh: string
// } | null {
//   const tokens = localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')!) : null;
//   return tokens

// }
// export async function useFetchApi<T>(url: string, config?: any): Promise<ApiResponseType<T>> {
//   config = {
//     method: 'GET',
//     baseURL: `${process.env.NEXT_PUBLIC_BASE_API}/api`,
//     ...config,
//   }
//   const tokens = getTokens()
//   function setTokenOnHeader() {
//     if (tokens) {
//       config.headers = {
//         Authorization: `Bearer ${tokens.access}`,
//       }
//     }
//   }
//   setTokenOnHeader()
//   try {
//     return (await fetch(url, config)).json()
//   } catch (error: any) {
//     if (error.status === 401 && tokens) {
//       await refreshToken()
//       setTokenOnHeader()
//     }

//   }
// }
// export async function refreshToken() {
//   const tokens = getTokens()

//   let response
//   do {
//     try {
//       response = await fetch(
//         `${process.env.NEXT_PUBLIC_BASE_API}}/api/user/token/refresh/`,
//         {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({
//             refresh: tokens?.refresh,
//           }),
//         },
//       )
//       const result = await response.json()
//       if (response.status === 200) {
//         const newTokens = {
//           refresh: tokens?.refresh,
//           access: result.access
//         }
//         localStorage.setItem('authTokens', JSON.stringify(newTokens))
//       } else if (response.status === 401) {
//         localStorage.removeItem('authTokens')
//       }
//       else {
//         // Handle other status codes or unexpected errors
//         console.error('Token refresh failed with status:', response.status)
//         break // Exit the loop in case of unexpected errors
//       }
//     } catch (error) {
//       console.error('Error during token refresh:', error)
//       // Add a delay before retrying (e.g., using setTimeout)
//       await new Promise(resolve => setTimeout(resolve, 1000)) // 1 second delay
//     }
//   } while (
//     response!.status !== 200
//     && response!.statusText !== 'Unauthorized'
//     && response!.status !== 401
//   )

// }
