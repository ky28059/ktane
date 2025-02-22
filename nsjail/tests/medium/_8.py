def check(lst: list, k: int) -> list:
    k = k % len(lst)
    return lst[-k:] + lst[:-k]

NAME = "rotate_list"

def get_template() -> str:
    return """
'''
Rotates a list by k positions to the right
params: list, int
returns list
'''
def rotate_list(lst: list, k: int) -> list:
    pass
"""