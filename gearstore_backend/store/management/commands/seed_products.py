from django.core.management.base import BaseCommand
from store.models import Category, Product, ProductVariant
import random


class Command(BaseCommand):
    """Seed soccer gear with sizes for fan fits, e.g., XL jerseys"""

    help = "Seed soccer gear with sizes for fan fits, e.g., XL jerseys"

    def handle(self, *args, **options):
        # Create category
        category, created = Category.objects.get_or_create(
            name="Soccer",
            defaults={'slug': 'soccer'}
        )
        if created:
            self.stdout.write(self.style.SUCCESS('Created category "Soccer"'))
        else:
            self.stdout.write('Category "Soccer" already exists')

        # 5 selected products with sizes
        products_data = [
            {
                "name": "Nike Barcelona Jersey",
                "base_price": 89.99,
                "team": "Barcelona",
                "description": "Official Barcelona home jersey with premium materials",
                "image": "https://images.pexels.com/photos/1618200/pexels-photo-1618200.jpeg?auto=compress&cs=tinysrgb&w=600",
                "sizes": ["S", "M", "L", "XL"],  # Jerseys: S-XL
                "size_stocks": [25, 35, 40, 20]  # Corresponding stock levels
            },
            {
                "name": "adidas Predator Cleats",
                "base_price": 129.99,
                "team": None,
                "description": "Professional cleats with advanced traction technology",
                "image": "https://images.pexels.com/photos/2291004/pexels-photo-2291004.jpeg?auto=compress&cs=tinysrgb&w=600",
                "sizes": ["8", "9", "10", "11"],  # Cleats: 8-11
                "size_stocks": [20, 30, 25, 15]
            },
            {
                "name": "Puma Manchester City Away",
                "base_price": 89.99,
                "team": "Manchester City",
                "description": "Stunning away jersey with City signature style",
                "image": "https://images.pexels.com/photos/3886235/pexels-photo-3886235.jpeg?auto=compress&cs=tinysrgb&w=600",
                "sizes": ["S", "M", "L", "XL", "XXL"],  # Jerseys: S-XXL
                "size_stocks": [20, 30, 35, 25, 15]
            },
            {
                "name": "Under Armour Arsenal Authentic",
                "base_price": 89.99,
                "team": "Arsenal",
                "description": "Authentic Arsenal jersey with club crest",
                "image": "https://images.pexels.com/photos/3886244/pexels-photo-3886244.jpeg?auto=compress&cs=tinysrgb&w=600",
                "sizes": ["S", "M", "L", "XL"],  # Jerseys: S-XL
                "size_stocks": [30, 40, 35, 25]
            },
            {
                "name": "New Balance Tekela",
                "base_price": 129.99,
                "team": None,
                "description": "Lightweight cleats for speed and agility",
                "image": "https://images.pexels.com/photos/2385477/pexels-photo-2385477.jpeg?auto=compress&cs=tinysrgb&w=600",
                "sizes": ["7", "8", "9", "10", "11"],  # Cleats: 7-11
                "size_stocks": [15, 25, 35, 30, 20]
            }
        ]

        created_products = 0
        created_variants = 0

        for product_data in products_data:
            # Create product if it doesn't exist
            product, product_created = Product.objects.get_or_create(
                name=product_data["name"],
                defaults={
                    'category': category,
                    'base_price': product_data["base_price"],
                    'image': product_data["image"],
                    'team': product_data["team"] or '',
                    'description': product_data["description"]
                }
            )

            if product_created:
                created_products += 1
                self.stdout.write(f'Created product: {product.name}')

            # Create variants for this product
            variants_to_create = []
            for size, stock in zip(product_data["sizes"], product_data["size_stocks"]):
                variant, variant_created = ProductVariant.objects.get_or_create(
                    product=product,
                    size=size,
                    defaults={'stock': stock}
                )
                if variant_created:
                    created_variants += 1
                    self.stdout.write(f'  Created variant: {size} (stock: {stock})')

        self.stdout.write(
            self.style.SUCCESS(
                f'Seeding complete: {created_products} products, {created_variants} variants created'
            )
        )
