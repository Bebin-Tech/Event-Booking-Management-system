from rest_framework import viewsets, permissions, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Sum, Count
from .models import Event, Category
from bookings.models import Booking
from users.models import User
from .serializers import EventSerializer, CategorySerializer

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class EventViewSet(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'venue_details']
    ordering_fields = ['start_date', 'price']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        serializer.save(manager=self.request.user)

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def dashboard_stats(self, request):
        # Check if user is admin or manager
        is_staff = request.user.role in [User.ADMIN, User.MANAGER]
        
        if is_staff:
            stats = {
                "total_events": Event.objects.count(),
                "total_customers": User.objects.filter(role=User.CUSTOMER).count(),
                "total_bookings": Booking.objects.count(),
                "total_revenue": Booking.objects.filter(status='confirmed').aggregate(Sum('total_price'))['total_price__sum'] or 0,
                "upcoming_events": Event.objects.filter(status='upcoming').count(),
            }
        else:
            stats = {
                "total_bookings": Booking.objects.filter(user=request.user).count(),
                "upcoming_events": Event.objects.filter(bookings__user=request.user, status='upcoming').distinct().count(),
                "total_spent": Booking.objects.filter(user=request.user, status='confirmed').aggregate(Sum('total_price'))['total_price__sum'] or 0,
            }
        return Response(stats)
