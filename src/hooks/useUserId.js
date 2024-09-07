import { useState, useEffect } from 'react';
import { getFromLocalStorage } from '../utils/localStorage';

const useUserId = () => {
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        async function fetchUserId() {
            const userId = getFromLocalStorage('userId');

            if (!userId) return;

            setUserId(userId);
        };

        fetchUserId();

    }, []);

    return { userId };
};

export default useUserId;