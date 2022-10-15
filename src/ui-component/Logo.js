// material-ui
import { useTheme } from '@mui/material/styles';

/**
 * if you want to use image instead of <svg> uncomment following.
 *
 * import logoDark from 'assets/images/logo-dark.svg';
 * import logo from 'assets/images/logo.svg';
 *
 */

// ==============================|| LOGO SVG ||============================== //

const Logo = () => {
    const theme = useTheme();

    return (
        /**
         * if you want to use image instead of svg uncomment following, and comment out <svg> element.
         *
         * <img src={theme.palette.mode === 'dark' ? logoDark : logo} alt="Berry" width="100" />
         *
         */

        <svg
            version="1.0"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1726.000000 893.000000"
            width="92"
            height="32"
            preserveAspectRatio="xMidYMid meet"
        >
            <g transform="translate(0.000000,893.000000) scale(0.100000,-0.100000)" fill="#009688" stroke="none">
                <path
                    d="M9946 8793 c-9 -43 -1064 -5445 -1363 -6983 l-268 -1375 97 -3 c54
        -1 98 -6 98 -10 -1 -4 -7 -36 -15 -72 -8 -36 -14 -71 -15 -77 0 -10 128 -13
        608 -13 l607 0 394 2273 c217 1249 397 2276 401 2280 4 4 478 -1059 1055
        -2363 577 -1303 1051 -2370 1055 -2370 3 0 15 19 27 43 l21 42 37 -83 38 -82
        46 0 46 1 1060 2369 c583 1303 1063 2366 1066 2362 3 -4 167 -963 363 -2132
        197 -1169 360 -2135 363 -2147 5 -21 11 -23 73 -23 l68 0 12 -72 c6 -40 13
        -79 15 -85 4 -10 134 -13 610 -13 521 0 605 2 605 14 0 8 -198 1141 -439 2518
        -241 1377 -571 3255 -732 4173 -161 919 -296 1674 -299 1678 -4 4 -27 -38 -52
        -94 -32 -70 -48 -96 -51 -83 -3 11 -18 92 -34 182 -15 89 -30 162 -33 162 -3
        0 -608 -1333 -1344 -2962 -736 -1630 -1341 -2967 -1345 -2971 -4 -4 -590 1293
        -1302 2883 -712 1589 -1297 2890 -1301 2890 -3 0 -9 -22 -13 -48 -3 -26 -10
        -53 -13 -60 -4 -6 -35 52 -71 133 -35 80 -65 145 -67 145 -1 0 -5 -12 -8 -27z"
                />
                <path
                    d="M2335 5479 c-221 -23 -491 -111 -655 -214 -59 -37 -157 -110 -197
        -149 l-33 -30 0 56 0 57 -72 -1 c-40 0 -79 0 -85 1 -9 1 -13 24 -13 81 l0 80
        -585 0 -585 0 0 -2465 0 -2465 80 0 80 0 0 -85 0 -85 590 0 590 0 0 1404 c0
        1469 4 1614 46 1843 60 333 251 597 519 719 184 84 456 86 620 4 126 -63 196
        -234 246 -600 9 -60 13 -539 16 -1642 l4 -1558 80 0 79 0 0 -85 0 -85 590 0
        590 0 0 1418 c0 1458 2 1545 41 1812 20 135 83 302 161 426 40 63 167 192 230
        236 140 94 281 138 447 138 175 0 313 -40 372 -108 71 -80 128 -237 163 -445
        30 -175 35 -451 36 -1889 l0 -1418 80 0 80 0 0 -85 0 -85 586 2 586 3 5 1452
        c6 2003 0 2124 -122 2489 -123 366 -205 494 -496 780 -139 135 -206 190 -322
        263 -277 172 -676 264 -1012 231 -248 -23 -528 -95 -724 -186 -170 -78 -410
        -274 -525 -426 l-49 -65 -151 154 c-200 205 -308 289 -482 376 -247 124 -529
        175 -809 146z"
                />
            </g>
        </svg>
    );
};

export default Logo;
