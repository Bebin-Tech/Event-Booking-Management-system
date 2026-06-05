from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Booking, Payment
from events.models import Event
from users.models import User
from .serializers import BookingSerializer, PaymentSerializer

class BookingViewSet(viewsets.ModelViewSet):
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role in [User.ADMIN, User.MANAGER]:
            return Booking.objects.all().order_by('-booking_date')
        return Booking.objects.filter(user=user).order_by('-booking_date')

    def perform_create(self, serializer):
        event_id = self.request.data.get('event')
        event = Event.objects.get(id=event_id)
        quantity = int(self.request.data.get('quantity', 1))
        
        # Decrement available seats
        event.available_seats -= quantity
        event.save()
        
        serializer.save(
            user=self.request.user,
            total_price=event.price * quantity,
            status='confirmed' # For demo purposes, we confirm immediately
        )

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAuthenticated])
    def cancel_booking(self, request, pk=None):
        booking = self.get_object()
        if booking.status == 'cancelled':
            return Response({"error": "Already cancelled"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Restore seats
        event = booking.event
        event.available_seats += booking.quantity
        event.save()
        
        booking.status = 'cancelled'
        booking.save()
        return Response({"status": "Booking cancelled"})

class PaymentViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role in [User.ADMIN, User.MANAGER]:
            return Payment.objects.all()
        return Payment.objects.filter(booking__user=user)
