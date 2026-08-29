from sqlalchemy import text
from sqlalchemy.orm import Session


class CandidateService:

    @staticmethod
    def find_candidates(
        db: Session,
        latitude: float,
        longitude: float,
        radius_meters: int = 1500,
    ):
        """
        Find nearby landmarks around the geocoded candidate
        using PostGIS.
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

            LIMIT 50
            """
        )

        result = db.execute(
            query,
            {
                "longitude": longitude,
                "latitude": latitude,
                "radius": radius_meters,
            },
        )

        return result.mappings().all()