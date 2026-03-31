import json
import os

PORTFOLIO_FILE = "portfolio.json"

def save_portfolio(holdings: list[dict]):
    """
    Save a list of holdings.
    Holdings: [{ "ticker": str, "quantity": int, "purchase_price": float }]
    """
    with open(PORTFOLIO_FILE, "w") as f:
        json.dump(holdings, f)

def get_portfolio() -> list[dict]:
    """Retrieve saved portfolio holdings."""
    if not os.path.exists(PORTFOLIO_FILE):
        return []
    with open(PORTFOLIO_FILE, "r") as f:
        return json.load(f)
