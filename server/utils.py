from bson import ObjectId
import requests
import random
from enum import IntEnum, StrEnum
import string
from dataclasses import dataclass
from typing import List
import itertools

NSJAIL_HOST = "http://host.docker.internal:5001/"

POSSIBLE_MODES = [
    "square",
    "cycloid",
    "taurus",
    "hypersphere",
    "triangle",
    "circle",
    "dodecahedron",
    "four leaf clover",
    "fractal",
    "pyramid",
    "rhombus",
    "pentagon",
    "dune",
    "canada",
]

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
SPECIAL_KEYCODES = [
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
    'Enter',
    'Backspace',
    'ShiftLeft',
    'ShiftRight',
    'Tab',
    'CapsLock',
    'Backquote',
    'Home',
    'End',
    'Insert',
    'Delete',
    'ArrowUp',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
]

ALL_KEYS = ASCII_KEYCODES + NUMBER_KEYCODES + F_KEYCODES + SPECIAL_KEYCODES

@dataclass
class Keypress:
    key: string
    ctrl: bool
    shift: bool
    alt: bool

    def to_key_string(self):
        out = ''
        if self.ctrl:
            out += 'C'
        
        if self.shift:
            out += 'S'
        
        if self.alt:
            out += 'A'
        
        return out + '-' + self.key
    
    @staticmethod
    def random_keycode():
        return random.choice(ALL_KEYS)

    @classmethod
    def random(cls):
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
            
            self.nodes[src_index].edges.append(dst_index)
            reachable_sets[src_index] = reachable_sets[src_index] | reachable_sets[dst_index]
            if len(reachable_sets[src_index]) == self.node_count():
                fully_reachable_count += 1
    
    def edge_list_index(self) -> List[int]:
        return list(itertools.chain.from_iterable(
            [(i, j) for j in node.edges] for i, node in enumerate(self.nodes)
        ))
    
    def edge_list_values(self) -> List[any]:
        return [(self.nodes[src_i].value, self.nodes[dst_i].value) for src_i, dst_i in self.edge_list_index()]

def generate_bind(difficulty: Difficulty):
    num_modes = 2 * difficulty + 4

    modes = random.sample(POSSIBLE_MODES, num_modes)
    inital_mode = random.choice(modes)

    initial_color = random.choice(list(Color))
    serial_number = generate_serial_number()

    mode_graph = Graph.with_nodes(modes)
    color_graph = Graph.with_nodes(list(Color))

    mode_graph.random_edges_fully_connected()
    color_graph.random_edges_fully_connected()

    rules = [
        {
            'trigger': {'type': 'keypress', 'keypress': '-KeyA'},
            'test': {'type': 'bin_op', 'op_type': 'equals', 'lhs': {'type': 'state_value', 'val': 'background'}, 'rhs': {'type': 'literal', 'val': 'purple'}},
            'action': {'type': 'type_chars', 'characters': 'lmao u suck'}
        },
        {
            'trigger': {'type': 'keypress', 'keypress': '-Enter'},
            'action': {'type': 'type_chars', 'characters': '\n'},
        },
        {
            'trigger': {'type': 'keypress', 'keypress': '-Delete'},
            'action': {'type': 'delete'},
        },
        {
            'trigger': {'type': 'keypress', 'keypress': '-Backspace'},
            'action': {'type': 'backspace'},
        },
        {
            'trigger': {'type': 'keypress', 'keypress': '-ArrowUp'},
            'action': {'type': 'move_cursor', 'x_offset': 0, 'y_offset': -1},
        },
        {
            'trigger': {'type': 'keypress', 'keypress': '-ArrowDown'},
            'action': {'type': 'move_cursor', 'x_offset': 0, 'y_offset': 1},
        },
        {
            'trigger': {'type': 'keypress', 'keypress': '-ArrowLeft'},
            'action': {'type': 'move_cursor', 'x_offset': -1, 'y_offset': 0},
        },
        {
            'trigger': {'type': 'keypress', 'keypress': '-ArrowRight'},
            'action': {'type': 'move_cursor', 'x_offset': 1, 'y_offset': 0},
        },
        {
            'trigger': {'type': 'keypress', 'keypress': '-Tab'},
            'action': {'type': 'type_chars', 'characters': '    '},
        },
    ]

    for src_mode, dst_mode in mode_graph.edge_list_values():
        rules.append({
            'trigger': {'type': 'keypress', 'keypress': Keypress.random().to_key_string()},
            'test': {'type': 'bin_op', 'op_type': 'equals', 'lhs': {'type': 'state_value', 'val': 'mode'}, 'rhs': {'type': 'literal', 'val': src_mode}},
            'action': {'type': 'change_mode', 'mode': dst_mode},
        })
    
    for src_color, dst_color in color_graph.edge_list_values():
        rules.append({
            'trigger': {'type': 'keypress', 'keypress': Keypress.random().to_key_string()},
            'test': {'type': 'bin_op', 'op_type': 'equals', 'lhs': {'type': 'state_value', 'val': 'background'}, 'rhs': {'type': 'literal', 'val': str(src_color)}},
            'action': {'type': 'change_bg', 'color': str(dst_color)},
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
