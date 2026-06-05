from rest_framework import serializers
from .models import Event, Category

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class EventSerializer(serializers.ModelSerializer):
    category_name = serializers.ReadOnlyField(source='category.name')
    manager_name = serializers.ReadOnlyField(source='manager.username')

    class Meta:
        model = Event
        fields = '__all__'
        read_only_fields = ('available_seats', 'manager')
