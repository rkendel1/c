from django.contrib.gis.geos import Point
from django.contrib.gis.db.models.functions import Distance

def point_from_latlon(lat, lon):
    """Create a GIS Point from (lat, lon)."""
    return Point(lon, lat, srid=4326)

def annotate_distance(queryset, location_field, user_point):
    """Annotate queryset with distance from user_point."""
    return queryset.annotate(distance=Distance(location_field, user_point)).order_by('distance')