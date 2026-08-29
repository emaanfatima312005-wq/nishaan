from sqlalchemy import text
from sqlalchemy.orm import Session


class SpatialService:

    @staticmethod
    def find_nearby_landmarks(
        db: Session,
        latitude: float,
        longitude: float,
        radius_meters: int = 1000,
    ):
        """
        Find nearby Nishaan landmarks using PostGIS.
        """

        query = text(
            """
            SELECT
                id,
                name,
                province,
                city,
                town,
                area,
                street,
                latitude,
                longitude,
                description,

                ST_Distance(
                    location::geography,
                    ST_SetSRID(
                        ST_MakePoint(
                            :longitude,
                            :latitude
                        ),
                        4326
                    )::geography
                ) AS distance_meters

            FROM landmarks

            WHERE location IS NOT NULL

            AND ST_DWithin(
                location::geography,
                ST_SetSRID(
                    ST_MakePoint(
                        :longitude,
                        :latitude
                    ),
                    4326
                )::geography,
                :radius
            )

            ORDER BY distance_meters ASC

            LIMIT 20
            """
        )

        result = db.execute(
            query,
            {
                "latitude": latitude,
                "longitude": longitude,
                "radius": radius_meters,
            },
        )

        return result.mappings().all()