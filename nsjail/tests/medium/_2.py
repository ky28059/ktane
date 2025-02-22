def check(lst: int) -> list:
    if len(lst) < 2:
        return None
    unique = sorted(set(lst), reverse=True)
    return unique[1] if len(unique) > 1 else None

NAME = "second_largest_element"

def get_template() -> str:
    return """
'''
Return the second largest element in a list of ints.
Return None if not possible.
params: list
returns int
'''
def second_largest_element(a: list) -> int:
    pass
"""