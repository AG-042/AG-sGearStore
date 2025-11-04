from rest_framework import viewsets, permissions, status, serializers
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
import uuid
from .models import Category, Product, ProductVariant
from .serializers import CategorySerializer, ProductSerializer, ProductVariantSerializer


class CategoryViewSet(viewsets.ModelViewSet):
    """API for gear categories like Jerseys, Cleats, Accessories"""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]


class ProductViewSet(viewsets.ModelViewSet):
    """API for gear like Nike Barcelona Jersey with XL size stock check"""
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter]
    filterset_fields = ['team']
    search_fields = ['name', 'description']

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        queryset = super().get_queryset()
        price_min = self.request.query_params.get('price_min')
        price_max = self.request.query_params.get('price_max')
        size_available = self.request.query_params.get('size_available')

        # Filter by price range
        if price_min:
            queryset = queryset.filter(base_price__gte=price_min)
        if price_max:
            queryset = queryset.filter(base_price__lte=price_max)

        # Filter by available size
        if size_available:
            queryset = queryset.filter(variants__size=size_available, variants__stock__gt=0).distinct()

        return queryset


class ProductVariantViewSet(viewsets.ModelViewSet):
    """API for managing product variants like sizes S-XL for jerseys"""
    serializer_class = ProductVariantSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        queryset = ProductVariant.objects.all()
        product_id = self.kwargs.get('product_pk')
        if product_id:
            queryset = queryset.filter(product_id=product_id)
        return queryset

    def get_serializer_context(self):
        context = super().get_serializer_context()
        product_id = self.kwargs.get('product_pk')
        if product_id:
            context['product'] = Product.objects.get(id=product_id)
        return context

    def perform_create(self, serializer):
        product_id = self.kwargs.get('product_pk')
        if product_id:
            product = Product.objects.get(id=product_id)
            serializer.save(product=product)
        else:
            serializer.save()


class CartItemSerializer(serializers.Serializer):
    variant_id = serializers.PrimaryKeyRelatedField(queryset=ProductVariant.objects.all(), source='variant')
    quantity = serializers.IntegerField(min_value=1)


class GuestCheckoutView(APIView):
    """Guest checkout for fans buying gear without login"""

    permission_classes = [permissions.AllowAny]

    def post(self, request):
        cart_items_serializer = CartItemSerializer(data=request.data.get('cart_items', []), many=True)
        if not cart_items_serializer.is_valid():
            return Response(cart_items_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        # Validate stock
        for item in cart_items_serializer.validated_data:
            variant = item['variant']
            quantity = item['quantity']
            if variant.stock < quantity:
                return Response(
                    {"error": f"Insufficient stock for {variant.product.name} - {variant.size}. Available: {variant.stock}"},
                    status=status.HTTP_400_BAD_REQUEST
                )

        # Mock order ID
        order_id = f"guest-{uuid.uuid4()}"
        return Response({"order_id": order_id}, status=status.HTTP_201_CREATED)


class AuthenticatedCheckoutView(APIView):
    """Authenticated checkout with loyalty points for registered fans"""

    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        cart_items_serializer = CartItemSerializer(data=request.data.get('cart_items', []), many=True)
        if not cart_items_serializer.is_valid():
            return Response(cart_items_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        total = 0
        # Validate stock and calculate total
        for item in cart_items_serializer.validated_data:
            variant = item['variant']
            quantity = item['quantity']
            if variant.stock < quantity:
                return Response(
                    {"error": f"Insufficient stock for {variant.product.name} - {variant.size}. Available: {variant.stock}"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Use variant price override if available, otherwise use product base_price
            price = variant.price_override if variant.price_override else variant.product.base_price
            total += price * quantity

        # Calculate points: 1 point per $10
        points = int(total // 10)

        # Mock order ID
        order_id = f"auth-{uuid.uuid4()}"

        # TODO: Call /api/loyalty/award-points/ with points for request.user
        # Future webhook integration for real-time points awarding

        return Response({
            "order_id": order_id,
            "total": total,
            "points_awarded": points
        }, status=status.HTTP_201_CREATED)
