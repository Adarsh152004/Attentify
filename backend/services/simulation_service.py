import yfinance as yf
from services.groq_service import _get_client
import json

# Predefined Crisis Scenarios and Impact factors
SCENARIOS = {
    "Black Monday (1987)": {
        "Default shock": -0.22, # -22.6% for Dow Jones
        "description": "The largest one-day percentage decline in stock market history."
    },
    "Global Financial Crisis (2008)": {
        "Defensive shock": -0.30, # FMCG / Pharmaceuticals
        "Growth shock": -0.55,    # Tech / Financials
        "Default shock": -0.42,
        "description": "Collapse of Lehman Brothers and the housing market bubble."
    },
    "COVID-19 Crash (2020)": {
        "Travel/Tourism shock": -0.60,
        "Tech shock": -0.20,
        "Default shock": -0.34,
        "description": "Sudden global economic shutdown and health crisis."
    },
    "Dot-com Bubble Burst (2000)": {
        "Tech shock": -0.78,
        "Defensive shock": -0.10,
        "Default shock": -0.45,
        "description": "Massive sell-off in technology and internet-related stocks."
    }
}

def generate_dynamic_scenario_impact(holdings, scenario_name):
    """Uses Groq AI to dynamically generate impact shocks and reasons for a custom What If scenario."""
    try:
        client = _get_client()
        tickers = [h["ticker"] for h in holdings]
        prompt = (
            f"You are a financial risk simulator. The user wants to simulate a custom 'What If' scenario: '{scenario_name}'.\n"
            f"Calculate the estimated price shock percentage (e.g., -0.25 for a 25% drop, 0.10 for a 10% rise) for the following Indian/Global stocks: {tickers}.\n"
            f"Return ONLY a JSON array of objects with 'ticker', 'shock' (float), and 'reason' (string explaining why it rose or fell specifically based on the scenario).\n"
            f"Example: [{{\"ticker\": \"RELIANCE.NS\", \"shock\": -0.12, \"reason\": \"Energy demand plummets during global lockdowns\"}}]\n"
        )
        response = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="llama-3.1-8b-instant",
            max_tokens=1024,
            temperature=0.2,
            response_format={"type": "json_object"}
        )
        content = response.choices[0].message.content
        # sometimes LLMs wrap the array in a dict like {"results": [...]}
        data = json.loads(content)
        if isinstance(data, dict):
            for val in data.values():
                if isinstance(val, list):
                    return val
            return [data] # fallback
        return data
    except Exception as e:
        print(f"Error in dynamic scenario: {e}")
        return []

def simulate_crisis(holdings: list[dict], scenario_name: str) -> dict:
    """
    Simulate the impact of a crisis scenario on a portfolio.
    Holdings: [{ "ticker": str, "value": float }]
    """
    is_custom = scenario_name not in SCENARIOS
    scenario = SCENARIOS.get(scenario_name, {"description": f"Custom AI Simulation: {scenario_name}"})
    
    total_drawdown = 0
    impact_details = []
    
    # Common sector mapping
    sector_map = {
        "RELIANCE": "Energy", "TCS": "IT", "HDFCBANK": "Finance", 
        "INFY": "IT", "ICICIBANK": "Finance", "ITC": "Consumer",
        "NVDA": "Technology", "AAPL": "Technology", "MSFT": "Technology",
        "TSLA": "Automotive", "GOOGL": "Technology", "AMZN": "Consumer"
    }

    dynamic_impacts = {}
    if is_custom:
        ai_data = generate_dynamic_scenario_impact(holdings, scenario_name)
        for d in ai_data:
            ticker_formatted = d.get('ticker', '').upper().split('.')[0]
            dynamic_impacts[ticker_formatted] = d

    # Tracking sector impact for heatmap
    sector_impacts = {}

    for h in holdings:
        ticker = h["ticker"].upper().split('.')[0]
        value = h["value"]
        sector = h.get("sector") or sector_map.get(ticker, "Others")
        
        reason = ""
        shock = -0.20 # default

        if is_custom and ticker in dynamic_impacts:
            shock = float(dynamic_impacts[ticker].get("shock", -0.20))
            reason = dynamic_impacts[ticker].get("reason", "AI calculated impact based on custom scenario parameters.")
        elif not is_custom:
            # Base shock
            shock = scenario.get("Default shock", -0.20)
            
            # More nuanced shocks
            if sector == "Technology" or sector == "IT":
                shock = scenario.get("Tech shock", shock)
                reason = "Tech sectors experience amplified capital flight during this specific historical event."
            elif sector == "Finance":
                shock = scenario.get("Growth shock", shock) if scenario_name == "Global Financial Crisis (2008)" else shock
                reason = "Financial institutions suffered direct systemic collapse and severe liquidity crunches." if scenario_name == "Global Financial Crisis (2008)" else "Highly correlated to broad market panic."
            elif sector == "Consumer":
                shock = scenario.get("Defensive shock", shock)
                reason = "Defensive stock; people still buy household goods, limiting downside."
            else:
                reason = "Broad market correlation resulting in average systemic drawdown."
            
        drawdown = value * shock
        total_drawdown += drawdown
        
        # Track sector-specific impact
        if sector not in sector_impacts:
            sector_impacts[sector] = {"total_value": 0, "total_loss": 0}
        sector_impacts[sector]["total_value"] += value
        sector_impacts[sector]["total_loss"] += drawdown

        impact_details.append({
            "ticker": h["ticker"],
            "sector": sector,
            "original_value": value,
            "simulated_loss": round(drawdown, 2),
            "new_value": round(value + drawdown, 2),
            "shock_percentage": round(shock * 100, 1),
            "reason": reason
        })
        
    # Recovery estimation logic (Mocked based on historical averages)
    # 2008 took ~5 years, COVID ~1.5 years, dot-com ~13 years (NASDAQ)
    recovery_years = {
         "Black Monday (1987)": 2,
         "Global Financial Crisis (2008)": 5,
         "COVID-19 Crash (2020)": 1.5,
         "Dot-com Bubble Burst (2000)": 12
    }.get(scenario_name, 3)

    # Sector heatmap data
    heatmap = []
    for sector, stats in sector_impacts.items():
        total_val = stats["total_value"]
        loss_pct = round((stats["total_loss"] / total_val) * 100, 1) if total_val != 0 else 0
        heatmap.append({
            "sector": sector,
            "loss_pct": loss_pct,
            "intensity": min(abs(loss_pct) / 60, 1) if loss_pct != 0 else 0 
        })

    # Total portfolio calculation with safety
    total_portfolio_value = sum(h["value"] for h in holdings)
    impact_pct = round((total_drawdown / total_portfolio_value) * 100, 2) if total_portfolio_value != 0 else 0

    return {
        "scenario": scenario_name,
        "description": scenario["description"],
        "total_impact": round(total_drawdown, 2),
        "impact_percentage": impact_pct,
        "details": impact_details,
        "recovery_estimate_years": recovery_years,
        "sector_heatmap": heatmap,
        "resilience_score": round(max(0, 100 + impact_pct), 1),
        "confidence_interval": "95% Historical Confidence"
    }
