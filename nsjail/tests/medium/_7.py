def check(a: list, b: list) -> list:
    return list(set(a) & set(b))

NAME = "list_intersection"

def get_template() -> str:
    return """
'''
Returns the intersection of two lists
params: list, list
returns list
'''
def list_intersection(a: list, b: list) -> list:
    pass
"""