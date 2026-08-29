from io import BytesIO

from PIL import Image, ExifTags


class ExifService:

    @staticmethod
    def _convert_to_degrees(value):
        """
        Convert EXIF GPS coordinates from degrees/minutes/seconds
        into decimal degrees.
        """

        degrees = float(value[0])
        minutes = float(value[1])
        seconds = float(value[2])

        return degrees + (
            minutes / 60.0
        ) + (
            seconds / 3600.0
        )


    @staticmethod
    def extract_gps(image_bytes: bytes):
        """
        Extract GPS coordinates from image EXIF metadata.

        Returns:
            {
                "latitude": float,
                "longitude": float
            }

        or None when GPS metadata is unavailable.
        """

        try:

            image = Image.open(
                BytesIO(image_bytes)
            )

            exif = image.getexif()

            if not exif:
                return None

            gps_ifd = exif.get_ifd(
                ExifTags.IFD.GPSInfo
            )

            if not gps_ifd:
                return None

            gps = {
                ExifTags.GPS(int(tag)): value
                for tag, value in gps_ifd.items()
                if int(tag) in ExifTags.GPS
            }

            latitude = gps.get(
                ExifTags.GPS.GPSLatitude
            )

            latitude_ref = gps.get(
                ExifTags.GPS.GPSLatitudeRef
            )

            longitude = gps.get(
                ExifTags.GPS.GPSLongitude
            )

            longitude_ref = gps.get(
                ExifTags.GPS.GPSLongitudeRef
            )

            if not all([
                latitude,
                latitude_ref,
                longitude,
                longitude_ref,
            ]):
                return None

            latitude = ExifService._convert_to_degrees(
                latitude
            )

            longitude = ExifService._convert_to_degrees(
                longitude
            )

            if str(latitude_ref).upper() == "S":
                latitude = -latitude

            if str(longitude_ref).upper() == "W":
                longitude = -longitude

            return {
                "latitude": latitude,
                "longitude": longitude,
            }

        except Exception as e:

            print(
                "EXIF GPS ERROR:",
                str(e)
            )

            return None