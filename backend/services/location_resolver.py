from sqlalchemy.orm import Session
from sqlalchemy import or_

from models.database import LandmarkDB


class LocationResolver:

    @staticmethod
    def find_database_matches(
        db: Session,
        province: str | None = None,
        city: str | None = None,
        town: str | None = None,
        area: str | None = None,
        street: str | None = None,
        landmarks: list[str] | None = None,
    ):
        """
        Search Nishaan's own landmark database first.
        """

        query = db.query(LandmarkDB)

        if province:
            query = query.filter(
                LandmarkDB.province.ilike(f"%{province}%")
            )

        if city:
            query = query.filter(
                LandmarkDB.city.ilike(f"%{city}%")
            )

        if town:
            query = query.filter(
                LandmarkDB.town.ilike(f"%{town}%")
            )

        if area:
            query = query.filter(
                LandmarkDB.area.ilike(f"%{area}%")
            )

        if street:
            query = query.filter(
                LandmarkDB.street.ilike(f"%{street}%")
            )

        if landmarks:
            landmark_filters = []

            for landmark in landmarks:
                landmark_filters.append(
                    LandmarkDB.name.ilike(f"%{landmark}%")
                )

                landmark_filters.append(
                    LandmarkDB.description.ilike(f"%{landmark}%")
                )

            query = query.filter(or_(*landmark_filters))

        return query.limit(10).all()