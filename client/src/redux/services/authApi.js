import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}/api/auth`,
  }),
  endpoints: (builder) => ({
    getNonce: builder.mutation({
      query: (address) => ({
        url: "/nonce",
        method: "POST",
        body: { address },
      }),
      transformResponse: (response) => response.nonce,
    }),
    login: builder.mutation({
      query: ({ address, signature, nonce }) => ({
        url: "/login",
        method: "POST",
        body: { address, signature, nonce },
      }),
      transformResponse: (response) => response,
      validateStatus: (response) => response.status === 200,
    }),
  }),
});

export const { useGetNonceMutation, useLoginMutation } = authApi;
