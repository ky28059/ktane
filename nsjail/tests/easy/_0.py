def check(a: int, b: int) -> int:
    return a + b

NAME = "add_two_numbers"

def get_template() -> str:
    return """
'''
Add two numbers
params: a, b
returns a + b
'''
def add_two_numbers(a: int, b: int) -> int:
    pass
"""
