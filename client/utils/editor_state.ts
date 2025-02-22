import { Rulebook } from "./rules";

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

function buffer_current_line(buffer: BufferState) {
    return buffer.lines[buffer.cursor.y];
}

function type_chars_no_newline(buffer: BufferState, chars: string) {
    if (buffer.lines.length === buffer.cursor.y) {
        buffer.lines.push('');
    }

    const line = buffer.lines[buffer.cursor.y];
    buffer.lines[buffer.cursor.y] = line.slice(0, buffer.cursor.x) + chars + line.slice(buffer.cursor.x);
    buffer.cursor.x += chars.length;
}

function type_newline(buffer: BufferState) {
    if (buffer.lines.length === buffer.cursor.y) {
        buffer.lines.push('');
    }

    const line = buffer.lines[buffer.cursor.y];
    const line_end = line.slice(buffer.cursor.y);
    buffer.lines[buffer.cursor.y] = line.slice(0, buffer.cursor.y);

    buffer.cursor.x = 0;
    buffer.cursor.y += 1;

    buffer.lines.splice(buffer.cursor.y, 0, line_end);
}

export function type_chars(buffer: BufferState, chars: string) {
    const parts = chars.split('\n');

    for (let i = 0; i < parts.length; i++) {
        if (i != 0) {
            type_newline(buffer);
        }

        type_chars_no_newline(buffer, parts[i]);
    }
}

// make the cursor in bounds in case it is out of bounds
export function constrain_cursor(buffer: BufferState) {
    if (buffer.cursor.x < 0) {
        buffer.cursor.y -= 1;
        buffer.cursor.x = 0;
    } else if (buffer.cursor.x >= buffer_current_line(buffer).length) {
        buffer.cursor.y += 1;
        buffer.cursor.x = 0;
    }
    
    buffer.cursor.y = Math.min(Math.max(0, buffer.cursor.y), buffer.lines.length);
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
    buffer_index: number,
    serial_number: string,
    remaining_time: number,
    rulebook: Rulebook,
}

export function get_current_file(state: EditorState): OpenFile {
    return state.open_files[state.buffer_index];
}