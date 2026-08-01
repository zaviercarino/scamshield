export function formatResult(data) {

    return `
        <section class="scam-result" id="scam-result" aria-labelledby="result-title">
            <div class="result-top">
                <div>
                    <p class="result-eyebrow">Analysis complete</p>
                    <h2 id="result-title">Risk Level: <span id="risk-score">${data.riskLevel}</span>/100</h2>
                </div>

                <div class="risk-badge" id="risk-badge">
                    <span>Confidence</span>
                    <strong id="confidence-score">${data.confidence}/100</strong>
                </div>
            </div>

            <div class="result-summary" id="result-summary">
                <p class="result-label">Scam type</p>
                <h3 id="scam-type">${data.scamType}</h3>

                <p class="result-label">Summary</p>
                <p id="scam-summary">${data.summary}</p>
            </div>

            <div class="result-details" id="result-details">
                <article class="result-section" id="reasons-section">
                    <h3>Why this was flagged</h3>
                    <ul id="reasons-list">
                        ${data.reasons.map(reason => `<li>${reason}</li>`).join("")}
                    </ul>
                </article>

                <article class="result-section result-section--warning" id="red-flags-section">
                    <h3>Red flags</h3>
                    <ul id="red-flags-list">
                        ${data.redFlags.map(flag => `<li>${flag}</li>`).join("")}
                    </ul>
                </article>

                <article class="result-section" id="next-steps-section">
                    <h3>Recommended next steps</h3>
                    <ul id="next-steps-list">
                        ${data.nextSteps.map(step => `<li>${step}</li>`).join("")}
                    </ul>
                </article>

                <article class="result-section result-section--action" id="responded-section">
                    <h3>If you already responded</h3>
                    <ul id="responded-list">
                        ${data.whatToDoIfYouAlreadyResponded.map(item => `<li>${item}</li>`).join("")}
                    </ul>
                </article>
                <p id="disclaimer">ScamShield Analyzer uses AI to detect potential scam risks. Results are estimates and may not always be accurate. Always use your own judgment before responding or sharing information.</p>
            </div>
        </section>
    `;
}