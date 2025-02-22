def check(s: str) -> bool:
    try:
        float(s)
        return True
    except ValueError:
        return False

NAME = "is_valid_number"

def get_template() -> str:
    return """
'''
Checks if a string is a valid number (integer or float)
params: str
returns bool
'''
def is_valid_number(s: str) -> bool:
    pass
"""