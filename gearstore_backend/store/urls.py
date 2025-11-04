"""Setup for soccer fan e-commerce with optional registration"""

from rest_framework.routers import DefaultRouter
from rest_framework_nested.routers import NestedDefaultRouter
from django.urls import path
from .views import CategoryViewSet, ProductViewSet, ProductVariantViewSet, GuestCheckoutView, AuthenticatedCheckoutView
from .views_payment import InitializePaymentView, VerifyPaymentView, PaymentWebhookView

app_name = 'store'

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'products', ProductViewSet)

# Nested router for product variants
products_router = NestedDefaultRouter(router, r'products', lookup='product')
products_router.register(r'variants', ProductVariantViewSet, basename='product-variants')

urlpatterns = router.urls + products_router.urls + [
    path('guest-checkout/', GuestCheckoutView.as_view(), name='guest_checkout'),
    path('auth-checkout/', AuthenticatedCheckoutView.as_view(), name='auth_checkout'),
    
    # Payment endpoints
    path('payment/initialize/', InitializePaymentView.as_view(), name='initialize_payment'),
    path('payment/verify/<str:reference>/', VerifyPaymentView.as_view(), name='verify_payment'),
    path('payment/webhook/', PaymentWebhookView.as_view(), name='payment_webhook'),
]
