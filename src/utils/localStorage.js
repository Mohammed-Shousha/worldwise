export function saveToLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

export function removeFromLocalStorage(key) {
    localStorage.removeItem(key);
}

export function getFromLocalStorage(key) {
    return JSON.parse(localStorage.getItem(key));
}

export function clearLocalStorage() {
    localStorage.clear();
}