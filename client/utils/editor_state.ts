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

    const line = buffer_current_line(buffer);
    buffer.lines[buffer.cursor.y] = line.slice(0, buffer.cursor.x) + chars + line.slice(buffer.cursor.x);
    buffer.cursor.x += chars.length;
}

function type_newline(buffer: BufferState) {
    if (buffer.lines.length === buffer.cursor.y) {
        buffer.lines.push('');
    }

    const line = buffer_current_line(buffer);
    const line_end = line.slice(buffer.cursor.x);
    buffer.lines[buffer.cursor.y] = line.slice(0, buffer.cursor.x);

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

export function delete_char(buffer: BufferState) {
    if (buffer.lines.length === buffer.cursor.y) {
        buffer.lines.push('');
    }

    const line = buffer_current_line(buffer);
    if (line.length === buffer.cursor.x) {
        // delete newline, so concat to lines into one
        if (buffer.lines.length > buffer.cursor.y + 1) {
            buffer.lines[buffer.cursor.y] += buffer.lines[buffer.cursor.y + 1];
            buffer.lines.splice(buffer.cursor.y + 1, 1);
        }
    } else {
        // delete individual character
        buffer.lines[buffer.cursor.y] = line.slice(0, buffer.cursor.x) + line.slice(buffer.cursor.x + 1);
    }
}

export function backspace(buffer: BufferState) {
    if (buffer.cursor.x === 0 && buffer.cursor.y === 0) {
        // can't backspace at start, so that is checked first
        return;
    }

    move_cursor(buffer, -1, 0);
    delete_char(buffer);
}

// make the cursor in bounds in case it is out of bounds
export function constrain_cursor(buffer: BufferState) {
    if (buffer.cursor.y < 0) {
        buffer.cursor.y = 0;
        buffer.cursor.x = 0;
    } else if (buffer.cursor.y >= buffer.lines.length) {
        buffer.cursor.y = buffer.lines.length - 1;
        buffer.cursor.x = buffer_current_line(buffer).length;
    }

    if (buffer.cursor.x < 0) {
        buffer.cursor.y -= 1;
        buffer.cursor.x = 0;

        buffer.cursor.y = Math.max(0, buffer.cursor.y);
    } else if (buffer.cursor.x > buffer_current_line(buffer).length) {
        if (buffer.cursor.y === buffer.lines.length - 1) {
            // last line, dont wrap x to 0, just constrain it
            buffer.cursor.x === buffer_current_line(buffer).length;
        } else {
            // it is ok for cursor to equal end of line
            buffer.cursor.y += 1;
            buffer.cursor.x = 0;
        }

        buffer.cursor.y = Math.min(buffer.lines.length - 1, buffer.cursor.y);
    }
}

export function move_cursor(buffer: BufferState, x_offset: number, y_offset: number) {
    const cursor = buffer.cursor;

    cursor.y += y_offset;
    if (cursor.y >= buffer.lines.length) {
        cursor.y = buffer.lines.length - 1;
        cursor.x = buffer_current_line(buffer).length;
    } else if (cursor.y < 0) {
        cursor.y = 0;
        cursor.x = 0;
    }

    cursor.x = Math.min(cursor.x, buffer_current_line(buffer).length);

    cursor.x += x_offset;
    if (cursor.x > buffer_current_line(buffer).length) {
        if (cursor.y < buffer.lines.length - 1) {
            cursor.x = 0;
            cursor.y += 1;
        } else {
            cursor.x = buffer_current_line(buffer).length;
        }
    } else if (cursor.x < 0) {
        if (cursor.y > 0) {
            cursor.y -= 1;
            cursor.x = buffer_current_line(buffer).length;
        } else {
            cursor.x = 0;
        }
    }
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
    type_on_fallback: boolean,
}

export function get_current_file(state: EditorState): OpenFile {
    return state.open_files[state.buffer_index];
}