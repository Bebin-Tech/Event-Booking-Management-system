from rest_framework import serializers
from .models import Booking, Payment
from users.serializers import UserSerializer

class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'

class BookingSerializer(serializers.ModelSerializer):
    payment = PaymentSerializer(read_only=True)
    event_title = serializers.ReadOnlyField(source='event.title')

    class Meta:
        model = Booking
        fields = ('id', 'user', 'event', 'event_title', 'customer_name', 'customer_email', 'customer_phone', 
                  'booking_date', 'quantity', 'total_price', 'status', 'payment')
        read_only_fields = ('user', 'booking_date', 'total_price', 'status')
