from django.db import models
from django.core.validators import MinValueValidator
from decimal import Decimal


class Category(models.Model):
    name = models.CharField(max_length=50)
    slug = models.SlugField(unique=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']


class Product(models.Model):
    """Product for soccer gear like adidas Predator Cleats"""

    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    base_price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(Decimal('0.01'))])
    image = models.URLField()
    team = models.CharField(max_length=50, blank=True)
    description = models.TextField()

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']


class ProductVariant(models.Model):
    """Variant for sizes like XL jerseys or 9 cleats, with per-size stock"""

    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='variants')
    size = models.CharField(max_length=50)  # e.g. 'M', '10.5', 'XL'
    stock = models.IntegerField(validators=[MinValueValidator(0)])
    price_override = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.01'))],
        null=True,
        blank=True
    )

    def __str__(self):
        return f"{self.product.name} - {self.size}"

    class Meta:
        ordering = ['size']
        unique_together = ['product', 'size']
