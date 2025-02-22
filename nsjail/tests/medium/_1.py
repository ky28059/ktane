def check(n: int) -> list:
    if (n <= 0):
        return []
    sequence = [0, 1]
    for _ in range(2, n):
        sequence.append(sequence[-1] + sequence[-2])
    return sequence[:n]

NAME = "first_n_fibonacci"

def get_template() -> str:
    return """
'''
Return a list of the first n fibonacci characters.
If n is less than or equal to zero return an empty list.
params: n: int
returns list
'''
def first_n_fibonacci(n: int) -> list:
    pass
"""