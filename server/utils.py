from bson import ObjectId
import requests
import random
from enum import IntEnum, StrEnum
import string
from dataclasses import dataclass

NSJAIL_HOST = "http://nsjail:5001/"

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
    RED = "rerad"
    GREEN = "green"
    BLUE = "blue"
    PURPLE = "purple"
    BLACK = "black"

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

def generate_serial_number():
    return ''.join(random.choice(string.ascii_letters + string.digits) for _ in range(12))

def generate_bind(difficulty: Difficulty):
    num_modes = 2 * difficulty + 4

    modes = random.choices(POSSIBLE_MODES, k = num_modes)
    inital_mode = random.choice(modes)

    initial_color = random.choice(list(Color))
    serial_number = generate_serial_number()

    # TODO: actual logic of keybind generation
    bind = {
        "code": "def main()\nprint('hello world')",
        "modes": modes,
        "initial_mode": inital_mode,
        "initial_color": str(initial_color),
        "serial_number": serial_number,
        "total_time": 120 - 10 * difficulty,  # seconds
        "rules": [
            {
                "trigger": {
                    "type": "keypress",
                    "keypress": "C-KeyA",
                },
                "test": {
                    "type": "bin_op",
                    "op_type": "equals",
                    "lhs": {
                        "type": "state_value",
                        "val": "color",
                    },
                    "rhs": {
                        "type": "literal",
                        "val": "purple",
                    }
                },
                "action": {
                    "type": "type_chars",
                    "characters": "lmao u suck",
                }
            }
        ]
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
