'use client';

import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { store } from '@/lib/store/store';
import { setCredentials, setLoading } from '@/lib/store/authSlice';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

function AuthRehydrator({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        const rehydrate = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                store.dispatch(setLoading(false));
                return;
            }
            try {
                // Validate token and restore user session
                const { data } = await api.get('/users/profile');
                store.dispatch(setCredentials({ user: data.user, token }));
            } catch {
                // Token is invalid/expired — clear it
                localStorage.removeItem('token');
            } finally {
                store.dispatch(setLoading(false));
            }
        };
        rehydrate();
    }, []);

    return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <Provider store={store}>
            <QueryClientProvider client={queryClient}>
                <AuthRehydrator>
                    {children}
                </AuthRehydrator>
            </QueryClientProvider>
        </Provider>
    );
}
