import { useEffect } from 'react';

export default function TravelHackerAIV2() {
  useEffect(() => {
    // Load the external JavaScript after component mounts
    const script = document.createElement('script');
    script.src = '/static/app.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup script when component unmounts
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div style={{
      fontFamily: 'ui-sans-serif, system-ui',
      background: '#f7fafc',
      color: '#0f172a',
      minHeight: '100vh',
      margin: 0
    }}>
      <style>{`
        :root{--b:#0f172a;--mut:#64748b;--bd:#e5e7eb;--bg:#f7fafc;--pill:#fff;--cta:#275afe}
        .travel-container{max-width:980px;margin:0 auto;padding:0 16px}
        .travel-card{background:#fff;border:1px solid #e5e7eb;border-radius:16px;padding:16px}
        .travel-input,.travel-select,.travel-button,.travel-textarea{border:1px solid #e5e7eb;border-radius:12px;padding:10px;font-size:14px;background:#fff}
        .travel-button{cursor:pointer}
        .travel-muted{color:#64748b}
        .travel-pill{border:1px solid #e5e7eb;padding:8px 12px;border-radius:12px;background:#fff;display:flex;align-items:center;gap:8px}
        .travel-chips{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}
        .travel-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}
        .travel-row-3{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}
        @media (max-width:800px){.travel-row,.travel-row-3{grid-template-columns:1fr}}
        .travel-checkline{display:flex;flex-direction:column;gap:8px;margin-top:8px}
        .travel-check{display:flex;align-items:center;gap:8px}
        .travel-cta{background:#275afe;color:#fff;border:none;border-radius:12px;padding:14px 16px;font-weight:600;width:100%}
        .travel-grid{display:grid;gap:12px;grid-template-columns:1fr 1fr;margin-top:16px}
        @media (max-width:800px){.travel-grid{grid-template-columns:1fr}}
        .travel-badge{font-size:12px;padding:4px 8px;border-radius:999px;border:1px solid #e5e7eb}
        .travel-hero-bullets{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin-top:10px}
        .travel-hero-bullets .travel-pill{font-weight:600}
        .travel-tabs{display:flex;gap:8px;justify-content:center;margin:16px 0 10px}
        .travel-tab{padding:8px 14px;border:1px solid #e5e7eb;border-radius:999px;background:#fff;cursor:pointer}
        .travel-tab.active{background:#0f172a;color:#fff;border-color:#0f172a}
        .travel-section-title{font-weight:700;margin:22px 0 8px}
        .travel-hint{font-size:12px;color:#64748b;margin-top:4px}
      `}</style>

      <header style={{textAlign: 'center', padding: '40px 20px'}}>
        <div className="travel-container">
          <h1 style={{fontSize: '40px', margin: '10px 0'}}>Travel Hacker AI</h1>
          <p style={{maxWidth: '740px', margin: '0 auto', color: '#475569'}}>
            Let AI do the heavy lifting. Find ultra-cheap flights, rare mistake fares, and full budget travel plans with live prices.
          </p>

          <div className="travel-hero-bullets">
            <div className="travel-pill">Ultra-cheap roundtrip flights</div>
            <div className="travel-pill">⚡ Rare mistake fares</div>
            <div className="travel-pill">🧳 Full budget travel plans</div>
          </div>

          <div className="travel-tabs">
            <button className="travel-tab active" data-tab="deal">Find My Travel Deal</button>
            <button className="travel-tab" data-tab="flights">Flights</button>
            <button className="travel-tab" data-tab="hotels">Hotels</button>
            <button className="travel-tab" data-tab="cars">Cars</button>
          </div>

          <div className="travel-muted" style={{marginTop: '6px'}}>
            <label><input id="use_ai" type="checkbox" defaultChecked/> Use AI parsing/summaries (if available)</label>
          </div>
        </div>
      </header>

      <main className="travel-container">
        <section className="travel-card" data-pane="deal">
          <h3 className="travel-section-title">Find My Travel Deal</h3>

          <div className="travel-row">
            <div>
              <label>Departure City</label>
              <input id="d_from" className="travel-input" placeholder="e.g., Nashville, New York" />
              <div className="travel-hint">City or IATA (BNA, JFK)</div>
            </div>
            <div>
              <label>Destination (Optional)</label>
              <input id="d_to" className="travel-input" placeholder="Leave empty for anywhere" />
            </div>
          </div>

          <div className="travel-section-title">When do you want to travel?</div>
          <div className="travel-chips">
            <button className="travel-pill" data-chip="spontaneous">⚡ Spontaneous</button>
            <button className="travel-pill" data-chip="this_month">📅 This Month</button>
            <button className="travel-pill" data-chip="next_month">📅 Next Month</button>
            <button className="travel-pill" data-chip="this_year">📅 This Year</button>
          </div>

          <div className="travel-row" style={{marginTop: '10px'}}>
            <div>
              <label>Departure Date</label>
              <input id="d_depart" className="travel-input" type="date" />
            </div>
            <div>
              <label>Return Date</label>
              <input id="d_return" className="travel-input" type="date" />
            </div>
          </div>

          <div className="travel-row" style={{marginTop: '10px'}}>
            <div>
              <label>Budget (Optional)</label>
              <input id="d_budget" className="travel-input" placeholder="e.g., $500" inputMode="numeric" />
            </div>
            <div>
              <label>Date Flexibility</label>
              <select id="d_flex" className="travel-select">
                <option value="exact">Exact dates</option>
                <option value="+-3">± 3 days</option>
                <option value="weekend">Weekend only</option>
                <option value="month">Any time this month</option>
              </select>
            </div>
          </div>

          <div className="travel-checkline">
            <label className="travel-check" style={{cursor: 'pointer'}}>
              <input id="d_flights_only" type="checkbox" defaultChecked style={{marginRight: '8px'}}/> ✈️ Flights only
            </label>
            <label className="travel-check" style={{cursor: 'pointer'}}>
              <input id="d_include_hotels" type="checkbox" style={{marginRight: '8px'}}/> 🏨 Include hotels
            </label>
            <label className="travel-check" style={{cursor: 'pointer'}}>
              <input id="d_include_cars" type="checkbox" style={{marginRight: '8px'}}/> 🚗 Include car rentals
            </label>
            <label className="travel-check" style={{cursor: 'pointer'}}>
              <input id="d_mistake" type="checkbox" style={{marginRight: '8px'}}/> ⚡ Mistake fares
            </label>
          </div>

          <button id="deal_cta" className="travel-cta" style={{marginTop: '14px'}}>🎯 Find My Deal</button>

          <div id="dealSummary" className="travel-muted" style={{marginTop: '10px'}}></div>
          <div id="dealResults" className="travel-grid"></div>
        </section>

        <section className="travel-card" data-pane="flights" style={{display: 'none'}}>
          <h3 className="travel-section-title">Flights</h3>
          <form id="flightForm" className="travel-row">
            <div><label>From (IATA)</label><input id="origin" className="travel-input" defaultValue="JFK" required/></div>
            <div><label>To (IATA)</label><input id="destination" className="travel-input" defaultValue="FCO" required/></div>
            <div><label>Depart</label><input id="departDate" className="travel-input" type="date"/></div>
            <div><label>Return</label><input id="returnDate" className="travel-input" type="date"/></div>
            <div><label>Max Price (USD)</label><input id="maxPrice" className="travel-input" inputMode="numeric" pattern="[0-9]*"/></div>
            <div>
              <label>Cabin</label>
              <select id="cabin" className="travel-select">
                <option>ECONOMY</option>
                <option>PREMIUM_ECONOMY</option>
                <option>BUSINESS</option>
                <option>FIRST</option>
              </select>
              <div className="travel-check" style={{marginTop: '8px'}}><input id="nonStop" type="checkbox"/> Non-stop</div>
              <button type="submit" className="travel-cta" style={{marginTop: '8px'}}>Find Deals</button>
            </div>
          </form>
          <div id="flightSummary" className="travel-muted" style={{marginTop: '10px'}}></div>
          <div id="flightResults" className="travel-grid"></div>
        </section>

        <section className="travel-card" data-pane="hotels" style={{display: 'none'}}>
          <h3 className="travel-section-title">Hotels</h3>
          <form id="hotelForm" className="travel-row">
            <div><label>City (IATA city)</label><input id="h_cityCode" className="travel-input" defaultValue="ROM" required/></div>
            <div><label>Check-in</label><input id="h_checkIn" className="travel-input" type="date" required/></div>
            <div><label>Check-out</label><input id="h_checkOut" className="travel-input" type="date" required/></div>
            <div><label>Adults</label><input id="h_adults" className="travel-input" type="number" min="1" defaultValue="2" required/></div>
            <div><label>Rooms</label><input id="h_rooms" className="travel-input" type="number" min="1" defaultValue="1" required/></div>
            <div style={{alignSelf: 'end'}}><button className="travel-cta" type="submit">Search Hotels</button></div>
          </form>
          <div id="hotelResults" className="travel-grid"></div>
        </section>

        <section className="travel-card" data-pane="cars" style={{display: 'none'}}>
          <h3 className="travel-section-title">Cars</h3>
          <form id="carForm" className="travel-row-3">
            <div><label>City (IATA city)</label><input id="c_cityCode" className="travel-input" defaultValue="ROM" required/></div>
            <div><label>Pick-up</label><input id="c_pick" className="travel-input" type="datetime-local" required/></div>
            <div><label>Drop-off</label><input id="c_drop" className="travel-input" type="datetime-local" required/></div>
            <div><label>Passengers</label><input id="c_pax" className="travel-input" type="number" min="1" defaultValue="2" required/></div>
            <div style={{gridColumn: '1 / -1', textAlign: 'right'}}><button className="travel-cta" type="submit">Search Cars</button></div>
          </form>
          <div id="carResults" className="travel-grid"></div>
        </section>
      </main>
    </div>
  );
}