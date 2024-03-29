import googlemaps
import json
import geopy
import time
from geopy.geocoders import Nominatim
import math



api_key = 'AIzaSyC9lZ1X8kG2xjqw_1f9QU7dMLqeBUjW3kA'#get key from github secrets
gmaps = googlemaps.Client(key=api_key)

# Specify the location (Chicago) and the type of place (grocery_store)
#Southeastern most corner of Chicago, subtract 
latitude = 41.64501235143132
longitude = -87.52476251009567
location = (latitude, longitude)

place_type = 'grocery_or_supermarket'

# Perform a Places API request to get grocery store locations

def get_places_in_grid(gmaps, location, radius, place_type):
    results = gmaps.places_nearby(location=location, radius=2000, type=place_type)
    grocery_stores = []
    while results.get('results'):
        for place in results['results']:
            store_info = {
                'name': place['name'],
                'address': place['vicinity'],
                'latitude': place['geometry']['location']['lat'],
                'longitude': place['geometry']['location']['lng']
            }
            grocery_stores.append(store_info)

        # Check if there are more results to fetch
        if 'next_page_token' in results:
            next_page_token = results['next_page_token']
            time.sleep(2)
            results = gmaps.places_nearby(location=f"{latitude},{longitude}", radius=2000, type=place_type, page_token=next_page_token)
        else:
            break
    return grocery_stores
    

ns_size = 10  # Number of rows and columns in the grid
ew_size = 7
radius_per_cell = 2000  # Radius for each grid cell in meters

# Perform Places API requests for each grid cell
all_grocery_stores = []
for i in range(ns_size):
    for j in range(ew_size):
        # Calculate the coordinates of the current grid cell
        cell_latitude = latitude  + i * (2 * radius_per_cell / 111000)  # 1 degree of latitude is approximately 111,000 meters
        cell_longitude = longitude -  j * (2 * radius_per_cell / (111000.0 * abs(math.cos(math.radians(cell_latitude)))))

        # Form the location string for the Places API request
        cell_location = f"{cell_latitude},{cell_longitude}"

        # Get grocery stores for the current grid cell
        grocery_stores_in_cell = get_places_in_grid(gmaps, location=cell_location, radius=radius_per_cell, place_type='grocery_or_supermarket')

        all_grocery_stores.extend(grocery_stores_in_cell)
    print(f"cell latitude: {cell_latitude}")

# Save the data as a .json file
with open('grocery_stores_chicago3.json', 'w') as json_file:
    json.dump(all_grocery_stores, json_file, indent=2)


