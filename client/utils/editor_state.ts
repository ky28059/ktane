export type BufferPosition = {
    x: number,
    y: number,
}

export type BufferState = {
    lines: string[],
    cursor: BufferPosition,
    // line number of start of view of buffer
    scroll_start: number,
    bg_color: BgColor,
    mode: Mode,
}

export type OpenFile = {
    filename: string,
    buffer: BufferState,
}

// Represents the current editor mode
export type Mode = string;

export enum BgColor {
    Red = "red",
    Green = "green",
    Blue = "blue",
    Purple = "purple",
    Black = "black",
}

export type EditorState = {
    open_files: OpenFile[],
    serial_number: string,
    remaining_time: number,
}