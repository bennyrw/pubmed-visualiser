import * as Color from 'color';

/**
 * Base colour for each search slot.
 */
const BASE_COLOURS: Color[] = [
    Color.rgb(77, 148, 51),
    Color.rgb(90, 44, 116),
    Color.rgb(174, 174, 59),
    Color.rgb(164, 56, 73),
    Color.rgb(130, 196, 105),
    Color.rgb(129, 86, 153),
    Color.rgb(229, 229, 123),
    Color.rgb(217, 116, 132),
    Color.rgb(38, 100, 14),
    Color.rgb(56, 15, 78),
    Color.rgb(117, 117, 17),
    Color.rgb(111, 16, 31),
]

export const getSearchBaseColour = (searchSlot: number): Color => BASE_COLOURS[searchSlot % BASE_COLOURS.length];