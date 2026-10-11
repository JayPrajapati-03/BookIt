"""
BookIt Real-Time Hotel Booking Platform — Locust Load Testing Script
Simulates concurrent user behavior:
- Browse & Suggestion queries
- Geolocation and facet search
- Booking quotes and holds with idempotency keys
- Real-time tape chart and admin stats polling
"""

import time
import uuid
from locust import HttpUser, task, between

class BookItGuestUser(HttpUser):
    wait_time = between(1, 3)
    token = None
    headers = {}

    def on_start(self):
        # Authenticate demo guest
        res = self.client.post("/api/v1/auth/login", json={
            "email": "demo_guest@bookit.test",
            "password": "Password123!"
        })
        if res.status_code == 200:
            data = res.json()
            self.token = data.get("data", {}).get("accessToken")
            self.headers = {"Authorization": f"Bearer {self.token}"}

    @task(5)
    def browse_hotels(self):
        """High frequency: browse and search hotels with facets"""
        self.client.get("/api/v1/hotels?city=Udaipur&limit=10")

    @task(3)
    def search_autosuggest(self):
        """Typeahead search suggestion query"""
        self.client.get("/api/v1/hotels/suggest?q=palace")

    @task(2)
    def view_hotel_detail(self):
        """View hotel details and availability calendar"""
        self.client.get("/api/v1/hotels/the-oberoi-udaivilas")
        self.client.get("/api/v1/hotels/the-oberoi-udaivilas/calendar?month=2026-11")

    @task(1)
    def quote_and_hold_booking(self):
        """Simulate checkout funnel: quote then attempt hold"""
        if not self.headers:
            return

        # Fetch room types for hotel
        res = self.client.get("/api/v1/hotels/the-oberoi-udaivilas")
        if res.status_code != 200:
            return
        
        hotel = res.json().get("data", {}).get("hotel", {})
        room_types = res.json().get("data", {}).get("roomTypes", [])
        if not room_types:
            return

        room_type_id = room_types[0]["_id"]
        check_in = "2026-11-15"
        check_out = "2026-11-17"

        # Request quote
        quote_res = self.client.get(
            f"/api/v1/bookings/quote?roomTypeId={room_type_id}&checkIn={check_in}&checkOut={check_out}&adults=2",
            headers=self.headers
        )

        if quote_res.status_code == 200:
            # Request hold with unique idempotency key
            idem_key = f"locust-{uuid.uuid4()}"
            self.client.post("/api/v1/bookings/hold", json={
                "roomTypeId": room_type_id,
                "checkIn": check_in,
                "checkOut": check_out,
                "adults": 2,
                "children": 0,
                "idempotencyKey": idem_key,
                "guestDetails": {
                    "name": "Load Test Guest",
                    "email": "loadtest@bookit.test",
                    "phone": "+919876543210"
                }
            }, headers={**self.headers, "Idempotency-Key": idem_key})

class BookItAdminUser(HttpUser):
    wait_time = between(2, 5)
    headers = {}

    def on_start(self):
        res = self.client.post("/api/v1/auth/login", json={
            "email": "demo_admin@bookit.test",
            "password": "Password123!"
        })
        if res.status_code == 200:
            data = res.json()
            token = data.get("data", {}).get("accessToken")
            self.headers = {"Authorization": f"Bearer {token}"}

    @task(3)
    def view_dashboard(self):
        """Admin dashboard KPIs and occupancy reports"""
        self.client.get("/api/v1/admin/dashboard", headers=self.headers)

    @task(2)
    def view_tape_chart(self):
        """Tape chart room ledger query"""
        self.client.get("/api/v1/admin/tape-chart?days=14", headers=self.headers)
