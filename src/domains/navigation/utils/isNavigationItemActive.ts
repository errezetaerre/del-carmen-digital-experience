export function isNavigationItemActive(
    pathname: string,
    href: string,
) {
    if (
        href === "/about" &&
        (
            pathname === "/artist" ||
            pathname.startsWith("/artist/")
        )
    ) {
        return true;
    }

    return (
        pathname === href ||
        (
            href !== "/" &&
            pathname.startsWith(`${href}/`)
        )
    );
}