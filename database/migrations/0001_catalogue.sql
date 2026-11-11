-- DAT-02: first catalogue schema. Applied only by the versioned migration runner.
-- No Contact/Newsletter/Redis tables and no changes to the public schema.
CREATE FUNCTION catalogue.valid_artwork_date(value text) RETURNS boolean
LANGUAGE plpgsql IMMUTABLE STRICT AS $$
DECLARE y integer; m integer; d integer;
BEGIN
    IF length(value) NOT IN (4, 10) OR value !~ '^[0-9]{4}(-[0-9]{2}-[0-9]{2})?$' THEN RETURN false; END IF;
    y := substring(value, 1, 4)::integer;
    IF y < 1 OR y > 9999 THEN RETURN false; END IF;
    IF length(value) = 4 THEN RETURN true; END IF;
    m := substring(value, 6, 2)::integer; d := substring(value, 9, 2)::integer;
    PERFORM make_date(y, m, d);
    RETURN true;
EXCEPTION WHEN datetime_field_overflow THEN RETURN false;
END $$;

CREATE FUNCTION catalogue.valid_alts(value jsonb) RETURNS boolean
LANGUAGE sql IMMUTABLE STRICT AS $$
    SELECT CASE WHEN jsonb_typeof(value) = 'object' THEN
        NOT EXISTS (SELECT 1 FROM jsonb_each(value) AS item WHERE jsonb_typeof(item.value) <> 'string')
    ELSE false END
$$;
CREATE FUNCTION catalogue.valid_visuals(value jsonb) RETURNS boolean
LANGUAGE sql IMMUTABLE STRICT AS $$
    SELECT jsonb_typeof(value) = 'object'
        AND (value - 'images' - 'hero' - 'atmosphere') = '{}'::jsonb
        AND NOT jsonb_path_exists(value, '$.**.alt')
        AND NOT EXISTS (
            SELECT 1 FROM jsonb_path_query(value, '$.**') AS item
            WHERE jsonb_typeof(item) = 'string' AND lower(item #>> '{}') LIKE 'data:%'
        )
$$;

CREATE TABLE catalogue.locale (
    code text PRIMARY KEY CHECK (code ~ '^[a-z]{2,8}(-[A-Za-z0-9]{1,8})*$')
);

CREATE TABLE catalogue.artwork_series (
    id text PRIMARY KEY CHECK (id <> ''),
    slug text NOT NULL UNIQUE CHECK (slug <> ''),
    title text NOT NULL CHECK (title <> ''),
    artistic_status text NOT NULL CHECK (artistic_status IN ('upcoming', 'ongoing', 'completed')),
    publication_status text NOT NULL CHECK (publication_status IN ('draft', 'published', 'archived')),
    year_start integer CHECK (year_start BETWEEN 1 AND 9999),
    year_end integer CHECK (year_end BETWEEN 1 AND 9999),
    cover_artwork_id text NOT NULL,
    -- Domain-owned responsive media/layout metadata, without translated copy.
    -- This is not a second collection model or a binary/file store.
    visuals jsonb NOT NULL CHECK (catalogue.valid_visuals(visuals)),
    CHECK (year_start IS NULL OR year_end IS NULL OR year_end >= year_start)
);

CREATE TABLE catalogue.artwork (
    id text PRIMARY KEY CHECK (id <> ''),
    slug text NOT NULL UNIQUE CHECK (slug <> ''),
    title text NOT NULL CHECK (title <> ''),
    date text NOT NULL CHECK (catalogue.valid_artwork_date(date)),
    creation_status text NOT NULL CHECK (creation_status IN ('planned', 'in-progress', 'completed')),
    authorship text NOT NULL CHECK (authorship IN ('original', 'master-copy', 'study-after')),
    context text NOT NULL CHECK (context IN ('independent', 'academic-study', 'commission')),
    medium text NOT NULL CHECK (medium IN ('oil', 'graphite', 'charcoal', 'mixed-media')),
    support text NOT NULL CHECK (support IN ('canvas', 'tonal paper Strathmore', 'tonal paper Canson', 'using white pencil', 'using color pencils', 'paper')),
    series_id text REFERENCES catalogue.artwork_series(id) DEFERRABLE INITIALLY DEFERRED,
    dimension_width numeric NOT NULL CHECK (dimension_width > 0),
    dimension_height numeric NOT NULL CHECK (dimension_height > 0),
    dimension_unit text NOT NULL CHECK (dimension_unit IN ('cm', 'in')),
    availability text NOT NULL CHECK (availability IN ('available', 'reserved', 'sold', 'unavailable')),
    price_amount numeric CHECK (price_amount >= 0),
    price_currency text CHECK (price_currency IN ('USD', 'CRC')),
    CHECK ((price_amount IS NULL) = (price_currency IS NULL))
);
ALTER TABLE catalogue.artwork_series ADD CONSTRAINT series_cover_artwork_fk
    FOREIGN KEY (cover_artwork_id) REFERENCES catalogue.artwork(id) DEFERRABLE INITIALLY DEFERRED;
CREATE INDEX artwork_series_fk_idx ON catalogue.artwork(series_id);

CREATE TABLE catalogue.category (id text PRIMARY KEY CHECK (id <> ''));
CREATE TABLE catalogue.artwork_category (
    artwork_id text NOT NULL REFERENCES catalogue.artwork(id),
    category_id text NOT NULL REFERENCES catalogue.category(id),
    -- Preserve the existing category-label sequence; not artwork gallery order.
    ordinal integer NOT NULL CHECK (ordinal >= 0),
    PRIMARY KEY (artwork_id, category_id), UNIQUE (artwork_id, ordinal)
);
CREATE INDEX artwork_category_category_idx ON catalogue.artwork_category(category_id);

CREATE TABLE catalogue.artwork_image (
    artwork_id text NOT NULL REFERENCES catalogue.artwork(id),
    role text NOT NULL CHECK (role IN ('primary', 'heroPortrait', 'heroLandscape', 'thumbnail', 'collection')),
    src text NOT NULL CHECK (src ~ '^(/[^/]|https?://)' AND src !~ '[[:space:]]'),
    width integer CHECK (width > 0), height integer CHECK (height > 0),
    PRIMARY KEY (artwork_id, role)
);

CREATE TABLE catalogue.artwork_translation (
    artwork_id text NOT NULL REFERENCES catalogue.artwork(id),
    locale text NOT NULL REFERENCES catalogue.locale(code),
    quote text, description text,
    image_alts jsonb NOT NULL CHECK (catalogue.valid_alts(image_alts)),
    PRIMARY KEY (artwork_id, locale)
);
CREATE TABLE catalogue.series_translation (
    series_id text NOT NULL REFERENCES catalogue.artwork_series(id),
    locale text NOT NULL REFERENCES catalogue.locale(code),
    description text, statement text,
    media_alts jsonb NOT NULL CHECK (catalogue.valid_alts(media_alts)),
    PRIMARY KEY (series_id, locale)
);

CREATE TABLE catalogue.artwork_recognition (
    id text PRIMARY KEY CHECK (id <> ''),
    artwork_id text NOT NULL REFERENCES catalogue.artwork(id),
    kind text NOT NULL CHECK (kind IN ('award', 'honourable-mention', 'selection')),
    title text NOT NULL, event text NOT NULL,
    -- Recognition year is independent of the artwork's variable-precision date.
    year integer NOT NULL CHECK (year BETWEEN 1 AND 9999)
);
CREATE INDEX artwork_recognition_artwork_idx ON catalogue.artwork_recognition(artwork_id);

CREATE TABLE catalogue.home_curation (
    id text PRIMARY KEY CHECK (id = 'home'),
    hero_artwork_id text NOT NULL REFERENCES catalogue.artwork(id),
    featured_artwork_id text NOT NULL REFERENCES catalogue.artwork(id),
    featured_series_id text NOT NULL REFERENCES catalogue.artwork_series(id)
);
CREATE TABLE catalogue.home_selected_artwork (
    artwork_id text PRIMARY KEY REFERENCES catalogue.artwork(id),
    -- This existing curated sequence belongs to Home, not /artworks ordering.
    ordinal integer NOT NULL UNIQUE CHECK (ordinal >= 0)
);

REVOKE ALL ON ALL TABLES IN SCHEMA catalogue FROM PUBLIC;
REVOKE ALL ON ALL FUNCTIONS IN SCHEMA catalogue FROM PUBLIC;
