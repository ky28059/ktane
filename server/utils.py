from bson import ObjectId
import requests

def generate_bind():
    # TODO: actual logic of keybind generation
    bind = {
        "code": "def main()\nprint('hello world')",
        "modes": ["square", "cycloid", "taurus"],
        "initial_mode": "square",
        "initial_color": "purple",
        "serial_number": "27ha20vla",
        "total_time": 300,  # seconds
        "rules": [
            {
                "trigger": {
                    "type": "keypress",
                    "keypress": "a",
                },
                "rule": {
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
    # TODO: Send code and test case to nsjail server
    pass