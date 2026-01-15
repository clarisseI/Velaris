import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseUrl = "https://api.coingecko.com/api/v3";

export const coinGeckoApi = createApi({
  reducerPath: "coinGeckoApi",
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({
    getGlobalStats: builder.query({
      query: () => "/global",
    }),
    getCryptos: builder.query({
      query: ({ limit = 100, currency = "usd" }) =>
        `/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=${limit}&page=1&sparkline=true&price_change_percentage=1h,24h,7d`,
    }),
    getCryptoDetails: builder.query({
      query: (coinId) =>
        `/coins/${coinId}?localization=false&tickers=false&community_data=true&developer_data=false`,
    }),
    getCryptoHistory: builder.query({
      query: ({ coinId, days = 7 }) =>
        `/coins/${coinId}/market_chart?vs_currency=usd&days=${days}`,
    }),
    getTrendingCoins: builder.query({
      query: () => "/search/trending",
    }),
    getCoinNews: builder.query({
      query: (coinId) => `/status_updates?category=general&project_type=coin&per_page=20`,
    }),
  }),
});

export const {
  useGetGlobalStatsQuery,
  useGetCryptosQuery,
  useGetCryptoDetailsQuery,
  useGetCryptoHistoryQuery,
  useGetTrendingCoinsQuery,
  useGetCoinNewsQuery,
} = coinGeckoApi;
