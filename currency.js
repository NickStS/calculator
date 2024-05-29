function updateCurrencyOptions() {
    var currencySelects = document.querySelectorAll('select');
    currencySelects.forEach(select => {
        var sortedCurrencies = window.exchangeRates.sort((a, b) => a.txt.localeCompare(b.txt));
        select.innerHTML = sortedCurrencies.map(item => `<option value="${item.cc}">${item.txt}</option>`).join('');
    });
}


function updateExchangeRates() {
    fetch('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json')
        .then(response => response.json())
        .then(data => {
            window.exchangeRates = data;
            updateCurrencyOptions();

            var usdRateElement = document.getElementById('usdRate');
            var eurRateElement = document.getElementById('eurRate');

            var usdRate = data.find(item => item.cc === 'USD').rate.toFixed(2);
            var eurRate = data.find(item => item.cc === 'EUR').rate.toFixed(2);

            usdRateElement.textContent = usdRate;
            eurRateElement.textContent = eurRate;
        })
        .catch(error => {
            console.error('Помилка отримання даних з API НБУ:', error);
        });
}

function convertCurrency(amount, fromCurrency, toCurrency) {
    var fromRate = window.exchangeRates.find(item => item.cc === fromCurrency).rate;
    var toRate = window.exchangeRates.find(item => item.cc === toCurrency).rate;
    return (amount / fromRate) * toRate;
}

document.getElementById('swapCurrencies').addEventListener('click', function () {
    var fromCurrency = document.getElementById('fromCurrency').value;
    var toCurrency = document.getElementById('toCurrency').value;
    document.getElementById('fromCurrency').value = toCurrency;
    document.getElementById('toCurrency').value = fromCurrency;

    updateConversion();
});


updateExchangeRates();

setInterval(updateExchangeRates, 5 * 60 * 1000);

document.getElementById('amount').addEventListener('input', updateConversion);
document.getElementById('fromCurrency').addEventListener('input', updateConversion);
document.getElementById('toCurrency').addEventListener('input', updateConversion);

function updateConversion() {
    var amount = parseFloat(document.getElementById('amount').value) || 0;
    var fromCurrency = document.getElementById('fromCurrency').value;
    var toCurrency = document.getElementById('toCurrency').value;
    var convertedAmount = convertCurrency(amount, fromCurrency, toCurrency);
    var fromCurrencyName = window.exchangeRates.find(item => item.cc === fromCurrency).txt;
    var toCurrencyName = window.exchangeRates.find(item => item.cc === toCurrency).txt;
    document.getElementById('convertedResult').value = `${convertedAmount.toFixed(2)}`;
}
