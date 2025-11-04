from django.core.management.base import BaseCommand
from store.models import Product


class Command(BaseCommand):
    """Update product images to use reliable Pexels CDN URLs"""

    help = "Update product images to use reliable Pexels CDN URLs"

    def handle(self, *args, **options):
        # Map product names to new image URLs
        image_updates = {
            "Nike Barcelona Jersey": "https://images.pexels.com/photos/1618200/pexels-photo-1618200.jpeg?auto=compress&cs=tinysrgb&w=600",
            "adidas Predator Cleats": "https://images.pexels.com/photos/2291004/pexels-photo-2291004.jpeg?auto=compress&cs=tinysrgb&w=600",
            "Puma Manchester City Away": "https://images.pexels.com/photos/3886235/pexels-photo-3886235.jpeg?auto=compress&cs=tinysrgb&w=600",
            "Under Armour Arsenal Authentic": "https://images.pexels.com/photos/3886244/pexels-photo-3886244.jpeg?auto=compress&cs=tinysrgb&w=600",
            "New Balance Tekela": "https://images.pexels.com/photos/2385477/pexels-photo-2385477.jpeg?auto=compress&cs=tinysrgb&w=600",
        }

        updated_count = 0
        for product_name, image_url in image_updates.items():
            try:
                product = Product.objects.get(name=product_name)
                product.image = image_url
                product.save()
                updated_count += 1
                self.stdout.write(f'Updated image for: {product_name}')
            except Product.DoesNotExist:
                self.stdout.write(self.style.WARNING(f'Product not found: {product_name}'))

        # Update any other products with Unsplash URLs
        unsplash_products = Product.objects.filter(image__contains='source.unsplash.com')
        for product in unsplash_products:
            # Use a generic soccer image for products not in our specific list
            product.image = "https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg?auto=compress&cs=tinysrgb&w=600"
            product.save()
            updated_count += 1
            self.stdout.write(f'Updated generic image for: {product.name}')

        self.stdout.write(
            self.style.SUCCESS(f'Successfully updated {updated_count} product images')
        )
