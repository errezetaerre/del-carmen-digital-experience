export function isNavigationItemActive(
    pathname: string,
    href: string,
) {
    // Home must only be active on the exact root route.
    if (href === "/") {
        return pathname === "/";
    }

    // Editorial route aliases.
    if (
        href === "/about" &&
        (pathname === "/artist" ||
            pathname.startsWith("/artist/"))
    ) {
        return true;
    }

    // ArtworkSeries belongs editorially to Collections.
    if (
        href === "/collections" &&
        (pathname === "/series" ||
            pathname.startsWith("/series/"))
    ) {
        return true;
    }

    // Standard section route.
    return (
        pathname === href ||
        pathname.startsWith(`${href}/`)
    );
}