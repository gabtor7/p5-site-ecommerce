const searchParams = new URLSearchParams(window.location.search);
const orderId = searchParams.get('orderId');

document.getElementById('orderId').textContent = orderId;

// on n'a plus besoin du localStorage, on le clear
// clearLocalStorage();