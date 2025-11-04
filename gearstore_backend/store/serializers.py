from rest_framework import serializers
from .models import Category, Product, ProductVariant


class CategorySerializer(serializers.ModelSerializer):
    """Serialize categories for soccer gear organization"""

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug']


class ProductVariantSerializer(serializers.ModelSerializer):
    """Serialize product variants for sizes like S-XL jerseys or 7-13 cleats"""

    class Meta:
        model = ProductVariant
        fields = ['id', 'size', 'stock', 'price_override']

    def validate_stock(self, value):
        """Ensure stock is positive"""
        if value < 0:
            raise serializers.ValidationError("Stock must be positive")
        return value

    def validate(self, data):
        """Ensure size is unique per product"""
        product = self.context.get('product') or getattr(self.instance, 'product', None)
        size = data.get('size', getattr(self.instance, 'size', None))

        if product and size:
            # Check for existing variant with same product and size (excluding current instance)
            existing = ProductVariant.objects.filter(
                product=product,
                size=size
            ).exclude(id=getattr(self.instance, 'id', None))

            if existing.exists():
                raise serializers.ValidationError({
                    'size': f'Size "{size}" already exists for this product'
                })

class ProductSerializer(serializers.ModelSerializer):
    """Serialize soccer jerseys with sizes S-XL, cleats 7-13 for fan shopping"""

    category = CategorySerializer(read_only=True)
    variants = ProductVariantSerializer(many=True, read_only=True)
    stock = serializers.SerializerMethodField()

    def get_stock(self, obj):
        """Calculate total stock across all variants"""
        return sum(variant.stock for variant in obj.variants.all())

    class Meta:
        model = Product
        fields = ['id', 'name', 'base_price', 'image', 'team', 'description', 'category', 'variants', 'stock']


class CartItemSerializer(serializers.Serializer):
    variant_id = serializers.PrimaryKeyRelatedField(queryset=ProductVariant.objects.all(), source='variant')
    quantity = serializers.IntegerField(min_value=1)
