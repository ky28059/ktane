def check(a: int) -> int:
    ret = 1
    for i in range(a, 0, -1):
        ret *= i
    return ret

NAME = "factorial"

def get_template() -> str:
    return """
'''
Return a!, 1 if negative
params: a: int
returns int
'''
def factorial(a: int) -> int:
    pass
"""