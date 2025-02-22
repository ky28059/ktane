def check(a: int, b: int) -> int:
    return a - b

NAME = "sub_two_numbers"

def get_template() -> str:
    return """
'''
Subtract two numbers
params: a, b
returns a - b
'''
def sub_two_numbers(a: int, b: int) -> int:
    pass
"""