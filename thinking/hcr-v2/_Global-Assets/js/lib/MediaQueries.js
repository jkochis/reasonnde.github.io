/**
 * Created by roel.kok on 4/22/14.
 */

define([
],
function(

) {
	var MIN_PAGE_WIDTH = 320;
	var BREAKPOINT_X_SMALL = 620;
	var BREAKPOINT_SMALL = 920;
	var BREAKPOINT_MEDIUM = 1220;
	var BREAKPOINT_X_LARGE = 1520;
	// H-H-HEADER BREAKPOINTS
	var BREAKPOINT_HEADER_DEFAULT = 1000;
	var BREAKPOINT_HEADER_WIDE = 1260;


	// Note: These are subject to change
	var MediaQueries = {
		MIN: "(max-width: " + (MIN_PAGE_WIDTH - 1) + "px)",
		X_SMALL: "(max-width: " + (BREAKPOINT_X_SMALL - 1) + "px)",
		SMALL: "(min-width: " + BREAKPOINT_X_SMALL + "px) and (max-width: " + (BREAKPOINT_SMALL - 1) + "px)",
		SMALL_AND_BELOW: "(max-width: " + (BREAKPOINT_SMALL - 1) + "px)",
		SMALL_AND_ABOVE: "(min-width: "  + BREAKPOINT_X_SMALL + "px)",
		MEDIUM: "(min-width: "  + BREAKPOINT_SMALL + "px) and (max-width: " + (BREAKPOINT_MEDIUM - 1) + "px)",
		MEDIUM_AND_BELOW: "(max-width: " + (BREAKPOINT_MEDIUM - 1) + "px)",
		MEDIUM_AND_ABOVE: "(min-width: " + BREAKPOINT_SMALL + "px)",
		LARGE_AND_ABOVE: "(min-width: " + BREAKPOINT_MEDIUM + "px)",
		X_LARGE_AND_ABOVE: "(min-width: " + BREAKPOINT_X_LARGE + "px)",
		// Header is special. Header needs special breakpoints.
		HEADER_HAMBURGER: "(max-width: " + (BREAKPOINT_HEADER_DEFAULT - 1) + "px)",
		HEADER_DEFAULT: "(min-width: " + BREAKPOINT_HEADER_DEFAULT + "px)",
		HEADER_WIDE: "(min-width: " + BREAKPOINT_HEADER_WIDE + "px)"
	}

	return MediaQueries;
});