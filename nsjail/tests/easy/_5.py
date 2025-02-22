def factorial(a: int) -> int:
    ret = 1
    for i in range(a, 0, -1):
        ret *= i
    return i

def get_template() -> str:
    return """
'''
Return a!
params: a: int
returns int
'''
def factorial(a: int) -> int:
    pass
"""