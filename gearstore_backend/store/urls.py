"""Setup for soccer fan e-commerce with optional registration"""

from rest_framework.routers import DefaultRouter
from .views import CategoryViewSet, ProductViewSet

app_name = 'store'

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'products', ProductViewSet)

urlpatterns = router.urls
