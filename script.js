document.getElementById('loan-form').addEventListener('submit', function(e) {
    e.preventDefault();

    // Get input values
    const amount = parseFloat(document.getElementById('amount').value);
    const annualRate = parseFloat(document.getElementById('rate').value);
    const years = parseInt(document.getElementById('years').value);

    // Calculate monthly values
    const monthlyRate = annualRate / 100 / 12;
    const n = years * 12;

    // Amortization formula
    const monthlyPayment = (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -n));

    if (isFinite(monthlyPayment)) {
        const formatDKK = (value) => new Intl.NumberFormat('da-DK', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
        let resultHTML = `<h2>Resultater</h2>
            <p><strong>Månedlig ydelse:</strong> DKK ${formatDKK(monthlyPayment)}</p>
            <h3>Amortiseringsplan</h3>
            <table border="1" cellpadding="5">
                <tr>
                    <th>Måned</th>
                    <th>Afdrag</th>
                    <th>Rente</th>
                    <th>Månedlig ydelse</th>
                    <th>Restgæld</th>
                </tr>`;

        let balance = amount;
        for (let i = 1; i <= n; i++) {
            const interest = balance * monthlyRate;
            const principal = monthlyPayment - interest;
            balance -= principal;
            resultHTML += `<tr>
                <td>${i}</td>
                <td>DKK ${formatDKK(principal)}</td>
                <td>DKK ${formatDKK(interest)}</td>
                <td>DKK ${formatDKK(monthlyPayment)}</td>
                <td>DKK ${formatDKK(Math.abs(balance))}</td>
            </tr>`;
        }
        resultHTML += '</table>';

        // Yearly summary
        let yearlySummary = [];
        let balance2 = amount;
        for (let year = 1; year <= years; year++) {
            let yearPrincipal = 0;
            let yearInterest = 0;
            for (let month = 1; month <= 12; month++) {
                let i = (year - 1) * 12 + month;
                if (i > n) break;
                const interest = balance2 * monthlyRate;
                const principal = monthlyPayment - interest;
                yearPrincipal += principal;
                yearInterest += interest;
                balance2 -= principal;
            }
            yearlySummary.push({
                year,
                totalPayment: monthlyPayment * Math.min(12, n - (year - 1) * 12),
                totalPrincipal: yearPrincipal,
                totalInterest: yearInterest
            });
        }
        resultHTML += '<h3>Årlig summering</h3>';
        resultHTML += '<table border="1" cellpadding="5"><tr><th>År</th><th>Samlet ydelse</th><th>Samlet afdrag</th><th>Samlet rente</th></tr>';
        yearlySummary.forEach(row => {
            resultHTML += `<tr><td>${row.year}</td><td>DKK ${formatDKK(row.totalPayment)}</td><td>DKK ${formatDKK(row.totalPrincipal)}</td><td>DKK ${formatDKK(row.totalInterest)}</td></tr>`;
        });
        resultHTML += '</table>';
        document.getElementById('results').innerHTML = resultHTML;
    } else {
        document.getElementById('results').innerHTML = '<p>Kontroller venligst dine indtastninger.</p>';
    }
});