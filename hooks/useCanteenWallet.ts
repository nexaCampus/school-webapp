'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys, CACHE_TTLS } from '@/lib/query-keys';
import { goApi } from '@/lib/goApiClient';

export function useCanteenWallet(studentId = 'active') {
  return useQuery({
    queryKey: queryKeys.canteen.wallet(studentId),
    queryFn: async () => {
      return await goApi.getCanteenWallet();
    },
    staleTime: CACHE_TTLS.CANTEEN_WALLET, // 30 seconds matching backend TTL
  });
}

export function useCanteenOrders(studentId = 'active') {
  return useQuery({
    queryKey: queryKeys.canteen.orders(studentId),
    queryFn: async () => {
      return await goApi.getCanteenFoodOrdered();
    },
    staleTime: CACHE_TTLS.STORE_ORDERS, // 2 minutes matching backend TTL
  });
}

export function useRechargeCanteenWallet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (amount: number) => {
      return await goApi.rechargeCanteenWallet(amount);
    },
    onSuccess: () => {
      // Invalidate canteen wallet and store caches
      queryClient.invalidateQueries({ queryKey: queryKeys.canteen.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.store.all });
    },
  });
}
