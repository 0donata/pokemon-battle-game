import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const pokemonApi = createApi({
  reducerPath: "pokemonApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("token");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getPokemons: builder.query({
      query: ({ page = 1, limit = 20 }) =>
        `/pokemons?page=${page}&limit=${limit}`,
      transformResponse: (response) => ({
        data: response.data,
        currentPage: response.currentPage,
        totalPages: response.totalPages,
      }),
      keepUnusedDataFor: 300,
    }),
    selectOpponent: builder.mutation({
      query: (playerPokemon) => ({
        url: "/select-opponent",
        method: "POST",
        body: { playerPokemon },
      }),
      transformResponse: (response) => response.opponent,
    }),
    startBattle: builder.mutation({
      query: (playerPokemon) => ({
        url: "/start-battle",
        method: "POST",
        body: { playerPokemon },
      }),
      transformResponse: (response) => response,
      validateStatus: (response) => response.status === 200,
    }),
    processTurn: builder.mutation({
      query: ({ battleId, isPlayerTurn }) => ({
        url: "/process-turn",
        method: "POST",
        body: { battleId, isPlayerTurn },
      }),
      transformResponse: (response) => response,
      validateStatus: (response) => response.status === 200,
    }),
    getBattle: builder.query({
      query: (battleId) => `/battle/${battleId}`,
      transformResponse: (response) => response,
      validateStatus: (response) => response.status === 200,
    }),
    surrender: builder.mutation({
      query: (battleId) => ({
        url: "/surrender",
        method: "POST",
        body: { battleId },
      }),
      validateStatus: (response) => response.status === 200,
    }),
  }),
});

export const {
  useGetPokemonsQuery,
  useSelectOpponentMutation,
  useStartBattleMutation,
  useProcessTurnMutation,
  useGetBattleQuery,
  useSurrenderMutation,
} = pokemonApi;
