def check(a: int, b: int) -> int:
    return max(a, b)

NAME = "max_of_two_nums"

def get_template() -> str:
    return """
'''
Return max of a, b
params: a: int, b: int
returns int
'''
def max_of_two_nums(a: int, b: int) -> int:
    pass
"""