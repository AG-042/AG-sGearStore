#!/usr/bin/env python
"""
Add stock to existing product variants
Run with: python manage.py shell < add_stock.py
"""

from store.models import ProductVariant

def add_stock():
    # Add stock to all variants (20 units each)
    variants = ProductVariant.objects.all()

    print(f"Found {variants.count()} variants")

    for variant in variants:
        old_stock = variant.stock
        variant.stock = 20  # Add 20 units to each variant
        variant.save()
        print(f"Updated {variant.product.name} - {variant.size}: {old_stock} → {variant.stock}")

    print(f"\nUpdated {variants.count()} variants with stock = 20 each")

if __name__ == "__main__":
    add_stock()
