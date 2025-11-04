"""
Payment views for Paystack integration
"""
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.conf import settings
import uuid
import json
import logging

from .models import ProductVariant
from .serializers import CartItemSerializer
from .payment import PaystackAPI, generate_payment_reference

logger = logging.getLogger(__name__)

class InitializePaymentView(APIView):
    """Initialize Paystack payment"""
    
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        """
        Initialize payment for cart items
        
        Expected payload:
        {
            "email": "customer@example.com",
            "cart_items": [
                {"variant_id": 1, "quantity": 2}
            ],
            "delivery_fee": 2000,
            "customer_info": {
                "first_name": "John",
                "last_name": "Doe",
                "phone": "08012345678",
                "address": "123 Main St",
                "city": "Lagos",
                "state": "Lagos",
                "delivery_zone": "lagos-mainland"
            }
        }
        """
        # Log incoming request for debugging
        logger.info(f"Payment initialization request: {request.data}")
        
        email = request.data.get('email')
        if not email:
            logger.error("Email is missing from request")
            return Response(
                {"error": "Email is required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validate cart items
        cart_items_serializer = CartItemSerializer(
            data=request.data.get('cart_items', []),
            many=True
        )
        
        if not cart_items_serializer.is_valid():
            logger.error(f"Cart items validation failed: {cart_items_serializer.errors}")
            return Response(
                cart_items_serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get delivery fee and customer info
        delivery_fee = float(request.data.get('delivery_fee', 0))
        customer_info = request.data.get('customer_info', {})
        
        # Calculate total and validate stock
        subtotal = 0
        items_data = []
        
        for item in cart_items_serializer.validated_data:
            variant = item['variant']
            quantity = item['quantity']
            
            # Check stock
            if variant.stock < quantity:
                return Response(
                    {
                        "error": f"Insufficient stock for {variant.product.name} - {variant.size}. Available: {variant.stock}"
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Calculate price (convert to Naira, assuming prices are in USD)
            price = variant.price_override if variant.price_override else variant.product.base_price
            price_naira = float(price) * 1600  # Convert USD to Naira
            item_subtotal = price_naira * quantity
            subtotal += item_subtotal
            
            items_data.append({
                "product_name": variant.product.name,
                "size": variant.size,
                "quantity": quantity,
                "price": price_naira,
                "subtotal": item_subtotal
            })
        
        # Calculate total with delivery
        total = subtotal + delivery_fee
        
        # Generate order reference
        order_id = f"AGS-{uuid.uuid4().hex[:8].upper()}"
        payment_reference = generate_payment_reference(order_id)
        
        # Initialize Paystack payment
        paystack = PaystackAPI()
        
        metadata = {
            "order_id": order_id,
            "items": items_data,
            "customer_email": email,
            "customer_info": customer_info,
            "subtotal": subtotal,
            "delivery_fee": delivery_fee,
            "total": total,
        }
        
        # Add user info if authenticated
        if request.user.is_authenticated:
            metadata["user_id"] = request.user.id
            metadata["username"] = request.user.username
        
        try:
            result = paystack.initialize_transaction(
                email=email,
                amount=total,
                reference=payment_reference,
                metadata=metadata
            )
            
            if result.get('status'):
                logger.info(f"Payment initialized successfully for order {order_id}")
                return Response({
                    "status": True,
                    "message": "Payment initialized successfully",
                    "data": {
                        "authorization_url": result['data']['authorization_url'],
                        "access_code": result['data']['access_code'],
                        "reference": payment_reference,
                        "order_id": order_id,
                        "amount": float(total),
                    }
                }, status=status.HTTP_200_OK)
            else:
                logger.error(f"Paystack initialization failed: {result.get('message')}")
                return Response({
                    "status": False,
                    "message": result.get('message', 'Payment initialization failed')
                }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Paystack API error: {str(e)}")
            return Response({
                "status": False,
                "message": "Payment service error. Please check your Paystack configuration.",
                "error": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class VerifyPaymentView(APIView):
    """Verify Paystack payment"""
    
    permission_classes = [permissions.AllowAny]
    
    def get(self, request, reference):
        """
        Verify payment transaction
        
        Args:
            reference: Payment reference to verify
        """
        paystack = PaystackAPI()
        result = paystack.verify_transaction(reference)
        
        if result.get('status') and result.get('data'):
            data = result['data']
            
            # Check if payment was successful
            if data.get('status') == 'success':
                # TODO: Create order in database
                # TODO: Update stock
                # TODO: Award loyalty points if user is authenticated
                
                return Response({
                    "status": True,
                    "message": "Payment verified successfully",
                    "data": {
                        "reference": data.get('reference'),
                        "amount": data.get('amount') / 100,  # Convert from kobo
                        "status": data.get('status'),
                        "paid_at": data.get('paid_at'),
                        "customer": data.get('customer'),
                        "metadata": data.get('metadata'),
                    }
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    "status": False,
                    "message": f"Payment {data.get('status')}",
                    "data": {
                        "reference": data.get('reference'),
                        "status": data.get('status'),
                    }
                }, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({
                "status": False,
                "message": result.get('message', 'Payment verification failed')
            }, status=status.HTTP_400_BAD_REQUEST)


class PaymentWebhookView(APIView):
    """Handle Paystack webhooks"""
    
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        """
        Handle webhook events from Paystack
        
        Events include:
        - charge.success
        - transfer.success
        - transfer.failed
        """
        # TODO: Verify webhook signature
        # TODO: Handle different event types
        # TODO: Update order status
        # TODO: Send confirmation emails
        
        event = request.data.get('event')
        data = request.data.get('data')
        
        if event == 'charge.success':
            # Payment successful
            reference = data.get('reference')
            # Process order...
            pass
        
        return Response({"status": "received"}, status=status.HTTP_200_OK)
