from geoclip import GeoCLIP

from services.pakistan_geoclip import PakistanGeoCLIP


IMAGE_PATH = "test_images/loc.jpeg"


print("Loading GeoCLIP...")

model = GeoCLIP()

model.eval()

print("GeoCLIP loaded.")

pakistan_model = PakistanGeoCLIP(model)

print("Running Pakistan-only geolocation...")

predictions = pakistan_model.predict(
    IMAGE_PATH,
    top_k=10,
)

print()
print("========================================")
print("TOP PAKISTAN GEOCLIP PREDICTIONS")
print("========================================")

for prediction in predictions:

    print(
        f'{prediction["rank"]}. '
        f'Lat: {prediction["latitude"]:.6f}, '
        f'Lon: {prediction["longitude"]:.6f}, '
        f'Probability: {prediction["probability"]:.6f}'
    )

print("========================================")