from bson import ObjectId
import requests
import random
from enum import IntEnum, StrEnum
import string
from dataclasses import dataclass
from typing import List
import itertools

NSJAIL_HOST = "http://host.docker.internal:5001/"

# POSSIBLE_MODES = [
#     "square",
#     "cycloid",
#     "taurus",
#     "hypersphere",
#     "triangle",
#     "circle",
#     "dodecahedron",
#     "four leaf clover",
#     "fractal",
#     "pyramid",
#     "rhombus",
#     "pentagon",
#     "dune",
#     "canada",
# ]

class Modes(StrEnum):
    CAPITAL = "capital mode"
    VOWEL_MODE = "vowel mode"
    INSERT_MODE = "insert mode"
    # all navigation keys are random
    NAVIGATION = "navigation mode"

def mode_allows_typing(mode: Modes) -> bool:
    return mode == Modes.CAPITAL or mode == Modes.INSERT_MODE

class Difficulty(IntEnum):
    EASY = 0
    MEDIUM = 1
    HARD = 2

class Color(StrEnum):
    RED = "red"
    GREEN = "green"
    BLUE = "blue"
    PURPLE = "purple"
    BLACK = "black"

ASCII_KEYCODES = [f'Key{l}' for l in string.ascii_uppercase]
NUMBER_KEYCODES = [f'Digit{i}' for i in range(9)]
F_KEYCODES = [f'F{i}' for i in range(1, 13)]

SPECIAL_KEYCODES_TYPABLE = [
    'Minus',
    'Equal',
    'BracketLeft',
    'BracketRight',
    'Backslash',
    'Semicolon',
    'Quote',
    'Comma',
    'Period',
    'Slash',
    'Space',
    'Backquote',
    'Tab',
    'Enter',
]

SPECIAL_KEYCODES_UNTYPABLE = [
    'Backspace',
    'ShiftLeft',
    'ShiftRight',
    'CapsLock',
    'Home',
    'End',
    'Insert',
    'Delete',
    'ArrowUp',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
]

SPECIAL_KEYCODES = SPECIAL_KEYCODES_TYPABLE + SPECIAL_KEYCODES_UNTYPABLE
TYPABLE_KEYS = ASCII_KEYCODES + NUMBER_KEYCODES + SPECIAL_KEYCODES_TYPABLE

ALL_KEYS = ASCII_KEYCODES + NUMBER_KEYCODES + F_KEYCODES + SPECIAL_KEYCODES

class KeyTaker:
    def __init__(self, input):
        self.keys = [Keypress(key = key) for key in input]
        random.shuffle(self.keys)
    
    def take_proportion(self, proportion):
        take_amount = int(len(self.keys) * proportion)
        return self.take(take_amount)
    
    def take(self, take_amount):
        end = self.keys[len(self.keys) - take_amount:]
        del self.keys[len(self.keys) - take_amount]
        return end

@dataclass
class Keypress:
    key: string
    ctrl: bool = False
    shift: bool = False
    alt: bool = False

    def to_key_string(self):
        out = ''
        if self.ctrl:
            out += 'C'
        
        if self.shift:
            out += 'S'
        
        if self.alt:
            out += 'A'
        
        return out + '-' + self.key

    def to_trigger(self):
        return {
            'type': 'keypress',
            'keypress': self.to_key_string(),
        }
    
    @staticmethod
    def random_keycode():
        return random.choice(ALL_KEYS)

    @classmethod
    def random(cls, modifier = False):
        if modifier:
            ctrl, shift, alt = random.choice([
                (True, False, False),
                (False, True, False),
                (False, False, True),
                (True, True, False),
                (True, False, True),
                (False, True, True),
                (True, True, True),
            ])
            return cls(
                key = cls.random_keycode(),
                ctrl = ctrl,
                shift = shift,
                alt = alt,
            )
        else:
            return cls(
                key = cls.random_keycode(),
                ctrl = random.choice([True, False]),
                shift = random.choice([True, False]),
                alt = random.choice([True, False]),
            )


def generate_serial_number():
    return ''.join(random.choice(string.ascii_letters + string.digits) for _ in range(12))

@dataclass
class GraphNode:
    value: any
    edges: List[int]

    def has_edge_to(self, dst_index):
        return dst_index in self.edges

@dataclass
class Graph:
    nodes: List[GraphNode]

    @classmethod
    def with_nodes(cls, input: List[any]):
        return cls([GraphNode(value = a, edges = []) for a in input])

    def node_count(self):
        return len(self.nodes)
    
    def random_node_index(self):
        return random.randrange(0, self.node_count())
    
    def has_edge(self, edge):
        src_i, dst_i = edge
        return self.nodes[src_i].has_edge_to(dst_i)

    # generates random edges until every node is reachable from every other node
    def random_edges_fully_connected(self):
        reachable_sets = [set([i]) for i in range(self.node_count())]
        fully_reachable_count = 0

        while fully_reachable_count < self.node_count():
            src_index = self.random_node_index()
            dst_index = self.random_node_index()

            # ensure src and dst are distinct
            while src_index == dst_index:
                dst_index = self.random_node_index()
            
            if self.has_edge((src_index, dst_index)):
                # no duplicates
                continue
            
            # a bit sub optimal n^2 algo prob but good enough
            self.nodes[src_index].edges.append(dst_index)

            for i in range(len(reachable_sets)):
                if src_index in reachable_sets[i]:
                    new_set = reachable_sets[i] | reachable_sets[dst_index]
                    if len(reachable_sets[i]) < self.node_count() and len(new_set) == self.node_count():
                        fully_reachable_count += 1
                    
                    reachable_sets[i] = new_set
    
    def edge_list_index(self) -> List[int]:
        return list(itertools.chain.from_iterable(
            [(i, j) for j in node.edges] for i, node in enumerate(self.nodes)
        ))
    
    def edge_list_values(self) -> List[any]:
        return [(self.nodes[src_i].value, self.nodes[dst_i].value) for src_i, dst_i in self.edge_list_index()]

def mode_enter_trigger(mode):
    return {
        'type': 'enter_mode',
        'mode': str(mode),
    }

def bin_op(op_type, lhs, rhs):
    return {
        'type': 'bin_op',
        'op_type': op_type,
        'lhs': lhs,
        'rhs': rhs,
    }

def state_val(value):
    return {
        'type': 'state_value',
        'val': value,
    }

def literal(value):
    return {
        'type': 'literal',
        'val': value,
    }

def generate_bind(difficulty: Difficulty):
    num_modes = 2 * difficulty + 4

    modes = [str(mode) for mode in list(Modes)]
    inital_mode = random.choice(modes)

    initial_color = random.choice(list(Color))
    serial_number = generate_serial_number()

    mode_graph = Graph.with_nodes(modes)
    color_graph = Graph.with_nodes(list(Color))

    mode_graph.random_edges_fully_connected()
    color_graph.random_edges_fully_connected()

    rules = [
        # {
        #     'trigger': {'type': 'keypress', 'keypress': '-KeyA'},
        #     'test': {'type': 'bin_op', 'op_type': 'equals', 'lhs': {'type': 'state_value', 'val': 'background'}, 'rhs': {'type': 'literal', 'val': 'purple'}},
        #     'action': {'type': 'type_chars', 'characters': 'lmao u suck'}
        # },
        {
            'trigger': {'type': 'keypress', 'keypress': '-Enter'},
            'action': {'type': 'type_chars', 'characters': '\n'},
        },
        # {
        #     'trigger': {'type': 'keypress', 'keypress': '-Delete'},
        #     'action': {'type': 'delete'},
        # },
        # {
        #     'trigger': {'type': 'keypress', 'keypress': '-Backspace'},
        #     'action': {'type': 'backspace'},
        # },
        # {
        #     'trigger': {'type': 'keypress', 'keypress': '-ArrowUp'},
        #     'action': {'type': 'move_cursor', 'x_offset': 0, 'y_offset': -1},
        # },
        # {
        #     'trigger': {'type': 'keypress', 'keypress': '-ArrowDown'},
        #     'action': {'type': 'move_cursor', 'x_offset': 0, 'y_offset': 1},
        # },
        # {
        #     'trigger': {'type': 'keypress', 'keypress': '-ArrowLeft'},
        #     'action': {'type': 'move_cursor', 'x_offset': -1, 'y_offset': 0},
        # },
        # {
        #     'trigger': {'type': 'keypress', 'keypress': '-ArrowRight'},
        #     'action': {'type': 'move_cursor', 'x_offset': 1, 'y_offset': 0},
        # },
        {
            'trigger': {'type': 'keypress', 'keypress': '-Tab'},
            'action': {'type': 'type_chars', 'characters': '    '},
        },
    ]

    # mode keybinds
    for src_mode, dst_mode in mode_graph.edge_list_values():
        rules.append({
            'trigger': Keypress.random().to_trigger(),
            'test': bin_op('equals', state_val('mode'), literal(src_mode)),
            'action': {'type': 'change_mode', 'mode': dst_mode},
        })
    
    # color keybinds
    for src_color, dst_color in color_graph.edge_list_values():
        rules.append({
            'trigger': Keypress.random().to_trigger(),
            'test': bin_op('equals', state_val('background'), literal(src_color)),
            'action': {'type': 'change_bg', 'color': str(dst_color)},
        })

    # keys that delete based on position
    for keypress in KeyTaker(TYPABLE_KEYS).take_proportion(0.1 + 0.03 * difficulty):
        if random.choice([True, False]):
            pos_source = 'line_num'
        else:
            pos_source = 'column_num'
        
        mod_val = random.randrange(2, 8)

        rules.append({
            'trigger': keypress.to_trigger(),
            'test': bin_op('equals', bin_op('mod', state_val(pos_source), literal(mod_val)), literal(random.randrange(0, 20) % mod_val)),
            'action': {'type': 'delete'},
        })
    
    # vowel mode
    for i, keypress in enumerate(KeyTaker(TYPABLE_KEYS).take(15)):
        n = i % 5
        match i % 5:
            case 0:
                letter = 'a'
            case 1:
                letter = 'e'
            case 2:
                letter = 'i'
            case 3:
                letter = 'o'
            case 4:
                letter = 'u'
        
        if i >= 10:
            letter = letter.upper()
        
        rules.append({
            'trigger': keypress.to_trigger(),
            'test': bin_op('equals', state_val('mode'), literal(str(Modes.VOWEL_MODE))),
            'action': {
                'type': 'type_chars',
                'characters': letter,
            },
        })
    
    # ban vowels in insert mode
    for letter in 'aeiou':
        rules.append({
            'trigger': Keypress(key = letter).to_trigger(),
            'test': bin_op('not_equals', state_val('mode'), literal(str(Modes.VOWEL_MODE))),
            'action': {
                'type': 'do_nothing',
            },
        })
    
    # navigation keys in navigation mode
    for keypress in KeyTaker(ALL_KEYS).take(12):
        rules.append({
            'trigger': keypress.to_trigger(),
            'test': bin_op('equals', state_val('mode'), literal(str(Modes.NAVIGATION))),
            'action': {
                'type': 'move_cursor',
                'x_offset': random.randint(-10, 10),
                'y_offset': random.randint(-10, 10),
            },
        })
    
    for mode in list(Modes):
        rules.append({
            'trigger': mode_enter_trigger(mode),
            'action': {
                'type': 'set_fallback',
                'type_char': mode_allows_typing(mode),
            },
        })

    # TODO: actual logic of keybind generation
    bind = {
        'code': "def main():\n    print('hello world')",
        'modes': modes,
        'initial_mode': inital_mode,
        'initial_color': initial_color,
        'serial_number': serial_number,
        'total_time': 110,
        'rules': rules,
    }

    return bind


# Helper function to convert ObjectId to string
def serialize_document(doc):
    """Recursively convert MongoDB documents to JSON-serializable format."""
    if isinstance(doc, dict):
        return {k: serialize_document(v) for k, v in doc.items()}
    elif isinstance(doc, list):
        return [serialize_document(v) for v in doc]
    elif isinstance(doc, ObjectId):
        return str(doc)
    return doc

def submit_testcase(data: dict):
    r = requests.post(NSJAIL_HOST + "run", json=data)
    if r.status_code != 200:
        return {"cooked": True}
    return r.json()

def grab_test_data(diff, num=5):
    diffmap = ['easy', 'medium', 'hard']
    diffString = diffmap[diff]
    r = requests.post(NSJAIL_HOST + "gen", json={
        "difficulty": diffString,
        "num": num
    })
    
    if r.status_code != 200:
        return {"cooked": True}
    result = r.json() # No error handling 
    return result

if __name__ == '__main__':
    print(generate_bind(Difficulty.MEDIUM))
