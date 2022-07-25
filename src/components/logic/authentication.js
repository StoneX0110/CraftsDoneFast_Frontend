export function isLoggedIn() {
    const userData = sessionStorage.getItem('userData');
    if (userData === 'undefined') {
        return false;
    } else {
        return true;
    }
}