import { clearLocalStorage } from "./helpers.js";

const searchParams = new URLSearchParams(window.location.search);

document.getElementById('orderId').textContent = searchParams.get('orderId');

// on n'a plus besoin du localStorage, on le clear
clearLocalStorage();