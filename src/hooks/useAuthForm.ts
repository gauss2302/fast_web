'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';


interface UseAuthFormProps {
	onSuccess?: (data?: any) => void;
	onError?: (error: string) => void;
	redirectTo?: string;
}

interface FormState {
	loading: boolean;
	error: string | null;
	success: boolean;
}

export function useAuthForm({onSuccess, onError, redirectTo = '/'}: UseAuthFormProps = {}) {
	const [formState, setFormState] = useState<FormState>({
		loading: false,
		error: null,
		success: false,
	});
	const router = useRouter();

	const setLoading = (loading: boolean) => {
		setFormState(prev => ({ ...prev, loading }));
	};

	const setError = (error: string | null) => {
		setFormState(prev => ({ ...prev, error, success: false }));
	};

	const setSuccess = (success: boolean) => {
		setFormState(prev => ({ ...prev, success, error: null }));
	};

	const handleSuccess = (data?: any) => {
		setSuccess(true);
		if(onSuccess){
			onSuccess(data);
		} else if(redirectTo){
			router.push(redirectTo);
		}
	};

	const handleError = (error: string) => {
		setError(error);
		if (onError) {
			onError(error);
		}
	};

	return {
		...formState,
		setLoading,
		setError,
		setSuccess,
		handleSuccess,
		handleError,
	};


}
