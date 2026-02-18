import re
from graph.state import State


def vehicle_info_node(state: State) -> State:
    print("🚗 Vehicle Info node running")

    query = state["query"]

    # 1️⃣ Extract Indian vehicle number (DL01AB1234, MH12DE1433, etc.)
    match = re.search(r"\b[A-Z]{2}\d{2}[A-Z]{1,2}\d{4}\b", query.upper())

    if not match:
        state["llm_result"] = (
            "❌ Invalid vehicle number format.\n\n"
            "Please enter a valid Indian registration number.\n"
            "Example: DL01AB1234, MH12DE1433"
        )
        return state

    vehicle_number = match.group()

    # 2️⃣ Production-safe response (NO FAKE DATA)
    state["llm_result"] = f"""
🚗 Vehicle Details Lookup (India)

Registration Number:
{vehicle_number}

⚠️ Important Notice:
Due to Indian government privacy regulations,
vehicle owner details cannot be accessed directly
without OTP verification.

✅ How to check official vehicle details:

1. Visit the official Parivahan portal:
   https://parivahan.gov.in

2. Go to:
   Vehicle Related Services → Know Your Vehicle Details

3. Enter your vehicle number:
   {vehicle_number}

4. Complete OTP verification using your mobile number

📌 You can officially view:
- Vehicle type & class
- Registration date
- Fuel type
- Insurance status
- Fitness validity
- Challan details (if any)

🔒 Owner name may be partially masked for privacy.

If you want, I can help you understand
any details you find on the portal.
"""

    return state
