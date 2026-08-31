class LocationHierarchyService:

    @staticmethod
    def apply_osm_hierarchy(
        current: dict,
        osm_address: dict,
    ):
        """
        Fill/repair administrative hierarchy using
        geographic data.

        AI-extracted street/landmark wording is preserved.
        """

        province = current.get("province")
        city = current.get("city")
        town = current.get("town")
        area = current.get("area")
        street = current.get("street")

        # ----------------------------------------------------
        # Province
        # ----------------------------------------------------

        if not province:
            province = (
                osm_address.get("state")
                or osm_address.get("state_district")
            )

        # ----------------------------------------------------
        # City
        # ----------------------------------------------------

        if not city:
            city = (
                osm_address.get("city")
                or osm_address.get("municipality")
                or osm_address.get("city_district")
            )

        # ----------------------------------------------------
        # Area / locality
        # ----------------------------------------------------

        osm_area = (
            osm_address.get("suburb")
            or osm_address.get("neighbourhood")
            or osm_address.get("locality")
        )

        # ----------------------------------------------------
        # Town
        # ----------------------------------------------------

        osm_town = (
            osm_address.get("town")
            or osm_address.get("village")
        )

        # ----------------------------------------------------
        # Important:
        # Only replace AI hierarchy when OSM gives a clear
        # geographic hierarchy.
        # ----------------------------------------------------

        if osm_town:
            town = osm_town

        if osm_area:
            area = osm_area

        # ----------------------------------------------------
        # Street
        # ----------------------------------------------------

        osm_street = osm_address.get(
            "road"
        )

        if osm_street and not street:
            street = osm_street

        return {
            "province": province,
            "city": city,
            "town": town,
            "area": area,
            "street": street,
        }