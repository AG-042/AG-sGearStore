"""
Paystack payment integration for AG's GearStore
"""
import requests
from django.conf import settings
from decimal import Decimal
import logging

logger = logging.getLogger(__name__)


class PaystackAPI:
    """Wrapper for Paystack API calls"""
    
    BASE_URL = "https://api.paystack.co"
    
    def __init__(self):
        self.secret_key = settings.PAYSTACK_SECRET_KEY
        self.headers = {
            "Authorization": f"Bearer {self.secret_key}",
            "Content-Type": "application/json",
        }
    
    def initialize_transaction(self, email, amount, reference, metadata=None):
        """
        Initialize a payment transaction
        
        Args:
            email: Customer email
            amount: Amount in kobo (multiply naira by 100)
            reference: Unique transaction reference
            metadata: Optional metadata dict
        
        Returns:
            dict: Response from Paystack API
        """
        url = f"{self.BASE_URL}/transaction/initialize"
        
        payload = {
            "email": email,
            "amount": int(amount * 100),  # Convert to kobo
            "reference": reference,
            "callback_url": settings.PAYSTACK_CALLBACK_URL,
        }
        
        if metadata:
            payload["metadata"] = metadata
        
        # Log the request for debugging
        logger.info(f"Paystack Request URL: {url}")
        logger.info(f"Paystack Payload: email={email}, amount={int(amount * 100)} kobo, reference={reference}")
        logger.info(f"Secret Key being used: {self.secret_key[:20]}...")
        
        try:
            response = requests.post(url, json=payload, headers=self.headers)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.HTTPError as e:
            # Log the full error response from Paystack
            logger.error(f"Paystack HTTP Error: {e}")
            logger.error(f"Response Status: {response.status_code}")
            logger.error(f"Response Body: {response.text}")
            
            error_detail = {
                "status": False,
                "message": f"Payment initialization failed: {str(e)}",
                "paystack_response": response.json() if response.content else None
            }
            return error_detail
        except requests.exceptions.RequestException as e:
            return {
                "status": False,
                "message": f"Payment initialization failed: {str(e)}"
            }
    
    def verify_transaction(self, reference):
        """
        Verify a transaction
        
        Args:
            reference: Transaction reference to verify
        
        Returns:
            dict: Response from Paystack API
        """
        url = f"{self.BASE_URL}/transaction/verify/{reference}"
        
        try:
            response = requests.get(url, headers=self.headers)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            return {
                "status": False,
                "message": f"Transaction verification failed: {str(e)}"
            }
    
    def list_transactions(self, per_page=50, page=1):
        """
        List transactions
        
        Args:
            per_page: Number of transactions per page
            page: Page number
        
        Returns:
            dict: Response from Paystack API
        """
        url = f"{self.BASE_URL}/transaction"
        params = {"perPage": per_page, "page": page}
        
        try:
            response = requests.get(url, headers=self.headers, params=params)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            return {
                "status": False,
                "message": f"Failed to fetch transactions: {str(e)}"
            }


def generate_payment_reference(order_id):
    """Generate a unique payment reference"""
    import uuid
    return f"AGS-{order_id}-{uuid.uuid4().hex[:8].upper()}"


def calculate_amount_in_kobo(amount):
    """Convert amount to kobo (Paystack uses kobo)"""
    return int(Decimal(amount) * 100)
