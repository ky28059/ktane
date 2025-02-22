def check(n: str) -> int:
    count = 0
    while n >= 5:
        n //= 5
        count += n
    return count

NAME = "count_trailing_zeros"

def get_template() -> str:
    return """
'''
Count the number of trailing zeros in a factorial
params: a: int
returns int
'''
def count_trailing_zeros(a: int) -> int:
    pass
"""